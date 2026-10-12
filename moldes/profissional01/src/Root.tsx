import React from 'react';
import {Composition} from 'remotion';
import {DURACAO, FPS, Reel} from './Reel';

export const Root: React.FC = () => (
	<Composition
		id="VitrineProfissional01"
		component={Reel}
		durationInFrames={Math.floor(DURACAO * FPS)}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01'] as [string, string]}}
	/>
);
