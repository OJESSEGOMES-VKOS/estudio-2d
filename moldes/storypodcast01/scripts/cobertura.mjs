// Checador da legenda (a mesma ideia do checador do modelodinamico03, 2026-10-12). uso: node scripts/cobertura.mjs
// Confere: buracos (toda palavra escrita na tela enquanto é dita), pedaços curtos (>= 1,5 s; palavra >= 0,4 s),
// repetição, posições de repouso da legenda (<= 2), zona segura 9:16, destaque x legenda, linhas por bloco (<= 4),
// nº de fontes (<= 2) e cortes nos 9 s iniciais. As medidas de fonte aqui são estimadas (sem navegador), com folga
// para cima; a prova final é a folha de quadros.
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

// canvas falso: Poppins ~0,60 em por letra (0,63 no 600), espaço 0,28; Anton maiúscula 0,48 em, altura da maiúscula 0,73 em
globalThis.document = {createElement: () => ({getContext: () => {
	const c = {font: '', measureText: (s) => {
		const px = Number(/(\d+(?:\.\d+)?)px/.exec(c.font)[1]);
		const anton = c.font.includes('ANT');
		const bold = /^600/.test(c.font);
		let w = 0;
		for (const ch of s) w += ch === ' ' ? 0.28 : anton ? 0.48 : bold ? 0.63 : 0.6;
		return {width: w * px, actualBoundingBoxAscent: (anton ? 0.73 : 0.7) * px, fontBoundingBoxAscent: 1.05 * px, fontBoundingBoxDescent: 0.35 * px};
	}};
	return c;
}})};

