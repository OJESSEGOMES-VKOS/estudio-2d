import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, continueRender, delayRender, getStaticFiles, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import PB from './palavras.json';
import ROSTO_T from './rosto.json';

/**
 * Molde do storypodcast01 (regras em ../../modelos/storypodcast01/storypodcast01.md), feito na vitrine dos modelos.
 * Revisão 2026-10-12 (correções do Jessé): 6 cortes em vez de 10 (só com motivo), legenda padrão em 2 posições fixas
 * (LEG_Y e LEG_Y2), todo pedaço >= 1,5 s, duas fontes (Poppins 400/600 + Anton), sem o nome do modelo na tela,
 * música e tratamento de fundo como props (desligados por padrão). Plano em ../plano.md, checador em scripts/cobertura.mjs.
 */
export const FPS = 30;
const W = 1080;
const H = 1920;

const pop = loadPoppins('normal', {weights: ['400', '600'], subsets: ['latin']});
const ant = loadAnton('normal', {weights: ['400'], subsets: ['latin']});
const POP = pop.fontFamily;
const ANT = ant.fontFamily;
export const FONTES = [POP, ANT]; // regra do modelo: no máximo 2 fontes e 1 variação de peso (Poppins 600)
const ESTREITA = 0.88; // Anton -> proporção da condensada das refs (largura/maiúscula: AFASTAR 3,71 -> 3,24)

/* identidade do modelo (storypodcast01.md, seção 4, "A cor é o sentido") */
const COR = {giz: '#F6F6F6', dor: '#FD1701', sonho: '#0A64FC', breu: '#0A0D0F'};
const FS = 46; // corpo da pequena (storypodcast01.md, seção 5: Poppins 46 px)

/* legenda padrão: 2 posições fixas (topo da caixa). LEG_Y no peito; LEG_Y2 só quando um destaque ou o rosto
   (prévias, câmera descida) ocupa a 1ª. Zona segura 9:16 das redes. */
export const LEG_Y = 1050;
export const LEG_Y2 = 1400;
export const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};

const E = {out: Easing.bezier(0.16, 1, 0.3, 1), io: Easing.bezier(0.45, 0, 0.55, 1)};
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export type Props = {previas: boolean; nomesPrevias: [string, string]; musica?: boolean; efeitoFundo?: boolean};

type Pal = {texto: string; de: number; ate: number};
const PS: Pal[] = (PB as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));
if (!PS.length) throw new Error('src/palavras.json está vazio: rode tools/novo-video.py (ou tools/preparar.py) na gravação.');
/* corte seco FOLGA s depois da última palavra (na vitrine: "agora." acaba em 29,63 -> 29,83) */
const FOLGA = 0.2;
export const DURACAO = Number((PS[PS.length - 1].ate + FOLGA).toFixed(2));
/** texto do plano x fala: sem maiúscula, acento nem pontuação (o Whisper varia) */
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
/** plano que não bate com a fala: para ao carregar e diz em português qual lista refazer (nada de TypeError) */
const errPlano = (lista: string, oque: string) =>
	new Error(`O plano de src/Reel.tsx não bate com a fala de src/palavras.json (${PS.length} palavras, de 0 a ${PS.length - 1}). Na lista ${lista}: ${oque}. Refaça o plano para a fala nova (modelos/storypodcast01/storypodcast01.md, seção 9, passo 4).`);
const de = (i: number, lista = 'CORTE') => {
	if (!PS[i]) throw errPlano(lista, `a palavra nº ${i} não existe`);
	return PS[i].de;
};
const c = (i: number, lista = 'CORTE') => de(i, lista) - 0.06;
const fr = (s: number) => Math.round(s * FPS);

/* ================================================================ O PLANO (preso à fala; num vídeo novo, refazer CORTE,
 * PLANOS, CHICOTE, PECAS e os eventos de scripts/trilha.py). Os números são índices de palavras de src/palavras.json. */
/* ---------------------------------------------------------------- planos: corte só com motivo
 * pb: o close extremo em P&B com clarões (uma vez, no trecho de custo); previas: o plano onde moram as prévias (com a
 * prop previas, a câmera desce e as prévias entram em cima). Sem plano marcado, não há P&B nem janela de prévias. */
