import React from 'react';
import {C, E, SANS, mola, rnd, tw, useT} from './tema';

export const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: x, top: y, ...extra});
export const brilho = (cor: string, k = 1) => `0 0 ${18 * k}px ${cor}, 0 0 ${48 * k}px ${cor}88`;
const hexA = (hex: string, a: number) => {
	const n = parseInt(hex.slice(1), 16);
	return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
export {hexA};

/* ---------------------------------------------------------------- fundos (anunciomotion01.md §2) */
export const Fundo: React.FC<{claro?: boolean; tom?: 'marca' | 'dor' | 'neutro' | 'noite'}> = ({claro, tom = 'marca'}) => {
	const {t} = useT();
	if (claro)
		return (
			<div style={{position: 'absolute', inset: 0, background: C.claro, overflow: 'hidden'}}>
				<div style={ab(-300 + 60 * Math.sin(t * 0.6), -200, {width: 1100, height: 1100, borderRadius: '50%', background: `radial-gradient(circle, ${hexA(C.v, 0.3)}, ${hexA(C.v, 0)} 65%)`})} />
				<div style={ab(380, 1100 + 50 * Math.cos(t * 0.5), {width: 1100, height: 1100, borderRadius: '50%', background: `radial-gradient(circle, ${hexA(C.vFundo, 0.18)}, ${hexA(C.vFundo, 0)} 65%)`})} />
				<div style={{position: 'absolute', inset: 0, background: `repeating-linear-gradient(135deg, ${hexA(C.tinta, 0.024)} 0 2px, transparent 2px 16px)`}} />
			</div>
		);
	const luz = tom === 'dor' ? 'rgba(255,42,42,0.16)' : tom === 'noite' ? 'rgba(60,140,255,0.14)' : tom === 'neutro' ? 'rgba(255,255,255,0.05)' : hexA(C.v, 0.2);
	return (
		<div style={{position: 'absolute', inset: 0, background: C.preto, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.028) 0 2px, transparent 2px 15px)'}} />
			<div style={ab(-420 + 80 * Math.sin(t * 0.4), -380, {width: 1300, height: 1300, borderRadius: '50%', background: `radial-gradient(circle, ${luz}, rgba(0,0,0,0) 62%)`})} />
			<div style={ab(260, 1150 + 60 * Math.cos(t * 0.35), {width: 1200, height: 1200, borderRadius: '50%', background: `radial-gradient(circle, ${luz.replace(/0\.\d+\)/, '0.10)')}, rgba(0,0,0,0) 62%)`})} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)'}} />
		</div>
	);
};

/* ---------------------------------------------------------------- texto (anunciomotion01.md §3) */
/** palavra que nasce de um desfoque com leve deslize (~4 quadros) */
export const Pal: React.FC<{txt: string; de: number; style?: React.CSSProperties; dx?: number; dy?: number; children?: React.ReactNode}> = ({txt, de, style, dx = 34, dy = 0, children}) => {
	const {t} = useT();
	const k = tw(t, de - 0.04, de + 0.16, 0, 1);
	return (
		<span style={{display: 'inline-block', position: 'relative', opacity: k, filter: k < 1 ? `blur(${(1 - k) * 16}px)` : undefined, transform: `translate(${(1 - k) * dx}px, ${(1 - k) * dy}px)`, whiteSpace: 'pre', ...style}}>
			{txt}
			{children}
		</span>
	);
};

export type Tk = {txt: string; de: number};
/** uma linha de palavras no tempo da fala */
export const Linha: React.FC<{p: Tk[]; tam: number; cor?: string; peso?: number; glow?: string; estilo?: React.CSSProperties; extra?: (i: number) => React.ReactNode}> = ({p, tam, cor = '#fff', peso = 700, glow, estilo, extra}) => (
	<div style={{fontFamily: SANS, fontSize: tam, fontWeight: peso, color: cor, letterSpacing: tam > 90 ? '-0.045em' : '-0.025em', lineHeight: 1.08, whiteSpace: 'nowrap', textShadow: glow ? brilho(glow, tam / 110) : undefined, ...estilo}}>
		{p.map((x, i) => (
			<React.Fragment key={i}>
				{i > 0 && ' '}
				<Pal txt={x.txt} de={x.de}>{extra?.(i)}</Pal>
			</React.Fragment>
		))}
	</div>
);

