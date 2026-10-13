import {Easing, getStaticFiles, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadSora} from '@remotion/google-fonts/Sora';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';
import BRUTO from './palavras.json';

/** anunciomotion01 (../../modelos/anunciomotion01/MODELO.md), tema Marcaí. */
export const pare = (msg: string): never => {
	throw new Error(`\n\n[anunciocanvas01] ${msg}\n`);
};
/** src/palavras.json em qualquer um dos três jeitos: {duracao, palavras: [{texto, de, ate}]} (o da vitrine),
 *  [{text, start, end}] (do tools/novo-video.py) ou [{w, s, e}] (o .palavras.json do kit/voz.py) */
type Pal = {texto: string; de: number; ate: number};
const P: {duracao: number; palavras: Pal[]} = (() => {
	const b = BRUTO as unknown;
	if (b && !Array.isArray(b) && Array.isArray((b as {palavras: unknown}).palavras)) return b as {duracao: number; palavras: Pal[]};
	if (!Array.isArray(b) || !b.length) return pare('src/palavras.json está vazio ou num formato que o molde não lê (LEIA, "Vídeo novo").');
	const palavras = (b as Record<string, unknown>[]).map((x) => ({texto: String(x.text ?? x.w ?? ''), de: Number(x.start ?? x.s), ate: Number(x.end ?? x.e)}));
	return {duracao: palavras[palavras.length - 1].ate, palavras};
})();
export {P};
/** arquivos de public/ (o plano B quando falta uma tela ou o som) */
const ARQUIVOS = new Set(getStaticFiles().map((a) => a.name.replace(/\\/g, '/')));
export const existe = (nome: string) => ARQUIVOS.has(nome);
export const FPS = 30;
export const FIM_VOZ = P.duracao;
export const DURACAO = Math.round((P.duracao + 2.35) * 30) / 30;

/** marca violeta (coral ficaria colado no vermelho da dor); vermelho só pra dor */
export const C = {
	preto: '#07060B',
	v: '#8B5CFF',
	vClaro: '#B49CFF',
	vBrilho: '#A07BFF',
	vFundo: '#7C4DFF',
	vEscuro: '#4B22C9',
	lilas: '#EFE9FF',
	claro: '#F6F4FA',
	tinta: '#16121F',
	sub: '#8E879F',
	vermelho: '#FF2A2A',
	ambar: '#FFB23E',
	ciano: '#45DFFF',
	branco: '#FFFFFF',
};

const sora = loadSora('normal', {weights: ['300', '400', '600', '700', '800'], subsets: ['latin', 'latin-ext']});
const caveat = loadCaveat('normal', {weights: ['600', '700'], subsets: ['latin', 'latin-ext']});
export const SANS = sora.fontFamily;
export const MAO = caveat.fontFamily;

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

export const limpa = (s: string) => s.toLowerCase().replace(/[.,!?~]/g, '');
/** início da n-ésima vez que a palavra é dita */
export const w = (texto: string, n = 1) => {
	let k = 0;
	for (const p of P.palavras) if (limpa(p.texto) === limpa(texto) && ++k === n) return p.de;
	return pare(`src/Canvas.tsx pede a ${n}ª vez que a fala diz "${texto}", e src/palavras.json não tem: o plano é de outra fala. Refaça FRASES e a Coreografia em src/Canvas.tsx (LEIA, "Vídeo novo").`);
};
/** fim da n-ésima vez que a palavra é dita */
export const wf = (texto: string, n = 1) => {
	let k = 0;
	for (const p of P.palavras) if (limpa(p.texto) === limpa(texto) && ++k === n) return p.ate;
	return pare(`src/Canvas.tsx pede a ${n}ª vez que a fala diz "${texto}", e src/palavras.json não tem: o plano é de outra fala. Refaça FRASES e a Coreografia em src/Canvas.tsx (LEIA, "Vídeo novo").`);
};
/**
 * Tempos de uma frase escrita na tela, lida em ordem a partir de `desde`.
 * Token com "~" é enfeite (não falado) e herda o tempo do anterior.
 */
export const seq = (desde: number, texto: string): {txt: string; de: number}[] => {
	let cur = P.palavras.findIndex((x) => x.de >= desde - 0.08);
	let ult = desde;
	return texto.split(' ').map((tk) => {
		if (tk.startsWith('~')) return {txt: tk.slice(1), de: ult};
		const alvo = limpa(tk);
		let k = cur;
		while (k >= 0 && k < P.palavras.length && limpa(P.palavras[k].texto) !== alvo) k++;
		if (k < 0 || k >= P.palavras.length) pare(`src/Canvas.tsx escreve "${texto}" a partir de ${desde} s, mas a fala não diz "${tk}" nessa ordem depois disso: refaça essa linha da Coreografia (o "de" e o texto, palavra por palavra como foi dito).`);
		cur = k + 1;
		ult = P.palavras[k].de;
		return {txt: tk, de: ult};
	});
};

/** pseudo-aleatório determinístico */
export const rnd = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
