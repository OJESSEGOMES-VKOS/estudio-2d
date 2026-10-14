import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, getStaticFiles, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as loadSerif} from '@remotion/google-fonts/DMSerifDisplay';
import {loadFont as loadScript} from '@remotion/google-fonts/GreatVibes';
import P from './palavras_voz.json'; // scripts/palavras.py: src/palavras.json com o começo ancorado no ataque da voz
import W from './palavras.json'; // a transcrição de tools/novo-video.py (só para conferir que palavras_voz.json é desta fala)
import ROSTO_T from './rosto.json'; // entrada padrão: [[t,cx,cy,h]] a cada 0,25 s, em fração do quadro

/**
 * Molde do profissional01 (../../modelos/profissional01/MODELO.md), feito na vitrine dos modelos.
 * Código de partida: o último vídeo aprovado do modelo (um vídeo de cliente), que veio do vídeo do dentista
 * (2026-10-07). Ficou o sistema inteiro: câmera de deriva lenta com cortes de ênfase,
 * legenda limpa (bemclean) em Poppins 600 72 px, títulos de até 3 linhas com lugar reservado, telas cheias no desenho
 * do modelodinamico02 (dois fundos que alternam, tipografia grande palavra a palavra, objeto herói), tela dividida com o
 * vídeo sempre embaixo e o painel/ilustração em cima, linha de destaque na divisa, rótulo em pílula branca, flash na
 * ênfase e botão de ação que acende na palavra.
 * Muda o que é da fala nova e do cenário: a cor de destaque sai da parede bege (caramelo), e nada do cliente.
 */
export const FPS = 30;
export const DURACAO = P.duracao;
const pop = loadPoppins('normal', {weights: ['500', '600', '800'], subsets: ['latin']});
const serif = loadSerif('normal', {weights: ['400'], subsets: ['latin']});
const script = loadScript('normal', {weights: ['400'], subsets: ['latin']});
const SANS = pop.fontFamily;
const SERIF = serif.fontFamily;
const SCRIPT = script.fontFamily;

/* mundo de cor (MODELO §7): uma cor de destaque tirada do cenário. Aqui a parede bege/taupe da gravação vira um
   caramelo; os papéis são os mesmos do verde-água do dentista (escuro, escuro2, destaque, destaque2, clara, creme, tinta) */
const C = {
	escuro: '#16110D',
	escuro2: '#3B2D22',
	cor: '#8F5F33',
	cor2: '#B27C48',
	fundoCor: '#6A4422',
	clara: '#EBCB9F',
	creme: '#F4EFE6',
	tinta: '#1F160F',
};
const E = {out: Easing.bezier(0.22, 1, 0.36, 1), io: Easing.bezier(0.45, 0, 0.55, 1)};
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const mola = (t: number, de: number, d = 18) => (t < de ? 0 : spring({frame: (t - de) * FPS, fps: FPS, config: {damping: d, stiffness: 120, mass: 0.8}}));

type Pal = {texto: string; de: number; ate: number};
const PS: Pal[] = P.palavras;
if (!PS.length) throw new Error('src/palavras_voz.json está vazio: rode tools/novo-video.py e depois scripts/palavras.py.');
/** texto do plano x fala: sem maiúscula, acento nem pontuação (o Whisper varia) */
export const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
/* palavras_voz.json velho (de outra gravação, como o que vem do molde) não passa: para e diz o comando */
const WT = W as {text: string}[];
if (WT.length !== PS.length || WT.some((w, i) => norm(w.text) !== norm(PS[i].texto)))
	throw new Error(`src/palavras_voz.json não é desta fala (${PS.length} palavras; src/palavras.json tem ${WT.length}). Rode na pasta do vídeo: ../../.venv/Scripts/python.exe scripts/palavras.py`);
/** plano que não bate com a fala: para ao carregar e diz em português qual lista refazer (nada de TypeError) */
const errPlano = (lista: string, oque: string) =>
	new Error(`O plano de src/Reel.tsx não bate com a fala de src/palavras_voz.json (${PS.length} palavras, de 0 a ${PS.length - 1}). Na lista ${lista}: ${oque}. Refaça o plano para a fala nova (modelos/profissional01/profissional01.md, seção 9).`);
const de = (i: number, lista = 'T') => {
	if (!PS[i]) throw errPlano(lista, `a palavra nº ${i} não existe`);
	return PS[i].de;
};
/** confere se as palavras escritas no plano são as da fala a partir do índice i0 */
const confere = (lista: string, i0: number, txt: string) =>
	txt.split(' ').filter((x) => x && x !== '/').forEach((x, k) => {
		const f = PS[i0 + k];
		if (!f) throw errPlano(lista, `"${txt}" passa da última palavra da fala`);
		if (norm(f.texto) !== norm(x)) throw errPlano(lista, `em "${txt}", "${x}" não bate com a palavra ${i0 + k} da fala ("${f.texto}")`);
	});
const c = (t: number) => t - 0.06; // corte 2 quadros antes da palavra

/* ================================================================ O PLANO (preso à fala; num vídeo novo, refazer T,
 * trechos, CAM, MARCAS, LISTA, CURTA_JUNTO, ROSTO_MEDIDO, ENTRADAS, PEDACOS, TELAS, CTA, FLASH e TITULOS). Os números são índices de palavras de
 * src/palavras_voz.json (0 = a 1ª). Lista vazia ou null desliga a parte. */
type Modo = 'video' | 'tela' | 'celular' | 'previas' | 'lista';
export const T = {
	ele: de(7) + 0.43, // "Ele foi criado justamente para" (a legenda entra quando "Claude." já ficou 0,43 s)
	telas: c(de(13)), // "te mostrar a diferença entre vários modelos" (tela 1)
	tela2: c(de(20)), // "que eu criei e melhorei"
	tela3: c(de(25)), // "para editar qualquer tipo de vídeo usando o Claude."
	celular: c(de(34)), // "Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos."
	eu: c(de(48)), // "Eu posso até colocar"
	previas: c(de(52)), // "duas prévias rápidas aqui em cima, aceleradas em três vezes."
	mas: c(de(62)), // "Mas se você quiser realmente" (ênfase)
	ver: de(68) - 0.04, // "outros modelos de edição como esse" (corte 1 quadro antes: "ver" fica 0,4 s na legenda)
	aprender: c(de(74)), // "e aprender a como usar isso nos seus vídeos," (tela 4)
	comenta: c(de(83)), // "comenta edição aqui embaixo que eu vou te mandar na sua DM agora." (fecho)
};
/* as palavras que fazem cada peça agir (índices); cada peça lê as suas na ordem */
const MARCAS = {
	cartoes: [18], // "vários": os outros dois cartões saem de trás
	barras: [22, 24], // "criei" nascem as barras, "melhorei" a última sobe
	linhaTempo: [26], // "editar": a lâmina corta
	player: [78, 82], // "usar": o vídeo toca; "vídeos": ganha a legenda
	celular: [39, 46], // "Instagram": a interface acende; "desses": os outros celulares saem de trás
};
Object.entries(MARCAS).forEach(([k, is]) => is.forEach((i) => de(i, `MARCAS.${k}`)));
/* painel de lista (modo 'lista'): título do cabeçalho, itens e as palavras dos vistos; null desliga.
   vistos: uma palavra por item (cada visto na sua palavra, o item da vez acende) ou só [primeira, última] (os vistos
   espaçados por igual entre as duas). acende: 'davez' (o item da vez) ou o índice da palavra em que o último acende */
