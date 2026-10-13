import R from './rosto.json';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const fr = (s: number) => Math.round(s * FPS);

/* rosto: [t, cx, cy, h] a cada 0,25 s (src/rosto.json), suavizado em ~1,2 s pra câmera não tremer com o rosto */
const rosto = R as number[][];
const media = (i: number, k: number) => {
	let s = 0, n = 0;
	for (let j = Math.max(0, i - 2); j <= Math.min(rosto.length - 1, i + 2); j++) (s += rosto[j][k]), n++;
	return s / n;
};
const suave = rosto.map((_, i) => [rosto[i][0], media(i, 1), media(i, 2)]);
export const rostoEm = (t: number): [number, number] => {
	const i = Math.max(0, Math.min(suave.length - 2, Math.floor(t * 4)));
	const u = Math.max(0, Math.min(1, t * 4 - i));
	return [suave[i][1] + (suave[i + 1][1] - suave[i][1]) * u, suave[i][2] + (suave[i + 1][2] - suave[i][2]) * u];
};
