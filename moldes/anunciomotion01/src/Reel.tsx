import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {C, DURACAO, E, FPS, T, tw, useT} from './tema';
import {Texto} from './texto';
import * as S from './cenas';

/**
 * Vitrine no anunciomotion01. Câmera viva e transições do anúncio aprovado do Marcaí (Anuncio.tsx dele, MODELO §5): corte seco com batida de zoom (escuro <-> claro), borrão (a cena incha e borra, a
 * próxima nasce do borrão) e íris (círculo abre do centro com anel na cor da marca). Cenas e tempos em src/tempos.json.
 */
export type Props = {previas: boolean; nomesPrevias: [string, string]; musica: boolean; efeitos: boolean};

const TB = 0.22; // borrão
const TI = 0.42; // íris
const CENAS = T.cenas.map((c) => ({...c, de: c.de_q / FPS, ate: c.ate_q / FPS}));
type Cena = (typeof CENAS)[number];

const Camera: React.FC<{c: Cena; children: React.ReactNode}> = ({c, children}) => {
	const {t} = useT();
	const p = (t - c.de) / Math.max(0.5, c.ate - c.de);
	const s = 1 + 0.05 * p;
	const r = Math.sin((t - c.de) * 0.9 + c.de) * 0.5;
	return <AbsoluteFill style={{transform: `scale(${s}) rotate(${r}deg)`}}>{children}</AbsoluteFill>;
};

const Quadro: React.FC<{c: Cena; p: Props}> = ({c, p}) => {
	const vis = (() => {
		switch (c.id) {
			case 'S1': return <S.S1 />;
			case 'S2': return <S.S2 />;
			case 'S3': return <S.S3 />;
			case 'S4': return <S.S4 />;
			case 'S5': return <S.S5 />;
			case 'S6': return <S.S6 />;
			case 'S7': return <S.S7 previas={p.previas} nomes={p.nomesPrevias} />;
			case 'S8': return <S.S8 />;
			case 'S9': return <S.S9 />;
			default: return <S.S10 />;
		}
	})();
	return (
		<Camera c={c}>
			{vis}
			<Texto cena={c.id} />
		</Camera>
	);
};

export const VitrineAnuncioMotion01: React.FC<Props> = (p) => {
	const {t} = useT();
	let i = CENAS.findIndex((c) => t >= c.de && t < c.ate);
	if (i < 0) i = CENAS.length - 1;
	const c = CENAS[i];
	const ant = i > 0 ? CENAS[i - 1] : null;
	const dt = t - c.de;
	let camada: React.ReactNode;
	if (ant && c.entrada === 'borrao' && dt < TB) {
		const k = tw(dt, 0, TB, 0, 1, E.inOut);
		camada = (
			<>
				<AbsoluteFill style={{transform: `scale(${1 + 0.25 * k})`, filter: `blur(${k * 40}px)`, opacity: 1 - k}}>
					<Quadro c={ant} p={p} />
				</AbsoluteFill>
				<AbsoluteFill style={{transform: `scale(${1.18 - 0.18 * k})`, filter: `blur(${(1 - k) * 40}px)`, opacity: k}}>
					<Quadro c={c} p={p} />
				</AbsoluteFill>
			</>
		);
	} else if (ant && c.entrada === 'iris' && dt < TI) {
		const r = tw(dt, 0, TI, 0, 1250, E.inOut);
		camada = (
			<>
				<AbsoluteFill style={{transform: `scale(${1 + dt * 0.4})`, filter: `blur(${dt * 30}px)`}}>
					<Quadro c={ant} p={p} />
				</AbsoluteFill>
				<AbsoluteFill style={{clipPath: `circle(${r}px at 540px 960px)`}}>
					<Quadro c={c} p={p} />
				</AbsoluteFill>
				<div style={{position: 'absolute', left: 540 - r, top: 960 - r, width: 2 * r, height: 2 * r, borderRadius: '50%', border: `${10 + 18 * (1 - r / 1250)}px solid ${C.vClaro}`, boxSizing: 'border-box', boxShadow: `0 0 60px ${C.v}, inset 0 0 60px ${C.v}`}} />
			</>
		);
	} else {
		const bate = c.entrada === 'corte' && i > 0 ? tw(dt, 0, 0.12, 1.035, 1) : 1;
		camada = (
			<AbsoluteFill style={{transform: `scale(${bate})`}}>
				<Quadro c={c} p={p} />
			</AbsoluteFill>
		);
	}
	return (
		<AbsoluteFill style={{background: C.preto, overflow: 'hidden'}}>
			{camada}
			{/* fecho: vai ao preto nos últimos 0,4 s, depois da voz */}
			<div style={{position: 'absolute', inset: 0, background: '#000', opacity: tw(t, DURACAO - 0.45, DURACAO - 0.05, 0, 1, E.inOut)}} />
			<Audio src={staticFile('voz.wav')} />
			{p.musica && <Audio src={staticFile('trilha.wav')} />}
			{p.efeitos && <Audio src={staticFile('efeitos.wav')} />}
		</AbsoluteFill>
	);
};
