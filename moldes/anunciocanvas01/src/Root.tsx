import React from 'react';
import {Composition} from 'remotion';
import {Canvas} from './Canvas';
import {DURACAO, FPS} from './tema';

export const Root: React.FC = () => (
	<Composition id="Anuncio" component={Canvas} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={1080} height={1920} defaultProps={{voz: true}} />
);
