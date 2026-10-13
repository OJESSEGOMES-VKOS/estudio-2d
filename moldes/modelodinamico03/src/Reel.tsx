import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadSans} from '@remotion/google-fonts/InterTight';
import {loadFont as loadSerif} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadCond} from '@remotion/google-fonts/Anton';
import PB from './palavras.json';
import ROSTO_T from './rosto.json';

/**
 * Molde do modelodinamico03 (../../modelos/modelodinamico03/MODELO.md), feito na vitrine dos modelos.
 * Partiu do código do vídeo aprovado do modelo (2026-10-08): o mesmo grade âmbar
 * com grão, a mesma tipografia de 3 vozes (Inter Tight apertada, Playfair itálica, Anton em caixa alta, vermelho
 * #E01E1E só na palavra-chave) nascendo do desfoque palavra a palavra, legenda serifada pequena no peito, transições de
 * textura (desfoque, flash, chicote), número que conta no estilo da palavra-chave, tela de respiro e fecho.
 * 2026-10-12 (pedido do Jessé): toda palavra falada aparece na tela; VHS e grade viram opção (props efeitos e
 * tratamento, desligadas por padrão); a palavra a comentar vai entre aspas; o 100% é contador sem círculo.
 * O plano foi refeito frase a frase para a fala da vitrine (src/palavras.json).
 * 2026-10-13 (teste do estúdio aberto): o plano mora todo na seção "O PLANO" logo abaixo e cada índice de palavra vem
 * com a palavra esperada; se a fala mudou, o molde para ao carregar e diz o que refazer. Abertura, fecho, prévias,
 * desfoques, flash, chicote, telas de destaque e VHS se desligam com null ou lista vazia, sem mexer no desenho.
 */
export const FPS = 30;
const sans = loadSans('normal', {weights: ['500', '700', '800'], subsets: ['latin']});
const serif = loadSerif('italic', {weights: ['400', '500'], subsets: ['latin']});
loadSerif('normal', {weights: ['400'], subsets: ['latin']});
const cond = loadCond('normal', {weights: ['400'], subsets: ['latin']});
const SANS = sans.fontFamily;
const SERIF = serif.fontFamily;
const COND = cond.fontFamily;
const VERMELHO = '#E01E1E';
const NEON = '#FF3B1F';
const E = {out: Easing.bezier(0.16, 1, 0.3, 1), io: Easing.bezier(0.45, 0, 0.55, 1)};
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** tratamento: grade quente + vinheta + grão. efeitos: VHS (flash rosa, verde, linhas) e o fecho borrado em verde. Os dois desligados por padrão. */
export type Props = {previas: boolean; nomesPrevias: [string, string]; tratamento?: boolean; efeitos?: boolean};

type Pal = {texto: string; de: number; ate: number};
const PS: Pal[] = (PB as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));

/* ---------------------------------------------------------------- conferência do plano contra a fala (ao carregar)
 * Todo índice de palavra do plano vem com a palavra esperada. A comparação ignora maiúscula, acento e pontuação (o
 * Whisper varia nisso). Se não bate, o molde para aqui com o que refazer; o checador (scripts/cobertura.mjs) acha a linha
 * pelo trecho entre crases. */
const sem = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const foraDaFala = (onde: string, oque: string): never => {
	throw new Error(
		`O plano não bate com a fala de src/palavras.json (${PS.length} palavras).\n` +
			`src/Reel.tsx, ${onde}: ${oque}.\n` +
			'Refaça a seção "O PLANO" de src/Reel.tsx para a fala nova (LEIA.md, "Vídeo novo") e rode node scripts/cobertura.mjs.',
	);
};
const pw = (i: number, esperada: string, onde: string): Pal => {
	if (!Number.isInteger(i) || i < 0 || i >= PS.length) return foraDaFala(onde, `pede a palavra ${i}, mas a fala só vai de 0 a ${PS.length - 1}`);
	if (sem(PS[i].texto) !== sem(esperada)) foraDaFala(onde, `a palavra ${i} da fala é "${PS[i].texto}", o plano espera "${esperada}"`);
	return PS[i];
};
/** as palavras de `texto`, em ordem, a partir da palavra i0 */
const trecho = (i0: number, texto: string, onde: string) => texto.split(' ').map((p, k) => pw(i0 + k, p, onde));
/** o corte cai 2 quadros antes da palavra i (que tem de ser `esperada`) */
const c = (i: number, esperada: string) => pw(i, esperada, `\`c(${i}, '${esperada}')\``).de - 0.06;

if (!PS.length) throw new Error('src/palavras.json está vazio: este molde precisa da fala transcrita (tools/preparar.py ou tools/novo-video.py).');
/** fim da última palavra + 0,73 s (na vitrine: 29,63 + 0,73 = 30,36 s, a duração da voz) */
export const DURACAO = Math.round((PS[PS.length - 1].ate + 0.73) * 100) / 100;

/* ================================================================ O PLANO (refazer num vídeo novo; o resto do arquivo é o modelo)
 * Cada índice é a posição da palavra em src/palavras.json, com a palavra esperada ao lado. Peça opcional se desliga com
 * null ou lista vazia. Depois de mexer: node scripts/cobertura.mjs até zerar. */