const LISTA = {
	titulo: 'Modelos de edição',
	itens: ['modelodinamico01', 'modelopadrao01', 'modelodinamico03', 'pregacaodinamica01', 'storypodcast01', 'superpodcast01', 'youtubeedition01', 'profissional01'],
	vistos: [68, 71], // "outros" até "edição"
	acende: 72 as number | 'davez', // "como": este modelo acende
} as {titulo: string; itens: string[]; vistos: number[]; acende: number | 'davez'} | null;
if (LISTA) {
	LISTA.vistos.forEach((i) => de(i, 'LISTA.vistos'));
	if (typeof LISTA.acende === 'number') de(LISTA.acende, 'LISTA.acende');
	if (LISTA.vistos.length !== LISTA.itens.length && LISTA.vistos.length !== 2)
		throw errPlano('LISTA', `${LISTA.vistos.length} vistos para ${LISTA.itens.length} itens (ponha um por item, ou só a primeira e a última palavra)`);
}
/* telas cheias: a palavra que vem depois de uma de até 2 letras entra junto com ela (o "e" não fica sozinho na ponta
   da linha esperando a próxima palavra). Vídeo novo: true. false = como no vídeo aprovado */
const CURTA_JUNTO = false;
/* páginas da legenda com entrada própria (índice da 1ª palavra -> tempo); as outras entram com a voz */
const ENTRADAS: Record<number, number> = {8: T.ele};
/* fecho: o campo de comentário recebe Comenta “PALAVRA” (i = índice de "comenta"; a palavra é a seguinte; de = o corte
   do fecho); null desliga. Fora do plano, o fecho só lê o CTA (nunca T) */
const CTA = {i: 83, comando: 'Comenta', palavra: '“EDIÇÃO”', de: T.comenta} as {i: number; comando: string; palavra: string; de: number} | null;
if (CTA) confere('CTA', CTA.i, `${CTA.comando} ${CTA.palavra}`);
/* flash na ênfase (tempo do corte); null desliga. Sem public/flash.mp4, o molde desenha um flash branco no lugar */
const FLASH = T.mas as number | null;
const trechos = (previas: boolean): [number, Modo][] => [
	[0, 'video'],
	[T.telas, 'tela'],
	[T.celular, 'celular'],
	// com prévias, a dividida das prévias já abre em "Eu posso até colocar" (sozinho no vídeo o pedaço ficava < 1,5 s)
	...(previas ? ([[T.eu, 'previas']] as [number, Modo][]) : ([[T.eu, 'video']] as [number, Modo][])),
	[T.mas, 'video'],
	[T.ver, 'lista'],
	[T.aprender, 'tela'],
	[T.comenta, 'video'],
];
const trecho = (t: number, previas: boolean) => {
	const TR = trechos(previas);
	let i = 0;
	TR.forEach(([a], k) => {
		if (t >= a) i = k;
	});
	return {a: TR[i][0], fim: TR[i + 1] ? TR[i + 1][0] : DURACAO, modo: TR[i][1]};
};

/* câmera: deriva bem lenta (<1%/s); "true" = corte. Ênfases: "Mas se você quiser" (aproxima) e o fecho (abre o quadro) */
const CAM: [number, number, boolean?][] = [
	[0, 1.0],
	[T.telas, 1.035],
	[T.eu, 1.03, true],
	[T.mas, 1.07],
	[T.mas, 1.18, true], // ênfase: "Mas se você quiser realmente"
	[T.ver, 1.195],
	[T.comenta, 1.0, true], // abre o quadro no fecho
	[DURACAO, 1.03],
];
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

/* o ponto entre os olhos, origem do zoom e da metade de baixo da dividida. Na vitrine, medido à mão (src/rosto.json +
   quadro de 5 s); num vídeo novo, null = a mediana de src/rosto.json (olhos ~0,09 da altura do rosto acima do centro) */
