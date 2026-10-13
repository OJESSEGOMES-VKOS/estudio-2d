import React from 'react';
import {Composition} from 'remotion';
import {Corte, FPS, QUADROS} from './Corte';

export const Root: React.FC = () => (
	<Composition
		id="VitrinePregacao"
		component={Corte}
		durationInFrames={QUADROS}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['modelodinamico01', 'storypodcast01'] as [string, string], fundoCor: false}}
	/>
);
