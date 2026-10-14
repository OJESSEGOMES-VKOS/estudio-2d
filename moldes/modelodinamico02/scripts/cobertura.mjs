// Conferidor do modelodinamico02: confere o plano (CENAS de src/Cenas.tsx) contra a fala e o texto de cada tela contra as
// regras de ofício (modelos/modelodinamico02/modelodinamico02.md). Sai com código 1 quando reprova e diz o que mexer (arquivo:linha).
// uso (de dentro da pasta do vídeo ou do molde): node scripts/cobertura.mjs
// Confere: 1) toda palavra do plano (w('palavra', n) em src/) existe na fala e as linhas de cada tela seguem a fala;
// 2) tela >= 1,5 s; 3) palavra >= 0,4 s na tela depois de nascer; 4) até 4 linhas por tela; 5) o bloco de texto dentro da
// zona segura (x 60-940, y 250-1500), já com a aproximação da câmera no fim da tela. O texto dos heróis não é medido.
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const MOLDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(MOLDE, 'src');
const PB = JSON.parse(fs.readFileSync(path.join(SRC, 'palavras.json'), 'utf8'));
const limpa = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const fmt = (x) => x.toFixed(2).replace('.', ',');
const CENAS_SRC = fs.readFileSync(path.join(SRC, 'Cenas.tsx'), 'utf8').split('\n');
const onde = (trecho) => {
	const i = CENAS_SRC.findIndex((l) => l.includes(trecho));
	return i < 0 ? 'src/Cenas.tsx' : `src/Cenas.tsx:${i + 1}`;
};

/** declarações de topo de um arquivo (const/function): nome -> {de: 1ª linha, linhas} */
const declaracoes = (linhas) => {
	const out = new Map();
	let atual = null;
	linhas.forEach((l, i) => {
		const m = l.match(/^(?:export )?(?:const|function) (\w+)/);
		if (m) out.set(m[1], (atual = {de: i, linhas: []}));
		if (atual) atual.linhas.push(l);
	});
	return out;
};
/** o que é alcançável a partir das raízes (por nome citado), para não cobrar palavra de cena/herói que o plano não usa */
const alcancaveis = (mapa, raizes) => {
	const vistos = new Set(), fila = [...raizes];
	while (fila.length) {
		const n = fila.pop();
		if (vistos.has(n) || !mapa.has(n)) continue;
		vistos.add(n);
		const txt = mapa.get(n).linhas.join('\n');
		for (const outro of mapa.keys()) if (!vistos.has(outro) && new RegExp(`\\b${outro}\\b`).test(txt)) fila.push(outro);
	}
	return vistos;
};
// 1. as palavras do plano existem na fala (lista todas de uma vez, com a linha); só conta o herói que alguma tela de CENAS usa
const faltam = [];
const mapa = declaracoes(CENAS_SRC);
const vivas = alcancaveis(mapa, ['CENAS', 'Tela', 'cenaEm']);
const conta = (i) => [...mapa].some(([n, d]) => vivas.has(n) && i >= d.de && i < d.de + d.linhas.length);
CENAS_SRC.forEach((l, i) => {
	if (!conta(i)) return;
	for (const m of l.matchAll(/\bw\('([^'$]+)'(?:,\s*(\d+))?\)/g)) {
		const n = Number(m[2] ?? 1), tem = PB.filter((p) => limpa(p.text) === limpa(m[1])).length;
		if (tem < n) faltam.push(`src/Cenas.tsx:${i + 1}: ${m[0]} pede a ${n}ª vez que se diz "${m[1]}", e a fala ${tem ? `só tem ${tem}` : 'não tem nenhuma'}`);
	}
});
console.log(`${faltam.length} palavras dos heróis que a fala não tem`);
faltam.forEach((x) => console.log('  ' + x));

