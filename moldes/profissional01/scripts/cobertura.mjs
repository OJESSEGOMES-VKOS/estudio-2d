/// Conferência das regras de texto (2026-10-12, adaptado do modelodinamico03), quadro a quadro, com textos() do Reel.tsx:
// 1. cobertura: toda palavra (src/palavras_voz.json, via PALAVRAS do Reel.tsx) escrita na tela do início + 0,1 s ao fim - 0,07 s;
// 2. tempo: todo pedaço de legenda >= 1,5 s e toda palavra >= 0,4 s visível depois de nascer;
// 3. repetição: cada palavra exibida por um elemento só (nenhum trecho volta em outro lugar);
// 4. posições: legenda em no máximo 2 posições (LEG_Y e LEG_Y2);
// 5. zona segura 9:16: todo texto em x 60–940, y 250–1500;
// 6. linhas: nenhuma página, título ou tela com mais de 4 linhas.
// As telas cheias e os títulos (palavra a palavra com a voz, aprovados) entram na cobertura, na repetição e na zona;
// a régua de tempo vale para a legenda (como na memória legenda-conta-historia).
// Sai com código 1 se algo falhar ou se o plano não bater com a fala (aí diz a lista e a linha). Apaga o temporário sempre.
// uso: node scripts/cobertura.mjs [--previas]   (padrão: sem prévias, o padrão da composição; a vitrine foi ao ar com
//      prévias e passa com --previas)
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('.tmp-cobertura.mjs');
let M;
try {
	await build({
		stdin: {contents: "export {textos, PALAVRAS, ZONA, LEG_Y, LEG_Y2, DURACAO, PEDACOS, TITULOS, TELAS} from './src/Reel.tsx';", resolveDir: process.cwd(), loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
		external: ['remotion', 'react', 'react/jsx-runtime'],
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
		}}],
	});
	M = await import('file://' + tmp.replace(/\\/g, '/'));
} catch (e) {
	// o plano não bate com a fala: o Reel.tsx para ao carregar com a mensagem do que refazer; aqui ganha a linha da lista
	let msg = String(e?.message ?? e).split('\n')[0];
	const lista = /Na lista (\w+)/.exec(msg)?.[1];
	const n = lista ? fs.readFileSync('src/Reel.tsx', 'utf8').split('\n').findIndex((l) => new RegExp(`^(export )?const ${lista}\\b`).test(l)) : -1;
	if (n >= 0) msg = msg.replace(`Na lista ${lista}`, `Na lista ${lista} (src/Reel.tsx, linha ${n + 1})`);
	fs.rmSync(tmp, {force: true}); // o exit não passa pelo finally
	console.error(msg);
	process.exit(1);
} finally {
	fs.rmSync(tmp, {force: true});
}
const {textos, PALAVRAS: PS, ZONA, LEG_Y, LEG_Y2, DURACAO, PEDACOS, TITULOS, TELAS} = M;
const FPS = 30, MIN_PEDACO = 1.5, MIN_PALAVRA = 0.4, MAX_LINHAS = 4;
const previas = process.argv.includes('--previas');
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

// 6. linhas
const longos = [
	...PEDACOS.filter((p) => !p.startsWith('#') && p.split(' / ').length > MAX_LINHAS).map((p) => `página "${p}"`),
	...TITULOS.filter((q) => q.linhas.length > MAX_LINHAS).map((q) => `título da palavra ${q.primeira}`),
	...TELAS.filter((s) => s.linhas.length > MAX_LINHAS).map((s) => `tela da palavra ${s.primeira}`),
];

console.log(`modo: ${previas ? 'com' : 'sem'} prévias`);
console.log(`${PS.length} palavras, ${buracos.length} com buraco`); buracos.forEach((b) => console.log('  ' + b));
if (buracos.length) console.log("  -> ponha essas palavras numa página de PEDACOS, ou num título/tela que esteja na tela enquanto são ditas ('#n' só pula o que outra peça mostra)");
console.log(`${curtos.length} pedaços/palavras curtos (mín. ${MIN_PEDACO} s por pedaço, ${MIN_PALAVRA} s por palavra)`); curtos.forEach((c) => console.log('  ' + c));
if (curtos.length) console.log('  -> junte a página curta com a vizinha em PEDACOS, ou mude o corte (T / trechos) que a interrompe');
console.log(`${repetidas.length} palavras exibidas mais de uma vez`); repetidas.forEach((c) => console.log('  ' + c));
if (repetidas.length) console.log("  -> a palavra está numa página e numa tela/título: pule-a na legenda com '#n'");
console.log(`posições da legenda: ${posicoes.join(', ')} (permitidas ${LEG_Y} e ${LEG_Y2})`);
console.log(`${fora.length} textos fora da zona segura`); fora.forEach((c) => console.log('  ' + c.txt));
if (fora.length) console.log('  -> diminua o tam da linha (TELAS / TITULOS) ou encurte a página');
console.log(`${longos.length} com mais de ${MAX_LINHAS} linhas`); longos.forEach((c) => console.log('  ' + c));
ex.forEach((e) => console.log(`  ${e.de.toFixed(2)}-${e.ate.toFixed(2)} ${e.tipo.padEnd(7)} y ${Math.round(e.y0)}-${Math.round(e.y1)} x ${Math.round(e.x0)}-${Math.round(e.x1)} ${e.nome}`));
const ruimPos = posicoes.length > 2 || posicoes.some((y) => y !== LEG_Y && y !== LEG_Y2);
process.exit(buracos.length || curtos.length || repetidas.length || ruimPos || fora.length || longos.length ? 1 : 0);
