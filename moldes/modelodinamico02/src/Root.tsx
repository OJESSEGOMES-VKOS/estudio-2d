import React from 'react';
import {Composition} from 'remotion';
import {Dinamico02} from './d2/Reel';
import {DURACAO} from './d2/tema';

export const Root: React.FC = () => (
	<Composition id="Dinamico02" component={Dinamico02} durationInFrames={Math.ceil(DURACAO * 30)} fps={30} width={1080} height={1920} defaultProps={{voz: false}} />
);
