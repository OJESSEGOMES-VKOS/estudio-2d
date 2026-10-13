// Vitrine no youtubedark01 (família B, explicação ilustrada narrada, identidade escura). Tempos em src/tempos.json.
import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, staticFile, useCurrentFrame} from 'remotion';
import {Defs} from './Boneco';
import {E, T, tw} from './base';
import {CENAS, Fixo, Legenda, Previas} from './Cenas';
import {Grao} from './Grao';

export const FPS = 30;
export const DURACAO_Q = T.duracao_q;
export type Props = {previas: boolean; nomesPrevias: [string, string]; musica: boolean; efeitos: boolean};

/* o plano só usa cenas desenhadas em src/Cenas.tsx; o som e as prévias ligados pedem os arquivos (para logo, dizendo como fazer) */
const pare = (msg: string): never => {
	throw new Error(`\n\n[youtubedark01] ${msg}\n`);
};
for (const c of T.cenas) if (!CENAS[c.id]) pare(`a cena "${c.id}" de src/tempos.json não está desenhada em src/Cenas.tsx (CENAS). Desenhe-a ou use uma que existe: ${Object.keys(CENAS).join(', ')}.`);
const ARQUIVOS = new Set(getStaticFiles().map((a) => a.name.replace(/\\/g, '/')));
const COMO = {
	'voz.wav': 'rode tools/novo-video.py com a gravação da narração',
	'trilha.wav': 'rode ../../.venv/Scripts/python.exe scripts/som.py (ou musica: false)',
	'efeitos.wav': 'rode ../../.venv/Scripts/python.exe scripts/som.py (ou efeitos: false)',
	'previa1.mp4': 'faça com tools/previa.py a partir de um vídeo seu pronto (da raiz: .venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 1, e depois 2) ou previas: false',
	'previa2.mp4': 'faça com tools/previa.py a partir de um vídeo seu pronto (da raiz: .venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 2) ou previas: false',
};
const precisa = (nome: keyof typeof COMO) => {
	if (!ARQUIVOS.has(nome)) pare(`falta public/${nome}: ${COMO[nome]}.`);
};
precisa('voz.wav');

export const VitrineYoutubeDark01: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], musica = false, efeitos = false}) => {
	if (musica) precisa('trilha.wav');
	if (efeitos) precisa('efeitos.wav');
	if (previas && T.previas) (precisa('previa1.mp4'), precisa('previa2.mp4'));
	const f = useCurrentFrame();
	const c = T.cenas.find((k) => f >= k.de_q && f < k.ate_q) ?? T.cenas[T.cenas.length - 1];
	const Cena = CENAS[c.id];
	return (
		<AbsoluteFill style={{background: '#060606', overflow: 'hidden'}}>
			<Defs f={f} />
			<Cena f={f} />
			{previas && <Previas f={f} nomes={nomesPrevias} />}
			<Grao f={f} />
			<Fixo f={f} />
			<Legenda f={f} />
			{T.fade_q && <AbsoluteFill style={{background: '#000', opacity: tw(f, T.fade_q[0], T.fade_q[1], 0, 1, E.inOut)}} />}
			<Audio src={staticFile('voz.wav')} />
			{musica && <Audio src={staticFile('trilha.wav')} />}
			{efeitos && <Audio src={staticFile('efeitos.wav')} />}
		</AbsoluteFill>
	);
};
