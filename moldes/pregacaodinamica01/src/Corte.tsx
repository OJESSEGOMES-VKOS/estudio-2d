import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import PALAVRAS from './palavras.json'; // entrada padrão: [{text,start,end}]
import ROSTO from './rosto.json'; // entrada padrão: [[t,cx,cy,h]] a cada 0,25 s, em fração do quadro

/**
 * Molde do pregacaodinamica01 (../../modelos/pregacaodinamica01/MODELO.md), feito na vitrine dos modelos.
 * Parte do código do corte 9:16 aprovado do modelo (2026-10-06).
 * Revisão 2026-10-12 (pedido do Jessé): legenda corrida numa posição só, todas as falas uma vez, nada abaixo do tempo
 * de leitura, no máximo 4 linhas por bloco, tela de destaque só na fala protagonista e com contraste, sem P&B, sem nome
 * do modelo na tela, cor do fundo (vinho / azul petróleo) como opção desligada (prop fundoCor), fecho Comenta “EDIÇÃO”.
 */
export const FPS = 30;
export const DURACAO = 30.36; // duração da fala (public/voz.wav), muda a cada vídeo
export const P = {
	duracao: DURACAO,
	palavras: (PALAVRAS as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end})),
};
/** rosto parado do vídeo: mediana do rastreio em px (cx, cy do centro do rosto, queixo = cy + metade da altura) */
const mediana = (v: number[]) => {
	const s = [...v].sort((a, b) => a - b);
	const m = s.length >> 1;
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const um = (v: number) => Math.round(v * 10) / 10;
const RT = ROSTO as number[][];
const _cy = mediana(RT.map((r) => r[2])) * 1920;
export const R = {cx: um(mediana(RT.map((r) => r[1])) * 1080), cy: um(_cy), queixo: um(_cy + (mediana(RT.map((r) => r[3])) * 1920) / 2)};
export type Props = {previas: boolean; nomesPrevias: [string, string]; fundoCor?: boolean; soTexto?: boolean};

/* Zona segura das redes em 9:16 (Reels / TikTok / Shorts), 2ª rodada 2026-10-12 (pedido do Jessé): nenhum texto nos
 * 250 px de cima (barra, nome), nos 420 px de baixo (legenda do post, @, botões), nos 140 px da direita (coração,
 * comentário, compartilhar) nem nos 60 px da esquerda. scripts/cobertura.mjs renderiza só os textos (soTexto) e falha
 * se algum pixel sair daqui. */
export const ZONA = {topo: 250, base: 1920 - 420, esq: 60, dir: 1080 - 140};
const ZONA_CX = (ZONA.esq + ZONA.dir) / 2; // 500: o centro da zona, não do quadro

const inter = loadInter('normal', {weights: ['700', '800', '900'], subsets: ['latin']});
const serif = loadSerif('italic', {weights: ['400'], subsets: ['latin']});
const SANS = inter.fontFamily;
const SERIF = serif.fontFamily;
const BRANCO = '#F3EDE4';
const VERMELHO = '#FF2424';
const CREME = '#EDE3D3';
const TINTA = '#1A1512'; // texto da tela creme: contraste ~15:1
const VERMELHO_ESCURO = '#C8141B'; // vermelho sobre o creme: contraste ~5:1
const LETREIRO_COR = '#BFE8E0';
const E = {out: Easing.bezier(0.16, 1, 0.3, 1), in: Easing.bezier(0.7, 0, 0.84, 0)};
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) => interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

type Pal = {texto: string; de: number; ate: number};
const PS: Pal[] = P.palavras;
const limpa = (s: string) => s.toLowerCase().replace(/[.,!?]/g, '');
const idx = (texto: string, n = 1) => {
	let k = 0;
	for (let i = 0; i < PS.length; i++) if (limpa(PS[i].texto) === texto && ++k === n) return i;
	throw new Error(texto);
};
const w = (texto: string, n = 1) => PS[idx(texto, n)].de;

