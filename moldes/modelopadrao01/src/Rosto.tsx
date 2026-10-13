import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, staticFile} from 'remotion';
import {DIVISA, E, R, T, blocoDe, pDividido, tw, usePrevias, useT} from './tema';

/**
 * O vídeo da fala, uma moldura que muda conforme o modo de tela:
 * - PRÉVIA: dentro da janela do editor (o Claude editando este vídeo), de "pelo Claude" a "a diferença";
 * - CELULAR: na tela do celular (o Reel no Instagram), de "Inclusive" a "posso";
 * - CHEIO A/B: enquadramento pelo rastreio do rosto (olhos em y 660; B 15% mais perto), troca por bloco;
 * - DIVIDIDO: metade de baixo (olhos em y 1400), o painel claro em cima.
 * Moldura = escala/posição + recorte (inset e raio), sempre interpolados.
 */
type Q = {s: number; x: number; y: number; c: [number, number, number, number]; r: number};

const janela = (x: number, y: number, w: number, r: number): Q => {
	const s = w / 1080;
	const h = 1920 * s;
	return {s, x, y, c: [y, 1080 - x - w, 1920 - y - h, x], r};
};
export const PREVIA = {x: 375, y: 500, w: 330}; // a pré-visualização no editor (9:16)
export const CEL = {x: 330, y: 466, w: 420}; // a tela do celular (9:16)
export const CEL_H = 1920 * (CEL.w / 1080);

/** nunca deixa o fundo aparecer nas bordas do vídeo */
const prende = (s: number, x: number, y: number) => ({x: Math.min(0, Math.max(1080 - 1080 * s, x)), y: Math.min(0, Math.max(1920 - 1920 * s, y))});

export const alvoOlhos = (k: number) => (T.planos[k] === 'B' ? 650 : 660);
const cheio = (k: number): Q => {
	const r = R.trechos[k];
	const s = T.planos[k] === 'B' ? 1.2 : 1.06;
	return {s, ...prende(s, 540 - s * r.cx, alvoOlhos(k) - s * r.olhos), c: [0, 0, 0, 0], r: 0};
};
const dividido = (k: number): Q => {
	const r = R.trechos[k];
	const s = 1.08;
	return {s, x: Math.min(0, Math.max(1080 - 1080 * s, 540 - s * r.cx)), y: 1400 - s * r.olhos, c: [DIVISA, 0, 0, 0], r: 0};
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const mix = (a: Q, b: Q, p: number): Q => ({
	s: lerp(a.s, b.s, p),
	x: lerp(a.x, b.x, p),
	y: lerp(a.y, b.y, p),
	c: a.c.map((v, i) => lerp(v, b.c[i], p)) as Q['c'],
	r: lerp(a.r, b.r, p),
});

const zoom = (t: number) => {
	let z = 1;
	for (const s of T.zooms as {t: number; ate: number; escala: number; quadros: number}[])
		if (t >= s.t && t < s.ate) z = tw(t, s.t, s.t + s.quadros / T.fps, 1, s.escala, E.out);
	return z;
};

export const Rosto: React.FC = () => {
	const {t, f} = useT();
	const {previas} = usePrevias();
	const k = blocoDe(t);
	const ed = T.editor;
	const ce = T.celular;
	let q = mix(cheio(k), dividido(k), pDividido(t, previas));
	const pe = ed ? Math.min(tw(t, ed.de - 0.4, ed.de + 0.05, 0, 1, E.inOut), 1 - tw(t, ed.devolve, ed.devolve + 0.55, 0, 1, E.inOut)) : 0;
	q = mix(q, janela(PREVIA.x, PREVIA.y, PREVIA.w, 16), pe);
	const pc = ce ? Math.min(tw(t, ce.de, ce.de + 0.45, 0, 1, E.inOut), 1 - tw(t, ce.devolve, ce.devolve + 0.55, 0, 1, E.inOut)) : 0;
	q = mix(q, janela(CEL.x, CEL.y, CEL.w, 34), pc);
	const z = zoom(t);
	const r = R.trechos[k];
	const ultimo = Math.floor(T.video_fim * T.fps) - 1;
	const video = <OffthreadVideo src={staticFile('fala.mp4')} muted style={{width: 1080, height: 1920}} />;
	return (
		<AbsoluteFill style={{clipPath: `inset(${q.c[0]}px ${q.c[1]}px ${q.c[2]}px ${q.c[3]}px round ${q.r}px)`}}>
			<AbsoluteFill
				style={{
					transformOrigin: '0 0',
					transform: `translate(${q.x}px, ${q.y}px) scale(${q.s}) translate(${r.cx}px, ${r.olhos}px) scale(${z}) translate(${-r.cx}px, ${-r.olhos}px)`,
				}}
			>
				{f < ultimo ? video : <Freeze frame={ultimo}>{video}</Freeze>}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
