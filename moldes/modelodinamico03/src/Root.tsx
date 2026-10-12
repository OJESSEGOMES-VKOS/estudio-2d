import React from 'react';
import {Composition} from 'remotion';
import {DURACAO, FPS, VitrineDinamico03} from './Reel';

export const Root: React.FC = () => (
	<Composition
		id="VitrineDinamico03"
		component={VitrineDinamico03}
		durationInFrames={Math.round(DURACAO * FPS)}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['modelodinamico01', 'modelopadrao01'] as [string, string], tratamento: false, efeitos: false}}
	/>
);