/* trechos: corte seco 2 quadros antes da palavra que abre a frase */
const c = (t: number) => t - 0.06;
const T = {
	bloco1: 0, // "Esse vídeo está sendo 100% editado pelo Claude." (frase-bloco, 3 linhas)
	base1: c(w('ele')), // legenda corrida; letreiro MODELOS atrás no "modelos"
	base2: c(w('para', 2)), // "para editar qualquer tipo de vídeo usando o Claude."
	base3: c(w('inclusive')), // "Inclusive, se você estiver no Instagram agora," (só legenda: fala coadjuvante)
	destaque: w('você', 2), // tela de destaque: "você está vendo apenas um desses modelos." (fala protagonista)
	previas: c(w('eu', 2)), // janela das prévias: "Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes."
	base3b: c(w('aqui')), // troca de enquadramento (só sem prévias), na virada de página da legenda
	bloco2: c(w('mas')), // virada: frase-bloco
	base4: w('como') + 0.04, // 0,1 s depois da página da legenda: o "edição" da virada fica 0,42 s
	cta: c(w('comenta')), // Comenta “EDIÇÃO”
	fecho: c(w('que', 2)), // dissolve para o preto
};
const DISSOLVE = 6 / FPS;
export const DESCE = 380; // com prévias, a câmera dele desce o necessário: rosto entre as prévias (até y 793) e a legenda

const ENQ: [number, number][] = [
	[T.bloco1, 1.0],
	[T.base1, 1.1],
	[T.base2, 1.18],
	[T.base3, 1.06],
	[T.previas, 1.0],
	[T.base3b, 1.14],
	[T.bloco2, 1.04],
	[T.base4, 1.16],
	[T.cta, 1.0],
];
const emPrevias = (t: number, previas: boolean) => previas && t >= T.previas && t < T.bloco2;
const enquadramento = (t: number, previas: boolean) => {
	if (emPrevias(t, previas)) return 1.0 + (t - T.previas) * 0.006;
	let i = 0;
	ENQ.forEach(([a], k) => {
		if (t >= a) i = k;
	});
	const [a, s] = ENQ[i];
	return s + (t - a) * 0.012; // zoom lento contínuo dentro do plano
};

/* ---------------------------------------------------------------- legenda corrida (2026-10-12, pedido do Jessé)
 * A legenda conta a história: cada trecho da fala aparece UMA vez, numa posição fixa só (LEG_Y, abaixo de todos os
 * destaques), em páginas de até 2 linhas ('/' quebra a linha). As palavras nascem com a fala; a página fica até a
 * próxima começar (ou até o destaque seguinte). Páginas escolhidas para nenhuma ficar < 1,5 s e nenhuma palavra
 * < 0,4 s visível (scripts/cobertura.mjs). Sem palavra colorida na legenda: destaque só no termo protagonista.
 * "modelos" (6,12) não entra na legenda: ele é o letreiro atrás da pessoa. */
