// Cobertura de falas: para cada palavra de src/palavras.json, confere quadro a quadro (do início + 0,1 s ao fim da
// palavra menos os 2 quadros do corte, que antecipa a palavra seguinte) se ela está escrita na tela, usando palavrasNaTela() do Reel.tsx. Saída: lista de buracos (tem que ser zero).
// uso: node scripts/cobertura.mjs
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const tmp = path.resolve('.tmp-cobertura.mjs');
await build({
	stdin: {contents: "export {palavrasNaTela, exibicoes, LEG_Y, LEG_Y2, PREVIAS, ZONA, caixas, queixoMax, lugarAbertura, lugarBloco, lugarFecho, BLOCOS, DURACAO, FPS, PADRAO} from './src/Reel.tsx'; export {default as PB} from './src/palavras.json';", resolveDir: process.cwd(), loader: 'ts'},
	bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error',
	jsx: 'automatic', loader: {'.json': 'json'},
	// a fonte e o Remotion não importam para a lógica; só o necessário para o módulo carregar
	plugins: [{name: 'stub', setup(b) {
		b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
		b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
	}}],
});
const {palavrasNaTela, exibicoes, LEG_Y, LEG_Y2, PREVIAS, ZONA, caixas, queixoMax, lugarAbertura, lugarBloco, lugarFecho, BLOCOS, DURACAO, PB, PADRAO} = await import('file://' + tmp.replace(/\\/g, '/'));
fs.rmSync(tmp);
const FPS = 30;
const buracos = [];
PB.forEach((p, i) => {
	let f0 = Math.ceil((p.start + 0.1) * FPS);
	let f1 = Math.floor((p.end - 0.07) * FPS); // os 2 últimos quadros são o corte, que antecipa a palavra seguinte
	if (f1 < f0) f0 = f1 = Math.round(((p.start + p.end) / 2) * FPS); // palavra curta: confere o meio dela
	const faltam = [];
	for (let f = f0; f <= f1; f++) if (!palavrasNaTela(f / FPS).includes(i)) faltam.push((f / FPS).toFixed(2));
	if (faltam.length) buracos.push(`${i} "${p.text}" (${p.start}-${p.end}s) sem texto em ${faltam.join(', ')}`);
});
console.log(`${PB.length} palavras, ${buracos.length} com buraco`);
buracos.forEach((b) => console.log('  ' + b));

