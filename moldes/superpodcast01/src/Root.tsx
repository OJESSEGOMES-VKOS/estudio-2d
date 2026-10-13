import React from 'react';
import {Composition} from 'remotion';
import {DURACAO, FPS, VitrineSuperPodcast01} from './Reel';

export const Root: React.FC = () => (
	<Composition
		id="VitrineSuperPodcast01"
		component={VitrineSuperPodcast01}
		durationInFrames={Math.round(DURACAO * FPS)}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01'] as [string, string], nome: '', arroba: ''}}
	/>
);