/** risco vermelho que corre da esquerda pra direita (negação) */
export const Risco: React.FC<{de: number; cor?: string; espessura?: number; top?: string; dur?: number}> = ({de, cor = C.vermelho, espessura = 9, top = '52%', dur = 0.24}) => {
	const {t} = useT();
	const k = tw(t, de, de + dur, 0, 1, E.inOut);
	if (k <= 0) return null;
	return <span style={{position: 'absolute', left: '-5%', top, width: `${110 * k}%`, height: espessura, marginTop: -espessura / 2, background: cor, borderRadius: espessura, boxShadow: brilho(cor, 0.7), transform: 'rotate(-2deg)'}} />;
};

/** barra da cor da marca passando por baixo da frase */
export const MarcaTexto: React.FC<{de: number; cor?: string; dur?: number}> = ({de, cor = C.v, dur = 0.3}) => {
	const {t} = useT();
	const k = tw(t, de, de + dur, 0, 1, E.inOut);
	return <span style={{position: 'absolute', left: '-3%', bottom: '-0.02em', width: `${106 * k}%`, height: '0.42em', background: `linear-gradient(90deg, ${hexA(cor, 0.55)}, ${cor})`, borderRadius: 10, zIndex: -1, boxShadow: `0 0 30px ${hexA(cor, 0.6)}`}} />;
};

/** palavra-chave dentro da pílula de contorno brilhante, escrita letra por letra, entra inclinada e endireita */
export const Pilula: React.FC<{texto: string; de: number; tam?: number; cor?: string; claro?: boolean; dur?: number; solida?: boolean}> = ({texto, de, tam = 92, cor = C.v, claro, dur = 0.4, solida}) => {
	const {t} = useT();
	const k = mola(t, de - 0.05, {damping: 15, stiffness: 140});
	const n = Math.round(tw(t, de, de + dur, 0, texto.length, (x) => x));
	const borrao = tw(t, de - 0.05, de + 0.15, 14, 0);
	return (
		<div style={{display: 'inline-block', perspective: 1200}}>
			<div
				style={{
					position: 'relative',
					padding: `${tam * 0.2}px ${tam * 0.42}px ${tam * 0.24}px`,
					borderRadius: tam * 0.38,
					border: `${Math.max(3, tam * 0.04)}px solid ${solida ? 'transparent' : hexA(cor, 0.95)}`,
					background: solida ? `linear-gradient(160deg, ${C.vClaro}, ${cor} 55%, ${C.vEscuro})` : claro ? hexA(cor, 0.1) : `linear-gradient(160deg, ${hexA(cor, 0.28)}, ${hexA(cor, 0.06)})`,
					boxShadow: `0 0 ${tam * 0.4}px ${hexA(cor, 0.55)}, inset 0 0 ${tam * 0.3}px ${hexA(cor, 0.35)}`,
					fontFamily: SANS,
					fontWeight: 700,
					fontSize: tam,
					letterSpacing: '-0.03em',
					lineHeight: 1,
					color: solida ? C.tinta : claro ? C.tinta : C.textoPilula,
					textShadow: solida ? 'none' : claro ? 'none' : brilho(cor, tam / 140),
					whiteSpace: 'nowrap',
					opacity: Math.min(1, k * 1.6),
					filter: borrao > 0.3 ? `blur(${borrao}px)` : undefined,
					transform: `rotateY(${(1 - k) * -38}deg) rotateZ(${(1 - k) * -9}deg) scale(${0.75 + 0.25 * k})`,
				}}
			>
				<span style={{visibility: 'hidden'}}>{texto}</span>
				<span style={{position: 'absolute', left: tam * 0.42, top: tam * 0.2}}>{texto.slice(0, n)}</span>
			</div>
		</div>
	);
};

