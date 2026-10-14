import React from 'react';
import {Easing, OffthreadVideo, staticFile} from 'remotion';
import {H, W, rostoEm} from './tempos';

/**
 * A câmera do A-roll (encanamento da apresentação do youtubeedition01, adaptado ao 9:16). O vídeo vive numa janela que
 * pode ser a tela inteira, o cartão do canto, a tela de reels recriada ou a metade de baixo da tela dividida.
 * Dentro dela, o zoom `s` e o lugar onde o rosto deve ficar (`fx`, `fy`, fração da janela), sem nunca mostrar borda.
 * Chave com `giro`: a entrada do cartão, o plano encolhe girando com borrão de movimento.
 * `atras`: o que vai entre o fundo da gravação e a pessoa recortada (o texto ATRÁS da pessoa).
 */
export type Pose = {x: number; y: number; w: number; h: number; r: number; s: number; fx: number; fy: number; sombra: number};
const base: Pose = {x: 0, y: 0, w: W, h: H, r: 0, s: 1, fx: 0.5, fy: 0.35, sombra: 0};
export const POSE = {
	cheio: base,
	punch: (s: number, fy = 0.36): Pose => ({...base, s, fy}),
	cartao: {x: W - 58 - 370, y: 1300, w: 370, h: 500, r: 34, s: 1.5, fx: 0.5, fy: 0.42, sombra: 1} as Pose,
	reel: {x: 175, y: 200, w: 730, h: 1298, r: 44, s: 1, fx: 0.5, fy: 0.35, sombra: 1} as Pose,
	baixo: (s = 1): Pose => ({x: 0, y: 880, w: W, h: H - 880, r: 0, s, fx: 0.5, fy: 0.4, sombra: 0}),
};
/** [t (s), pose de destino, duração da transição (0 = corte seco), gira?] */
export type Chave = [number, Pose, number, boolean?];

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const mistura = (a: Pose, b: Pose, u: number): Pose =>
	Object.fromEntries(Object.keys(a).map((k) => [k, lerp(a[k as keyof Pose], b[k as keyof Pose], u)])) as Pose;
const ease = Easing.inOut(Easing.cubic);

export const poseEm = (chaves: Chave[], t: number): {p: Pose; giro: number} => {
	let p = chaves[0][1];
	let giro = 0;
	for (const [t0, alvo, d, gira] of chaves) {
		if (t < t0) break;
		if (d === 0 || t >= t0 + d) {
			p = alvo;
			giro = 0;
		} else {
			const u = (t - t0) / d;
			p = mistura(p, alvo, ease(u));
			giro = gira ? Math.sin(Math.PI * u) : 0;
		}
	}
	return {p, giro};
};

export const Camera: React.FC<{chaves: Chave[]; t: number; atras?: React.ReactNode}> = ({chaves, t, atras}) => {
	const {p, giro} = poseEm(chaves, t);
	const [cx, cy] = rostoEm(t);
	const k = Math.max(p.w / W, p.h / H) * p.s;
	const vw = W * k, vh = H * k;
	const ox = Math.min(0, Math.max(p.w - vw, p.fx * p.w - cx * vw));
	const oy = Math.min(0, Math.max(p.h - vh, p.fy * p.h - cy * vh));
	const st: React.CSSProperties = {position: 'absolute', width: vw, height: vh, left: ox, top: oy, maxWidth: 'none'};
	return (
		<div
			style={{
				position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h, overflow: 'hidden', borderRadius: p.r,
				transform: giro ? `rotate(${-14 * giro}deg)` : undefined,
				filter: giro ? `blur(${9 * giro}px)` : undefined,
				boxShadow: p.sombra > 0.01 ? `0 ${26 * p.sombra}px ${60 * p.sombra}px rgba(0,0,0,${0.32 * p.sombra}), 0 4px 14px rgba(0,0,0,${0.14 * p.sombra})` : undefined,
			}}
		>
			<OffthreadVideo muted src={staticFile('fala.mp4')} style={st} />
			{atras ? (
				<>
					{atras}
					<OffthreadVideo muted transparent src={staticFile('pessoa.webm')} style={st} />
				</>
			) : null}
		</div>
	);
};
