import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, random, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadDidact} from '@remotion/google-fonts/DidactGothic';
import PB from './palavras.json';

/**
 * Vitrine no ilustrations01 (../../modelos/ilustrations01/MODELO.md), 1º vídeo do modelo.
 * Forma C (corrente com virada, ref4): bonecos palito idênticos chegam um depois do outro segurando a mesma tela crua;
 * quando param, uma varredura edita a tela, cada uma de um jeito. Na virada ("outros modelos de edição") todas acendem
 * verde; o último a chegar (você) tem a tela crua até "usar isso nos seus vídeos". Apagão e moral: COMENTA “EDIÇÃO”.
 * Plano frase a frase em ../plano.md. Um plano só, câmera parada, fundo #000.
 */
export const FPS = 30;
export const DURACAO = 30.33; // 0,7 s depois de "agora." (29,63): moral segura 3,6 s
const W = 1080;
const H = 1920;
export const CHAO = 1190; // linha do chão (62%), invisível: só existe pelo reflexo
export const FRASE_Y = 600; // frase falada (31%, ref4)
export const MORAL_Y = 883; // moral (46%, ref4 44,5 a 48,3%)
export const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};

const didact = loadDidact('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const LETRA = didact.fontFamily;
export const FONTES = [LETRA]; // uma fonte, um peso (geométrica com o I de serifa, como as frases da ref4)
const CORPO = 34; // altura da maiúscula ~24 px = 1,25% da altura (MODELO §3; medido na ref4: 22 a 23 px)

/* identidade do modelo (MODELO §8) */
const COR = {giz: '#FCFCFC', c1: '#2C2C2C', c2: '#363636', c3: '#6A6A6A', c4: '#9B9B9B', verde: '#00FB10', verdeLuz: '#88FF8C'};

export type Props = {previas: boolean; nomesPrevias: [string, string]; musica?: boolean; efeitos?: boolean};

type Pal = {text: string; start: number; end: number};
const PS = PB as Pal[];
const w = (i: number) => PS[i].start;
const fr = (s: number) => Math.round(s * FPS);

const c01 = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const suave = (t: number, a: number, b: number) => {
	const x = c01((t - a) / (b - a));
	return x * x * (3 - 2 * x);
};
const saida = (x: number, k = 3) => 1 - Math.pow(1 - c01(x), k);
const vaiVem = (x: number) => {
	const v = c01(x);
	return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mistura = (a: string, b: string, k: number) => {
	const A = hex(a);
	const B = hex(b);
	return '#' + A.map((v, i) => Math.round(lerp(v, B[i], c01(k))).toString(16).padStart(2, '0')).join('');
};
const DEG = Math.PI / 180;

/* ---------------------------------------------------------------- relógio da história (palavras de src/palavras.json) */
export const T = {
	edicoes: [w(7), w(16), w(24), w(33)], // varredura em B1..B4: "Claude", "diferença", "melhorei", "Claude"
	apenasUm: w(45), // "um desses modelos": B1 acende branco, os outros apagam
	ergue: w(52), // "duas": B2 e B3 erguem as telas, todos olham pra cima
	sobe: w(53), // "prévias": as telas sobem para o alto
	desce: w(62), // "Mas": voltam para as mãos
	virada: w(68), // "outros modelos de edição": tudo verde (72% do vídeo)
	edicaoVoce: w(78), // "usar isso nos seus vídeos": a tela do último sai editada
	apagao: 26.55,
	moral: [w(83), w(85)], // "comenta edição" / "aqui embaixo"
};
const VARRE = 0.28; // duração da varredura

/* chegadas: entra pela esquerda e freia longo (MODELO §3: 1,9 a 2,7 s) */
type Chegada = {x0: number; x1: number; t0: number; d: number};
export const CHEGADAS: Chegada[] = [
	{x0: 360, x1: 810, t0: -0.2, d: 2.4}, // B1, já andando no quadro 0 (a premissa na tela no 1º segundo)
	{x0: -70, x1: 660, t0: 2.95, d: 2.23}, // B2, "Ele foi criado"
	{x0: -70, x1: 510, t0: w(16), d: 2.2}, // B3, "diferença entre vários modelos"
	{x0: -70, x1: 360, t0: w(24), d: 2.0}, // B4, "melhorei para editar"
	{x0: -70, x1: 210, t0: w(62), d: 2.0}, // você, "Mas se você quiser"
];
const K_FREIO = 1.8;
export const posX = (c: Chegada, t: number) => c.x0 + (c.x1 - c.x0) * (1 - Math.pow(1 - c01((t - c.t0) / c.d), K_FREIO));
const velX = (c: Chegada, t: number) => {
	const p = (t - c.t0) / c.d;
	return p < 0 || p >= 1 ? 0 : ((c.x1 - c.x0) * K_FREIO * Math.pow(1 - p, K_FREIO - 1)) / c.d;
};
export const PASSO = 62; // px por meia passada

/* frases: digitação com a letra crescendo, uma por vez, some em 0,1 s 0,4 s antes da próxima (MODELO §3) */
type Frase = {txt: string; de: number; dig: number; ate: number};
export const FRASES: Frase[] = [
	{txt: '“100% EDITADO PELO CLAUDE”', de: w(4), dig: 0.6, ate: w(15) - 0.4},
	{txt: '“A DIFERENÇA ENTRE VÁRIOS MODELOS”', de: w(15), dig: 0.4, ate: w(27) - 0.4},
	{txt: '“QUALQUER TIPO DE VÍDEO”', de: w(27), dig: 0.35, ate: w(44) - 0.4},
	{txt: '“APENAS UM DESSES MODELOS”', de: w(44), dig: 0.35, ate: 15.8},
	{txt: '“OUTROS MODELOS DE EDIÇÃO COMO ESSE”', de: w(68), dig: 0.45, ate: T.apagao},
];
export const MORAL: Frase[] = [
	{txt: 'COMENTA “EDIÇÃO”', de: T.moral[0], dig: 0.4, ate: DURACAO + 1},
	{txt: 'AQUI EMBAIXO', de: T.moral[1], dig: 0.35, ate: DURACAO + 1},
];
/* prévias: as telas de B3 (esquerda) e B2 (direita) sobem para o alto e crescem */
export const JANELA_PREVIAS = {de: T.sobe, ate: T.desce + 0.5};
const PREV = {cx: [335, 745], cy: 470, s: 2.42, rotulo: T.sobe + 0.62, rotuloAte: T.desce - 0.04};

/* ---------------------------------------------------------------- texto digitado */
const Digitado: React.FC<{f: Frase; t: number; y: number; corpo?: number}> = ({f, t, y, corpo = CORPO}) => {
	if (t < f.de || t >= f.ate) return null;
	const sai = 1 - c01((t - (f.ate - 0.1)) / 0.1);
	const letras = [...f.txt];
	const passo = f.dig / letras.length;
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: y - corpo * 0.62, height: corpo * 1.3, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: LETRA, fontSize: corpo, lineHeight: `${corpo * 1.3}px`, letterSpacing: '0.1em', color: COR.giz, opacity: sai}}>
			{letras.map((l, i) => {
				const k = c01((t - f.de - i * passo) / 0.09);
				return (
					<span key={i} style={{display: 'inline-block', transform: `scale(${lerp(0.3, 1, saida(k, 2))})`, transformOrigin: '50% 75%', opacity: k > 0 ? Math.min(1, k * 2) : 0}}>
						{l === ' ' ? ' ' : l}
					</span>
				);
			})}
		</div>
	);
};

