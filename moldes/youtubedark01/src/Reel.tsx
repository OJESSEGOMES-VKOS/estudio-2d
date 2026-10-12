// Vitrine no youtubedark01 (família B, explicação ilustrada narrada, identidade escura). Tempos em src/tempos.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Defs} from './Boneco';
import {E, T, tw} from './base';
import {CENAS, Fixo, Legenda, Previas} from './Cenas';
import {Grao} from './Grao';

export const FPS = 30;
export const DURACAO_Q = T.duracao_q;
export type Props = {previas: boolean; nomesPrevias: [string, string]; musica: boolean; efeitos: boolean};

export const VitrineYoutubeDark01: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], musica = false, efeitos = false}) => {
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
			<AbsoluteFill style={{background: '#000', opacity: tw(f, T.fade_q[0], T.fade_q[1], 0, 1, E.inOut)}} />
			<Audio src={staticFile('voz.wav')} />
			{musica && <Audio src={staticFile('trilha.wav')} />}
			{efeitos && <Audio src={staticFile('efeitos.wav')} />}
		</AbsoluteFill>
	);
};
