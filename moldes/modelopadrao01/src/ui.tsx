import React from 'react';
import {C, DIVISA, E, SOMBRA, fundoClaro, tw, useT} from './tema';

export const Check: React.FC<{size?: number; cor?: string}> = ({size = 28, cor = C.tinta}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
		<path d="M5 12.5l4.5 4.5L19 7.5" />
	</svg>
);

export const Bolinha: React.FC<{size?: number}> = ({size = 44}) => (
	<div style={{width: size, height: size, flex: 'none', borderRadius: size / 2, background: C.menta, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<Check size={size * 0.62} />
	</div>
);

/** o asterisco laranja que marca o Claude (o agente que edita), sem copiar logotipo */
export const Faisca: React.FC<{size?: number}> = ({size = 34}) => (
	<svg width={size} height={size} viewBox="0 0 24 24">
		{[0, 30, 60, 90, 120, 150].map((a) => (
			<rect key={a} x={11} y={2} width={2.4} height={20} rx={1.2} fill={C.claude} transform={`rotate(${a} 12.2 12)`} />
		))}
	</svg>
);

/**
 * painel claro de cima da tela dividida: desce na entrada, sobe na saída (a saída começa no `ate`).
 * `funde`: quando vem direto do editor (mesmo fundo marfim), aparece no lugar em vez de descer.
 */
export const Painel: React.FC<{de: number; ate: number; funde?: boolean; children: React.ReactNode}> = ({de, ate, funde = false, children}) => {
	const {t} = useT();
	if (t < de - 0.01 || t > ate + 0.45) return null;
	const entra = tw(t, de, de + 0.4, 0, 1, E.inOut);
	const sai = tw(t, ate, ate + 0.4, 0, 1, E.inOut);
	const y = funde ? -sai * DIVISA : (Math.min(entra, 1 - sai) - 1) * DIVISA;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: DIVISA, overflow: 'hidden', ...fundoClaro, opacity: funde ? Math.min(1, entra * 3) : 1, transform: `translateY(${y}px)`}}>
			{children}
		</div>
	);
};

/** a coluna livre ao lado do rosto (parede à esquerda, altura dos olhos) */
export const Coluna: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 470}) => (
	<div style={{position: 'absolute', left: 96, top, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14}}>{children}</div>
);

export const Etiqueta: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({p, children, style}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 12,
			padding: '10px 22px 12px 14px',
			borderRadius: 40,
			background: C.papel,
			color: C.tinta,
			fontWeight: 700,
			boxShadow: SOMBRA,
			opacity: Math.min(1, p * 2),
			transform: `scale(${0.85 + 0.15 * p})`,
			...style,
		}}
	>
		{children}
	</div>
);
