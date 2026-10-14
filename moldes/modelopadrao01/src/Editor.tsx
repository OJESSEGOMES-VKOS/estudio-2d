import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, DISPLAY, E, MONO, NOVO, P, SOMBRA, T, fundoClaro, mola, tw, useT} from './tema';
import {PREVIA} from './Rosto';
import {Faisca} from './ui';

/**
 * "pelo Claude. Ele foi criado justamente para te mostrar": o vídeo entra no editor e o Claude edita ESTE vídeo,
 * ao vivo (o gancho abre limpo, só ele falando; a edição entra em "pelo Claude").
 * A pré-visualização é o próprio vídeo (Rosto, moldura PRÉVIA). Em cima, só as palavras ditas.
 * Cada palavra-chave tem a sua animação no instante em que é dita:
 *   Claude -> o cursor do Claude passa a lâmina no clipe; criado -> a palavra vira legenda e a faixa de legenda
 *   nasce; mostrar -> uma tela se monta na pré-visualização. Em "a diferença" o vídeo cresce para a tela dividida.
 */
const S = T.editor; // null: o vídeo não tem a tela do editor
const JAN = {x: 60, y: 430, w: 960, h: 1010}; // desce além da zona segura: a parte de baixo é só a linha do tempo
const TL = {x0: 200, x1: 990, regua: 1108, v: 1130, l: 1238, tt: 1316, hv: 92, hl: 60};
const PH = 1920 * (PREVIA.w / 1080);

// clipes do vídeo na faixa V: [início, fim] em px
const CLIPES: [number, number][] = [
	[200, 340],
	[348, 540],
	[548, 720],
	[728, 870],
];

/** quanto o editor ainda está na tela (some enquanto o vídeo cresce) */
export const vida = (t: number) => (S ? Math.min(tw(t, S.de - 0.35, S.de + 0.05, 0, 1, E.inOut), 1 - tw(t, S.devolve - 0.05, S.devolve + 0.2, 0, 1, E.in)) : 0); // as camadas saem antes do vídeo crescer

export const EditorFundo: React.FC = () => {
	const {t} = useT();
	const v = vida(t);
	if (v <= 0) return null;
	return (
		<AbsoluteFill style={{...fundoClaro, opacity: Math.min(1, v * 1.4)}}>
			<div style={{position: 'absolute', left: JAN.x, top: JAN.y, width: JAN.w, height: JAN.h, borderRadius: 30, background: C.papel, boxShadow: SOMBRA}} />
			<div style={{position: 'absolute', left: JAN.x, top: JAN.y + 64, width: JAN.w, height: 1, background: C.linha}} />
			<div style={{position: 'absolute', left: PREVIA.x - 14, top: PREVIA.y - 14, width: PREVIA.w + 28, height: PH + 28, borderRadius: 26, background: '#1B1B1A'}} />
		</AbsoluteFill>
	);
};

/** páginas de título: as palavras ditas, na ordem, a partir da n-ésima ocorrência de `inicio`, em grupos */
export type Pagina = {pal: typeof P.palavras; de: number};
export const paginasDe = (inicio: number, grupos: number[]): Pagina[] => {
	const ws = P.palavras;
	const out: Pagina[] = [];
	let i = inicio;
	for (const n of grupos) {
		out.push({pal: ws.slice(i, i + n), de: ws[i].de});
		i += n;
	}
	return out;
};
// "pelo Claude." "Ele foi criado" "justamente para" "te mostrar a" (scripts/gerar_tempos.py, titulos.editor)
export const PAGINAS = T.titulos.editor ? paginasDe(T.titulos.editor.i0, T.titulos.editor.grupos) : [];

const Palavra: React.FC<{texto: string; de: number; t: number}> = ({texto, de, t}) => {
	const limpo = texto.replace(/[.,]$/, '');
	const y = tw(t, de, de + 0.32, 105, 0, E.out);
	const vis = t >= de - 0.02;
	// as animações seguem o plano, não o texto: a palavra dita em editor.legenda ganha a caixa verde, a dita em
	// editor.tela ganha o contorno, as de titulos.marcas ganham o marca-texto
	const em = (x?: number) => x !== undefined && Math.abs(de - x) < 0.01;
	let corpo: React.ReactNode = limpo;
	if (em(S?.legenda)) {
		const p = mola(t, de, {damping: 11, stiffness: 260, mass: 0.6});
		corpo = (
			<span style={{display: 'inline-block', background: C.verdeFundo, color: C.branco, borderRadius: 16, padding: '0 18px 6px', transform: `scale(${0.7 + 0.3 * p})`}}>
				<span style={{color: C.menta}}>{limpo}</span>
			</span>
		);
	}
	if (em(S?.tela)) {
		const d = tw(t, de, de + 0.45, 0, 1, E.inOut);
		corpo = (
			<span style={{position: 'relative', display: 'inline-block', padding: '0 14px'}}>
				<svg style={{position: 'absolute', left: 0, top: -4, width: '100%', height: '108%', overflow: 'visible'}} viewBox="0 0 100 100" preserveAspectRatio="none">
					<rect x={1} y={4} width={98} height={92} rx={10} fill="none" stroke={C.verde} strokeWidth={4} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
				</svg>
				{limpo}
			</span>
		);
	}
	const marca = (T.titulos.marcas ?? []).includes(limpo);
	const m = tw(t, de + 0.3, de + 0.7, 0, 1, E.inOut);
	return (
		<span style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.14em', marginBottom: '-0.14em', verticalAlign: 'top', opacity: vis ? 1 : 0}}>
			<span style={{position: 'relative', display: 'inline-block', transform: `translateY(${y}%)`}}>
				{marca ? <span style={{position: 'absolute', left: -2, right: -2, bottom: '0.16em', height: '0.36em', borderRadius: 6, background: C.menta, transform: `scaleX(${m})`, transformOrigin: '0 50%'}} /> : null}
				<span style={{position: 'relative'}}>{corpo}</span>
			</span>
		</span>
	);
};

