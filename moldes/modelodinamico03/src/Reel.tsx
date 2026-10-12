import React from 'react';
import {AbsoluteFill, Easing, Freeze, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
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
 */
export const FPS = 30;
export const DURACAO = 30.36; // duração da fala (public/voz.wav), muda a cada vídeo
const ULTIMO_QUADRO = 905; // o vídeo tem 906 quadros; depois disso segura o último
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
const c = (i: number) => PS[i].de - 0.06; // o corte cai 2 quadros antes da palavra

/* ---------------------------------------------------------------- trechos (índice da palavra em src/palavras.json) */
export const T = {
	justamente: c(11), // corte seco: aberto -> fechado
	a: c(15), // bloco "a diferença entre vários MODELOS"
	para2: c(25), // desfoque -> aberto
	qualquer: c(27), // bloco "qualquer TIPO de vídeo"
	se1: c(35), // VHS -> fechado ("se você estiver no Instagram")
	vhsFim: c(35) + 1.6,
	um: c(45), // bloco "um desses modelos." (6ª rodada: sem o nome do modelo na tela)
	colocar: c(51), // flash branco -> aberto / prévias em cima
	aceleradas: c(58), // bloco "aceleradas em TRÊS VEZES"
	mas: c(62), // desfoque -> fechado, legenda padrão "Mas se você quiser realmente ver"
	outros: c(68), // desfoque -> tela de destaque (fundo borrado) só com o bloco "outros modelos de EDIÇÃO"
	aprender: c(75), // chicote -> aberto, bloco "aprender a como USAR"
	comenta: c(83), // VHS -> fecho "Comenta EDIÇÃO aqui embaixo"
};
/** janela das prévias (s): do flash do "colocar" ao desfoque do "Mas" */
export const PREVIAS = {de: T.colocar, ate: T.mas};

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
const emPrevias = (t: number, previas: boolean) => previas && t >= PREVIAS.de && t < PREVIAS.ate;
const cameraBase = (t: number, previas: boolean) =>
	emPrevias(t, previas) ? {z: tw(t, PREVIAS.de, PREVIAS.ate, 1.0, 1.02, E.io), desce: DESCE} : {z: zoomEm(t), desce: 0};
/* 2026-10-12, 5ª rodada (pedido do Jessé): o destaque não encolhe para caber; abre-se o plano. Em cada plano com destaque
 * a câmera ganha um ajuste constante (do corte ao corte): sobe (o rosto vai para cima) e, se a subida for mostrar a
 * borda de baixo do vídeo, aproxima só o necessário. Assim o bloco inteiro cabe entre o queixo e a legenda. */
type Ajuste = {de: number; ate: number; m: number; sobe: number};
let AJ: Ajuste[] | null = null;
const ajustes = (): Ajuste[] => {
	if (AJ) return AJ;
	const segs: [number, number, number][] = [
		[0, T.justamente, ALTURA_ABERTURA * PADRAO],
		[T.justamente, T.para2, alturaBloco(BLOCOS[0], PADRAO)],
		[T.para2, T.se1, alturaBloco(BLOCOS[1], PADRAO)],
		[T.se1, T.colocar, alturaBloco(BLOCOS[2], PADRAO)],
		[T.mas, T.aprender, alturaBloco(BLOCOS[3], PADRAO)], // plano do "Mas" + tela de destaque do bloco
		[T.comenta, DURACAO + 1, ALTURA_FECHO * PADRAO],
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
		throw new Error('ajuste de câmera impossível');
	});
	return AJ;
};
const camera = (t: number, previas: boolean) => {
	const b = cameraBase(t, previas);
	if (emPrevias(t, previas)) return b;
	const a = ajustes().find((x) => t >= x.de && t < x.ate);
	return a ? {z: b.z * a.m, desce: -a.sobe} : b;
};
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

/* transições de textura */
const BLUR_CORTES = [T.para2, T.mas, T.outros];
const desfoqueEm = (t: number) => Math.max(0, ...BLUR_CORTES.map((k) => (t < k ? tw(t, k - 0.12, k, 0, 22, E.io) : tw(t, k, k + 0.16, 22, 0, E.out))));
const FLASH_VHS = [T.se1, T.comenta];
const emFlashVhs = (t: number, ef: boolean) => ef && FLASH_VHS.some((k) => t >= k && t < k + 3 / FPS);
const emVhs = (t: number, ef: boolean) => ef && ((t >= T.se1 && t < T.vhsFim) || t >= T.comenta);
const flashBranco = (t: number) => (t >= T.colocar ? tw(t, T.colocar, T.colocar + 0.5, 1, 0, E.io) : 0);
/* chicote: borrão de movimento horizontal que vira a cena seguinte */
const chicoteEm = (t: number) => (t < T.aprender ? tw(t, T.aprender - 0.13, T.aprender, 0, 1, E.io) : tw(t, T.aprender, T.aprender + 0.17, 1, 0, E.out));