const tmp = path.resolve('.tmp-cobertura.mjs');
await build({
	stdin: {contents: "export {palavrasNaTela, exibicoes, caixas, LEG_Y, LEG_Y2, ZONA, CORTES, FONTES, DURACAO, FPS} from './src/Reel.tsx'; export {default as PB} from './src/palavras.json';", resolveDir: process.cwd(), loader: 'ts'},
	bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
	plugins: [{name: 'stub', setup(b) {
		b.onResolve({filter: /^@remotion\/google-fonts\//}, (a) => ({path: a.path, namespace: 'stub'}));
		b.onLoad({filter: /.*/, namespace: 'stub'}, (a) => ({contents: `export const loadFont = () => ({fontFamily: '${a.path.endsWith('Anton') ? 'ANT' : 'POP'}', waitUntilDone: async () => {}});`, loader: 'js'}));
	}}],
});
const {palavrasNaTela, exibicoes, caixas, LEG_Y, LEG_Y2, ZONA, CORTES, FONTES, DURACAO, PB} = await import('file://' + tmp.replace(/\\/g, '/'));
fs.rmSync(tmp);
const FPS = 30;
const MIN_PEDACO = 1.5, MIN_PALAVRA = 0.4, MAX_LINHAS = 4;

const buracos = [];
PB.forEach((p, i) => {
	let f0 = Math.ceil((p.start + 0.1) * FPS), f1 = Math.floor((p.end - 0.08) * FPS); // o corte entra 2 quadros antes da palavra seguinte
	if (f1 < f0) f0 = f1 = Math.round(((p.start + p.end) / 2) * FPS);
	const faltam = [];
	for (let f = f0; f <= f1; f++) if (!palavrasNaTela(f / FPS).includes(i)) faltam.push((f / FPS).toFixed(2));
	if (faltam.length) buracos.push(`${i} "${p.text}" sem texto em ${faltam.join(', ')}`);
});
const ex = exibicoes();
const curtos = [], longos = [];
for (const e of ex) {
	if (e.ate - e.de < MIN_PEDACO - 1e-6) curtos.push(`"${e.nome}" ${(e.ate - e.de).toFixed(2)} s`);
	for (let i = e.i0; i < e.i0 + e.n; i++) if (e.ate - PB[i].start < MIN_PALAVRA - 1e-6) curtos.push(`"${PB[i].text}" em "${e.nome}" só ${(e.ate - PB[i].start).toFixed(2)} s`);
	if (e.linhas > MAX_LINHAS) longos.push(`"${e.nome}" ${e.linhas} linhas`);
}
const vezes = PB.map(() => 0);
ex.forEach((e) => { for (let i = e.i0; i < e.i0 + e.n; i++) vezes[i]++; });
const repetidas = vezes.flatMap((v, i) => (v !== 1 ? [`${i} "${PB[i].text}" ${v}x`] : []));

const posicoes = new Set(), batidas = [], foraZona = [];
const anota = (l, k, txt) => { if (!l.some((x) => x.k === k)) l.push({k, txt}); };
for (const previas of [false, true]) {
	const modo = previas ? 'com prévias' : 'sem prévias';
	for (let f = 0; f < Math.round(DURACAO * FPS); f++) {
		const t = f / FPS, cs = caixas(t, previas);
		for (const c of cs) {
			if (c.tipo === 'legenda') posicoes.add(Math.round(c.y0));
			if (c.x0 < ZONA.esq - 0.5 || c.x1 > ZONA.dir + 0.5 || c.y0 < ZONA.topo || c.y1 > ZONA.base + 0.5)
				anota(foraZona, modo + c.nome, `${modo} "${c.nome}" em ${t.toFixed(2)}s: x ${Math.round(c.x0)}-${Math.round(c.x1)}, y ${Math.round(c.y0)}-${Math.round(c.y1)}`);
		}
		for (const a of cs) for (const b of cs) if (a !== b && a.nome < b.nome && a.y0 < b.y1 + 10 && a.y1 > b.y0 - 10 && a.x0 < b.x1 && a.x1 > b.x0)
			anota(batidas, modo + a.nome + b.nome, `${modo} "${a.nome}" x "${b.nome}" em ${t.toFixed(2)}s`);
	}
}
const fontesSrc = (fs.readFileSync('src/Reel.tsx', 'utf8').match(/@remotion\/google-fonts\/\w+/g) ?? []).length;
const cortes9 = CORTES.filter((c) => c < 9);

console.log(`${PB.length} palavras, ${buracos.length} com buraco`); buracos.forEach((b) => console.log('  ' + b));
console.log(`${ex.length} pedaços, ${curtos.length} curtos (mín. ${MIN_PEDACO} s por pedaço, ${MIN_PALAVRA} s por palavra)`); curtos.forEach((c) => console.log('  ' + c));
console.log(`${repetidas.length} palavras fora de "exatamente 1 vez"`); repetidas.forEach((c) => console.log('  ' + c));
console.log(`${longos.length} blocos com mais de ${MAX_LINHAS} linhas`); longos.forEach((c) => console.log('  ' + c));
console.log(`posições da legenda: ${[...posicoes].sort().join(', ')} (permitidas ${LEG_Y} e ${LEG_Y2})`);
console.log(`${batidas.length} textos se cruzando`); batidas.forEach((c) => console.log('  ' + c.txt));
console.log(`${foraZona.length} textos fora da zona segura (x ${ZONA.esq}-${ZONA.dir}, y ${ZONA.topo}-${ZONA.base})`); foraZona.forEach((c) => console.log('  ' + c.txt));
console.log(`fontes: ${FONTES.length} no código, ${fontesSrc} importadas`);
console.log(`cortes: ${CORTES.length} no vídeo, ${cortes9.length} nos 9 s iniciais (${cortes9.map((c) => c.toFixed(2)).join(', ')})`);
ex.forEach((e) => console.log(`  ${e.de.toFixed(2)}-${e.ate.toFixed(2)} ${e.tipo} ${e.nome}`));
const posRuins = [...posicoes].filter((y) => y !== LEG_Y && y !== LEG_Y2).length;
process.exit(buracos.length || curtos.length || repetidas.length || longos.length || posRuins || batidas.length || foraZona.length || FONTES.length > 2 || fontesSrc > 2 || cortes9.length > 2 ? 1 : 0);
