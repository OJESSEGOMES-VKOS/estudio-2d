import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import PB from './palavras.json';
import ROSTO_T from './rosto.json';

/**
 * Vitrine no superpodcast01 (../../modelos/superpodcast01/MODELO.md).
 * Primeira aplicação do modelo: não há código aprovado. Do storypodcast01 da vitrine veio só o encanamento
 * (index, Root, carregamento de palavras/rosto, medida de fonte por canvas, scripts). O visual sai do MODELO.md:
 * quatro mundos (palco, rosto, papel, arquivo) + tela dividida, Playfair Display Black Italic vermelha letra por
 * letra, Inter SemiBold pequena, JetBrains Mono no terço inferior, vazamento de luz na troca de bloco.
 * Plano frase a frase em ../plano.md.
 */
export const FPS = 30;
export const DURACAO = 30.16; // "agora." acaba em 29,63; a última tela segura até o fim da gravação graduada (906 quadros)
const W = 1080;
const H = 1920;

const pf = loadPlayfair('italic', {weights: ['900'], subsets: ['latin', 'latin-ext']});
const it = loadInter('normal', {weights: ['400', '600', '700'], subsets: ['latin', 'latin-ext']});
const mo = loadMono('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const SERIF = pf.fontFamily;
const SANS = it.fontFamily;
const MONO = mo.fontFamily;

/* identidade "Palco Escuro" (MODELO §11) */
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
const FS = 66; // pequena: corpo ~3,4% H (MODELO §4: 3,2–3,8% H)
const KW_MAX = 220; // corpo máximo da palavra-chave (~11,5% H)
const KW_ALVO = 0.74; // largura-alvo da palavra-chave (60–83% W)
const HALO_V = `0 0 6px rgba(224,3,10,0.85), 0 0 26px rgba(224,3,10,0.55), 0 0 70px rgba(224,3,10,0.45)`;
const HALO_B = `0 0 3px rgba(255,255,255,0.55), 0 0 14px rgba(255,255,255,0.28)`;
const HALO_P = `0 0 6px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.7)`; // texto escuro no papel: brilho claro

const E = {out: Easing.bezier(0.16, 1, 0.3, 1), io: Easing.bezier(0.45, 0, 0.55, 1)};
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const fr = (s: number) => Math.round(s * FPS);

export type Props = {previas: boolean; nomesPrevias: [string, string]};

type Pal = {texto: string; de: number; ate: number};
const PS: Pal[] = (PB as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));
const rg = (a: number, b: number) => Array.from({length: b - a + 1}, (_, k) => a + k);

/* ---------------------------------------------------------------- planos (a lista de cortes vem primeiro) */
type Mundo = 'palco' | 'rosto' | 'papel' | 'arquivo' | 'dividida';
type Quadro = {s: number; ox: number; oy: number}; // escala e onde o centro do rosto cai na tela
type Plano = {id: string; de: number; ate: number; mundo: Mundo; q?: Quadro; img?: string};
const PLANOS: Plano[] = [
	{id: 'P1', de: 0, ate: 3.02, mundo: 'palco'},
	{id: 'P2', de: 3.02, ate: 5.18, mundo: 'rosto', q: {s: 1.1, ox: 0.55, oy: 0.33}},
	{id: 'P3', de: 5.18, ate: 8.04, mundo: 'papel'},
	{id: 'P4', de: 8.04, ate: 9.52, mundo: 'arquivo', img: 'broll_edicao.png'},
	{id: 'P5', de: 9.52, ate: 10.64, mundo: 'rosto', q: {s: 1.32, ox: 0.53, oy: 0.31}},
	{id: 'P6', de: 10.64, ate: 12.58, mundo: 'papel'},
	{id: 'P7', de: 12.58, ate: 14.5, mundo: 'rosto', q: {s: 1.18, ox: 0.58, oy: 0.3}},
	{id: 'P8', de: 14.5, ate: 19.99, mundo: 'dividida'},
	{id: 'P9', de: 19.99, ate: 21.85, mundo: 'rosto', q: {s: 1.1, ox: 0.45, oy: 0.33}},
	{id: 'P10', de: 21.85, ate: 23.95, mundo: 'papel'},
	{id: 'P11', de: 23.95, ate: 25.47, mundo: 'palco'},
	{id: 'P12', de: 25.47, ate: 26.69, mundo: 'arquivo', img: 'broll_celular.png'},
	{id: 'P13', de: 26.69, ate: DURACAO, mundo: 'rosto', q: {s: 1.1, ox: 0.55, oy: 0.31}},
];
export const CORTES = PLANOS.slice(1).map((p) => p.de);
const planoEm = (t: number) => PLANOS.find((p) => t >= p.de && t < p.ate) ?? PLANOS[PLANOS.length - 1];
const VAZAMENTOS = [0.0, 19.99]; // abertura (ref2 0,0) e virada para a conclusão (ref1 25,1)
export const JANELA_PREVIAS = {de: 14.5, ate: 19.99};
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
	| {tipo: 'p'; ids: number[]; y: number; al: 'kwL' | 'kwR' | 'c'; cor?: string; caixa?: number} // caixa: índice da palavra que vai na caixa branca
	| {tipo: 'k'; id: number; id2?: number; y: number; cor: string; alvo?: number; max?: number; texto?: string};