/** dor em glitch: caixa alta fina, tremida e rastro RGB (anunciomotion01.md §4) */
export const Glitch: React.FC<{texto: string; de: number; tam: number; peso?: number; cor?: string}> = ({texto, de, tam, peso = 300, cor = '#FFE9E9'}) => {
	const {f, t} = useT();
	const k = tw(t, de - 0.03, de + 0.12, 0, 1);
	const forte = Math.max(0, 1 - (t - de) / 0.5);
	const j = (s: number) => (rnd(f * 7 + s) - 0.5) * (6 + 22 * forte);
	const pisca = rnd(f * 3.1) < 0.12 * forte + 0.03 ? 0.4 : 1;
	const base: React.CSSProperties = {fontFamily: SANS, fontWeight: peso, fontSize: tam, letterSpacing: '0.02em', lineHeight: 1, whiteSpace: 'nowrap', textTransform: 'uppercase'};
	const corte = rnd(f * 1.7) * 80;
	return (
		<div style={{position: 'relative', opacity: k * pisca, filter: k < 1 ? `blur(${(1 - k) * 12}px)` : undefined}}>
			<div style={{...base, position: 'absolute', left: j(1) - 5, top: j(2) * 0.3, color: 'rgba(255,30,50,0.85)', mixBlendMode: 'screen'}}>{texto}</div>
			<div style={{...base, position: 'absolute', left: j(3) + 5, top: j(4) * 0.3, color: 'rgba(40,220,255,0.45)', mixBlendMode: 'screen'}}>{texto}</div>
			<div style={{...base, position: 'relative', color: cor, textShadow: brilho(C.vermelho, tam / 120)}}>{texto}</div>
			<div style={{...base, position: 'absolute', left: j(5) * 1.6, top: 0, color: cor, clipPath: `inset(${corte}% 0 ${Math.max(0, 88 - corte)}% 0)`}}>{texto}</div>
		</div>
	);
};

/** pulso vermelho tipo eletrocardiograma atravessando a tela */
export const Ecg: React.FC<{de: number; y: number; dur?: number; cor?: string}> = ({de, y, dur = 0.9, cor = C.vermelho}) => {
	const {t} = useT();
	const k = tw(t, de, de + dur, 0, 1, (x) => x);
	if (t < de || t > de + dur + 0.4) return null;
	const pts: string[] = [];
	for (let x = 0; x <= 1080; x += 12) {
		const c = Math.abs(x - 540);
		const yy = c < 110 ? (c < 20 ? -260 : c < 45 ? 170 : c < 70 ? -90 : 30) * (1 - c / 110) : Math.sin(x * 0.08) * 4;
		pts.push(`${x},${y + yy}`);
	}
	const fade = 1 - tw(t, de + dur, de + dur + 0.4, 0, 1);
	return (
		<svg style={ab(0, 0)} width={1080} height={1920}>
			<polyline points={pts.join(' ')} fill="none" stroke={cor} strokeWidth={5} pathLength={1} strokeDasharray="0.22 1" strokeDashoffset={0.22 - k * 1.22} style={{filter: `drop-shadow(0 0 12px ${cor}) drop-shadow(0 0 30px ${cor})`}} opacity={fade} />
			<polyline points={pts.join(' ')} fill="none" stroke={cor} strokeWidth={2} opacity={0.18 * fade} />
		</svg>
	);
};

/** anéis concêntricos com pontos orbitando (anunciomotion01.md §4) */
export const Aneis: React.FC<{de: number; cx: number; cy: number; cor?: string; r0?: number; passo?: number; n?: number; acesos?: number}> = ({de, cx, cy, cor = C.v, r0 = 260, passo = 150, n = 4}) => {
	const {t} = useT();
	return (
		<svg style={ab(0, 0)} width={1080} height={1920}>
			{Array.from({length: n}, (_, i) => {
				const k = mola(t, de + i * 0.06, {damping: 18, stiffness: 90});
				const r = (r0 + i * passo) * (0.6 + 0.4 * k);
				const giro = (t - de) * (i % 2 ? -14 : 10) + i * 40;
				return (
					<g key={i} opacity={k * (0.75 - i * 0.13)} transform={`rotate(${giro} ${cx} ${cy})`}>
						<circle cx={cx} cy={cy} r={r} fill="none" stroke={cor} strokeWidth={3} style={{filter: `drop-shadow(0 0 10px ${cor})`}} />
						{Array.from({length: 5 + i}, (_, j) => {
							const a = (j / (5 + i)) * Math.PI * 2;
							return <circle key={j} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={9} fill={C.preto} stroke={cor} strokeWidth={3} />;
						})}
					</g>
				);
			})}
		</svg>
	);
};

