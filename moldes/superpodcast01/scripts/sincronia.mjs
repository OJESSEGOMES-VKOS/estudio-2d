// Sincronia e regras de legenda (2026-10-12). uso: node scripts/sincronia.mjs  (sai 1 se algo falhar)
// - cada palavra nasce no seu start de src/palavras.json (±2 quadros); a 2ª palavra de um destaque também;
// - cada corte cai no start da 1ª palavra do plano novo (±2 quadros);
// - toda fala na tela, cada palavra uma vez; máx. 4 linhas por bloco; legenda padrão em ≤ 2 posições;
// - zona segura 9:16: y 250–1500 (texto pequeno: y ± ~0,6 corpo; destaque: até 220 px de corpo), x 60–940 (estimado).
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const tmp = path.resolve('.tmp-sincronia.mjs');
await build({
	stdin: {contents: "export {conferencia} from './src/Reel.tsx';", resolveDir: process.cwd(), loader: 'ts'},
	bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
	plugins: [{name: 'stub', setup(b) {
		b.onResolve({filter: /^(@remotion\/google-fonts|remotion$)/}, (a) => ({path: a.path, namespace: 'stub'}));
		b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'}); export const Easing = {bezier: () => (x) => x}; export const interpolate = () => 0; export const random = () => 0; export const staticFile = (x) => x; export const AbsoluteFill = null, Img = null, OffthreadVideo = null, Sequence = null, continueRender = () => {}, delayRender = () => 0, useCurrentFrame = () => 0;", loader: 'js'}));
	}}],
});
const {conferencia: C} = await import(pathToFileURL(tmp).href);
fs.rmSync(tmp);
const Q = 2 / 30 + 1e-6, erros = [];
for (const prev of [false, true]) {
	const BL = C.blocos(prev), modo = prev ? 'com prévias' : 'sem prévias', vezes = C.PS.map(() => 0), posicoes = new Set();
	for (const b of BL) {
		if (b.linhas.length > 4) erros.push(`${modo}: bloco ${b.de} com ${b.linhas.length} linhas`);
		const ids = [];
		for (const l of b.linhas) {
			const lids = l.tipo === 'k' ? [l.id, ...(l.id2 !== undefined ? [l.id2] : [])] : l.ids;
			ids.push(...lids);
			for (const id of lids) {
				const nasce = Math.max(C.PS[id].de, b.de), d = nasce - C.PS[id].de;
				if (Math.abs(d) > Q) erros.push(`${modo}: "${C.PS[id].texto}" nasce ${nasce.toFixed(2)} s, dita ${C.PS[id].de} (${Math.round(d * 30)} quadros)`);
				if (C.PS[id].de >= b.ate) erros.push(`${modo}: "${C.PS[id].texto}" dita depois do bloco sumir`);
			}
			const corpo = l.tipo === 'k' ? Math.min(220, (0.74 * C.W) / (0.55 * (l.texto ?? C.PS[l.id].texto).length)) : C.FS, y0 = l.y - corpo * 0.62, y1 = l.y + corpo * 0.68;
			if (y0 < 250 || y1 > 1500) erros.push(`${modo}: linha "${lids.map((i) => C.PS[i].texto).join(' ')}" fora da zona (y ${Math.round(y0)}-${Math.round(y1)})`);
			if (l.tipo === 'p' && l.al === 'c') { const w = lids.map((i) => C.PS[i].texto).join(' ').length * C.FS * 0.52; if ((C.W - w) / 2 < 60) erros.push(`${modo}: linha larga demais`); }
		}
		if (b.linhas.some((l) => l.tipo === 'p') && !b.linhas.some((l) => l.tipo === 'k') && !(b.de === 26.69 || b.de === 28.27)) posicoes.add(b.linhas.find((l) => l.tipo === 'p').y);
		ids.forEach((i) => vezes[i]++);
	}
	vezes.forEach((v, i) => { if (v !== 1 && C.PS[i].texto.trim()) erros.push(`${modo}: "${C.PS[i].texto}" (${i}) aparece ${v}x`); });
	if (posicoes.size > 2) erros.push(`${modo}: legenda padrão em ${posicoes.size} posições (${[...posicoes].join(', ')})`);
	for (const p of C.PLANOS.slice(1)) {
		const ids = BL.filter((b) => Math.abs(b.de - p.de) < 1e-6).flatMap((b) => b.linhas.flatMap((l) => (l.tipo === 'k' ? [l.id] : l.ids)));
		const w = Math.min(...ids.map((i) => C.PS[i].de));
		if (!(Math.abs(w - p.de) <= Q)) erros.push(`${modo}: corte ${p.id} em ${p.de} s, 1ª palavra em ${w} s`);
	}
}
console.log(`${erros.length} erros`); erros.forEach((e) => console.log('  ' + e));
process.exit(erros.length ? 1 : 0);