// carrega o plano (o mesmo código do vídeo); o temporário mora no .tmp do estúdio e sai sempre, mesmo com erro
const TMP = path.resolve(MOLDE, '..', '..', '.tmp');
fs.mkdirSync(TMP, {recursive: true});
const tmp = path.join(TMP, `cobertura-${process.pid}.mjs`);
let R;
try {
	await build({
		stdin: {contents: "export {CENAS} from './src/Cenas.tsx'; export {QUADROS, FPS} from './src/tema.ts';", resolveDir: MOLDE, loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'silent', jsx: 'automatic', loader: {'.json': 'json'}, absWorkingDir: MOLDE,
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
		}}],
	});
	R = await import(pathToFileURL(tmp).href);
} catch (e) {
	const msg = (e.errors?.length ? e.errors.map((x) => `${x.location ? `${path.relative(MOLDE, x.location.file)}:${x.location.line}: ` : ''}${x.text}`).join('\n') : e.message) || String(e);
	const token = msg.match(/a palavra `([^`]+)` das CENAS/);
	const i = token ? CENAS_SRC.findIndex((l) => l.includes("txt: '") && l.includes(token[1])) : -1;
	console.error(msg + (i >= 0 ? `\n(a 1ª tela com "${token[1]}": src/Cenas.tsx:${i + 1})` : ''));
	process.exitCode = 1;
} finally {
	fs.rmSync(tmp, {force: true});
}
if (!R || faltam.length) {
	console.log('REPROVADO: o plano é de outra fala. Refaça CENAS e os heróis de src/Cenas.tsx (modelos/modelodinamico02/modelodinamico02.md, §9 "Como fazer um vídeo novo").');
	process.exit(1);
}
const {CENAS, QUADROS, FPS} = R;
const FIM = QUADROS / FPS;
const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};
const fator = (l) => (l.fonte === 'script' ? 0.42 : l.fonte === 'serif' ? 0.42 : l.tam >= 120 ? 0.5 : 0.52); // largura média da letra (em)
const altura = (l) => (l.fonte === 'script' ? l.tam * 1.15 : l.tam >= 120 ? l.tam * 0.95 + 14 : l.tam * 1.15);

const curtos = [], linhas = [], fora = [];
for (const c of CENAS) {
	const ate = Math.min(c.ate, FIM), dur = ate - c.de, L = onde(`id: '${c.id}'`);
	if (dur < 1.5) curtos.push(`tela "${c.id}" fica ${fmt(dur)} s (${L}): junte com a vizinha ou comece a seguinte mais tarde`);
	for (const l of c.linhas) for (const p of l.palavras) if (!l.txt.startsWith('~') && ate - p.de < 0.4) curtos.push(`"${p.txt}" na tela "${c.id}" fica ${fmt(ate - p.de)} s (${L}): passe-a para a tela seguinte`);
	if (c.linhas.length > 4) linhas.push(`tela "${c.id}" com ${c.linhas.length} linhas (${L}): no máximo 4; divida em duas telas`);
	if (!c.linhas.length) continue;
	// a câmera aproxima 1,5% por segundo a partir do centro: mede no fim da tela, o maior tamanho
	const z = 1 + dur * 0.015, esc = (v, o) => o + (v - o) * z;
	const larg = Math.max(...c.linhas.map((l) => l.txt.replace(/~/g, '').length * l.tam * fator(l)));
	const x0 = c.alinha === 'left' ? 80 : 540 - larg / 2, x1 = c.alinha === 'left' ? 80 + larg : 540 + larg / 2;
	const y0 = c.topo, y1 = c.topo + c.linhas.reduce((s, l) => s + altura(l), 0);
	const [X0, X1, Y0, Y1] = [esc(x0, 540), esc(x1, 540), esc(y0, 960), esc(y1, 960)];
	if (X0 < ZONA.esq || X1 > ZONA.dir || Y0 < ZONA.topo || Y1 > ZONA.base)
		fora.push(`tela "${c.id}" (${L}): x ${Math.round(X0)}-${Math.round(X1)}, y ${Math.round(Y0)}-${Math.round(Y1)}: ${Y0 < ZONA.topo ? 'desça o topo' : Y1 > ZONA.base ? 'suba o topo ou use menos linhas' : 'diminua o tam da linha mais larga'}`);
}
console.log(`${CENAS.length} telas, ${fmt(FIM)} s`);
console.log(`${curtos.length} curtos (mín. 1,5 s por tela e 0,4 s por palavra)`); curtos.forEach((x) => console.log('  ' + x));
console.log(`${linhas.length} telas com mais de 4 linhas`); linhas.forEach((x) => console.log('  ' + x));
console.log(`${fora.length} telas fora da zona segura (largura estimada pelas letras)`); fora.forEach((x) => console.log('  ' + x));
const reprova = curtos.length || linhas.length || fora.length;
console.log(reprova ? 'REPROVADO: corrija o que está acima e rode de novo.' : 'APROVADO: 0 em todas as regras.');
process.exit(reprova ? 1 : 0);