/** poeira de luz com profundidade (alguns pontos nítidos, outros desfocados na frente) */
export const Particulas: React.FC<{n?: number; cor?: string; semente?: number; de?: number; explode?: number}> = ({n = 26, cor = C.vClaro, semente = 1, de = 0, explode}) => {
	const {t} = useT();
	return (
		<>
			{Array.from({length: n}, (_, i) => {
				const s = semente * 100 + i;
				const z = rnd(s + 0.3);
				let x = rnd(s) * 1080;
				let y = rnd(s + 0.7) * 1920 - (t - de) * (20 + 60 * z);
				let op = 0.25 + 0.6 * z;
				if (explode !== undefined) {
					const a = rnd(s + 0.9) * Math.PI * 2;
					const d = tw(t, explode, explode + 1.1, 0, 1) * (300 + 600 * rnd(s + 0.4));
					x = 540 + Math.cos(a) * d;
					y = 900 + Math.sin(a) * d;
					op *= (1 - tw(t, explode + 0.5, explode + 1.3, 0, 1)) * (t >= explode ? 1 : 0);
				}
				const tam = z > 0.85 ? 26 : 4 + 9 * z;
				return <div key={i} style={ab(x, ((y % 1920) + 1920) % 1920, {width: tam, height: tam, borderRadius: '50%', background: cor, opacity: op, filter: z > 0.85 ? 'blur(9px)' : `blur(${(1 - z) * 2}px)`, boxShadow: `0 0 14px ${cor}`})} />;
			})}
		</>
	);
};

