import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadScript} from '@remotion/google-fonts/PinyonScript';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadMono} from '@remotion/google-fonts/GeistMono';
import PALAVRAS from './palavras.json'; // entrada padrão: [{text,start,end}]

/** modelodinamico02 (../../modelos/modelodinamico02/modelodinamico02.md). Nada daqui vale pro 01 nem pro padrão.
 * 2026-10-13 (teste do estúdio aberto): lê a entrada padrão (src/palavras.json, public/voz.wav); a duração vem das
 * palavras; palavra do plano que a fala não tem para o molde com a mensagem do que refazer. */
const palavras = (PALAVRAS as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));
if (!palavras.length) throw new Error('src/palavras.json está vazio: este molde precisa da narração transcrita (tools/preparar.py ou tools/novo-video.py).');
export const P = {palavras};
export const FPS = 30;
/** a última tela segura 1,24 s depois da última palavra (na vitrine: 44,06 + 1,24 = 45,30 s, 1359 quadros) */
export const QUADROS = Math.round((palavras[palavras.length - 1].ate + 1.24) * FPS);
export const DURACAO = QUADROS / FPS;

/** um mundo de cor, dois fundos que se alternam (modelodinamico02.md): preto quente ↔ laranja Claude */
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

/** a palavra sem maiúscula, acento e pontuação (o Whisper varia nisso) */
export const limpa = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const REFAZER = 'Refaça CENAS e os heróis de src/Cenas.tsx para a fala nova (modelos/modelodinamico02/modelodinamico02.md, §9 "Como fazer um vídeo novo") e rode node scripts/cobertura.mjs, que lista tudo o que falta.';
/** início da n-ésima vez que a palavra é dita; se a fala não tem, para com o que refazer */
export const w = (texto: string, n = 1) => {
	let k = 0;
	for (const p of P.palavras) if (limpa(p.texto) === limpa(texto) && ++k === n) return p.de;
	throw new Error(`O plano não bate com a fala de src/palavras.json: \`${n > 1 ? `w('${texto}', ${n})` : `w('${texto}')`}\` pede a ${n}ª vez que se diz "${texto}", e a fala ${k ? `só tem ${k}` : 'não tem nenhuma'}.\n${REFAZER}`);
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
	throw new Error(`O plano não bate com a fala de src/palavras.json: a palavra \`${token}\` das CENAS não aparece na fala depois da palavra ${cursor} ("${P.palavras[cursor - 1]?.texto ?? 'início'}"); as linhas de cada tela são as palavras ditas, na ordem.\n${REFAZER}`);
};
