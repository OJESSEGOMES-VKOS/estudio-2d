import React from 'react';
import {Composition} from 'remotion';
import {VitrineYoutubeEdition01} from './Video';
import {DURACAO_Q} from './plano';
import {FPS} from './tempos';

export const Root: React.FC = () => (
	<Composition
		id="VitrineYoutubeEdition01"
		component={VitrineYoutubeEdition01}
		durationInFrames={DURACAO_Q}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01'] as [string, string], arroba: ''}}
	/>
);