const ROSTO_MEDIDO = {x: 590, y: 620} as {x: number; y: number} | null;
const med = (v: number[]) => [...v].sort((a, b) => a - b)[v.length >> 1];
const RT = ROSTO_T as number[][];
const ROSTO = ROSTO_MEDIDO ?? (RT.length ? {x: Math.round(med(RT.map((r) => r[1])) * 1080), y: Math.round((med(RT.map((r) => r[2])) - 0.09 * med(RT.map((r) => r[3]))) * 1920)} : {x: 540, y: 620});
const COR = 'contrast(1.06) saturate(0.94) brightness(0.98)';
const Fala: React.FC<{zoom: number}> = ({zoom}) => (
	<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${ROSTO.x}px ${ROSTO.y}px`, filter: COR}}>
		<OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />
	</AbsoluteFill>
);

const suave = (t: number, d: number, dur = 0.4): React.CSSProperties => {
	const e = tw(t, d - 0.06, d - 0.06 + dur, 0, 1);
	return {opacity: e, filter: `blur(${(1 - e) * 4}px)`, transform: `translateY(${(1 - e) * 10}px)`};
};

/* ---------------------------------------------------------------- legenda limpa (bemclean); '#n' pula n palavras */
/* 2026-10-12: cada pedaço >= 1,5 s, até 2 linhas (' / '), cada trecho da fala uma vez só */
const PEDACOS = [
	'#8',
	'Ele foi criado / justamente para',
	'#7', // tela 1: "te mostrar a diferença entre vários modelos"
	'#5',
	'#9',
	'Inclusive, se você estiver / no *Instagram* agora,', 'você está vendo / apenas *um* desses modelos.',
	'Eu posso até colocar / duas *prévias* rápidas', 'aqui em *cima*, / aceleradas em *três vezes.*',
	'Mas se você quiser / realmente ver',
	'*outros modelos* / de *edição* como esse',
	'#9',
	'#2', // fecho: Comenta "EDIÇÃO" fixo
	'aqui embaixo que eu vou / te mandar na sua DM agora.',
];
type Pagina = {txt: string; i0: number; n: number; de: number; ate: number};
const PAGINAS: Pagina[] = (() => {
	const out: (Pagina | null)[] = [];
	let k = 0;
	for (const p of PEDACOS) {
		if (p.startsWith('#')) {
			k += Number(p.slice(1));
			out.push(null);
			continue;
		}
		const qtd = p.split(' ').filter((w) => w !== '/').length;
		// entra com a voz, mas nunca antes de a palavra anterior ter ficado 0,4 s na tela (nem antes do fim do título)
		confere('PEDACOS', k, p.replace(/\*/g, ''));
		const d = ENTRADAS[k] ?? Math.max(c(PS[k].de), k ? PS[k - 1].de + 0.4 : 0); // entra no quadro do corte (2 quadros antes da voz)
		out.push({txt: p.replace(/,(\*?)$/, '$1'), i0: k, n: qtd, de: d, ate: PS[k + qtd - 1].ate});
		k += qtd;
	}
	if (k !== PS.length) throw errPlano('PEDACOS', `as páginas e os saltos '#n' cobrem ${k} palavras e a fala tem ${PS.length}`);
	return out.flatMap((g, i) => {
		if (!g) return [];
		const prox = out[i + 1];
		const fim = prox && prox.de - g.ate < 0.7 ? prox.de : g.ate + 0.4;
		return [{...g, ate: fim}];
	});
})();
/* zona segura das redes em 9:16 (todo texto): x 60–940, y 250–1500, centro horizontal em x 500 */
export const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};
const ZW = ZONA.dir - ZONA.esq;
/* largura estimada (em por caractere, com folga) para encolher só a linha que passaria da zona */
const FATOR = {base: 0.6, ancora: 0.6, serif: 0.5, script: 0.42} as const;
const telaTam = (l: {txt: string; tam: number; fonte?: 'script' | 'serif' | 'ancora'}) => Math.min(l.tam, (l.tam * (ZW / 1.04)) /  larguraTxt(l.txt, l.fonte ?? 'base', l.tam));
export const larguraTxt = (txt: string, voz: keyof typeof FATOR, tam: number) => txt.replace(/\*/g, '').length * FATOR[voz] * tam;
/* legenda em 2 posições só: LEG_Y no peito (gravação) e LEG_Y2, pé em 1500 (tela dividida e fecho) */
export const LEG_Y = 1150;
const LEG_TAM = 72;
const LEG_TAM2 = 56;
const LEG_LH = 1.25;
export const LEG_Y2 = Math.floor(ZONA.base - 2 * LEG_TAM2 * LEG_LH - 6);
export const legTam = (txt: string, base: number) => Math.min(base, ...txt.split(' / ').map((l) => (base * (ZW - 20)) / (larguraTxt(l, 'base', base) + (l.split('*').length - 1) * 16)));
export const legAltura = (txt: string, base: number) => txt.split(' / ').length * legTam(txt, base) * LEG_LH;
const Legenda: React.FC<{t: number; y: number; destaque?: boolean}> = ({t, y, destaque}) => {
	const pe = y === LEG_Y2;
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	if (!pg) return null;
	const e = tw(t, pg.de, pg.de + 2 / FPS, 0.5, 1);
	const tam = legTam(pg.txt, pe ? LEG_TAM2 : LEG_TAM);
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: y, textAlign: 'center', opacity: e, fontFamily: SANS, fontWeight: 600, fontSize: tam, lineHeight: LEG_LH, color: '#fff', letterSpacing: '0.005em', textShadow: '0 2px 4px rgba(0,0,0,0.45), 0 4px 22px rgba(0,0,0,0.4)'}}>
			{pg.txt.split(' / ').map((linha, j) => (
				<div key={j} style={{whiteSpace: 'nowrap'}}>
					{linha.split(/(\*[^*]+\*)/).filter(Boolean).map((s, i) =>
						s.startsWith('*') && destaque ? (
							<span key={i} style={{background: C.cor, borderRadius: 12, padding: '0 14px 3px', margin: '0 2px', textShadow: 'none', boxShadow: '0 6px 18px rgba(0,0,0,0.22)'}}>
								{s.slice(1, -1)}
							</span>
						) : (
							<span key={i}>{s.replace(/\*/g, '')}</span>
						)
					)}
				</div>
			))}
		</div>
	);
};

/* ---------------------------------------------------------------- títulos no vídeo: lugar reservado, até 3 linhas */
type Voz = 'base' | 'ancora' | 'serif' | 'script';
type Linha = [Voz, number, string][];
const estilo = (voz: Voz, tam: number): React.CSSProperties => {
	if (voz === 'ancora') return {fontFamily: SANS, fontWeight: 800, fontSize: tam, letterSpacing: '-0.03em', lineHeight: 1.02};
	if (voz === 'serif') return {fontFamily: SERIF, fontSize: tam, lineHeight: 1.02};
	if (voz === 'script') return {fontFamily: SCRIPT, fontSize: tam * 1.3, lineHeight: 0.92};
	return {fontFamily: SANS, fontWeight: 600, fontSize: tam, letterSpacing: '-0.01em', lineHeight: 1.18};
};
const Titulo: React.FC<{t: number; de: number; ate: number; primeira: number; linhas: Linha[]; top: number; marca?: number}> = ({t, de: d, ate, primeira, linhas, top, marca}) => {
	if (t < d - 0.1 || t >= ate) return null;
	const sai = tw(t, ate - 0.22, ate, 1, 0, E.io);
	let k = primeira;
	return (
		<div style={{position: 'absolute', left: 40, right: 40, top, textAlign: 'center', color: '#fff', opacity: sai, textShadow: '0 2px 6px rgba(0,0,0,0.35), 0 6px 26px rgba(0,0,0,0.4)'}}>
			{linhas.map((l, i) => {
				const k0 = k;
				const pedacos = l.map(([voz, tam, txt], j) =>
					txt.split(' ').map((palavra, m) => {
						const p = PS[k++];
						return (
							<span key={`${j}-${m}`} style={{...estilo(voz, tam), ...suave(t, p.de), display: 'inline-block', marginLeft: j || m ? tam * 0.24 : 0}}>
								{palavra}
							</span>
						);
					})
				);
				const pm = marca === i ? tw(t, PS[k0].de, PS[k0].de + 0.5, 0, 1, E.io) : 0;
				return (
					<div key={i} style={{whiteSpace: 'nowrap'}}>
						<span style={{position: 'relative', display: 'inline-block'}}>
							{marca === i && <span style={{position: 'absolute', left: -16, bottom: '4%', height: '46%', width: `calc(${pm * 100}% + ${pm * 32}px)`, background: C.cor, borderRadius: 8, opacity: 0.92}} />}
							<span style={{position: 'relative'}}>{pedacos}</span>
						</span>
					</div>
				);
			})}
		</div>
	);
};
const Sombra: React.FC = () => <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.2) 56%, rgba(0,0,0,0.2) 74%, rgba(0,0,0,0) 88%)'}} />;

/* ================================================================ TELA CHEIA (modelodinamico02) */
type Fundo = 'E' | 'L';
type LT = {txt: string; tam: number; fonte?: 'script' | 'serif' | 'ancora'; acento?: boolean};
type Heroi = React.FC<{t: number; de: number; fim: number; fg: string; ac: string}>;
type Tela = {de: number; fundo: Fundo; topo: number; linhas: LT[]; primeira: number; heroi: Heroi};
const Ptela: React.FC<{t: number; de: number; children: React.ReactNode; first: boolean}> = ({t, de: d, children, first}) => {
	const k = tw(t, d - 0.04, d + 0.16, 0, 1);
	return <span style={{display: 'inline-block', marginLeft: first ? 0 : '0.24em', opacity: k, filter: `blur(${(1 - k) * 16}px)`, transform: `translateX(${(1 - k) * 34}px)`}}>{children}</span>;
};
const BlocoTela: React.FC<{t: number; s: Tela; fg: string; sub: string; ac: string}> = ({t, s, fg, sub, ac}) => {
	let k = s.primeira;
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: s.topo, textAlign: 'center'}}>
			{s.linhas.map((l, i) => {
				const grande = l.tam >= 120;
				const fam = l.fonte === 'script' ? SCRIPT : l.fonte === 'serif' ? SERIF : SANS;
				const cor = l.acento ? ac : grande ? fg : sub;
				const ps = l.txt.split(' ');
				const tam = telaTam(l);
				let antes = 0;
				return (
					<div key={i} style={{fontFamily: fam, fontSize: tam, fontWeight: l.fonte === 'script' || l.fonte === 'serif' ? 400 : grande ? 800 : 600, letterSpacing: l.fonte ? 0 : grande ? '-0.045em' : '-0.015em', lineHeight: l.fonte === 'script' ? 1.1 : grande ? 0.98 : 1.2, color: cor, whiteSpace: 'nowrap', position: 'relative'}}>
						{ps.map((p, j) => {
							// CURTA_JUNTO: a palavra depois de uma de até 2 letras entra junto com ela (adiantada, nunca atrasada)
							const d = CURTA_JUNTO && j > 0 && norm(ps[j - 1]).length <= 2 ? antes : PS[k].de;
							antes = d;
							k++;
							return (
								<Ptela key={j} t={t} de={d} first={j === 0}>
									{j === ps.length - 1 ? p.replace(/,$/, '') : p}
								</Ptela>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

/* heróis: um objeto por tela, que faz o que a frase diz */
const entra = (k: number): React.CSSProperties => ({opacity: Math.min(1, k * 2), transform: `scale(${0.8 + 0.2 * k})`});

/* "a diferença entre vários modelos": o mesmo quadro dele em três cartões 9:16, cada um com uma edição diferente */
const Cartoes: Heroi = ({t, de: d, fg, ac}) => {
	const k = mola(t, d + 0.05);
	const abre = mola(t, de(MARCAS.cartoes[0]) - 0.04, 16); // "vários": os outros dois saem de trás
	const W = 280;
	const H = (W * 16) / 9;
	const cartao = (i: number) => {
		const lado = i - 1;
		const kk = lado === 0 ? k : abre;
		const marcas: React.ReactNode[] = [
			/* legenda limpa */
			<div key="a" style={{position: 'absolute', left: 30, right: 30, top: H * 0.62, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.92)'}} />,
			/* tela dividida */
			<React.Fragment key="b">
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: H / 2, background: ac}} />
				<div style={{position: 'absolute', left: 30, width: W - 60, top: H * 0.16, height: 16, borderRadius: 8, background: C.tinta, opacity: 0.6}} />
				<div style={{position: 'absolute', left: 30, width: (W - 60) * 0.6, top: H * 0.16 + 30, height: 16, borderRadius: 8, background: C.tinta, opacity: 0.6}} />
			</React.Fragment>,
			/* título grande */
			<React.Fragment key="c">
				<div style={{position: 'absolute', left: 26, right: 26, top: H * 0.58, height: 34, borderRadius: 8, background: '#fff'}} />
				<div style={{position: 'absolute', left: 60, right: 60, top: H * 0.58 + 46, height: 16, borderRadius: 8, background: ac}} />
			</React.Fragment>,
		];
		return (
			<div
				key={i}
				style={{
					position: 'absolute',
					left: 540 - W / 2 + lado * 270 * kk,
					top: 1090 + Math.abs(lado) * 40 * kk,
					width: W,
					height: H,
					borderRadius: 26,
					overflow: 'hidden',
					border: `6px solid ${fg}`,
					boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)',
					transform: `rotate(${lado * 9 * kk}deg) scale(${lado === 0 ? 0.8 + 0.2 * k : 0.92})`,
					opacity: lado === 0 ? Math.min(1, k * 2) : Math.min(1, abre * 2),
					zIndex: lado === 0 ? 2 : 1,
				}}
			>
				<Img src={staticFile('quadro.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				{marcas[i]}
			</div>
		);
	};
	return <div style={{position: 'absolute', inset: 0}}>{[0, 2, 1].map(cartao)}</div>;
};

/* "que eu criei e melhorei": as barras nascem em "criei" e a última sobe com a seta em "melhorei" */
const Barras: Heroi = ({t, fg, ac}) => {
	const [criei, melhorei] = MARCAS.barras.map((i) => de(i));
	const k = mola(t, criei - 0.04);
	const sobe = mola(t, melhorei - 0.04, 14);
	const alturas = [150, 230, 310, 360];
	const base = 1600;
	return (
		<svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{alturas.map((h0, i) => {
				const kk = tw(t, criei - 0.04 + i * 0.08, criei + 0.5 + i * 0.08, 0, 1);
				const h = (h0 + (i === 3 ? 170 * sobe : 0)) * kk;
				const x = 250 + i * 150;
				return <rect key={i} x={x} y={base - h} width="110" height={h} rx="18" fill={i === 3 ? ac : fg} opacity={i === 3 ? 1 : 0.55 + i * 0.12} />;
			})}
			<g opacity={Math.min(1, sobe * 2)} transform={`translate(${705} ${base - (360 + 170 * sobe) - 70 - 20 * sobe})`}>
				<path d="M0 50 L0 -10 M-34 22 L0 -14 L34 22" fill="none" stroke={ac} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
			</g>
			<rect x="220" y={base} width={640 * k} height="8" rx="4" fill={fg} opacity="0.5" />
		</svg>
	);
};

/* "para editar qualquer tipo de vídeo": a linha do tempo de um editor, a agulha anda e a lâmina corta em "editar" */
const LinhaTempo: Heroi = ({t, de: d, fim, fg, ac}) => {
	const k = mola(t, d + 0.05);
	const ed = de(MARCAS.linhaTempo[0]);
	const corta = tw(t, ed - 0.04, ed + 0.3, 0, 1);
	const agulha = tw(t, d + 0.1, fim, 0.12, 0.9, (x) => x);
	const X0 = 130;
	const LW = 820;
	const blocos: [number, number][] = [
		[0, 0.3],
		[0.32, 0.62],
		[0.64, 1],
	];
	const cx = 0.47; // onde a lâmina corta o bloco do meio
	return (
		<div style={{position: 'absolute', left: X0 - 30, top: 1130, width: LW + 60, height: 380, borderRadius: 30, background: 'rgba(0,0,0,0.28)', border: '2px solid rgba(244,239,230,0.14)', ...entra(k)}}>
			<svg width={LW + 60} height="380" viewBox={`0 0 ${LW + 60} 380`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{/* trilha de vídeo */}
				{blocos.map(([a, b], i) => {
					const partes: [number, number][] = i === 1 && corta > 0 ? [[a, cx], [cx, b]] : [[a, b]];
					return partes.map(([pa, pb], j) => {
						const dx = i === 1 && corta > 0 ? (j === 0 ? -10 : 10) * corta : 0;
						return <rect key={`${i}-${j}`} x={30 + pa * LW + dx + 3} y="60" width={(pb - pa) * LW - 6} height="110" rx="14" fill={fg} opacity={0.9} />;
					});
				})}
				{/* trilha de áudio */}
				{Array.from({length: 54}).map((_, i) => {
					const h = 14 + Math.abs(Math.sin(i * 1.7) * 40 + Math.sin(i * 0.6) * 22);
					return <rect key={i} x={30 + i * (LW / 54) + 2} y={262 - h / 2} width={LW / 54 - 6} height={h} rx="4" fill={ac} opacity="0.85" />;
				})}
				{/* lâmina */}
				{corta > 0 && <line x1={30 + cx * LW} x2={30 + cx * LW} y1={40} y2={40 + 150 * corta} stroke={ac} strokeWidth="8" strokeLinecap="round" opacity={1 - tw(t, ed + 0.4, ed + 0.8, 0, 1)} />}
				{/* agulha */}
				<g transform={`translate(${30 + agulha * LW} 0)`}>
					<line x1="0" x2="0" y1="30" y2="340" stroke="#fff" strokeWidth="5" />
					<path d="M-16 14 H16 V30 L0 44 L-16 30 Z" fill="#fff" />
				</g>
			</svg>
		</div>
	);
};

/* "aprender a como usar isso nos seus vídeos": o vídeo toca em "usar" e ganha a legenda em "vídeos" */
const Player: Heroi = ({t, de: d, fim, fg, ac}) => {
	const k = mola(t, d + 0.05);
	const [usar, videos] = MARCAS.player.map((i) => de(i));
	const usa = tw(t, usar - 0.04, usar + 0.3, 0, 1);
	const prog = tw(t, usar, fim, 0, 1, (x) => x);
	const ed = mola(t, videos - 0.04);
	const W = 330;
	const H = (W * 16) / 9;
	return (
		<div style={{position: 'absolute', left: 540 - W / 2, top: 1040, width: W, height: H, borderRadius: 30, overflow: 'hidden', border: `6px solid ${fg}`, boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)', ...entra(k)}}>
			<Img src={staticFile('quadro.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${0.75 + 0.25 * usa})`}} />
			<div style={{position: 'absolute', left: W / 2 - 60, top: H / 2 - 60, width: 120, height: 120, borderRadius: 60, background: ac, opacity: 1 - usa, transform: `scale(${1 - 0.3 * usa})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<svg width="50" height="50" viewBox="0 0 50 50">
					<path d="M16 10 L40 25 L16 40 Z" fill={C.tinta} />
				</svg>
			</div>
			{/* a legenda que a edição põe no vídeo dele */}
			<div style={{position: 'absolute', left: 40, right: 40, top: H * 0.6, height: 26, borderRadius: 13, background: '#fff', opacity: Math.min(1, ed * 2), transform: `scale(${0.8 + 0.2 * ed})`}} />
			<div style={{position: 'absolute', left: 90, right: 90, top: H * 0.6 + 36, height: 26, borderRadius: 8, background: ac, opacity: Math.min(1, ed * 2), transform: `scale(${0.8 + 0.2 * ed})`}} />
			<div style={{position: 'absolute', left: 24, right: 24, bottom: 26, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.35)'}}>
				<div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 5, background: '#fff'}} />
			</div>
		</div>
	);
};

const TELAS: Tela[] = [
	{de: T.telas, fundo: 'E', topo: 520, primeira: 13, linhas: [{txt: 'te mostrar', tam: 66}, {txt: 'a diferença entre vários', tam: 60}, {txt: 'modelos', tam: 170}], heroi: Cartoes},
	{de: T.tela2, fundo: 'L', topo: 540, primeira: 20, linhas: [{txt: 'que eu', tam: 66}, {txt: 'criei', tam: 170}, {txt: 'e melhorei', tam: 130, fonte: 'serif', acento: true}], heroi: Barras},
	{de: T.tela3, fundo: 'E', topo: 530, primeira: 25, linhas: [{txt: 'para editar qualquer', tam: 66}, {txt: 'tipo de vídeo', tam: 124}, {txt: 'usando o Claude.', tam: 100, fonte: 'serif', acento: true}], heroi: LinhaTempo},
	{de: T.aprender, fundo: 'L', topo: 480, primeira: 74, linhas: [{txt: 'e aprender a como', tam: 66}, {txt: 'usar isso', tam: 170}, {txt: 'nos seus vídeos,', tam: 130, fonte: 'script', acento: true}], heroi: Player},
];
const TelaCheia: React.FC<{t: number; fim: number}> = ({t, fim}) => {
	const i = TELAS.filter((s) => t >= s.de).length - 1;
	const s = TELAS[Math.max(0, i)];
	const escuro = s.fundo === 'E';
	const fg = C.creme;
	const sub = escuro ? 'rgba(244,239,230,0.82)' : 'rgba(244,239,230,0.9)';
	const ac = escuro ? C.clara : C.tinta;
	const z = 1 + Math.max(0, t - s.de) * 0.012;
	const fundo = escuro ? `radial-gradient(ellipse 90% 60% at 50% 38%, ${C.escuro2} 0%, ${C.escuro} 72%)` : `radial-gradient(ellipse 90% 70% at 50% 32%, ${C.cor2} 0%, ${C.cor} 62%, ${C.fundoCor} 100%)`;
	const H = s.heroi;
	return (
		<AbsoluteFill style={{background: fundo, overflow: 'hidden'}}>
			<AbsoluteFill style={{backgroundImage: `radial-gradient(${escuro ? 'rgba(235,203,159,0.07)' : 'rgba(255,255,255,0.08)'} 2px, transparent 2px)`, backgroundSize: '44px 44px'}} />
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 960px'}}>
				<H t={t} de={s.de} fim={fim} fg={fg} ac={escuro ? C.clara : C.creme} />
				<BlocoTela t={t} s={s} fg={fg} sub={sub} ac={ac} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* ================================================================ TELA DIVIDIDA: em cima ilustração/painel, embaixo o vídeo */
const METADE = 960;
/* 2026-10-12: olhos a 180 px do topo da metade (antes 320) para a legenda caber abaixo do queixo e dentro da zona segura */
const OLHOS_DIV = 180;
const Protagonista: React.FC<{t: number; a: number; fim: number}> = ({t, a, fim}) => {
	const z = tw(t, a, fim, 1.03, 1.06, E.io);
	return (
		<div style={{position: 'absolute', left: 0, top: METADE, width: 1080, height: METADE, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: OLHOS_DIV - ROSTO.y, width: 1080, height: 1920}}>
				<Fala zoom={z} />
			</div>
		</div>
	);
};
/* 2026-10-12, correção do flick: o painel de cima entrava em fade de 0,3 s (opacidade + subida de 30 px) e, nesses 9
   quadros, o Reel mantinha a gravação em tela cheia embaixo dele. A metade de cima mostrava por transparência outra
   cena (o rosto em outro enquadramento; no corte da tela de cor para o celular, um rosto que nem estava na tela antes).
   Agora o fundo do painel é opaco desde o 1º quadro (corte seco, como as outras trocas) e só o conteúdo entra animado. */
const Dividida: React.FC<{t: number; a: number; fim: number; children: React.ReactNode}> = ({t, a, fim, children}) => {
	const e = tw(t, a, a + 0.3, 0, 1);
	return (
		<AbsoluteFill>
			<Protagonista t={t} a={a} fim={fim} />
			<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: METADE, overflow: 'hidden'}}>{children}</div>
			<div style={{position: 'absolute', left: 0, top: METADE - 2, width: 1080 * e, height: 4, background: C.cor}} />
		</AbsoluteFill>
	);
};
const FundoPainel: React.FC<{t: number; a: number; children: React.ReactNode; origem?: string}> = ({t, a, children, origem = '540px 480px'}) => {
	const z = 1 + Math.max(0, t - a) * 0.012;
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse 90% 70% at 50% 40%, ${C.escuro2} 0%, ${C.escuro} 75%)`}}>
			<AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(235,203,159,0.07) 2px, transparent 2px)', backgroundSize: '44px 44px'}} />
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: origem}}>{children}</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* o rótulo em pílula branca do modelo (MODELO §6) */
const Pilula: React.FC<{txt: string; tam?: number; style?: React.CSSProperties}> = ({txt, tam = 34, style}) => (
	<div style={{display: 'inline-flex', alignItems: 'center', gap: tam * 0.45, padding: `${tam * 0.4}px ${tam * 0.8}px`, borderRadius: 999, background: 'rgba(255,255,255,0.95)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', whiteSpace: 'nowrap', ...style}}>
		<span style={{width: tam * 0.42, height: tam * 0.42, borderRadius: tam, background: C.cor, flexShrink: 0}} />
		<span style={{fontFamily: SANS, fontWeight: 800, fontSize: tam, letterSpacing: '0.02em', color: '#1d1d1d', lineHeight: 1.1}}>{txt}</span>
	</div>
);

