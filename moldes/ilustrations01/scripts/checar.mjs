// Checador das frases do ilustrations01 (MODELO §3 e §11, lições do BRIEF). uso: node scripts/checar.mjs
// Confere: tempo de leitura (>= 1 s + 3 palavras/s depois de digitada, e >= 1,5 s no total), uma frase por vez com
// 0,4 s de vão, entrada no início de uma palavra (±2 quadros), aspas tipográficas nas falas, nome de modelo escrito,
// travessão, e a virada entre 60 e 76% da duração.
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('.tmp-checar.mjs');
await build({
	stdin: {contents: "export {FRASES, MORAL, T, DURACAO, FPS} from './src/Reel.tsx'; export {default as PB} from './src/palavras.json';", resolveDir: process.cwd(), loader: 'ts'},
	bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
	plugins: [{name: 'stub', setup(b) {
		b.onResolve({filter: /^(@remotion\/google-fonts\/.*|remotion)$/}, (a) => ({path: a.path, namespace: 'stub'}));
		b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: 'export const loadFont = () => ({fontFamily: "X"}); export const AbsoluteFill = null, Audio = null, OffthreadVideo = null, Sequence = null; export const random = () => 0.5, staticFile = (s) => s, useCurrentFrame = () => 0;', loader: 'js'}));
	}}],
});
const {FRASES, MORAL, T, DURACAO, FPS, PB} = await import('file://' + tmp.replace(/\\/g, '/'));
fs.rmSync(tmp);

const erros = [];
const ok = [];
const palavras = (s) => s.replace(/[“”]/g, '').trim().split(/\s+/).length;
const perto = (t) => PB.some((p) => Math.abs(p.start - t) <= 2 / FPS + 1e-6);
const todas = [...FRASES.map((f) => ({...f, tipo: 'fala'})), ...MORAL.map((f) => ({...f, tipo: 'moral', ate: Math.min(f.ate, DURACAO)}))];
for (const f of todas) {
	const n = palavras(f.txt);
	const precisa = 1 + n / 3;
	const fica = f.ate - (f.de + f.dig);
	const linha = `${f.txt}  ${f.de.toFixed(2)}–${f.ate.toFixed(2)} s, digita ${f.dig} s, fica ${fica.toFixed(2)} s (precisa ${precisa.toFixed(2)})`;
	(fica + 1e-6 >= precisa && f.ate - f.de >= 1.5 ? ok : erros).push(linha);
	if (!perto(f.de)) erros.push(`${f.txt}: entra em ${f.de.toFixed(2)} s, fora do início de uma palavra`);
	if (f.tipo === 'fala' && !(f.txt.startsWith('“') && f.txt.endsWith('”'))) erros.push(`${f.txt}: fala sem aspas tipográficas`);
	if (/ilustrations01/i.test(f.txt)) erros.push(`${f.txt}: nome do modelo escrito`);
	if (/—/.test(f.txt)) erros.push(`${f.txt}: travessão`);
	if (n > 7) erros.push(`${f.txt}: ${n} palavras (máx. 7)`);
}
for (let i = 1; i < FRASES.length; i++) {
	const vao = FRASES[i].de - FRASES[i - 1].ate;
	if (vao < 0.4 - 1e-6) erros.push(`vão de ${vao.toFixed(2)} s entre "${FRASES[i - 1].txt}" e "${FRASES[i].txt}"`);
}
const v = T.virada / DURACAO;
(v >= 0.6 && v <= 0.76 ? ok : erros).push(`virada em ${T.virada.toFixed(2)} s = ${(v * 100).toFixed(0)}% (alvo 60 a 76%)`);
const fecho = DURACAO - MORAL[0].de;
(fecho >= 3 ? ok : erros).push(`moral segura ${fecho.toFixed(2)} s (>= 3 s)`);
console.log('OK:\n  ' + ok.join('\n  '));
console.log(erros.length ? 'PROBLEMAS:\n  ' + erros.join('\n  ') : 'sem problemas');
process.exit(erros.length ? 1 : 0);