/* trechos: os cortes, 2 quadros antes da palavra */
export const T = {
	justamente: c(11, 'justamente'), // corte seco: aberto -> fechado
	a: c(15, 'a'), // bloco "a diferença entre vários MODELOS"
	para2: c(25, 'para'), // desfoque -> aberto
	qualquer: c(27, 'qualquer'), // bloco "qualquer TIPO de vídeo"
	se1: c(35, 'se'), // VHS -> fechado ("se você estiver no Instagram")
	um: c(45, 'um'), // bloco "um desses modelos." (6ª rodada: sem o nome do modelo na tela)
	colocar: c(51, 'colocar'), // flash branco -> aberto / prévias em cima
	mas: c(62, 'mas'), // desfoque -> fechado, legenda padrão "Mas se você quiser realmente ver"
	outros: c(68, 'outros'), // desfoque -> tela de destaque (fundo borrado) só com o bloco "outros modelos de EDIÇÃO"
	aprender: c(75, 'aprender'), // chicote -> aberto, bloco "aprender a como USAR"
	comenta: c(83, 'comenta'), // VHS -> fecho "Comenta EDIÇÃO aqui embaixo"
};
/** cortes com desfoque (o plano novo nasce do borrão) */
const DESFOQUES: number[] = [T.para2, T.mas, T.outros];
/** flash branco no corte */
const FLASHES: number[] = [T.colocar];
/** chicote: borrão de movimento horizontal que vira a cena seguinte */
const CHICOTES: number[] = [T.aprender];
/** telas de destaque [de, ate]: fundo borrado e escuro, só o bloco por cima (texto comum não entra nelas) */
const RESPIROS: [number, number][] = [[T.outros, T.aprender]];
/** VHS [de, ate], só com a prop `efeitos`: flash rosa no início, tom verde e linhas até o fim (Infinity = até o fim do vídeo) */
const VHS: [number, number][] = [[T.se1, T.se1 + 1.6], [T.comenta, Infinity]];
/** peça que se desliga: opcional<Tipo>(null) a tira do vídeo (o tipo continua o mesmo) */
const opcional = <X,>(x: X | null): X | null => x;
/** janela das prévias (s), só com a prop `previas`: do flash do "colocar" ao desfoque do "Mas"; opcional(null) = sem prévias */
export const PREVIAS = opcional<{de: number; ate: number}>({de: T.colocar, ate: T.mas});

/** abertura (opcional<AberturaDef>(null) desliga): bloco de 3 vozes até o 1º corte; `contador` é o número dito, que conta de 0 até ele (null = sem número) */
type AberturaDef = {ate: number; cima: [number, string]; contador: [number, string] | null; baixo: [number, string]};
const ABERTURA = opcional<AberturaDef>({
	ate: T.justamente,
	cima: [0, 'Esse vídeo está sendo'],
	contador: [4, '100%'],
	baixo: [5, 'editado pelo Claude.'],
});
/** fecho (opcional<FechoDef>(null) desliga): o comando fixo e a palavra a comentar entre aspas, do comando até o fim */
type FechoDef = {comando: [number, string]; palavra: [number, string]};
const FECHO_DEF = opcional<FechoDef>({comando: [83, 'Comenta'], palavra: [84, 'edição']});

/* câmera: chaves [tempo, zoom, corte seco?]; entre chaves o zoom anda devagar */
const CAM: [number, number, boolean?][] = [
	[0, 1.0],
	[T.justamente, 1.06],
	[T.justamente, 1.3, true],
	[T.para2, 1.34],
	[T.para2, 1.03, true],
	[T.se1, 1.09],
	[T.se1, 1.3, true],
	[T.colocar, 1.35],
	[T.colocar, 1.02, true],
	[T.mas, 1.06],
	[T.mas, 1.12, true],
	[T.outros, 1.18],
	[T.outros, 1.28, true],
	[T.aprender, 1.32],
	[T.aprender, 1.03, true],
	[T.comenta, 1.08],
	[T.comenta, 1.12, true],
	[DURACAO, 1.18],
];

/** blocos de ênfase (texto por cima da pessoa, nas palavras fortes): `primeira` é o índice da 1ª palavra do bloco e as
 * linhas são as palavras ditas, em ordem; `camera` é o plano (do corte ao corte) que a câmera ajusta para o bloco caber */
export const BLOCOS: BlocoDef[] = [
	{de: T.a, ate: T.para2, camera: [T.justamente, T.para2], primeira: 15, linhas: [[['sans', 80, 'a diferença entre']], [['serif', 132, 'vários']]], carimbo: {idx: 19, palavra: 'modelos', tam: 300, dy: 84}},
	{de: T.qualquer, ate: T.se1, camera: [T.para2, T.se1], primeira: 27, linhas: [[['serif', 124, 'qualquer tipo de']], [['condRed', 260, 'vídeo']]]},
	{de: T.um, ate: T.colocar, camera: [T.se1, T.colocar], primeira: 45, linhas: [[['serif', 118, 'um desses modelos.']]]},
	{de: T.outros, ate: T.aprender, camera: [T.mas, T.aprender], primeira: 68, linhas: [[['serif', 124, 'outros modelos']], [['sans', 86, 'de'], ['condRed', 250, 'edição']], [['serif', 96, 'como esse']]]}, // camera: plano do "Mas" + tela de destaque
];
/** legenda: [índice da 1ª palavra, texto do pedaço] ('/' quebra a linha; até 2 linhas). Toda palavra fora dos destaques
 * entra uma vez só; a página fica até a próxima começar (a última até o fim). */
const PEDACOS: [number, string][] = [
	[8, 'Ele foi criado / justamente para te mostrar'],
	[20, 'que eu criei e melhorei / para editar'],
	[31, 'usando o Claude. Inclusive,'],
	[35, 'se você estiver no Instagram agora, / você está vendo apenas'],
	[48, 'Eu posso até colocar duas prévias'],
	[54, 'rápidas aqui em cima, / aceleradas em três vezes.'],
	[62, 'Mas se você quiser / realmente ver'],
	[74, 'e aprender a como usar / isso nos seus vídeos,'], // 6ª rodada: "como esse" fica no destaque
	[85, 'aqui embaixo que eu vou te mandar / na sua DM agora.'],
];
/* ================================================================ fim do plano */

/* o plano conferido contra a fala (para aqui, com a mensagem, se a fala mudou) */
if (ABERTURA) {
	const {cima, contador, baixo} = ABERTURA;
	trecho(cima[0], cima[1], `ABERTURA \`cima: [${cima[0]}, '${cima[1]}']\``);
	if (contador) {
		const onde = `ABERTURA \`contador: [${contador[0]}, '${contador[1]}']\``;
		pw(contador[0], contador[1], onde);
		if (!Number.isFinite(parseFloat(contador[1]))) foraDaFala(onde, 'o contador precisa ser um número dito (ex.: "100%"); sem número, use contador: null');
	}
	trecho(baixo[0], baixo[1], `ABERTURA \`baixo: [${baixo[0]}, '${baixo[1]}']\``);
}
const fechoDe = (f: FechoDef) => {
	const de = pw(f.comando[0], f.comando[1], `FECHO \`comando: [${f.comando[0]}, '${f.comando[1]}']\``).de - 0.06;
	pw(f.palavra[0], f.palavra[1], `FECHO \`palavra: [${f.palavra[0]}, '${f.palavra[1]}']\``);
	return {...f, de};
};
const FECHO = FECHO_DEF ? fechoDe(FECHO_DEF) : null;
BLOCOS.forEach((b) => {
	const onde = `BLOCOS, o bloco de \`primeira: ${b.primeira}\``;
	trecho(b.primeira, b.linhas.map((l) => l.map((x) => x[2]).join(' ')).join(' '), onde);
	if (b.carimbo) pw(b.carimbo.idx, b.carimbo.palavra, onde + ' (carimbo)');
});