/* "se você estiver no Instagram agora, você está vendo apenas um desses modelos": o vídeo dele num celular (interface
   genérica, sem logotipo); o nome deste modelo entra na pílula em "apenas"; os outros celulares saem de trás em "desses" */
const Celular: React.FC<{t: number; a: number; arroba: string}> = ({t, a, arroba}) => {
	const k = mola(t, a + 0.05);
	const ui = tw(t, de(MARCAS.celular[0]) - 0.06, de(MARCAS.celular[0]) + 0.3, 0, 1); // "Instagram"
	const outros = mola(t, de(MARCAS.celular[1]) - 0.04, 18); // "desses"
	const W = 380;
	const H = 790;
	const top = 70;
	const corpo = (x: number, s: number, op: number, video: boolean, key: string) => (
		<div key={key} style={{position: 'absolute', left: 540 - W / 2 + x, top, width: W, height: H, borderRadius: 56, background: '#0b0908', border: '3px solid rgba(244,239,230,0.22)', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.8)', transform: `scale(${s})`, opacity: op, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 12, borderRadius: 44, overflow: 'hidden', background: C.escuro2}}>
				{video ? (
					<OffthreadVideo muted src={staticFile('fala.mp4')} style={{position: 'absolute', left: -((H - 24) * 9) / 32 + (W - 24) / 2, top: 0, height: H - 24, width: ((H - 24) * 9) / 16, filter: COR}} />
				) : (
					<Img src={staticFile('quadro.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55) saturate(0.7)'}} />
				)}
				{video && (
					<div style={{position: 'absolute', inset: 0, opacity: ui}}>
						<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)'}} />
						<svg width="60" height="250" viewBox="0 0 60 250" style={{position: 'absolute', right: 14, top: H * 0.5}} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
							<path d="M30 46 C10 32 6 22 10 14 C14 6 26 6 30 15 C34 6 46 6 50 14 C54 22 50 32 30 46 Z" />
							<path d="M50 110 a20 20 0 1 1 -8 -16 L50 92 Z" transform="translate(-10 0)" />
							<path d="M12 170 L50 156 L38 194 L30 176 Z M30 176 L50 156" />
						</svg>
						{arroba && (
							<div style={{position: 'absolute', left: 22, bottom: 64, display: 'flex', alignItems: 'center', gap: 12}}>
								<span style={{width: 40, height: 40, borderRadius: 20, background: C.cor, border: '2px solid #fff'}} />
								<span style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, color: '#fff'}}>{arroba}</span>
							</div>
						)}
						<div style={{position: 'absolute', left: 22, bottom: 40, width: 200, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.7)'}} />
					</div>
				)}
			</div>
		</div>
	);
	return (
		<FundoPainel t={t} a={a} origem="540px 460px">
			<div style={{position: 'absolute', inset: 0, ...entra(k)}}>
				{outros > 0 && corpo(-330 * outros, 0.84, 0.75 * Math.min(1, outros * 2), false, 'e')}
				{outros > 0 && corpo(330 * outros, 0.84, 0.75 * Math.min(1, outros * 2), false, 'd')}
				{corpo(0, 1, 1, true, 'c')}
			</div>
		</FundoPainel>
	);
};