/** a página de título no tempo t (-1: nenhuma) */
export const paginaEm = (t: number, paginas: Pagina[]) => paginas.findIndex((p, i) => t >= p.de - 0.05 && (i === paginas.length - 1 || t < paginas[i + 1].de - 0.05));
export const Titulo: React.FC<{t: number; paginas: Pagina[]}> = ({t, paginas}) => {
	const idx = paginaEm(t, paginas);
	if (idx < 0) return null;
	const pg = paginas[idx];
	return (
		<div style={{position: 'absolute', left: 80, right: NOVO ? 140 : 110, top: 250, height: 170, display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap', columnGap: '0.24em', fontFamily: DISPLAY, fontWeight: 800, fontSize: 74, lineHeight: 1.06, letterSpacing: '-0.04em', color: C.tinta}}>
			{pg.pal.map((p, i) => (
				<Palavra key={`${idx}-${i}`} texto={p.texto} de={p.de} t={t} />
			))}
		</div>
	);
};

/** o cursor do Claude: vai de ponto em ponto, chegando no instante de cada ação */
const ROTA: [number, number, number][] = S
	? [
			[0, 900, 1176],
			[S.corte - 0.05, 480, 1176],
			[S.legenda, 560, 1268],
			[S.tela, 600, 1346],
		]
	: [];
const cursor = (t: number) => {
	if (!ROTA.length) return {x: 0, y: 0};
	let x = ROTA[0][1], y = ROTA[0][2];
	for (let i = 1; i < ROTA.length; i++) {
		const [ti, xi, yi] = ROTA[i];
		const p = tw(t, ti - 0.4, ti, 0, 1, E.inOut);
		x += (xi - x) * p;
		y += (yi - y) * p;
	}
	return {x, y};
};

export const EditorFrente: React.FC = () => {
	const {t} = useT();
	const v = vida(t);
	if (v <= 0 || !S) return null;
	// faixa V: aparas nos cliques, o arquivo novo chega, a lâmina corta
	const apara1 = 0;
	const apara2 = 0;
	const clipes = CLIPES.map(([a, b], i) => {
		const desloca = (i >= 2 ? apara1 : 0) + (i >= 3 ? apara2 : 0);
		const fim = b - (i === 1 ? apara1 : 0) - (i === 2 ? apara2 : 0);
		return [a - desloca, fim - desloca] as [number, number];
	});
	const fimV = clipes[3][1];
	const xCorte = 480;
	const lamina = tw(t, S.corte, S.corte + 0.14, 0, 1);
	const abre = tw(t, S.corte + 0.12, S.corte + 0.4, 0, 1) * 32;
	const ph = tw(t, S.de, S.devolve, TL.x0, TL.x1, E.lin);
	const c = cursor(t);
	const sel = (i: number) => i === 1 && t >= S.corte - 0.4 && t < S.corte;
	const leg = mola(t, S.legenda, {damping: 12, stiffness: 240, mass: 0.6});
	const tela = mola(t, S.tela, {damping: 14, stiffness: 200});
	return (
		<AbsoluteFill style={{opacity: v}}>
			<Titulo t={t} paginas={PAGINAS} />
			{/* barra da janela: o nome que ele diz */}
			<div style={{position: 'absolute', left: JAN.x + 28, top: JAN.y + 20, display: 'flex', gap: 10}}>
				{['#E0796B', '#E8B85C', '#7BC48E'].map((k) => (
					<div key={k} style={{width: 16, height: 16, borderRadius: 8, background: k}} />
				))}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: JAN.y + 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 26, fontWeight: 600, color: C.tinta}}>
				<Faisca size={28} />
				Claude Code
			</div>

			{/* sobre a pré-visualização: a legenda e a tela que nascem */}
			{leg > 0 ? (
				<div style={{position: 'absolute', left: PREVIA.x + 40, width: PREVIA.w - 80, top: PREVIA.y + PH * 0.6, height: 30, borderRadius: 10, background: C.verdeFundo, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transform: `scale(${0.6 + 0.4 * leg})`, opacity: Math.min(1, leg * 2)}}>
					<div style={{width: 60, height: 8, borderRadius: 4, background: C.branco}} />
					<div style={{width: 70, height: 8, borderRadius: 4, background: C.menta}} />
				</div>
			) : null}
			{tela > 0 ? (
				<div style={{position: 'absolute', left: PREVIA.x + 30, width: PREVIA.w - 60, top: PREVIA.y + 40 + (1 - tela) * -60, height: 150, borderRadius: 16, background: C.papel, boxShadow: '0 10px 24px rgba(0,0,0,0.3)', padding: 14, opacity: Math.min(1, tela * 2)}}>
					<div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
						<div style={{width: 34, height: 34, borderRadius: 17, background: C.menta}} />
						<div style={{flex: 1}}>
							<div style={{height: 9, width: '80%', borderRadius: 5, background: C.tinta, opacity: 0.8}} />
							<div style={{height: 8, width: '55%', marginTop: 7, borderRadius: 4, background: C.grade}} />
						</div>
					</div>
					{[0.92, 0.7].map((w, k) => (
						<div key={k} style={{height: 22, width: `${w * 100}%`, marginTop: 12, borderRadius: 7, background: k ? C.mentaFundo : C.marfim, transform: `scaleX(${tw(t, S.tela + 0.15 + k * 0.1, S.tela + 0.45 + k * 0.1, 0, 1)})`, transformOrigin: '0 50%'}} />
					))}
				</div>
			) : null}

			{/* linha do tempo */}
			<div style={{position: 'absolute', left: TL.x0, width: TL.x1 - TL.x0, top: TL.regua, height: 14, backgroundImage: `repeating-linear-gradient(90deg, ${C.grade} 0 2px, transparent 2px 32px)`}} />
			{[
				['▶', TL.v, TL.hv],
				['Aa', TL.l, TL.hl],
				['▢', TL.tt, TL.hl],
			].map(([ic, y, h]) => (
				<div key={String(ic)} style={{position: 'absolute', left: 100, top: Number(y), height: Number(h), width: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 28, color: C.suave, background: C.marfim, borderRadius: 12}}>
					{ic}
				</div>
			))}
			{clipes.map(([a, b], i) => {
				const corta = i === 1 && t >= S.corte + 0.12;
				const partes: [number, number][] = corta ? [[a, xCorte], [xCorte + abre, b + abre]] : [[a, b]];
				return partes.map(([pa, pb], k) => (
					<div key={`${i}-${k}`} style={{position: 'absolute', left: pa, width: Math.max(0, pb - pa - 4), top: TL.v, height: TL.hv, borderRadius: 14, background: i % 2 ? C.clipe2 : C.clipe, boxShadow: sel(i) ? `0 0 0 4px ${C.claude}` : 'none'}} />
				));
			})}
			{/* a lâmina */}
			{t >= S.corte && t < S.corte + 0.8 ? (
				<div style={{position: 'absolute', left: xCorte + abre / 2 - 3, top: TL.regua - 6, width: 6, height: (TL.tt + TL.hl - TL.regua + 20) * lamina, borderRadius: 3, background: C.claude, opacity: 1 - tw(t, S.corte + 0.5, S.corte + 0.8, 0, 1)}} />
			) : null}
			{/* faixa de legenda e de tela */}
			{[0, 1, 2, 3, 4].map((k) => {
				const p = mola(t, S.legenda + 0.06 * k, {damping: 13, stiffness: 260, mass: 0.6});
				return p > 0 ? <div key={k} style={{position: 'absolute', left: TL.x0 + 8 + k * 156, width: 134, top: TL.l, height: TL.hl, borderRadius: 9, background: C.menta, transform: `scaleY(${p})`}} /> : null;
			})}
			{tela > 0 ? <div style={{position: 'absolute', left: 520, width: 300 * tela, top: TL.tt, height: TL.hl, borderRadius: 9, background: C.verde}} /> : null}
			{/* agulha */}
			<div style={{position: 'absolute', left: ph - 2, top: TL.regua - 6, width: 4, height: TL.tt + TL.hl - TL.regua + 12, background: C.tinta, borderRadius: 2}} />
			{/* o cursor do Claude */}
			<div style={{position: 'absolute', left: c.x, top: c.y, opacity: 1 - tw(t, S.tela + 0.8, S.tela + 1.1, 0, 1)}}>
				<svg width={40} height={40} viewBox="0 0 24 24">
					<path d="M3 2l17 9-7.5 2L9 21z" fill={C.tinta} stroke={C.papel} strokeWidth={1.4} strokeLinejoin="round" />
				</svg>
				<div style={{position: 'absolute', left: 30, top: 30, background: C.claude, color: C.branco, borderRadius: 12, padding: '4px 12px 6px', fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, whiteSpace: 'nowrap'}}>Claude</div>
			</div>
		</AbsoluteFill>
	);
};
