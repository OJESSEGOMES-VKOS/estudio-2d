import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender, getStaticFiles, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import PB from './palavras.json';
import ROSTO_T from './rosto.json';
import CARDS from './cards.json'; // ../../tools/cards.py: quadros dos vídeos do próprio usuário para a colagem e os celulares

/**
 * Vitrine no superpodcast01 (../../modelos/superpodcast01/superpodcast01.md).
 * Primeira aplicação do modelo: não há código aprovado. Do storypodcast01 da vitrine veio só o encanamento
 * (index, Root, carregamento de palavras/rosto, medida de fonte por canvas, scripts). O visual sai do superpodcast01.md:
 * quatro mundos (palco, rosto, papel, arquivo) + tela dividida, Playfair Display Black Italic vermelha letra por
 * letra, Inter SemiBold pequena, JetBrains Mono no terço inferior, vazamento de luz na troca de bloco.
 * Plano frase a frase em ../plano.md.
 */
export const FPS = 30;
const W = 1080;
const H = 1920;

const pf = loadPlayfair('italic', {weights: ['900'], subsets: ['latin', 'latin-ext']});
const it = loadInter('normal', {weights: ['400', '600', '700'], subsets: ['latin', 'latin-ext']});
const mo = loadMono('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const SERIF = pf.fontFamily;
const SANS = it.fontFamily;
const MONO = mo.fontFamily;

/* identidade "Palco Escuro" (superpodcast01.md §11) */
const COR = {
	breu: '#0A0C0C',
	chao: '#19191E',
	estudio: '#131A1E',
	branco: '#FBFAFB',
	sinal: '#E0030A',
	papel: '#EFEAE7',
	papelBorda: '#7E7C7A',
	tinta: '#0B0A0F',
	petroleo: '#09222F',
	vaz: ['#BD2027', '#FDD48B', '#FEE87B', '#FFFFFF'],
};
const FS = 66; // pequena: corpo ~3,4% H (superpodcast01.md §4: 3,2–3,8% H)
const KW_MAX = 220; // corpo máximo da palavra-chave (~11,5% H)
const KW_ALVO = 0.74; // largura-alvo da palavra-chave (60–83% W)
const HALO_V = `0 0 6px rgba(224,3,10,0.85), 0 0 26px rgba(224,3,10,0.55), 0 0 70px rgba(224,3,10,0.45)`;
const HALO_B = `0 0 3px rgba(255,255,255,0.55), 0 0 14px rgba(255,255,255,0.28)`;
const HALO_P = `0 0 6px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.7)`; // texto escuro no papel: brilho claro

const E = {out: Easing.bezier(0.16, 1, 0.3, 1), io: Easing.bezier(0.45, 0, 0.55, 1)};
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const fr = (s: number) => Math.round(s * FPS);

/* nome e @ do terço inferior (vazio esconde o terço) */
export type Props = {previas: boolean; nomesPrevias: [string, string]; nome?: string; arroba?: string};

type Pal = {texto: string; de: number; ate: number};
const PS: Pal[] = (PB as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));
if (!PS.length) throw new Error('src/palavras.json está vazio: rode tools/novo-video.py (ou tools/preparar.py) na gravação.');
/* a última tela segura FOLGA s depois da última palavra (na vitrine: "agora." acaba em 29,63 -> 30,16) */
const FOLGA = 0.53;
export const DURACAO = Number((PS[PS.length - 1].ate + FOLGA).toFixed(2));
const rg = (a: number, b: number) => Array.from({length: b - a + 1}, (_, k) => a + k);
/** plano que não bate com a fala: para ao carregar e diz em português qual lista refazer (nada de TypeError) */
const errPlano = (lista: string, oque: string) =>
	new Error(`O plano de src/Reel.tsx não bate com a fala de src/palavras.json (${PS.length} palavras, de 0 a ${PS.length - 1}, até ${DURACAO} s). Na lista ${lista}: ${oque}. Refaça o plano para a fala nova (modelos/superpodcast01/superpodcast01.md, "Como fazer um vídeo novo").`);
const de = (i: number, lista: string) => {
	if (!PS[i]) throw errPlano(lista, `a palavra nº ${i} não existe`);
	return PS[i].de;
};

/* ================================================================ O PLANO (preso à fala; num vídeo novo, refazer PLANOS,
 * VAZAMENTOS, blocos e TERCOS, e os vazamentos de scripts/trilha.py). Os ids são índices de src/palavras.json. */
/* ---------------------------------------------------------------- planos (a lista de cortes vem primeiro)
 * mundo: rosto (a gravação), papel (fundo claro; papel.tipo põe a colagem, os celulares ou os prints dos cards),
 * palco (img palco.png ou o palco desenhado), arquivo (img = B-roll do usuário ou gerado; sem img, a própria gravação em
 * tom de arquivo), dividida (palco em cima, rosto embaixo: a janela das prévias). */
type Mundo = 'palco' | 'rosto' | 'papel' | 'arquivo' | 'dividida';
type Quadro = {s: number; ox: number; oy: number}; // escala e onde o centro do rosto cai na tela
type PapelDef = {tipo: 'colagem'; entra: number; foco: number} | {tipo: 'celulares'; explode: number} | {tipo: 'prints'};
type Plano = {id: string; de: number; ate: number; mundo: Mundo; q?: Quadro; img?: string; papel?: PapelDef};
const PLANOS: Plano[] = [
	{id: 'P1', de: 0, ate: 3.02, mundo: 'palco'},
	{id: 'P2', de: 3.02, ate: 5.18, mundo: 'rosto', q: {s: 1.1, ox: 0.55, oy: 0.33}},
	{id: 'P3', de: 5.18, ate: 8.04, mundo: 'papel', papel: {tipo: 'colagem', entra: 18, foco: 22}}, // fotos a partir de "vários", câmera no "criei"
	{id: 'P4', de: 8.04, ate: 9.52, mundo: 'arquivo', img: 'broll_edicao.png'},
	{id: 'P5', de: 9.52, ate: 10.64, mundo: 'rosto', q: {s: 1.32, ox: 0.53, oy: 0.31}},
	{id: 'P6', de: 10.64, ate: 12.58, mundo: 'papel', papel: {tipo: 'celulares', explode: 39}}, // explode no "Instagram"
	{id: 'P7', de: 12.58, ate: 14.5, mundo: 'rosto', q: {s: 1.18, ox: 0.58, oy: 0.3}},
	{id: 'P8', de: 14.5, ate: 19.99, mundo: 'dividida'},
	{id: 'P9', de: 19.99, ate: 21.85, mundo: 'rosto', q: {s: 1.1, ox: 0.45, oy: 0.33}},
	{id: 'P10', de: 21.85, ate: 23.95, mundo: 'papel', papel: {tipo: 'prints'}},
	{id: 'P11', de: 23.95, ate: 25.47, mundo: 'palco'},
	{id: 'P12', de: 25.47, ate: 26.69, mundo: 'arquivo', img: 'broll_celular.png'},
	{id: 'P13', de: 26.69, ate: DURACAO, mundo: 'rosto', q: {s: 1.1, ox: 0.55, oy: 0.31}},
];
export const CORTES = PLANOS.slice(1).map((p) => p.de);
const planoEm = (t: number) => PLANOS.find((p) => t >= p.de && t < p.ate) ?? PLANOS[PLANOS.length - 1];
const VAZAMENTOS = [0.0, 19.99]; // abertura (ref2 0,0) e virada para a conclusão (ref1 25,1); [] desliga
/* a janela das prévias é o plano 'dividida' (sem ele, previas: true não faz nada) */
const P_DIV = PLANOS.find((p) => p.mundo === 'dividida');
export const JANELA_PREVIAS = P_DIV ? {de: P_DIV.de, ate: P_DIV.ate} : null;
const DIV = (prev: boolean) => Math.round(H * (prev ? 0.4 : 0.33)); // divisa da tela dividida (ref2: 31% H)

