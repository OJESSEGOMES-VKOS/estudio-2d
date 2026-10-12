import React from 'react';
import {C, NEON_OURO, NEON_VERDE} from './base';

/** Objetos da família B desenhados em giz (traço claro sobre o preto), verde neon no objeto-chave, ouro na luz. */
export type Estado = 'apagado' | 'giz' | 'verde' | 'ouro';
const corDe = (e: Estado) => (e === 'verde' ? C.verde : e === 'ouro' ? C.ouro : e === 'giz' ? C.giz : C.apagado);
const fundoDe = (e: Estado) => (e === 'verde' ? '#04150c' : e === 'ouro' ? '#171104' : e === 'giz' ? '#121317' : '#0c0d10');
const filtroDe = (e: Estado) => (e === 'verde' ? NEON_VERDE : e === 'ouro' ? NEON_OURO : undefined);

/** cartão vertical (9:16) com um "jeito de editar" abstrato dentro: nenhum vídeo real, nenhuma marca */
export const Cartao: React.FC<{x: number; y: number; w: number; tipo: 'leg' | 'divide' | 'grade' | 'onda' | 'play'; estado: Estado; rot?: number}> = ({x, y, w, tipo, estado, rot = 0}) => {
	const h = (w * 16) / 9;
	const c = corDe(estado);
	const lw = Math.max(3, w * 0.022);
	const k = w / 100; // desenho interno numa caixa de 100 x 178
	const dentro = () => {
		switch (tipo) {
			case 'leg':
				return (
					<g>
						<circle cx={50} cy={62} r={15} fill="none" stroke={c} strokeWidth={lw / k} />
						<path d="M 22 112 Q 50 80 78 112" fill="none" stroke={c} strokeWidth={lw / k} strokeLinecap="round" />
						<rect x={18} y={128} width={64} height={8} rx={4} fill={c} />
						<rect x={28} y={142} width={44} height={8} rx={4} fill={c} />
					</g>
				);
			case 'divide':
				return (
					<g>
						<rect x={12} y={14} width={76} height={70} rx={6} fill="none" stroke={c} strokeWidth={lw / k} />
						<path d="M 26 70 L 42 46 L 54 60 L 64 50 L 76 70 Z" fill={c} opacity={0.8} />
						<circle cx={50} cy={124} r={14} fill="none" stroke={c} strokeWidth={lw / k} />
						<path d="M 26 166 Q 50 136 74 166" fill="none" stroke={c} strokeWidth={lw / k} strokeLinecap="round" />
					</g>
				);
			case 'grade':
				return (
					<g>
						{[0, 1].map((i) =>
							[0, 1, 2].map((j) => <rect key={`${i}${j}`} x={14 + i * 38} y={16 + j * 50} width={34} height={44} rx={5} fill={(i + j) % 2 ? c : 'none'} opacity={(i + j) % 2 ? 0.75 : 1} stroke={c} strokeWidth={lw / k} />),
						)}
					</g>
				);
			case 'onda':
				return (
					<g>
						{Array.from({length: 11}).map((_, i) => {
							const a = 10 + 34 * Math.abs(Math.sin(i * 1.7 + 0.6));
							return <rect key={i} x={12 + i * 7} y={89 - a / 2} width={4} height={a} rx={2} fill={c} />;
						})}
						<rect x={18} y={140} width={64} height={8} rx={4} fill={c} />
					</g>
				);
			default:
				return (
					<g>
						<circle cx={50} cy={84} r={26} fill="none" stroke={c} strokeWidth={lw / k} />
						<path d="M 43 70 L 63 84 L 43 98 Z" fill={c} />
						<rect x={14} y={150} width={72} height={6} rx={3} fill={c} opacity={0.5} />
						<rect x={14} y={150} width={44} height={6} rx={3} fill={c} />
					</g>
				);
		}
	};
	return (
		<g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`} style={{filter: filtroDe(estado)}}>
			<rect x={x} y={y} width={w} height={h} rx={w * 0.08} fill={fundoDe(estado)} stroke={c} strokeWidth={lw} />
			<g transform={`translate(${x} ${y}) scale(${k})`}>{dentro()}</g>
		</g>
	);
};

/** ícones de "tipo de vídeo" em linha de giz, numa caixa de 100 x 100 centrada em (x, y) */
export const Icone: React.FC<{x: number; y: number; s: number; tipo: 'mic' | 'camera' | 'claquete' | 'celular'; cor?: string; rot?: number}> = ({x, y, s, tipo, cor = C.giz, rot = 0}) => {
	const st = {fill: 'none', stroke: cor, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	const d = () => {
		switch (tipo) {
			case 'mic':
				return (
					<g>
						<rect x={36} y={8} width={28} height={50} rx={14} {...st} />
						<path d="M 24 44 Q 24 74 50 74 Q 76 74 76 44 M 50 74 L 50 92 M 34 92 L 66 92" {...st} />
					</g>
				);
			case 'camera':
				return (
					<g>
						<rect x={6} y={30} width={62} height={44} rx={8} {...st} />
						<path d="M 68 44 L 94 30 L 94 74 L 68 60 Z" {...st} />
						<circle cx={24} cy={20} r={10} {...st} />
						<circle cx={50} cy={18} r={12} {...st} />
					</g>
				);
			case 'claquete':
				return (
					<g>
						<rect x={10} y={40} width={80} height={50} rx={6} {...st} />
						<path d="M 10 40 L 84 18 M 26 35 L 34 23 M 46 29 L 54 17 M 66 23 L 74 12" {...st} />
					</g>
				);
			default:
				return (
					<g>
						<rect x={28} y={6} width={44} height={88} rx={9} {...st} />
						<path d="M 44 16 L 56 16 M 44 84 L 56 84" {...st} />
						<path d="M 44 40 L 60 50 L 44 60 Z" fill={cor} />
					</g>
				);
		}
	};
	return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s / 100}) translate(-50 -50)`}>{d()}</g>;
};

/** três setas de avanço (o "acelerado") */
export const Avanco: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} style={{filter: NEON_VERDE}}>
		{[0, 1, 2].map((i) => (
			<path key={i} d={`M ${i * 44} -34 L ${i * 44 + 38} 0 L ${i * 44} 34 Z`} fill={C.verde} opacity={0.6 + 0.2 * i} />
		))}
	</g>
);

/** cadeira de lado, assento na altura y, encosto atrás (x0 = fundo do assento) */
export const Cadeira: React.FC<{x0: number; x1: number; y: number; chao: number}> = ({x0, x1, y, chao}) => (
	<g>
		<rect x={x0} y={y - 210} width={16} height={210} rx={6} fill={C.movel} stroke={C.movelLinha} strokeWidth={3.5} />
		<rect x={x0} y={y} width={x1 - x0} height={18} rx={6} fill={C.movel} stroke={C.movelLinha} strokeWidth={3.5} />
		<rect x={x0 + 8} y={y + 18} width={12} height={chao - y - 18} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
		<rect x={x1 - 22} y={y + 18} width={12} height={chao - y - 18} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
	</g>
);
