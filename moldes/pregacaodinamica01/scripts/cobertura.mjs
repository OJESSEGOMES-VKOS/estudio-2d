// Cobertura de falas (a mesma ideia do checador do modelodinamico03, 2026-10-12, pedido do Jessé).
// Confere quadro a quadro se cada palavra de src/palavras.json está escrita na tela (do início + 0,1 s ao fim menos os
// 2 quadros do corte), usando palavrasNaTela() do Corte.tsx. Também acusa: pedaço < 1,5 s, palavra < 0,4 s visível
// depois de nascer, palavra exibida mais de uma vez, mais de 2 posições da legenda padrão e bloco com mais de 4 linhas.
// 2ª rodada (2026-10-12): zona segura das redes em 9:16. Renderiza só os textos (prop soTexto, fundo transparente) a
// cada 0,1 s, sem prévias e (se o plano tem a janela das prévias) com prévias, e acusa qualquer pixel de texto (alfa > 128)
// fora de ZONA do Corte.tsx. Usa a trava <estúdio>/.tmp/render.lock (espera se outro agente estiver renderizando; NÃO
// rode dentro do com-trava.sh). Apaga os temporários mesmo quando dá erro.
// uso: node scripts/cobertura.mjs   (sai com código 1 se algum check falhar ou se o plano não bater com a fala)
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('.tmp-cobertura.mjs');
let M;
try {
	await build({
		stdin: {contents: "export {palavrasNaTela, exibicoes, LEG_Y, LEG_Y2, LEG_Y_AUTO, LEG_Y_PLANO, LEG_QUEIXO, QUEIXO_PREVIAS, ZONA, TEM_PREVIAS, CREME, FIM_VIDEO, BLOCOS, R, queixoEm, trechoEm, alturaBloco, P as PB} from './src/Corte.tsx';", resolveDir: process.cwd(), loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error',
		jsx: 'automatic', loader: {'.json': 'json'},
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
		}}],
	});
	M = await import('file://' + tmp.replace(/\\/g, '/'));
} catch (e) {
	// o plano não bate com a fala: o Corte.tsx para ao carregar com a mensagem do que refazer; aqui ganha a linha da lista
	let msg = String(e?.message ?? e).split('\n')[0];
	const lista = /Na lista (\w+)/.exec(msg)?.[1];
	const n = lista ? fs.readFileSync('src/Corte.tsx', 'utf8').split('\n').findIndex((l) => new RegExp(`^(export )?const ${lista}\\b`).test(l)) : -1;
	if (n >= 0) msg = msg.replace(`Na lista ${lista}`, `Na lista ${lista} (src/Corte.tsx, linha ${n + 1})`);
	fs.rmSync(tmp, {force: true}); // o exit não passa pelo finally
	console.error(msg);
	process.exit(1);
} finally {
	fs.rmSync(tmp, {force: true});
}
const {palavrasNaTela, exibicoes, PB, ZONA, LEG_Y, LEG_Y2, LEG_Y_AUTO, LEG_Y_PLANO, LEG_QUEIXO, QUEIXO_PREVIAS, TEM_PREVIAS, CREME, FIM_VIDEO, BLOCOS, R, queixoEm, trechoEm, alturaBloco} = M;
const FONTE = fs.readFileSync('src/Corte.tsx', 'utf8').split('\n');
const linha = (trecho) => { const i = FONTE.findIndex((l) => l.includes(trecho)); return i < 0 ? 'src/Corte.tsx' : `src/Corte.tsx:${i + 1}`; };
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
if (buracos.length) console.log('  -> ponha essas palavras numa página de PEDACOS ou num bloco que esteja na tela enquanto elas são ditas');

