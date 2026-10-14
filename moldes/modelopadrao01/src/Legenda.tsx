import React from 'react';
import {C, DISPLAY, DIVISA, E, MIN_PAGINA, NOVO, P, T, blocoDe, noCelular, noEditor, pDividido, tw, usePrevias, useT} from './tema';
import {PAGINAS as PAG_ED} from './Editor';
import {PAG_CEL} from './Cenas';
import {queixoTela} from './Rosto';

/**
 * Legenda falada. Um lugar por modo, sempre o mesmo (o olho aprende onde ler):
 * - rosto cheio: sem tarja, texto claro com sombra, base em y 1190 (vídeo novo: topo logo abaixo do queixo medido do
 *   trecho, crescendo para baixo, para a 2ª linha nunca subir no queixo);
 * - tela dividida: na divisa, numa pílula verde escura (texto claro some no marfim);
 * - no editor e no celular: sem legenda, o título no topo já é o texto dito.
 * Página: até 3 palavras, quebra em pontuação, mínimo 12 quadros, máximo 2 s (vídeo novo: tempo de leitura, ver otimo).
 * Palavra ativa em menta.
 */
type Pal = {texto: string; de: number; ate: number};
type Pagina = {pal: Pal[]; de: number; ate: number};

export {MIN_PAGINA}; // a chave do vídeo novo mora em src/tema.ts
const MAX_LETRAS = 40; // ~2 linhas na caixa da legenda
const LER_PALAVRA = 0.4; // cada palavra fica pelo menos isso depois de aparecer...
const LER_ULTIMA = 0.25; // ...menos a última de uma página que já ficou MIN_PAGINA na tela (não é palavra solta)

/** vídeo novo: as zonas de título (editor e celular). Nelas quem conta a fala é o título no topo; a legenda some do
 * instante em que o título aparece até as camadas começarem a sair, sem janela vazia nas bordas */
type Zona = {de: number; ate: number; ids: Set<number>};
const ZONAS: Zona[] = [
	[T.editor, PAG_ED],
	[T.celular, PAG_CEL],
].flatMap(([s, pags]) => {
	const sc = s as {de: number; devolve: number} | null;
	const pg = pags as {pal: Pal[]; de: number}[];
	if (!sc || !pg.length) return [];
	return [{de: Math.max(pg[0].de - 0.05, sc.de - 0.35), ate: sc.devolve - 0.05, ids: new Set(pg.flatMap((g) => g.pal.map((p) => P.palavras.indexOf(p))))}];
});
const naZona = (t: number) => ZONAS.some((z) => t >= z.de && t < z.ate);

/** vídeo novo: os instantes em que a página tem de quebrar (cortes de enquadramento, entrada e saída do dividido) */
const QUEBRAS = [
	...T.blocos.slice(1),
	...[T.modelos, T.previas, T.prompt].flatMap((s) => (s ? [s.de, s.sai] : [])),
	...ZONAS.flatMap((z) => [z.de, z.ate]),
].sort((x, y) => x - y);

/** vídeo novo: em cada trecho entre quebras, escolhe as páginas que menos ferem as regras (página >= MIN_PAGINA, cada
 * palavra >= 0,4 s, a última >= 0,25 s se a página já tem MIN_PAGINA, até MAX_LETRAS), preferindo quebrar em pontuação
 * ou pausa. A página fica até a próxima começar; a última do trecho, até a quebra (nunca atravessa corte nem troca de
 * modo). As palavras ditas numa zona de título não entram na legenda. */
const otimo = (ps: Pal[]): Pagina[] => {
	const livres = ps.map((p, i) => ({p, i})).filter(({i}) => !ZONAS.some((z) => z.ids.has(i)));
	const trechos: Pal[][] = [];
	livres.forEach(({p}, k) => {
		const ant = livres[k - 1];
		const quebra = ant && (ant.i + 1 !== livres[k].i || QUEBRAS.some((q) => q > ant.p.de && q <= p.de));
		if (!ant || quebra) trechos.push([]);
		trechos[trechos.length - 1].push(p);
	});
	const out: Pagina[] = [];
	for (const tr of trechos) {
		const n = tr.length;
		const ult = tr[n - 1];
		const seg = ps[ps.indexOf(ult) + 1];
		const duro = Math.min(seg ? seg.de : Infinity, ...ZONAS.filter((z) => z.de > ult.de).map((z) => z.de), Math.max(P.duracao, ult.ate));
		const q = QUEBRAS.find((x) => x > ult.de) ?? Infinity;
		const fimTrecho = (a: number) => Math.min(duro, Math.max(Math.min(q, ult.ate + 1), tr[a].de + MIN_PAGINA, ult.de + LER_PALAVRA));
		const fimDe = (a: number, b: number) => (b + 1 < n ? tr[b + 1].de : fimTrecho(a));
		const custo = (a: number, b: number) => {
			const fim = fimDe(a, b);
			const dur = fim - tr[a].de;
			let c = tr.slice(a, b + 1).map((p) => p.texto).join(' ').length > MAX_LETRAS ? 1000 : 0;
			if (dur < MIN_PAGINA) c += 10 + (MIN_PAGINA - dur) * 20;
			for (let i = a; i <= b; i++) {
				const fica = fim - tr[i].de;
				if (fica < LER_PALAVRA && !(i === b && dur >= MIN_PAGINA && fica >= LER_ULTIMA)) c += 10;
			}
			if (b + 1 < n && !/[.,!?:]$/.test(tr[b].texto) && tr[b + 1].de - tr[b].ate <= 0.3) c += 1;
			return c;
		};
		const best: {c: number; de: number}[] = [{c: 0, de: -1}];
		for (let b = 0; b < n; b++) {
			best[b + 1] = {c: Infinity, de: 0};
			for (let a = 0; a <= b; a++) {
				const c = best[a].c + custo(a, b);
				if (c < best[b + 1].c) best[b + 1] = {c, de: a};
			}
		}
		const pags: Pagina[] = [];
		for (let b = n; b > 0; b = best[b].de) pags.unshift({pal: tr.slice(best[b].de, b), de: tr[best[b].de].de, ate: fimDe(best[b].de, b - 1)});
		out.push(...pags);
	}
	return out;
};

