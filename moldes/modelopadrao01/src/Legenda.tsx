import React from 'react';
import {C, DISPLAY, DIVISA, E, P, noCelular, noEditor, pDividido, tw, usePrevias, useT} from './tema';

/**
 * Legenda falada. Um lugar por modo, sempre o mesmo (o olho aprende onde ler):
 * - rosto cheio: sem tarja, texto claro com sombra, base em y 1190 (logo abaixo do queixo medido);
 * - tela dividida: na divisa, numa pílula verde escura (texto claro some no marfim);
 * - no editor e no celular: sem legenda, o título no topo já é o texto dito.
 * Página: até 3 palavras, quebra em pontuação, mínimo 12 quadros, máximo 2 s. Palavra ativa em menta.
 */
type Pal = {texto: string; de: number; ate: number};
type Pagina = {pal: Pal[]; de: number; ate: number};

/** tempo mínimo de cada página (s). 0 = como na vitrine (até 3 palavras, de 12 quadros a 2 s); num vídeo novo, 1.5: as
 * páginas se juntam até durar 1,5 s e a última palavra ficar 0,4 s (REGRAS §3), em até 2 linhas. O conferidor cobra. */
export const MIN_PAGINA = 0;
const MAX_LETRAS = 40; // ~2 linhas na caixa da legenda

/** com MIN_PAGINA: junta a página seguinte enquanto a atual ficaria curta ou a última palavra dela sumiria antes de 0,4 s */
const juntar = (pags: Pagina[]): Pagina[] => {
	const out: Pagina[] = [];
	for (const g of pags) {
		const at = out[out.length - 1];
		const letras = at ? [...at.pal, ...g.pal].map((p) => p.texto).join(' ').length : 0;
		if (at && letras <= MAX_LETRAS && (g.de < at.de + MIN_PAGINA || g.de < at.pal[at.pal.length - 1].de + 0.4)) out[out.length - 1] = {pal: [...at.pal, ...g.pal], de: at.de, ate: g.ate};
		else out.push(g);
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
	if (MIN_PAGINA) {
		const gs = juntar(pags);
		return gs.map((g, i) => {
			const prox = gs[i + 1];
			return {...g, ate: Math.min(Math.max(g.ate + 0.5, g.de + MIN_PAGINA, g.pal[g.pal.length - 1].de + 0.4), prox ? prox.de : Infinity)};
		});
	}
	return pags.map((g, i) => {
		const prox = pags[i + 1];
		const fim = Math.min(g.ate + 0.5, g.de + 2, prox ? prox.de : Infinity);
		return {...g, ate: Math.max(fim, g.de + 12 / 30)};
	});
};

export const PAGINAS = paginar(P.palavras);
/** a página e o lugar da legenda no tempo t (null: sem legenda; no editor e no celular o título no topo é o texto dito) */
export const legendaEm = (t: number, previas: boolean) => {
	if (noEditor(t) || noCelular(t)) return null;
	const i = PAGINAS.findIndex((g) => t >= g.de && t < g.ate);
	return i < 0 ? null : {i, pilula: pDividido(t, previas) > 0.5};
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
	const caixa: React.CSSProperties = {position: 'absolute', left: 110, right: 140, bottom: 1920 - 1190, display: 'flex', justifyContent: 'center'};
	return (
		<div style={caixa}>
			<div style={{...base, fontSize: 68, textShadow: '0 3px 0 rgba(0,0,0,0.35), 0 0 18px rgba(0,0,0,0.55), 0 0 4px rgba(0,0,0,0.6)'}}>{palavras}</div>
		</div>
	);
};