/* ---------------------------------------------------------------- telas (9:16, 100x178 no lugar, centro em 0,0) */
const TW = 100;
const TH = 178;
const Pessoa: React.FC<{cy: number; r: number; ow: number; topo: number; base: number; cor: string}> = ({cy, r, ow, topo, base, cor}) => {
	const R = ow * 0.36;
	const x0 = -ow / 2;
	const x1 = ow / 2;
	return (
		<g fill={cor}>
			<circle cx={0} cy={cy} r={r} />
			<path d={`M${x0},${base} L${x0},${topo + R} Q${x0},${topo} ${x0 + R},${topo} L${x1 - R},${topo} Q${x1},${topo} ${x1},${topo + R} L${x1},${base} Z`} />
		</g>
	);
};
const Barra: React.FC<{y: number; w: number; h: number; cor: string}> = ({y, w: bw, h, cor}) => <rect x={-bw / 2} y={y - h / 2} width={bw} height={h} rx={h / 2} fill={cor} />;

/* cada modelo enquadra e escreve a mesma pessoa de um jeito; o 0 é este vídeo (palito no preto, sem rosto) */
const Conteudo: React.FC<{m: number; texto: string; pessoa: string; vivo: (k: number) => number}> = ({m, texto, pessoa, vivo}) => {
	if (m === 0)
		return (
			<g stroke={texto} strokeLinecap="round" fill="none">
				<Barra y={-48} w={50 * vivo(0)} h={3.6} cor={texto} />
				<g strokeWidth={4}>
					<circle cx={0} cy={6} r={6.5} fill={texto} stroke="none" />
					<line x1={0} y1={14} x2={0} y2={38} />
					<line x1={0} y1={38} x2={-7} y2={56} />
					<line x1={0} y1={38} x2={7} y2={56} />
					<line x1={0} y1={19} x2={-8} y2={34} />
					<line x1={0} y1={19} x2={8} y2={34} />
				</g>
			</g>
		);
	if (m === 1)
		return (
			<g>
				<Pessoa cy={-22} r={25} ow={92} topo={14} base={95} cor={pessoa} />
				<Barra y={44} w={72 * vivo(0)} h={8} cor={texto} />
				<Barra y={58} w={50 * vivo(1)} h={8} cor={texto} />
			</g>
		);
	if (m === 2)
		return (
			<g>
				<rect x={-38} y={-62} width={76} height={20} rx={4} fill={texto} />
				<Barra y={-30} w={52 * vivo(0)} h={6} cor={texto} />
				<Pessoa cy={30} r={12} ow={50} topo={47} base={95} cor={pessoa} />
			</g>
		);
	if (m === 3)
		return (
			<g>
				<Pessoa cy={-52} r={15} ow={62} topo={-32} base={0} cor={pessoa} />
				<line x1={-50} y1={0} x2={50} y2={0} stroke={COR.c2} strokeWidth={2} />
				<rect x={-32} y={20} width={64} height={13} rx={3} fill={texto} />
				<Barra y={48} w={44 * vivo(0)} h={5} cor={texto} />
				<Barra y={60} w={34 * vivo(1)} h={5} cor={texto} />
			</g>
		);
	return (
		<g>
			<Pessoa cy={-24} r={18} ow={72} topo={0} base={95} cor={pessoa} />
			<rect x={-34} y={30} width={68} height={12} rx={3} fill={texto} />
			<Barra y={54} w={46 * vivo(0)} h={5} cor={texto} />
		</g>
	);
};