// Posição de leitura medida do modelo (MODELO §2: no peito, logo abaixo do queixo). O queixo fica em ~y 940-990 nos
// planos (rosto.json + zoom); a legenda começa no peito, numa posição só no vídeo inteiro, nunca no pé do quadro.
export const LEG_Y = 1060;
// 2ª posição (só com prévias, só nas páginas da janela, entra e sai no corte): abaixo do queixo descido
export const LEG_Y2 = 1352;
export const QUEIXO_PREVIAS = R.queixo + DESCE;
const naJanela = (g: {de: number}) => g.de >= T.previas - 0.01 && g.de < T.bloco2;
const PULA = new Set([idx('modelos')]);
const PEDACOS: [number, string, number?][] = [
	// [primeira palavra, texto, até (s); sem "até", fica até a próxima página começar]
	[8, 'Ele foi criado / justamente para'],
	[13, 'te mostrar a diferença entre / vários que eu criei e melhorei'],
	[25, 'para editar qualquer tipo / de vídeo usando o Claude.'],
	[34, 'Inclusive, se você / estiver no Instagram agora,', T.destaque],
	[48, 'Eu posso até colocar / duas prévias rápidas'],
	[55, 'aqui em cima, aceleradas / em três vezes.', T.bloco2],
	[72, 'como esse e aprender a como / usar isso nos seus vídeos,', T.cta],
	[85, 'aqui embaixo que eu vou te / mandar na sua DM agora.', DURACAO + 1],
];
type Pagina = {linhas: {txt: string; i: number}[][]; de: number; ate: number; is: number[]};
export const PAGINAS: Pagina[] = PEDACOS.map(([i0, txt, ate], j) => {
	let i = i0;
	const linhas = txt.split(' / ').map((l) =>
		l.split(' ').map((p) => {
			while (PULA.has(i)) i++;
			if (PS[i].texto !== p) throw new Error(`pedaço "${txt}": "${p}" não bate com a fala ("${PS[i].texto}")`);
			return {txt: p, i: i++};
		})
	);
	return {linhas, de: c(PS[i0].de), ate: ate ?? c(PS[PEDACOS[j + 1][0]].de), is: linhas.flat().map((x) => x.i)};
});
const nasce = (t: number, d: number): React.CSSProperties => {
	const k = tw(t, d - 0.06, d + 0.1, 0, 1);
	return {display: 'inline-block', opacity: k, transform: `translateY(${(1 - k) * 10}px)`};
};
const Legenda: React.FC<{t: number; previas: boolean}> = ({t, previas}) => {
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	if (!pg) return null;
	const sai = tw(t, pg.ate - 0.08, pg.ate, 0, 1, E.in);
	return (
		<div style={{position: 'absolute', left: ZONA_CX - 540, width: 1080, top: previas && naJanela(pg) ? LEG_Y2 : LEG_Y, textAlign: 'center', opacity: 1 - sai, fontFamily: SANS, fontWeight: 800, fontSize: 60, letterSpacing: '-0.035em', lineHeight: 1.16, color: BRANCO, textShadow: '0 2px 4px rgba(0,0,0,0.65), 0 4px 22px rgba(0,0,0,0.6)'}}>
			{pg.linhas.map((l, j) => (
				<div key={j} style={{whiteSpace: 'nowrap'}}>
					{l.map((p, m) => (
						<span key={m} style={{...nasce(t, PS[p.i].de), marginLeft: m ? 15 : 0}}>
							{p.txt.replace(/,$/, '')}
						</span>
					))}
				</div>
			))}
		</div>
	);
};

