import React from 'react';
import {C, lerp} from './base';

/**
 * Rig do personagem (corpo de feijão). Tudo é desenhado olhando para +x; dir=-1 espelha.
 * Origem = quadril (base do corpo). Altura do corpo: 352 (topo da cabeça em y=-330).
 * Braços e pernas são 2 segmentos resolvidos por IK a partir do alvo da mão/pé (coordenadas locais).
 */
type V = [number, number];
export type Olhos = 'normal' | 'cansado' | 'fechado' | 'baixo' | 'aberto';
export type Pose = {
	x: number;
	y: number;
	s?: number;
	rot?: number;
	dir?: 1 | -1;
	abre?: number; // 0 = perfil, 1 = de frente
	mT: V;
	mF: V;
	pT: V;
	pF: V;
	jT?: V; // preferência do cotovelo de trás
	jF?: V;
	kT?: V; // preferência do joelho
	kF?: V;
	olhos?: Olhos;
	sobr?: 'nada' | 'triste' | 'firme';
	boca?: 'reto' | 'triste' | 'o' | 'leve' | 'dentes' | 'nada';
	olhar?: V;
	rosto?: V;
	sq?: number;
};

const NUM: (keyof Pose)[] = ['x', 'y', 's', 'rot', 'abre', 'sq'];
const VEC: (keyof Pose)[] = ['mT', 'mF', 'pT', 'pF', 'jT', 'jF', 'kT', 'kF', 'olhar', 'rosto'];
const DEF: Partial<Pose> = {s: 1, rot: 0, dir: 1, abre: 0.3, sq: 1, olhar: [0, 0], rosto: [0, 0], jT: [-1, 0.5], jF: [-1, 0.5], kT: [1, 0], kF: [1, 0]};

/** mistura duas poses (k de 0 a 1); campos discretos trocam na metade */
export const mix = (a: Pose, b: Pose, k: number): Pose => {
	const r: any = {...a, ...(k > 0.5 ? b : a)};
	for (const n of NUM) r[n] = lerp((a[n] as number) ?? (DEF[n] as number), (b[n] as number) ?? (DEF[n] as number), k);
	for (const n of VEC) {
		const va = (a[n] as V) ?? (DEF[n] as V);
		const vb = (b[n] as V) ?? (DEF[n] as V);
		r[n] = [lerp(va[0], vb[0], k), lerp(va[1], vb[1], k)];
	}
	return r;
};

/** sequência de poses-chave: [[tempo, pose], ...] com easing entre elas */
export const anima = (t: number, keys: [number, Pose][], e: (x: number) => number = (x) => x * x * (3 - 2 * x)): Pose => {
	if (t <= keys[0][0]) return keys[0][1];
	for (let i = 0; i < keys.length - 1; i++) {
		const [t0, p0] = keys[i];
		const [t1, p1] = keys[i + 1];
		if (t < t1) return mix(p0, p1, e((t - t0) / (t1 - t0)));
	}
	return keys[keys.length - 1][1];
};

/** converte um ponto do mundo para as coordenadas locais da pose (para prender pés no chão) */
export const paraLocal = (p: Pose, w: V): V => {
	const s = p.s ?? 1;
	const dir = p.dir ?? 1;
	const sq = p.sq ?? 1;
	const a = (-(p.rot ?? 0) * Math.PI) / 180;
	const dx = w[0] - p.x;
	const dy = w[1] - p.y;
	return [(dx * Math.cos(a) - dy * Math.sin(a)) / (s * dir), (dx * Math.sin(a) + dy * Math.cos(a)) / (s * sq)];
};
export const paraMundo = (p: Pose, l: V): V => {
	const s = p.s ?? 1;
	const dir = p.dir ?? 1;
	const sq = p.sq ?? 1;
	const a = ((p.rot ?? 0) * Math.PI) / 180;
	const x = l[0] * s * dir;
	const y = l[1] * s * sq;
	return [p.x + x * Math.cos(a) - y * Math.sin(a), p.y + x * Math.sin(a) + y * Math.cos(a)];
};