/* rosto mediano no trecho (src/rosto.json: [t, cx, cy, h]) */
const ROSTO = ROSTO_T as number[][];
const rostoMed = (a: number, b: number) => {
	const sel = ROSTO.filter((r) => r[0] >= a && r[0] <= b);
	const med = (k: number) => {
		const v = sel.map((r) => r[k]).sort((x, y) => x - y);
		return v.length ? v[Math.floor(v.length / 2)] : [0, 0.5, 0.35, 0.28][k];
	};
	return {cx: med(1), cy: med(2), h: med(3)};
};

/* ---------------------------------------------------------------- medida de fonte (canvas, com as fontes carregadas) */
let ctx: CanvasRenderingContext2D | null = null;
const mede = (txt: string, font: string) => {
	ctx ??= document.createElement('canvas').getContext('2d')!;
	ctx.font = font;
	return ctx.measureText(txt).width;
};
const fSerif = (px: number) => `italic 900 ${px}px ${SERIF}`;
const fSans = (px: number, w = 600) => `${w} ${px}px ${SANS}`;
const kwTam = (txt: string, alvo = KW_ALVO, max = KW_MAX) => {
	const w100 = mede(txt, fSerif(100));
	const px = Math.min(max, (alvo * W * 100) / w100);
	return {px, w: (w100 * px) / 100};
};

/* ---------------------------------------------------------------- texto */
type Tema = 'escuro' | 'papel';
type Linha =
	| {tipo: 'p'; ids: number[]; y: number; al: 'kwL' | 'kwR' | 'c'; cor?: string; caixa?: number | number[]} // caixa: a palavra (índice) ou as palavras vizinhas ([6, 7], "Claude Code") que vão numa caixa branca só
	| {tipo: 'k'; id: number; id2?: number; y: number; cor: string; alvo?: number; max?: number; texto?: string};
/** as palavras da caixa branca de uma linha pequena (nenhuma, uma ou várias vizinhas) */
const caixaDe = (l: Linha): number[] => (l.tipo === 'p' && l.caixa !== undefined ? (Array.isArray(l.caixa) ? l.caixa : [l.caixa]) : []);
/* aceito: bloco aprovado abaixo da régua de leitura ou com texto sobre o rosto (a tela dividida da vitrine); o conferidor
 * só avisa. Num vídeo novo, não use */
type Bloco = {de: number; ate: number; tema: Tema; linhas: Linha[]; clipTop?: number; aceito?: string};

/* quando cada palavra aparece: no instante dito, nunca antes do plano (superpodcast01.md §5.3; regra da casa t >= t0) */
const aparece = (id: number, bloco: Bloco) => Math.max(PS[id].de, bloco.de);

const PalavraP: React.FC<{txt: string; t: number; t0: number; cor: string; halo: string; caixa?: boolean; pad?: string; fs: number}> = ({txt, t, t0, cor, halo, caixa, pad, fs}) => {
	const e = tw(t, t0, t0 + 0.15, 0, 1, E.io); // fade com desfoque de ~5 quadros (ref1)
	const base: React.CSSProperties = {display: 'inline-block', opacity: e, filter: e < 1 ? `blur(${(1 - e) * 10}px)` : undefined};
	if (caixa)
		return (
			<span style={{...base, background: COR.branco, color: COR.tinta, fontWeight: 700, padding: pad ?? `0 ${fs * 0.2}px`, lineHeight: 1.12, boxShadow: '0 0 18px rgba(255,255,255,0.35)', letterSpacing: '-0.02em'}}>
				{txt}
			</span>
		);
	return <span style={{...base, color: cor, textShadow: halo}}>{txt}</span>;
};

/* palavra-chave: letra por letra, da esquerda para a direita, cada uma do borrão vermelho para nítida em 3 quadros */
const PalavraK: React.FC<{txt: string; t: number; t0: number; t1?: number; cor: string; px: number}> = ({txt, t, t0, t1, cor, px}) => {
	const letras = Array.from(txt);
	const dur = Math.min(0.47, Math.max(0.33, letras.length * 0.035));
	const passo = letras.length > 1 ? (dur - 0.1) / (letras.length - 1) : 0;
	const vermelho = cor === COR.sinal;
	return (
		<span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 900, fontSize: px, lineHeight: 1, whiteSpace: 'pre'}}>
			{letras.map((l, i) => {
				const sp = txt.indexOf(' '); // 2ª palavra ("três vezes."): as letras dela nascem quando ela é dita
				const a = t1 !== undefined && sp >= 0 && i > sp ? t1 + (i - sp - 1) * passo : t0 + i * passo;
				const e = tw(t, a, a + 0.1, 0, 1, E.io);
				const halo = vermelho ? HALO_V : cor === COR.tinta ? HALO_P : HALO_B;
				return (
					<span key={i} style={{display: 'inline-block', color: e < 1 && !vermelho ? COR.sinal : cor, opacity: e, filter: e < 1 ? `blur(${(1 - e) * 16}px)` : undefined, textShadow: halo}}>
						{l}
					</span>
				);
			})}
		</span>
	);
};

