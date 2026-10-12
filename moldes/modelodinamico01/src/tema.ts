import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadSans} from '@remotion/google-fonts/Geist';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadMono} from '@remotion/google-fonts/GeistMono';
import PALAVRAS from './palavras.json'; // entrada padrão: [{text,start,end}]
import RT from './rosto.json'; // entrada padrão: [[t,cx,cy,h]] a cada 0,25 s
import R from './rosto_med.json'; // scripts/rosto.py: mediana de olhos, largura e queixo (px no quadro 1080)

/**
 * Vitrine dos modelos, no modelodinamico01 (projetos/estudio-2d/modelos/modelodinamico01/MODELO.md).
 * DURACAO é a duração da fala (public/voz.wav) arredondada a 0,01 s; muda a cada vídeo.
 */
export const FPS = 30;
export const DURACAO = 30.36;
export const P = {
	duracao: DURACAO,
	palavras: (PALAVRAS as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end})),
};
export {R};

export const C = {
	creme: '#F1ECE3',
	grade: 'rgba(60,40,20,0.06)',
	tinta: '#161412',
	suave: '#8A8379',
	destaque: '#D97757',
	destaqueClaro: '#F3A585',
	escuro: '#161616',
	escuro2: '#222120',
	linha: '#2E2C2A',
	branco: '#FFFFFF',
	papel: '#FBF8F2',
	azul: '#0095F6',
	verde: '#2FB765',
	selecao: '#3B82F6',
};

// as fontes do vídeo aprovado (src/d1/tema.ts do reel 2026-10-05): Geist, Instrument Serif itálica e Geist Mono
const sans = loadSans('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']});
const serif = loadSerif('italic', {weights: ['400'], subsets: ['latin']});
const mono = loadMono('normal', {weights: ['500', '600'], subsets: ['latin']});
export const SANS = sans.fontFamily;
export const SERIF = serif.fontFamily;
export const MONO = mono.fontFamily;

export const E = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	inOut: Easing.bezier(0.83, 0, 0.17, 1),
	in: Easing.bezier(0.7, 0, 0.84, 0),
};

export const useT = () => {
	const f = useCurrentFrame();
	return {f, t: f / FPS};
};
export const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const mola = (t: number, at: number, cfg: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
	t < at ? 0 : spring({frame: (t - at) * FPS, fps: FPS, config: {damping: 14, stiffness: 190, mass: 0.8, ...cfg}});

/** centro x do rosto (px no quadro 1080) no instante t, suavizado (média de ±1 s do rastreio a cada 0,25 s) */
const rt = RT as number[][];
export const rostoX = (t: number) => {
	const viz = rt.filter((r) => Math.abs(r[0] - t) <= 1.0);
	const m = viz.length ? viz.reduce((s, r) => s + r[1], 0) / viz.length : R.cx / 1080;
	return m * 1080;
};

/** início da n-ésima ocorrência da palavra (sem pontuação, sem caixa) */
const limpa = (s: string) => s.toLowerCase().replace(/[.,!?]/g, '');
export const w = (texto: string, n = 1) => {
	let k = 0;
	for (const p of P.palavras) if (limpa(p.texto) === limpa(texto) && ++k === n) return p.de;
	throw new Error(`palavra não achada: ${texto} #${n}`);
};

/* ---------------------------------------------------------------- as cenas, frase a frase */
/** corte seco 2 quadros antes da palavra que abre a cena (ref1/ref2: troca de modo sem transição) */
const corte = (t: number) => t - 0.06;
export type Modo = 'motion' | 'palco' | 'dividido' | 'rosto';
export type Cena = {id: string; modo: Modo; de: number; ate: number; legendaTopo?: boolean};
const base = (previas: boolean): [string, Modo, number, boolean?][] => [
	['gancho', 'motion', 0], // Esse vídeo está sendo 100% editado pelo Claude.
	['criado', 'dividido', corte(w('ele'))], // Ele foi criado justamente para te mostrar a
	['modelos', 'palco', corte(w('diferença'))], // diferença entre vários modelos que eu criei e melhorei / para editar qualquer tipo de vídeo usando o Claude.
	['instagram', 'motion', corte(w('inclusive'))], // Inclusive, se você estiver no Instagram agora,
	['nome', 'palco', corte(w('você', 2))], // você está vendo apenas um desses modelos.
	['previas', previas ? 'dividido' : 'rosto', corte(w('eu', 2))], // Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes.
	['mas', 'rosto', corte(w('mas'))], // Mas se você quiser realmente
	['outros', 'palco', corte(w('ver'))], // ver outros modelos de edição como esse / e aprender a como usar isso nos seus vídeos,
	['comenta', 'motion', corte(w('comenta')), true], // comenta edição aqui embaixo que eu vou te mandar na sua DM agora.
];
export const montaCenas = (previas: boolean): Cena[] => {
	const b = base(previas);
	return b.map(([id, modo, de, topo], i) => ({id, modo, de, ate: i + 1 < b.length ? b[i + 1][2] : DURACAO, legendaTopo: topo}));
};

/** as prévias ligadas ou não (prop da composição) chegam a todo lugar por contexto */
export const Previas = React.createContext<{previas: boolean; nomesPrevias: [string, string]}>({previas: false, nomesPrevias: ['', '']});
export const useCenas = () => {
	const {previas} = React.useContext(Previas);
	return React.useMemo(() => montaCenas(previas), [previas]);
};
export const cenaEm = (cenas: Cena[], t: number) => cenas.find((c) => t >= c.de && t < c.ate) ?? cenas[cenas.length - 1];

export const fundoCreme = {
	backgroundColor: C.creme,
	backgroundImage: `linear-gradient(${C.grade} 2px, transparent 2px), linear-gradient(90deg, ${C.grade} 2px, transparent 2px)`,
	backgroundSize: '60px 60px',
	backgroundPosition: '-1px -1px',
} as const;
export const SOMBRA = '0 30px 60px rgba(70,50,30,0.18), 0 6px 14px rgba(70,50,30,0.10)';
export const DIVISA = 858;
