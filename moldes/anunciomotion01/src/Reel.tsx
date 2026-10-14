import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, staticFile} from 'remotion';
import {C, DURACAO, E, FPS, T, pare, tw, useT} from './tema';
import {Texto} from './texto';
import * as S from './cenas';

/**
 * Vitrine no anunciomotion01. Câmera viva e transições do modelo (anunciomotion01.md §6): corte seco com batida de zoom (escuro <-> claro), borrão (a cena incha e borra, a
 * próxima nasce do borrão) e íris (círculo abre do centro com anel na cor da marca). Cenas e tempos em src/tempos.json.
 */
export type Props = {previas: boolean; nomesPrevias: [string, string]; musica: boolean; efeitos: boolean};

const TB = 0.22; // borrão
const TI = 0.42; // íris
const CENAS = T.cenas.map((c) => ({...c, de: c.de_q / FPS, ate: c.ate_q / FPS}));
/* as telas são os exports S<n> de src/cenas.tsx: tela nova = export const S11: React.FC<TelaProps> = ... lá, e a cena "S11" no src/tempos.json */
const TELAS = Object.fromEntries(Object.entries(S).filter(([k]) => /^S\d+$/.test(k))) as Record<string, React.FC<S.TelaProps>>;
for (const c of T.cenas) if (!TELAS[c.id]) pare(`a cena "${c.id}" de src/tempos.json não está desenhada em src/cenas.tsx. Use uma de ${Object.keys(TELAS).join(', ')} ou desenhe a nova lá (export const ${c.id}).`);
/* som e prévias ligados pedem os arquivos: para logo, dizendo como fazer */
const ARQUIVOS = new Set(getStaticFiles().map((a) => a.name.replace(/\\/g, '/')));
const COMO: Record<string, string> = {
	'voz.wav': 'rode tools/novo-video.py com a gravação da narração',
	'trilha.wav': 'rode ../../.venv/Scripts/python.exe scripts/som.py (ou musica: false)',
	'efeitos.wav': 'rode ../../.venv/Scripts/python.exe scripts/som.py (ou efeitos: false)',
	'previa1.mp4': 'faça com tools/previa.py a partir de um vídeo seu pronto (da raiz: .venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 1, e depois 2) ou previas: false',
	'previa2.mp4': 'faça com tools/previa.py a partir de um vídeo seu pronto (da raiz: .venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 2) ou previas: false',
};
const precisa = (nome: string) => {
	if (!ARQUIVOS.has(nome)) pare(`falta public/${nome}: ${COMO[nome]}.`);
};
precisa('voz.wav');
type Cena = (typeof CENAS)[number];

const Camera: React.FC<{c: Cena; children: React.ReactNode}> = ({c, children}) => {
	const {t} = useT();
	const p = (t - c.de) / Math.max(0.5, c.ate - c.de);
	const s = 1 + 0.05 * p;
	const r = Math.sin((t - c.de) * 0.9 + c.de) * 0.5;
	return <AbsoluteFill style={{transform: `scale(${s}) rotate(${r}deg)`}}>{children}</AbsoluteFill>;
};

const Quadro: React.FC<{c: Cena; p: Props}> = ({c, p}) => {
	const Tela = TELAS[c.id];
	const vis = <Tela previas={p.previas} nomes={p.nomesPrevias} />;
	return (
		<Camera c={c}>
			{vis}
			<Texto cena={c.id} />
		</Camera>
	);
};

export const VitrineAnuncioMotion01: React.FC<Props> = (p) => {
	if (p.musica) precisa('trilha.wav');
	if (p.efeitos) precisa('efeitos.wav');
	if (p.previas && T.previas) (precisa('previa1.mp4'), precisa('previa2.mp4'));
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
			{/* fecho (opcional, "escurece" no src/tempos.json): vai ao preto nos últimos 0,4 s, depois da voz */}
			{T.escurece && <div style={{position: 'absolute', inset: 0, background: '#000', opacity: tw(t, DURACAO - 0.45, DURACAO - 0.05, 0, 1, E.inOut)}} />}
			<Audio src={staticFile('voz.wav')} />
			{p.musica && <Audio src={staticFile('trilha.wav')} />}
			{p.efeitos && <Audio src={staticFile('efeitos.wav')} />}
		</AbsoluteFill>
	);
};