/* ---------------------------------------------------------------- frase-bloco que se monta (MODELO §3.1) */
type Item = {txt: string; tam: number; serif?: boolean; vermelho?: boolean; quebra?: boolean; sobe?: boolean; em?: number; pincel?: boolean};
const Bloco: React.FC<{t: number; itens: Item[]; de: number; ate: number; top: number; left?: number; cor?: string; sombra?: string; chicote?: boolean; vermelhoCor?: string}> = ({
	t,
	itens,
	de,
	ate,
	top,
	left = ZONA.esq + 24,
	cor = BRANCO,
	sombra = '0 6px 30px rgba(0,0,0,0.45)',
	chicote = true,
	vermelhoCor = VERMELHO,
}) => {
	if (t < de || t >= ate) return null;
	const saida = chicote ? tw(t, ate - 0.07, ate, 0, 1, E.in) : 0;
	let cursor = PS.findIndex((p) => p.de >= de - 0.01);
	const linhas: React.ReactNode[][] = [[]];
	itens.forEach((it, k) => {
		let ini: number;
		if (it.em !== undefined) ini = it.em; // peça que não é fala (o nome do modelo)
		else {
			ini = PS[cursor].de;
			cursor += it.txt.split(' ').length;
		}
		if (it.quebra && k) linhas.push([]);
		const marginLeft = linhas[linhas.length - 1].length ? (it.tam < 80 ? 10 : 16) : 0;
		if (it.pincel) {
			// palavra-destaque caprichada (MODELO §3, pedido avulso do corte 2): entra maior e desfocada, assenta,
			// ganha brilho vermelho e um traço de pincel que se desenha por baixo
			const e = tw(t, ini - 0.02, ini + 0.22, 0, 1);
			const traco = tw(t, ini + 0.12, ini + 0.5, 0, 1);
			linhas[linhas.length - 1].push(
				<span
					key={k}
					style={{
						display: 'inline-block',
						position: 'relative',
						marginLeft,
						fontFamily: SERIF,
						fontWeight: 400,
						fontSize: it.tam,
						lineHeight: 0.92,
						color: VERMELHO,
						transform: `scale(${1.35 - 0.35 * e})`,
						transformOrigin: '30% 70%',
						filter: `blur(${(1 - e) * 10}px)`,
						opacity: t < ini - 0.02 ? 0 : Math.min(1, e * 2),
						textShadow: '0 0 3px rgba(0,0,0,0.7), 0 0 34px rgba(255,36,36,0.5)',
					}}
				>
					{it.txt}
					<svg style={{position: 'absolute', left: '-3%', bottom: '-0.04em', width: '106%', height: '0.2em', overflow: 'visible'}} viewBox="0 0 100 10" preserveAspectRatio="none">
						<path d="M2 7 C 30 2, 65 2, 98 5" fill="none" stroke={VERMELHO} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - traco} style={{strokeWidth: 9}} vectorEffect="non-scaling-stroke" />
					</svg>
				</span>
			);
			return;
		}
		const e = tw(t, ini - 0.03, ini + 0.12, 0, 1);
		linhas[linhas.length - 1].push(
			<span
				key={k}
				style={{
					display: 'inline-block',
					fontFamily: it.serif ? SERIF : SANS,
					fontWeight: it.serif ? 400 : 900,
					fontSize: it.tam,
					letterSpacing: it.serif ? '-0.01em' : '-0.055em',
					lineHeight: 0.92,
					color: it.vermelho ? vermelhoCor : cor,
					verticalAlign: it.sobe ? 'top' : 'baseline',
					marginLeft,
					opacity: e,
					filter: `blur(${(1 - e) * 14}px)`,
					transform: `translateY(${(1 - e) * 30}px)`,
					textShadow: it.vermelho && vermelhoCor === VERMELHO ? '0 0 3px rgba(0,0,0,0.6), 0 6px 30px rgba(0,0,0,0.5)' : undefined,
				}}
			>
				{it.txt}
			</span>
		);
	});
	return (
		<div style={{position: 'absolute', left, top, width: 940, transform: `translateX(${-saida * 18}px)`, filter: `blur(${saida * 22}px)`, opacity: 1 - saida * 0.6, textShadow: sombra}}>
			{linhas.map((l, i) => (
				<div key={i} style={{whiteSpace: 'nowrap'}}>
					{l}
				</div>
			))}
		</div>
	);
};

