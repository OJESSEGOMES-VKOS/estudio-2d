import React from 'react';
import {Composition} from 'remotion';
import {DURACAO, FPS, VitrineIlustrations01} from './Reel';

export const Root: React.FC = () => (
	<Composition
		id="VitrineIlustrations01"
		component={VitrineIlustrations01}
		durationInFrames={Math.round(DURACAO * FPS)}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['storypodcast01', 'youtubeedition01'] as [string, string], musica: false, efeitos: false}}
	/>
);