const Cru: React.FC = () => (
	<g>
		<rect x={-TW / 2} y={-TH / 2} width={TW} height={TH} fill="url(#cru)" />
		<Pessoa cy={-30} r={17} ow={70} topo={-6} base={95} cor="#474747" />
		<circle cx={0} cy={36} r={15} fill="rgba(0,0,0,0.4)" />
		<path d="M-5,27 L9,36 L-5,45 Z" fill={COR.c4} />
	</g>
);

type EstadoTela = {m: number; varre: number; verde: number; apaga: number; t: number; i: number};
const Tela: React.FC<{id: string; e: EstadoTela; semConteudo?: number}> = ({id, e, semConteudo = 0}) => {
	const corBorda = e.varre <= 0 ? '#555555' : mistura(mistura(COR.giz, COR.verde, e.verde), COR.c3, e.apaga);
	const texto = mistura(mistura(COR.giz, COR.verdeLuz, e.verde), COR.c3, e.apaga);
	const pessoa = mistura(mistura(COR.c3, '#2F6B33', e.verde), COR.c2, e.apaga);
	const k = Math.floor(e.t * 2.2);
	const vivo = (n: number) => (e.varre >= 1 ? 0.8 + 0.2 * random(`v${e.i}-${n}-${k}`) : 1);
	const ys = -TH / 2 + TH * e.varre;
	const brilho = e.varre > 0 ? (e.verde > 0 ? 0.95 : 0.4 * (1 - e.apaga)) : 0;
	return (
		<g>
			<defs>
				<clipPath id={`${id}-t`}>
					<rect x={-TW / 2} y={-TH / 2} width={TW} height={TH} rx={8} />
				</clipPath>
				<clipPath id={`${id}-e`}>
					<rect x={-TW / 2} y={-TH / 2} width={TW} height={TH * e.varre} />
				</clipPath>
				<clipPath id={`${id}-c`}>
					<rect x={-TW / 2} y={ys} width={TW} height={TH * (1 - e.varre)} />
				</clipPath>
			</defs>
			{brilho > 0 && <rect x={-TW / 2} y={-TH / 2} width={TW} height={TH} rx={8} fill="none" stroke={corBorda} strokeWidth={e.verde > 0 ? 8 : 5} filter={`url(#${e.verde > 0 ? 'b10' : 'b6'})`} opacity={brilho} />}
			<g clipPath={`url(#${id}-t)`}>
				{e.varre < 1 && (
					<g clipPath={`url(#${id}-c)`}>
						<Cru />
					</g>
				)}
				{e.varre > 0 && (
					<g clipPath={`url(#${id}-e)`} opacity={1 - semConteudo}>
						<rect x={-TW / 2} y={-TH / 2} width={TW} height={TH} fill="#060606" />
						<Conteudo m={e.m} texto={texto} pessoa={pessoa} vivo={vivo} />
					</g>
				)}
			</g>
			<rect x={-TW / 2} y={-TH / 2} width={TW} height={TH} rx={8} fill="none" stroke={corBorda} strokeWidth={3} />
			{e.varre > 0 && e.varre < 1 && (
				<g>
					<rect x={-TW / 2 - 6} y={ys - 3} width={TW + 12} height={6} rx={3} fill={e.verde > 0 ? COR.verde : COR.giz} filter="url(#b6)" />
					<rect x={-TW / 2 - 2} y={ys - 1.5} width={TW + 4} height={3} rx={1.5} fill={e.verde > 0 ? COR.verdeLuz : COR.giz} />
				</g>
			)}
		</g>
	);
};

