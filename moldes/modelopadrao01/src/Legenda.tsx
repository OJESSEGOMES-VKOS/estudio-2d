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
	return pags.map((g, i) => {
		const prox = pags[i + 1];
		const fim = Math.min(g.ate + 0.5, g.de + 2, prox ? prox.de : Infinity);
		return {...g, ate: Math.max(fim, g.de + 12 / 30)};
	});
};

const PAGINAS = paginar(P.palavras);

export const Legenda: React.FC = () => {
	const {t} = useT();
	const {previas} = usePrevias();
	if (noEditor(t) || noCelular(t)) return null;
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	if (!pg) return null;
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
		opacity: e,
		transform: `translateY(${(1 - e) * 10}px) scale(${0.96 + 0.04 * e})`,
	};
	const pilula: React.CSSProperties = {...base, fontSize: 56, background: C.verdeFundo, borderRadius: 20, padding: '10px 26px 14px', boxShadow: '0 10px 24px rgba(0,0,0,0.22)'};
	if (pDividido(t, previas) > 0.5)
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