const MIN_PEDACO = 1.5, MIN_PALAVRA = 0.4, MAX_LINHAS = 4;
const ex = exibicoes();
const curtos = [];
for (const e of ex) {
	const dur = e.ate - e.de;
	if (dur < MIN_PEDACO && e.nome.startsWith('letreiro')) curtos.push(`"${e.nome}" ${dur.toFixed(2)} s: o letreiro vai da palavra dele até o próximo trecho de T (${e.ate.toFixed(2)} s; perto do fim, o fecho); escolha uma palavra mais cedo ou ponha o próximo trecho mais tarde`);
	else if (dur < MIN_PEDACO) curtos.push(`"${e.nome}" ${dur.toFixed(2)} s`);
	for (const i of e.is) if (e.ate - P[i].de < MIN_PALAVRA) curtos.push(`"${P[i].texto}" em "${e.nome}" só ${(e.ate - P[i].de).toFixed(2)} s`);
}
const vezes = P.map(() => 0);
ex.forEach((e) => e.is.forEach((i) => vezes[i]++));
const repetidas = vezes.flatMap((v, i) => (v > 1 ? [`${i} "${P[i].texto}" ${v}x`] : []));
const posicoes = [...new Set(ex.filter((e) => e.tipo === 'legenda').map((e) => e.y))];
const noRosto = TEM_PREVIAS && LEG_Y2 < QUEIXO_PREVIAS + 20 ? [`legenda y ${LEG_Y2} bate no queixo descido (y ${QUEIXO_PREVIAS})`] : [];
if (TEM_PREVIAS) console.log(`legenda das prévias em y ${LEG_Y2}, queixo descido em y ${Math.round(QUEIXO_PREVIAS)}: ${noRosto.length ? 'BATE (suba DESCE ou desça LEG_Y2)' : 'livre'}`);
const longos = ex.filter((e) => e.linhas > MAX_LINHAS).map((e) => `"${e.nome}" ${e.linhas} linhas`);

