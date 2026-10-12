import React from 'react';
import {Composition} from 'remotion';
import {Vitrine} from './Reel';
import {FPS, T} from './tema';

export const Root: React.FC = () => (
	<Composition
		id="VitrinePadrao01"
		component={Vitrine}
		durationInFrames={Math.ceil(T.duracao * FPS)}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{voz: true, previas: false, nomesPrevias: ['modelodinamico01', 'youtubeedition01'] as [string, string]}}
	/>
);