/* ---------------------------------------------------------------- letreiro gigante atrás da pessoa (MODELO §3.3) */
const PALAVRA = 'MODELOS';
const LET = {de: c(w('modelos')), ate: T.base2};
const Letreiro: React.FC<{t: number; fundoCor: boolean}> = ({t, fundoCor}) => {
	if (t < LET.de || t >= LET.ate) return null;
	const ini = w('modelos');
	const fim = PS[idx('modelos')].ate;
	const passo = (fim - ini - 0.1) / PALAVRA.length; // letra por letra no tempo da palavra
	const x = ZONA.esq + 30 - (t - ini) * 12; // deriva curta, sem sair da zona
	return (
		<div style={{position: 'absolute', top: ZONA.topo + 10, left: x, whiteSpace: 'nowrap', fontFamily: SANS, fontWeight: 900, fontSize: 176, letterSpacing: '-0.05em', lineHeight: 1}}>
			{PALAVRA.split('').map((l, i) => {
				const e = tw(t, ini + i * passo, ini + i * passo + 0.14, 0, 1);
				return (
					// sem a cor no fundo, a parede é bege clara: o letreiro vai no vermelho do modelo para ler
					<span key={i} style={{display: 'inline-block', color: fundoCor ? LETREIRO_COR : VERMELHO, opacity: 0.94 * e, filter: `blur(${(1 - e) * 12}px)`, transform: `translateY(${(1 - e) * 40}px)`}}>
						{l}
					</span>
				);
			})}
		</div>
	);
};

/* ---------------------------------------------------------------- o vídeo: cor da gravação; pessoa recortada por cima no letreiro
 * fundoCor (opção, desligada por padrão): tinge o fundo de vinho na abertura e de azul petróleo no plano do letreiro. */
