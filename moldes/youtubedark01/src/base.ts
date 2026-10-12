import {Easing, interpolate} from 'remotion';
import {loadFont} from '@remotion/google-fonts/ComicNeue';
import TEMPOS from './tempos.json';
import PS_RAW from './palavras.json';

/**
 * youtubedark01, família B (explicação ilustrada, com narração), identidade escura (MODELO §3B "Finance"):
 * fundo preto, o personagem do curta aprovado (feijão creme), luz dourada de cima, verde neon só no objeto-chave.
 * Uma ilustração parada por frase, corte seco na palavra, câmera parada.
 * Fonte única: Comic Neue (a do curta aprovado), 400 e 700.
 */
export const T = TEMPOS;
export const PS = PS_RAW as {text: string; start: number; end: number}[];
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const q = (s: number) => Math.round(s * FPS);
export const ini = (i: number) => q(PS[i].start);
export const txt = (i: number) => (T.texto as Record<string, string>)[String(i)] ?? PS[i].text.toUpperCase();
export const cena = (id: string) => T.cenas.find((c) => c.id === id)!;

const cn = loadFont('normal', {weights: ['400', '700'], subsets: ['latin']});
export const FONTE = cn.fontFamily;

export const C = {
	preto: '#060606',
	parede: '#111216',
	chao: '#3a3b41',
	traco: '#26221f',
	pele: '#EDE6D6',
	pele2: '#D5CCBA',
	movel: '#2a2b31',
	movelLinha: '#787c87',
	coberta: '#27304a',
	cobertaLinha: '#55607f',
	verm: '#ff2b25',
	moletom: '#c9302a',
	moletom2: '#9e221e',
	led: '#ff3a2e',
	tela: '#9fd3ff',
	lua: '#e8ebf1',
	branco: '#f4f1ea',
	giz: '#e9e6df',
	apagado: '#3b3d44',
	ouro: '#ffc94a',
	ouroClaro: '#ffe7a3',
	verde: '#3dff8a',
	verdeClaro: '#c9ffe0',
};

export const E = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	lin: (x: number) => x,
};

export const tw = (x: number, a: number, b: number, v0: number, v1: number, e: (x: number) => number = E.out) =>
	interpolate(x, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export const rnd = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

export const NEON_VERDE = `drop-shadow(0 0 4px ${C.verde}) drop-shadow(0 0 14px ${C.verde}) drop-shadow(0 0 32px rgba(61,255,138,0.55))`;
export const NEON_OURO = `drop-shadow(0 0 4px ${C.ouro}) drop-shadow(0 0 16px rgba(255,201,74,0.8)) drop-shadow(0 0 36px rgba(255,160,40,0.45))`;
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