/* ---------------------------------------------------------------- vídeo com o grade quente */
const Video: React.FC<{t: number; f: number; z: number; desce: number; tratamento: boolean; efeitos: boolean}> = ({t, f, z, desce, tratamento, efeitos}) => {
	const vhs = emVhs(t, efeitos);
	const fv = emFlashVhs(t, efeitos);
	const respiro = t >= T.outros && t < T.aprender; // 6ª rodada: a tela de destaque só carrega "outros modelos de EDIÇÃO"
	const blur = desfoqueEm(t) + (respiro ? 26 : 0) + (efeitos && t >= T.comenta ? tw(t, T.comenta, T.comenta + 0.4, 0, 14) : 0);
	const ch = chicoteEm(t);
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
				transform: `translateX(${jitter + (t < T.aprender ? -1 : 1) * ch * 90}px)`,
				WebkitMaskImage: desce > 0 ? 'linear-gradient(180deg, transparent 0px, transparent 520px, #000 700px)' : undefined,
			}}
		>
			<AbsoluteFill style={{transform: `translateY(${desce}px) scale(${z})`, transformOrigin: `${ORIGEM.x}px ${ORIGEM.y}px`}}>
				{f > ULTIMO_QUADRO ? <Freeze frame={ULTIMO_QUADRO}>{v}</Freeze> : v}
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
	/** palavra-chave vermelha atrás do bloco branco, como carimbo de fundo (ref1 2,1 "PESSOAS" atrás de "Relação") */
	carimbo?: {idx: number; tam: number; dy: number};
	/** linha extra que não é fala (o nome do modelo), com o tempo em que nasce */
	extra?: {txt: string; voz: Voz; tam: number; de: number; brilho?: boolean};
};
/* altura aproximada do bloco (para a legenda morar logo abaixo dele) */
const alturaBloco = (b: BlocoDef, escala: number) =>
	Math.max(b.linhas.reduce((s, l) => s + Math.max(...l.map(([v, tam]) => tam * (v.startsWith('cond') ? 0.86 : 0.95))), 0) + (b.extra ? 6 + b.extra.tam * 0.86 : 0), b.carimbo ? b.carimbo.dy + b.carimbo.tam * 0.86 : 0) * escala;