type Plano = {de: number; zoom: number; fx: number; fy: number; pb?: boolean; previas?: boolean};
const CORTE = {
	b: c(20), // "que eu criei": sai do bloco da abertura para o close do destaque QUALQUER
	c: c(34), // "Inclusive": virada
	d: de(40) + 0.4, // "você está vendo" -> P&B ("agora," fica 0,4 s; o corte cai junto do "você")
	e: c(48), // "Eu posso até" -> prévias
	f: c(62), // "Mas": virada
	g: c(83), // "comenta": chamada (chicote)
};
const PLANOS: Plano[] = [
	{de: 0, zoom: 1.45, fx: 0.29, fy: 0.31}, // A médio, rosto à esquerda (blocos à direita)
	{de: CORTE.b, zoom: 1.65, fx: 0.5, fy: 0.33}, // B close (QUALQUER)
	{de: CORTE.c, zoom: 1.0, fx: 0.5, fy: 0.34}, // C aberto
	{de: CORTE.d, zoom: 2.3, fx: 0.58, fy: 0.4, pb: true}, // D close extremo P&B
	{de: CORTE.e, zoom: 1.1, fx: 0.5, fy: 0.33, previas: true}, // E médio aberto (prévias)
	{de: CORTE.f, zoom: 1.45, fx: 0.72, fy: 0.31}, // F médio, rosto à direita (blocos à esquerda)
	{de: CORTE.g, zoom: 1.25, fx: 0.5, fy: 0.3}, // G médio centrado
];
const I_PREV = PLANOS.findIndex((p) => p.previas); // -1: sem janela de prévias
export const CORTES = PLANOS.slice(1).map((p) => p.de);
const CORTES_F = CORTES.map(fr);
const planoEm = (f: number) => {
	let i = 0;
	PLANOS.forEach((p, k) => {
		if (f >= fr(p.de)) i = k;
	});
	return i;
};
const fimPlano = (i: number) => (i + 1 < PLANOS.length ? fr(PLANOS[i + 1].de) : fr(DURACAO));
const mediana = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const ROSTO_PLANO = PLANOS.map((p, i) => {
	const s = (ROSTO_T as number[][]).filter(([t]) => t >= p.de - 0.1 && t < fimPlano(i) / FPS);
	return {cx: mediana(s.map((r) => r[1])), cy: mediana(s.map((r) => r[2]))};
});
/* a janela das prévias: o plano marcado com previas, até o corte seguinte */
const JANELA_PREVIAS = I_PREV < 0 ? null : {de: PLANOS[I_PREV].de, ate: I_PREV + 1 < PLANOS.length ? PLANOS[I_PREV + 1].de : DURACAO};
export const PREVIAS = JANELA_PREVIAS;
/* chicote de 1 quadro na entrada da chamada; null desliga */
const CHICOTE = CORTE.g as number | null;
const DESCE = 560; // com prévias, a câmera dele desce para abrir o terço de cima

const camera = (f: number, previas: boolean) => {
	const i = planoEm(f);
	const p = PLANOS[i];
	if (previas && i === I_PREV) return {s: 1, tx: 0, ty: DESCE};
	let s = p.zoom;
	if (p.pb) s *= tw(f, fr(p.de), fr(p.de) + 9, 0.96, 1, E.out); // avanço leve junto com a entrada do P&B
	const {cx, cy} = ROSTO_PLANO[i];
	const tx = Math.min(0, Math.max(W - W * s, p.fx * W - cx * W * s));
	const ty = Math.min(0, Math.max(H - H * s, p.fy * H - cy * H * s));
	return {s, tx, ty};
};

