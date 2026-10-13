// Checador do youtubeedition01. uso: node scripts/checar.mjs   (sai 1 se reprovar)
// Lê o plano de verdade (src/plano.ts, montado com o esbuild) e confere, com e sem prévias:
// - o plano é desta fala (cada tempo amarrado a uma palavra; senão para dizendo qual);
// - texto falado (ATRAS + FRASES juntos quando se sobrepõem, e o CTA): bloco >= 1,5 s e >= 1 s + 3 palavras/s,
//   cada palavra >= 0,4 s na tela depois de entrar, no máximo 4 linhas;
// - títulos e rótulos (nomes): >= 1 s + 3 palavras/s (um nome conta como uma palavra);
// - nada atravessa um corte seco (chave de câmera sem transição ou troca da montagem);
// - a duração cobre a fala.
// Sem legenda corrida neste modelo; as posições são as do desenho (MODELO §4), por isso a zona segura não é medida aqui.
// No fim, imprime o comando da trilha com os toques deste plano.
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('../../.tmp', `checar-youtubeedition01-${process.pid}.mjs`);
fs.mkdirSync(path.dirname(tmp), {recursive: true});
let P;
try {
	await build({
		entryPoints: ['src/plano.ts'],
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^remotion$/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: 'const f = () => (x) => x; export const Easing = {inOut: f, bezier: f, cubic: (x) => x, sin: (x) => x}; export const OffthreadVideo = null, staticFile = (s) => s;', loader: 'js'}));
		}}],
	});
	P = await import('file://' + tmp.replace(/\\/g, '/'));
} catch (e) {
	console.log('O PLANO NÃO BATE COM A FALA (ou não monta):\n ', String(e.message ?? e).trim());
	process.exitCode = 1;
} finally {
	fs.rmSync(tmp, {force: true});
}
if (!P) process.exit(1);

const {ATRAS, FRASES, TITULOS, GRADE, GRADES, MONTAGEM, REEL, ESTE, PREVIAS, CTA, DURACAO_Q, PS, chaves} = P;
const FPS = 30;
const fim = DURACAO_Q / FPS;
const erros = [];
const n = (s) => s.trim().split(/\s+/).length;