type Bloco = {de: number; ate: number; tema: Tema; linhas: Linha[]; clipTop?: number};

/* quando cada palavra aparece: no instante dito, nunca antes do plano (MODELO §5.3; regra da casa t >= t0) */
const aparece = (id: number, bloco: Bloco) => Math.max(PS[id].de, bloco.de);

const PalavraP: React.FC<{txt: string; t: number; t0: number; cor: string; halo: string; caixa?: boolean; fs: number}> = ({txt, t, t0, cor, halo, caixa, fs}) => {
	const e = tw(t, t0, t0 + 0.15, 0, 1, E.io); // fade com desfoque de ~5 quadros (ref1)
	const base: React.CSSProperties = {display: 'inline-block', opacity: e, filter: e < 1 ? `blur(${(1 - e) * 10}px)` : undefined};
	if (caixa)
		return (
			<span style={{...base, background: COR.branco, color: COR.tinta, fontWeight: 700, padding: `0 ${fs * 0.2}px`, lineHeight: 1.12, boxShadow: '0 0 18px rgba(255,255,255,0.35)', letterSpacing: '-0.02em'}}>
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
				const larg = mede(txts.join(' '), fSans(fs)) + (l.caixa !== undefined ? fs * 0.4 : 0);
				const left = l.al === 'kwL' ? kL + kt.px * 0.12 : l.al === 'kwR' ? kR - larg - kt.px * 0.05 : (W - larg) / 2;
				return (
					<div key={i} style={{position: 'absolute', left, top: l.y - fs * 0.62, whiteSpace: 'nowrap', fontFamily: SANS, fontWeight: 600, fontSize: fs, letterSpacing: '-0.02em', lineHeight: 1.2}}>
						{l.ids.map((id, k) => {
							const t0 = aparece(id, b);
							return (
								<React.Fragment key={id}>
									{k > 0 && ' '}
									{t >= t0 ? (
										<PalavraP txt={PS[id].texto} t={t} t0={t0} cor={l.cor ?? corP} halo={haloP} caixa={l.caixa === id} fs={fs} />
									) : (
										<span style={{display: 'inline-block', opacity: 0, padding: l.caixa === id ? `0 ${fs * 0.2}px` : undefined}}>{PS[id].texto}</span>
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
		{de: 3.02, ate: 5.18, tema: 'escuro', linhas: [
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
		{de: 8.04, ate: 9.52, tema: 'escuro', linhas: [
			{tipo: 'p', ids: [25, 26], y: 900, al: 'kwL'},
			{tipo: 'k', id: 27, y: 1022, cor: COR.sinal},
			{tipo: 'p', ids: rg(28, 30), y: 1148, al: 'kwR'},
		]},
		// P5 rosto close
		{de: 9.52, ate: 10.64, tema: 'escuro', linhas: [{tipo: 'p', ids: rg(31, 33), y: 1215, al: 'c', caixa: 33}]},
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
		{de: 14.5, ate: 16.66, tema: 'escuro', clipTop: dv, linhas: [
			{tipo: 'p', ids: rg(48, 51), y: yb(prev ? 600 : 620), al: 'c'},
			{tipo: 'p', ids: [52, 53], y: yb(prev ? 683 : 703), al: 'c'},
		]},
		{de: 16.66, ate: 17.86, tema: 'escuro', clipTop: dv, linhas: [{tipo: 'p', ids: rg(54, 57), y: yb(prev ? 600 : 620), al: 'c'}]},
		{de: 17.86, ate: 19.99, tema: 'escuro', clipTop: dv, linhas: [
			{tipo: 'p', ids: [58, 59], y: yb(prev ? 515 : 620), al: 'kwL'},
			{tipo: 'k', id: 60, id2: 61, texto: 'três vezes.', y: yb(prev ? 620 : 732), cor: COR.sinal},
		]},
		// P9 rosto médio (rosto à esquerda, texto no peito)
		{de: 19.99, ate: 21.85, tema: 'escuro', linhas: [
			{tipo: 'p', ids: rg(62, 65), y: 1215, al: 'c'},
			{tipo: 'p', ids: [66, 67], y: 1298, al: 'c'},
		]},
		// P10 papel: texto no alto, prints embaixo (ref1 29,5)
		{de: 21.85, ate: 23.95, tema: 'papel', linhas: [
			{tipo: 'p', ids: rg(68, 70), y: 470, al: 'kwL', cor: COR.petroleo},
			{tipo: 'k', id: 71, y: 595, cor: COR.sinal},
			{tipo: 'p', ids: [72, 73], y: 722, al: 'kwR', cor: COR.petroleo},
		]},
		// P11 palco
		{de: 23.95, ate: 25.47, tema: 'escuro', linhas: [
			{tipo: 'p', ids: [74], y: 742, al: 'kwL'},
			{tipo: 'k', id: 75, y: 868, cor: COR.sinal},
			{tipo: 'p', ids: rg(76, 78), y: 1000, al: 'kwR'},
		]},
		// P12 arquivo: legenda pequena
		{de: 25.47, ate: 26.69, tema: 'escuro', linhas: [{tipo: 'p', ids: rg(79, 82), y: 1215, al: 'c'}]},
		// P13 rosto: EDIÇÃO embaixo (momento 3); no "que" as pequenas trocam, a palavra-chave fica
		{de: 26.69, ate: 28.27, tema: 'escuro', linhas: [
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
type Terco = {de: number; ate: number; l1: string; l2: string; x: number; y: number};
const TERCOS: Terco[] = [
	{de: 3.1, ate: 5.18, l1: 'JESSÉ GOMES', l2: '@OJESSEGOMES', x: 0.14, y: 0.5},
];
const TercoView: React.FC<{tc: Terco; t: number; f: number}> = ({tc, t, f}) => {
	if (t < tc.de || t >= tc.ate) return null;
	const e = tw(t, tc.de, tc.de + 0.12, 0, 1);
	const x = tc.x * W;
	const top = tc.y * H;
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: x, top, width: 11, height: 205, background: COR.sinal, opacity: e, boxShadow: '0 0 14px rgba(237,3,7,0.9), 0 0 46px rgba(237,3,7,0.6)'}} />
			<div style={{position: 'absolute', left: x + 11 + 34, top: top + 40, fontFamily: MONO, color: COR.branco, whiteSpace: 'pre', textShadow: HALO_B, opacity: e}}>
				<div style={{fontSize: 50, letterSpacing: '0.06em', lineHeight: 1.1}}>
					<Embaralha txt={tc.l1} t={t} t0={tc.de} f={f} seed={tc.l1} />
				</div>
				<div style={{fontSize: 30, letterSpacing: '0.02em', marginTop: 16, opacity: 0.92}}>
					<Embaralha txt={tc.l2} t={t} t0={tc.de + 0.12} f={f} seed={tc.l2} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

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
			<OffthreadVideo muted src={staticFile('fala_grade.mp4')} style={style} />
			<Vinheta forte={0.7} />
		</AbsoluteFill>
	);
};

const Palco: React.FC<{t: number; de: number; ate: number; topo?: number; alturaVis?: number}> = ({t, de, ate, topo, alturaVis}) => {
	const z = interpolate(t, [de, ate], [1.2, 1.235]); // a mesa ocupa ~60% da largura (ref1: 13–90% W com as pessoas) + leve deriva
	const banda = alturaVis !== undefined;
	return (
		<AbsoluteFill style={{background: COR.breu, clipPath: banda ? `inset(0 0 ${H - (alturaVis as number)}px 0)` : undefined}}>
			<Img
				src={staticFile('palco.png')}
				style={{position: 'absolute', left: 0, width: W, height: (W * 1376) / 768, top: banda ? (topo as number) : (H - (W * 1376) / 768) / 2, transform: `scale(${z})`, transformOrigin: '50% 58%', filter: 'brightness(1.12) contrast(1.04) saturate(0.6)'}}
			/>
			<Vinheta forte={0.55} />
		</AbsoluteFill>
	);
};

const Arquivo: React.FC<{t: number; p: Plano}> = ({t, p}) => {
	const z = interpolate(t, [p.de, p.ate], [1.04, 1.13]);
	const k = (t - p.de) * FPS;
	const chicote = k < 2 ? 1 - k / 2 : 0; // 1º quadro borrado na horizontal (ref1 6,6)
	const src = staticFile(p.img!);
	const im = (dx: number, op: number, filtro: string, key: string) => (
		<Img key={key} src={src} style={{position: 'absolute', left: dx, top: 0, width: W, height: H, objectFit: 'cover', transform: `scale(${z})`, opacity: op, filter: filtro}} />
	);
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
const CardView: React.FC<{c: Card; t: number; borra?: number; apaga?: number}> = ({c, t, borra, apaga = 0}) => {
	if (t < c.t0) return null;
	const h = (c.w * 16) / 9;
	return (
		<Img
			src={staticFile(`cards/${c.src}.jpg`)}
			style={{position: 'absolute', left: c.x, top: c.y, width: c.w, height: h, objectFit: 'cover', boxShadow: FRANJA, opacity: 1 - apaga, filter: `contrast(1.04) saturate(0.85)${borra ? ` blur(${borra}px)` : ''}`}}
		/>
	);
};

/* P3: colagem dos modelos; uma foto por vez a partir de "vários"; no "criei" a câmera avança até um item */
const COL1: Card[] = [
	['pregacaodinamica01_23', 60, 90, 260],
	['pregacaodinamica01_1.5', 385, 40, 230],
	['modelodinamico01_1.5', 700, 120, 290],
	['profissional01_23', 210, 1120, 250],
	['storypodcast01_1.5', 760, 1080, 270],
	['modelopadrao01_4.5', 20, 1240, 210],
	['modelodinamico03_12', 520, 1210, 230],
	['modelodinamico03_23', 330, 1430, 320],
].map(([src, x, y, w], i) => ({src: src as string, x: x as number, y: y as number, w: w as number, t0: PS[18].de + i * 0.12}));
const ColagemModelos: React.FC<{t: number}> = ({t}) => {
	const alvo = COL1[7]; // o último a entrar, embaixo no centro
	const a = PS[22].de; // "criei"
	const k = tw(t, a, a + 0.35, 0, 1, E.io);
	const s = 1 + 0.5 * k;
	const cx = alvo.x + alvo.w / 2;
	const cy = alvo.y + (alvo.w * 16) / 18;
	return (
		<AbsoluteFill>
			<Papel />
			<AbsoluteFill style={{transform: `translate(${(W / 2 - cx) * 0.35 * k}px, ${(H * 0.72 - cy) * 0.35 * k}px) scale(${s})`, transformOrigin: `${cx}px ${cy}px`}}>
				{COL1.map((c, i) => (
					<CardView key={i} c={c} t={t} borra={i === 7 ? 0 : 7 * k} apaga={i === 7 ? 0 : 0.55 * k} />
				))}
			</AbsoluteFill>
			<Vinheta forte={0.35} />
		</AbsoluteFill>
	);
};

/* P10: prints entrando um a um embaixo do texto (ref1 29,5) */
const COL2: Card[] = [
	['modelodinamico03_27.5', 40, 820, 250],
	['pregacaodinamica01_27.5', 330, 900, 230],
	['modelopadrao01_17', 600, 840, 260],
	['storypodcast01_23', 840, 960, 230],
	['profissional01_27.5', 120, 1280, 270],
	['modelodinamico01_23', 450, 1330, 250],
	['modelodinamico03_1.5', 760, 1360, 260],
	['pregacaodinamica01_8.5', -40, 60, 230],
].map(([src, x, y, w], i) => ({src: src as string, x: x as number, y: y as number, w: w as number, t0: PLANOS[9].de + 0.02 + i * 0.14}));
const ColagemEdicao: React.FC<{t: number; p: Plano}> = ({t, p}) => {
	const z = interpolate(t, [p.de, p.ate], [1, 1.05]);
	return (
		<AbsoluteFill>
			<Papel />
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 30%'}}>
				{COL2.map((c, i) => (
					<CardView key={i} c={c} t={t} />
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
const Celular: React.FC<{src: string; w: number}> = ({src, w}) => {
	const h = (w * 16) / 9;
	const k = w / 420;
	return (
		<div style={{position: 'relative', width: w, height: h, borderRadius: 44 * k, background: '#0B0B0D', padding: 12 * k, boxShadow: FRANJA, boxSizing: 'border-box'}}>
			<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 34 * k, overflow: 'hidden'}}>
				<Img src={staticFile(`cards/${src}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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
const VOO = [
	{src: 'storypodcast01_12', dx: -340, dy: -92, w: 280, r: -6},
	{src: 'modelodinamico03_17', dx: 340, dy: -122, w: 270, r: 5},
	{src: 'pregacaodinamica01_17', dx: -350, dy: 1078, w: 300, r: 4},
	{src: 'profissional01_17', dx: 350, dy: 1058, w: 290, r: -5},
	{src: 'modelodinamico01_23', dx: 0, dy: 1250, w: 270, r: 2},
];
const RedeSocial: React.FC<{t: number; p: Plano}> = ({t, p}) => {
	const exp = PS[39].de; // "Instagram"
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
							<Celular src={v.src} w={v.w} />
						</div>
					);
				})}
			<div style={{position: 'absolute', left: W / 2 - wC / 2, top: H * 0.22 - (wC * 8) / 9}}>
				<Celular src="modelopadrao01_23" w={wC} />
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
	const {de, ate} = JANELA_PREVIAS;
	if (t < de || t >= ate) return null;
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
export const VitrineSuperPodcast01: React.FC<Props> = ({previas, nomesPrevias}) => {
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
			{p.id === 'P3' && <ColagemModelos t={t} />}
			{p.id === 'P6' && <RedeSocial t={t} p={p} />}
			{p.id === 'P10' && <ColagemEdicao t={t} p={p} />}
			{previas && <PreviasEmCima t={t} nomes={nomesPrevias} />}
			{ok && TERCOS.map((tc, i) => <TercoView key={i} tc={tc} t={t} f={f} />)}
			{ok && BL.map((b, i) => <BlocoView key={i} b={b} t={t} />)}
			<Vazamento t={t} />
		</AbsoluteFill>
	);
};

/* para scripts/sincronia.mjs */
export const conferencia = {PLANOS, blocos, PS, W, FS};