/* ---------------------------------------------------------------- medidas de fonte (canvas, depois das fontes carregadas) */
let ctx: CanvasRenderingContext2D | null = null;
const cache = new Map<string, TextMetrics>();
const medir = (font: string, txt: string) => {
	const k = font + '|' + txt;
	let m = cache.get(k);
	if (!m) {
		ctx ??= document.createElement('canvas').getContext('2d')!;
		ctx.font = font;
		m = ctx.measureText(txt);
		cache.set(k, m);
	}
	return m;
};
type Voz = 'p' | 'b';
const fonteDe = (voz: Voz | 'k', tam: number) => (voz === 'k' ? `400 ${tam}px "${ANT}"` : `${voz === 'b' ? 600 : 400} ${tam}px "${POP}"`);
const larg = (voz: Voz | 'k', tam: number, txt: string) => medir(fonteDe(voz, tam), txt).width * (voz === 'k' ? ESTREITA : 1);
/* topo da linha de base dentro de uma caixa com line-height = tam (modelo de meia-entrelinha do CSS) */
const base = (voz: Voz | 'k', tam: number) => {
	const m = medir(fonteDe(voz, tam), 'Hg');
	return (tam - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
};
const CAP = () => medir(fonteDe('k', 100), 'H').actualBoundingBoxAscent / 100; // altura da maiúscula da Anton por px
const ACENTO = /[ÊÉÍÁÓÚÃÕÂÔ]/;

const useFontes = () => {
	const [ok, setOk] = useState(false);
	const [h] = useState(() => delayRender('fontes'));
	useEffect(() => {
		Promise.all([pop.waitUntilDone(), ant.waitUntilDone()]).then(() => {
			setOk(true);
			continueRender(h);
		});
	}, [h]);
	return ok;
};

/* ---------------------------------------------------------------- definição do texto */
type Al = 'esq' | 'dir' | 'meio';
type Parte = {txt: string; voz: Voz};
type LinhaP = {k: 'p'; i0: number; partes: Parte[]; al: Al};
type Tom = 'azul' | 'vermelho' | 'branco';
type LinhaK = {k: 'chave'; txt: string; i: number; t0: number; cor: Tom; al: Al; casar?: boolean; cap?: number; rapida?: boolean};
type Linha = LinhaP | LinhaK;
/* bloco = destaque (palavra gigante + pequenas). legenda = texto padrão, só em LEG_Y ou LEG_Y2. */
type Bloco = {tipo: 'bloco'; de: number; ate: number; x: number; largura?: number; ladoDir?: boolean; top: number; linhas: Linha[]};
type Legenda = {tipo: 'legenda'; de: number; ate: number; pos: 1 | 2; linhas: LinhaP[]};
type Peca = (Bloco | Legenda) & {prev?: Partial<Bloco> & {pos?: 1 | 2}};

const p = (txt: string, voz: Voz = 'p'): Parte => ({txt, voz});
const P = (i0: number, al: Al, ...partes: Parte[]): LinhaP => ({k: 'p', i0, al, partes});
const K = (txt: string, i: number, cor: Tom, al: Al, o: Partial<LinhaK> = {}): LinhaK => ({k: 'chave', txt, i, t0: de(i, 'PECAS'), cor, al, ...o});
const antes = (i: number) => de(i, 'PECAS') - 0.03;
const ler = (i: number) => de(i, 'PECAS') + 0.4; // a última palavra de um pedaço fica pelo menos 0,4 s

const PECAS: Peca[] = [
	/* A: abertura */
	{tipo: 'bloco', de: 0, ate: antes(8), x: 0.87, ladoDir: true, top: 0.357, linhas: [
		P(0, 'dir', p('esse vídeo está sendo')),
		K('100%', 4, 'azul', 'esq', {casar: true}),
		P(5, 'dir', p('editado pelo')),
		K('CLAUDE', 7, 'branco', 'dir', {cap: 0.072, rapida: true}),
	]},
	{tipo: 'legenda', de: antes(8), ate: ler(14), pos: 1, linhas: [P(8, 'esq', p('Ele foi criado justamente')), P(12, 'dir', p('para te mostrar', 'b'))]},
	{tipo: 'bloco', de: antes(15), ate: CORTE.b, x: 0.87, ladoDir: true, largura: 380, top: 0.357, linhas: [
		P(15, 'esq', p('a')),
		K('DIFERENÇA', 16, 'azul', 'esq', {casar: true}),
		P(17, 'dir', p('entre vários')),
		K('MODELOS', 19, 'branco', 'esq', {casar: true}),
	]},
	/* B: close */
	{tipo: 'legenda', de: CORTE.b, ate: CORTE.b + 1.53, pos: 1, linhas: [P(20, 'esq', p('que eu criei e'), p('melhorei', 'b'))]},
	{tipo: 'bloco', de: antes(25), ate: CORTE.c, x: 0.5, largura: 600, top: 0.6, linhas: [
		P(25, 'meio', p('para editar')),
		K('QUALQUER', 27, 'azul', 'meio', {casar: true}),
		P(28, 'meio', p('tipo de vídeo usando o Claude')),
	]},
	/* C: aberto */
	{tipo: 'legenda', de: CORTE.c, ate: CORTE.d, pos: 1, linhas: [P(34, 'esq', p('Inclusive, se você estiver')), P(38, 'dir', p('no Instagram agora', 'b'))]},
	/* D: P&B, sem o nome do modelo escrito */
	{tipo: 'bloco', de: CORTE.d, ate: CORTE.e, x: 0.07, top: 0.566, linhas: [
		P(41, 'esq', p('você está vendo')),
		K('APENAS', 44, 'vermelho', 'esq', {cap: 0.085}),
		P(45, 'esq', p('um desses modelos.')),
	]},
	/* E: janela das prévias (com prévias a câmera desce e a legenda vai para LEG_Y2) */
	{tipo: 'legenda', de: CORTE.e, ate: ler(57), pos: 1, prev: {pos: 2}, linhas: [P(48, 'esq', p('Eu posso até colocar duas')), P(53, 'dir', p('prévias rápidas aqui em cima', 'b'))]},
	{tipo: 'bloco', de: ler(57), ate: CORTE.f, x: 0.5, largura: 560, top: 0.6, prev: {top: 0.7, largura: 400}, linhas: [
		P(58, 'meio', p('aceleradas em')),
		K('TRÊS VEZES', 60, 'branco', 'meio', {casar: true}),
	]},
	/* F: o convite; destaque só no protagonista ("outros modelos de EDIÇÃO") */
	{tipo: 'legenda', de: CORTE.f, ate: antes(68), pos: 1, linhas: [P(62, 'esq', p('Mas se você quiser')), P(66, 'dir', p('realmente ver'))]},
	{tipo: 'bloco', de: antes(68), ate: ler(73), x: 0.5, largura: 560, top: 0.6, linhas: [
		P(68, 'meio', p('outros modelos de', 'b')),
		K('EDIÇÃO', 71, 'azul', 'meio', {casar: true}),
		P(72, 'meio', p('como esse')),
	]},
	{tipo: 'bloco', de: ler(73), ate: CORTE.g, x: 0.065, largura: 420, top: 0.357, linhas: [
		P(74, 'esq', p('e')),
		K('APRENDER', 75, 'azul', 'esq', {casar: true}),
		P(76, 'dir', p('a como usar isso')),
		P(80, 'dir', p('nos seus vídeos')),
	]},
	/* G: chamada. Fixo só o comando (comenta "EDIÇÃO"), o resto na legenda corrida em LEG_Y2 */
	{tipo: 'bloco', de: CORTE.g, ate: DURACAO, x: 0.5, largura: 520, top: LEG_Y / H, linhas: [
		P(83, 'meio', p('comenta')),
		K('“EDIÇÃO”', 84, 'azul', 'meio', {casar: true}),
	]},
	{tipo: 'legenda', de: antes(85), ate: DURACAO, pos: 2, linhas: [P(85, 'esq', p('aqui embaixo que eu vou')), P(90, 'dir', p('te mandar na sua'), p('DM', 'b'), p('agora.'))]},
];

/* conferências: o texto bate com a fala (sem maiúscula, acento nem pontuação); nada atravessa corte */
const palavrasDe = (l: Linha) => (l.k === 'p' ? l.partes.flatMap((q) => q.txt.split(' ')) : l.txt.split(' '));
const indicesDe = (l: Linha) => palavrasDe(l).map((_, j) => (l.k === 'p' ? l.i0 : l.i) + j);
for (const pc of PECAS) {
	for (const l of pc.linhas)
		palavrasDe(l).forEach((w, j) => {
			const i = indicesDe(l)[j];
			if (!PS[i]) throw errPlano('PECAS', `"${palavrasDe(l).join(' ')}" passa da última palavra da fala`);
			if (norm(PS[i].texto) !== norm(w)) throw errPlano('PECAS', `em "${palavrasDe(l).join(' ')}", "${w}" não bate com a palavra ${i} da fala ("${PS[i].texto}")`);
		});
	if (CORTES_F.some((k) => k > fr(pc.de) && k < fr(pc.ate)))
		throw errPlano('PECAS', `a peça "${pc.linhas.flatMap(palavrasDe).join(' ')}" (${pc.de.toFixed(2)}-${pc.ate.toFixed(2)} s) atravessa um corte de PLANOS: acabe-a no corte ou divida-a`);
}

/* ---------------------------------------------------------------- animação */
const surge = (t: number, t0: number): React.CSSProperties => {
	const e = tw(t, t0 - 0.03, t0 + 0.1, 0, 1, E.io);
	return {opacity: e, filter: e < 1 ? `blur(${(1 - e) * 7}px)` : undefined};
};
/* saída: pisca 3 vezes nos últimos 6 quadros (~0,2 s) e some (só quando não há corte) */
const PISCA_SAIDA = [1, 0, 1, 0, 1, 0];
const visivelSaida = (f: number, fAte: number) => {
	if (CORTES_F.includes(fAte) || fAte >= fr(DURACAO)) return f < fAte;
	const k = f - (fAte - PISCA_SAIDA.length);
	if (k < 0) return true;
	return k < PISCA_SAIDA.length ? PISCA_SAIDA[k] === 1 : false;
};

const estiloCor = (cor: Tom, tam: number): React.CSSProperties => {
	if (cor === 'azul') return {color: COR.sonho, textShadow: `0 0 ${tam * 0.09}px rgba(10,100,252,0.95), 0 0 ${tam * 0.22}px rgba(10,100,252,0.7), 0 0 ${tam * 0.45}px rgba(10,100,252,0.35)`};
	if (cor === 'vermelho') return {color: COR.dor, textShadow: '0 4px 22px rgba(0,0,0,0.45)'};
	return {color: '#E6E3E5', backgroundImage: 'linear-gradient(180deg, #EEEDF0 10%, #D6CFCE 95%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'};
};

/** palavra-chave: letras fora de ordem, cada uma do desfoque forte para nítida em 4 quadros; depois algumas piscam e voltam */
const Chave: React.FC<{txt: string; t0: number; cor: Tom; tam: number; t: number; rapida?: boolean; limite?: number; semente: string}> = ({txt, t0, cor, tam, t, rapida, limite = 99, semente}) => {
	const letras = [...txt];
	const n = letras.length;
	const ordem = letras.map((_, i) => i).sort((a, b) => random(`${semente}o${a}`) - random(`${semente}o${b}`));
	const passo = rapida ? 0 : Math.min(0.065, 0.3 / Math.max(1, n - 1));
	return (
		<span style={{whiteSpace: 'pre', filter: cor === 'branco' ? 'drop-shadow(0 4px 16px rgba(0,0,0,0.45))' : undefined}}>
			{letras.map((ch, i) => {
				if (ch === ' ') return <span key={i}> </span>;
				const on = t0 - 0.03 + ordem.indexOf(i) * passo;
				let ultimo = on;
				let apagada = false;
				if (!rapida && t0 + 0.7 <= limite) {
					const janelas = [
						[0.36, 0.43],
						[0.49, 0.54],
					];
					janelas.forEach(([a, b], j) => {
						if (random(`${semente}p${i}${j}`) < 0.3) {
							if (t >= t0 + a && t < t0 + b) apagada = true;
							if (t >= t0 + b) ultimo = t0 + b;
						}
					});
				}
				const dur = rapida ? 0.15 : 0.1;
				const e = tw(t, ultimo, ultimo + dur, 0, 1, E.io);
				return (
					<span key={i} style={{opacity: apagada || t < on ? 0 : e, filter: e < 1 ? `blur(${(1 - e) * tam * 0.12}px)` : undefined, ...estiloCor(cor, tam), display: 'inline'}}>
						{ch}
					</span>
				);
			})}
		</span>
	);
};

/* uma linha pequena com cada palavra surgindo no tempo da fala */
const Pequena: React.FC<{l: LinhaP; t: number}> = ({l, t}) => {
	let k = l.i0;
	return (
		<>
			{l.partes.map((q, j) =>
				q.txt.split(' ').map((w, m) => {
					const t0 = PS[k++].de;
					return (
						<span key={`${j}-${m}`} style={{fontFamily: POP, fontWeight: q.voz === 'b' ? 600 : 400, fontSize: FS, color: COR.giz, ...surge(t, t0)}}>
							{(j || m ? ' ' : '') + w}
						</span>
					);
				})
			)}
		</>
	);
};
const largParte = (l: LinhaP) => l.partes.reduce((w, q, j) => w + larg(q.voz, FS, (j ? ' ' : '') + q.txt), 0);
const ASC = FS * 0.76;
const DESC = FS * 0.24;
const SOMBRA_P = '0 2px 6px rgba(0,0,0,0.55), 0 3px 18px rgba(0,0,0,0.45)';

/* ---------------------------------------------------------------- bloco (destaque) */
type Posta = {linha: Linha; esq: number; larg: number; baseY: number; tam: number; voz: Voz | 'k'; y0: number; y1: number};
const montarBloco = (b: Bloco): Posta[] => {
	const primeira = b.linhas.find((l) => l.k === 'p') as LinhaP;
	const largura = b.largura ?? largParte(primeira);
	const L = b.ladoDir ? b.x * W - largura : b.x === 0.5 ? (W - largura) / 2 : b.x * W;
	const R = L + largura;
	const xDe = (al: Al, w: number) => (al === 'esq' ? L : al === 'dir' ? R - w : L + (largura - w) / 2);
	const cap = CAP();
	const out: Posta[] = [];
	let y = b.top * H;
	let descAnt = 0;
	const GAP = 10;
	b.linhas.forEach((l, n) => {
		if (l.k === 'p') {
			const w = largParte(l);
			const baseY = n === 0 ? y + ASC : y + descAnt + GAP + ASC;
			out.push({linha: l, esq: xDe(l.al, w), larg: w, baseY, tam: FS, voz: 'p', y0: baseY - ASC, y1: baseY + DESC});
			y = baseY;
			descAnt = DESC;
		} else {
			const w1 = larg('k', 100, l.txt) / 100; // largura por px de corpo
			let tam = l.casar ? largura / w1 : ((l.cap ?? 0.07) * H) / cap;
			tam = Math.min(tam, (0.095 * H) / cap); // maiúscula no bloco nunca passa de ~9% H
			const w = w1 * tam;
			const capH = cap * tam;
			const acento = ACENTO.test(l.txt) ? tam * 0.16 : 0;
			const baseY = (n === 0 ? y : y + descAnt + GAP) + acento + capH;
			out.push({linha: l, esq: xDe(l.al, w), larg: w, baseY, tam, voz: 'k', y0: baseY - capH - acento, y1: baseY + (/[ÇQ]/.test(l.txt) ? tam * 0.12 : 0)});
			y = baseY;
			descAnt = /[ÇQ]/.test(l.txt) ? tam * 0.12 : 0;
		}
	});
	return out;
};
const PostaView: React.FC<{q: Posta; t: number; semente: string; limite: number}> = ({q, t, semente, limite}) => {
	const l = q.linha;
	const top = q.baseY - base(q.voz, q.tam);
	if (l.k === 'p') {
		return (
			<div style={{position: 'absolute', left: q.esq, top, lineHeight: `${q.tam}px`, height: q.tam, whiteSpace: 'pre', textShadow: SOMBRA_P}}>
				<Pequena l={l} t={t} />
			</div>
		);
	}
	const origem = l.al === 'dir' ? 'right' : 'left';
	return (
		<div style={{position: 'absolute', left: q.esq, width: q.larg, top, lineHeight: `${q.tam}px`, height: q.tam, whiteSpace: 'pre'}}>
			<div style={{position: 'absolute', top: 0, [origem]: 0, fontFamily: ANT, fontSize: q.tam, transform: `scaleX(${ESTREITA})`, transformOrigin: `${origem} center`, width: q.larg / ESTREITA, textAlign: origem}}>
				<Chave txt={l.txt} t0={l.t0} cor={l.cor} tam={q.tam} t={t} rapida={l.rapida} limite={limite} semente={semente + l.txt} />
			</div>
		</div>
	);
};
const BlocoView: React.FC<{b: Bloco; t: number; f: number}> = ({b, t, f}) => {
	if (f < fr(b.de) || !visivelSaida(f, fr(b.ate))) return null;
	return (
		<AbsoluteFill>
			{montarBloco(b).map((q, i) => (
				<PostaView key={i} q={q} t={t} semente={`b${b.de}`} limite={b.ate - (CORTES_F.includes(fr(b.ate)) ? 0 : 0.2)} />
			))}
		</AbsoluteFill>
	);
};

/* legenda padrão: caixa centrada, 1ª linha à esquerda, 2ª à direita (negrito no trecho de peso) */
const montarLegenda = (g: Legenda) => {
	const ws = g.linhas.map(largParte);
	const largura = Math.max(...ws);
	const L = (W - largura) / 2;
	const top = g.pos === 1 ? LEG_Y : LEG_Y2;
	return g.linhas.map((l, i) => ({l, esq: l.al === 'esq' ? L : L + largura - ws[i], larg: ws[i], baseY: top + ASC + i * FS * 1.12}));
};
const LegendaView: React.FC<{g: Legenda; t: number; f: number}> = ({g, t, f}) => {
	if (f < fr(g.de) || f >= fr(g.ate)) return null;
	return (
		<AbsoluteFill>
			{montarLegenda(g).map((q, i) => (
				<div key={i} style={{position: 'absolute', left: q.esq, top: q.baseY - base('p', FS), lineHeight: `${FS}px`, height: FS, whiteSpace: 'pre', textShadow: SOMBRA_P}}>
					<Pequena l={q.l} t={t} />
				</div>
			))}
		</AbsoluteFill>
	);
};

const pecaNoModo = (pc: Peca, f: number, previas: boolean): Bloco | Legenda => (previas && planoEm(f) === I_PREV && pc.prev ? ({...pc, ...pc.prev} as Bloco | Legenda) : pc);

/* ---------------------------------------------------------------- para o checador (scripts/cobertura.mjs) */
const nomeDe = (pc: Peca) => pc.linhas.flatMap(palavrasDe).join(' ');
export const exibicoes = () =>
	PECAS.map((pc) => {
		const is = pc.linhas.flatMap(indicesDe);
		return {nome: nomeDe(pc), tipo: pc.tipo, de: pc.de, ate: pc.ate, i0: Math.min(...is), n: is.length, linhas: pc.linhas.length};
	});
export const palavrasNaTela = (t: number) => {
	const f = Math.round(t * FPS);
	return PECAS.filter((pc) => f >= fr(pc.de) && f < fr(pc.ate)).flatMap((pc) => pc.linhas.flatMap(indicesDe).filter((i) => t >= PS[i].de - 0.03));
};
export const caixas = (t: number, previas: boolean) => {
	const f = Math.round(t * FPS);
	return PECAS.filter((pc) => f >= fr(pc.de) && f < fr(pc.ate)).map((pc) => {
		const o = pecaNoModo(pc, f, previas);
		const q =
			o.tipo === 'legenda'
				? montarLegenda(o).map((r) => ({x0: r.esq, x1: r.esq + r.larg, y0: r.baseY - ASC, y1: r.baseY + DESC}))
				: montarBloco(o).map((r) => ({x0: r.esq, x1: r.esq + r.larg, y0: r.y0, y1: r.y1}));
		return {nome: nomeDe(pc), tipo: o.tipo === 'legenda' ? 'legenda' : 'destaque', x0: Math.min(...q.map((r) => r.x0)), x1: Math.max(...q.map((r) => r.x1)), y0: Math.min(...q.map((r) => r.y0)), y1: Math.max(...q.map((r) => r.y1))};
	});
};

/* ---------------------------------------------------------------- vídeo, tratamento, P&B, clarões, chicote, vazamento de luz */
const Video: React.FC<{f: number; previas: boolean; efeitoFundo: boolean}> = ({f, previas, efeitoFundo}) => {
	const i = planoEm(f);
	const pl = PLANOS[i];
	const {s, tx, ty} = camera(f, previas);
	const k = f - fr(pl.de);
	const fim = fimPlano(i);
	let filtro = efeitoFundo ? 'contrast(1.04)' : 'none';
	if (pl.pb) {
		const pbBase = 'grayscale(1) contrast(1.32) brightness(0.74)';
		if (k === 0) filtro = 'brightness(1.7) saturate(0.7)'; // clarão entrando
		else if (k === 1) filtro = 'grayscale(1) brightness(2.3) contrast(0.75)'; // P&B estourado
		else if (k <= 4) filtro = `grayscale(1) contrast(1.32) brightness(${interpolate(k, [2, 4], [1.5, 0.74])})`;
		else if (f >= fim - 3) filtro = 'grayscale(1) brightness(2.8) contrast(0.55)'; // clarão saindo
		else filtro = pbBase;
	}
	const chicote = CHICOTE !== null && f === fr(CHICOTE);
	const desce = previas && i === I_PREV;
	return (
		<AbsoluteFill style={{filter: `${filtro}${chicote ? ' url(#chicote)' : ''}`, WebkitMaskImage: desce ? 'linear-gradient(180deg, transparent 0px, transparent 640px, #000 820px)' : undefined}}>
			<AbsoluteFill style={{transform: `translate(${tx + (chicote ? -70 : 0)}px, ${ty}px) scale(${s})`, transformOrigin: '0 0'}}>
				{efeitoFundo && exige('fala_grade.mp4', 'rode scripts/grade.py pela trava e depois tools/adaptar.py --desenho (modelos/storypodcast01/storypodcast01.md, seção 9, passo 2) ou renderize com "efeitoFundo": false.')}
				<OffthreadVideo muted src={staticFile(efeitoFundo ? 'fala_grade.mp4' : 'fala.mp4')} style={{width: W, height: H}} />
			</AbsoluteFill>
			<svg width="0" height="0" style={{position: 'absolute'}}>
				<filter id="chicote" x="-10%" y="0" width="120%" height="100%">
					<feGaussianBlur stdDeviation="46 0" />
				</filter>
			</svg>
		</AbsoluteFill>
	);
};
/* mídia gerada à parte: se faltar, para com o comando que a faz (e não com um erro de rede) */
const exige = (arq: string, como: string) => {
	const lista = getStaticFiles();
	if (lista.length && !lista.some((f) => f.name === arq)) throw new Error(`Falta public/${arq}: ${como}`);
	return null;
};
const Vinheta: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 42%, rgba(0,0,0,0) 45%, rgba(4,7,8,0.6) 100%)'}} />;
/* vazamento de luz laranja nos quadros 0 a 4 do vídeo: faz parte do aprovado (a abertura acende quente e apaga em
   0,17 s). É a única luz quente do modelo; fora dela vale "nada de âmbar". Não tire. */
