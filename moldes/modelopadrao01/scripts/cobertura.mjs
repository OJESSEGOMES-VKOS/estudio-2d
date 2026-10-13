// Conferidor do modelopadrao01: confere o texto dito na tela (legenda e títulos do editor e do celular) contra as regras
// de ofício (REGRAS.md §3 e §5). Sai com código 1 quando reprova e diz o que mexer (arquivo:linha).
// uso (de dentro da pasta do vídeo ou do molde): node scripts/cobertura.mjs
// Antes, o molde confere que src/tempos.json e src/rosto_med.json são desta fala (rode gerar_tempos.py e rosto.py).
// Confere, quadro a quadro, sem e com prévias: toda palavra dita escrita na tela enquanto é dita; página >= 1,5 s; palavra
// >= 0,4 s depois de aparecer; nenhuma palavra em dois lugares; até 2 linhas; as 2 posições da legenda; zona segura.
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const MOLDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fmt = (x) => x.toFixed(2).replace('.', ',');
const linha = (arq, trecho) => {
	const i = fs.readFileSync(path.join(MOLDE, arq), 'utf8').split('\n').findIndex((l) => l.includes(trecho));
	return i < 0 ? arq : `${arq}:${i + 1}`;
};
// carrega o plano (o mesmo código do vídeo); o temporário mora no .tmp do estúdio e sai sempre, mesmo com erro
const TMP = path.resolve(MOLDE, '..', '..', '.tmp');
fs.mkdirSync(TMP, {recursive: true});
const tmp = path.join(TMP, `cobertura-${process.pid}.mjs`);
let R;
try {
	await build({
		stdin: {
			contents: "export {PAGINAS, legendaEm, MIN_PAGINA} from './src/Legenda.tsx'; export {PAGINAS as PAG_ED, vida, paginaEm} from './src/Editor.tsx'; export {PAG_CEL, vidaCel} from './src/Cenas.tsx'; export {P, T, FPS} from './src/tema.ts';",
			resolveDir: MOLDE, loader: 'ts',
		},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'silent', jsx: 'automatic', loader: {'.json': 'json'}, absWorkingDir: MOLDE,
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
		}}],
	});
	R = await import(pathToFileURL(tmp).href);
} catch (e) {
	console.error((e.errors?.length ? e.errors.map((x) => `${x.location ? `${path.relative(MOLDE, x.location.file)}:${x.location.line}: ` : ''}${x.text}`).join('\n') : e.message) || String(e));
	process.exitCode = 1;
} finally {
	fs.rmSync(tmp, {force: true});
}
if (!R) process.exit(1);
const {PAGINAS, legendaEm, MIN_PAGINA, PAG_ED, vida, paginaEm, PAG_CEL, vidaCel, P, T, FPS} = R;
const PB = P.palavras;
const ids = (pal) => pal.map((p) => PB.indexOf(p));
const L_MIN = linha('src/Legenda.tsx', 'export const MIN_PAGINA');
const L_TIT = linha('scripts/gerar_tempos.py', 'titulos=dict(');
const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};
const LARG = {rosto: [110, 940, 68], pilula: [120, 930, 56], titulo: [80, 970, 74]}; // caixa x e fonte de cada lugar (src/Legenda.tsx, src/Editor.tsx)
const larguraTxt = (txt, fonte) => txt.length * fonte * 0.56; // Geist 800, estimada pelas letras
let reprova = false;

