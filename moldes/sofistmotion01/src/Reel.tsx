// Vitrine no sofistmotion01 (Ouro na Noite, 9:16). Tempos em src/tempos.json (conferidos por scripts/conferir.py).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {BlocoView, COR, E, Flashes, HALO_TEXTO, INTER, Palavra, T, Vinheta, bloco, ini, tw, txt, useFonte} from './base';
import {C1, C10, C2, C3, C4, C5, C6, C7, C8, C9, LinhaAssinatura, LinhaContador} from './cenas';

export const FPS = 30;
export const DURACAO_Q = T.duracao_q;

export type Props = {
	previas: boolean;
	nomesPrevias: [string, string];
	musica: boolean;
	efeitos: boolean;
};

const em = (f: number, id: string) => {
	const c = T.cenas.find((x) => x.id === id)!;
	return f >= c.de_q && f < c.ate_q;
};

export const VitrineSofistMotion01: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], musica = false, efeitos = false}) => {
	const f = useCurrentFrame();
	const ok = useFonte();
	const b1 = bloco('B1');
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			{em(f, 'C1') && <C1 f={f} ok={ok} />}
			{em(f, 'C2') && <C2 f={f} />}
			{em(f, 'C3') && <C3 f={f} />}
			{em(f, 'C4') && <C4 f={f} />}
			{em(f, 'C5') && <C5 f={f} />}
			{em(f, 'C6') && <C6 f={f} />}
			{em(f, 'C7') && <C7 f={f} previas={previas} nomes={nomesPrevias} />}
			{em(f, 'C8') && <C8 f={f} />}
			{em(f, 'C9') && <C9 f={f} />}
			{em(f, 'C10') && <C10 f={f} />}
			{ok && (
				<>
					<BlocoView
						id="B1"
						f={f}
						estiloLinha={(l, k) => {
							if (k === 1) return <LinhaContador f={f} y={l.y} fs={l.fs} />;
							if (k === 0) {
								// "Esse vídeo" nasce na palavra gigante (C1) e assenta aqui quando ela encolhe (27-31); "está" e "sendo" nascem aqui
								const o = tw(f, 24, 28, 0, 1, E.lin);
								const st: React.CSSProperties = {display: 'inline-block', fontFamily: INTER, fontWeight: 700, fontSize: l.fs, letterSpacing: '-0.02em', lineHeight: 1, color: COR.texto, textShadow: HALO_TEXTO, opacity: o};
								const esp = <span style={{display: 'inline-block', width: l.fs * 0.27}} />;
								return (
									<div style={{position: 'absolute', left: 0, width: 1080, top: l.y - l.fs * 0.5, height: l.fs, textAlign: 'center', whiteSpace: 'nowrap'}}>
										<span style={st}>{txt(0)}</span>
										{esp}
										<span style={st}>{txt(1)}</span>
										{esp}
										<Palavra i={2} b={b1} f={f} fs={l.fs} />
										{esp}
										<Palavra i={3} b={b1} f={f} fs={l.fs} />
									</div>
								);
							}
							return null;
						}}
					/>
					{['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B13'].map((id) => (
						<BlocoView key={id} id={id} f={f} />
					))}
					<BlocoView id="B12" f={f} estiloLinha={(l, k) => (k === 1 ? <LinhaAssinatura f={f} y={l.y} fs={l.fs} texto={txt(84)} n={ini(84)} /> : null)} />
				</>
			)}
			<Vinheta />
			{/* fecho: tudo vai ao preto (30,6 a 31,07 s) e a trilha segue sumindo até o fim */}
			<div style={{position: 'absolute', inset: 0, background: '#000', opacity: tw(f, 918, 932, 0, 1, E.io)}} />
			<Flashes f={f} />
			{/* som: a voz sempre; trilha e efeitos são opção (a vitrine liga os dois) */}
			<Audio src={staticFile('voz.wav')} />
			{musica && <Audio src={staticFile('trilha.wav')} />}
			{efeitos && <Audio src={staticFile('efeitos.wav')} />}
		</AbsoluteFill>
	);
};