/* ---- rosto (REGRAS §5): a legenda e os blocos ficam abaixo do queixo medido (R.queixo de src/rosto.json, com o zoom de ENQ) */
const FOLGA_ROSTO = 20, fmt = (x) => x.toFixed(2);
const sobreVideo = (t) => !(CREME && t >= CREME.cheio && t < CREME.ate);
/** o queixo mais baixo em [de, ate) sobre o vídeo, com o trecho de ENQ em que ele cai */
const queixoNo = (de, ate) => {
	let m = {y: 0, t: de};
	for (let f = Math.ceil(de * FPS); f < Math.min(ate, FIM_VIDEO) * FPS; f++) if (sobreVideo(f / FPS) && queixoEm(f / FPS) > m.y) m = {y: queixoEm(f / FPS), t: f / FPS};
	return m;
};
/** maior zoom de ENQ para o trecho de t que deixa o queixo FOLGA_ROSTO acima de y até t (o zoom anda 0,012/s no plano) */
const zoomMax = (y, t) => { const tr = trechoEm(t); return Math.floor(((y - FOLGA_ROSTO - 700) / (R.queixo - 700) - (t - tr.de) * 0.012) * 100) / 100; };
const dizTrecho = (t) => { const tr = trechoEm(t); return `o trecho ${tr.nome} de ENQ (${linha(`[T.${tr.nome},`)}, zoom ${tr.zoom})`; };
const noQueixo = [];
console.log(`legenda padrão em y ${LEG_Y} (${LEG_Y_PLANO === null ? 'automática' : `fixa em LEG_Y_PLANO; a automática daria ${LEG_Y_AUTO}`}); queixo mais baixo com legenda: y ${Math.round(LEG_QUEIXO.y)} em ${fmt(LEG_QUEIXO.t)} s (zoom ${fmt(LEG_QUEIXO.zoom)})`);
if (LEG_Y < LEG_QUEIXO.y + FOLGA_ROSTO) noQueixo.push(`a legenda (y ${LEG_Y}) bate no queixo (y ${Math.round(LEG_QUEIXO.y)} em ${fmt(LEG_QUEIXO.t)} s): deixe LEG_Y_PLANO = null (${linha('const LEG_Y_PLANO')}) para ela ir para y ${LEG_Y_AUTO}`);
if (LEG_Y + 2 * 60 * 1.16 > ZONA.base) noQueixo.push(`a legenda em y ${LEG_Y} passa de y ${ZONA.base} com 2 linhas: o queixo está baixo demais nesse zoom; ${dizTrecho(LEG_QUEIXO.t)} vai até ${fmt(zoomMax(ZONA.base - 2 * 60 * 1.16 - 70 + FOLGA_ROSTO, LEG_QUEIXO.t))} para a legenda caber`);
for (const b of BLOCOS) {
	if (b.creme) continue; // a tela creme cobre o vídeo
	const q = queixoNo(b.de, b.ate);
	if (q.y && b.top < q.y + FOLGA_ROSTO) {
		const z = zoomMax(b.top, q.t);
		noQueixo.push(`bloco "${b.nome}" (top ${b.top}, ${linha(`nome: '${b.nome}'`)}) cobre o queixo (y ${Math.round(q.y)} em ${fmt(q.t)} s): ` +
			(z >= 1 ? `abra o plano: ${dizTrecho(q.t)} no máximo ${fmt(z)}` : `nem com o plano aberto (zoom 1,0) o queixo sobe até ele; desça o top para ${Math.ceil(q.y + FOLGA_ROSTO)} e, se o fundo passar de ${ZONA.base}, tire uma linha do bloco`));
	}
}
const sobreCreme = CREME ? ex.filter((e) => e.tipo === 'legenda' && !e.aceito && e.de < CREME.visivel && e.ate > CREME.cheio).map((e) => `"${e.nome}" (${fmt(e.de)}-${fmt(e.ate)} s) fica sobre a tela creme (${fmt(CREME.cheio)}-${fmt(Math.min(CREME.visivel, FIM_VIDEO))} s): texto comum não entra nela (REGRAS §4); termine a página no trecho destaque (3º campo da página = T.destaque) ou comece-a depois`) : [];
console.log(`${ex.length} pedaços, ${curtos.length} curtos (mín. ${MIN_PEDACO} s por pedaço, ${MIN_PALAVRA} s por palavra)`);
curtos.forEach((c) => console.log('  ' + c));
if (curtos.length) console.log('  -> junte a página curta com a vizinha em PEDACOS, ou segure-a mais (o 3º campo da página, ou o trecho de T que a fecha)');
console.log(`${repetidas.length} palavras exibidas mais de uma vez`); repetidas.forEach((c) => console.log('  ' + c));
console.log(`${noQueixo.length} textos no rosto`); noQueixo.forEach((c) => console.log('  ' + c));
console.log(`${sobreCreme.length} páginas da legenda sobre a tela creme`); sobreCreme.forEach((c) => console.log('  ' + c));
if (repetidas.length) console.log('  -> cada palavra fica numa página ou num bloco só: tire-a de um deles (o letreiro já pula a palavra dele)');
console.log(`${posicoes.length} posição(ões) da legenda padrão: ${posicoes.join(', ')} (máx. 2)`);
console.log(`${longos.length} blocos com mais de ${MAX_LINHAS} linhas (maior: ${Math.max(...ex.map((e) => e.linhas))})`); longos.forEach((c) => console.log('  ' + c));
if (longos.length) console.log("  -> tire um 'quebra: true' dos itens do bloco (BLOCOS) ou divida a página");
[...ex].sort((a, b) => a.de - b.de).forEach((e) => console.log(`  ${e.de.toFixed(2)}-${e.ate.toFixed(2)} ${e.tipo} [${e.linhas} l] ${e.nome}`));

/* ---- zona segura: pixels de texto fora da zona */
const {bundle} = await import('@remotion/bundler');
const {renderStill, selectComposition} = await import('@remotion/renderer');
const {spawnSync} = await import('node:child_process');
const RAIZ = path.resolve('../..'); // a raiz do estúdio (o molde fica em moldes/<m>/ ou videos/<v>/)
const PY = ['Scripts/python.exe', 'bin/python'].map((x) => path.join(RAIZ, '.venv', x)).find((x) => fs.existsSync(x));
const TRAVA = path.join(RAIZ, '.tmp', 'render.lock');
process.env.TEMP = process.env.TMP = path.join(RAIZ, '.tmp');
fs.mkdirSync(path.join(RAIZ, '.tmp'), {recursive: true});
for (;;) {
	try { fs.mkdirSync(TRAVA); break; } catch { console.log('trava ocupada, esperando...'); await new Promise((r) => setTimeout(r, 20000)); }
}
const dir = path.resolve('.tmp-zona');
let fora = [];
let falhou = null;
try {
	fs.rmSync(dir, {recursive: true, force: true});
	fs.mkdirSync(dir);
	const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
	for (const previas of TEM_PREVIAS ? [false, true] : [false]) {
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
	if (!PY) throw new Error(`não achei o Python do estúdio em ${path.join(RAIZ, '.venv')} (rode o instalador)`);
	const res = spawnSync(PY, ['-c', py, dir, String(ZONA.topo), String(ZONA.base), String(ZONA.esq), String(ZONA.dir)], {encoding: 'utf8'});
	if (res.status !== 0) throw new Error(res.stderr);
	fora = res.stdout.trim().split('\n').filter(Boolean);
} catch (e) {
	falhou = e;
} finally {
	// como o com-trava.sh: com a trava na mão, o que o Remotion deixou no .tmp (cópia da public, pacote, perfil do
	// navegador) é deste render; apaga antes de soltar a trava, senão cada conferência deixa ~100 MB
	for (const n of fs.readdirSync(path.join(RAIZ, '.tmp')))
		if (/^(remotion-v.*-assets|remotion-webpack-bundle-|puppeteer_dev_chrome_profile-)/.test(n)) fs.rmSync(path.join(RAIZ, '.tmp', n), {recursive: true, force: true});
	fs.rmSync(TRAVA, {recursive: true, force: true});
	fs.rmSync(dir, {recursive: true, force: true});
}
if (falhou) {
	console.error('a conferência da zona segura não rodou: ' + String(falhou?.message ?? falhou).split('\n')[0]);
	process.exit(1);
}
console.log(`${fora.length} quadros com texto fora da zona segura (y ${ZONA.topo}-${ZONA.base}, x ${ZONA.esq}-${ZONA.dir})`);
fora.forEach((c) => console.log('  ' + c));
if (fora.length) console.log('  -> (p_ = com prévias, s_ = sem; quadro = nº/30 s) mova o bloco (top/left em BLOCOS) ou diminua o tam dos itens');
/* o bloco que passa do pé da zona: quanto subir (medido nos pixels) e se o queixo deixa, ou o zoom que abre o plano */
const passa = new Map();
for (const l of fora) {
	const m = /^[ps]_(\d+)\.png texto em x [\d.-]+-[\d.-]+, y [\d.-]+-([\d.-]+)/.exec(l);
	if (!m || Number(m[2]) <= ZONA.base) continue;
	const t = Number(m[1]) / FPS, b = BLOCOS.find((x) => t >= x.de && t < x.ate);
	if (b) passa.set(b, Math.max(passa.get(b) ?? 0, Number(m[2]) - ZONA.base));
}
for (const [b, dy] of passa) {
	const top = b.top - dy - 4, q = b.creme ? {y: 0} : queixoNo(b.de, b.ate);
	let txt = `  bloco "${b.nome}" (${linha(`nome: '${b.nome}'`)}, ~${Math.round(alturaBloco(b))} px de altura) passa ${dy} px do pé (y ${ZONA.base}): `;
	if (!q.y || top >= q.y + FOLGA_ROSTO) txt += `suba-o para top: ${top}`;
	else {
		const z = zoomMax(top, q.t);
		txt += z >= 1 ? `top: ${top} e abra o plano (o queixo vai a y ${Math.round(q.y)}): ${dizTrecho(q.t)} no máximo ${fmt(z)}` : `não cabe abaixo do queixo nem com o plano aberto (zoom 1,0); tire uma linha (um 'quebra: true') ou diminua os tam (os destaques do vídeo ficam todos no mesmo tamanho, REGRAS §4)`;
	}
	console.log(txt);
}
process.exit(buracos.length || curtos.length || repetidas.length || posicoes.length > 2 || noRosto.length || longos.length || fora.length || noQueixo.length || sobreCreme.length ? 1 : 0);
