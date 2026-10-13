// Checador das frases do ilustrations01 (MODELO §3 e §11, lições do BRIEF). uso: node scripts/checar.mjs  (sai 1 se reprovar)
// Lê o plano de verdade (src/plano.json, pelo src/Reel.tsx). Antes de tudo: o plano é desta fala (senão para dizendo o
// que refazer). Depois confere: tempo de leitura (>= 1 s + 3 palavras/s depois de digitada, o que já dá mais de 0,4 s a
// cada palavra, e >= 1,5 s no total), uma frase por vez com 0,4 s de vão, entrada no início de uma palavra (±2 quadros),
// aspas tipográficas nas falas, no máximo 7 palavras (uma linha só), largura dentro de x 60-940 (estimada: 0,64 do corpo
// por letra, medida nos quadros da vitrine), nome de modelo, travessão, a virada entre 60 e 76% da duração, a moral
// segurando >= 3 s e a duração cobrindo a fala. Só confere as partes que o plano tem.
// O temporário vai para ../../.tmp e é apagado mesmo se der erro.
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('../../.tmp', `checar-ilustrations01-${process.pid}.mjs`);
fs.mkdirSync(path.dirname(tmp), {recursive: true});
const publico = fs.existsSync('public') ? fs.readdirSync('public').map((name) => ({name})) : [];
let M;
try {
	await build({
		stdin: {contents: "export {FRASES, MORAL, T, DURACAO, FPS} from './src/Reel.tsx'; export {default as PB} from './src/palavras.json';", resolveDir: process.cwd(), loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^(@remotion\/google-fonts\/.*|remotion)$/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: `export const loadFont = () => ({fontFamily: "X"}); export const AbsoluteFill = null, Audio = null, OffthreadVideo = null, Sequence = null; export const random = () => 0.5, staticFile = (s) => s, useCurrentFrame = () => 0; export const getStaticFiles = () => ${JSON.stringify(publico)};`, loader: 'js'}));
		}}],
	});
	M = await import('file://' + tmp.split(path.sep).join('/'));
} catch (e) {
	console.log('O PLANO NÃO BATE COM A FALA (ou não monta):\n ', String(e.message ?? e).trim());
} finally {
	fs.rmSync(tmp, {force: true});
}
if (!M) process.exit(1);
const {FRASES, MORAL, T, DURACAO, FPS, PB} = M;

const erros = [];
const ok = [];
const palavras = (s) => s.replace(/[“”]/g, '').trim().split(/\s+/).length;
const perto = (t) => PB.some((p) => Math.abs(p.start - t) <= 2 / FPS + 1e-6);
const todas = [...FRASES.map((f) => ({...f, tipo: 'fala', corpo: 34})), ...MORAL.map((f) => ({...f, tipo: 'moral', corpo: 34, ate: Math.min(f.ate, DURACAO)}))];
for (const f of todas) {
	const n = palavras(f.txt);
	const precisa = 1 + n / 3;
	const fica = f.ate - (f.de + f.dig);
	const linha = `${f.txt}  ${f.de.toFixed(2)}–${f.ate.toFixed(2)} s, digita ${f.dig} s, fica ${fica.toFixed(2)} s (precisa ${precisa.toFixed(2)})`;
	(fica + 1e-6 >= precisa && f.ate - f.de >= 1.5 ? ok : erros).push(linha + (fica + 1e-6 >= precisa && f.ate - f.de >= 1.5 ? '' : ': segure até mais tarde ou encurte a frase'));
	if (!perto(f.de)) erros.push(`${f.txt}: entra em ${f.de.toFixed(2)} s, fora do início de uma palavra`);
	if (f.tipo === 'fala' && !(f.txt.startsWith('“') && f.txt.endsWith('”'))) erros.push(`${f.txt}: fala sem aspas tipográficas`);
	if (/ilustrations01/i.test(f.txt)) erros.push(`${f.txt}: nome do modelo escrito`);
	if (/—/.test(f.txt)) erros.push(`${f.txt}: travessão`);
	if (n > 7) erros.push(`${f.txt}: ${n} palavras (máx. 7)`);
	const larg = [...f.txt].length * 0.64 * f.corpo;
	if (540 - larg / 2 < 60 || 540 + larg / 2 > 940) erros.push(`${f.txt}: ~${Math.round(larg)} px de largura, sai da zona segura (x 60-940): encurte a frase`);
}
for (let i = 1; i < FRASES.length; i++) {
	const vao = FRASES[i].de - FRASES[i - 1].ate;
	if (vao < 0.4 - 1e-6) erros.push(`vão de ${vao.toFixed(2)} s entre "${FRASES[i - 1].txt}" e "${FRASES[i].txt}"`);
}
if (T.virada !== null) {
	const v = T.virada / DURACAO;
	(v >= 0.6 && v <= 0.76 ? ok : erros).push(`virada em ${T.virada.toFixed(2)} s = ${(v * 100).toFixed(0)}% (alvo 60 a 76%)`);
}
if (MORAL.length) {
	const fecho = DURACAO - MORAL[0].de;
	(fecho >= 3 ? ok : erros).push(`moral segura ${fecho.toFixed(2)} s (>= 3 s)`);
}
const ultima = PB[PB.length - 1].end;
if (DURACAO < ultima) erros.push(`a duração (${DURACAO.toFixed(2)} s) corta a fala, que acaba em ${ultima.toFixed(2)} s: aumente "cauda" em src/plano.json`);
console.log('OK:\n  ' + ok.join('\n  '));
console.log(erros.length ? 'PROBLEMAS:\n  ' + erros.join('\n  ') : 'sem problemas');
process.exit(erros.length ? 1 : 0);
