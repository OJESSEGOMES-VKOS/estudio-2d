// Conferência das regras de texto (2026-10-12, adaptado do modelodinamico03), quadro a quadro, com textos() do Reel.tsx:
// 1. cobertura: toda palavra (src/palavras_voz.json, via PALAVRAS do Reel.tsx) escrita na tela do início + 0,1 s ao fim - 0,07 s;
// 2. tempo: todo pedaço de legenda >= 1,5 s e toda palavra >= 0,4 s visível depois de nascer;
// 3. repetição: cada palavra exibida por um elemento só (nenhum trecho volta em outro lugar);
// 4. posições: legenda em no máximo 2 posições (LEG_Y e LEG_Y2);
// 5. zona segura 9:16: todo texto em x 60–940, y 250–1500.
// As telas cheias e os títulos (palavra a palavra com a voz, aprovados) entram na cobertura, na repetição e na zona;
// a régua de tempo vale para a legenda (como na memória legenda-conta-historia).
// uso: node scripts/cobertura.mjs [--sem-previas]   (padrão: com prévias, o modo que vai ao ar)
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('.tmp/cobertura-bundle.mjs');
await build({
	stdin: {contents: "export {textos, PALAVRAS, ZONA, LEG_Y, LEG_Y2, DURACAO} from './src/Reel.tsx';", resolveDir: process.cwd(), loader: 'ts'},
	bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
	external: ['remotion', 'react', 'react/jsx-runtime'],
	plugins: [{name: 'stub', setup(b) {
		b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
		b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
	}}],
});
const {textos, PALAVRAS: PS, ZONA, LEG_Y, LEG_Y2, DURACAO} = await import('file://' + tmp.replace(/\\/g, '/'));
fs.rmSync(tmp);
const FPS = 30, MIN_PEDACO = 1.5, MIN_PALAVRA = 0.4;
const previas = !process.argv.includes('--sem-previas');
const N = Math.round(DURACAO * FPS);
const Q = Array.from({length: N}, (_, f) => textos(f / FPS, previas));

// 1. cobertura
const buracos = [];
PS.forEach((p, i) => {
	let f0 = Math.ceil((p.de + 0.1) * FPS), f1 = Math.floor((p.ate - 0.07) * FPS);
	if (f1 < f0) f0 = f1 = Math.round(((p.de + p.ate) / 2) * FPS);
	const faltam = [];
	for (let f = f0; f <= f1 && f < N; f++) if (!Q[f].some((c) => c.palavras.includes(i))) faltam.push((f / FPS).toFixed(2));
	if (faltam.length) buracos.push(`${i} "${p.texto}" sem texto em ${faltam.join(', ')}`);
});
// exibições: trechos contínuos de um mesmo elemento na mesma posição
const ex = [];
const abertos = new Map();
for (let f = 0; f <= N; f++) {
	const cs = f < N ? Q[f] : [];
	const chaves = new Set(cs.map((c) => c.tipo + '|' + c.nome + (c.tipo === 'legenda' ? '|' + Math.round(c.y0) : '')));
	for (const [k, e] of abertos) if (!chaves.has(k)) { e.ate = f / FPS; ex.push(e); abertos.delete(k); }
	for (const c of cs) {
		const k = c.tipo + '|' + c.nome + (c.tipo === 'legenda' ? '|' + Math.round(c.y0) : '');
		if (!abertos.has(k)) abertos.set(k, {...c, de: f / FPS, todas: new Set()});
		c.palavras.forEach((i) => abertos.get(k).todas.add(i));
	}
}
ex.sort((a, b) => a.de - b.de);
// 2. tempo (legenda)
const curtos = [];
for (const e of ex.filter((x) => x.tipo === 'legenda')) {
	if (e.ate - e.de < MIN_PEDACO - 1e-6) curtos.push(`"${e.nome}" ${(e.ate - e.de).toFixed(2)} s`);
	for (const i of e.todas) if (e.ate - Math.max(e.de, PS[i].de) < MIN_PALAVRA - 1e-6) curtos.push(`"${PS[i].texto}" em "${e.nome}" só ${(e.ate - Math.max(e.de, PS[i].de)).toFixed(2)} s`);
}
// 3. repetição
const vezes = PS.map(() => 0);
ex.forEach((e) => e.todas.forEach((i) => vezes[i]++));
const repetidas = vezes.flatMap((v, i) => (v > 1 ? [`${i} "${PS[i].texto}" ${v}x`] : []));
// 4. posições
const posicoes = [...new Set(ex.filter((e) => e.tipo === 'legenda').map((e) => Math.round(e.y0)))];
// 5. zona
const fora = [];
Q.forEach((cs, f) => cs.forEach((c) => {
	if (c.x0 < ZONA.esq - 0.5 || c.x1 > ZONA.dir + 0.5 || c.y0 < ZONA.topo - 0.5 || c.y1 > ZONA.base + 0.5) {
		const k = c.nome;
		if (!fora.some((x) => x.k === k)) fora.push({k, txt: `"${c.nome}" em ${(f / FPS).toFixed(2)}s: x ${Math.round(c.x0)}-${Math.round(c.x1)}, y ${Math.round(c.y0)}-${Math.round(c.y1)}`});
	}
}));

console.log(`modo: ${previas ? 'com' : 'sem'} prévias`);
console.log(`${PS.length} palavras, ${buracos.length} com buraco`); buracos.forEach((b) => console.log('  ' + b));
console.log(`${curtos.length} pedaços/palavras curtos (mín. ${MIN_PEDACO} s por pedaço, ${MIN_PALAVRA} s por palavra)`); curtos.forEach((c) => console.log('  ' + c));
console.log(`${repetidas.length} palavras exibidas mais de uma vez`); repetidas.forEach((c) => console.log('  ' + c));
console.log(`posições da legenda: ${posicoes.join(', ')} (permitidas ${LEG_Y} e ${LEG_Y2})`);
console.log(`${fora.length} textos fora da zona segura`); fora.forEach((c) => console.log('  ' + c.txt));
ex.forEach((e) => console.log(`  ${e.de.toFixed(2)}-${e.ate.toFixed(2)} ${e.tipo.padEnd(7)} y ${Math.round(e.y0)}-${Math.round(e.y1)} x ${Math.round(e.x0)}-${Math.round(e.x1)} ${e.nome}`));
const ruimPos = posicoes.length > 2 || posicoes.some((y) => y !== LEG_Y && y !== LEG_Y2);
process.exit(buracos.length || curtos.length || repetidas.length || ruimPos || fora.length ? 1 : 0);
