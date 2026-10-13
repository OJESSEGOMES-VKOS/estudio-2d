import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {C, E, tw, useT} from './tema';
import {CENAS, Perfil, Tela, cenaEm} from './Cenas';

/**
 * modelodinamico02: uma tela por vez, corte seco com troca de fundo (MODELO §6).
 * Nas telas marcadas com íris, a nova abre num círculo que nasce do centro, com anel na borda (~15 quadros).
 */
const IRIS = 0.5;
/** voz: toca public/voz.wav; arroba (sem o "@") e foto (arquivo em public/) na assinatura do fecho, vazios escondem */
export const Dinamico02: React.FC<{voz: boolean; arroba?: string; foto?: string}> = ({voz, arroba = '', foto = ''}) => {
	const {t} = useT();
	const c = cenaEm(t);
	const i = CENAS.indexOf(c);
	const abrindo = c.iris && i > 0 && t < c.de + IRIS;
	const r = tw(t, c.de, c.de + IRIS, 0, 1250, E.inOut);
	return (
		<Perfil.Provider value={{arroba, foto}}>
		<AbsoluteFill style={{background: C.escuro}}>
			{abrindo && <Tela c={CENAS[i - 1]} />}
			<div style={{position: 'absolute', inset: 0, clipPath: abrindo ? `circle(${r}px at 540px 960px)` : undefined}}>
				<Tela c={c} />
			</div>
			{abrindo && <div style={{position: 'absolute', left: 540 - r, top: 960 - r, width: 2 * r, height: 2 * r, borderRadius: '50%', border: `28px solid ${C.creme}`, boxSizing: 'border-box'}} />}
			{voz && <Audio src={staticFile('voz.wav')} />}
		</AbsoluteFill>
		</Perfil.Provider>
	);
};
