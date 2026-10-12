import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadScript} from '@remotion/google-fonts/PinyonScript';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadMono} from '@remotion/google-fonts/GeistMono';
import P from '../d1/palavras.json';

/** modelodinamico02 (../../modelos/modelodinamico02/MODELO.md). Nada daqui vale pro 01 nem pro padrão. */
export {P};
export const FPS = 30;
export const DURACAO = P.duracao + 0.9;

/** um mundo de cor, dois fundos que se alternam (MODELO §2): preto quente ↔ laranja Claude */
export const C = {
	escuro: '#130B08',
	laranja: '#E0592A',
	acento: '#F07A45',
	creme: '#FBEFE6',
	tinta: '#1A0D08',
	cinza: '#8C7C72',
};

const inter = loadInter('normal', {weights: ['500', '700', '800', '900'], subsets: ['latin']});
const script = loadScript('normal', {weights: ['400'], subsets: ['latin']});
const serif = loadSerif('italic', {weights: ['400'], subsets: ['latin']});
const mono = loadMono('normal', {weights: ['500'], subsets: ['latin']});
export const SANS = inter.fontFamily;
export const SCRIPT = script.fontFamily;
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
	t < at ? 0 : spring({frame: (t - at) * FPS, fps: FPS, config: {damping: 14, stiffness: 180, mass: 0.8, ...cfg}});

const limpa = (s: string) => s.toLowerCase().replace(/[.,!?]/g, '');
export const w = (texto: string, n = 1) => {
	let k = 0;
	for (const p of P.palavras) if (limpa(p.texto) === limpa(texto) && ++k === n) return p.de;
	throw new Error(`palavra não achada: ${texto} #${n}`);
};

/**
 * Leitor em ordem: cada palavra escrita na tela pega o tempo da próxima palavra falada igual.
 * Token com "~" na frente é enfeite (não falado) e herda o tempo da anterior.
 */
let cursor = 0;
let ultimo = 0;
export const tempoDe = (token: string): number => {
	if (token.startsWith('~')) return ultimo;
	const alvo = limpa(token.replace(/\+$/, ''));
	for (let i = cursor; i < P.palavras.length; i++)
		if (limpa(P.palavras[i].texto) === alvo) {
			cursor = i + 1;
			ultimo = P.palavras[i].de;
			return ultimo;
		}
	throw new Error(`token fora de ordem: ${token} (cursor ${cursor})`);
};