BLOCOS.forEach((b) => {
	if (b.risca !== undefined && !(Number.isInteger(b.risca) && b.risca >= 0 && b.risca < b.linhas.length))
		foraDaFala(`BLOCOS, o bloco de \`primeira: ${b.primeira}\``, `risca: ${b.risca} pede a linha ${b.risca}, mas o bloco tem as linhas 0 a ${b.linhas.length - 1}`);
});

/* os cortes do plano: troca seca de câmera e as transições. Um bloco nasce 0,1 s antes do seu `de` (as palavras vêm do
 * desfoque), mas nunca antes do corte em que ele começa: assim ele não aparece no fim do plano anterior. */
export const CORTES = [...CAM.filter((k) => k[2]).map((k) => k[0]), ...DESFOQUES, ...FLASHES, ...CHICOTES];
export const surge = (de: number) => Math.max(de - 0.1, ...CORTES.filter((k) => k <= de + 1e-6));

const zoomEm = (t: number) => {
	let i = 0;
	CAM.forEach(([a], k) => {
		if (t >= a) i = k;
	});
	const [a, z0] = CAM[i];
	const prox = CAM[i + 1];
	if (!prox || prox[2]) return z0;
	return tw(t, a, prox[0], z0, prox[1], E.io);
};
/* o zoom puxa a partir da linha dos olhos; o texto mora abaixo do queixo medido (rosto.json) */
const ORIGEM = {x: 540, y: 610};
const DESCE = 260; // nas prévias a câmera dele desce (sem zoom) para abrir o terço de cima (4ª rodada: era 440; com a zona segura o queixo tem que ficar acima da 2ª posição da legenda)
const emPrevias = (t: number, previas: boolean) => previas && PREVIAS !== null && t >= PREVIAS.de && t < PREVIAS.ate;
const cameraBase = (t: number, previas: boolean) =>
	emPrevias(t, previas) && PREVIAS ? {z: tw(t, PREVIAS.de, PREVIAS.ate, 1.0, 1.02, E.io), desce: DESCE} : {z: zoomEm(t), desce: 0};
/* 2026-10-12, 5ª rodada (pedido do Jessé): o destaque não encolhe para caber; abre-se o plano. Em cada plano com destaque
 * a câmera ganha um ajuste constante (do corte ao corte): sobe (o rosto vai para cima) e, se a subida for mostrar a
 * borda de baixo do vídeo, aproxima só o necessário. Assim o bloco inteiro cabe entre o queixo e a legenda. */
type Ajuste = {de: number; ate: number; m: number; sobe: number};
let AJ: Ajuste[] | null = null;
const ajustes = (): Ajuste[] => {
	if (AJ) return AJ;
	const segs: [number, number, number][] = [
		...(ABERTURA ? [[0, ABERTURA.ate, alturaAbertura() * PADRAO] as [number, number, number]] : []),
		...BLOCOS.map((b) => [b.camera[0], b.camera[1], alturaBloco(b, PADRAO)] as [number, number, number]),
		...(FECHO ? [[FECHO.de, DURACAO + 1, ALTURA_FECHO * PADRAO] as [number, number, number]] : []),
	];
	AJ = segs.map(([de, ate, h]) => {
		const alvo = LEG_Y2 - FOLGA_LEG - h - FOLGA_QUEIXO - 6;
		for (let m = 1; m < 1.6; m += 0.005) {
			let chin = 0, lim = Infinity;
			for (const [tr, , cy, hh] of ROSTO_T as number[][]) {
				if (tr < de - 0.25 || tr > ate + 0.25) continue;
				for (const tc of [Math.max(de, Math.min(ate - 0.01, tr)), ate - 0.01, de]) {
					const z = zoomEm(tc) * m;
					chin = Math.max(chin, ORIGEM.y + ((cy + hh / 2) * 1920 - ORIGEM.y) * z);
					lim = Math.min(lim, (1920 - ORIGEM.y) * (z - 1));
				}
			}
			const sobe = Math.max(0, chin - alvo);
			if (sobe <= lim) return {de, ate, m, sobe: Math.ceil(sobe)};
		}
		throw new Error(
			`O destaque do plano de ${de.toFixed(2)} a ${ate.toFixed(2)} s (${Math.round(h)} px de altura) não cabe entre o queixo e a legenda nem com a câmera subindo e aproximando até 1,6x. ` +
				'Use menos linhas nesse bloco de BLOCOS (ou na ABERTURA/FECHO_DEF) em src/Reel.tsx, ou divida-o em dois.',
		);
	});
	return AJ;
};
const camera = (t: number, previas: boolean) => {
	const b = cameraBase(t, previas);
	if (emPrevias(t, previas)) return b;
	const a = ajustes().find((x) => t >= x.de && t < x.ate);
	return a ? {z: b.z * a.m, desce: -a.sobe} : b;
};
/** para o checador: o queixo medido (sem câmera) mais baixo em [de, ate], em px, e o ajuste de câmera ativo em t */
export const queixoBruto = (de: number, ate: number) =>
	Math.max(0, ...(ROSTO_T as number[][]).filter(([tr]) => tr >= de - 0.25 && tr <= ate + 0.25).map(([, , cy, h]) => (cy + h / 2) * 1920));
export const ajusteEm = (t: number) => ajustes().find((x) => t >= x.de && t < x.ate) ?? null;
export {CAM, ORIGEM, zoomEm, emPrevias};
export const queixoMax = (de: number, ate: number, previas: boolean) => {
	let y = 0;
	for (const [tr, , cy, h] of ROSTO_T as number[][]) {
		if (tr < de - 0.25 || tr > ate + 0.25) continue;
		const bruto = (cy + h / 2) * 1920;
		for (const tc of [Math.max(de, Math.min(ate - 0.01, tr)), ate - 0.01]) {
			const {z, desce} = camera(tc, previas);
			y = Math.max(y, ORIGEM.y + (bruto - ORIGEM.y) * z + desce);
		}
	}
	return y;
};