// 2ª rodada (2026-10-12): tempo mínimo, repetição, posições da legenda e legenda sem bater nos destaques.
// A régua da casa (1 s + 3 palavras/s) não cabe numa fala de 3,3 palavras/s com as palavras nascendo junto da voz;
// a régua aplicada: todo pedaço >= MIN_PEDACO s na tela e toda palavra >= MIN_PALAVRA s visível depois de nascer.
const MIN_PEDACO = 1.5, MIN_PALAVRA = 0.4;
const ex = exibicoes();
const curtos = [];
for (const e of ex) {
  const dur = e.ate - e.de;
  if (dur < MIN_PEDACO) curtos.push(`"${e.nome}" ${dur.toFixed(2)} s`);
  for (let i = e.i0; i < e.i0 + e.n; i++) if (e.ate - PB[i].start < MIN_PALAVRA) curtos.push(`"${PB[i].text}" em "${e.nome}" só ${(e.ate - PB[i].start).toFixed(2)} s`);
}
const vezes = PB.map(() => 0);
ex.forEach((e) => { for (let i = e.i0; i < e.i0 + e.n; i++) vezes[i]++; });
const repetidas = vezes.flatMap((v, i) => (v > 1 ? [`${i} "${PB[i].text}" ${v}x`] : []));
// 3ª e 4ª rodadas (2026-10-12), quadro a quadro nos dois modos (sem e com prévias), com as caixas de caixas() do Reel.tsx:
// - posição da legenda: em repouso só LEG_Y (1220, a da regra) ou LEG_Y2 (2ª posição, pé em 1500); no meio só na ida/volta;
// - rosto: o topo de todo texto fica abaixo do queixo medido (+ FOLGA_ROSTO);
// - choque: destaque e legenda nunca se cruzam;
// - zona segura: todo texto dentro de x ZONA.esq–ZONA.dir e y ZONA.topo–ZONA.base (60–940, 250–1500).
const FOLGA_ROSTO = 20;
const posicoes = new Set(), noRosto = [], batidas = [], foraZona = [];
const anota = (lista, chave, txt) => { if (!lista.some((x) => x.k === chave)) lista.push({k: chave, txt}); };
for (const previas of [false, true]) {
  const modo = previas ? 'com prévias' : 'sem prévias';
  for (let f = 0; f < Math.round(DURACAO * FPS); f++) {
    const t = f / FPS, cs = caixas(t, previas), q = queixoMax(t, t + 0.011, previas) // o próprio quadro (ate - 0,01 = t);
    for (const c of cs) {
      if (c.tipo === 'legenda') posicoes.add(Math.round(c.y0));
      if (c.tipo !== 'nome' && c.y0 < q + FOLGA_ROSTO) anota(noRosto, modo + c.nome, `${modo} "${c.nome}" em ${t.toFixed(2)}s: topo ${Math.round(c.y0)}, queixo ${Math.round(q)}`);
      if (c.x0 < ZONA.esq - 0.5 || c.x1 > ZONA.dir + 0.5 || c.y0 < ZONA.topo || c.y1 > ZONA.base + 0.5)
        anota(foraZona, modo + c.nome, `${modo} "${c.nome}" em ${t.toFixed(2)}s: x ${Math.round(c.x0)}-${Math.round(c.x1)}, y ${Math.round(c.y0)}-${Math.round(c.y1)}`);
    }
    const leg = cs.find((c) => c.tipo === 'legenda');
    for (const d of cs.filter((c) => c.tipo === 'destaque'))
      if (leg && d.y0 < leg.y1 + 10 && d.y1 > leg.y0 - 10) anota(batidas, modo + d.nome + leg.nome, `${modo} "${d.nome}" (${Math.round(d.y0)}-${Math.round(d.y1)}) x legenda ${Math.round(leg.y0)}-${Math.round(leg.y1)} em ${t.toFixed(2)}s`);
  }
}
const repouso = [...posicoes].filter((y) => [...posicoes].filter((z) => z === y).length && (y === LEG_Y || y === LEG_Y2));
const intermed = [...posicoes].filter((y) => y !== LEG_Y && y !== LEG_Y2);
console.log(`${ex.length} pedaços, ${curtos.length} curtos (mín. ${MIN_PEDACO} s por pedaço, ${MIN_PALAVRA} s por palavra)`);
curtos.forEach((c) => console.log('  ' + c));
console.log(`${repetidas.length} palavras exibidas mais de uma vez`); repetidas.forEach((c) => console.log('  ' + c));
console.log(`posições de repouso da legenda: ${repouso.join(', ')} (regra ${LEG_Y}, 2ª ${LEG_Y2}); ${intermed.length} valores de passagem na ida/volta`);
console.log(`${noRosto.length} textos no rosto`); noRosto.forEach((c) => console.log('  ' + c.txt));
console.log(`${batidas.length} destaques batendo na legenda`); batidas.forEach((c) => console.log('  ' + c.txt));
console.log(`${foraZona.length} textos fora da zona segura (x ${ZONA.esq}-${ZONA.dir}, y ${ZONA.topo}-${ZONA.base})`); foraZona.forEach((c) => console.log('  ' + c.txt));
// 5ª rodada (2026-10-12): destaque não encolhe para caber; abre-se o plano. Todo destaque >= 85% do tamanho padrão (PADRAO).
const ESC_MIN = 0.85 * PADRAO, pequenos = [];
for (const previas of [false, true])
for (const l of [['abertura', lugarAbertura()], ...BLOCOS.map((b) => [b.linhas.map((q) => q.map((x) => x[2]).join(' ')).join(' / '), lugarBloco(b, previas)]), ['fecho', lugarFecho()]]) {
  if (!previas) console.log(`  ${l[0]}: y ${l[1].top}-${Math.round(l[1].fundo)}, escala ${l[1].escala.toFixed(2)} (${Math.round((l[1].escala / PADRAO) * 100)}% do padrão)`);
  if (l[1].escala < ESC_MIN - 1e-9) pequenos.push(`${previas ? 'com' : 'sem'} prévias "${l[0]}" escala ${l[1].escala.toFixed(2)}`);
}
console.log(`${pequenos.length} destaques abaixo de 85% do padrão (${PADRAO})`); pequenos.forEach((c) => console.log('  ' + c));
ex.forEach((e) => console.log(`  ${e.de.toFixed(2)}-${e.ate.toFixed(2)} ${e.tipo} ${e.nome}`));
process.exit(buracos.length || curtos.length || repetidas.length || repouso.length > 2 || noRosto.length || batidas.length || foraZona.length || pequenos.length ? 1 : 0);