/** ícone herói de vidro com volume (camadas em 3D) e brilho */
export const IconeVidro: React.FC<{tam: number; giroY?: number; giroX?: number; cor?: string; children: React.ReactNode}> = ({tam, giroY = 0, giroX = 0, cor = C.v, children}) => {
	const cam = 14;
	return (
		<div style={{width: tam, height: tam, perspective: 1600}}>
			<div style={{position: 'relative', width: tam, height: tam, transformStyle: 'preserve-3d', transform: `rotateX(${giroX}deg) rotateY(${giroY}deg)`}}>
				{Array.from({length: cam}, (_, i) => (
					<div key={i} style={{position: 'absolute', inset: 0, borderRadius: tam * 0.27, transform: `translateZ(${-i * (tam * 0.012)}px)`, background: i === cam - 1 ? C.vidroFundo : `linear-gradient(160deg, ${hexA(cor, 0.9)}, ${C.vidroCamada})`, filter: `brightness(${0.55 - i * 0.02})`}} />
				))}
				<div style={{position: 'absolute', inset: 0, borderRadius: tam * 0.27, background: `linear-gradient(155deg, ${C.vidroLuz} 0%, ${C.vFundo} 45%, ${C.vidroBase} 100%)`, boxShadow: `0 0 ${tam * 0.45}px ${hexA(cor, 0.7)}, inset 0 ${tam * 0.04}px ${tam * 0.05}px rgba(255,255,255,0.55), inset 0 -${tam * 0.06}px ${tam * 0.1}px ${hexA(C.sombra, 0.5)}`, transform: 'translateZ(1px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
					<div style={{position: 'absolute', left: '-30%', top: '-60%', width: '160%', height: '90%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)', transform: `translateX(${giroY * 1.2}px)`}} />
					<div style={{position: 'relative', filter: `drop-shadow(0 8px 14px ${hexA(C.sombra, 0.45)})`}}>{children}</div>
				</div>
			</div>
		</div>
	);
};

/* ---------------------------------------------------------------- glifos */
export const G = {
	cal: (s: number, cor = '#fff') => (
		<svg width={s} height={s} viewBox="0 0 100 100">
			<rect x={14} y={20} width={72} height={66} rx={14} fill="none" stroke={cor} strokeWidth={8} />
			<line x1={14} y1={40} x2={86} y2={40} stroke={cor} strokeWidth={8} />
			<line x1={34} y1={10} x2={34} y2={28} stroke={cor} strokeWidth={8} strokeLinecap="round" />
			<line x1={66} y1={10} x2={66} y2={28} stroke={cor} strokeWidth={8} strokeLinecap="round" />
			<path d="M35 62 L46 72 L66 52" fill="none" stroke={cor} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	check: (s: number, cor = '#fff', k = 1) => (
		<svg width={s} height={s} viewBox="0 0 100 100">
			<path d="M24 52 L42 70 L77 32" fill="none" stroke={cor} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
		</svg>
	),
	lua: (s: number, cor: string) => (
		<svg width={s} height={s} viewBox="0 0 100 100">
			<path d="M64 12 A40 40 0 1 0 88 66 A32 32 0 0 1 64 12 Z" fill={cor} />
		</svg>
	),
	sol: (s: number, cor: string) => (
		<svg width={s} height={s} viewBox="0 0 100 100">
			<circle cx={50} cy={50} r={20} fill={cor} />
			{Array.from({length: 8}, (_, i) => {
				const a = (i / 8) * Math.PI * 2;
				return <line key={i} x1={50 + Math.cos(a) * 30} y1={50 + Math.sin(a) * 30} x2={50 + Math.cos(a) * 42} y2={50 + Math.sin(a) * 42} stroke={cor} strokeWidth={7} strokeLinecap="round" />;
			})}
		</svg>
	),
	cadeira: (s: number, cor: string) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
			<rect x={57} y={3} width={18} height={9} rx={4.5} />
			<path d="M66 12 L65 17" />
			<path d="M57 17 H72 a3 3 0 0 1 3 3 L73 50 H55 L54 20 a3 3 0 0 1 3 -3 Z" />
			<rect x={26} y={50} width={50} height={10} rx={5} />
			<path d="M28 40 H60 M34 40 V50" />
			<path d="M30 60 L20 76 M10 76 H30" />
			<path d="M52 60 V82" />
			<ellipse cx={52} cy={87} rx={22} ry={5} />
		</svg>
	),
	tesoura: (s: number, cor: string, abre = 0) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={6} strokeLinecap="round">
			<g transform={`rotate(${-abre * 14} 50 50)`}>
				<circle cx={22} cy={72} r={12} />
				<line x1={31} y1={64} x2={88} y2={22} />
			</g>
			<g transform={`rotate(${abre * 14} 50 50)`}>
				<circle cx={22} cy={28} r={12} />
				<line x1={31} y1={36} x2={88} y2={78} />
			</g>
		</svg>
	),
	cadeado: (s: number, cor: string, abre = 0) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={8} strokeLinecap="round">
			<rect x={20} y={44} width={60} height={46} rx={10} fill={cor} stroke="none" />
			<path d={`M32 44 V30 A18 18 0 0 1 68 30 V${44 - abre * 18}`} transform={`translate(0 ${-abre * 10})`} />
		</svg>
	),
	link: (s: number, cor: string) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={9} strokeLinecap="round">
			<path d="M44 58 a16 16 0 0 0 23 0 l14 -14 a16 16 0 0 0 -23 -23 l-6 6" />
			<path d="M56 42 a16 16 0 0 0 -23 0 l-14 14 a16 16 0 0 0 23 23 l6 -6" />
		</svg>
	),
	aviao: (s: number, cor: string) => (
		<svg width={s} height={s} viewBox="0 0 100 100">
			<path d="M8 46 L92 10 L66 90 L48 60 Z" fill={cor} />
			<path d="M48 60 L92 10" stroke="rgba(0,0,0,0.25)" strokeWidth={4} />
		</svg>
	),
	sino: (s: number, cor: string) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
			<path d="M24 70 V46 a26 26 0 0 1 52 0 V70 l7 8 H17 Z" />
			<path d="M42 88 h16" />
		</svg>
	),
	secador: (s: number, cor: string) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 30 a20 20 0 0 1 20 -20 H70 l16 8 v24 l-16 8 H52 l-8 40 H30 l6 -40 a20 20 0 0 1 -22 -20 z" />
			<circle cx={34} cy={30} r={7} />
		</svg>
	),
	navalha: (s: number, cor: string) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 62 L58 16 a10 10 0 0 1 14 0 l6 6 L36 64 Z" />
			<path d="M36 64 L58 86 a8 8 0 0 0 12 -12 L48 52" />
		</svg>
	),
	brilho: (s: number, cor: string) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill={cor}>
			<path d="M50 6 C54 34 66 46 94 50 C66 54 54 66 50 94 C46 66 34 54 6 50 C34 46 46 34 50 6 Z" />
			<path d="M80 8 C81 16 84 19 92 20 C84 21 81 24 80 32 C79 24 76 21 68 20 C76 19 79 16 80 8 Z" />
		</svg>
	),
};