/* "duas prévias rápidas aqui em cima": duas prévias de outros modelos lado a lado, cada uma com o nome na pílula.
   Só com `previas: true` (public/previa1.mp4 e previa2.mp4, já aceleradas 3x, sem som); com false nada é pedido. */
const Previas: React.FC<{t: number; a: number; nomes: [string, string]}> = ({t, a, nomes}) => {
	const PH = 790;
	const PW = (PH * 9) / 16;
	const gap = 44;
	const x0 = (1080 - 2 * PW - gap) / 2;
	return (
		<FundoPainel t={t} a={a}>
			{[0, 1].map((i) => {
				const d = a + 0.08 + i * 0.14;
				const k = mola(t, d);
				return (
					<div key={i} style={{position: 'absolute', left: x0 + i * (PW + gap), top: 64, width: PW, height: PH, borderRadius: 30, overflow: 'hidden', border: `5px solid ${C.creme}`, boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)', background: C.escuro, ...entra(k)}}>
						<Sequence from={Math.round(d * FPS)} layout="none">
							<OffthreadVideo muted src={staticFile(`previa${i + 1}.mp4`)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
						</Sequence>
						<div style={{position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', ...suave(t, d + 0.2)}}>
							<Pilula txt={nomes[i]} tam={Math.min(32, (PW - 90) / (Math.max(1, nomes[i].length) * 0.68))} />
						</div>
					</div>
				);
			})}
		</FundoPainel>
	);
};

/* painel de lista (como o "Seu cronograma"), já preenchido, dirigido por LISTA: cada item ganha o visto na sua vez e o
   item da vez (ou o último, na palavra de `acende`) acende na cor de destaque. 6 a 8 itens: 85%, topo em y 262; menos
   itens: tamanho cheio, centrado na metade de cima */
const LISTA_ALT = (n: number) => 80 + 30 + 82 * n + 6; // cabeçalho + respiro + itens + borda
const listaCaixa = (n: number) => {
	const esc = n >= 6 ? 0.85 : 0.96; // com poucos itens, 96%: o zoom lento do painel (1,2%/s) não o leva para fora da zona segura
	const top = n >= 6 ? 262 : Math.round(587 - (esc * LISTA_ALT(n)) / 2);
	return {esc, top};
};
const Lista: React.FC<{t: number; a: number; lista: NonNullable<typeof LISTA>}> = ({t, a, lista}) => {
	const n = lista.itens.length;
	const vez = lista.vistos.length === n;
	let marcas: number[];
	if (vez) marcas = lista.vistos.map((i) => de(i) - 0.04);
	else {
		const [prim, ult] = lista.vistos.map((i) => de(i));
		const t0 = prim - 0.04;
		const passo = (ult - t0) / (n - 1);
		marcas = lista.itens.map((_, i) => t0 + i * passo);
	}
	const fixo = typeof lista.acende === 'number' ? de(lista.acende) : null;
	const {esc, top} = listaCaixa(n);
	return (
		<FundoPainel t={t} a={a}>
			{/* 2026-10-12: com 6 a 8 itens, cartão a 85% e topo em 262 (com a câmera lenta do painel não passa de 250): todo o texto na zona segura (y >= 250, x 60-940) */}
			<div style={{position: 'absolute', left: 70, width: 860, top, transform: `scale(${esc})`, transformOrigin: '50% 0'}}>
			<div style={{background: C.creme, borderRadius: 32, overflow: 'hidden', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.5)', ...suave(t, a + 0.15)}}>
				<div style={{background: C.tinta, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.creme}}>{lista.titulo}</div>
				<div style={{padding: '12px 40px 18px'}}>
					{lista.itens.map((m, i) => {
						const d = marcas[i];
						const e = tw(t, d - 0.06, d + 0.3, 0, 1);
						const v = tw(t, d, d + 0.45, 0, 1, E.io);
						const ultimo = i === n - 1;
						const esse =
							fixo !== null
								? ultimo ? tw(t, fixo - 0.04, fixo + 0.25, 0, 1) : 0
								: tw(t, d - 0.04, d + 0.25, 0, 1) * (ultimo ? 1 : tw(t, marcas[i + 1] - 0.04, marcas[i + 1] + 0.25, 1, 0));
						const aceso = (fixo === null || ultimo) && esse > 0.5;
						return (
							<div key={m + i} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 26, height: 82, borderTop: i ? '2px solid rgba(31,22,15,0.08)' : 'none', opacity: 0.28 + 0.72 * e}}>
								{(fixo === null || ultimo) && <div style={{position: 'absolute', left: -22, right: -22, top: 6, bottom: 6, borderRadius: 18, background: C.cor, opacity: esse}} />}
								<svg width="52" height="52" viewBox="0 0 64 64" style={{flexShrink: 0, position: 'relative'}}>
									<circle cx="32" cy="32" r="28" fill={aceso ? '#fff' : C.cor} fillOpacity={e} stroke={aceso ? '#fff' : C.cor} strokeWidth="4" />
									<path d="M19 33 L28 42 L45 23" fill="none" stroke={aceso ? C.cor : '#fff'} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - v} />
								</svg>
								<span style={{position: 'relative', fontFamily: SANS, fontWeight: 600, fontSize: 40, color: aceso ? '#fff' : C.tinta, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>{m}</span>
							</div>
						);
					})}
				</div>
			</div>
			</div>
		</FundoPainel>
	);
};

/* ---------------------------------------------------------------- fecho: o campo de comentário que recebe EDIÇÃO */
/* fecho entre o queixo (~1000 na gravação aberta) e a legenda na 2ª posição: Comenta 64 + 22 + campo 170 */
export const FECHO = {top: 1040, altura: 64 + 22 + 170, larg: 750};
const Comenta: React.FC<{t: number; cta: NonNullable<typeof CTA>}> = ({t, cta}) => {
	const b = de(cta.i + 1); // a palavra a comentar
	const k = mola(t, cta.de + 0.04, 20);
	const acende = tw(t, b - 0.05, b + 0.25, 0, 1);
	const toque = tw(t, b - 0.05, b + 0.55, 0, 1);
	const cursor = t < b && Math.floor((t - cta.de) * 2.5) % 2 === 0;
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: FECHO.top, textAlign: 'center', opacity: Math.min(1, k * 2), transform: `translateY(${(1 - k) * 30}px)`}}>
			{/* 2026-10-12: em destaque fixo só o comando, Comenta "EDIÇÃO"; o resto da fala vai na legenda, abaixo */}
			<div style={{fontFamily: SANS, fontWeight: 600, fontSize: 64, lineHeight: 1, height: 64, marginBottom: 22, color: '#fff', textShadow: '0 2px 6px rgba(0,0,0,0.35), 0 6px 26px rgba(0,0,0,0.4)', ...suave(t, de(cta.i))}}>{cta.comando}</div>
			<div style={{position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 26, minWidth: 600, height: 170, padding: '0 60px', boxSizing: 'border-box', borderRadius: 999, border: `3px solid ${acende > 0.5 ? C.cor2 : '#fff'}`, background: `rgba(143,95,51,${acende})`, boxShadow: `0 14px 40px rgba(0,0,0,${0.12 + 0.18 * acende})`, transform: `scale(${1 + 0.04 * Math.sin(Math.PI * toque)})`, overflow: 'hidden'}}>
				{toque > 0 && toque < 1 && <span style={{position: 'absolute', left: '50%', top: '50%', width: 700 * toque, height: 700 * toque, marginLeft: -350 * toque, marginTop: -350 * toque, borderRadius: '50%', background: `rgba(255,255,255,${0.35 * (1 - toque)})`}} />}
				<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0, position: 'relative'}}>
					<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5z" />
				</svg>
				<span style={{position: 'relative', display: 'inline-block', width: 470, textAlign: 'left', fontFamily: SANS, fontWeight: 800, fontSize: 84, color: '#fff', letterSpacing: '0.01em', lineHeight: 1}}>
					{t >= b - 0.06 ? <span style={{display: 'inline-block', ...suave(t, b)}}>{cta.palavra}</span> : <span style={{display: 'inline-block', width: 6, height: 84, background: '#fff', opacity: cursor ? 0.9 : 0, verticalAlign: 'middle'}} />}
				</span>
			</div>
		</div>
	);
};