export const paginar = (ps: Pal[], max = 3): Pagina[] => {
	const pags: Pagina[] = [];
	let atual: Pal[] = [];
	ps.forEach((p, i) => {
		atual.push(p);
		const prox = ps[i + 1];
		const pontua = /[.,!?:]$/.test(p.texto);
		const silencio = prox ? prox.de - p.ate > 0.3 : true;
		if (atual.length === max || pontua || silencio || !prox) {
			pags.push({pal: atual, de: atual[0].de, ate: p.ate});
			atual = [];
		}
	});
	if (MIN_PAGINA) return otimo(ps);
	return pags.map((g, i) => {
		const prox = pags[i + 1];
		const fim = Math.min(g.ate + 0.5, g.de + 2, prox ? prox.de : Infinity);
		return {...g, ate: Math.max(fim, g.de + 12 / 30)};
	});
};

export const PAGINAS = paginar(P.palavras);
/** a página e o lugar da legenda no tempo t (null: sem legenda; no editor e no celular o título no topo é o texto dito) */
export const legendaEm = (t: number, previas: boolean) => {
	if (NOVO ? naZona(t) : noEditor(t) || noCelular(t)) return null;
	const i = PAGINAS.findIndex((g) => t >= g.de && t < g.ate);
	if (i < 0) return null;
	// vídeo novo: o lugar é da página inteira (decidido no meio dela), não pula de lugar no meio da leitura
	const g = PAGINAS[i];
	return {i, pilula: pDividido(NOVO ? (g.de + g.ate) / 2 : t, previas) > 0.5};
};

export const Legenda: React.FC = () => {
	const {t} = useT();
	const {previas} = usePrevias();
	const lg = legendaEm(t, previas);
	if (!lg) return null;
	const pg = PAGINAS[lg.i];
	const e = tw(t, pg.de, pg.de + 4 / 30, 0, 1, E.out);
	const palavras = pg.pal.map((p, i) => (
		<span key={i} style={{color: t >= p.de && t < p.ate + 0.08 ? C.menta : C.branco}}>
			{i ? ' ' : ''}
			{p.texto.replace(/[,.]$/, '')}
		</span>
	));
	const base: React.CSSProperties = {
		fontFamily: DISPLAY,
		fontWeight: 800,
		letterSpacing: '-0.025em',
		whiteSpace: 'nowrap',
		...(MIN_PAGINA ? {whiteSpace: 'normal', textAlign: 'center'} : {}),
		opacity: e,
		transform: `translateY(${(1 - e) * 10}px) scale(${0.96 + 0.04 * e})`,
	};
	const pilula: React.CSSProperties = {...base, fontSize: 56, background: C.verdeFundo, borderRadius: 20, padding: '10px 26px 14px', boxShadow: '0 10px 24px rgba(0,0,0,0.22)'};
	if (lg.pilula)
		return (
			<div style={{position: 'absolute', left: 120, right: 150, top: DIVISA - 46, display: 'flex', justifyContent: 'center'}}>
				<div style={pilula}>{palavras}</div>
			</div>
		);
	const topo = Math.min(1340, Math.max(900, queixoTela(blocoDe(pg.de)) + 40));
	const caixa: React.CSSProperties = NOVO
		? {position: 'absolute', left: 110, right: 140, top: topo, display: 'flex', justifyContent: 'center'}
		: {position: 'absolute', left: 110, right: 140, bottom: 1920 - 1190, display: 'flex', justifyContent: 'center'};
	return (
		<div style={caixa}>
			<div style={{...base, fontSize: 68, textShadow: '0 3px 0 rgba(0,0,0,0.35), 0 0 18px rgba(0,0,0,0.55), 0 0 4px rgba(0,0,0,0.6)'}}>{palavras}</div>
		</div>
	);
};