/* transições de textura (as listas estão no plano) */
const desfoqueEm = (t: number) => Math.max(0, ...DESFOQUES.map((k) => (t < k ? tw(t, k - 0.12, k, 0, 22, E.io) : tw(t, k, k + 0.16, 22, 0, E.out))));
const emFlashVhs = (t: number, ef: boolean) => ef && VHS.some(([k]) => t >= k && t < k + 3 / FPS);
const emVhs = (t: number, ef: boolean) => ef && VHS.some(([a, b]) => t >= a && t < b);
const flashBranco = (t: number) => Math.max(0, ...FLASHES.map((k) => (t >= k ? tw(t, k, k + 0.5, 1, 0, E.io) : 0)));
/** chicote: força (0 a 1) e lado do borrão (antes do corte -1, depois 1) */
const chicoteEm = (t: number) => {
	let ch = 0, lado = -1;
	for (const k of CHICOTES) {
		const v = t < k ? tw(t, k - 0.13, k, 0, 1, E.io) : tw(t, k, k + 0.17, 1, 0, E.out);
		if (v > ch) [ch, lado] = [v, t < k ? -1 : 1];
	}
	return {ch, lado};
};
const emRespiro = (t: number) => RESPIROS.some(([a, b]) => t >= a && t < b);

/* ---------------------------------------------------------------- vídeo com o grade quente */
const Video: React.FC<{t: number; f: number; z: number; desce: number; tratamento: boolean; efeitos: boolean}> = ({t, f, z, desce, tratamento, efeitos}) => {
	const vhs = emVhs(t, efeitos);
	const fv = emFlashVhs(t, efeitos);
	const respiro = emRespiro(t); // 6ª rodada: a tela de destaque só carrega "outros modelos de EDIÇÃO"
	const blur = desfoqueEm(t) + (respiro ? 26 : 0) + (efeitos && FECHO && t >= FECHO.de ? tw(t, FECHO.de, FECHO.de + 0.4, 0, 14) : 0);
	const {ch, lado} = chicoteEm(t);
	const jitter = vhs ? (random(`j${f}`) - 0.5) * 6 : 0;
	const grade = fv
		? 'grayscale(1) brightness(2.1) contrast(0.7)'
		: vhs
			? 'sepia(0.5) hue-rotate(38deg) saturate(0.75) contrast(1.25) brightness(0.68)'
			: tratamento
				? 'sepia(0.32) saturate(1.08) contrast(1.16) brightness(0.8)'
				: '';
	const v = <OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />;
	return (
		<AbsoluteFill
			style={{
				filter: `${grade}${blur > 0.2 ? ` blur(${blur}px)` : ''}${respiro ? ' brightness(0.55)' : ''}${ch > 0.02 ? ' url(#chicote)' : ''}`,
				transform: `translateX(${jitter + lado * ch * 90}px)`,
				WebkitMaskImage: desce > 0 ? 'linear-gradient(180deg, transparent 0px, transparent 520px, #000 700px)' : undefined,
			}}
		>
			<AbsoluteFill style={{transform: `translateY(${desce}px) scale(${z})`, transformOrigin: `${ORIGEM.x}px ${ORIGEM.y}px`}}>
				{v}
			</AbsoluteFill>
			<svg width="0" height="0" style={{position: 'absolute'}}>
				<filter id="chicote" x="-10%" y="0" width="120%" height="100%">
					<feGaussianBlur stdDeviation={`${ch * 60} 0`} />
				</filter>
			</svg>
		</AbsoluteFill>
	);
};
const Grao: React.FC<{f: number}> = ({f}) => (
	<AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.16}}>
		<svg width="1080" height="1920">
			<filter id={`g${f % 8}`}>
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 8} />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="1080" height="1920" filter={`url(#g${f % 8})`} />
		</svg>
	</AbsoluteFill>
);
/* a cor (âmbar + vinheta) fica embaixo das prévias, que mantêm a cor do modelo delas */
const Cor: React.FC = () => (
	<>
		<AbsoluteFill style={{background: '#6B3A12', mixBlendMode: 'soft-light', opacity: 0.55}} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 60% at 50% 42%, rgba(0,0,0,0) 40%, rgba(8,4,2,0.72) 100%)'}} />
	</>
);
const Textura: React.FC<{t: number; f: number; efeitos: boolean}> = ({t, f, efeitos}) => {
	const vhs = emVhs(t, efeitos);
	const fv = emFlashVhs(t, efeitos);
	return (
		<>
			{vhs && <AbsoluteFill style={{background: '#2E4A1C', mixBlendMode: 'color', opacity: 0.35}} />}
			{(vhs || fv) && <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px)'}} />}
			{fv && <AbsoluteFill style={{background: '#F2B6EC', mixBlendMode: 'multiply', opacity: 0.9}} />}
			{vhs && random(`r${f}`) > 0.93 && <div style={{position: 'absolute', left: 0, width: 1080, top: 300 + random(`y${f}`) * 1300, height: 6, background: 'rgba(255,255,255,0.35)', filter: 'blur(1px)'}} />}
			<AbsoluteFill style={{background: '#fff', opacity: flashBranco(t)}} />
		</>
	);
};

