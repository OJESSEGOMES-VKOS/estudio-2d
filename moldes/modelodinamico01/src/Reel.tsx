import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Previas, cenaEm, fundoCreme, montaCenas, useT} from './tema';
import {CENA_COMP} from './Cenas';
import {Legenda} from './Legenda';

export type Props = {voz: boolean; previas: boolean; nomesPrevias: [string, string]};

/** modelodinamico01: uma cena por vez, corte seco entre modos (MODELO §5); a legenda por cima; a voz uma vez só */
export const VitrineDinamico01: React.FC<Props> = ({voz, previas = false, nomesPrevias = ['', '']}) => {
	const {t} = useT();
	const cenas = React.useMemo(() => montaCenas(previas), [previas]);
	const c = cenaEm(cenas, t);
	const Cena = CENA_COMP[c.id];
	return (
		<Previas.Provider value={{previas, nomesPrevias}}>
			<AbsoluteFill style={c.modo === 'rosto' ? {background: '#000'} : fundoCreme}>
				<Cena />
				<Legenda />
				{voz && <Audio src={staticFile('voz.wav')} />}
			</AbsoluteFill>
		</Previas.Provider>
	);
};
