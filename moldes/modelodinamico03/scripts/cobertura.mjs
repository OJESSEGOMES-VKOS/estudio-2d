// Conferidor do modelodinamico03: lê o plano de src/Reel.tsx e confere as regras de ofício (REGRAS.md §3 e §5) e as do
// modelo. Sai com código 1 quando reprova e diz o que mexer (arquivo:linha). Rode de dentro da pasta do vídeo (ou de
// qualquer lugar: os caminhos partem deste arquivo).
// uso: node scripts/cobertura.mjs
// Confere: toda palavra escrita na tela enquanto é dita (0 buracos), pedaço >= 1,5 s, palavra >= 0,4 s depois de nascer,
// nenhuma palavra exibida duas vezes, legenda em até 2 linhas e em no máximo 2 posições, nenhum texto no rosto, destaque
// sem bater na legenda, tudo na zona segura e destaque >= 85% do tamanho padrão; com e sem prévias (se o plano tem prévias).
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const MOLDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTE = path.join(MOLDE, 'src', 'Reel.tsx');
const LINHAS_FONTE = fs.readFileSync(FONTE, 'utf8').split('\n');
/** linha de src/Reel.tsx onde o trecho aparece (para a mensagem dizer onde mexer) */
const onde = (trecho) => {
	const i = LINHAS_FONTE.findIndex((l) => l.includes(trecho));
	return i < 0 ? 'src/Reel.tsx' : `src/Reel.tsx:${i + 1}`;
};
// o temporário mora no .tmp do estúdio (2 níveis acima) e sai sempre, mesmo com erro
const TMP = path.resolve(MOLDE, '..', '..', '.tmp');
fs.mkdirSync(TMP, {recursive: true});
const tmp = path.join(TMP, `cobertura-${process.pid}.mjs`);
let R;
try {
	await build({
		stdin: {contents: "export * from './src/Reel.tsx'; export {default as PB} from './src/palavras.json';", resolveDir: MOLDE, loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'silent',
		jsx: 'automatic', loader: {'.json': 'json'}, absWorkingDir: MOLDE,
		// a fonte e o Remotion não importam para a lógica; só o necessário para o módulo carregar
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^@remotion\/google-fonts/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'});", loader: 'js'}));
		}}],
	});
	R = await import(pathToFileURL(tmp).href);
} catch (e) {
	const msg = (e.errors?.length ? e.errors.map((x) => `${x.location ? `${path.relative(MOLDE, x.location.file)}:${x.location.line}: ` : ''}${x.text}`).join('\n') : e.message) || String(e);
	const crase = msg.match(/`([^`]+)`/);
	console.error(msg + (crase ? `\n(${onde(crase[1])})` : ''));
	process.exitCode = 1;
} finally {
	fs.rmSync(tmp, {force: true});
}
if (!R) process.exit(1);

const {palavrasNaTela, exibicoes, LEG_Y, LEG_Y2, PREVIAS, ZONA, caixas, queixoMax, lugarAbertura, lugarBloco, lugarFecho, BLOCOS, DURACAO, FPS, PB, PADRAO, CAM, ORIGEM, zoomEm, emPrevias, queixoBruto, ajusteEm, surge} = R;
const L_PEDACOS = onde('const PEDACOS');
/** linha do elemento: o pedaço pelo texto, o bloco pela 1ª palavra */
const linhaDe = (e) => (e.tipo === 'legenda' ? onde(`'${e.nome}'`) : e.nome === 'abertura' ? onde('const ABERTURA') : e.nome.startsWith('fecho') ? onde('const FECHO_DEF') : onde(`primeira: ${e.ids[0]},`));
const fmt = (x) => x.toFixed(2).replace('.', ',');

// 1. cobertura: cada palavra escrita na tela enquanto é dita (do início + 0,1 s ao fim menos os 2 quadros do corte)
const buracos = [];
PB.forEach((p, i) => {
	let f0 = Math.ceil((p.start + 0.1) * FPS);
	let f1 = Math.floor((p.end - 0.07) * FPS); // os 2 últimos quadros são o corte, que antecipa a palavra seguinte
	if (f1 < f0) f0 = f1 = Math.round(((p.start + p.end) / 2) * FPS); // palavra curta: confere o meio dela
	const faltam = [];
	for (let f = f0; f <= f1; f++) if (!palavrasNaTela(f / FPS).includes(i)) faltam.push(fmt(f / FPS));
	if (faltam.length) buracos.push(`${i} "${p.text}" (${fmt(p.start)}-${fmt(p.end)} s) sem texto em ${faltam.join(', ')} s: ponha a palavra num pedaço de PEDACOS (${L_PEDACOS}) ou num bloco`);
});
console.log(`${PB.length} palavras, ${buracos.length} com buraco`);
buracos.forEach((b) => console.log('  ' + b));

// 2. tempo de leitura (REGRAS §3): pedaço >= 1,5 s na tela e palavra >= 0,4 s depois de nascer; repetição; linhas
const MIN_PEDACO = 1.5, MIN_PALAVRA = 0.4, MAX_LINHAS_LEG = 2, MAX_LINHAS = 4;
const ex = exibicoes();
const curtos = [], linhas = [];
for (const e of ex) {
	const dur = e.ate - e.de;
	if (dur < MIN_PEDACO) curtos.push(`"${e.nome}" fica ${fmt(dur)} s (${linhaDe(e)}): junte com o vizinho ou estenda até ${MIN_PEDACO} s`);
	for (const i of e.ids)
		if (e.ate - PB[i].start < MIN_PALAVRA)
			curtos.push(`"${PB[i].text}" em "${e.nome}" fica só ${fmt(e.ate - PB[i].start)} s (${linhaDe(e)}): o pedaço some cedo depois dela; termine o pedaço antes dela (ela passa para o seguinte) ou junte os dois`);
	if (e.tipo === 'legenda' && e.linhas > MAX_LINHAS_LEG) linhas.push(`"${e.nome}" tem ${e.linhas} linhas (${linhaDe(e)}): no máximo ${MAX_LINHAS_LEG} neste modelo; divida o pedaço`);
}
BLOCOS.forEach((b) => { if (b.linhas.length + (b.carimbo ? 1 : 0) > MAX_LINHAS) linhas.push(`bloco de primeira ${b.primeira} tem mais de ${MAX_LINHAS} linhas (${onde(`primeira: ${b.primeira},`)})`); });
const vezes = PB.map(() => 0);
ex.forEach((e) => e.ids.forEach((i) => vezes[i]++));
const repetidas = vezes.flatMap((v, i) => (v > 1 ? [`${i} "${PB[i].text}" ${v} vezes: tire-a de um dos pedaços/blocos (cada trecho aparece uma vez só)`] : []));

// 3. posições, rosto, choque e zona segura (REGRAS §3 e §5), quadro a quadro, sem e com prévias:
// - legenda em repouso só em LEG_Y (a da regra) ou LEG_Y2 (2ª posição, pé em 1500); no meio só na ida/volta;
// - o topo de todo texto fica abaixo do queixo medido (+ FOLGA_ROSTO); destaque e legenda nunca se cruzam;
// - todo texto dentro de x ZONA.esq–ZONA.dir e y ZONA.topo–ZONA.base (60–940, 250–1500).
const FOLGA_ROSTO = 20;
const posicoes = new Set(), noRosto = [], batidas = [], foraZona = [];
// o plano da câmera em t: das chaves de CAM, do último corte seco até a chave antes do próximo (uma chave por linha)
const L_CAM = LINHAS_FONTE.findIndex((l) => l.includes('const CAM'));
const txtChave = (j) => (LINHAS_FONTE[L_CAM + 1 + j] ?? '').trim().replace(/,$/, '');
const planoCam = (t) => {
	let a = CAM.reduce((i, k, j) => (t >= k[0] ? j : i), 0);
	while (a > 0 && !CAM[a][2]) a--; // o plano começa no corte seco (ou no início)
	let b = a;
	while (b + 1 < CAM.length && !CAM[b + 1][2]) b++; // e vai até a chave antes do próximo corte seco
	return {a, b, de: CAM[a][0], ate: CAM[b][0]};
};
// texto no rosto: o conserto certo depende de quem está no rosto e por quê
const conserto = (c, t, previas) => {
	if (c.tipo === 'legenda') {
		if (emPrevias(t, previas)) return `nas prévias a câmera desce DESCE px: a legenda usa a 2ª posição (LEG_Y2 ${LEG_Y2})`;
		if (ajusteEm(t)) return 'a câmera deste trecho está ajustada para um destaque: faça o camera do bloco cobrir só o plano dele';
		// legenda parada na posição dela: o zoom deste plano empurra o queixo medido para dentro dela
		const p = planoCam(t), bruto = queixoBruto(p.de, p.ate);
		const zmax = Math.floor(((Math.min(c.y0, LEG_Y) - FOLGA_ROSTO - ORIGEM.y) / (bruto - ORIGEM.y)) * 100) / 100;
		const chaves = Array.from({length: p.b - p.a + 1}, (_, k) => `${onde(txtChave(p.a + k))} ${txtChave(p.a + k)}`).join(' e ');
		return `o zoom ${zoomEm(t).toFixed(2)} deste plano (${fmt(p.de)}-${fmt(p.ate)} s) leva o queixo medido (src/rosto.json) para dentro da legenda; abra o plano: zoom no máximo ${zmax.toFixed(2)} nas chaves de CAM ${chaves}`;
	}
	const b = BLOCOS.find((x) => t >= surge(x.de) && t < x.ate && c.nome === x.linhas.map((q) => q.map((y) => y[2]).join(' ')).join(' / '));
	if (b && (t < b.camera[0] || t >= b.camera[1]))
		return `o bloco está na tela fora do plano que a câmera ajusta para ele (camera: [${fmt(b.camera[0])}, ${fmt(b.camera[1])}] s, ${onde(`primeira: ${b.primeira},`)}): o camera vai do corte em que o bloco começa ao corte em que ele termina (o bloco fica de ${fmt(b.de)} a ${fmt(b.ate)} s)`;
	return 'aproxime/suba a câmera do plano (camera do bloco, CAM) ou use menos linhas';
};
const anota = (lista, chave, txt) => { if (!lista.some((x) => x.k === chave)) lista.push({k: chave, txt}); };
const modos = PREVIAS ? [false, true] : [false];
for (const previas of modos) {
	const modo = previas ? 'com prévias' : 'sem prévias';
	for (let f = 0; f < Math.round(DURACAO * FPS); f++) {
		const t = f / FPS, cs = caixas(t, previas), q = queixoMax(t, t + 0.011, previas); // o próprio quadro (ate - 0,01 = t)
		for (const c of cs) {
			if (c.tipo === 'legenda') posicoes.add(Math.round(c.y0));
			if (c.tipo !== 'nome' && c.y0 < q + FOLGA_ROSTO) anota(noRosto, modo + c.nome + (c.tipo === 'legenda' ? planoCam(t).a : ''), `${modo} "${c.nome}" em ${fmt(t)} s: topo ${Math.round(c.y0)}, queixo ${Math.round(q)}: ${conserto(c, t, previas)}`);
			if (c.x0 < ZONA.esq - 0.5 || c.x1 > ZONA.dir + 0.5 || c.y0 < ZONA.topo || c.y1 > ZONA.base + 0.5)
				anota(foraZona, modo + c.nome, `${modo} "${c.nome}" em ${fmt(t)} s: x ${Math.round(c.x0)}-${Math.round(c.x1)}, y ${Math.round(c.y0)}-${Math.round(c.y1)}: quebre a linha (' / ') ou diminua o tamanho dela`);
		}
		const leg = cs.find((c) => c.tipo === 'legenda');
		for (const d of cs.filter((c) => c.tipo === 'destaque'))
			if (leg && d.y0 < leg.y1 + 10 && d.y1 > leg.y0 - 10) anota(batidas, modo + d.nome + leg.nome, `${modo} "${d.nome}" (${Math.round(d.y0)}-${Math.round(d.y1)}) x legenda ${Math.round(leg.y0)}-${Math.round(leg.y1)} em ${fmt(t)} s: o pedaço não pode estar na tela junto com o bloco nessa altura; mude onde ele começa/termina`);
	}
}
const repouso = [...posicoes].filter((y) => y === LEG_Y || y === LEG_Y2);
const intermed = [...posicoes].filter((y) => y !== LEG_Y && y !== LEG_Y2);
console.log(`${ex.length} pedaços, ${curtos.length} curtos (mín. ${MIN_PEDACO} s por pedaço, ${MIN_PALAVRA} s por palavra)`);
curtos.forEach((c) => console.log('  ' + c));
console.log(`${repetidas.length} palavras exibidas mais de uma vez`); repetidas.forEach((c) => console.log('  ' + c));
console.log(`${linhas.length} pedaços/blocos com linhas demais`); linhas.forEach((c) => console.log('  ' + c));
console.log(`posições de repouso da legenda: ${repouso.join(', ')} (regra ${LEG_Y}, 2ª ${LEG_Y2}); ${intermed.length} valores de passagem na ida/volta`);
console.log(`${noRosto.length} textos no rosto`); noRosto.forEach((c) => console.log('  ' + c.txt));
console.log(`${batidas.length} destaques batendo na legenda`); batidas.forEach((c) => console.log('  ' + c.txt));
console.log(`${foraZona.length} textos fora da zona segura (x ${ZONA.esq}-${ZONA.dir}, y ${ZONA.topo}-${ZONA.base})`); foraZona.forEach((c) => console.log('  ' + c.txt));

// 4. tamanho (5ª rodada): destaque não encolhe para caber; abre-se o plano. Todo destaque >= 85% do padrão (PADRAO).
const ESC_MIN = 0.85 * PADRAO, pequenos = [];
for (const previas of modos) {
	const lista = [['abertura', lugarAbertura(), onde('const ABERTURA')], ...BLOCOS.map((b) => [b.linhas.map((q) => q.map((x) => x[2]).join(' ')).join(' / '), lugarBloco(b, previas), onde(`primeira: ${b.primeira},`)]), ['fecho', lugarFecho(), onde('const FECHO_DEF')]];
	for (const [nome, l, lin] of lista) {
		if (!l) continue; // peça desligada no plano
		if (!previas) console.log(`  ${nome}: y ${l.top}-${Math.round(l.fundo)}, escala ${l.escala.toFixed(2)} (${Math.round((l.escala / PADRAO) * 100)}% do padrão)`);
		if (l.escala < ESC_MIN - 1e-9) pequenos.push(`${previas ? 'com' : 'sem'} prévias "${nome}" escala ${l.escala.toFixed(2)} (${lin}): a linha mais larga não cabe em ${ZONA.dir - ZONA.esq} px; quebre-a em duas`);
	}
}
console.log(`${pequenos.length} destaques abaixo de 85% do padrão (${PADRAO})`); pequenos.forEach((c) => console.log('  ' + c));
ex.forEach((e) => console.log(`  ${fmt(e.de)}-${fmt(e.ate)} ${e.tipo} ${e.nome}`));
const reprova = buracos.length || curtos.length || repetidas.length || linhas.length || repouso.length > 2 || noRosto.length || batidas.length || foraZona.length || pequenos.length;
console.log(reprova ? 'REPROVADO: corrija o que está acima e rode de novo.' : 'APROVADO: 0 em todas as regras.');
process.exit(reprova ? 1 : 0);