const conferir = (previas) => {
	const cortes = chaves(previas).filter(([t, , d]) => d === 0 && t > 0).map(([t]) => t);
	for (const [a, b] of MONTAGEM?.planos ?? []) cortes.push(a, b);
	// texto falado: [nome, de, ate, linhas, tempos de entrada de cada palavra]
	let fala = [
		...ATRAS.map((a) => [`atrás "${a.linhas.join(' ')}"`, a.de, a.ate, a.linhas.length, a.linhas.flatMap((l, i) => Array(n(l)).fill(a.de + i * 0.1))]),
		...FRASES.map((f) => [`frase "${[...f.linha1, ...f.linha2].map((p) => p[0]).join(' ')}"`, f.de, f.ate, 2, [...f.linha1, ...f.linha2].flatMap(([p, t]) => Array(n(p)).fill(t))]),
	].sort((x, y) => x[1] - y[1]);
	const juntos = [];
	for (const b of fala) {
		const u = juntos[juntos.length - 1];
		if (u && b[1] < u[2]) juntos[juntos.length - 1] = [`${u[0]} + ${b[0]}`, u[1], Math.max(u[2], b[2]), u[3] + b[3], [...u[4], ...b[4]]];
		else juntos.push(b);
	}
	if (CTA) juntos.push([`pedido "${CTA.antes} ${CTA.chave[0]} ${CTA.depois[0]}"`, CTA.de, fim, 3, [CTA.de, ...Array(n(CTA.chave[0])).fill(CTA.chave[1]), ...Array(n(CTA.depois[0])).fill(CTA.depois[1])]]);
	const nomes = [
		...TITULOS.map((d) => [`título "${d.linhas.join(' ')}"`, d.de, d.ate]),
		...GRADES.map((g) => [`nomes da grade (${g.de.toFixed(2)} s)`, g.par ? g.par.varios + 0.3 : g.de + 0.37, g.ate]).filter(() => GRADE.length),
		...(REEL ? [['@ da tela de reels (com a prop arroba)', REEL.de + 0.15, REEL.ate]] : []),
		...(ESTE ? [[`rótulo "${ESTE.rotulo}"`, ESTE.de, ESTE.ate]] : []),
		...(previas && PREVIAS ? [['nomes das prévias', PREVIAS.entra + 0.12, PREVIAS.ate]] : []),
	];
	const modo = previas ? 'com prévias' : 'sem prévias';
	const linha = (nome, de, ate, precisa, ok) => console.log(`  ${nome.padEnd(46).slice(0, 46)} ${de.toFixed(2).padStart(6)}-${ate.toFixed(2).padStart(6)}  ${(ate - de).toFixed(2)} s / ${precisa.toFixed(2)} s  ${ok ? 'OK' : 'REPROVA'}`);
	console.log(modo);
	for (const [nome, de, ate, linhas, ps] of juntos) {
		const precisa = Math.max(1.5, 1 + ps.length / 3);
		const ok = ate - de >= precisa - 0.01;
		linha(nome, de, ate, precisa, ok);
		if (!ok) erros.push(`${modo}: ${nome} fica ${(ate - de).toFixed(2)} s, precisa de ${precisa.toFixed(2)} s: segure até uma palavra depois ou junte com a frase seguinte`);
		const curta = ps.find((t) => ate - t < 0.4 - 1e-6);
		if (curta !== undefined) erros.push(`${modo}: ${nome}: uma palavra entra em ${curta.toFixed(2)} s e fica só ${(ate - curta).toFixed(2)} s (< 0,4)`);
		if (linhas > 4) erros.push(`${modo}: ${nome}: ${linhas} linhas (máx. 4)`);
		const c = cortes.filter((x) => de < x && x < ate - 1e-6);
		if (c.length) erros.push(`${modo}: ${nome} atravessa o corte seco em ${c.map((x) => x.toFixed(2)).join(', ')} s`);
	}
	for (const [nome, de, ate] of nomes) {
		const ok = ate - de >= 1 + 1 / 3 - 0.01;
		linha(nome, de, ate, 1 + 1 / 3, ok);
		if (!ok) erros.push(`${modo}: ${nome} fica ${(ate - de).toFixed(2)} s (precisa de 1,33 s)`);
		const c = cortes.filter((x) => de < x && x < ate - 1e-6);
		if (c.length) erros.push(`${modo}: ${nome} atravessa o corte seco em ${c.map((x) => x.toFixed(2)).join(', ')} s`);
	}
};
conferir(false);
if (PREVIAS) conferir(true);
const ultima = PS[PS.length - 1].end;
if (fim < ultima) erros.push(`a duração (${fim.toFixed(2)} s) corta a fala, que acaba em ${ultima.toFixed(2)} s`);

console.log(erros.length ? 'PROBLEMAS:\n  ' + erros.join('\n  ') : 'sem problemas');
const f2 = (x) => String(Math.round(x * 100) / 100);
const sopros = [...GRADES.map((g) => g.de), ...(REEL ? [REEL.de] : [])].sort((a, b) => a - b);
const toques = [...ATRAS.slice(0, 1).map((a) => a.de), ...TITULOS.map((d) => d.de), ...(CTA ? [CTA.chave[1]] : [])].sort((a, b) => a - b);
console.log(`trilha (opcional) deste plano: ../../.venv/Scripts/python.exe scripts/trilha.py${sopros.length ? ' --sopros ' + sopros.map(f2).join(' ') : ''}${toques.length ? ' --toques ' + toques.map(f2).join(' ') : ''}`);
process.exit(erros.length ? 1 : 0);
