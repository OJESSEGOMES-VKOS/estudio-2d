import React from 'react';
import {Composition} from 'remotion';
import {VitrineDinamico01} from './Reel';
import {DURACAO, FPS} from './tema';

export const Root: React.FC = () => (
	<Composition
		id="VitrineDinamico01"
		component={VitrineDinamico01}
		durationInFrames={Math.round(DURACAO * FPS)}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{voz: true, previas: false, nomesPrevias: ['modelopadrao01', 'youtubeedition01'] as [string, string]}}
	/>
);