/* ---------------------------------------------------------------- tipografia editorial: 3 vozes, palavra nasce do desfoque */
type Voz = 'sans' | 'serif' | 'cond' | 'condRed';
type Linha = [Voz, number, string][];
const estilo = (voz: Voz, tam: number): React.CSSProperties => {
	if (voz === 'serif') return {fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: tam, lineHeight: 0.95, letterSpacing: '-0.01em', color: '#F6EFE6'};
	if (voz === 'cond' || voz === 'condRed') return {fontFamily: COND, fontSize: tam, lineHeight: 0.86, textTransform: 'uppercase', letterSpacing: '-0.005em', color: voz === 'condRed' ? VERMELHO : '#FFFFFF'};
	return {fontFamily: SANS, fontWeight: 800, fontSize: tam, lineHeight: 0.95, letterSpacing: '-0.045em', color: '#FFFFFF'};
};
const nasce = (t: number, de: number): React.CSSProperties => {
	const e = tw(t, de - 0.06, de + 0.14, 0, 1);
	return {opacity: e, filter: `blur(${(1 - e) * 16}px)`, transform: `translateY(${(1 - e) * 34}px)`, display: 'inline-block'};
};
type BlocoDef = {
	de: number;
	ate: number;
	primeira: number;
	linhas: Linha[];
	/** plano de câmera [de, ate] (do corte ao corte) que sobe/aproxima para o bloco caber entre o queixo e a legenda */
	camera: [number, number];
	/** palavra-chave vermelha atrás do bloco branco, como carimbo de fundo (ref1 2,1 "PESSOAS" atrás de "Relação"); `palavra` é a esperada no índice */
	carimbo?: {idx: number; palavra: string; tam: number; dy: number};
	/** negação (MODELO §3): índice da linha (0 = a 1ª) riscada pelo traço vermelho em diagonal; sem risca, nada muda */
	risca?: number;
	/** linha extra que não é fala (o nome do modelo), com o tempo em que nasce */
	extra?: {txt: string; voz: Voz; tam: number; de: number; brilho?: boolean};
};
/* altura aproximada do bloco (para a legenda morar logo abaixo dele) */
const alturaBloco = (b: BlocoDef, escala: number) =>
	Math.max(b.linhas.reduce((s, l) => s + Math.max(...l.map(([v, tam]) => tam * (v.startsWith('cond') ? 0.86 : 0.95))), 0) + (b.extra ? 6 + b.extra.tam * 0.86 : 0), b.carimbo ? b.carimbo.dy + b.carimbo.tam * 0.86 : 0) * escala;
const Bloco: React.FC<BlocoDef & {t: number; top: number; escala?: number}> = ({t, de, ate, primeira, linhas, top, carimbo, extra, risca, escala = 1}) => {
	if (t < surge(de) || t >= ate) return null;
	const sai = tw(t, ate - 0.12, ate, 0, 1, E.io);
	let k = primeira;
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top, textAlign: 'center', opacity: 1 - sai, filter: `blur(${sai * 18}px)`, textShadow: '0 4px 30px rgba(0,0,0,0.45)'}}>
			{carimbo && (
				<div style={{position: 'absolute', left: 0, right: 0, top: carimbo.dy * escala, whiteSpace: 'nowrap'}}>
					<span style={{...estilo('condRed', carimbo.tam * escala), ...nasce(t, PS[carimbo.idx].de), textShadow: '0 6px 34px rgba(0,0,0,0.35)'}}>{PS[carimbo.idx].texto.replace(/[.,]/g, '')}</span>
				</div>
			)}
			{linhas.map((l, i) => {
				const pecas = l.map(([voz, tam, txt], j) =>
					txt.split(' ').map((p, m) => {
						const d = PS[k++].de;
						return (
							<span key={`${j}-${m}`} style={{...estilo(voz, tam * escala), ...nasce(t, d), marginLeft: j || m ? tam * escala * (voz.startsWith('cond') ? 0.16 : 0.22) : 0}}>
								{p}
							</span>
						);
					})
				);
				if (risca !== i)
					return (
						<div key={i} style={{whiteSpace: 'nowrap', position: 'relative'}}>
							{pecas}
						</div>
					);
				/* negação (MODELO §3): o traço de caneta vermelho risca a linha em diagonal, desenhado da esquerda para a
				 * direita logo depois da última palavra dela (o mesmo do vídeo de 2026-10-08, "edita esse vídeo") */
				const r = tw(t, PS[k - 1].ate + 0.05, PS[k - 1].ate + 0.35, 0, 1, E.io);
				return (
					<div key={i} style={{whiteSpace: 'nowrap', position: 'relative'}}>
						<span style={{position: 'relative', display: 'inline-block'}}>
							{pecas}
							<span style={{position: 'absolute', left: '-5%', top: '50%', width: '110%', height: 10 * escala, borderRadius: 5 * escala, background: VERMELHO, boxShadow: '0 2px 10px rgba(0,0,0,0.35)', transform: `rotate(-5deg) scaleX(${r})`, transformOrigin: 'left center'}} />
						</span>
					</div>
				);
			})}
			{extra && (
				<div style={{whiteSpace: 'nowrap', marginTop: 6 * escala}}>
					<span style={{...estilo(extra.voz, extra.tam * escala), ...nasce(t, extra.de), ...(extra.brilho ? {textShadow: `0 0 14px rgba(255,59,31,0.55), 0 0 40px rgba(255,59,31,0.35), 0 4px 30px rgba(0,0,0,0.4)`} : {})}}>{extra.txt}</span>
				</div>
			)}
		</div>
	);
};

/* ---------------------------------------------------------------- abertura: "Esse vídeo está sendo [contador 0 a 100%] editado pelo Claude." */
const CONTADOR = 250; // mesma condensada vermelha de MODELOS e EDIÇÃO
const alturaAbertura = () => (ABERTURA?.contador ? 70 * 0.95 + 18 + CONTADOR * 0.86 + 10 + 104 * 0.95 : 70 * 0.95 + 18 + 104 * 0.95);
const Abertura: React.FC<{t: number; top: number; escala: number}> = ({t, top, escala: k}) => {
	if (!ABERTURA || t >= ABERTURA.ate) return null;
	const {ate, cima, contador, baixo} = ABERTURA;
	const d = contador ? PS[contador[0]].de : 0;
	const v = contador ? Math.round(tw(t, d - 0.1, d + 0.6, 0, parseFloat(contador[1]), E.io)) : 0;
	const sai = tw(t, ate - 0.12, ate, 0, 1, E.io);
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top, textAlign: 'center', opacity: 1 - sai, filter: `blur(${sai * 16}px)`, textShadow: '0 4px 30px rgba(0,0,0,0.45)'}}>
			<div style={{whiteSpace: 'nowrap'}}>
				{cima[1].split(' ').map((p, i) => (
					<span key={i} style={{...estilo('sans', 70 * k), ...nasce(t, PS[cima[0] + i].de), marginLeft: i ? 15 * k : 0}}>
						{p}
					</span>
				))}
			</div>
			{contador ? (
				<div style={{whiteSpace: 'nowrap', margin: `${18 * k}px 0 ${10 * k}px`}}>
					<span style={{...estilo('condRed', CONTADOR * k), ...nasce(t, d - 0.08), fontVariantNumeric: 'tabular-nums', textShadow: '0 6px 34px rgba(0,0,0,0.35)'}}>{v}{contador[1].replace(/^[\d.,]+/, '')}</span>
				</div>
			) : (
				<div style={{height: 18 * k}} />
			)}
			<div style={{whiteSpace: 'nowrap'}}>
				{baixo[1].split(' ').map((p, i) => (
					<span key={i} style={{...estilo('serif', 104 * k), ...nasce(t, PS[baixo[0] + i].de), marginLeft: i ? 22 * k : 0}}>
						{p}
					</span>
				))}
			</div>
		</div>
	);
};