function ik(S: V, T: V, L1: number, L2: number, pref: V): [V, V] {
	const dx = T[0] - S[0];
	const dy = T[1] - S[1];
	const d0 = Math.hypot(dx, dy) || 0.001;
	const d = Math.min(L1 + L2 - 0.5, Math.max(Math.abs(L1 - L2) + 0.5, d0));
	const a = Math.atan2(dy, dx);
	const A = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
	const cand = [a + A, a - A].map((g) => [S[0] + L1 * Math.cos(g), S[1] + L1 * Math.sin(g)] as V);
	const sc = (e: V) => (e[0] - S[0]) * pref[0] + (e[1] - S[1]) * pref[1];
	const El = sc(cand[0]) >= sc(cand[1]) ? cand[0] : cand[1];
	const hx = T[0] - El[0];
	const hy = T[1] - El[1];
	const hl = Math.hypot(hx, hy) || 1;
	return [El, [El[0] + (hx / hl) * L2, El[1] + (hy / hl) * L2]];
}

export const CORPO = 'M -78 -252 A 78 78 0 0 1 78 -252 C 78 -170 70 -90 66 -30 C 63 10 40 22 0 22 C -40 22 -63 10 -66 -30 C -70 -90 -78 -170 -78 -252 Z';
const LB = [92, 88];
const LP = [108, 100];
const WB = 28;
const WP = 34;

type Estilo = {sombra?: boolean; brilho?: boolean};

