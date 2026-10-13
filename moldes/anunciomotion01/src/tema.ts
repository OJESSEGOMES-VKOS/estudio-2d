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
export const T = TJ as unknown as {
	fala: string;
	fps: number;
	duracao_q: number;
	escurece?: boolean;
	cenas: {id: string; de_q: number; ate_q: number; fundo: string; entrada: 'corte' | 'borrao' | 'iris'}[];
	previas?: {de_q: number; ate_q: number};
	marcas?: Record<string, [number, string]>;
	texto: Record<string, string>;
	blocos: Bloco[];
};
export const FPS = 30;
export const DURACAO = T.duracao_q / FPS;

/* ---------------------------------------------------------------- o plano tem de ser desta fala: para logo ao carregar */
export const pare = (msg: string): never => {
	throw new Error(`\n\n[anunciomotion01] ${msg}\nO conferidor diz a linha: ../../.venv/Scripts/python.exe scripts/conferir.py\n`);
};
const limpa = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
{
	const plano = (T.fala ?? '').split(/\s+/).map(limpa).filter(Boolean);
	const fala = P.map((p) => limpa(p.text)).filter(Boolean);
	const k = plano.findIndex((x, i) => x !== fala[i]);
	if (k >= 0 || plano.length !== fala.length) {
		const j = k >= 0 ? k : Math.min(plano.length, fala.length);
		pare(
			`O plano não bate com a fala. src/tempos.json foi feito para outra fala: na palavra ${j + 1} o plano tem "${plano[j] ?? '(fim)'}" e src/palavras.json tem "${fala[j] ?? '(fim)'}". ` +
				'Refaça "cenas", "blocos", "marcas", "texto", "acordes" e "duracao_q" em src/tempos.json e as telas em src/cenas.tsx sobre a fala nova (LEIA, "Vídeo novo"), e cole o texto da fala nova no campo "fala" (linha 2).',
		);
	}
	const n = P.length;
	const ids = [...T.blocos.flatMap((b) => b.linhas.flatMap((l) => l.ids)), ...Object.values(T.marcas ?? {}).map((m) => m[0])];
	const fora = ids.find((i) => !(i >= 0 && i < n));
	if (fora !== undefined) pare(`src/tempos.json usa a palavra ${fora}, mas a fala tem ${n} palavras (0 a ${n - 1}): refaça os ids de "blocos" e "marcas".`);
	for (const [nome, [i, palavra]] of Object.entries(T.marcas ?? {}))
		if (limpa(P[i].text) !== limpa(palavra)) pare(`a marca "${nome}" de src/tempos.json aponta a palavra ${i} ("${P[i].text}"), não "${palavra}": acerte o índice.`);
	for (const b of T.blocos) if (!T.cenas.some((c) => c.id === b.cena)) pare(`o bloco ${b.id} de src/tempos.json está na cena ${b.cena}, que não existe em "cenas".`);
	if (T.duracao_q < Math.round(P[n - 1].end * FPS)) pare(`"duracao_q" (${T.duracao_q}) corta a fala, que acaba no quadro ${Math.round(P[n - 1].end * FPS)}: aumente em src/tempos.json.`);
}
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
/** segundo da marca do plano (src/tempos.json → "marcas"); a tela que pede uma marca que o plano não tem para com a mensagem */
export const marca = (nome: string) => {
	const m = T.marcas?.[nome];
	return m ? w(m[0]) : pare(`src/cenas.tsx pede a marca "${nome}", que não está em src/tempos.json → "marcas". Ponha "${nome}": [índice da palavra, "palavra"] ou tire o uso dela da tela.`);
};
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