/* ---------------------------------------------------------------- legenda corrida (2ª rodada 2026-10-12, pedido do Jessé)
 * Uma narração calma: cada trecho da fala aparece UMA vez, numa posição fixa só (LEG_Y), em páginas de até 2 linhas
 * ('/' quebra a linha). As palavras nascem com a fala dentro da página; a página fica até a próxima começar (a última
 * até o fim). Nada de palavra solta: página curta foi juntada com a vizinha. */
/* 3ª rodada (2026-10-12): a legenda volta para o peito, a posição da regra (ref2 28–60 s: centro da legenda a 49,4% do
 * quadro, ~5% abaixo do queixo). Aqui o enquadramento põe o queixo mais baixo (máx. medido 1163 no fechado), então o
 * peito fica em 1220 (topo). Na 4ª rodada os destaques sobem para cima dela e ela desce à 2ª posição (ver ZONA). Nas prévias a câmera desce e o queixo
 * vai a 1497: só nessa janela a legenda usa a 2ª posição (LEG_Y2), trocando no flash branco. */
export const LEG_Y = 1220;
/* 4ª rodada (2026-10-12): zona segura das redes em 9:16. Todo texto mora em x 60–940 e y 250–1500 (fora ficam os
 * ~250 px de cima, ~420 de baixo, ~140 da direita e ~60 da esquerda, onde a interface do Instagram/TikTok cobre).
 * Os destaques sobem para entre o queixo e a legenda; enquanto um destaque está na tela a legenda usa a 2ª posição
 * (LEG_Y2, com o pé em 1500), a mesma das prévias. Fora disso fica em LEG_Y (1220). */
export const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};
const ZW = ZONA.dir - ZONA.esq;
const LEG_TAM = 58;
const LEG_LINHA = LEG_TAM * 1.18;
export const LEG_Y2 = Math.floor(ZONA.base - 2 * LEG_LINHA);
/* largura estimada (em por caractere) para caber na largura da zona */
const FATOR: Record<string, number> = {sans: 0.53, serif: 0.45, cond: 0.46, condRed: 0.46, leg: 0.47};
export const larguraTxt = (txt: string, voz: string, tam: number) => txt.length * FATOR[voz] * tam;
const legTam = (linhas: string[][]) => Math.min(LEG_TAM, ...linhas.map((l) => (LEG_TAM * ZW) / larguraTxt(l.join(' '), 'leg', LEG_TAM)));
/* intervalos em que um destaque está na tela */
const destaquesAtivos = (): [number, number][] => [
	...(ABERTURA ? [[0, ABERTURA.ate] as [number, number]] : []),
	...BLOCOS.map((b) => [b.de - 0.1, b.ate] as [number, number]),
	...(FECHO ? [[FECHO.de, DURACAO + 1] as [number, number]] : []),
];
const ida = (t: number) => Math.max(0, ...destaquesAtivos().map(([a, b]) => (t < a ? tw(t, a - 0.3, a - 0.08, 0, 1, E.io) : t < b ? 1 : tw(t, b, b + 0.22, 1, 0, E.io))));
export const legY = (t: number, previas: boolean) => (emPrevias(t, previas) ? LEG_Y2 : LEG_Y + (LEG_Y2 - LEG_Y) * ida(t));
type Pagina = {linhas: string[][]; de: number; ate: number; i0: number; n: number};
export const PAGINAS: Pagina[] = PEDACOS.map(([i0, txt], j) => {
	const linhas = txt.split(' / ').map((l) => l.split(' '));
	const n = linhas.flat().length;
	trecho(i0, linhas.flat().join(' '), `PEDACOS, o pedaço \`'${txt}'\``);
	const prox = PEDACOS[j + 1];
	const fim = prox ? PS[prox[0]].de - 0.06 : DURACAO + 1;
	/* 6ª rodada: texto comum não entra na tela de destaque; a página que atravessa o início dela termina ali (+0.04: some
	 * no pico do desfoque do corte) */
	const de = PS[i0].de - 0.06;
	const ate = RESPIROS.reduce((a, [r]) => (de < r && a > r ? r + 0.04 : a), fim);
	return {linhas, i0, n, de, ate};
});
const Legenda: React.FC<{t: number; previas: boolean}> = ({t, previas}) => {
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	if (!pg) return null;
	const sai = tw(t, pg.ate - 0.1, pg.ate, 0, 1, E.io);
	let k = pg.i0;
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: legY(t, previas), textAlign: 'center', opacity: 1 - sai, fontFamily: SERIF, fontStyle: 'normal', fontWeight: 400, fontSize: legTam(pg.linhas), lineHeight: 1.18, color: '#F6EFE6', textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 4px 22px rgba(0,0,0,0.55)'}}>
			{pg.linhas.map((l, i) => (
				<div key={i} style={{whiteSpace: 'nowrap'}}>
					{l.map((p, m) => {
						const d = PS[k++].de;
						return <span key={m} style={{...nasce(t, d), marginLeft: m ? 15 : 0}}>{p.replace(/,$/, '')}</span>;
					})}
				</div>
			))}
		</div>
	);
};

