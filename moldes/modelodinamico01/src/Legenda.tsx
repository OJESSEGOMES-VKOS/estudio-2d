import React from 'react';
import {C, DIVISA, MONO, P, SANS, SERIF, cenaEm, montaCenas, tw, useCenas, useT} from './tema';

/**
 * A legenda é a espinha (MODELO §3): pedaços de até 3 palavras, entrando palavra por palavra,
 * um lugar e um estilo por modo. Palavra-chave em serifa itálica na cor de destaque.
 * Nunca atravessa corte: o pedaço fecha na troca de cena (os cortes são os mesmos com ou sem prévias).
 */
type Pal = {texto: string; de: number; ate: number; i: number};
type Pedaco = {pal: Pal[]; de: number; ate: number};
/** palavras-chave pelo índice em palavras.json: 100%, Claude, diferença, Claude, prévias, três, edição (a do pedido), DM */
const CHAVE = new Set([4, 7, 16, 33, 53, 60, 84, 94]);
/** a palavra que a pessoa vai comentar sai em caixa alta */
const CAIXA_ALTA = new Set([84]);
/** a chave que ganha a caixa de seleção com alças (ref3) */
const SELECAO = new Set([84]);

const CORTES = montaCenas(false);
const pedacos = (): Pedaco[] => {
	const out: Pedaco[] = [];
	let at: Pal[] = [];
	const cena = (t: number) => CORTES.findIndex((c) => t >= c.de && t < c.ate);
	P.palavras.forEach((q, i) => {
		const p = {...q, i};
		at.push(p);
		const prox = P.palavras[i + 1];
		const fecha = !prox || at.length === 3 || /[.,!?]$/.test(p.texto) || prox.de - p.ate > 0.3 || cena(prox.de) !== cena(p.de);
		if (fecha) {
			out.push({pal: at, de: at[0].de, ate: p.ate});
			at = [];
		}
	});
	return out.map((g, i) => {
		const prox = out[i + 1];
		const c = CORTES[cena(g.de)];
		return {...g, ate: Math.min(g.ate + 0.45, prox ? prox.de : Infinity, c ? c.ate : Infinity)};
	});
};
const PEDACOS = pedacos();

const limpa = (s: string) => s.replace(/[.,!?]$/, '');

export const Legenda: React.FC = () => {
	const {t} = useT();
	const cenas = useCenas();
	const cena = cenaEm(cenas, t);
	const g = PEDACOS.find((q) => t >= q.de && t < q.ate);
	if (!g) return null;
	const modo = cena.modo;

	const palavra = (p: Pal, i: number, cor: string, corChave: string, escalaChave: number) => {
		const k = tw(t, p.de - 0.02, p.de + 0.12, 0, 1);
		const chave = CHAVE.has(p.i) && modo !== 'dividido';
		const txt = modo === 'dividido' || CAIXA_ALTA.has(p.i) ? limpa(p.texto).toUpperCase() : limpa(p.texto);
		const sel = SELECAO.has(p.i) && modo !== 'dividido';
		const ks = tw(t, p.de + 0.04, p.de + 0.22, 0, 1);
		return (
			<span
				key={i}
				style={{
					position: 'relative',
					display: 'inline-block',
					marginLeft: i ? '0.26em' : 0,
					opacity: k,
					transform: `translateY(${(1 - k) * 14}px)`,
					color: chave ? corChave : cor,
					fontFamily: chave ? SERIF : undefined,
					fontWeight: chave ? 400 : undefined,
					fontSize: chave ? `${escalaChave}em` : undefined,
					lineHeight: 1,
					padding: sel ? '0 0.12em' : undefined,
				}}
			>
				{txt}
				{sel && (
					<span style={{position: 'absolute', inset: '-0.06em -0.02em -0.1em', border: `4px solid ${C.selecao}`, opacity: ks}}>
						{[
							[-9, -9],
							[null, -9],
							[-9, null],
							[null, null],
						].map(([l, tp], j) => (
							<span key={j} style={{position: 'absolute', width: 14, height: 14, background: C.branco, border: `3px solid ${C.selecao}`, left: l ?? undefined, right: l === null ? -9 : undefined, top: tp ?? undefined, bottom: tp === null ? -9 : undefined}} />
						))}
					</span>
				)}
			</span>
		);
	};

	if (modo === 'motion')
		return (
			<div style={{position: 'absolute', left: 40, right: 40, top: cena.legendaTopo ? 250 : 1430, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 84, letterSpacing: '-0.03em', color: C.tinta}}>
				{g.pal.map((p, i) => palavra(p, i, C.tinta, C.destaque, 1.25))}
			</div>
		);
	if (modo === 'palco')
		return (
			<div style={{position: 'absolute', left: 40, right: 40, top: 1210, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 54, letterSpacing: '-0.02em', color: C.tinta}}>
				{g.pal.map((p, i) => palavra(p, i, C.tinta, C.destaque, 1.3))}
			</div>
		);
	if (modo === 'dividido') {
		const e = tw(t, g.de - 0.02, g.de + 0.1, 0, 1);
		return (
			<div style={{position: 'absolute', left: 0, right: 0, top: DIVISA - 34, display: 'flex', justifyContent: 'center'}}>
				<div style={{background: '#1F1F1F', color: C.branco, fontFamily: MONO, fontWeight: 500, fontSize: 40, letterSpacing: '0.02em', padding: '10px 22px 12px', borderRadius: 8, opacity: e, transform: `scale(${0.94 + 0.06 * e})`}}>
					{g.pal.map((p, i) => palavra(p, i, C.branco, C.branco, 1))}
				</div>
			</div>
		);
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: 40,
				right: 40,
				top: 1200,
				textAlign: 'center',
				fontFamily: SANS,
				fontWeight: 700,
				fontSize: 78,
				letterSpacing: '-0.025em',
				color: C.branco,
				textShadow: '0 4px 18px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.5)',
			}}
		>
			{g.pal.map((p, i) => palavra(p, i, C.branco, C.destaqueClaro, 1.3))}
		</div>
	);
};
