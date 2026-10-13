import React from 'react';
import {Composition} from 'remotion';
import {DURACAO_Q, FPS, VitrineSofistMotion01} from './Reel';

export const Root: React.FC = () => (
	<Composition
		id="VitrineSofistMotion01"
		component={VitrineSofistMotion01}
		durationInFrames={DURACAO_Q}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['superpodcast01', 'modelodinamico03'] as [string, string], musica: false, efeitos: true}}
	/>
);