/* ---------------------------------------------------------------- boneco palito (ref4: branco, cabeça redonda, ponta redonda) */
const L1 = 50;
const L2 = 48;
type Pose = {x: number; v: number; fase: number; ergue: number; olha: number; tela: React.ReactNode | null; t: number; i: number};
const Palito: React.FC<{p: Pose}> = ({p}) => {
	const anda = c01(p.v / 220);
	const A = 30 * DEG * anda;
	const parado = 1 - c01(p.v / 90);
	const pernas = [0, 1].map((k) => {
		const ph = p.fase + k * Math.PI;
		const a = A * Math.sin(ph) + (k ? -6 : 6) * DEG * parado;
		const dobra = 30 * DEG * anda * Math.max(0, Math.cos(ph));
		const joelho = [L1 * Math.sin(a), -96 + L1 * Math.cos(a)];
		const pe = [joelho[0] + L2 * Math.sin(a - dobra), joelho[1] + L2 * Math.cos(a - dobra)];
		return {joelho, pe};
	});
	const dy = -Math.max(pernas[0].pe[1], pernas[1].pe[1]);
	const respira = (1 - anda) * 2 * Math.sin((p.t / 2.4) * Math.PI * 2 + p.i * 1.7);
	const nx = 3 + 6 * anda;
	const er = p.ergue;
	const cab = [nx + 3 - 2 * p.olha, -180 - 2 * p.olha];
	const olho = [cab[0] + lerp(10, 6, p.olha), cab[1] + lerp(-2, -11, p.olha)];
	const maoY = -236 - er + respira;
	const membro = (d: string, larg: number) => (
		<>
			<path d={d} stroke="#A9A9A9" strokeWidth={larg + 2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} stroke={COR.giz} strokeWidth={larg} fill="none" strokeLinecap="round" strokeLinejoin="round" />
		</>
	);
	return (
		<g transform={`translate(${p.x},${CHAO + dy})`}>
			{p.tela && <g transform={`translate(2,${-319 - er + respira})`}>{p.tela}</g>}
			{pernas.map((g, k) => (
				<g key={k}>{membro(`M0,-96 L${g.joelho[0]},${g.joelho[1]} L${g.pe[0]},${g.pe[1]} L${g.pe[0] + 10},${g.pe[1]}`, 14)}</g>
			))}
			{membro(`M0,-96 L${nx},-150`, 16)}
			{membro(`M${nx},-150 L${nx + 1},-160`, 10)}
			{membro(`M${nx},-144 L-32,${-168 - er * 0.5 + respira} L-37,${maoY}`, 13)}
			{membro(`M${nx},-144 L44,${-168 - er * 0.5 + respira} L39,${maoY}`, 13)}
			<circle cx={cab[0]} cy={cab[1]} r={20.2} fill="#A9A9A9" />
			<circle cx={cab[0]} cy={cab[1]} r={19} fill="url(#cabeca)" />
			<circle cx={olho[0]} cy={olho[1]} r={2.6} fill="#151515" />
		</g>
	);
};