/* plano B do flash: branco que estoura no corte e some em 4 quadros */
const FlashDesenhado: React.FC = () => {
	const f = useCurrentFrame();
	return <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 45%, #fff 0%, rgba(255,250,240,0.85) 45%, rgba(255,240,220,0.5) 100%)', opacity: [0.45, 1, 0.5, 0.15][f] ?? 0}} />;
};

/* ---------------------------------------------------------------- títulos */
const TOP = 1110;
type Tit = {de: number; ate: number; primeira: number; linhas: Linha[]; marca?: number};
const TITULOS: Tit[] = [
	{de: 0, ate: T.ele, primeira: 0, linhas: [[['base', 60, 'Esse vídeo está sendo']], [['ancora', 116, '100%'], ['base', 60, 'editado']], [['base', 60, 'pelo'], ['serif', 100, 'Claude.']]]},
	{de: T.previas, ate: T.mas, primeira: 52, linhas: [[['base', 60, 'duas prévias rápidas']], [['base', 60, 'aqui em cima,'], ['script', 86, 'aceleradas']], [['base', 60, 'em'], ['ancora', 116, 'três vezes.']]], marca: undefined},
];

TELAS.forEach((s) => confere('TELAS', s.primeira, s.linhas.map((l) => l.txt).join(' ')));
TITULOS.forEach((q) => confere('TITULOS', q.primeira, q.linhas.map((l) => l.map((x) => x[2]).join(' ')).join(' ')));

