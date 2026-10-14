// Sincronia e regras de legenda (2026-10-12; tempos de leitura do antigo tempos.py entraram aqui em 2026-10-13).
// uso: node scripts/sincronia.mjs  (sai 1 se algo falhar ou se o plano não bater com a fala; diz o que mexer)
// - cada palavra nasce no seu start de src/palavras.json (±2 quadros); a 2ª palavra de um destaque também;
// - cada corte cai no start da 1ª palavra do plano novo (±2 quadros); nenhum bloco atravessa um corte;
// - toda fala na tela, cada palavra uma vez; máx. 4 linhas por bloco; legenda padrão em ≤ 2 posições (bloco só de
//   pequenas que divide o tempo com um bloco de palavra-chave faz parte do destaque, não é legenda padrão);
// - tempo de leitura (REGRAS §3): bloco ≥ 1,5 s e cada palavra ≥ 0,4 s na tela; palavra-chave completa ≥ 0,8 s
//   (superpodcast01.md §13, só aviso); terço inferior ≥ 1,5 s. Bloco com `aceito` no plano foi aprovado abaixo da régua (a
//   vitrine segue o ritmo da fala): sai como aviso. Num vídeo novo, nenhum bloco leva `aceito`;
// - zona segura 9:16: y 250–1500 (texto pequeno: y ± ~0,6 corpo; destaque: até 220 px de corpo), x 60–940 (estimado);
// - nenhum texto no rosto (REGRAS §5) nos mundos que mostram a gravação: rosto, dividida e arquivo sem a imagem (que vira
//   a gravação inteira); o rosto sai de src/rosto.json com o enquadramento do plano;
// - avisa a mídia que falta em public/: cards de src/cards.json (o molde desenha um quadro no lugar) e imagens dos planos.
// Apaga o temporário sempre.
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const tmp = path.resolve('.tmp-sincronia.mjs');
let C;
try {
	await build({
		stdin: {contents: "export {conferencia} from './src/Reel.tsx';", resolveDir: process.cwd(), loader: 'ts'},
		bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', jsx: 'automatic', loader: {'.json': 'json'},
		plugins: [{name: 'stub', setup(b) {
			b.onResolve({filter: /^(@remotion\/google-fonts|remotion$)/}, (a) => ({path: a.path, namespace: 'stub'}));
			b.onLoad({filter: /.*/, namespace: 'stub'}, () => ({contents: "export const loadFont = () => ({fontFamily: 'x'}); export const Easing = {bezier: () => (x) => x}; export const interpolate = () => 0; export const random = () => 0; export const staticFile = (x) => x; export const getStaticFiles = () => []; export const AbsoluteFill = null, Img = null, OffthreadVideo = null, Sequence = null, continueRender = () => {}, delayRender = () => 0, useCurrentFrame = () => 0;", loader: 'js'}));
		}}],
	});
	({conferencia: C} = await import(pathToFileURL(tmp).href));
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
const Q = 2 / 30 + 1e-6, erros = [], avisos = [];
const MIN_BLOCO = 1.5, MIN_PALAVRA = 0.4, MIN_CHAVE = 0.8;
const cortes = C.PLANOS.slice(1).map((p) => p.de);
const idsDe = (l) => (l.tipo === 'k' ? [l.id, ...(l.id2 !== undefined ? [l.id2] : [])] : l.ids);
for (const prev of [false, true]) {
	const BL = C.blocos(prev), modo = prev ? 'com prévias' : 'sem prévias', vezes = C.PS.map(() => 0), posicoes = new Set();
	for (const b of BL) {
		if (b.linhas.length > 4) erros.push(`${modo}: bloco ${b.de} com ${b.linhas.length} linhas -> divida o bloco`);
		const ids = [];
		for (const l of b.linhas) {
			const lids = idsDe(l);
			ids.push(...lids);
			for (const id of lids) {
				const nasce = Math.max(C.PS[id].de, b.de), d = nasce - C.PS[id].de;
				if (Math.abs(d) > Q) erros.push(`${modo}: "${C.PS[id].texto}" nasce ${nasce.toFixed(2)} s, dita ${C.PS[id].de} (${Math.round(d * 30)} quadros) -> comece o bloco (e o corte) no start dela`);
				if (C.PS[id].de >= b.ate) erros.push(`${modo}: "${C.PS[id].texto}" dita depois do bloco sumir`);
			}
			const corpo = l.tipo === 'k' ? Math.min(220, (0.74 * C.W) / (0.55 * (l.texto ?? C.PS[l.id].texto).length)) : C.FS, y0 = l.y - corpo * 0.62, y1 = l.y + corpo * 0.68;
			if (y0 < 250 || y1 > 1500) erros.push(`${modo}: linha "${lids.map((i) => C.PS[i].texto).join(' ')}" fora da zona (y ${Math.round(y0)}-${Math.round(y1)}) -> mude o y`);
			if (l.tipo === 'p' && l.al === 'c') { const w = lids.map((i) => C.PS[i].texto).join(' ').length * C.FS * 0.52; if ((C.W - w) / 2 < 60) erros.push(`${modo}: linha "${lids.map((i) => C.PS[i].texto).join(' ')}" larga demais -> quebre em duas linhas`); }
		}
		// tempo de leitura e corte (uma vez só: os tempos não mudam com as prévias)
		if (!prev && ids.length) {
			const nome = ids.map((i) => C.PS[i].texto).join(' ');
			const nota = (txt) => (b.aceito ? avisos : erros).push(txt + (b.aceito ? ` (aceito no plano: ${b.aceito})` : ''));
			const t0 = Math.min(...ids.map((i) => Math.max(C.PS[i].de, b.de)));
			if (b.ate - t0 < MIN_BLOCO - 1e-6) nota(`bloco "${nome}" fica ${(b.ate - t0).toFixed(2)} s (mín. ${MIN_BLOCO}) -> junte com o bloco vizinho do mesmo plano`);
			for (const i of ids) {
				const fica = b.ate - Math.max(C.PS[i].de, b.de);
				if (fica < MIN_PALAVRA - 1e-6) nota(`"${C.PS[i].texto}" fica ${fica.toFixed(2)} s em "${nome}" (mín. ${MIN_PALAVRA}) -> segure o bloco ou passe a palavra para o seguinte`);
			}
			for (const l of b.linhas.filter((x) => x.tipo === 'k')) {
				const txt = l.texto ?? C.PS[l.id].texto;
				const completa = Math.max(C.PS[l.id].de, b.de) + Math.min(0.47, Math.max(0.33, txt.length * 0.035));
				if (b.ate - completa < MIN_CHAVE - 1e-6) avisos.push(`palavra-chave "${txt}" completa fica ${(b.ate - completa).toFixed(2)} s (mín. ${MIN_CHAVE}) -> escolha uma palavra dita antes no plano`);
			}
			const cruza = cortes.filter((c) => b.de < c - 1e-6 && c < b.ate - 1e-6);
			if (cruza.length) erros.push(`bloco "${nome}" atravessa o corte em ${cruza.join(', ')} s -> acabe o bloco no corte`);
		}
		const temChave = (o) => o.linhas.some((l) => l.tipo === 'k');
		const doDestaque = !temChave(b) && BL.some((o) => o !== b && temChave(o) && o.de < b.ate && b.de < o.ate);
		if (b.linhas.some((l) => l.tipo === 'p') && !temChave(b) && !doDestaque) posicoes.add(b.linhas.find((l) => l.tipo === 'p').y);
		ids.forEach((i) => vezes[i]++);
	}
	vezes.forEach((v, i) => { if (v !== 1 && C.PS[i].texto.trim()) erros.push(`${modo}: "${C.PS[i].texto}" (${i}) aparece ${v}x -> ponha a palavra em exatamente um bloco`); });
	if (posicoes.size > 2) erros.push(`${modo}: legenda padrão em ${posicoes.size} posições (${[...posicoes].join(', ')}) -> use no máximo 2 valores de y`);
	for (const p of C.PLANOS.slice(1)) {
		const ids = BL.filter((b) => Math.abs(b.de - p.de) < 1e-6).flatMap((b) => b.linhas.flatMap(idsDe));
		if (!ids.length) { erros.push(`${modo}: o plano ${p.id} (${p.de} s) não tem bloco que comece nele`); continue; }
		const w = Math.min(...ids.map((i) => C.PS[i].de));
		if (!(Math.abs(w - p.de) <= Q)) erros.push(`${modo}: corte ${p.id} em ${p.de} s, 1ª palavra em ${w} s -> ponha o corte no start da palavra`);
	}
}
for (const tc of C.TERCOS) if (tc.ate - tc.de < MIN_BLOCO - 1e-6) erros.push(`terço inferior de ${tc.de} s fica ${(tc.ate - tc.de).toFixed(2)} s (mín. ${MIN_BLOCO})`);

// texto no rosto: caixa estimada de cada linha visível contra a caixa do rosto, quadro a quadro (a cada 2 quadros)
const existe = (arq) => fs.existsSync(path.join('public', arq));
const noRosto = new Map();
for (const prev of [false, true]) {
	const BL = C.blocos(prev), modo = prev ? 'com prévias' : 'sem prévias';
	for (let f = 0; f < Math.round(C.DURACAO * 30); f += 2) {
		const t = f / 30, r = C.rostoNaTela(t, prev, existe);
		if (!r) continue;
		for (const b of BL) {
			if (t < b.de || t >= b.ate) continue;
			const k = b.linhas.find((l) => l.tipo === 'k');
			const kTxt = k ? k.texto ?? C.PS[k.id].texto : '';
			const kPx = k ? Math.min(220, (0.74 * C.W) / (0.55 * kTxt.length)) : 0, kW = k ? Math.min(0.74 * C.W, kTxt.length * 0.55 * kPx) : 0.7 * C.W;
			for (const l of b.linhas) {
				const ids = idsDe(l);
				if (t < Math.max(C.PS[ids[0]].de, b.de)) continue; // ainda não nasceu
				const txt = l.tipo === 'k' ? kTxt : ids.map((i) => C.PS[i].texto).join(' ');
				const corpo = l.tipo === 'k' ? kPx : C.FS, w = l.tipo === 'k' ? kW : txt.length * C.FS * 0.52;
				const x0 = l.tipo === 'k' || l.al === 'c' ? (C.W - w) / 2 : l.al === 'kwL' ? (C.W - kW) / 2 + kPx * 0.12 : (C.W + kW) / 2 - w;
				const y0 = l.y - corpo * 0.42, y1 = l.y + corpo * 0.38; // a tinta das letras, sem a entrelinha
				if (y0 < r.y1 - 25 && y1 > r.y0 + 25 && x0 < r.x1 && x0 + w > r.x0) { // 25 px de tolerância: a caixa do rosto (rosto.json) passa um pouco do queixo
					const chave = `${modo}|${b.de}|${txt}`;
					if (noRosto.has(chave)) continue;
					const abaixo = Math.ceil(r.y1 + corpo * 0.42 + 20);
					const como = r.mundo === 'arquivo'
						? (r.img ? `o plano ${r.plano} é de arquivo e public/${r.img} não existe, então mostra a gravação inteira: ponha a imagem em public/${r.img}, ou o y da linha em ${abaixo} ou mais (abaixo do queixo)` : `o plano ${r.plano} é de arquivo sem img (mostra a gravação inteira): dê a ele uma imagem (img) ou ponha o y da linha em ${abaixo} ou mais (abaixo do queixo)`)
						: `ponha o y da linha em ${abaixo} ou mais (abaixo do queixo) ou acima da cabeça, ou mude o enquadramento q do plano ${r.plano}`;
					noRosto.set(chave, {aceito: b.aceito, txt: `${modo}: "${txt}" (y ${Math.round(y0)}-${Math.round(y1)}) cobre o rosto (y ${Math.round(r.y0)}-${Math.round(r.y1)}) no plano ${r.plano} (${r.mundo}) em ${t.toFixed(2)} s -> ${como}` + (b.aceito ? ` (aceito no plano: ${b.aceito})` : '')});
				}
			}
		}
	}
}
for (const n of noRosto.values()) (n.aceito ? avisos : erros).push(n.txt);

// terço inferior (nome e @): a faixa vermelha e o texto mono ocupam de x do terço até a borda e 205 px de altura a
// partir do y; nenhuma linha visível pode cruzar essa caixa enquanto ele está na tela (com nome vazio ele não aparece,
// mas o aluno costuma preencher depois, então a conta vale sempre)
const terco = new Set();
for (const prev of [false, true]) {
	const BL = C.blocos(prev), modo = prev ? 'com prévias' : 'sem prévias';
	for (const tc of C.TERCOS) {
		const tx0 = tc.x * C.W, ty0 = tc.y * 1920, ty1 = ty0 + 205;
		for (const b of BL) {
			const k = b.linhas.find((l) => l.tipo === 'k');
			const kTxt = k ? k.texto ?? C.PS[k.id].texto : '';
			const kPx = k ? Math.min(220, (0.74 * C.W) / (0.55 * kTxt.length)) : 0, kW = k ? Math.min(0.74 * C.W, kTxt.length * 0.55 * kPx) : 0.7 * C.W;
			for (const l of b.linhas) {
				const ids = idsDe(l);
				const nasce = Math.max(C.PS[ids[0]].de, b.de);
				if (!(nasce < tc.ate && tc.de < b.ate)) continue; // não estão na tela juntos
				const txt = l.tipo === 'k' ? kTxt : ids.map((i) => C.PS[i].texto).join(' ');
				const corpo = l.tipo === 'k' ? kPx : C.FS, w = l.tipo === 'k' ? kW : txt.length * C.FS * 0.52;
				const x0 = l.tipo === 'k' || l.al === 'c' ? (C.W - w) / 2 : l.al === 'kwL' ? (C.W - kW) / 2 + kPx * 0.12 : (C.W + kW) / 2 - w;
				const y0 = l.y - corpo * 0.62, y1 = l.y + corpo * 0.68;
				if (y0 < ty1 && y1 > ty0 && x0 + w > tx0) {
					const acima = Math.floor(y0 - 205 - 20), abaixo = Math.ceil(y1 + 20);
					terco.add(`${modo}: o terço inferior de ${tc.de} s (y ${Math.round(ty0)}-${Math.round(ty1)}) cruza "${txt}" (y ${Math.round(y0)}-${Math.round(y1)}) -> no TERCOS de src/Reel.tsx, ponha y em ${(acima / 1920).toFixed(3)} ou menos, ou em ${(abaixo / 1920).toFixed(3)} ou mais (fora da linha), ou mude o de/ate`);
				}
			}
		}
	}
}
for (const n of terco) erros.push(n);

// mídia que falta: o vídeo sai (plano B), mas não é o que o plano descreve
const cardsFalta = [];
for (const [mundo, lista] of Object.entries(C.CARTOES)) for (const n of lista ?? []) if (!existe(`cards/${n}.jpg`)) cardsFalta.push(`${mundo}: ${n}`);
if (cardsFalta.length) avisos.push(`src/cards.json lista ${cardsFalta.length} cards que não estão em public/cards/ (${cardsFalta.slice(0, 3).join(', ')}${cardsFalta.length > 3 ? ', ...' : ''}): o molde desenha um quadro escuro no lugar de cada um. Faça os cards com o seu material: da raiz do estúdio, .venv/Scripts/python.exe tools/cards.py videos/<pasta deste vídeo> (modelos/superpodcast01/superpodcast01.md, "Como fazer um vídeo novo")`);
for (const p of C.PLANOS) {
	if (p.img && !existe(p.img)) avisos.push(`o plano ${p.id} (${p.mundo}) usa img '${p.img}', que não está em public/: sai a gravação em tom de arquivo (plano B); veja se o texto dele não cai no rosto`);
	if (p.mundo === 'palco' && !existe('palco.png')) avisos.push(`o plano ${p.id} é de palco e não há public/palco.png: sai o palco desenhado pelo molde (o padrão sem IA)`);
}
console.log(`${erros.length} erros`); erros.forEach((e) => console.log('  ' + e));
if (avisos.length) { console.log(`${avisos.length} avisos (palavra-chave curta, ou bloco aceito no plano)`); avisos.forEach((e) => console.log('  ' + e)); }
process.exit(erros.length ? 1 : 0);