/* ---------------------------------------------------------------- a cena */
const MODELO_DE = [0, 1, 2, 3, 4];
const estadoTela = (i: number, t: number): EstadoTela => {
	if (i === 4) {
		const varre = c01((t - T.edicaoVoce) / VARRE);
		return {m: 4, varre, verde: varre > 0 ? 1 : 0, apaga: 0, t, i};
	}
	const varre = c01((t - T.edicoes[i]) / VARRE);
	const verde = t >= T.virada ? 1 : 0;
	const apaga = i === 0 || verde ? 0 : suave(t, T.apenasUm, T.apenasUm + 0.3);
	return {m: MODELO_DE[i], varre, verde, apaga, t, i};
};
const sobeTela = (i: number) => (i === 2 ? 0 : i === 1 ? 1 : -1); // B3 -> prévia da esquerda, B2 -> direita
const voo = (t: number) => saida((t - T.sobe) / 0.6, 3) * (1 - vaiVem((t - T.desce) / 0.5));

const Elenco: React.FC<{t: number; previas: boolean; sufixo: string}> = ({t, previas, sufixo}) => (
	<g>
		{CHEGADAS.map((c, i) => {
			if (t < c.t0) return null;
			const x = posX(c, t);
			const sobe = previas && sobeTela(i) >= 0;
			const ergue = sobe ? 18 * suave(t, T.ergue, T.ergue + 0.4) * (1 - suave(t, T.desce + 0.5, T.desce + 0.9)) : 0;
			const olha = i < 4 ? suave(t, T.ergue, T.ergue + 0.35) * (1 - suave(t, T.desce, T.desce + 0.4)) : 0;
			const fora = sobe && voo(t) > 0.001;
			const pose: Pose = {x, v: velX(c, t), fase: ((x - c.x0) / PASSO) * Math.PI, ergue, olha, t, i, tela: fora ? null : <Tela id={`t${i}${sufixo}`} e={estadoTela(i, t)} />};
			return <Palito key={i} p={pose} />;
		})}
	</g>
);

