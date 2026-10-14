import {Easing, interpolate} from 'remotion';
import {loadFont} from '@remotion/google-fonts/ComicNeue';
import TEMPOS from './tempos.json';
import PS_RAW from './palavras.json';

/**
 * youtubedark01, família B (explicação ilustrada, com narração), identidade escura (modelos/youtubedark01/youtubedark01.md §1):
 * fundo preto, o personagem do curta aprovado (feijão creme), luz dourada de cima, verde neon só no objeto-chave.
 * Uma ilustração parada por frase, corte seco na palavra, câmera parada.
 * Fonte única: Comic Neue (a do curta aprovado), 400 e 700.
 */
type Plano = Omit<typeof TEMPOS, 'marcas' | 'fade_q' | 'previas' | 'fixo'> & {marcas?: Record<string, [number, string]>; fade_q?: number[]; previas?: {de_q: number; ate_q: number}; fixo?: typeof TEMPOS.fixo};
export const T = TEMPOS as unknown as Plano;
export const PS = PS_RAW as {text: string; start: number; end: number}[];
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const q = (s: number) => Math.round(s * FPS);

/* ---------------------------------------------------------------- o plano tem de ser desta fala: para logo ao carregar */
const pare = (msg: string): never => {
	throw new Error(`\n\n[youtubedark01] ${msg}\nO conferidor diz a linha: ../../.venv/Scripts/python.exe scripts/conferir.py\n`);
};
const limpa = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
{
	const plano = (T.fala ?? '').split(/\s+/).map(limpa).filter(Boolean);
	const fala = PS.map((p) => limpa(p.text)).filter(Boolean);
	const k = plano.findIndex((x, i) => x !== fala[i]);
	if (k >= 0 || plano.length !== fala.length) {
		const j = k >= 0 ? k : Math.min(plano.length, fala.length);
		pare(
			`O plano não bate com a fala. src/tempos.json foi feito para outra fala: na palavra ${j + 1} o plano tem "${plano[j] ?? '(fim)'}" e src/palavras.json tem "${fala[j] ?? '(fim)'}". ` +
				'Refaça "cenas", "blocos", "fixo", "marcas", "texto" e "duracao_q" em src/tempos.json e as ilustrações em src/Cenas.tsx sobre a fala nova (modelos/youtubedark01/youtubedark01.md §9), e cole o texto da fala nova no campo "fala" (linha 2).',
		);
	}
	const n = PS.length;
	const ids = [...T.blocos.flatMap((b) => b.linhas.flat()), ...(T.fixo?.linhas ?? []).flatMap((l) => l.ids), ...Object.values(T.marcas ?? {}).map((m) => m[0])];
	const fora = ids.find((i) => !(i >= 0 && i < n));
	if (fora !== undefined) pare(`src/tempos.json usa a palavra ${fora}, mas a fala tem ${n} palavras (0 a ${n - 1}): refaça os ids de "blocos", "fixo" e "marcas".`);
	for (const [nome, [i, palavra]] of Object.entries(T.marcas ?? {}))
		if (limpa(PS[i].text) !== limpa(palavra)) pare(`a marca "${nome}" de src/tempos.json aponta a palavra ${i} ("${PS[i].text}"), não "${palavra}": acerte o índice.`);
	for (const b of T.blocos) if (!T.cenas.some((c) => c.id === b.cena)) pare(`o bloco ${b.id} de src/tempos.json está na cena ${b.cena}, que não existe em "cenas".`);
	if (T.duracao_q < q(PS[n - 1].end)) pare(`"duracao_q" (${T.duracao_q}) corta a fala, que acaba no quadro ${q(PS[n - 1].end)}: aumente em src/tempos.json.`);
}

export const ini = (i: number) => q(PS[i].start);
/** quadro da marca do plano (src/tempos.json → "marcas"); a cena que pede uma marca que o plano não tem para com a mensagem */
export const marca = (nome: string) => {
	const m = T.marcas?.[nome];
	return m ? ini(m[0]) : pare(`src/Cenas.tsx pede a marca "${nome}", que não está em src/tempos.json → "marcas". Ponha "${nome}": [índice da palavra, "palavra"] ou tire o uso dela da cena.`);
};
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
