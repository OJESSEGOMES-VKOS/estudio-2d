import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

/** grão de filme (8 texturas do curta aprovado, trocadas a cada quadro) + vinheta */
export const Grao: React.FC<{f: number; forca?: number}> = ({f, forca = 1}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<Img src={staticFile(`grao/g${f % 8}.png`)} style={{width: 1080, height: 1920, opacity: 0.45 * forca, mixBlendMode: 'screen'}} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 62% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)'}} />
	</AbsoluteFill>
);
