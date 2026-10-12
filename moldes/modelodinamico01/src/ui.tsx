import React from 'react';
import {Freeze, OffthreadVideo, staticFile} from 'remotion';
import {C, E, R, SANS, SERIF, SOMBRA, mola, rostoX, tw, useT} from './tema';

/** public/fala.mp4 tem 906 quadros (30,2 s); a voz vai a 30,36 s: o vídeo congela no fim */
const ULTIMO = 904;

/** a fala do Jessé (muda: o som entra uma vez só, no Reel). Congela no último quadro na cauda. */
export const Fala: React.FC<{s?: number; x?: number; y?: number}> = ({s = 1, x = 0, y = 0}) => {
	const {f} = useT();
	const v = <OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />;
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${x}px, ${y}px) scale(${s})`}}>
			{f < ULTIMO ? v : <Freeze frame={ULTIMO}>{v}</Freeze>}
		</div>
	);
};

/** enquadra o vídeo numa caixa: escala s, olhos em (cx, oy) da caixa; segue o rosto na horizontal (rosto_t.json) */
export const FalaEm: React.FC<{s: number; cx: number; oy: number; fixo?: boolean}> = ({s, cx, oy, fixo}) => {
	const {t} = useT();
	return <Fala s={s} x={cx - s * (fixo ? R.cx : rostoX(t))} y={oy - s * R.olhos} />;
};

/** caixa de seleção com alças (estilo Figma, ref3) em volta de um elemento posicionado */
export const Selecao: React.FC<{o?: number; cor?: string; pad?: number}> = ({o = 1, cor = C.selecao, pad = 10}) => (
	<div style={{position: 'absolute', inset: -pad, border: `4px solid ${cor}`, opacity: o, pointerEvents: 'none'}}>
		{[
			{left: -11, top: -11},
			{right: -11, top: -11},
			{left: -11, bottom: -11},
			{right: -11, bottom: -11},
		].map((k, j) => (
			<div key={j} style={{position: 'absolute', width: 18, height: 18, background: C.branco, border: `4px solid ${cor}`, ...k}} />
		))}
	</div>
);

/** a faísca do Claude (asterisco de raios, não é o logo) */
export const Faisca: React.FC<{size: number; cor?: string}> = ({size, cor = C.branco}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100">
		{Array.from({length: 12}, (_, i) => {
			const a = (i / 12) * Math.PI * 2;
			const r = i % 2 ? 34 : 44;
			return <line key={i} x1={Math.cos(a) * 9} y1={Math.sin(a) * 9} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={cor} strokeWidth={9} strokeLinecap="round" />;
		})}
	</svg>
);

export const ChipClaude: React.FC<{size: number}> = ({size}) => (
	<div style={{width: size, height: size, borderRadius: size * 0.24, background: C.destaque, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SOMBRA}}>
		<Faisca size={size * 0.72} />
	</div>
);

export const Cursor: React.FC<{x: number; y: number; cor?: string; rotulo?: string; o?: number; clique?: number}> = ({x, y, cor = C.tinta, rotulo, o = 1, clique = 0}) => (
	<div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${1 - 0.15 * clique})`, transformOrigin: '0 0'}}>
		<svg width={46} height={56} viewBox="0 0 23 28">
			<path d="M1 1 L1 22 L6.5 16.5 L10.5 26 L14 24.5 L10 15.5 L18 15.5 Z" fill={cor} stroke={C.branco} strokeWidth={1.6} strokeLinejoin="round" />
		</svg>
		{rotulo && (
			<div style={{position: 'absolute', left: 34, top: 40, background: cor, color: C.branco, fontFamily: SANS, fontWeight: 700, fontSize: 24, padding: '4px 12px', borderRadius: 8, whiteSpace: 'nowrap'}}>{rotulo}</div>
		)}
	</div>
);

/** entrada que salta (mola) */
export const pop = (t: number, at: number) => {
	const k = mola(t, at);
	return {opacity: Math.min(1, k * 1.6), transform: `scale(${0.6 + 0.4 * k})`};
};

/** título do palco (MODELO §2 M1): serifa itálica na cor de destaque + sans preta + traço de pincel */
export const Titulo: React.FC<{serif: string; sans?: string; de: number; ate?: number}> = ({serif, sans, de, ate = 999}) => {
	const {t} = useT();
	if (t < de || t > ate + 0.25) return null;
	const e = tw(t, de, de + 0.28, 0, 1);
	const s = tw(t, ate, ate + 0.22, 0, 1, E.in);
	const x = (1 - e) * 140 - s * 160;
	const blur = (1 - e) * 10 + s * 12;
	const traco = tw(t, de + 0.12, de + 0.5, 0, 1);
	const topo = sans ? 205 : 255;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: topo, textAlign: 'center', opacity: Math.min(e * 1.5, 1 - s), transform: `translateX(${x}px)`, filter: `blur(${blur}px)`}}>
			<div style={{fontFamily: SERIF, fontSize: 112, lineHeight: 1, color: C.destaque, letterSpacing: '-0.01em'}}>{serif}</div>
			{sans && <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 96, lineHeight: 1.05, color: C.tinta, letterSpacing: '-0.035em'}}>{sans}</div>}
			<svg width={460} height={22} viewBox="0 0 460 22" style={{marginTop: 8}}>
				<path d="M6 14 C 120 6, 300 6, 454 11" stroke={C.destaque} strokeWidth={7} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - traco} />
			</svg>
		</div>
	);
};

/** o card do meio do palco (x 57 a 1023, y 453 a 1158) */
export const CardPalco: React.FC<{escuro?: boolean; children: React.ReactNode; de: number}> = ({escuro, children, de}) => {
	const {t} = useT();
	const e = mola(t, de, {damping: 18});
	return (
		<div
			style={{
				position: 'absolute',
				left: 57,
				top: 453,
				width: 966,
				height: 705,
				borderRadius: 18,
				background: escuro ? C.escuro : C.papel,
				boxShadow: SOMBRA,
				overflow: 'hidden',
				opacity: Math.min(1, e * 1.5),
				transform: `translateY(${(1 - e) * 60}px)`,
			}}
		>
			{children}
		</div>
	);
};

/** troca de conteúdo dentro do card: chicote com borrão (MODELO §5), entra da direita e sai pra esquerda */
export const Troca: React.FC<{de: number; ate: number; children: React.ReactNode; primeira?: boolean}> = ({de, ate, children, primeira}) => {
	const {t} = useT();
	if (t < de || t >= ate + 0.2) return null;
	const e = primeira ? 1 : tw(t, de, de + 0.24, 0, 1);
	const s = tw(t, ate, ate + 0.2, 0, 1, E.in);
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - e) * 260 - s * 300}px)`, filter: `blur(${(1 - e) * 14 + s * 16}px)`, opacity: Math.min(e * 2, 1 - s)}}>{children}</div>
	);
};

/** o rosto num card embaixo, sangrando pra fora da base (M1) */
export const RostoPalco: React.FC = () => (
	<div style={{position: 'absolute', left: 109, top: 1330, width: 862, height: 640, borderRadius: 36, overflow: 'hidden', boxShadow: SOMBRA, background: '#000'}}>
		<FalaEm s={0.82} cx={431} oy={250} />
	</div>
);
