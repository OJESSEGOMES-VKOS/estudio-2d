import PB from './palavras.json';
import {Chave, POSE} from './Camera';
import {FPS} from './tempos';

/**
 * O PLANO do vídeo: tudo o que está preso à fala de origem mora neste arquivo. O resto do src/ é o modelo (câmera,
 * grade, montagem, tela de reels, prévias, títulos, conta no gelo, pedido) e fica igual. Este arquivo chega com o plano
 * do vídeo aprovado. Vídeo novo: refazer este arquivo sobre o src/palavras.json novo
 * (modelos/youtubeedition01/youtubeedition01.md, seção 11) e conferir com `node scripts/checar.mjs`.
 * Cada parte se desliga sem mexer no desenho: lista vazia ([]) ou `null`.
 * O plano frase a frase do aprovado está na seção 12 do mesmo arquivo.
 */
type Pal = {text: string; start: number; end: number};
export const PS = PB as Pal[];

export const pare = (msg: string): never => {
	throw new Error(`\n\n[youtubeedition01] ${msg}\n`);
};
const limpa = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
if (!PS.length) pare('src/palavras.json está vazio: rode tools/novo-video.py (ou tools/preparar.py) com a gravação.');
const REFAZER = 'O plano é de outra fala: refaça src/plano.ts sobre o src/palavras.json novo (modelos/youtubeedition01/youtubeedition01.md, seção 11).';
/** a fala é a do vídeo aprovado? (impressão digital do texto do src/palavras.json do molde) */
export const FALA_DO_APROVADO = (() => {
	let h = 5381;
	for (const c of PS.map((p) => limpa(p.text)).join(' ')) h = (h * 33 + c.charCodeAt(0)) >>> 0;
	return h === 2431698839;
})();
/** nomes que só o aprovado pode mostrar (os modelos do criador e o nome deste modelo) */
export const NOMES_DO_APROVADO = ['youtubeedition01', 'edition01', 'modelodinamico01', 'modelodinamico03', 'modelopadrao01', 'superpodcast01', 'pregacaodinamica01', 'storypodcast01', 'profissional01'];
/** início (s) da palavra i da fala, conferindo que ela é `palavra` (sem contar maiúscula, acento e pontuação) */
const w = (i: number, palavra: string) => {
	const p = PS[i];
	if (!p) return pare(`src/plano.ts pede a palavra ${i} ("${palavra}"), mas a fala tem ${PS.length} palavras (0 a ${PS.length - 1}). ${REFAZER}`);
	if (limpa(p.text) !== limpa(palavra)) return pare(`src/plano.ts espera "${palavra}" na palavra ${i}, e a fala tem "${p.text}" em ${p.start.toFixed(2)} s. ${REFAZER}`);
	return p.start;
};
/** um tempo livre t (s), que não é o início de uma palavra, ancorado na palavra i (conferida como no `w`) */
const em = (t: number, i: number, palavra: string) => (w(i, palavra), t);

/** o fim: 0,7 s depois da última palavra (o pedido segura até aqui) */
export const DURACAO_Q = Math.round((PS[PS.length - 1].end + 0.7) * FPS);

/* ---------------------------------------------------------------- os tempos, cada um amarrado a uma palavra */
const T = {
	punch1: w(4, '100%'),
	editado: w(5, 'editado'),
	pelo: w(6, 'pelo'),
	claude: w(7, 'Claude'),
	largo1: w(10, 'criado'), // o bloco 100% sai aqui (4 palavras, 2,34 s)
	tela1: w(16, 'diferença'), // o cartão gira, entram dois
	varios: w(18, 'vários'), // a grade 3x2
	zoom: em(6.3, 19, 'modelos'),
	montagem: w(26, 'editar'), // "editar qualquer tipo de vídeo"
	largo2: w(31, 'usando'), // "usando o Claude."
	punch2: w(34, 'Inclusive'),
	reel: em(11.75, 38, 'no'), // "Instagram": o plano encolhe para a tela de reels
	nome: w(45, 'um'), // "um desses modelos.": YOUTUBE / EDITION01
	previas: w(49, 'posso'), // a janela das prévias
	entraPrevia: w(50, 'até'), // "até colocar"
	mas: w(62, 'Mas'),
	tela2: w(68, 'outros'), // "outros modelos": callback da grade
	esse: em(23.4, 72, 'como'), // "como esse": contorno e nome no cartão
	largo3: w(76, 'a'), // "aprender"
	cta: w(83, 'comenta'),
	edicao: w(84, 'edição'),
	aqui: w(85, 'aqui'),
};

/* ---------------------------------------------------------------- câmera: [t (s), pose, transição (0 = corte seco), gira?] */
export const chaves = (previas: boolean): Chave[] => [
	[0, POSE.punch(1.15, 0.36), 0],
	[T.punch1, POSE.cheio, 0], // abre para o plano inteiro: a parede acima da cabeça recebe o 100%
	[T.largo1, POSE.punch(1.12, 0.36), 0],
	[T.tela1, POSE.cartao, 0.38, true],
	[T.montagem, POSE.cheio, 0], // escondida pela montagem
	[T.largo2, POSE.cheio, 0],
	[T.punch2, POSE.punch(1.2, 0.36), 0],
	[T.reel, POSE.reel, 0.4],
	[T.nome, POSE.punch(1.12, 0.33), 0],
	...((previas
		? [
				[T.previas, POSE.baixo(1), 0.32],
			]
		: [[T.previas, POSE.cheio, 0]]) as Chave[]),
	[T.mas, POSE.punch(1.2, 0.36), 0],
	[T.tela2, POSE.cartao, 0.38, true],
	[T.largo3, POSE.cheio, 0],
	[T.cta, POSE.punch(1.15, 0.3), 0],
];

