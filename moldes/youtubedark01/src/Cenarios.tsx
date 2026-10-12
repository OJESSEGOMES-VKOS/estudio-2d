import React from 'react';
import {C, FONTE, lerp, rnd} from './base';

/** câmera: escala em torno de um ponto de foco (fx, fy) que vai para o centro + deslocamento */
export const cam = (s: number, fx = 540, fy = 960, dx = 0, dy = 0) => `translate(${540 + dx} ${960 + dy}) scale(${s}) translate(${-fx} ${-fy})`;

export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
	<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
		{children}
	</svg>
);

export const Parede: React.FC<{chao: number; topo?: string; base?: string; id: string}> = ({chao, topo = '#16171c', base = '#0c0c0e', id}) => (
	<g>
		<defs>
			<linearGradient id={`par-${id}`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor={topo} />
				<stop offset="100%" stopColor={base} />
			</linearGradient>
		</defs>
		<rect x={-600} y={-600} width={2280} height={chao + 600} fill={`url(#par-${id})`} />
		<rect x={-600} y={chao} width={2280} height={1400} fill="#08080a" />
		<line x1={-600} x2={1680} y1={chao} y2={chao} stroke={C.chao} strokeWidth={3} />
	</g>
);

export const Janela: React.FC<{x: number; y: number; w: number; h: number; ceu?: [string, string]; lua?: number; alvorada?: number; id: string}> = ({x, y, w, h, ceu = ['#1b2640', '#111829'], lua = 1, alvorada = 0, id}) => (
	<g>
		<defs>
			<linearGradient id={`ceu-${id}`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor={ceu[0]} />
				<stop offset="100%" stopColor={ceu[1]} />
			</linearGradient>
		</defs>
		<rect x={x} y={y} width={w} height={h} rx={8} fill={`url(#ceu-${id})`} />
		{alvorada > 0 ? <rect x={x} y={y + h * 0.55} width={w} height={h * 0.45} fill="#e8874f" opacity={alvorada * 0.55} /> : null}
		{[0, 1, 2, 3, 4].map((i) => (
			<circle key={i} cx={x + w * (0.15 + 0.17 * i)} cy={y + h * (0.2 + 0.5 * rnd(i + 3))} r={2} fill="#cfd6e6" opacity={0.5 * (1 - alvorada)} />
		))}
		{lua > 0 ? (
			<g opacity={lua}>
				<circle cx={x + w * 0.68} cy={y + h * 0.3} r={w * 0.28} fill={C.lua} opacity={0.12} filter="url(#desfoque2)" />
				<circle cx={x + w * 0.68} cy={y + h * 0.3} r={w * 0.11} fill={C.lua} />
			</g>
		) : null}
		<rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke="#3d424e" strokeWidth={11} />
		<line x1={x + w / 2} x2={x + w / 2} y1={y} y2={y + h} stroke="#3d424e" strokeWidth={8} />
		<line x1={x} x2={x + w} y1={y + h / 2} y2={y + h / 2} stroke="#3d424e" strokeWidth={8} />
	</g>
);

export const Led: React.FC<{x: number; y: number; txt: string; s?: number}> = ({x, y, txt, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<rect x={-58} y={-30} width={116} height={60} rx={12} fill="#141416" stroke="#4d505a" strokeWidth={4} />
		<text x={0} y={13} textAnchor="middle" fontFamily="Consolas, monospace" fontWeight={700} fontSize={36} fill={C.led} filter="url(#brilhoOlho)" letterSpacing={1}>
			{txt}
		</text>
	</g>
);

/** cama vista de lado: cabeceira em x0, colchão até fora da tela */
export const Cama: React.FC<{x0: number; topo: number; chao: number}> = ({x0, topo, chao}) => (
	<g>
		<rect x={x0} y={topo - 175} width={34} height={chao - topo + 175} rx={12} fill={C.movel} stroke={C.movelLinha} strokeWidth={4} />
		<rect x={x0 + 20} y={topo} width={800} height={95} rx={20} fill="#383a44" stroke={C.movelLinha} strokeWidth={4} />
		<rect x={x0 + 20} y={topo + 95} width={800} height={42} rx={8} fill={C.movel} stroke={C.movelLinha} strokeWidth={4} />
		<rect x={x0 + 60} y={topo + 137} width={14} height={chao - topo - 137} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
	</g>
);

export const Travesseiro: React.FC<{x: number; y: number}> = ({x, y}) => <rect x={x} y={y} width={150} height={56} rx={28} fill="#4a5068" stroke={C.cobertaLinha} strokeWidth={4} />;

export const Coberta: React.FC<{d: string; dobras?: string}> = ({d, dobras}) => (
	<g>
		<path d={d} fill={C.coberta} stroke={C.cobertaLinha} strokeWidth={4.5} strokeLinejoin="round" />
		{dobras ? <path d={dobras} fill="none" stroke={C.cobertaLinha} strokeWidth={3.5} strokeLinecap="round" opacity={0.8} /> : null}
	</g>
);

export const CriadoMudo: React.FC<{x: number; y: number; w: number; chao: number}> = ({x, y, w, chao}) => (
	<g>
		<rect x={x} y={y} width={w} height={chao - y} rx={12} fill={C.movel} stroke={C.movelLinha} strokeWidth={4} />
		<line x1={x + 10} x2={x + w - 10} y1={y + (chao - y) * 0.45} y2={y + (chao - y) * 0.45} stroke={C.movelLinha} strokeWidth={3} />
		<circle cx={x + w / 2} cy={y + (chao - y) * 0.25} r={5} fill={C.movelLinha} />
	</g>
);

/** escrivaninha: tampo + pés */
export const Mesa: React.FC<{x0: number; x1: number; topo: number; chao: number}> = ({x0, x1, topo, chao}) => (
	<g>
		<rect x={x0 + 18} y={topo + 18} width={14} height={chao - topo - 18} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
		<rect x={x1 - 32} y={topo + 18} width={14} height={chao - topo - 18} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
		<rect x={x0} y={topo} width={x1 - x0} height={20} rx={5} fill={C.movel} stroke={C.movelLinha} strokeWidth={4} />
	</g>
);

/** notebook de lado: dobradiça em (hx, hy); ang 0 = fechado, -100 = aberto */
export const Notebook: React.FC<{hx: number; hy: number; ang: number; tela: number; poeira?: number; sopro?: number}> = ({hx, hy, ang, tela, poeira = 0, sopro = 0}) => {
	const n = Math.round(poeira * 34);
	return (
		<g>
			<rect x={hx} y={hy} width={215} height={16} rx={4} fill="#34363d" stroke={C.movelLinha} strokeWidth={3.5} />
			<g transform={`translate(${hx + 4} ${hy}) rotate(${ang})`}>
				<rect x={0} y={-12} width={211} height={12} rx={4} fill="#2e3037" stroke={C.movelLinha} strokeWidth={3.5} />
				{tela > 0 ? <rect x={8} y={-2.5} width={195} height={4} fill={C.tela} opacity={tela} /> : null}
			</g>
			{Array.from({length: n}).map((_, i) => {
				const x0 = hx + 12 + rnd(i) * 190;
				const y0 = hy - 15 - rnd(i + 40) * 4;
				const vx = -260 - rnd(i + 7) * 380;
				const vy = -60 - rnd(i + 9) * 160;
				return <circle key={i} cx={x0 + vx * sopro} cy={y0 + vy * sopro + 200 * sopro * sopro} r={2.2 + rnd(i + 2) * 2.2} fill="#8d8c88" opacity={(0.75 - 0.2 * rnd(i)) * (1 - sopro)} />;
			})}
		</g>
	);
};

/** luminária de mesa apoiada em (bx, by) com a cúpula apontando pra esquerda-baixo */
export const Luminaria: React.FC<{bx: number; by: number; luz: number; cor: string}> = ({bx, by, luz, cor}) => (
	<g>
		<ellipse cx={bx} cy={by} rx={40} ry={9} fill={C.movel} stroke={C.movelLinha} strokeWidth={3.5} />
		<path d={`M ${bx} ${by - 6} L ${bx + 22} ${by - 168} L ${bx - 68} ${by - 226}`} stroke={C.movelLinha} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
		<circle cx={bx + 22} cy={by - 168} r={8} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
		<path d={`M ${bx - 46} ${by - 240} L ${bx - 96} ${by - 250} L ${bx - 136} ${by - 186} L ${bx - 56} ${by - 172} Z`} fill="#3a3c44" stroke={C.movelLinha} strokeWidth={4} strokeLinejoin="round" />
		{luz > 0 ? <ellipse cx={bx - 96} cy={by - 180} rx={32} ry={9} fill={cor} opacity={luz} /> : null}
	</g>
);

/** folhas de calendário voando (cobrem a troca de pose) */
export const Folhas: React.FC<{t: number; de: number; ate: number; dias: [string, number][]; seed: number}> = ({t, de, ate, dias, seed}) => {
	if (t < de || t > ate) return null;
	const n = dias.length;
	return (
		<g>
			{dias.map(([dia, num], i) => {
				const t0 = de + ((ate - de) * 0.45 * i) / Math.max(1, n - 1);
				const k = (t - t0) / ((ate - de) * 0.55);
				if (k < 0 || k > 1) return null;
				const r1 = rnd(i + seed);
				const r2 = rnd(i + seed + 50);
				const x = lerp(-260 + r1 * 300, 1300 - r2 * 200, k);
				const y = lerp(1500 + r2 * 300, 200 + r1 * 500, k) - Math.sin(k * Math.PI) * 260;
				const rot = -40 + r1 * 80 + k * (200 + 160 * r2) * (r1 > 0.5 ? 1 : -1);
				const flip = Math.cos(k * 9 + i) * 0.9;
				const s = 0.9 + r2 * 0.5;
				return (
					<g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * (0.35 + 0.65 * Math.abs(flip))} ${s})`}>
						<rect x={-115} y={-140} width={230} height={280} rx={8} fill="#cfcbc2" stroke="#7a776f" strokeWidth={3} />
						<rect x={-115} y={-140} width={230} height={62} rx={8} fill="#55565c" />
						<text x={0} y={-96} textAnchor="middle" fontFamily={FONTE} fontWeight={700} fontSize={38} fill="#eeeae2">
							{dia}
						</text>
						<text x={0} y={60} textAnchor="middle" fontFamily={FONTE} fontWeight={700} fontSize={120} fill="#2b2a28">
							{num}
						</text>
					</g>
				);
			})}
		</g>
	);
};

/** facho de luz volumétrico de cima (trapézio desfocado) */
export const Facho: React.FC<{cx: number; topo: number; base: number; w0: number; w1: number; op: number; cor?: string; id: string}> = ({cx, topo, base, w0, w1, op, cor = '#ffffff', id}) => (
	<g>
		<defs>
			<linearGradient id={`facho-${id}`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor={cor} stopOpacity={0.3 * op} />
				<stop offset="70%" stopColor={cor} stopOpacity={0.13 * op} />
				<stop offset="100%" stopColor={cor} stopOpacity={0.2 * op} />
			</linearGradient>
			<radialGradient id={`poca-${id}`}>
				<stop offset="0%" stopColor={cor} stopOpacity={0.42 * op} />
				<stop offset="100%" stopColor={cor} stopOpacity={0} />
			</radialGradient>
		</defs>
		<path d={`M ${cx - w0 / 2} ${topo} L ${cx + w0 / 2} ${topo} L ${cx + w1 / 2} ${base} L ${cx - w1 / 2} ${base} Z`} fill={`url(#facho-${id})`} filter="url(#desfoque2)" />
		<ellipse cx={cx} cy={base} rx={w1 * 0.62} ry={w1 * 0.1} fill={`url(#poca-${id})`} />
	</g>
);

/** partículas de poeira flutuando num retângulo */
export const Poeira: React.FC<{t: number; x: number; y: number; w: number; h: number; n: number; op?: number; cor?: string; seed?: number}> = ({t, x, y, w, h, n, op = 1, cor = '#fff', seed = 0}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const r = rnd(i + seed);
			const px = x + ((r * w + Math.sin(t * 0.4 + i) * 22) % w);
			const py = y + ((rnd(i + seed + 9) * h - t * (8 + 14 * r)) % h + h) % h;
			const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.8 + r) + i));
			return <circle key={i} cx={px} cy={py} r={1.4 + 2 * rnd(i + seed + 3)} fill={cor} opacity={op * tw * 0.7} />;
		})}
	</g>
);
