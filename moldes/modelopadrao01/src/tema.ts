import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadGeist} from '@remotion/google-fonts/Geist';
import {loadFont as loadMono} from '@remotion/google-fonts/GeistMono';
import T from './tempos.json'; // scripts/gerar_tempos.py (o plano, preso às palavras)
import PALAVRAS from './palavras.json'; // entrada padrão: [{text,start,end}]
import R from './rosto_med.json'; // scripts/rosto.py: enquadramento por trecho (mediana de olhos, largura, queixo)

export const P = {
	duracao: T.duracao,
	palavras: (PALAVRAS as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end})),
};
export {T, R};
export const FPS = T.fps;

/**
 * modelopadrao01 (o reel "100% editado pelo Claude Code", v1 a v4): a paleta e as fontes são as do vídeo
 * aprovado do modelo. Painéis marfim da mesma família da parede bege, tinta quase preta, menta só como
 * preenchimento, verde escuro pra texto/pílula. O laranja é só o do Claude (o agente que edita).
 */
export const C = {
	marfim: '#F0EEE6',
	papel: '#FBF9F4',
	grade: '#DCD7CA',
	linha: '#E4DFD3',
	tinta: '#0A0A0A',
	suave: '#5E5A52',
	menta: '#7ED9B2',
	mentaFundo: '#DDF2E8',
	verde: '#1E6A50',
	verdeFundo: '#173F33',
	alerta: '#C8553D',
	claude: '#D97757',
	branco: '#FFFFFF',
	clipe: '#B9C7D6',
	clipe2: '#9FB3C8',
};

const geist = loadGeist('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']});
const mono = loadMono('normal', {weights: ['400', '500', '600'], subsets: ['latin']});
export const DISPLAY = geist.fontFamily;
export const MONO = mono.fontFamily;

export const E = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	inOut: Easing.bezier(0.83, 0, 0.17, 1),
	in: Easing.bezier(0.7, 0, 0.84, 0),
	lin: (x: number) => x,
};

export const useT = () => {
	const f = useCurrentFrame();
	return {f, t: f / FPS};
};

export const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export const mola = (t: number, at: number, cfg: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
	t < at ? 0 : spring({frame: (t - at) * FPS, fps: FPS, config: {damping: 16, stiffness: 170, mass: 0.9, ...cfg}});

export const presenca = (t: number, de: number, sai: number) =>
	t < de || t > sai + 0.35 ? 0 : Math.min(mola(t, de), 1 - tw(t, sai, sai + 0.3, 0, 1, E.in));

/** em que bloco (corte de enquadramento) estamos */
export const blocoDe = (t: number) => {
	let k = 0;
	T.blocos.forEach((b, i) => {
		if (t >= b) k = i;
	});
	return k;
};

/** as prévias de outros modelos (prop da composição); com `previas: false` nada delas aparece */
export type Previas = {previas: boolean; nomesPrevias: [string, string]};
export const PreviasCtx = React.createContext<Previas>({previas: false, nomesPrevias: ['', '']});
export const usePrevias = () => React.useContext(PreviasCtx);

/** telas divididas (M05): os modelos, as prévias (só com previas) e o prompt. Saída = começa no `sai` e leva 0,4 s */
const divididos = (previas: boolean): [number, number][] => [
	[T.modelos.de, T.modelos.sai],
	...(previas ? ([[T.previas.de, T.previas.sai]] as [number, number][]) : []),
	[T.prompt.de, T.prompt.sai],
];
export const pDividido = (t: number, previas: boolean) => {
	let p = 0;
	for (const [a, b] of divididos(previas)) p = Math.max(p, Math.min(tw(t, a, a + 0.4, 0, 1, E.inOut), 1 - tw(t, b, b + 0.4, 0, 1, E.inOut)));
	return p;
};
export const DIVISA = 960;

/** fases em que o rosto mora dentro de uma moldura (editor, celular) e o título no topo é o texto dito */
export const noEditor = (t: number) => t >= T.editor.de - 0.4 && t < T.editor.devolve + 0.3;
export const noCelular = (t: number) => t >= T.celular.de - 0.05 && t < T.celular.devolve + 0.3;

export const SOMBRA = '0 18px 40px rgba(60,48,30,0.16), 0 2px 6px rgba(60,48,30,0.10)';

export const fundoClaro = {
	backgroundColor: C.marfim,
	backgroundImage: `radial-gradient(${C.grade} 2px, transparent 2px)`,
	backgroundSize: '36px 36px',
} as const;