for (const previas of T.previas ? [false, true] : [false]) {
	const modo = previas ? 'com prévias' : 'sem prévias';
	const el = new Map(); // elemento -> {nome, ids, quadros, lugar, arq}
	const visto = PB.map(() => new Set()); // quadros em que cada palavra está escrita
	const nq = Math.ceil(T.duracao * FPS);
	for (let f = 0; f < nq; f++) {
		const t = f / FPS;
		const marca = (chave, nome, pal, lugar, todas) => {
			const e = el.get(chave) ?? {nome, ids: ids(pal), quadros: [], lugar: new Set(), todas};
			e.quadros.push(f);
			e.lugar.add(lugar);
			el.set(chave, e);
			pal.forEach((p, k) => { if (todas || t >= p.de - 0.02) visto[e.ids[k]].add(f); });
		};
		const lg = legendaEm(t, previas);
		if (lg) marca(`leg${lg.i}`, PAGINAS[lg.i].pal.map((p) => p.texto).join(' '), PAGINAS[lg.i].pal, lg.pilula ? 'pilula' : 'rosto', true);
		for (const [pre, pags, v] of [['ed', PAG_ED, vida(t)], ['cel', PAG_CEL, vidaCel(t)]]) {
			if (v <= 0) continue;
			const i = paginaEm(t, pags);
			if (i >= 0) marca(`${pre}${i}`, pags[i].pal.map((p) => p.texto).join(' '), pags[i].pal, 'titulo', false);
		}
	}
	const buracos = [], curtos = [], dobras = [], linhas = [], fora = [];
	PB.forEach((p, i) => {
		let f0 = Math.ceil((p.de + 0.1) * FPS), f1 = Math.floor((p.ate - 0.07) * FPS);
		if (f1 < f0) f0 = f1 = Math.round(((p.de + p.ate) / 2) * FPS);
		const sem = [];
		for (let f = f0; f <= f1; f++) if (!visto[i].has(f)) sem.push(fmt(f / FPS));
		if (sem.length) buracos.push(`${i} "${p.texto}" sem texto em ${sem.slice(0, 6).join(', ')}${sem.length > 6 ? '...' : ''} s`);
	});
	const vezes = PB.map(() => 0);
	for (const [chave, e] of el) {
		const titulo = !chave.startsWith('leg');
		const dur = e.quadros.length / FPS, fim = (e.quadros[e.quadros.length - 1] + 1) / FPS;
		const onde = titulo ? `títulos em ${L_TIT}` : `MIN_PAGINA = ${MIN_PAGINA} em ${L_MIN}`;
		if (dur < 1.5) curtos.push(`"${e.nome}" fica ${fmt(dur)} s (${onde})`);
		e.ids.forEach((i) => { vezes[i]++; if (fim - PB[i].de < 0.4) curtos.push(`"${PB[i].texto}" em "${e.nome}" fica ${fmt(fim - PB[i].de)} s (${onde})`); });
		for (const lugar of e.lugar) {
			const [x0, x1, fonte] = LARG[lugar];
			const caixa = x1 - x0, larg = larguraTxt(e.nome, fonte);
			const n = lugar === 'titulo' || MIN_PAGINA ? Math.ceil(larg / caixa) : 1;
			if (n > 2) linhas.push(`"${e.nome}" (${lugar}) com ~${n} linhas: ${titulo ? `menos palavras por página (${L_TIT})` : `diminua MIN_PAGINA (${L_MIN})`}`);
			const meio = (x0 + x1) / 2, l = Math.min(larg, caixa);
			if (meio - l / 2 < ZONA.esq || meio + l / 2 > ZONA.dir) fora.push(`"${e.nome}" (${lugar}): x ${Math.round(meio - l / 2)}-${Math.round(meio + l / 2)}: ${titulo ? `página mais curta (${L_TIT})` : 'página mais curta'}`);
		}
	}
	vezes.forEach((v, i) => { if (v > 1) dobras.push(`${i} "${PB[i].texto}" em ${v} lugares (legenda e título ao mesmo tempo?)`); });
	const lugares = new Set([...el].filter(([k]) => k.startsWith('leg')).flatMap(([, e]) => [...e.lugar]));
	console.log(`\n${modo}: ${el.size} páginas/títulos`);
	console.log(`${buracos.length} palavras sem texto na tela`); buracos.forEach((x) => console.log('  ' + x));
	console.log(`${curtos.length} curtos (mín. 1,5 s por página e 0,4 s por palavra)`); curtos.slice(0, 14).forEach((x) => console.log('  ' + x)); if (curtos.length > 14) console.log(`  ... e mais ${curtos.length - 14}`);
	console.log(`${dobras.length} palavras em mais de um lugar`); dobras.forEach((x) => console.log('  ' + x));
	console.log(`${linhas.length} páginas com mais de 2 linhas`); linhas.forEach((x) => console.log('  ' + x));
	console.log(`posições da legenda: ${[...lugares].join(', ')} (rosto: base em y 1190; pilula: na divisa, y 914)`);
	console.log(`${fora.length} textos fora da zona segura (x ${ZONA.esq}-${ZONA.dir}; os lugares em y já ficam entre ${ZONA.topo} e ${ZONA.base})`); fora.forEach((x) => console.log('  ' + x));
	if (buracos.length || curtos.length || dobras.length || linhas.length || fora.length || lugares.size > 2) reprova = true;
}
console.log(reprova ? '\nREPROVADO: corrija o que está acima e rode de novo.' : '\nAPROVADO: 0 em todas as regras.');
process.exit(reprova ? 1 : 0);
