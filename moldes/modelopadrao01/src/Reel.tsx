import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {PreviasCtx, fundoClaro} from './tema';
import {Rosto} from './Rosto';
import {Legenda} from './Legenda';
import {EditorFrente, EditorFundo} from './Editor';
import {CelularFrente, CelularFundo, Fecho, Modelos, Outros, PreviasCena, Prompt} from './Cenas';

export type Props = {voz: boolean; previas: boolean; nomesPrevias: [string, string]};

/** camadas: fundo/editor/celular (embaixo do vídeo) -> vídeo -> telas -> legenda. A voz entra uma vez só (voz.wav). */
export const Vitrine: React.FC<Props> = ({voz = true, previas = false, nomesPrevias = ['', '']}) => (
	<PreviasCtx.Provider value={{previas, nomesPrevias}}>
		<AbsoluteFill style={{...fundoClaro, overflow: 'hidden'}}>
			<EditorFundo />
			<CelularFundo />
			<Rosto />
			<EditorFrente />
			<CelularFrente />
			<Outros />
			<Modelos />
			<PreviasCena />
			<Prompt />
			<Fecho />
			<Legenda />
			{voz ? <Audio src={staticFile('voz.wav')} /> : null}
		</AbsoluteFill>
	</PreviasCtx.Provider>
);
