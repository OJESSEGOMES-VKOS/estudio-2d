import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadSora} from '@remotion/google-fonts/Sora';
import PS from './palavras.json';
import TJ from './tempos.json';

/**
 * anunciomotion01 (../../modelos/anunciomotion01/MODELO.md), vitrine dos modelos.
 * Partiu do tema.ts do anúncio aprovado do Marcaí. Cor: a das referências do modelo (verde-menta neon
 * #3CF2A4, MODELO §2), vermelho só para o ruim; o violeta era do Marcaí, que não entra aqui.
 */
export const P = PS as {text: string; start: number; end: number}[];
export type Linha = {ids: number[]; fs: number; peso: number; y: number; marca?: number[]; tipo?: 'contador' | 'pilula'};
export type Bloco = {id: string; cena: string; de_q?: number; ate_q?: number; linhas: Linha[]};
export const T = TJ as unknown as {fps: number; duracao_q: number; cenas: {id: string; de_q: number; ate_q: number; fundo: string; entrada: 'corte' | 'borrao' | 'iris'}[]; previas: {de_q: number; ate_q: number}; texto: Record<string, string>; blocos: Bloco[]};
export const FPS = 30;
export const DURACAO = T.duracao_q / FPS;
/** centro horizontal do texto: meio da zona segura 9:16 (x 60-940) */
export const CX = 500;

export const C = {
	preto: '#050807',
	v: '#3CF2A4',
	vClaro: '#A8FFD8',
	vBrilho: '#5CFFB8',
	vFundo: '#16C97F',
	vEscuro: '#0A6E47',
	claro: '#F3FBF7',
	tinta: '#0D1A14',
	sub: '#C9D6CF',
	subClaro: '#4C5E55',
	vermelho: '#FF2A2A',
	branco: '#FFFFFF',
};

const sora = loadSora('normal', {weights: ['400', '600', '700', '800'], subsets: ['latin', 'latin-ext']});
export const SANS = sora.fontFamily;

export const E = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	inOut: Easing.bezier(0.83, 0, 0.17, 1),
	in: Easing.bezier(0.7, 0, 0.84, 0),
	suave: Easing.bezier(0.45, 0, 0.25, 1),
};
export const useT = () => {
	const f = useCurrentFrame();
	return {f, t: f / FPS};
};
export const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const mola = (t: number, at: number, cfg: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
	t < at ? 0 : spring({frame: (t - at) * FPS, fps: FPS, config: {damping: 14, stiffness: 170, mass: 0.8, ...cfg}});

/** segundo (no quadro exato) em que a palavra i é dita */
export const w = (i: number) => Math.round(P[i].start * FPS) / FPS;
export const txt = (i: number) => T.texto[String(i)] ?? P[i].text;
export const cena = (id: string) => {
	const c = T.cenas.find((x) => x.id === id)!;
	return {...c, de: c.de_q / FPS, ate: c.ate_q / FPS};
};

/** pseudo-aleatório determinístico */
export const rnd = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