/* ---------------------------------------------------------------- as partes ([] ou null desliga) */
/** palavra-título gigante ATRÁS da pessoa (precisa de public/pessoa.webm, do scripts/recorte.py) */
export const ATRAS: {de: number; ate: number; linhas: string[]; size: number; top: number}[] = [{de: T.punch1, ate: T.largo1, linhas: ['100%'], size: 250, top: 118}];

/** frase NA FRENTE, sobre a camiseta: uma linha branca (palavra, quando entra) e a linha gigante amarela */
export type Frase = {de: number; ate: number; top: number; linha1: [string, number][]; linha2: [string, number][]};
export const FRASES: Frase[] = [{de: T.editado, ate: T.largo1, top: 1215, linha1: [['editado', T.editado], ['pelo', T.pelo]], linha2: [['Claude', T.claude]]}];

/** título de capítulo branco e pesado no centro do A-roll, com o fio amarelo embaixo (cada linha entra 0,08 s depois) */
export const TITULOS: {de: number; ate: number; top: number; linhas: string[]}[] = [{de: T.nome, ate: T.previas, top: 1150, linhas: ['youtube', 'edition01']}];

/** os vídeos da grade: public/ex/<nome>.mp4 (540x960). Cada um ganha o nome embaixo */
export const GRADE = ['modelodinamico03', 'superpodcast01', 'pregacaodinamica01', 'storypodcast01', 'profissional01', 'modelodinamico01'];
/** telas da grade no gelo; `par`: começa com dois lado a lado (em `varios` vira a grade, aproxima a partir de `zoom`) */
export const GRADES: {de: number; ate: number; par?: {varios: number; zoom: number}}[] = [
	{de: T.tela1, ate: T.montagem, par: {varios: T.varios, zoom: T.zoom}},
	{de: T.tela2, ate: T.largo3},
];

/** montagem: um vídeo cheio por corte seco, public/ex/cheio_<nome>.mp4 recortado a partir do segundo `recorte` do vídeo dele */
export const MONTAGEM: {recorte: number; planos: [number, number, string][]} | null = {
	recorte: 8.0,
	planos: [
		[T.montagem, 8.58, 'modelopadrao01'],
		[8.58, 8.9, 'profissional01'],
		[8.9, 9.22, 'modelodinamico03'],
		[9.22, T.largo2, 'superpodcast01'],
	],
};

/** tela de reels genérica em volta do plano (a pose POSE.reel nas chaves); o @ vem da prop `arroba` */
export const REEL: {de: number; ate: number} | null = {de: T.reel, ate: T.nome};

/** contorno amarelo e rótulo no cartão do rosto (o cartão tem de estar na pose POSE.cartao) */
export const ESTE: {de: number; ate: number; rotulo: string} | null = {de: T.esse, ate: T.largo3, rotulo: 'youtubeedition01'};

/** as prévias em cima (só com a prop `previas: true`; a câmera desce na chave do `de`) */
export const PREVIAS: {de: number; entra: number; ate: number} | null = {de: T.previas, entra: T.entraPrevia, ate: T.mas};

/** o pedido: degradê escuro e a frase de ação, a palavra-chave gigante em amarelo; fica até o fim */
export const CTA: {de: number; top: number; antes: string; chave: [string, number]; depois: [string, number]} | null = {
	de: T.cta,
	top: 1268,
	antes: 'comenta',
	chave: ['EDIÇÃO', T.edicao],
	depois: ['aqui embaixo', T.aqui],
};

/** conta no gelo: cada item entra quando é dito, num cartão que enche a tela; o rosto fica no cartão do canto (POSE.cartao
 * nas chaves, no `de`). É o plano B da montagem e da grade quando o criador não tem vídeos prontos. [item, quando é dito] */
export type Conta = {de: number; ate: number; itens: [string, number][]};
export const LISTA: Conta | null = null;

/* ---------------------------------------------------------------- trava: o plano do aprovado não vai para outra fala */
if (!FALA_DO_APROVADO) {
	const tem = (x: string) => NOMES_DO_APROVADO.includes(limpa(x));
	// as partes desligadas (null) viram "never" para o TypeScript; aqui elas voltam ao tipo largo
	const este = ESTE as unknown as {rotulo: string} | null, montagem = MONTAGEM as unknown as {planos: [number, number, string][]} | null;
	const achou = [
		...(TITULOS.some((d) => d.linhas.some(tem) || tem(d.linhas.join(''))) ? ['TITULOS = [] (ou um título com palavra dita na fala, nunca o nome do modelo)'] : []),
		...(este && tem(este.rotulo) ? ['ESTE = null (ou o rótulo real do vídeo que está no cartão)'] : []),
		...(GRADE.some(tem) ? ['GRADE = [] e GRADES = [] (ou os vídeos prontos do criador, com os nomes dele, em public/ex/)'] : []),
		...(montagem?.planos.some(([, , n]) => tem(n)) ? ['MONTAGEM = null (ou os vídeos prontos do criador em public/ex/cheio_<nome>.mp4)'] : []),
		...([...ATRAS.flatMap((a) => a.linhas), ...FRASES.flatMap((f) => [...f.linha1, ...f.linha2].map((p) => p[0])), ...((LISTA as Conta | null)?.itens.map((i) => i[0]) ?? [])].some(tem) ? ['tire de ATRAS, FRASES e LISTA o nome do modelo (o texto é sempre o que foi dito)'] : []),
	];
	if (achou.length) pare(`src/plano.ts ainda tem partes do plano do vídeo aprovado, e a fala é outra. Mude em src/plano.ts:\n  - ${achou.join('\n  - ')}\n(PREVIAS = null também, a menos que o criador tenha as prévias dele; e as props nomesPrevias com os nomes reais.)`);
}