/* mídia que não vem com a gravação: se faltar, para com o comando que a faz (e não com um erro de rede) */
const tem = (arq: string) => {
	const lista = getStaticFiles();
	return !lista.length || lista.some((f) => f.name === arq);
};
const QUADRO = 'public/quadro.jpg (um quadro da gravação, para os cartões): ffmpeg -ss 5 -i public/fala.mp4 -frames:v 1 -q:v 3 public/quadro.jpg';

export type Props = {previas: boolean; nomesPrevias: [string, string]; arroba?: string};
export const Reel: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], arroba = ''}) => {
	const t = useCurrentFrame() / FPS;
	const {a, fim, modo} = trecho(t, previas);
	const zoom = zoomEm(t);
	const tit = modo === 'video' ? TITULOS.find((q) => t >= q.de - 0.1 && t < q.ate) : undefined;
	const cta = CTA !== null && t >= CTA.de;
	const dividida = modo === 'celular' || modo === 'previas' || modo === 'lista';
	if ((modo === 'tela' || modo === 'celular') && !tem('quadro.jpg')) throw new Error(`Falta ${QUADRO}`);
	if (modo === 'previas' && !(tem('previa1.mp4') && tem('previa2.mp4')))
		throw new Error('Falta public/previa1.mp4 ou previa2.mp4: faça com tools/previa.py (modelos/profissional01/profissional01.md, seção 9) ou renderize com "previas": false.');
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{modo === 'video' && <Fala zoom={zoom} />}
			{modo === 'video' && (tit || cta) && <Sombra />}
			{modo === 'tela' && <TelaCheia t={t} fim={fim} />}
			{modo === 'celular' && (
				<Dividida t={t} a={a} fim={fim}>
					<Celular t={t} a={a} arroba={arroba} />
				</Dividida>
			)}
			{modo === 'previas' && (
				<Dividida t={t} a={a} fim={fim}>
					<Previas t={t} a={a} nomes={nomesPrevias} />
				</Dividida>
			)}
			{modo === 'lista' && LISTA && (
				<Dividida t={t} a={a} fim={fim}>
					<Lista t={t} a={a} lista={LISTA} />
				</Dividida>
			)}

			{modo === 'video' && TITULOS.map((q, i) => <Titulo key={i} t={t} {...q} top={q.linhas.length > 2 ? TOP - 110 : TOP} />)}
			{cta && CTA && <Comenta t={t} cta={CTA} />}

			{modo === 'video' && !tit && !cta && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 52%, rgba(0,0,0,0.16) 59%, rgba(0,0,0,0.16) 66%, rgba(0,0,0,0) 73%)'}} />}
			{modo === 'video' && !tit && !cta && <Legenda t={t} y={LEG_Y} />}
			{(dividida || cta) && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 64%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.18) 78%, rgba(0,0,0,0) 84%)'}} />}
			{(dividida || cta) && <Legenda t={t} y={LEG_Y2} destaque={dividida} />}


			{/* flash clean na ênfase, como no vídeo do dentista: public/flash.mp4 em screen, pico no corte; sem o arquivo,
			    um flash branco desenhado aqui (4 quadros) */}
			{FLASH !== null && (
				<Sequence from={Math.round(FLASH * FPS) - 1} durationInFrames={4}>
					<AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.8}}>
						{tem('flash.mp4') ? <OffthreadVideo muted src={staticFile('flash.mp4')} style={{width: 1080, height: 1920}} /> : <FlashDesenhado />}
					</AbsoluteFill>
				</Sequence>
			)}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- conferência (scripts/cobertura.mjs), 2026-10-12
 * textos(t, previas): todo texto visível no tempo t, com as palavras da fala que ele mostra e a caixa estimada
 * (largura por larguraTxt). Segue a mesma lógica do Reel acima. */
