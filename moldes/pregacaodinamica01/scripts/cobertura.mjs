// Cobertura de falas (a mesma ideia do checador do modelodinamico03, 2026-10-12, pedido do Jessé).
// Confere quadro a quadro se cada palavra de src/palavras.json está escrita na tela (do início + 0,1 s ao fim menos os
// 2 quadros do corte), usando palavrasNaTela() do Corte.tsx. Também acusa: pedaço < 1,5 s, palavra < 0,4 s visível
// depois de nascer, palavra exibida mais de uma vez, mais de 2 posições da legenda padrão e bloco com mais de 4 linhas.
// 2ª rodada (2026-10-12): zona segura das redes em 9:16. Renderiza só os textos (prop soTexto, fundo transparente) a
// cada 0,1 s, sem e com prévias, e acusa qualquer pixel de texto (alfa > 128) fora de ZONA do Corte.tsx. Usa a trava
// <estúdio>/.tmp/render.lock (espera se outro agente estiver renderizando; NÃO rode dentro do com-trava.sh).
// uso: node scripts/cobertura.mjs   (sai com erro se algum check falhar)
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('.tmp-cobertura.mjs');
await build({
	stdin: {contents: "export {palavrasNaTela, exibicoes, LEG_Y, LEG_Y2, QUEIXO_PREVIAS, ZONA, P as PB} from './src/Corte.tsx';", resolveDir: process.cwd(), loader: 'ts'},
	bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error',
	jsx: 'automatic', loader: {'.json': 'json'},
	plugins: [{name: 'stub', setup(b) {
		b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
		b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
	}}],
});
const {palavrasNaTela, exibicoes, PB, ZONA, LEG_Y2, QUEIXO_PREVIAS} = await import('file://' + tmp.replace(/\\/g, '/'));
fs.rmSync(tmp);
const P = PB.palavras;
const FPS = 30;
const buracos = [];
P.forEach((p, i) => {
	let f0 = Math.ceil((p.de + 0.1) * FPS);
	let f1 = Math.floor((p.ate - 0.07) * FPS);
	if (f1 < f0) f0 = f1 = Math.round(((p.de + p.ate) / 2) * FPS);
	const faltam = [];
	for (let f = f0; f <= f1; f++) if (!palavrasNaTela(f / FPS).includes(i)) faltam.push((f / FPS).toFixed(2));
	if (faltam.length) buracos.push(`${i} "${p.texto}" (${p.de}-${p.ate}s) sem texto em ${faltam.join(', ')}`);
});
console.log(`${P.length} palavras, ${buracos.length} com buraco`);
buracos.forEach((b) => console.log('  ' + b));

const MIN_PEDACO = 1.5, MIN_PALAVRA = 0.4, MAX_LINHAS = 4;
const ex = exibicoes();
const curtos = [];
for (const e of ex) {
	const dur = e.ate - e.de;
	if (dur < MIN_PEDACO) curtos.push(`"${e.nome}" ${dur.toFixed(2)} s`);
	for (const i of e.is) if (e.ate - P[i].de < MIN_PALAVRA) curtos.push(`"${P[i].texto}" em "${e.nome}" só ${(e.ate - P[i].de).toFixed(2)} s`);
}
const vezes = P.map(() => 0);
ex.forEach((e) => e.is.forEach((i) => vezes[i]++));
const repetidas = vezes.flatMap((v, i) => (v > 1 ? [`${i} "${P[i].texto}" ${v}x`] : []));
const posicoes = [...new Set(ex.filter((e) => e.tipo === 'legenda').map((e) => e.y))];
const noRosto = LEG_Y2 < QUEIXO_PREVIAS + 20 ? [`legenda y ${LEG_Y2} bate no queixo descido (y ${QUEIXO_PREVIAS})`] : [];
console.log(`legenda das prévias em y ${LEG_Y2}, queixo descido em y ${Math.round(QUEIXO_PREVIAS)}: ${noRosto.length ? 'BATE' : 'livre'}`);
const longos = ex.filter((e) => e.linhas > MAX_LINHAS).map((e) => `"${e.nome}" ${e.linhas} linhas`);
console.log(`${ex.length} pedaços, ${curtos.length} curtos (mín. ${MIN_PEDACO} s por pedaço, ${MIN_PALAVRA} s por palavra)`);
curtos.forEach((c) => console.log('  ' + c));
console.log(`${repetidas.length} palavras exibidas mais de uma vez`); repetidas.forEach((c) => console.log('  ' + c));
console.log(`${posicoes.length} posição(ões) da legenda padrão: ${posicoes.join(', ')} (máx. 2)`);
console.log(`${longos.length} blocos com mais de ${MAX_LINHAS} linhas (maior: ${Math.max(...ex.map((e) => e.linhas))})`); longos.forEach((c) => console.log('  ' + c));
[...ex].sort((a, b) => a.de - b.de).forEach((e) => console.log(`  ${e.de.toFixed(2)}-${e.ate.toFixed(2)} ${e.tipo} [${e.linhas} l] ${e.nome}`));

