import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadGeist} from '@remotion/google-fonts/Geist';
import {loadFont as loadMono} from '@remotion/google-fonts/GeistMono';
import TJ from './tempos.json'; // scripts/gerar_tempos.py (o plano, preso às palavras)
import PALAVRAS from './palavras.json'; // entrada padrão: [{text,start,end}]
import RJ from './rosto_med.json'; // scripts/rosto.py: enquadramento por trecho (mediana de olhos, largura, queixo)

/** o plano (src/tempos.json). Tela que o vídeo não usa vem null de scripts/gerar_tempos.py e some. */
type Tela<K extends keyof typeof TJ> = (typeof TJ)[K] | null;
export type Tempos = Omit<typeof TJ, 'editor' | 'modelos' | 'celular' | 'previas' | 'outros' | 'prompt' | 'fecho' | 'silencio' | 'titulos'> & {
	editor: Tela<'editor'>;
	modelos: Tela<'modelos'>;
	celular: Tela<'celular'>;
	previas: Tela<'previas'>;
	outros: Tela<'outros'>;
	prompt: Tela<'prompt'>;
	fecho: Tela<'fecho'>;
	silencio: Tela<'silencio'>;
	titulos: {editor: {i0: number; grupos: number[]} | null; celular: {i0: number; grupos: number[]} | null};
	fala?: {palavras: number; fim: number};
};
const T = TJ as unknown as Tempos;
const R = RJ as typeof RJ & {fala?: {palavras: number; fim: number}};
const palavras = (PALAVRAS as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));
/* 2026-10-13 (teste do estúdio aberto): o plano e o enquadramento têm de ser desta fala; se não, para com o que rodar */
const marca = (x?: {palavras: number; fim: number}) => !!x && palavras.length > 0 && x.palavras === palavras.length && x.fim === palavras[palavras.length - 1].ate;
if (!palavras.length) throw new Error('src/palavras.json está vazio: este molde precisa da fala transcrita (tools/preparar.py ou tools/novo-video.py).');
if (!marca(T.fala))
	throw new Error(
		'src/tempos.json é de outra fala. Refaça o bloco "O PLANO" de scripts/gerar_tempos.py para a fala nova e rode ../../.venv/Scripts/python.exe scripts/gerar_tempos.py (ele para e diz a linha se uma palavra do plano não existe na fala). LEIA.md, "Vídeo novo".',
	);
if (!marca(R.fala) || R.trechos.length !== T.blocos.length)
	throw new Error('src/rosto_med.json é de outra gravação ou de outros blocos. Rode ../../.venv/Scripts/python.exe scripts/rosto.py (depois do gerar_tempos.py).');

export const P = {duracao: T.duracao, palavras};
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

/** as prévias de outros modelos e o perfil (props da composição); com `previas: false` nada delas aparece; arroba e
 * foto vazios escondem o elemento */
export type Previas = {previas: boolean; nomesPrevias: [string, string]; arroba: string; foto: string};
export const PreviasCtx = React.createContext<Previas>({previas: false, nomesPrevias: ['', ''], arroba: '', foto: ''});
export const usePrevias = () => React.useContext(PreviasCtx);

/** telas divididas (M05): os modelos, as prévias (só com previas) e o prompt. Saída = começa no `sai` e leva 0,4 s */
const divididos = (previas: boolean): [number, number][] => [
	...(T.modelos ? ([[T.modelos.de, T.modelos.sai]] as [number, number][]) : []),
	...(previas && T.previas ? ([[T.previas.de, T.previas.sai]] as [number, number][]) : []),
	...(T.prompt ? ([[T.prompt.de, T.prompt.sai]] as [number, number][]) : []),
];
export const pDividido = (t: number, previas: boolean) => {
	let p = 0;
	for (const [a, b] of divididos(previas)) p = Math.max(p, Math.min(tw(t, a, a + 0.4, 0, 1, E.inOut), 1 - tw(t, b, b + 0.4, 0, 1, E.inOut)));
	return p;
};
export const DIVISA = 960;

/** fases em que o rosto mora dentro de uma moldura (editor, celular) e o título no topo é o texto dito */
export const noEditor = (t: number) => !!T.editor && t >= T.editor.de - 0.4 && t < T.editor.devolve + 0.3;
export const noCelular = (t: number) => !!T.celular && t >= T.celular.de - 0.05 && t < T.celular.devolve + 0.3;

export const SOMBRA = '0 18px 40px rgba(60,48,30,0.16), 0 2px 6px rgba(60,48,30,0.10)';

export const fundoClaro = {
	backgroundColor: C.marfim,
	backgroundImage: `radial-gradient(${C.grade} 2px, transparent 2px)`,
	backgroundSize: '36px 36px',
} as const;