const Bloco: React.FC<BlocoDef & {t: number; top: number; escala?: number}> = ({t, de, ate, primeira, linhas, top, carimbo, extra, escala = 1}) => {
	if (t < de - 0.1 || t >= ate) return null;
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
				return (
					<div key={i} style={{whiteSpace: 'nowrap', position: 'relative'}}>
						{pecas}
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
const ALTURA_ABERTURA = 70 * 0.95 + 18 + CONTADOR * 0.86 + 10 + 104 * 0.95;
const Abertura: React.FC<{t: number; top: number; escala: number}> = ({t, top, escala: k}) => {
	if (t >= T.justamente) return null;
	const d = PS[4].de;
	const v = Math.round(tw(t, d - 0.1, d + 0.6, 0, 100, E.io));
	const sai = tw(t, T.justamente - 0.12, T.justamente, 0, 1, E.io);
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top, textAlign: 'center', opacity: 1 - sai, filter: `blur(${sai * 16}px)`, textShadow: '0 4px 30px rgba(0,0,0,0.45)'}}>
			<div style={{whiteSpace: 'nowrap'}}>
				{['Esse', 'vídeo', 'está', 'sendo'].map((p, i) => (
					<span key={i} style={{...estilo('sans', 70 * k), ...nasce(t, PS[i].de), marginLeft: i ? 15 * k : 0}}>
						{p}
					</span>
				))}
			</div>
			<div style={{whiteSpace: 'nowrap', margin: `${18 * k}px 0 ${10 * k}px`}}>
				<span style={{...estilo('condRed', CONTADOR * k), ...nasce(t, d - 0.08), fontVariantNumeric: 'tabular-nums', textShadow: '0 6px 34px rgba(0,0,0,0.35)'}}>{v}%</span>
				</div>
			<div style={{whiteSpace: 'nowrap'}}>
				{['editado', 'pelo', 'Claude.'].map((p, i) => (
					<span key={i} style={{...estilo('serif', 104 * k), ...nasce(t, PS[5 + i].de), marginLeft: i ? 22 * k : 0}}>
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
const destaquesAtivos = (): [number, number][] => [[0, T.justamente], ...BLOCOS.map((b) => [b.de - 0.1, b.ate] as [number, number]), [T.comenta, DURACAO + 1]];
const ida = (t: number) => Math.max(0, ...destaquesAtivos().map(([a, b]) => (t < a ? tw(t, a - 0.3, a - 0.08, 0, 1, E.io) : t < b ? 1 : tw(t, b, b + 0.22, 1, 0, E.io))));
export const legY = (t: number, previas: boolean) => (emPrevias(t, previas) ? LEG_Y2 : LEG_Y + (LEG_Y2 - LEG_Y) * ida(t));
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
type Pagina = {linhas: string[][]; de: number; ate: number; i0: number; n: number};
export const PAGINAS: Pagina[] = PEDACOS.map(([i0, txt], j) => {
	const linhas = txt.split(' / ').map((l) => l.split(' '));
	const n = linhas.flat().length;
	if (PS.slice(i0, i0 + n).map((q) => q.texto).join(' ') !== linhas.flat().join(' ')) throw new Error(`pedaço "${txt}" não bate com a fala`);
	const prox = PEDACOS[j + 1];
	const fim = prox ? PS[prox[0]].de - 0.06 : DURACAO + 1;
	/* 6ª rodada: texto comum não entra na tela de destaque; a página do "Mas" termina onde ela começa */
	const de = PS[i0].de - 0.06;
	return {linhas, i0, n, de, ate: de < T.outros && fim > T.outros ? T.outros + 0.04 : fim}; // +0.04: some no pico do desfoque do corte;
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
	if (t < PREVIAS.de || t >= PREVIAS.ate) return null;
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
	if (t < T.comenta) return null;
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top, textAlign: 'center'}}>
			<div style={{...estilo('sans', 76 * k), fontWeight: 500, ...nasce(t, PS[83].de), marginBottom: 40 * k, textShadow: '0 4px 26px rgba(0,0,0,0.45)'}}>Comenta</div>
			<div style={{whiteSpace: 'nowrap'}}>
				<span style={{...estilo('condRed', 250 * k), ...nasce(t, PS[84].de), textShadow: '0 6px 40px rgba(0,0,0,0.4)'}}>“edição”</span>
			</div>
		</div>
	);
};
const ALTURA_FECHO = 76 * 0.95 + 40 + 250 * 0.86;

/* ---------------------------------------------------------------- blocos de ênfase (texto por cima da pessoa, nas palavras fortes) */
export const BLOCOS: BlocoDef[] = [
	{de: T.a, ate: T.para2, primeira: 15, linhas: [[['sans', 80, 'a diferença entre']], [['serif', 132, 'vários']]], carimbo: {idx: 19, tam: 300, dy: 84}},
	{de: T.qualquer, ate: T.se1, primeira: 27, linhas: [[['serif', 124, 'qualquer tipo de']], [['condRed', 260, 'vídeo']]]},
	{de: T.um, ate: T.colocar, primeira: 45, linhas: [[['serif', 118, 'um desses modelos.']]]},
	{de: T.outros, ate: T.aprender, primeira: 68, linhas: [[['serif', 124, 'outros modelos']], [['sans', 86, 'de'], ['condRed', 250, 'edição']], [['serif', 96, 'como esse']]]},
];

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
export const lugarAbertura = () => {
	const {top} = faixa(0, T.justamente, false);
	const larg = Math.max(larguraTxt('Esse vídeo está sendo', 'sans', 70), larguraTxt('100%', 'cond', CONTADOR), larguraTxt('editado pelo Claude.', 'serif', 104));
	const escala = Math.min(PADRAO, ZW / larg);
	return {top, escala, fundo: top + ALTURA_ABERTURA * escala, larg: larg * escala};
};
export const lugarFecho = () => {
	const {top} = faixa(T.comenta, DURACAO, false);
	const larg = Math.max(larguraTxt('Comenta', 'sans', 76), larguraTxt('“EDIÇÃO”', 'cond', 250));
	const escala = Math.min(PADRAO, ZW / larg);
	return {top, escala, fundo: top + ALTURA_FECHO * escala, larg: larg * escala};
};

export const VitrineDinamico03: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], tratamento = false, efeitos = false}) => {
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
			<Abertura t={t} top={la.top} escala={la.escala} />
			{BLOCOS.map((b, i) => {
				const {top, escala} = lugarBloco(b, previas);
				return <Bloco key={i} t={t} {...b} top={top} escala={escala} />;
			})}
			<Fecho t={t} top={lf.top} escala={lf.escala} />
			<Legenda t={t} previas={previas} />
			{tratamento && <Grao f={f} />}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- conferência (scripts/cobertura.mjs)
 * exibicoes(): cada elemento de texto com as palavras da fala que ele mostra, quando fica na tela e (legenda) onde. */
const nPal = (b: BlocoDef) => b.linhas.reduce((s, l) => s + l.reduce((q, [, , txt]) => q + txt.split(' ').length, 0), 0);
export type Exib = {nome: string; tipo: 'destaque' | 'legenda'; i0: number; n: number; de: number; ate: number; y?: number; fundo?: number; topo?: number; queixo?: number; linhas?: number};
/** com previas, a página que atravessa a janela das prévias vira dois trechos (um em cada posição) */
const trechos = (de: number, ate: number, previas: boolean): [number, number][] => {
	if (!previas) return [[de, ate]];
	return [[de, Math.min(ate, PREVIAS.de)], [Math.max(de, PREVIAS.de), Math.min(ate, PREVIAS.ate)], [Math.max(de, PREVIAS.ate), ate]].filter(([a, b]) => b > a) as [number, number][];
};
export const exibicoes = (previas = false): Exib[] => [
	{nome: 'abertura', tipo: 'destaque', i0: 0, n: 8, de: PS[0].de - 0.06, ate: T.justamente, topo: lugarAbertura().top, fundo: lugarAbertura().fundo},
	...BLOCOS.map((b) => ({nome: b.linhas.map((l) => l.map((x) => x[2]).join(' ')).join(' / '), tipo: 'destaque' as const, i0: b.primeira, n: nPal(b) + (b.carimbo ? 1 : 0), de: b.de, ate: b.ate, topo: lugarBloco(b).top, fundo: lugarBloco(b).fundo})),
	{nome: 'fecho comenta “EDIÇÃO”', tipo: 'destaque', i0: 83, n: 2, de: T.comenta, ate: DURACAO, topo: lugarFecho().top, fundo: lugarFecho().fundo},
	...PAGINAS.flatMap((g) => trechos(g.de, Math.min(g.ate, DURACAO), previas).map(([a, b]) => ({nome: g.linhas.map((l) => l.join(' ')).join(' / '), tipo: 'legenda' as const, i0: g.i0, n: g.n, de: a, ate: b, y: legY(a + 0.001, previas), queixo: queixoMax(a, b, previas), linhas: g.linhas.length}))),
];
/** palavras da fala escritas na tela no tempo t (a palavra conta a partir de quando nasce) */
export const palavrasNaTela = (t: number): number[] => {
	const vis: number[] = [];
	for (const e of exibicoes()) {
		if (t < e.de || t >= e.ate) continue;
		for (let i = e.i0; i < e.i0 + e.n; i++) if (t >= PS[i].de - 0.02) vis.push(i); // nasce de -0,06 a +0,14; em -0,02 já está legível
	}
	return vis;
};

/** caixas de todo texto visível no tempo t (conferência de zona segura e de choque; x pela largura estimada, centrada na zona) */
export const caixas = (t: number, previas = false) => {
	const cx = (ZONA.esq + ZONA.dir) / 2;
	const cxa = (larg: number) => [cx - larg / 2, cx + larg / 2];
	const out: {nome: string; tipo: string; x0: number; x1: number; y0: number; y1: number}[] = [];
	if (t < T.justamente) { const l = lugarAbertura(); const [x0, x1] = cxa(l.larg); out.push({nome: 'abertura', tipo: 'destaque', x0, x1, y0: l.top, y1: l.fundo}); }
	BLOCOS.forEach((b) => { if (t >= b.de - 0.1 && t < b.ate) { const l = lugarBloco(b, previas); const [x0, x1] = cxa(l.larg); out.push({nome: b.linhas.map((q) => q.map((x) => x[2]).join(' ')).join(' / '), tipo: 'destaque', x0, x1, y0: l.top, y1: l.fundo}); } });
	if (t >= T.comenta) { const l = lugarFecho(); const [x0, x1] = cxa(l.larg); out.push({nome: 'fecho', tipo: 'destaque', x0, x1, y0: l.top, y1: l.fundo}); }
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	if (pg) {
		const tam = legTam(pg.linhas), y = legY(t, previas);
		const larg = Math.max(...pg.linhas.map((l) => larguraTxt(l.join(' '), 'leg', tam)));
		const [x0, x1] = cxa(larg);
		out.push({nome: pg.linhas.map((l) => l.join(' ')).join(' / '), tipo: 'legenda', x0, x1, y0: y, y1: y + pg.linhas.length * tam * 1.18});
	}
	if (previas && t >= PREVIAS.de && t < PREVIAS.ate) PREV.x.forEach((x) => out.push({nome: 'nome da prévia', tipo: 'nome', x0: x + PREV.w / 2 - 170, x1: x + PREV.w / 2 + 170, y0: PREV.y + PREV.h - 78, y1: PREV.y + PREV.h - 34}));
	return out;
};