/* ---- zona segura: pixels de texto fora da zona */
const {bundle} = await import('@remotion/bundler');
const {renderStill, selectComposition} = await import('@remotion/renderer');
const {spawnSync} = await import('node:child_process');
const RAIZ = path.resolve('../..'); // a raiz do estúdio (o molde fica em moldes/<m>/ ou videos/<v>/)
const TRAVA = path.join(RAIZ, '.tmp', 'render.lock');
process.env.TEMP = process.env.TMP = path.join(RAIZ, '.tmp');
for (;;) {
	try { fs.mkdirSync(TRAVA); break; } catch { console.log('trava ocupada, esperando...'); await new Promise((r) => setTimeout(r, 20000)); }
}
const dir = path.resolve('.tmp-zona');
fs.rmSync(dir, {recursive: true, force: true});
fs.mkdirSync(dir);
let fora = [];
try {
	const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
	for (const previas of [false, true]) {
		const props = {previas, nomesPrevias: ['modelodinamico01', 'storypodcast01'], fundoCor: false, soTexto: true};
		const comp = await selectComposition({serveUrl: serve, id: 'VitrinePregacao', inputProps: props});
		for (let f = 0; f < comp.durationInFrames; f += 3) {
			await renderStill({composition: comp, serveUrl: serve, output: path.join(dir, `${previas ? 'p' : 's'}_${String(f).padStart(4, '0')}.png`), frame: f, inputProps: props, imageFormat: 'png', scale: 0.5});
		}
	}
	const py = `
import sys, glob, os
from PIL import Image
d, t, b, e, r = sys.argv[1], *map(int, sys.argv[2:])
for f in sorted(glob.glob(os.path.join(d, '*.png'))):
    a = Image.open(f).convert('RGBA').getchannel('A').point(lambda v: 255 if v > 128 else 0)
    bb = a.getbbox()
    if not bb: continue
    x0, y0, x1, y1 = [v * 2 for v in bb]
    if y0 < t or y1 > b or x0 < e or x1 > r:
        print(f"{os.path.basename(f)} texto em x {x0}-{x1}, y {y0}-{y1}")
`;
	const res = spawnSync(path.join(RAIZ, '.venv', 'Scripts', 'python.exe'), ['-c', py, dir, String(ZONA.topo), String(ZONA.base), String(ZONA.esq), String(ZONA.dir)], {encoding: 'utf8'});
	if (res.status !== 0) throw new Error(res.stderr);
	fora = res.stdout.trim().split('\n').filter(Boolean);
} finally {
	fs.rmSync(TRAVA, {recursive: true, force: true});
}
fs.rmSync(dir, {recursive: true, force: true});
console.log(`${fora.length} quadros com texto fora da zona segura (y ${ZONA.topo}-${ZONA.base}, x ${ZONA.esq}-${ZONA.dir})`);
fora.forEach((c) => console.log('  ' + c));
process.exit(buracos.length || curtos.length || repetidas.length || posicoes.length > 2 || noRosto.length || longos.length || fora.length ? 1 : 0);