const Vazamento: React.FC<{f: number}> = ({f}) => {
	const op = [0.95, 0.8, 0.55, 0.3, 0.1][f];
	if (op === undefined) return null;
	return <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 20% 30%, rgba(255,140,40,1) 0%, rgba(255,90,20,0.7) 45%, rgba(120,30,0,0) 100%)', mixBlendMode: 'screen', opacity: op}} />;
};

/* ---------------------------------------------------------------- prévias: dois outros modelos no terço de cima, a câmera dele desce */
const PREV = {w: 340, h: 604, y: 70, x: [160, 580]};
export const PreviasEmCima: React.FC<{f: number; nomes: [string, string]}> = ({f, nomes}) => {
	if (!JANELA_PREVIAS) return null;
	const de = fr(JANELA_PREVIAS.de);
	if (f < de || f >= fr(JANELA_PREVIAS.ate)) return null;
	for (const arq of ['previa1.mp4', 'previa2.mp4']) exige(arq, 'faça as prévias com tools/previa.py (modelos/storypodcast01/storypodcast01.md, seção 9, "Prévias") ou renderize com "previas": false.');
	const t = f / FPS;
	return (
		<AbsoluteFill>
			{[0, 1].map((i) => {
				const d = JANELA_PREVIAS.de + i * 0.1;
				const e = tw(t, d, d + 0.13, 0, 1, E.io);
				return (
					<div key={i} style={{position: 'absolute', left: PREV.x[i], top: PREV.y, width: PREV.w}}>
						<div style={{width: PREV.w, height: PREV.h, overflow: 'hidden', opacity: e, filter: e < 1 ? `blur(${(1 - e) * 14}px)` : undefined, background: COR.breu}}>
							<Sequence from={de} layout="none">
								<OffthreadVideo muted src={staticFile(`previa${i + 1}.mp4`)} style={{width: PREV.w, height: PREV.h, objectFit: 'cover'}} />
							</Sequence>
						</div>
						<div style={{position: 'absolute', left: -30, right: -30, top: PREV.h + 18, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: POP, fontSize: 38, color: COR.giz, textShadow: SOMBRA_P, ...surge(t, d + 0.12)}}>
							{nomes[i]}
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

export const VitrineStoryPodcast01: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], musica = false, efeitoFundo = true}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const ok = useFontes();
	return (
		<AbsoluteFill style={{background: COR.breu}}>
			<Video f={f} previas={previas} efeitoFundo={efeitoFundo} />
			{efeitoFundo && <Vinheta />}
			{previas && <PreviasEmCima f={f} nomes={nomesPrevias} />}
			{ok &&
				PECAS.map((pc, i) => {
					const o = pecaNoModo(pc, f, previas);
					return o.tipo === 'bloco' ? <BlocoView key={i} b={o} t={t} f={f} /> : <LegendaView key={i} g={o} t={t} f={f} />;
				})}
			<Vazamento f={f} />
			{/* som: a voz sempre; a trilha (pad + sopro + whoosh) só com musica. A vitrine mixa fora (scripts/mixar.sh). */}
			<Audio src={staticFile('voz.wav')} />
			{musica && exige('trilha.wav', 'rode scripts/trilha.py ou deixe "musica": false.')}
			{musica && <Audio src={staticFile('trilha.wav')} volume={0.16} />}
		</AbsoluteFill>
	);
};
