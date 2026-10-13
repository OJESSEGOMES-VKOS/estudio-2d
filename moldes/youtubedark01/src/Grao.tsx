import React from 'react';
import {AbsoluteFill, Img, getStaticFiles, staticFile} from 'remotion';

/** as texturas são opcionais: sem public/grao/g0-g7.png (scripts/grao.py grava), o vídeo sai só com a vinheta */
const TEM_GRAO = getStaticFiles().some((a) => a.name.replace(/\\/g, '/') === 'grao/g0.png');

/** grão de filme (8 texturas do curta aprovado, trocadas a cada quadro) + vinheta */
export const Grao: React.FC<{f: number; forca?: number}> = ({f, forca = 1}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		{TEM_GRAO && <Img src={staticFile(`grao/g${f % 8}.png`)} style={{width: 1080, height: 1920, opacity: 0.45 * forca, mixBlendMode: 'screen'}} />}
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 62% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)'}} />
	</AbsoluteFill>
);
