import React from 'react';
import {Bloco, C, CX, E, FPS, Linha, SANS, T, mola, tw, txt, useT, w} from './tema';
import {Pal, brilho, hexA} from './ui';

/**
 * Texto do anunciomotion01 (MODELO §2-3): Sora, frase em linhas de tamanhos e pesos misturados (ExtraBold na palavra
 * de peso, Regular na de ligação), cada palavra nasce de um desfoque com leve deslize no start dela.
 * Destaque (pílula de contorno brilhante, escrita letra por letra, entra inclinada e endireita) só no termo protagonista.
 * Todos os tempos e posições vêm de src/tempos.json (conferidos por scripts/conferir.py).
 */
const janela = (b: Bloco) => {
	const c = T.cenas.find((x) => x.id === b.cena)!;
	return {de: (b.de_q ?? c.de_q) / FPS, ate: (b.ate_q ?? c.ate_q) / FPS, claro: c.fundo === 'claro'};
};

const LinhaNormal: React.FC<{l: Linha; claro: boolean}> = ({l, claro}) => {
	const forte = l.peso >= 700;
	const cor = claro ? (forte ? C.tinta : C.subClaro) : forte ? '#FFFFFF' : C.sub;
	return (
		<div style={{position: 'absolute', left: CX - 600, width: 1200, top: l.y - l.fs * 0.6, height: l.fs * 1.2, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: SANS, fontSize: l.fs, fontWeight: l.peso, lineHeight: 1.2, letterSpacing: l.fs > 90 ? '-0.045em' : '-0.025em', color: cor}}>
			{l.ids.map((i, k) => {
				const m = l.marca?.includes(i);
				const st: React.CSSProperties = m ? {color: claro ? C.vFundo : C.v, textShadow: claro ? undefined : brilho(C.v, l.fs / 160)} : {};
				return (
					<React.Fragment key={i}>
						{k > 0 && ' '}
						<Pal txt={txt(i)} de={w(i)} style={st} />
					</React.Fragment>
				);
			})}
		</div>
	);
};

/** "100%": o número conta de 0 a 100 no tempo da palavra (MODELO §4.6) */
const Contador: React.FC<{l: Linha}> = ({l}) => {
	const {t} = useT();
	const de = w(l.ids[0]);
	if (t < de) return null;
	const n = Math.round(tw(t, de, de + 0.45, 0, 100, E.out));
	const k = mola(t, de, {damping: 13, stiffness: 150});
	return (
		<div style={{position: 'absolute', left: CX - 600, width: 1200, top: l.y - l.fs * 0.55, textAlign: 'center', fontFamily: SANS, fontWeight: l.peso, fontSize: l.fs, letterSpacing: '-0.06em', lineHeight: 1.1, color: '#fff', textShadow: brilho(C.v, 2.2), opacity: Math.min(1, k * 2), transform: `scale(${0.6 + 0.4 * k})`, filter: k < 0.6 ? `blur(${(0.6 - k) * 20}px)` : undefined}}>
			{n}
			<span style={{color: C.v}}>%</span>
		</div>
	);
};

/** pílula de destaque: caixa do tamanho da frase inteira, cada palavra escreve as letras a partir do start dela */
export const PilulaPal: React.FC<{l: Linha; claro: boolean}> = ({l, claro}) => {
	const {t} = useT();
	const de = w(l.ids[0]);
	if (t < de - 0.05) return null;
	const tam = l.fs;
	const cor = claro ? C.vFundo : C.v;
	const k = mola(t, de - 0.05, {damping: 15, stiffness: 140});
	const borrao = tw(t, de - 0.05, de + 0.15, 14, 0);
	const cheio = l.ids.map(txt).join(' ');
	const vis = l.ids
		.map((i) => {
			const s = txt(i);
			return s.slice(0, Math.round(tw(t, w(i), w(i) + 0.14, 0, s.length, (x) => x)));
		})
		.filter((s) => s.length)
		.join(' ');
	return (
		<div style={{position: 'absolute', left: CX - 600, width: 1200, top: l.y - tam * 0.72, display: 'flex', justifyContent: 'center', perspective: 1200}}>
			<div
				style={{
					position: 'relative',
					padding: `${tam * 0.2}px ${tam * 0.42}px ${tam * 0.24}px`,
					borderRadius: tam * 0.38,
					border: `${Math.max(3, tam * 0.04)}px solid ${hexA(cor, 0.95)}`,
					background: claro ? hexA(cor, 0.1) : `linear-gradient(160deg, ${hexA(cor, 0.28)}, ${hexA(cor, 0.06)})`,
					boxShadow: `0 0 ${tam * 0.4}px ${hexA(cor, 0.55)}, inset 0 0 ${tam * 0.3}px ${hexA(cor, 0.35)}`,
					fontFamily: SANS,
					fontWeight: l.peso,
					fontSize: tam,
					letterSpacing: '-0.03em',
					lineHeight: 1,
					color: claro ? C.tinta : '#F0FFF8',
					textShadow: claro ? 'none' : brilho(cor, tam / 140),
					whiteSpace: 'nowrap',
					opacity: Math.min(1, k * 1.6),
					filter: borrao > 0.3 ? `blur(${borrao}px)` : undefined,
					transform: `rotateY(${(1 - k) * -38}deg) rotateZ(${(1 - k) * -9}deg) scale(${0.75 + 0.25 * k})`,
				}}
			>
				<span style={{visibility: 'hidden'}}>{cheio}</span>
				<span style={{position: 'absolute', left: tam * 0.42, top: tam * 0.2}}>{vis}</span>
			</div>
		</div>
	);
};

/** todos os blocos de uma cena; cada um some em desfoque nos 3 últimos quadros antes do fim da janela dele */
export const Texto: React.FC<{cena: string}> = ({cena}) => {
	const {t} = useT();
	return (
		<>
			{T.blocos
				.filter((b) => b.cena === cena)
				.map((b) => {
					const j = janela(b);
					if (t < j.de || t >= j.ate) return null;
					const sai = j.ate < T.duracao_q / FPS ? tw(t, j.ate - 0.1, j.ate, 0, 1) : 0;
					return (
						<div key={b.id} style={{position: 'absolute', inset: 0, opacity: 1 - sai, filter: sai > 0 ? `blur(${sai * 12}px)` : undefined}}>
							{b.linhas.map((l, k) =>
								l.tipo === 'contador' ? <Contador key={k} l={l} /> : l.tipo === 'pilula' ? <PilulaPal key={k} l={l} claro={j.claro} /> : <LinhaNormal key={k} l={l} claro={j.claro} />,
							)}
						</div>
					);
				})}
		</>
	);
};