const BlocoView: React.FC<{b: Bloco; t: number}> = ({b, t}) => {
	if (t < b.de || t >= b.ate) return null;
	const kw = b.linhas.find((l) => l.tipo === 'k') as Extract<Linha, {tipo: 'k'}> | undefined;
	const kt = kw ? kwTam(kw.texto ?? PS[kw.id].texto, kw.alvo, kw.max) : {px: 0, w: 0.7 * W};
	const kL = (W - kt.w) / 2;
	const kR = kL + kt.w;
	const corP = b.tema === 'papel' ? COR.tinta : COR.branco;
	const haloP = b.tema === 'papel' ? HALO_P : HALO_B;
	return (
		<AbsoluteFill style={{clipPath: b.clipTop ? `inset(${b.clipTop}px 0 0 0)` : undefined}}>
			{b.linhas.map((l, i) => {
				if (l.tipo === 'k') {
					const t0 = aparece(l.id, b);
					if (t < t0) return null;
					return (
						<div key={i} style={{position: 'absolute', left: kL - 20, width: kt.w + 40, top: l.y - kt.px * 0.62, height: kt.px * 1.3, textAlign: 'center'}}>
							<PalavraK txt={l.texto ?? PS[l.id].texto} t={t} t0={t0} t1={l.id2 !== undefined ? aparece(l.id2, b) : undefined} cor={l.cor} px={kt.px} />
						</div>
					);
				}
				const fs = FS;
				const txts = l.ids.map((id) => PS[id].texto);
				const cx = caixaDe(l);
				const caixas = l.ids.filter((id, k) => cx.includes(id) && !cx.includes(l.ids[k - 1])).length; // cada caixa soma o seu respiro
				const larg = mede(txts.join(' '), fSans(fs)) + caixas * fs * 0.4;
				const left = l.al === 'kwL' ? kL + kt.px * 0.12 : l.al === 'kwR' ? kR - larg - kt.px * 0.05 : (W - larg) / 2;
				return (
					<div key={i} style={{position: 'absolute', left, top: l.y - fs * 0.62, whiteSpace: 'nowrap', fontFamily: SANS, fontWeight: 600, fontSize: fs, letterSpacing: '-0.02em', lineHeight: 1.2}}>
						{l.ids.map((id, k) => {
							const t0 = aparece(id, b);
							// palavras vizinhas na caixa formam uma caixa só: o espaço entre elas fica dentro dela (e o respiro só nas pontas)
							const naCaixa = cx.includes(id);
							const antes = k > 0 && naCaixa && cx.includes(l.ids[k - 1]);
							const depois = naCaixa && cx.includes(l.ids[k + 1]);
							const pad = naCaixa ? (antes || depois ? `0 ${depois ? 0 : fs * 0.2}px 0 ${antes ? 0 : fs * 0.2}px` : `0 ${fs * 0.2}px`) : undefined;
							const txt = PS[id].texto + (depois ? '\u00a0' : '');
							return (
								<React.Fragment key={id}>
									{k > 0 && !antes && ' '}
									{t >= t0 ? (
										<PalavraP txt={txt} t={t} t0={t0} cor={l.cor ?? corP} halo={haloP} caixa={naCaixa} pad={pad} fs={fs} />
									) : (
										<span style={{display: 'inline-block', opacity: 0, padding: pad}}>{txt}</span>
									)}
								</React.Fragment>
							);
						})}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/* blocos de texto, plano a plano (posições em px no quadro 1080x1920) */
const blocos = (prev: boolean): Bloco[] => {
	const dv = DIV(prev);
	const yb = (v: number) => dv + v; // y dentro da metade de baixo da tela dividida
	return [
		// P1 palco: tese na parede escura acima da mesa (35–52% H)
		{de: 0, ate: 3.02, tema: 'escuro', linhas: [
			{tipo: 'p', ids: rg(0, 4), y: 742, al: 'kwL'},
			{tipo: 'k', id: 5, y: 868, cor: COR.sinal},
			{tipo: 'p', ids: [6, 7], y: 1000, al: 'kwR', caixa: 7},
		]},
		// P2 rosto: só pequenas no peito, abaixo do queixo
		{de: 3.02, ate: 5.18, tema: 'escuro', aceito: 'vitrine', linhas: [
			{tipo: 'p', ids: rg(8, 11), y: 1215, al: 'c'},
			{tipo: 'p', ids: rg(12, 15), y: 1298, al: 'c'},
		]},
		// P3 papel: faixa livre entre as fotos ("a" cortado: palavra vazia)
		{de: 5.18, ate: 8.04, tema: 'papel', linhas: [
			{tipo: 'k', id: 16, y: 800, cor: COR.sinal},
			{tipo: 'p', ids: rg(17, 19), y: 925, al: 'kwR'},
			{tipo: 'p', ids: rg(20, 24), y: 1010, al: 'kwR'},
		]},
		// P4 arquivo
		{de: 8.04, ate: 9.52, tema: 'escuro', aceito: 'vitrine', linhas: [
			{tipo: 'p', ids: [25, 26], y: 900, al: 'kwL'},
			{tipo: 'k', id: 27, y: 1022, cor: COR.sinal},
			{tipo: 'p', ids: rg(28, 30), y: 1148, al: 'kwR'},
		]},
		// P5 rosto close
		{de: 9.52, ate: 10.64, tema: 'escuro', aceito: 'vitrine', linhas: [{tipo: 'p', ids: rg(31, 33), y: 1215, al: 'c', caixa: 33}]},
		// P6 papel: Instagram em tinta preta, como o "Twitter" da ref1
		{de: 10.64, ate: 12.58, tema: 'papel', linhas: [
			{tipo: 'p', ids: rg(34, 38), y: 905, al: 'kwL'},
			{tipo: 'k', id: 39, y: 1025, cor: COR.tinta},
			{tipo: 'p', ids: [40], y: 1150, al: 'kwR'},
		]},
		// P7 rosto close: abaixo do queixo
		{de: 12.58, ate: 14.5, tema: 'escuro', linhas: [
			{tipo: 'p', ids: rg(41, 43), y: 1200, al: 'kwL'},
			{tipo: 'k', id: 44, y: 1322, cor: COR.sinal},
			{tipo: 'p', ids: rg(45, 47), y: 1448, al: 'kwR'},
		]},
		// P8 tela dividida: texto embaixo do queixo do close
		{de: 14.5, ate: 16.66, tema: 'escuro', aceito: 'vitrine', clipTop: dv, linhas: [
			{tipo: 'p', ids: rg(48, 51), y: yb(prev ? 600 : 620), al: 'c'},
			{tipo: 'p', ids: [52, 53], y: yb(prev ? 683 : 703), al: 'c'},
		]},
		{de: 16.66, ate: 17.86, tema: 'escuro', aceito: 'vitrine', clipTop: dv, linhas: [{tipo: 'p', ids: rg(54, 57), y: yb(prev ? 600 : 620), al: 'c'}]},
		{de: 17.86, ate: 19.99, tema: 'escuro', aceito: 'vitrine', clipTop: dv, linhas: [
			{tipo: 'p', ids: [58, 59], y: yb(prev ? 515 : 620), al: 'kwL'},
			{tipo: 'k', id: 60, id2: 61, texto: 'três vezes.', y: yb(prev ? 620 : 732), cor: COR.sinal},
		]},
		// P9 rosto médio (rosto à esquerda, texto no peito)
		{de: 19.99, ate: 21.85, tema: 'escuro', aceito: 'vitrine', linhas: [
			{tipo: 'p', ids: rg(62, 65), y: 1215, al: 'c'},
			{tipo: 'p', ids: [66, 67], y: 1298, al: 'c'},
		]},
		// P10 papel: texto no alto, prints embaixo (ref1 29,5)
		{de: 21.85, ate: 23.95, tema: 'papel', aceito: 'vitrine', linhas: [
			{tipo: 'p', ids: rg(68, 70), y: 470, al: 'kwL', cor: COR.petroleo},
			{tipo: 'k', id: 71, y: 595, cor: COR.sinal},
			{tipo: 'p', ids: [72, 73], y: 722, al: 'kwR', cor: COR.petroleo},
		]},
		// P11 palco
		{de: 23.95, ate: 25.47, tema: 'escuro', aceito: 'vitrine', linhas: [
			{tipo: 'p', ids: [74], y: 742, al: 'kwL'},
			{tipo: 'k', id: 75, y: 868, cor: COR.sinal},
			{tipo: 'p', ids: rg(76, 78), y: 1000, al: 'kwR'},
		]},
		// P12 arquivo: legenda pequena
		{de: 25.47, ate: 26.69, tema: 'escuro', aceito: 'vitrine', linhas: [{tipo: 'p', ids: rg(79, 82), y: 1215, al: 'c'}]},
		// P13 rosto: EDIÇÃO embaixo (momento 3); no "que" as pequenas trocam, a palavra-chave fica
		{de: 26.69, ate: 28.27, tema: 'escuro', aceito: 'vitrine', linhas: [
			{tipo: 'p', ids: [83], y: 1135, al: 'kwL'},
			{tipo: 'p', ids: [85, 86], y: 1395, al: 'kwR'},
		]},
		{de: 26.69, ate: DURACAO, tema: 'escuro', linhas: [{tipo: 'k', id: 84, texto: '“edição”', y: 1262, cor: COR.sinal}]},
		{de: 28.27, ate: DURACAO, tema: 'escuro', linhas: [
			{tipo: 'p', ids: rg(87, 91), y: 1135, al: 'kwL'},
			{tipo: 'p', ids: rg(92, 95), y: 1395, al: 'kwR'},
		]},
	];
};

/* ---------------------------------------------------------------- terço inferior (mono, letras embaralhando) */
const EMBARALHO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const Embaralha: React.FC<{txt: string; t: number; t0: number; f: number; seed: string}> = ({txt, t, t0, f, seed}) => {
	const p = (t - t0) / 0.5; // ~0,5 s até assentar (ref1 32,4)
	return (
		<>
			{Array.from(txt).map((ch, i) => {
				const assenta = (i + 1) / txt.length;
				if (ch === ' ' || p >= assenta) return ch;
				if (p < assenta * 0.25) return ' ';
				return EMBARALHO[Math.floor(random(`${seed}-${i}-${f}`) * EMBARALHO.length)];
			})}
		</>
	);
};
/* quando e onde entra o terço inferior (1ª aparição do rosto); o texto vem das props nome e arroba, vazias por padrão */
type Terco = {de: number; ate: number; x: number; y: number};
const TERCOS: Terco[] = [{de: 3.1, ate: 5.18, x: 0.14, y: 0.5}];
const TercoView: React.FC<{tc: Terco; l1: string; l2: string; t: number; f: number}> = ({tc, l1, l2, t, f}) => {
	if ((!l1 && !l2) || t < tc.de || t >= tc.ate) return null;
	const e = tw(t, tc.de, tc.de + 0.12, 0, 1);
	const x = tc.x * W;
	const top = tc.y * H;
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: x, top, width: 11, height: 205, background: COR.sinal, opacity: e, boxShadow: '0 0 14px rgba(237,3,7,0.9), 0 0 46px rgba(237,3,7,0.6)'}} />
			<div style={{position: 'absolute', left: x + 11 + 34, top: top + 40, fontFamily: MONO, color: COR.branco, whiteSpace: 'pre', textShadow: HALO_B, opacity: e}}>
				<div style={{fontSize: 50, letterSpacing: '0.06em', lineHeight: 1.1}}>
					<Embaralha txt={l1} t={t} t0={tc.de} f={f} seed={l1} />
				</div>
				<div style={{fontSize: 30, letterSpacing: '0.02em', marginTop: 16, opacity: 0.92}}>
					<Embaralha txt={l2} t={t} t0={tc.de + 0.12} f={f} seed={l2} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- mídia opcional: o que não está em public/ vira o
 * plano B que o molde desenha (palco, cards) ou a própria gravação (arquivo sem B-roll, rosto sem o grade) */
const tem = (arq: string) => {
	const lista = getStaticFiles();
	return !lista.length || lista.some((f) => f.name === arq);
};
const gravacao = () => (tem('fala_grade.mp4') ? 'fala_grade.mp4' : 'fala.mp4');

/* ---------------------------------------------------------------- mundos */
const Vinheta: React.FC<{forte?: number}> = ({forte = 0.75}) => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 45%, rgba(0,0,0,${forte}) 100%)`}} />
);

/* a gravação (fundo já trocado pelo estudio em scripts/grade.py), um só elemento de vídeo para a linha do tempo toda */
const transformRosto = (q: Quadro, r: {cx: number; cy: number}) => {
	const s = q.s;
	let left = q.ox * W - r.cx * W * s;
	let top = q.oy * H - r.cy * H * s;
	left = Math.min(0, Math.max(W - W * s, left));
	top = Math.min(0, Math.max(H - H * s, top));
	return {left, top, s};
};
const Gravacao: React.FC<{t: number; prev: boolean}> = ({t, prev}) => {
	const p = planoEm(t);
	if (p.mundo !== 'rosto' && p.mundo !== 'dividida') return null;
	const r = rostoMed(p.de, p.ate);
	let style: React.CSSProperties;
	let clip: string | undefined;
	if (p.mundo === 'dividida') {
		const dv = DIV(prev);
		const alvo = dv + (prev ? 255 : 300); // centro do rosto na metade de baixo
		style = {position: 'absolute', left: 0, top: alvo - r.cy * H, width: W, height: H};
		clip = `inset(${dv}px 0 0 0)`;
	} else {
		const tr = transformRosto(p.q!, r);
		style = {position: 'absolute', left: tr.left, top: tr.top, width: W * tr.s, height: H * tr.s};
	}
	return (
		<AbsoluteFill style={{clipPath: clip}}>
			<OffthreadVideo muted src={staticFile(gravacao())} style={style} />
			<Vinheta forte={0.7} />
		</AbsoluteFill>
	);
};

const Palco: React.FC<{t: number; de: number; ate: number; topo?: number; alturaVis?: number}> = ({t, de, ate, topo, alturaVis}) => {
	const z = interpolate(t, [de, ate], [1.2, 1.235]); // a mesa ocupa ~60% da largura (ref1: 13–90% W com as pessoas) + leve deriva
	const banda = alturaVis !== undefined;
	const caixa: React.CSSProperties = {position: 'absolute', left: 0, width: W, height: (W * 1376) / 768, top: banda ? (topo as number) : (H - (W * 1376) / 768) / 2, transform: `scale(${z})`, transformOrigin: '50% 58%'};
	return (
		<AbsoluteFill style={{background: COR.breu, clipPath: banda ? `inset(0 0 ${H - (alturaVis as number)}px 0)` : undefined}}>
			{tem('palco.png') ? <Img src={staticFile('palco.png')} style={{...caixa, filter: 'brightness(1.12) contrast(1.04) saturate(0.6)'}} /> : <PalcoDesenhado style={caixa} />}
			<Vinheta forte={0.55} />
		</AbsoluteFill>
	);
};

/* plano B do palco (sem public/palco.png, que vem no estúdio): o set desenhado no mesmo esquema da imagem, cone de luz
 * aceso no miolo, poça quase branca no chão, mesa clara a 58% da altura, cadeiras e microfones de braço, nas mesmas
 * proporções da imagem para a tela dividida cortar igual */
const PalcoDesenhado: React.FC<{style: React.CSSProperties}> = ({style}) => (
	<div style={{...style, overflow: 'hidden', background: 'linear-gradient(180deg, #050606 0%, #0b0d0e 45%, #141518 60%, #08090a 100%)'}}>
		{/* cone de luz de cima, aceso no miolo */}
		<div style={{position: 'absolute', left: '50%', top: 0, width: '80%', height: '64%', transform: 'translateX(-50%)', clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)', background: 'radial-gradient(ellipse 30% 100% at 50% 0%, rgba(235,240,245,0.55) 0%, rgba(220,226,232,0.22) 45%, rgba(200,206,212,0.06) 100%)', filter: 'blur(6px)'}} />
		{/* poça de luz no chão, quase branca no centro */}
		<div style={{position: 'absolute', left: '2%', right: '2%', top: '60%', height: '11%', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%, rgba(250,252,253,0.98) 0%, rgba(235,238,241,0.85) 35%, rgba(150,156,162,0.25) 65%, rgba(0,0,0,0) 78%)', filter: 'blur(4px)'}} />
		{/* mesa clara */}
		<div style={{position: 'absolute', left: '24%', right: '24%', top: '57.4%', height: '1%', borderRadius: 3, background: 'linear-gradient(180deg, #f1f3f4, #a7abaf)', boxShadow: '0 0 24px rgba(255,255,255,0.35)'}} />
		{[27, 72].map((x) => <div key={x} style={{position: 'absolute', left: `${x}%`, width: '0.6%', top: '58.4%', height: '6.6%', background: '#0c0d0e'}} />)}
		{/* cadeiras em silhueta */}
		{[17, 75].map((x) => (
			<div key={x} style={{position: 'absolute', left: `${x}%`, top: '54%', width: '8%', height: '11%'}}>
				<div style={{position: 'absolute', left: x < 50 ? 0 : '70%', width: '30%', top: 0, height: '55%', borderTop: '3px solid #4a4e52', borderLeft: x < 50 ? '3px solid #4a4e52' : undefined, borderRight: x > 50 ? '3px solid #4a4e52' : undefined}} />
				<div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 4, background: '#4a4e52'}} />
				<div style={{position: 'absolute', left: '5%', width: 3, top: '50%', bottom: 0, background: '#3a3d40'}} />
				<div style={{position: 'absolute', right: '5%', width: 3, top: '50%', bottom: 0, background: '#3a3d40'}} />
			</div>
		))}
		{/* microfones de braço */}
		{[34, 62].map((x, i) => (
			<div key={x} style={{position: 'absolute', left: `${x}%`, top: '52.8%', width: '4%', height: '4.6%'}}>
				<div style={{position: 'absolute', left: i ? '80%' : '20%', bottom: 0, width: 3, height: '100%', background: '#3a3d40', transform: `rotate(${i ? 18 : -18}deg)`, transformOrigin: 'bottom'}} />
				<div style={{position: 'absolute', left: i ? '0%' : '60%', top: '-8%', width: '40%', height: '26%', borderRadius: 4, background: '#55595d'}} />
			</div>
		))}
	</div>
);

const Arquivo: React.FC<{t: number; p: Plano}> = ({t, p}) => {
	const z = interpolate(t, [p.de, p.ate], [1.04, 1.13]);
	const k = (t - p.de) * FPS;
	const chicote = k < 2 ? 1 - k / 2 : 0; // 1º quadro borrado na horizontal (ref1 6,6)
	const temImg = p.img !== undefined && tem(p.img);
	const im = (dx: number, op: number, filtro: string, key: string) => {
		const style: React.CSSProperties = {position: 'absolute', left: dx, top: 0, width: W, height: H, objectFit: 'cover', transform: `scale(${z})`, opacity: op, filter: filtro};
		// sem a imagem de B-roll, o arquivo é a própria gravação, fria e com as bordas desfocadas
		return temImg ? <Img key={key} src={staticFile(p.img as string)} style={style} /> : <OffthreadVideo key={key} muted src={staticFile(gravacao())} style={style} />;
	};
	const frio = 'saturate(0.62) contrast(1.1) brightness(0.88) hue-rotate(-6deg)';
	return (
		<AbsoluteFill style={{background: COR.breu}}>
			{im(0, 1, `${frio} blur(10px)`, 'fundo')}
			<AbsoluteFill style={{maskImage: 'radial-gradient(ellipse 62% 58% at 50% 50%, #000 55%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 62% 58% at 50% 50%, #000 55%, transparent 100%)'}}>
				{chicote > 0 ? [-60, -30, 0, 30, 60].map((d) => im(d * chicote, 0.32, frio, `c${d}`)) : im(0, 1, frio, 'nitida')}
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'rgba(20,40,60,0.12)', mixBlendMode: 'multiply'}} />
			<Vinheta forte={0.8} />
		</AbsoluteFill>
	);
};

/* papel claro com vinheta forte (#EFEAE7 no centro, #7E7C7A nos cantos) */
const Papel: React.FC = () => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse 80% 70% at 50% 48%, ${COR.papel} 0%, #E3DEDB 45%, ${COR.papelBorda} 100%)`}} />
);
type Card = {src: string; x: number; y: number; w: number; t0: number; z?: number};
const FRANJA = '-2px 0 0 rgba(255,122,30,0.75), 2px 0 0 rgba(30,110,255,0.7), 0 8px 18px rgba(0,0,0,0.32)';
/* src/cards.json (do ../../tools/cards.py): a lista de cards de cada mundo; com menos cards que lugares, eles se repetem */
const CARTOES = CARDS as {colagem?: string[]; celulares?: string[]; prints?: string[]};
const cartao = (lista: string[] | undefined, i: number) => (lista && lista.length ? lista[i % lista.length] : '');
/* um card: o quadro de public/cards/<nome>.jpg ou, sem ele, um quadro 9:16 desenhado (fundo escuro e marcas de edição) */
const FUNDOS = ['#2B3339', '#33302B', '#24302F', '#2E2A33'];
const QuadroCard: React.FC<{nome: string; i: number; style: React.CSSProperties}> = ({nome, i, style}) => {
	if (nome && tem(`cards/${nome}.jpg`)) return <Img src={staticFile(`cards/${nome}.jpg`)} style={{...style, objectFit: 'cover'}} />;
	const barra = (top: string, larg: string, cor: string, alt = '3.2%'): React.CSSProperties => ({position: 'absolute', left: `${(100 - parseFloat(larg)) / 2}%`, width: larg, top, height: alt, borderRadius: 6, background: cor});
	return (
		<div style={{position: 'relative', ...style, overflow: 'hidden', background: `linear-gradient(165deg, ${FUNDOS[i % FUNDOS.length]} 0%, #0B0D0F 100%)`}}>
			<div style={{position: 'absolute', left: '28%', width: '44%', top: '22%', paddingTop: '44%', borderRadius: '50%', background: 'rgba(255,255,255,0.10)'}} />
			<div style={barra(`${56 + (i % 3) * 3}%`, `${62 - (i % 4) * 6}%`, 'rgba(255,255,255,0.88)')} />
			<div style={barra(`${62 + (i % 3) * 3}%`, `${40 + (i % 3) * 8}%`, i % 2 ? COR.sinal : 'rgba(255,255,255,0.6)')} />
		</div>
	);
};
const CardView: React.FC<{c: Card; t: number; i: number; borra?: number; apaga?: number}> = ({c, t, i, borra, apaga = 0}) => {
	if (t < c.t0) return null;
	const h = (c.w * 16) / 9;
	return (
		<QuadroCard
			nome={c.src}
			i={i}
			style={{position: 'absolute', left: c.x, top: c.y, width: c.w, height: h, boxShadow: FRANJA, opacity: 1 - apaga, filter: `contrast(1.04) saturate(0.85)${borra ? ` blur(${borra}px)` : ''}`}}
		/>
	);
};

/* colagem (P3): uma foto por vez a partir da palavra `entra`; na palavra `foco` a câmera avança até o último card.
 * Lugares [x, y, largura]; as fotos são os cards de CARTOES.colagem */
const COL1: [number, number, number][] = [
	[60, 90, 260],
	[385, 40, 230],
	[700, 120, 290],
	[210, 1120, 250],
	[760, 1080, 270],
	[20, 1240, 210],
	[520, 1210, 230],
	[330, 1430, 320],
];
const ColagemModelos: React.FC<{t: number; entra: number; foco: number}> = ({t, entra, foco}) => {
	const cards = COL1.map(([x, y, w], i) => ({src: cartao(CARTOES.colagem, i), x, y, w, t0: de(entra, 'PLANOS') + i * 0.12}));
	const ia = cards.length - 1;
	const alvo = cards[ia]; // o último a entrar, embaixo no centro
	const a = de(foco, 'PLANOS'); // "criei"
	const k = tw(t, a, a + 0.35, 0, 1, E.io);
	const s = 1 + 0.5 * k;
	const cx = alvo.x + alvo.w / 2;
	const cy = alvo.y + (alvo.w * 16) / 18;
	return (
		<AbsoluteFill>
			<Papel />
			<AbsoluteFill style={{transform: `translate(${(W / 2 - cx) * 0.35 * k}px, ${(H * 0.72 - cy) * 0.35 * k}px) scale(${s})`, transformOrigin: `${cx}px ${cy}px`}}>
				{cards.map((c, i) => (
					<CardView key={i} c={c} t={t} i={i} borra={i === ia ? 0 : 7 * k} apaga={i === ia ? 0 : 0.55 * k} />
				))}
			</AbsoluteFill>
			<Vinheta forte={0.35} />
		</AbsoluteFill>
	);
};

/* prints (P10): entrando um a um embaixo do texto desde o corte (ref1 29,5); lugares [x, y, largura], fotos de CARTOES.prints */
const COL2: [number, number, number][] = [
	[40, 820, 250],
	[330, 900, 230],
	[600, 840, 260],
	[840, 960, 230],
	[120, 1280, 270],
	[450, 1330, 250],
	[760, 1360, 260],
	[-40, 60, 230],
];
const ColagemEdicao: React.FC<{t: number; p: Plano}> = ({t, p}) => {
	const cards = COL2.map(([x, y, w], i) => ({src: cartao(CARTOES.prints, i), x, y, w, t0: p.de + 0.02 + i * 0.14}));
	const z = interpolate(t, [p.de, p.ate], [1, 1.05]);
	return (
		<AbsoluteFill>
			<Papel />
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 30%'}}>
				{cards.map((c, i) => (
					<CardView key={i} c={c} t={t} i={i} />
				))}
			</AbsoluteFill>
			<Vinheta forte={0.35} />
		</AbsoluteFill>
	);
};

/* P6: um celular com interface genérica (sem logo) cresce no centro e, no "Instagram", explode em vários */
const Icone: React.FC<{d: string}> = ({d}) => (
	<svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))'}}>
		<path d={d} />
	</svg>
);
const IC = {
	coracao: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z',
	balao: 'M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2-5.3A8.4 8.4 0 1 1 21 11.5z',
	seta: 'M15 5l6 6-6 6M21 11H9a6 6 0 0 0-6 6v2',
};
const Celular: React.FC<{src: string; i: number; w: number}> = ({src, i, w}) => {
	const h = (w * 16) / 9;
	const k = w / 420;
	return (
		<div style={{position: 'relative', width: w, height: h, borderRadius: 44 * k, background: '#0B0B0D', padding: 12 * k, boxShadow: FRANJA, boxSizing: 'border-box'}}>
			<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 34 * k, overflow: 'hidden'}}>
				<QuadroCard nome={src} i={i} style={{width: '100%', height: '100%'}} />
				<div style={{position: 'absolute', right: 14 * k, bottom: 150 * k, display: 'flex', flexDirection: 'column', gap: 26 * k, transform: `scale(${k})`, transformOrigin: 'right bottom'}}>
					<Icone d={IC.coracao} />
					<Icone d={IC.balao} />
					<Icone d={IC.seta} />
				</div>
				<div style={{position: 'absolute', left: 22 * k, bottom: 46 * k, display: 'flex', alignItems: 'center', gap: 12 * k}}>
					<div style={{width: 44 * k, height: 44 * k, borderRadius: '50%', background: '#d9d9d9', border: `${3 * k}px solid #fff`}} />
					<div>
						<div style={{width: 150 * k, height: 12 * k, borderRadius: 6 * k, background: 'rgba(255,255,255,0.9)'}} />
						<div style={{width: 220 * k, height: 10 * k, borderRadius: 5 * k, background: 'rgba(255,255,255,0.55)', marginTop: 9 * k}} />
					</div>
				</div>
			</div>
		</div>
	);
};
/* celulares (P6): o central cresce até a palavra `explode` e solta os outros; fotos de CARTOES.celulares (a 1ª no central) */
const VOO = [
	{dx: -340, dy: -92, w: 280, r: -6},
	{dx: 340, dy: -122, w: 270, r: 5},
	{dx: -350, dy: 1078, w: 300, r: 4},
	{dx: 350, dy: 1058, w: 290, r: -5},
	{dx: 0, dy: 1250, w: 270, r: 2},
];
const RedeSocial: React.FC<{t: number; p: Plano; explode: number}> = ({t, p, explode}) => {
	const exp = de(explode, 'PLANOS'); // "Instagram"
	const cresce = tw(t, p.de, exp, 0, 1, E.io);
	const wC = 240 + 120 * cresce; // card central cresce por ~1 s
	const e = tw(t, exp, exp + 0.3, 0, 1, E.out);
	return (
		<AbsoluteFill>
			<Papel />
			{t >= exp &&
				VOO.map((v, i) => {
					const vel = t < exp + 0.3 ? (1 - e) * 18 : 0; // desfoque de movimento enquanto voa
					return (
						<div key={i} style={{position: 'absolute', left: W / 2 - v.w / 2 + v.dx * e, top: H * 0.22 - (v.w * 8) / 9 + v.dy * e, transform: `rotate(${v.r * e}deg) scale(${0.5 + 0.5 * e})`, filter: vel ? `blur(${vel}px)` : undefined}}>
							<Celular src={cartao(CARTOES.celulares, i + 1)} i={i + 1} w={v.w} />
						</div>
					);
				})}
			<div style={{position: 'absolute', left: W / 2 - wC / 2, top: H * 0.22 - (wC * 8) / 9}}>
				<Celular src={cartao(CARTOES.celulares, 0)} i={0} w={wC} />
			</div>
			<Vinheta forte={0.35} />
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- tela dividida + prévias (momento 2) */
const Dividida: React.FC<{t: number; p: Plano; prev: boolean}> = ({t, p, prev}) => {
	const dv = DIV(prev);
	// o palco em cima: a mesa no meio da faixa
	const altImg = (W * 1376) / 768;
	const topo = dv * 0.62 - altImg * 0.58;
	return <Palco t={t} de={p.de} ate={p.ate} topo={topo} alturaVis={dv} />;
};
const PREV = {w: 360, h: 640, y: 34, x: [150, 570]};
export const PreviasEmCima: React.FC<{t: number; nomes: [string, string]}> = ({t, nomes}) => {
	if (!JANELA_PREVIAS) return null;
	const {de, ate} = JANELA_PREVIAS;
	if (t < de || t >= ate) return null;
	if (!(tem('previa1.mp4') && tem('previa2.mp4'))) throw new Error('Falta public/previa1.mp4 ou previa2.mp4: faça com tools/previa.py (modelos/superpodcast01/superpodcast01.md, "Como fazer um vídeo novo") ou renderize com "previas": false.');
	return (
		<AbsoluteFill>
			{[0, 1].map((i) => {
				const a = de + i * 0.12; // uma por vez, como as fotos da colagem
				if (t < a) return null;
				return (
					<div key={i} style={{position: 'absolute', left: PREV.x[i], top: PREV.y, width: PREV.w}}>
						<div style={{width: PREV.w, height: PREV.h, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', background: COR.breu}}>
							<Sequence from={fr(a)} layout="none">
								<OffthreadVideo muted src={staticFile(`previa${i + 1}.mp4`)} style={{width: PREV.w, height: PREV.h, objectFit: 'cover'}} />
							</Sequence>
						</div>
						<div style={{position: 'absolute', left: -40, right: -40, top: PREV.h + 16, textAlign: 'center', whiteSpace: 'pre', fontFamily: MONO, fontSize: 34, letterSpacing: "0.04em", color: COR.branco, textShadow: HALO_B}}>
							<Embaralha txt={nomes[i].toUpperCase()} t={t} t0={a + 0.1} f={Math.round(t * FPS)} seed={`prev${i}`} />
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- vazamento de luz: vermelho -> âmbar -> amarelo -> branco (~0,3 s) */
const Vazamento: React.FC<{t: number}> = ({t}) => {
	for (const c of VAZAMENTOS) {
		const a = c === 0 ? -0.02 : c - 0.15;
		const b = c === 0 ? 0.27 : c + 0.15;
		if (t < a || t >= b) continue;
		const p = (t - a) / (b - a); // 0..1
		const sobe = p * 170 - 30; // a onda sobe do pé do quadro na diagonal
		const branco = Math.max(0, 1 - Math.abs(p - 0.5) / 0.22);
		const op = p < 0.85 ? 1 : (1 - p) / 0.15;
		return (
			<AbsoluteFill style={{pointerEvents: 'none'}}>
				<AbsoluteFill
					style={{
						opacity: op,
						mixBlendMode: 'screen',
						background: `linear-gradient(20deg, ${COR.vaz[3]} ${sobe - 60}%, ${COR.vaz[2]} ${sobe - 40}%, ${COR.vaz[1]} ${sobe - 22}%, ${COR.vaz[0]} ${sobe}%, rgba(189,32,39,0) ${sobe + 30}%)`,
					}}
				/>
				<AbsoluteFill style={{background: '#FFF8E8', opacity: branco * 0.85}} />
			</AbsoluteFill>
		);
	}
	return null;
};

/* ---------------------------------------------------------------- composição */
export const VitrineSuperPodcast01: React.FC<Props> = ({previas, nomesPrevias, nome = '', arroba = ''}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const [ok, setOk] = useState(false);
	const [h] = useState(() => delayRender('fontes'));
	useEffect(() => {
		Promise.all([pf.waitUntilDone(), it.waitUntilDone(), mo.waitUntilDone()]).then(() => {
			setOk(true);
			continueRender(h);
		});
	}, [h]);
	const p = planoEm(t);
	const BL = blocos(previas);
	return (
		<AbsoluteFill style={{background: COR.breu}}>
			<Gravacao t={t} prev={previas} />
			{p.mundo === 'palco' && <Palco t={t} de={p.de} ate={p.ate} />}
			{p.mundo === 'dividida' && <Dividida t={t} p={p} prev={previas} />}
			{p.mundo === 'arquivo' && <Arquivo t={t} p={p} />}
			{p.mundo === 'papel' && !p.papel && <Papel />}
			{p.papel?.tipo === 'colagem' && <ColagemModelos t={t} entra={p.papel.entra} foco={p.papel.foco} />}
			{p.papel?.tipo === 'celulares' && <RedeSocial t={t} p={p} explode={p.papel.explode} />}
			{p.papel?.tipo === 'prints' && <ColagemEdicao t={t} p={p} />}
			{previas && <PreviasEmCima t={t} nomes={nomesPrevias} />}
			{ok && TERCOS.map((tc, i) => <TercoView key={i} tc={tc} l1={nome} l2={arroba} t={t} f={f} />)}
			{ok && BL.map((b, i) => <BlocoView key={i} b={b} t={t} />)}
			<Vazamento t={t} />
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- o plano bate com a fala? (ao carregar)
 * Os planos se emendam até o fim; cada palavra de um bloco é dita dentro dele (ou até 2 quadros antes, quando o corte
 * cai logo depois do começo dela). */
const Q2 = 2 / FPS + 1e-6;
PLANOS.forEach((pl, k) => {
	if (!(pl.ate > pl.de)) throw errPlano('PLANOS', `o plano ${pl.id} (${pl.de}-${pl.ate} s) acaba antes de começar`);
	const prox = PLANOS[k + 1];
	if (prox && Math.abs(prox.de - pl.ate) > 1e-6) throw errPlano('PLANOS', `o plano ${pl.id} acaba em ${pl.ate} s e o ${prox.id} começa em ${prox.de} s`);
	if (pl.de >= DURACAO) throw errPlano('PLANOS', `o plano ${pl.id} começa em ${pl.de} s, depois do fim do vídeo`);
	if (pl.mundo === 'rosto' && !pl.q) throw errPlano('PLANOS', `o plano ${pl.id} é de rosto e não tem o enquadramento q`);
	if (pl.papel?.tipo === 'colagem') [pl.papel.entra, pl.papel.foco].forEach((i) => de(i, 'PLANOS'));
	if (pl.papel?.tipo === 'celulares') de(pl.papel.explode, 'PLANOS');
});
for (const prev of [false, true])
	for (const b of blocos(prev))
		for (const l of b.linhas) {
			for (const id of caixaDe(l))
				if (l.tipo === 'p' && !l.ids.includes(id)) throw errPlano('blocos', `o bloco de ${b.de.toFixed(2)} s põe na caixa a palavra ${id}, que não está na linha dela (${l.ids.join(', ')})`);
			for (const id of l.tipo === 'k' ? [l.id, ...(l.id2 !== undefined ? [l.id2] : [])] : l.ids) {
				if (!PS[id]) throw errPlano('blocos', `o bloco de ${b.de.toFixed(2)} s usa a palavra ${id}, que não existe`);
				if (PS[id].de < b.de - Q2 || PS[id].de >= b.ate)
					throw errPlano('blocos', `o bloco de ${b.de.toFixed(2)} a ${b.ate.toFixed(2)} s escreve a palavra ${id} ("${PS[id].texto}"), que é dita em ${PS[id].de} s, fora dele`);
			}
		}

/* ---------------------------------------------------------------- para o conferidor: onde o rosto está na tela
 * Nos mundos que mostram a gravação (rosto, dividida e arquivo sem a imagem), a caixa do rosto em px: src/rosto.json do
 * plano (±0,25 s) com o enquadramento do mundo, largura ~0,8 da altura. null nos outros. existe(arq): a imagem está em public/? */
const rostoNaTela = (t: number, prev: boolean, existe: (arq: string) => boolean) => {
	const p = planoEm(t);
	const amostras = ROSTO.filter((r) => r[0] >= p.de - 0.25 && r[0] <= p.ate + 0.25);
	let mapa: ((x: number, y: number) => [number, number]) | null = null;
	if (p.mundo === 'rosto' && p.q) {
		const tr = transformRosto(p.q, rostoMed(p.de, p.ate));
		mapa = (x, y) => [tr.left + x * W * tr.s, tr.top + y * H * tr.s];
	} else if (p.mundo === 'dividida') {
		const r = rostoMed(p.de, p.ate);
		const alvo = DIV(prev) + (prev ? 255 : 300);
		mapa = (x, y) => [x * W, alvo - r.cy * H + y * H];
	} else if (p.mundo === 'arquivo' && !(p.img !== undefined && existe(p.img))) {
		const z = 1.04 + 0.09 * Math.min(1, Math.max(0, (t - p.de) / (p.ate - p.de))); // o zoom do Arquivo, do centro
		mapa = (x, y) => [W / 2 + (x * W - W / 2) * z, H / 2 + (y * H - H / 2) * z];
	}
	if (!mapa || !amostras.length) return null;
	let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
	for (const [, cx, cy, h] of amostras) {
		const ml = (h * H * 0.4) / W;
		const [a, b] = mapa(cx - ml, cy - h / 2), [c, d] = mapa(cx + ml, cy + h / 2);
		[x0, y0, x1, y1] = [Math.min(x0, a), Math.min(y0, b), Math.max(x1, c), Math.max(y1, d)];
	}
	return {x0, x1, y0, y1, plano: p.id, mundo: p.mundo, img: p.img};
};

/* para scripts/sincronia.mjs */
export const conferencia = {PLANOS, blocos, PS, W, FS, TERCOS, DURACAO, CARTOES, rostoNaTela};
