import React from 'react';
import {Composition} from 'remotion';
import {DURACAO_Q, FPS, VitrineYoutubeDark01} from './Reel';

export const Root: React.FC = () => (
	<Composition
		id="VitrineYoutubeDark01"
		component={VitrineYoutubeDark01}
		durationInFrames={DURACAO_Q}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['superpodcast01', 'youtubeedition01'] as [string, string], musica: false, efeitos: false}}
	/>
);