const CHICOTES = [T.bloco2, T.cta]; // chicote borrado para entrar no momento de ênfase (MODELO §4)
const Video: React.FC<{t: number; s: number; previas: boolean; fundoCor: boolean}> = ({t, s, previas, fundoCor}) => {
	if (t >= T.fecho + DISSOLVE) return null; // daqui em diante é o preto (e a gravação acaba em 30,2 s)
	const ch = CHICOTES.map((a) => (t >= a && t < a + 3 / FPS ? 1 - (t - a) / (3 / FPS) : 0)).reduce((x, y) => Math.max(x, y), 0);
	const filtro = ch ? `blur(${ch * 16}px)` : 'none';
	const vinho = fundoCor && t < T.base1;
	const frio = fundoCor && t >= T.base1 && t < T.base2;
	const pessoa = vinho || frio || (t >= LET.de && t < LET.ate);
	const desce = emPrevias(t, previas) ? DESCE : 0; // 3ª rodada: ele nítido embaixo, topo sobre o próprio vídeo desfocado
	const camada: React.CSSProperties = {transform: `translate(${ch * 90}px, ${desce}px) scale(${s})`, transformOrigin: '540px 700px'};
	const mascara = desce ? `linear-gradient(to bottom, transparent 0px, transparent ${DESCE}px, black ${DESCE + 160}px)` : undefined;
	return (
		<AbsoluteFill style={{filter: filtro}}>
			{desce > 0 && (
				<AbsoluteFill style={{transform: 'scale(1.5)', filter: 'blur(36px) brightness(0.32)'}}>
					<OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />
				</AbsoluteFill>
			)}
			<AbsoluteFill style={{...camada, WebkitMaskImage: mascara, maskImage: mascara}}>
				<OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />
				{vinho && <AbsoluteFill style={{background: '#5A0F14', mixBlendMode: 'color', opacity: 0.9}} />}
				{vinho && <AbsoluteFill style={{background: 'rgba(30,4,6,0.58)'}} />}
				{frio && <AbsoluteFill style={{background: '#123F4C', mixBlendMode: 'color', opacity: 0.92}} />}
				{frio && <AbsoluteFill style={{background: 'rgba(4,20,28,0.62)'}} />}
			</AbsoluteFill>
			<Letreiro t={t} fundoCor={fundoCor} />
			{pessoa && (
				<AbsoluteFill style={camada}>
					<OffthreadVideo muted transparent src={staticFile('pessoa.webm')} style={{width: 1080, height: 1920}} />
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- tela de destaque (MODELO §3.7): creme com tinta escura
 * Só na fala protagonista ("você está vendo apenas um desses modelos."), sempre com contraste legível. */
const TelaCreme: React.FC<{t: number}> = ({t}) => {
	if (t < T.destaque - DISSOLVE || t >= T.previas) return null;
	const k = Math.min(tw(t, T.destaque - DISSOLVE, T.destaque, 0, 1, Easing.linear), 1 - tw(t, T.previas - DISSOLVE, T.previas, 0, 1, Easing.linear));
	return <AbsoluteFill style={{background: CREME, opacity: k}} />;
};

/* ---------------------------------------------------------------- fecho: dissolve para o preto (MODELO §6) */
const Preto: React.FC<{t: number}> = ({t}) => {
	if (t < T.fecho) return null;
	return <AbsoluteFill style={{background: '#000', opacity: tw(t, T.fecho, T.fecho + DISSOLVE, 0, 1, Easing.linear)}} />;
};

/* ---------------------------------------------------------------- os blocos (no máximo 4 linhas cada: 'quebra' abre linha) */
const topoBloco = (sc: number) => Math.round(700 + (R.queixo + 50 - 700) * sc);
type BlocoDef = {nome: string; de: number; ate: number; top: number; left?: number; cor?: string; sombra?: string; chicote?: boolean; vermelhoCor?: string; itens: Item[]};
export const BLOCOS: BlocoDef[] = [
	{
		nome: 'abertura',
		de: 0,
		ate: T.base1,
		top: topoBloco(1.0),
		itens: [
			{txt: 'Esse vídeo está sendo', tam: 84},
			{txt: '100%', tam: 150, quebra: true},
			{txt: 'editado', tam: 114},
			{txt: 'pelo', tam: 84, quebra: true},
			{txt: 'Claude.', tam: 190, serif: true, vermelho: true},
		],
	},
	{
		nome: 'tela de destaque',
		de: T.destaque,
		ate: T.previas,
		top: 640,
		left: 90,
		cor: TINTA,
		sombra: 'none',
		chicote: false,
		vermelhoCor: VERMELHO_ESCURO,
		itens: [
			{txt: 'você está vendo', tam: 96},
			{txt: 'apenas um desses', tam: 96, quebra: true},
			{txt: 'modelos.', tam: 250, serif: true, vermelho: true, quebra: true},
		],
	},
	{
		nome: 'virada',
		de: T.bloco2,
		ate: T.base4,
		top: topoBloco(1.04),
		itens: [
			{txt: 'Mas se você quiser', tam: 80},
			{txt: 'realmente ver outros', tam: 80, quebra: true},
			{txt: 'modelos', tam: 210, serif: true, vermelho: true, quebra: true},
			{txt: 'de edição', tam: 110, quebra: true},
		],
	},
	{
		nome: 'Comenta “EDIÇÃO”',
		de: T.cta,
		ate: Infinity,
		top: 1222,
		chicote: false,
		itens: [
			{txt: 'Comenta', tam: 92},
			{txt: '“edição”', tam: 180, pincel: true, quebra: true},
		],
	},
];
export const linhasDoBloco = (b: BlocoDef) => 1 + b.itens.filter((it, k) => it.quebra && k).length;

/* ---------------------------------------------------------------- conferência (scripts/cobertura.mjs) */
export type Exib = {nome: string; tipo: 'destaque' | 'legenda'; is: number[]; de: number; ate: number; y?: number; linhas: number};
const palavrasDoBloco = (b: BlocoDef) => {
	const i0 = PS.findIndex((p) => p.de >= b.de - 0.01);
	const n = b.itens.reduce((q, it) => q + it.txt.split(' ').length, 0);
	return Array.from({length: n}, (_, k) => i0 + k);
};
export const exibicoes = (): Exib[] => [
	...BLOCOS.map((b) => ({nome: b.nome, tipo: 'destaque' as const, is: palavrasDoBloco(b), de: b.de, ate: Math.min(b.ate, DURACAO), linhas: linhasDoBloco(b)})),
	{nome: 'letreiro MODELOS', tipo: 'destaque', is: [idx('modelos')], de: LET.de, ate: LET.ate, linhas: 1},
	...PAGINAS.map((g) => ({nome: g.linhas.map((l) => l.map((x) => x.txt).join(' ')).join(' / '), tipo: 'legenda' as const, is: g.is, de: g.de, ate: Math.min(g.ate, DURACAO), y: naJanela(g) ? LEG_Y2 : LEG_Y, linhas: g.linhas.length})),
];
/** palavras da fala escritas na tela no tempo t (a palavra conta a partir de quando nasce) */
export const palavrasNaTela = (t: number): number[] => {
	const vis: number[] = [];
	for (const e of exibicoes()) if (t >= e.de && t < e.ate) for (const i of e.is) if (t >= PS[i].de - 0.02) vis.push(i);
	return vis;
};

/* ---------------------------------------------------------------- prévias de dois outros modelos em cima (BRIEF, momento 2) */
export const PreviasEmCima: React.FC<{t: number; nomes: [string, string]; soTexto?: boolean}> = ({t, nomes, soTexto}) => {
	if (t < T.previas || t >= T.bloco2) return null;
	// 3ª rodada: 300x533 no alto da zona (x 185 a 815, y 260 a 793), o rosto dele nítido embaixo
	const W = 300;
	const H = Math.round((W * 16) / 9);
	const gap = 30;
	const x0 = ZONA_CX - (2 * W + gap) / 2;
	const de = Math.round(T.previas * FPS);
	const dur = Math.round((T.bloco2 - T.previas) * FPS) + 1;
	return (
		<>
			{(['previa1.mp4', 'previa2.mp4'] as const).map((arq, i) => {
				const e = tw(t, T.previas + i * 0.1, T.previas + i * 0.1 + 0.2, 0, 1);
				return (
					<div
						key={arq}
						style={{
							position: 'absolute',
							left: x0 + i * (W + gap),
							top: ZONA.topo + 10,
							width: W,
							height: H,
							borderRadius: 14,
							overflow: 'hidden',
							background: soTexto ? 'transparent' : '#000',
							boxShadow: soTexto ? 'none' : '0 18px 50px rgba(0,0,0,0.55)',
							opacity: e,
							filter: `blur(${(1 - e) * 14}px)`,
							transform: `translateY(${(1 - e) * 30}px)`,
						}}
					>
						{!soTexto && <Sequence from={de} durationInFrames={dur} layout="none">
							<OffthreadVideo muted src={staticFile(arq)} style={{width: W, height: H, objectFit: 'cover'}} />
						</Sequence>}
						<div style={{display: soTexto ? 'none' : undefined, position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.78))'}} />
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								bottom: 22,
								textAlign: 'center',
								fontFamily: SANS,
								fontWeight: 800,
								fontSize: 34,
								letterSpacing: '-0.04em',
								color: BRANCO,
								textShadow: '0 3px 14px rgba(0,0,0,0.6)',
							}}
						>
							{nomes[i]}
						</div>
					</div>
				);
			})}
		</>
	);
};

export const Corte: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], fundoCor = false, soTexto = false}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const s = enquadramento(t, previas);
	return (
		// soTexto: só os textos sobre fundo transparente, para o check da zona segura (scripts/cobertura.mjs)
		<AbsoluteFill style={{background: soTexto ? 'transparent' : '#000'}}>
			{!soTexto && <Video t={t} s={s} previas={previas} fundoCor={fundoCor} />}
			{soTexto && <Letreiro t={t} fundoCor={fundoCor} />}
			{previas && <PreviasEmCima t={t} nomes={nomesPrevias} soTexto={soTexto} />}
			{!soTexto && <TelaCreme t={t} />}
			{!soTexto && <Preto t={t} />}
			{BLOCOS.map(({nome, itens, ...b}) => (
				<Bloco key={nome} t={t} itens={itens} {...b} />
			))}
			<Legenda t={t} previas={previas} />
		</AbsoluteFill>
	);
};
