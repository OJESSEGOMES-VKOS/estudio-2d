import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {PreviasCtx, fundoClaro} from './tema';
import {Rosto} from './Rosto';
import {Legenda} from './Legenda';
import {EditorFrente, EditorFundo} from './Editor';
import {CelularFrente, CelularFundo, Fecho, Modelos, Outros, PreviasCena, Prompt} from './Cenas';

/** arroba: o @ sem o "@" no Reel do celular e no fecho (vazio esconde); foto: arquivo em public/ do avatar (vazio esconde) */
export type Props = {voz: boolean; previas: boolean; nomesPrevias: [string, string]; arroba?: string; foto?: string};

/** camadas: fundo/editor/celular (embaixo do vídeo) -> vídeo -> telas -> legenda. A voz entra uma vez só (voz.wav). */
export const Vitrine: React.FC<Props> = ({voz = true, previas = false, nomesPrevias = ['', ''], arroba = '', foto = ''}) => (
	<PreviasCtx.Provider value={{previas, nomesPrevias, arroba, foto}}>
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
