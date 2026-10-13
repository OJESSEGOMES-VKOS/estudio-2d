// Vitrine no sofistmotion01 (Ouro na Noite, 9:16). Tempos em src/tempos.json (conferidos por scripts/conferir.py).
import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, staticFile, useCurrentFrame} from 'remotion';
import {BLOCOS, BlocoView, COR, E, Flashes, HALO_TEXTO, INTER, Palavra, T, Vinheta, cena, ini, pare, tw, txt, useFonte} from './base';
import {C1, C10, C2, C3, C4, C5, C6, C7, C8, C9, LinhaAssinatura, LinhaContador, linhaGigante} from './cenas';

export const FPS = 30;
export const DURACAO_Q = T.duracao_q;

export type Props = {
	previas: boolean;
	nomesPrevias: [string, string];
	musica: boolean;
	efeitos: boolean;
};

/* as telas desenhadas em src/cenas.tsx; o plano só usa estas (o "tela" de cada cena no src/tempos.json é só anotação) */
const TELAS = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'];
for (const c of T.cenas) if (!TELAS.includes(c.id)) pare(`a cena "${c.id}" de src/tempos.json não está desenhada em src/cenas.tsx. Use uma de ${TELAS.join(', ')} ou desenhe a nova (e ponha em Reel.tsx).`);
const em = (f: number, id: string) => {
	const c = T.cenas.find((x) => x.id === id);
	return !!c && f >= c.de_q && f < c.ate_q;
};
/* som e prévias ligados pedem os arquivos: para logo, dizendo como fazer */
const ARQUIVOS = new Set(getStaticFiles().map((a) => a.name.replace(/\\/g, '/')));
const COMO: Record<string, string> = {
	'voz.wav': 'rode tools/novo-video.py com a gravação da narração',
	'trilha.wav': 'rode ../../.venv/Scripts/python.exe scripts/som.py (ou musica: false)',
	'efeitos.wav': 'rode ../../.venv/Scripts/python.exe scripts/som.py (ou efeitos: false)',
	'previa1.mp4': 'faça com tools/previa.py a partir de um vídeo seu pronto (da raiz: .venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 1, e depois 2) ou previas: false',
	'previa2.mp4': 'faça com tools/previa.py a partir de um vídeo seu pronto (da raiz: .venv/Scripts/python.exe tools/previa.py <video.mp4> videos/<pasta> 2) ou previas: false',
};
const precisa = (nome: string) => {
	if (!ARQUIVOS.has(nome)) pare(`falta public/${nome}: ${COMO[nome]}.`);
};
precisa('voz.wav');

export const VitrineSofistMotion01: React.FC<Props> = ({previas = false, nomesPrevias = ['', ''], musica = false, efeitos = false}) => {
	if (musica) precisa('trilha.wav');
	if (efeitos) precisa('efeitos.wav');
	if (previas && T.previas) (precisa('previa1.mp4'), precisa('previa2.mp4'));
	const f = useCurrentFrame();
	const ok = useFonte();
	const c1 = cena('C1');
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
			{ok &&
				// cada bloco do plano; as linhas de "tipo" especial (gigante, contador, assinatura) têm desenho próprio.
				// A assinatura vem por último (fica por cima do resto do fecho).
				[...BLOCOS.filter((b) => !b.linhas.some((l) => l.tipo === 'assinatura')), ...BLOCOS.filter((b) => b.linhas.some((l) => l.tipo === 'assinatura'))].map((b) => (
					<BlocoView
						key={b.id}
						id={b.id}
						f={f}
						estiloLinha={(l) => {
							if (l.tipo === 'contador') return <LinhaContador f={f} y={l.y} fs={l.fs} i={l.ids[0]} />;
							if (l.tipo === 'assinatura') return <LinhaAssinatura f={f} y={l.y} fs={l.fs} texto={txt(l.ids[0])} n={ini(l.ids[0])} />;
							if (l.tipo === 'gigante' && l === linhaGigante()) {
								// as palavras "gigante" nascem na palavra gigante (C1) e assentam aqui quando ela encolhe (27-31); as outras nascem aqui
								const g = linhaGigante()?.gigante ?? [];
								const o = tw(f, c1.de_q + 24, c1.de_q + 28, 0, 1, E.lin);
								const st: React.CSSProperties = {display: 'inline-block', fontFamily: INTER, fontWeight: 700, fontSize: l.fs, letterSpacing: '-0.02em', lineHeight: 1, color: COR.texto, textShadow: HALO_TEXTO, opacity: o};
								return (
									<div style={{position: 'absolute', left: 0, width: 1080, top: l.y - l.fs * 0.5, height: l.fs, textAlign: 'center', whiteSpace: 'nowrap'}}>
										{l.ids.map((i, j) => (
											<React.Fragment key={i}>
												{j > 0 && <span style={{display: 'inline-block', width: l.fs * 0.27}} />}
												{g.includes(i) ? <span style={st}>{txt(i)}</span> : <Palavra i={i} b={b} f={f} fs={l.fs} />}
											</React.Fragment>
										))}
									</div>
								);
							}
							return null;
						}}
					/>
				))}
			<Vinheta />
			{/* fecho (opcional, "escurece_q" no src/tempos.json): tudo vai ao preto e a trilha segue sumindo até o fim */}
			{T.escurece_q && <div style={{position: 'absolute', inset: 0, background: '#000', opacity: tw(f, T.escurece_q[0], T.escurece_q[1], 0, 1, E.io)}} />}
			<Flashes f={f} />
			{/* som: a voz sempre; trilha e efeitos são opção (a vitrine liga os dois) */}
			<Audio src={staticFile('voz.wav')} />
			{musica && <Audio src={staticFile('trilha.wav')} />}
			{efeitos && <Audio src={staticFile('efeitos.wav')} />}
		</AbsoluteFill>
	);
};