type Caixa = {nome: string; tipo: 'legenda' | 'titulo' | 'tela' | 'fecho' | 'rotulo'; palavras: number[]; x0: number; x1: number; y0: number; y1: number};
const nasceu = (t: number, i: number) => t >= PS[i].de - 0.02; // a palavra conta a partir de quando nasce
const centro = (cx: number, larg: number) => ({x0: cx - larg / 2, x1: cx + larg / 2});
const vozLT = (l: LT): keyof typeof FATOR => l.fonte ?? 'base';
export const textos = (t: number, previas: boolean, arroba = ''): Caixa[] => {
	const {a, modo} = trecho(t, previas);
	const out: Caixa[] = [];
	const tit = modo === 'video' ? TITULOS.find((q) => t >= q.de - 0.1 && t < q.ate) : undefined;
	const cta = CTA !== null && t >= CTA.de;
	const dividida = modo === 'celular' || modo === 'previas' || modo === 'lista';
	if (modo === 'video')
		TITULOS.forEach((q) => {
			if (t < q.de - 0.1 || t >= q.ate) return;
			const n = q.linhas.reduce((s, l) => s + l.reduce((z, x) => z + x[2].split(' ').length, 0), 0);
			const larg = Math.max(...q.linhas.map((l) => l.reduce((s, [v, tam, txt], j) => s + larguraTxt(txt, v, v === 'script' ? tam * 1.3 : tam) + (j ? tam * 0.24 : 0), 0)));
			const alt = q.linhas.reduce((s, l) => s + Math.max(...l.map(([v, tam]) => (v === 'base' ? tam * 1.18 : tam * 1.02))), 0);
			const top = q.linhas.length > 2 ? TOP - 110 : TOP;
			const ps = Array.from({length: n}, (_, k) => q.primeira + k).filter((i) => nasceu(t, i));
			out.push({nome: 'título ' + q.primeira, tipo: 'titulo', palavras: ps, ...centro(540, larg), y0: top, y1: top + alt});
		});
	if (modo === 'tela') {
		const s = TELAS[TELAS.filter((x) => t >= x.de).length - 1];
		const n = s.linhas.reduce((z, l) => z + l.txt.split(' ').length, 0);
		const larg = Math.max(...s.linhas.map((l) => larguraTxt(l.txt, vozLT(l), telaTam(l))));
		const alt = s.linhas.reduce((z, l) => z + telaTam(l) * (l.fonte === 'script' ? 1.1 : l.tam >= 120 ? 0.98 : 1.2), 0);
		const z = 1 + Math.max(0, t - s.de) * 0.012; // câmera da tela cheia (escala em volta do centro 540x960)
		const esc = (y: number) => 960 + (y - 960) * z;
		const c = centro(500, larg);
		out.push({nome: 'tela ' + s.primeira, tipo: 'tela', palavras: Array.from({length: n}, (_, k) => s.primeira + k).filter((i) => nasceu(t, i)), x0: 540 + (c.x0 - 540) * z, x1: 540 + (c.x1 - 540) * z, y0: esc(s.topo), y1: esc(s.topo + alt)});
	}
	if (cta && CTA) out.push({nome: `fecho ${CTA.comando} ${CTA.palavra}`, tipo: 'fecho', palavras: [CTA.i, CTA.i + 1].filter((i) => nasceu(t, i)), ...centro(500, FECHO.larg), y0: FECHO.top, y1: FECHO.top + FECHO.altura});
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	const legY = modo === 'video' && !tit && !cta ? LEG_Y : dividida || cta ? LEG_Y2 : null;
	if (pg && legY !== null) {
		const base = legY === LEG_Y2 ? LEG_TAM2 : LEG_TAM;
		const tam = legTam(pg.txt, base);
		const larg = Math.max(...pg.txt.split(' / ').map((l) => larguraTxt(l, 'base', tam) + (l.split('*').length - 1) * 16));
		out.push({nome: pg.txt, tipo: 'legenda', palavras: Array.from({length: pg.n}, (_, k) => pg.i0 + k), ...centro(500, larg), y0: legY, y1: legY + legAltura(pg.txt, base)});
	}
	if (modo === 'celular' && arroba) out.push({nome: arroba, tipo: 'rotulo', palavras: [], x0: 360, x1: 640, y0: 720, y1: 790});
	if (modo === 'lista' && LISTA) {
		const z = 1 + (t - a) * 0.012; // câmera do painel (escala em volta de 540x480)
		const {esc, top} = listaCaixa(LISTA.itens.length);
		const ex = (x: number) => 540 + (x - 540) * z;
		const ey = (y: number) => 480 + (y - 480) * z;
		out.push({nome: 'painel ' + LISTA.titulo, tipo: 'rotulo', palavras: [], x0: ex(500 - 430 * esc), x1: ex(500 + 430 * esc), y0: ey(top), y1: ey(top + esc * LISTA_ALT(LISTA.itens.length))});
	}
	if (modo === 'previas') out.push({nome: 'nomes das prévias', tipo: 'rotulo', palavras: [], x0: 100, x1: 980 - 100, y0: 760, y1: 830});
	return out;
};
export {PS as PALAVRAS, LEG_TAM, LEG_TAM2, PEDACOS, TITULOS, TELAS};
