import React from 'react';
import {Composition} from 'remotion';
import {Dinamico02} from './Reel';
import {QUADROS} from './tema';

export const Root: React.FC = () => (
	<Composition id="Dinamico02" component={Dinamico02} durationInFrames={QUADROS} fps={30} width={1080} height={1920} defaultProps={{voz: false, arroba: '', foto: '', arquivo: '20261005_103843'}} />
);