/* ---------------------------------------------------------------- prévias: dois outros modelos no terço de cima, a câmera dele desce */
const PREV = {w: 372, h: 661, y: 112, x: [130, 578]};
export const PreviasEmCima: React.FC<{t: number; nomes: [string, string]}> = ({t, nomes}) => {
	if (!PREVIAS || t < PREVIAS.de || t >= PREVIAS.ate) return null;
	const sai = tw(t, PREVIAS.ate - 0.12, PREVIAS.ate, 0, 1, E.io);
	const de0 = Math.round(PREVIAS.de * FPS);
	return (
		<AbsoluteFill style={{opacity: 1 - sai, filter: sai > 0.01 ? `blur(${sai * 18}px)` : undefined}}>
			{[0, 1].map((i) => {
				const d = PREVIAS.de + i * 0.14;
				const e = tw(t, d, d + 0.35, 0, 1);
				const rot = (i ? 1.6 : -1.6) * (1 - 0.35 * tw(t, d, PREVIAS.ate, 0, 1, (x) => x));
				const sobe = tw(t, d, PREVIAS.ate, 0, -18, (x) => x);
				return (
					<div key={i} style={{position: 'absolute', left: PREV.x[i], top: PREV.y, width: PREV.w}}>
						<div style={{position: 'relative', width: PREV.w, height: PREV.h, overflow: 'hidden', borderRadius: 4, opacity: e, filter: `blur(${(1 - e) * 16}px)`, transform: `translateY(${(1 - e) * 40 + sobe}px) rotate(${rot}deg)`, boxShadow: '0 18px 50px rgba(0,0,0,0.6)', background: '#0d0906'}}>
							<Sequence from={de0} layout="none">
								<OffthreadVideo muted src={staticFile(`previa${i + 1}.mp4`)} style={{width: PREV.w, height: PREV.h, objectFit: 'cover'}} />
							</Sequence>
							<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 220, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.62))'}} />
						</div>
						<div style={{position: 'absolute', left: -20, right: -20, top: PREV.h - 78, textAlign: 'center', whiteSpace: 'nowrap', transform: `translateY(${sobe}px) rotate(${rot}deg)`}}>
							<span style={{...estilo('sans', 44), ...nasce(t, d + 0.2), textShadow: '0 2px 6px rgba(0,0,0,0.7), 0 4px 24px rgba(0,0,0,0.6)'}}>{nomes[i]}</span>
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- tela de respiro: uma ideia por vez sobre o fundo borrado */
/* ---------------------------------------------------------------- fecho: "Comenta EDIÇÃO aqui embaixo" na parte de baixo, sobre o vídeo borrado em VHS */
const Fecho: React.FC<{t: number; top: number; escala: number}> = ({t, top, escala: k}) => {
	if (!FECHO || t < FECHO.de) return null;
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top, textAlign: 'center'}}>
			<div style={{...estilo('sans', 76 * k), fontWeight: 500, ...nasce(t, PS[FECHO.comando[0]].de), marginBottom: 40 * k, textShadow: '0 4px 26px rgba(0,0,0,0.45)'}}>{FECHO.comando[1]}</div>
			<div style={{whiteSpace: 'nowrap'}}>
				<span style={{...estilo('condRed', 250 * k), ...nasce(t, PS[FECHO.palavra[0]].de), textShadow: '0 6px 40px rgba(0,0,0,0.4)'}}>{`“${FECHO.palavra[1]}”`}</span>
			</div>
		</div>
	);
};
const ALTURA_FECHO = 76 * 0.95 + 40 + 250 * 0.86;

/* ---------------------------------------------------------------- lugar dos destaques (4ª rodada): entre o queixo e a legenda na 2ª posição,
 * encolhendo o que for preciso para caber na altura da faixa e na largura da zona segura. */
const FOLGA_QUEIXO = 30, FOLGA_LEG = 16;
/** tamanho padrão de todo destaque (5ª rodada): o mesmo para todos; só a largura da zona pode reduzir um pouco */
export const PADRAO = 0.9;
const faixa = (de: number, ate: number, previas: boolean) => {
	const top = Math.round(Math.max(ZONA.topo, queixoMax(de, ate, previas) + FOLGA_QUEIXO));
	return {top, alt: LEG_Y2 - FOLGA_LEG - top};
};
const larguraLinha = (l: Linha) => l.reduce((s, [v, tam, txt], j) => s + larguraTxt(txt, v, tam) + (j ? tam * 0.2 : 0), 0);
export const lugarBloco = (b: BlocoDef, previas = false) => {
	const {top} = faixa(b.de, b.ate, previas);
	const larg = Math.max(...b.linhas.map(larguraLinha), b.extra ? larguraTxt(b.extra.txt, b.extra.voz, b.extra.tam) : 0, b.carimbo ? larguraTxt(PS[b.carimbo.idx].texto.replace(/[.,]/g, ''), 'cond', b.carimbo.tam) : 0);
	const escala = Math.min(PADRAO, ZW / larg);
	return {top, escala, fundo: top + alturaBloco(b, escala), larg: Math.min(ZW, larg * escala)};
};
/** lugar da abertura e do fecho; null quando a peça está desligada no plano */
export const lugarAbertura = () => {
	if (!ABERTURA) return null;
	const {top} = faixa(0, ABERTURA.ate, false);
	const {cima, contador, baixo} = ABERTURA;
	const larg = contador
		? Math.max(larguraTxt(cima[1], 'sans', 70), larguraTxt(contador[1], 'cond', CONTADOR), larguraTxt(baixo[1], 'serif', 104))
		: Math.max(larguraTxt(cima[1], 'sans', 70), larguraTxt(baixo[1], 'serif', 104));
	const escala = Math.min(PADRAO, ZW / larg);
	return {top, escala, fundo: top + alturaAbertura() * escala, larg: larg * escala};
};
export const lugarFecho = () => {
	if (!FECHO) return null;
	const {top} = faixa(FECHO.de, DURACAO, false);
	const larg = Math.max(larguraTxt(FECHO.comando[1], 'sans', 76), larguraTxt(`“${FECHO.palavra[1].toUpperCase()}”`, 'cond', 250));
	const escala = Math.min(PADRAO, ZW / larg);
	return {top, escala, fundo: top + ALTURA_FECHO * escala, larg: larg * escala};
};

export const VitrineDinamico03: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], tratamento = true, efeitos = false}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const prev = emPrevias(t, previas);
	const {z, desce} = camera(t, previas);
	const la = lugarAbertura(), lf = lugarFecho();
	return (
		<AbsoluteFill style={{background: prev ? '#0d0906' : '#000'}}>
			<Video t={t} f={f} z={z} desce={desce} tratamento={tratamento} efeitos={efeitos} />
			{tratamento && <Cor />}
			{previas && <PreviasEmCima t={t} nomes={nomesPrevias} />}
			<Textura t={t} f={f} efeitos={efeitos} />
			{la && <Abertura t={t} top={la.top} escala={la.escala} />}
			{BLOCOS.map((b, i) => {
				const {top, escala} = lugarBloco(b, previas);
				return <Bloco key={i} t={t} {...b} top={top} escala={escala} />;
			})}
			{lf && <Fecho t={t} top={lf.top} escala={lf.escala} />}
			<Legenda t={t} previas={previas} />
			{tratamento && <Grao f={f} />}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- conferência (scripts/cobertura.mjs)
 * exibicoes(): cada elemento de texto com as palavras da fala que ele mostra, quando fica na tela e (legenda) onde. */
const nPal = (b: BlocoDef) => b.linhas.reduce((s, l) => s + l.reduce((q, [, , txt]) => q + txt.split(' ').length, 0), 0);
export type Exib = {nome: string; tipo: 'destaque' | 'legenda'; ids: number[]; de: number; ate: number; y?: number; fundo?: number; topo?: number; queixo?: number; linhas?: number};
/** com previas, a página que atravessa a janela das prévias vira dois trechos (um em cada posição) */
const seq = (i0: number, n: number) => Array.from({length: n}, (_, k) => i0 + k);
const trechos = (de: number, ate: number, previas: boolean): [number, number][] => {
	if (!previas || !PREVIAS) return [[de, ate]];
	return [[de, Math.min(ate, PREVIAS.de)], [Math.max(de, PREVIAS.de), Math.min(ate, PREVIAS.ate)], [Math.max(de, PREVIAS.ate), ate]].filter(([a, b]) => b > a) as [number, number][];
};
export const exibicoes = (previas = false): Exib[] => {
	const out: Exib[] = [];
	const la = lugarAbertura(), lf = lugarFecho();
	if (ABERTURA && la) {
		const {cima, baixo, ate} = ABERTURA;
		out.push({nome: 'abertura', tipo: 'destaque', ids: seq(cima[0], baixo[0] + baixo[1].split(' ').length - cima[0]), de: PS[cima[0]].de - 0.06, ate, topo: la.top, fundo: la.fundo});
	}
	for (const b of BLOCOS) out.push({nome: b.linhas.map((l) => l.map((x) => x[2]).join(' ')).join(' / '), tipo: 'destaque', ids: [...seq(b.primeira, nPal(b)), ...(b.carimbo ? [b.carimbo.idx] : [])], de: b.de, ate: b.ate, topo: lugarBloco(b).top, fundo: lugarBloco(b).fundo});
	if (FECHO && lf) out.push({nome: `fecho ${FECHO.comando[1]} “${FECHO.palavra[1].toUpperCase()}”`, tipo: 'destaque', ids: [FECHO.comando[0], FECHO.palavra[0]], de: FECHO.de, ate: DURACAO, topo: lf.top, fundo: lf.fundo});
	for (const g of PAGINAS)
		for (const [a, b] of trechos(g.de, Math.min(g.ate, DURACAO), previas))
			out.push({nome: g.linhas.map((l) => l.join(' ')).join(' / '), tipo: 'legenda', ids: seq(g.i0, g.n), de: a, ate: b, y: legY(a + 0.001, previas), queixo: queixoMax(a, b, previas), linhas: g.linhas.length});
	return out;
};
/** palavras da fala escritas na tela no tempo t (a palavra conta a partir de quando nasce) */
export const palavrasNaTela = (t: number): number[] => {
	const vis: number[] = [];
	for (const e of exibicoes()) {
		if (t < e.de || t >= e.ate) continue;
		for (const i of e.ids) if (t >= PS[i].de - 0.02) vis.push(i); // nasce de -0,06 a +0,14; em -0,02 já está legível
	}
	return vis;
};

/** caixas de todo texto visível no tempo t (conferência de zona segura e de choque; x pela largura estimada, centrada na zona) */
export const caixas = (t: number, previas = false) => {
	const cx = (ZONA.esq + ZONA.dir) / 2;
	const cxa = (larg: number) => [cx - larg / 2, cx + larg / 2];
	const out: {nome: string; tipo: string; x0: number; x1: number; y0: number; y1: number}[] = [];
	const la = lugarAbertura(), lf = lugarFecho();
	if (ABERTURA && la && t < ABERTURA.ate) { const [x0, x1] = cxa(la.larg); out.push({nome: 'abertura', tipo: 'destaque', x0, x1, y0: la.top, y1: la.fundo}); }
	BLOCOS.forEach((b) => { if (t >= surge(b.de) && t < b.ate) { const l = lugarBloco(b, previas); const [x0, x1] = cxa(l.larg); out.push({nome: b.linhas.map((q) => q.map((x) => x[2]).join(' ')).join(' / '), tipo: 'destaque', x0, x1, y0: l.top, y1: l.fundo}); } });
	if (FECHO && lf && t >= FECHO.de) { const [x0, x1] = cxa(lf.larg); out.push({nome: 'fecho', tipo: 'destaque', x0, x1, y0: lf.top, y1: lf.fundo}); }
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	if (pg) {
		const tam = legTam(pg.linhas), y = legY(t, previas);
		const larg = Math.max(...pg.linhas.map((l) => larguraTxt(l.join(' '), 'leg', tam)));
		const [x0, x1] = cxa(larg);
		out.push({nome: pg.linhas.map((l) => l.join(' ')).join(' / '), tipo: 'legenda', x0, x1, y0: y, y1: y + pg.linhas.length * tam * 1.18});
	}
	if (previas && PREVIAS && t >= PREVIAS.de && t < PREVIAS.ate) PREV.x.forEach((x) => out.push({nome: 'nome da prévia', tipo: 'nome', x0: x + PREV.w / 2 - 170, x1: x + PREV.w / 2 + 170, y0: PREV.y + PREV.h - 78, y1: PREV.y + PREV.h - 34}));
	return out;
};