const Halo: React.FC<{cx: number; cy: number; r: number; grad: string; op: number}> = ({cx, cy, r, grad, op}) =>
	op > 0.001 ? <circle cx={cx} cy={cy} r={r} fill={`url(#${grad})`} opacity={op} /> : null;

const Halos: React.FC<{t: number}> = ({t}) => {
	const out: React.ReactNode[] = [];
	const flash = t >= T.virada ? 1 + 0.6 * Math.exp(-(t - T.virada) / 0.25) : 0;
	CHEGADAS.forEach((c, i) => {
		if (t < c.t0) return;
		const cx = posX(c, t) + 2;
		const cy = CHAO - 319;
		if (i === 0) out.push(<Halo key="b" cx={cx} cy={cy} r={240} grad="hBranco" op={suave(t, T.apenasUm, T.apenasUm + 0.3) * (t >= T.virada ? 0 : 1)} />);
		const e = estadoTela(i, t);
		if (e.verde > 0 && e.varre > 0) out.push(<Halo key={`v${i}`} cx={cx} cy={cy} r={300} grad="hVerde" op={0.8 * (i === 4 ? Math.min(1, e.varre * 1.5) : flash)} />);
	});
	return <g style={{mixBlendMode: 'screen'}}>{out}</g>;
};

const TelasVoando: React.FC<{t: number}> = ({t}) => {
	const k = voo(t);
	if (k <= 0.001 || t < T.sobe) return null;
	return (
		<g>
			{[2, 1].map((i) => {
				const c = CHEGADAS[i];
				const x0 = posX(c, t) + 2;
				const y0 = CHAO - 319 - 18;
				const lado = sobeTela(i);
				const cx = lerp(x0, PREV.cx[lado], k);
				const cy = lerp(y0, PREV.cy, k) - Math.sin(k * Math.PI) * 40;
				const s = lerp(1, PREV.s, k);
				return (
					<g key={i} transform={`translate(${cx},${cy}) scale(${s})`}>
						<Tela id={`v${i}`} e={estadoTela(i, t)} />
					</g>
				);
			})}
		</g>
	);
};