export const Boneco: React.FC<{
	p: Pose;
	t: number;
	id: string;
	sombra?: boolean;
	fala?: number;
	moletom?: boolean;
	piscar?: boolean;
	celular?: {luz: number; ang?: number; mao?: 'F' | 'T'};
	aura?: string;
	opacity?: number;
	respira?: number;
	pernasFrente?: boolean;
	plano?: string; // silhueta chapada (sombra no chão)
}> = ({p: p0, t, id, sombra, fala = 0, moletom, piscar = true, celular, aura, opacity = 1, respira = 1, pernasFrente, plano}) => {
	const p = {...DEF, ...p0} as Required<Pose>;
	const ab = p.abre;
	const br = 1 + 0.014 * respira * Math.sin(t * 2.3 + p.x * 0.01);
	const ombT: V = [-8 - 38 * ab, -150 * br];
	const ombF: V = [8 + 38 * ab, -150 * br];
	const quaT: V = [-12 - 14 * ab, -8];
	const quaF: V = [12 + 14 * ab, -8];
	const bT = ik(ombT, p.mT, LB[0], LB[1], p.jT);
	const bF = ik(ombF, p.mF, LB[0], LB[1], p.jF);
	const lT = ik(quaT, p.pT, LP[0], LP[1], p.kT);
	const lF = ik(quaF, p.pF, LP[0], LP[1], p.kF);

	// piscada: a cada ~3,2 s, 4 quadros
	const ph = (t + (p.x % 7) * 0.37) % 3.2;
	const pis = piscar && ph < 0.13 ? 1 - Math.abs(ph - 0.065) / 0.065 : 0;
	const fc: V = [16 * (1 - ab) + p.rosto[0], -252 + p.rosto[1]];

	const membro = (S: V, [El, Hh]: [V, V], w: number, cor: string, linha: string, lw: number, key: string, pe?: boolean) => {
		const d = `M ${S[0]} ${S[1]} L ${El[0]} ${El[1]} L ${Hh[0]} ${Hh[1]}`;
		return (
			<g key={key}>
				<path d={d} stroke={linha} strokeWidth={w + lw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				{pe ? <ellipse cx={Hh[0] + 12} cy={Hh[1] + 4} rx={24 + lw / 2} ry={15 + lw / 2} fill={linha} /> : null}
				<path d={d} stroke={cor} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				{pe ? <ellipse cx={Hh[0] + 12} cy={Hh[1] + 4} rx={24} ry={15} fill={cor} /> : null}
			</g>
		);
	};

	const corpo = (st: Estilo) => {
		const preto = '#030303';
		const lin = st.sombra ? C.verm : C.traco;
		const lw = st.sombra ? 8 : 9;
		const pele = st.brilho ? C.verm : st.sombra ? preto : C.pele;
		const pele2 = st.brilho ? C.verm : st.sombra ? preto : C.pele2;
		const linM = st.brilho ? C.verm : lin;
		const braco = (S: V, b: [V, V], k: string, tras: boolean) => {
			if (moletom && !st.sombra) {
				const cor = tras ? C.moletom2 : C.moletom;
				return (
					<g key={k}>
						{membro(S, b, WB + 2, cor, linM, lw, k + 'm')}
						<circle cx={b[1][0]} cy={b[1][1]} r={WB * 0.55} fill={tras ? C.pele2 : C.pele} stroke={C.traco} strokeWidth={4.5} />
					</g>
				);
			}
			return membro(S, b, WB, tras ? pele2 : pele, linM, lw, k);
		};
		return (
			<g>
				{braco(ombT, bT, 'bt', true)}
				{pernasFrente ? null : membro(quaT, lT, WP, pele2, linM, lw, 'lt', true)}
				{pernasFrente ? null : membro(quaF, lF, WP, pele, linM, lw, 'lf', true)}
				<g transform={`scale(${1 / Math.sqrt(br)} ${br})`}>
					<path d={CORPO} fill={st.sombra || st.brilho ? pele : `url(#corpoGrad)`} stroke={linM} strokeWidth={st.sombra ? 5 : 5.5} />
					{moletom && !st.sombra ? (
						<g>
							<clipPath id={`clip-${id}`}>
								<path d={CORPO} />
							</clipPath>
							<g clipPath={`url(#clip-${id})`}>
								<rect x={-90} y={-176} width={180} height={220} fill={C.moletom} />
								<path d="M -90 -176 L -40 -176 L -55 40 L -90 40 Z" fill={C.moletom2} opacity={0.55} />
								<path d="M -74 -182 Q 0 -150 74 -182" stroke={C.moletom2} strokeWidth={14} fill="none" />
								<path d="M -10 -80 L 52 -80 L 60 -28 L -16 -28 Z" stroke={C.moletom2} strokeWidth={5} fill="none" strokeLinejoin="round" />
								<path d="M 14 -168 L 10 -122 M 34 -166 L 32 -124" stroke={C.branco} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
							</g>
							<path d={CORPO} fill="none" stroke={C.traco} strokeWidth={5.5} />
						</g>
					) : null}
					{st.brilho ? null : st.sombra ? rostoSombra() : rosto()}
				</g>
				{pernasFrente ? membro(quaT, lT, WP, pele2, linM, lw, 'lt', true) : null}
				{pernasFrente ? membro(quaF, lF, WP, pele, linM, lw, 'lf', true) : null}
				{braco(ombF, bF, 'bf', false)}
			</g>
		);
	};

	const rosto = () => {
		const [ox, oy] = p.olhar;
		const olho = (cx: number) => {
			const x = fc[0] + cx + ox * 5;
			const y = fc[1] - 6 + oy * 4;
			const tipo = p.olhos;
			if (tipo === 'fechado' || pis > 0.75)
				return <path d={`M ${x - 9} ${y - 1} Q ${x} ${y + 6} ${x + 9} ${y - 1}`} stroke={C.traco} strokeWidth={4} fill="none" strokeLinecap="round" />;
			if (tipo === 'cansado' || tipo === 'baixo') {
				const yy = tipo === 'baixo' ? y + 3 : y;
				return (
					<g>
						<path d={`M ${x - 7.5} ${yy} A 7.5 7.5 0 0 0 ${x + 7.5} ${yy} Z`} fill={C.traco} />
						<path d={`M ${x - 11} ${yy} L ${x + 11} ${yy}`} stroke={C.traco} strokeWidth={3.6} strokeLinecap="round" />
					</g>
				);
			}
			const r = tipo === 'aberto' ? 8 : 6.5;
			return <ellipse cx={x} cy={y} rx={r} ry={Math.max(1.2, (r + 2) * (1 - pis))} fill={C.traco} />;
		};
		const sob = () => {
			const x = fc[0];
			const y = fc[1];
			if (p.sobr === 'triste')
				return <path d={`M ${x - 38} ${y - 20} L ${x - 14} ${y - 28} M ${x + 14} ${y - 28} L ${x + 38} ${y - 20}`} stroke={C.traco} strokeWidth={4} strokeLinecap="round" />;
			if (p.sobr === 'firme')
				return <path d={`M ${x - 38} ${y - 30} L ${x - 13} ${y - 19} M ${x + 13} ${y - 19} L ${x + 38} ${y - 30}`} stroke={C.traco} strokeWidth={5} strokeLinecap="round" />;
			return null;
		};
		const boca = () => {
			const x = fc[0] + ox * 3;
			const y = fc[1] + 30;
			switch (p.boca) {
				case 'triste':
					return <path d={`M ${x - 10} ${y + 4} Q ${x} ${y - 4} ${x + 10} ${y + 4}`} stroke={C.traco} strokeWidth={3.6} fill="none" strokeLinecap="round" />;
				case 'leve':
					return <path d={`M ${x - 10} ${y - 2} Q ${x} ${y + 6} ${x + 10} ${y - 2}`} stroke={C.traco} strokeWidth={3.6} fill="none" strokeLinecap="round" />;
				case 'o':
					return <ellipse cx={x + 4} cy={y} rx={6} ry={7.5} fill={C.traco} />;
				case 'dentes':
					return (
						<g>
							<rect x={x - 16} y={y - 7} width={32} height={15} rx={5} fill="#fff" stroke={C.traco} strokeWidth={3.5} />
							<path d={`M ${x - 16} ${y + 0.5} L ${x + 16} ${y + 0.5} M ${x - 6} ${y - 7} L ${x - 6} ${y + 8} M ${x + 5} ${y - 7} L ${x + 5} ${y + 8}`} stroke={C.traco} strokeWidth={2.4} />
						</g>
					);
				case 'nada':
					return null;
				default:
					return <path d={`M ${x - 8} ${y} L ${x + 8} ${y}`} stroke={C.traco} strokeWidth={3.6} strokeLinecap="round" />;
			}
		};
		return (
			<g>
				{olho(-24)}
				{olho(24)}
				{sob()}
				{boca()}
			</g>
		);
	};

	const rostoSombra = () => {
		const x = fc[0];
		const y = fc[1] - 6;
		const a = 3 + fala * 9;
		return (
			<g filter="url(#brilhoOlho)">
				<path d={`M ${x - 40} ${y - 8} Q ${x - 25} ${y + 3} ${x - 9} ${y - 4}`} stroke={C.verm} strokeWidth={6} fill="none" strokeLinecap="round" />
				<path d={`M ${x + 9} ${y - 4} Q ${x + 25} ${y + 3} ${x + 40} ${y - 8}`} stroke={C.verm} strokeWidth={6} fill="none" strokeLinecap="round" />
				<path d={`M ${x - 17} ${y + 30} Q ${x} ${y + 36 + a} ${x + 17} ${y + 30} Q ${x} ${y + 36} ${x - 17} ${y + 30} Z`} fill={C.verm} stroke={C.verm} strokeWidth={2.5} strokeLinejoin="round" />
			</g>
		);
	};

	// celular na mão
	const cel = () => {
		if (!celular) return null;
		const m = celular.mao === 'T' ? bT[1] : bF[1];
		const ang = celular.ang ?? -10;
		return (
			<g transform={`translate(${m[0] + 4} ${m[1] - 18}) rotate(${ang})`}>
				<rect x={-17} y={-30} width={34} height={60} rx={7} fill="#15171c" stroke={C.traco} strokeWidth={4} />
				<rect x={-12.5} y={-25} width={25} height={48} rx={3} fill={C.tela} opacity={0.25 + 0.75 * celular.luz} />
				<circle cx={0} cy={0} r={190} fill="url(#luzTela)" opacity={celular.luz} style={{mixBlendMode: 'screen'}} />
			</g>
		);
	};

	const tr = `translate(${p.x} ${p.y}) rotate(${p.rot}) scale(${p.s * p.dir} ${p.s * p.sq})`;
	if (plano) {
		const seg = (S: V, b: [V, V], w: number) => <path d={`M ${S[0]} ${S[1]} L ${b[0][0]} ${b[0][1]} L ${b[1][0]} ${b[1][1]}`} stroke={plano} strokeWidth={w + 8} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
		return (
			<g opacity={opacity} transform={tr}>
				{seg(ombT, bT, WB)}
				{seg(quaT, lT, WP)}
				{seg(quaF, lF, WP)}
				<path d={CORPO} fill={plano} stroke={plano} strokeWidth={6} />
				{seg(ombF, bF, WB)}
			</g>
		);
	}
	if (sombra) {
		return (
			<g opacity={opacity} filter="url(#ferve)">
				<g transform={tr}>
					<g filter="url(#halo)" opacity={0.9}>
						{corpo({sombra: true, brilho: true})}
					</g>
					{corpo({sombra: true})}
				</g>
			</g>
		);
	}
	return (
		<g opacity={opacity} style={aura ? {filter: `drop-shadow(0 0 22px ${aura})`} : undefined}>
			<g transform={tr}>
				{corpo({})}
				{cel()}
			</g>
		</g>
	);
};

/** defs globais (gradientes e filtros) — vão uma vez no topo do filme */
export const Defs: React.FC<{f: number}> = ({f}) => (
	<svg width={0} height={0} style={{position: 'absolute'}}>
		<defs>
			<linearGradient id="corpoGrad" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stopColor={C.pele2} />
				<stop offset="42%" stopColor={C.pele} />
				<stop offset="100%" stopColor="#F6F1E6" />
			</linearGradient>
			<radialGradient id="luzTela">
				<stop offset="0%" stopColor="#7cc2ff" stopOpacity={0.55} />
				<stop offset="45%" stopColor="#4e93e6" stopOpacity={0.2} />
				<stop offset="100%" stopColor="#2c5fb0" stopOpacity={0} />
			</radialGradient>
			<filter id="halo" x="-40%" y="-40%" width="180%" height="180%">
				<feGaussianBlur stdDeviation={16} result="b" />
				<feMerge>
					<feMergeNode in="b" />
					<feMergeNode in="b" />
				</feMerge>
			</filter>
			<filter id="brilhoOlho" x="-50%" y="-50%" width="200%" height="200%">
				<feGaussianBlur stdDeviation={5} result="b" />
				<feMerge>
					<feMergeNode in="b" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
			<filter id="ferve" x="-20%" y="-20%" width="140%" height="140%">
				<feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={Math.floor(f / 3)} result="n" />
				<feDisplacementMap in="SourceGraphic" in2="n" scale={14} xChannelSelector="R" yChannelSelector="G" />
			</filter>
			<filter id="desfoque" x="-50%" y="-50%" width="200%" height="200%">
				<feGaussianBlur stdDeviation={28} />
			</filter>
			<filter id="desfoque2" x="-50%" y="-50%" width="200%" height="200%">
				<feGaussianBlur stdDeviation={8} />
			</filter>
		</defs>
	</svg>
);