/* prévias de verdade (prop previas): o vídeo entra dentro da tela que subiu, com a etiqueta do nome embaixo */
export const PreviasEmCima: React.FC<{t: number; nomes: [string, string]}> = ({t, nomes}) => {
	const k = voo(t);
	if (t < JANELA_PREVIAS.de || t >= JANELA_PREVIAS.ate || k <= 0.001) return null;
	const op = c01((k - 0.35) / 0.45);
	return (
		<AbsoluteFill>
			{[2, 1].map((i) => {
				const lado = sobeTela(i);
				const c = CHEGADAS[i];
				const cx = lerp(posX(c, t) + 2, PREV.cx[lado], k);
				const cy = lerp(CHAO - 319 - 18, PREV.cy, k) - Math.sin(k * Math.PI) * 40;
				const s = lerp(1, PREV.s, k);
				const bw = TW * s;
				const bh = TH * s;
				return (
					<div key={i} style={{position: 'absolute', left: cx - bw / 2, top: cy - bh / 2, width: bw, height: bh, borderRadius: 8 * s, overflow: 'hidden', opacity: op, boxSizing: 'border-box', border: `${Math.max(2, 1.6 * s)}px solid ${COR.giz}`, boxShadow: '0 0 34px rgba(252,252,252,0.16)', background: '#000'}}>
						<Sequence from={fr(T.sobe)} layout="none">
							<OffthreadVideo muted src={staticFile(`previa${lado + 1}.mp4`)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
						</Sequence>
					</div>
				);
			})}
			{[0, 1].map((lado) => (
				<div key={`r${lado}`} style={{position: 'absolute', left: PREV.cx[lado] - W / 2, top: 0, width: W, height: H}}>
					<Digitado f={{txt: nomes[lado].toUpperCase(), de: PREV.rotulo + lado * 0.08, dig: 0.4, ate: PREV.rotuloAte}} t={t} y={PREV.cy + (TH * PREV.s) / 2 + 42} corpo={30} />
				</div>
			))}
		</AbsoluteFill>
	);
};

export const VitrineIlustrations01: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], musica = false, efeitos = false}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const cena = 1 - suave(t, T.apagao, T.apagao + 0.15);
	return (
		<AbsoluteFill style={{background: '#000000'}}>
			{cena > 0 && (
				<AbsoluteFill style={{opacity: cena}}>
					<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
						<defs>
							<radialGradient id="hVerde">
								<stop offset="0" stopColor={COR.verde} stopOpacity={0.3} />
								<stop offset="0.3" stopColor={COR.verde} stopOpacity={0.12} />
								<stop offset="0.65" stopColor={COR.verde} stopOpacity={0.035} />
								<stop offset="1" stopColor={COR.verde} stopOpacity={0} />
							</radialGradient>
							<radialGradient id="hBranco">
								<stop offset="0" stopColor="#FFFFFF" stopOpacity={0.16} />
								<stop offset="0.4" stopColor="#FFFFFF" stopOpacity={0.06} />
								<stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
							</radialGradient>
							<radialGradient id="cabeca" cx="0.38" cy="0.34" r="0.7">
								<stop offset="0" stopColor="#FFFFFF" />
								<stop offset="0.7" stopColor={COR.giz} />
								<stop offset="1" stopColor="#D9D9D9" />
							</radialGradient>
							<linearGradient id="cru" x1="0" y1="0" x2="0.4" y2="1">
								<stop offset="0" stopColor="#3C3C3C" />
								<stop offset="1" stopColor={COR.c1} />
							</linearGradient>
							<linearGradient id="someReflexo" x1="0" y1={CHAO} x2="0" y2={CHAO + 173} gradientUnits="userSpaceOnUse">
								<stop offset="0" stopColor="#fff" stopOpacity={1} />
								<stop offset="1" stopColor="#fff" stopOpacity={0} />
							</linearGradient>
							<mask id="mReflexo" maskUnits="userSpaceOnUse" x={0} y={CHAO} width={W} height={400}>
								<rect x={0} y={CHAO} width={W} height={400} fill="url(#someReflexo)" />
							</mask>
							<filter id="b6" x="-50%" y="-50%" width="200%" height="200%">
								<feGaussianBlur stdDeviation={6} />
							</filter>
							<filter id="b10" x="-60%" y="-60%" width="220%" height="220%">
								<feGaussianBlur stdDeviation={10} />
							</filter>
							<filter id="bReflexo" x="-20%" y="-20%" width="140%" height="140%">
								<feGaussianBlur stdDeviation={4} />
							</filter>
						</defs>
						<Halos t={t} />
						{/* reflexo: cópia espelhada sob o chão, borrada, ~20% da luz, some em 9% da altura (MODELO §3) */}
						<g mask="url(#mReflexo)" opacity={0.22}>
							<g transform={`translate(0,${2 * CHAO}) scale(1,-1)`} filter="url(#bReflexo)">
								<Elenco t={t} previas={previas} sufixo="r" />
							</g>
						</g>
						<Elenco t={t} previas={previas} sufixo="" />
						{previas && <TelasVoando t={t} />}
					</svg>
					{previas && <PreviasEmCima t={t} nomes={nomesPrevias} />}
					{FRASES.map((fz, i) => (
						<Digitado key={i} f={fz} t={t} y={FRASE_Y} />
					))}
				</AbsoluteFill>
			)}
			{MORAL.map((fz, i) => (
				<Digitado key={`m${i}`} f={fz} t={t} y={MORAL_Y - 23 + i * 46} />
			))}
			{/* som: a voz sempre; trilha e efeitos com as props (níveis já no arquivo). A vitrine mixa fora (scripts/mixar.sh). */}
			<Audio src={staticFile('voz.wav')} />
			{musica && <Audio src={staticFile('trilha.wav')} />}
			{efeitos && <Audio src={staticFile('efeitos.wav')} />}
		</AbsoluteFill>
	);
};
