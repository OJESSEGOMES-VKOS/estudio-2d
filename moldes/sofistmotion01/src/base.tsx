// Base do sofistmotion01 (registro Ouro na Noite): cores, fontes, tempos, tipografia que se monta, flash, poeira.
import React, {useEffect, useState} from 'react';
import {Easing, continueRender, delayRender, interpolate, random} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';
import PS_RAW from './palavras.json';
import TEMPOS from './tempos.json';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
type Plano = Omit<typeof TEMPOS, 'marcas' | 'escurece_q' | 'previas'> & {marcas?: Record<string, [number, string]>; escurece_q?: number[]; previas?: {de_q: number; ate_q: number}};
export const T = TEMPOS as unknown as Plano;
export const PS = PS_RAW as {text: string; start: number; end: number}[];
export const q = (s: number) => Math.round(s * FPS);

/* ---------------------------------------------------------------- o plano tem de ser desta fala: para logo ao carregar */
export const pare = (msg: string): never => {
	throw new Error(`\n\n[sofistmotion01] ${msg}\nO conferidor diz a linha: ../../.venv/Scripts/python.exe scripts/conferir.py\n`);
};
const limpa = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
{
	const plano = (T.fala ?? '').split(/\s+/).map(limpa).filter(Boolean);
	const fala = PS.map((p) => limpa(p.text)).filter(Boolean);
	const k = plano.findIndex((x, i) => x !== fala[i]);
	if (k >= 0 || plano.length !== fala.length) {
		const j = k >= 0 ? k : Math.min(plano.length, fala.length);
		pare(
			`O plano não bate com a fala. src/tempos.json foi feito para outra fala: na palavra ${j + 1} o plano tem "${plano[j] ?? '(fim)'}" e src/palavras.json tem "${fala[j] ?? '(fim)'}". ` +
				'Refaça "cenas", "flashes", "blocos", "marcas", "texto", "acordes" e "duracao_q" em src/tempos.json e as telas em src/cenas.tsx sobre a fala nova (LEIA, "Vídeo novo"), e cole o texto da fala nova no campo "fala" (linha 2).',
		);
	}
	const n = PS.length;
	const ids = [...T.blocos.flatMap((b) => b.linhas.flatMap((l) => l.ids)), ...Object.values(T.marcas ?? {}).map((m) => m[0])];
	const fora = ids.find((i) => !(i >= 0 && i < n));
	if (fora !== undefined) pare(`src/tempos.json usa a palavra ${fora}, mas a fala tem ${n} palavras (0 a ${n - 1}): refaça os ids de "blocos" e "marcas".`);
	for (const [nome, [i, palavra]] of Object.entries(T.marcas ?? {}))
		if (limpa(PS[i].text) !== limpa(palavra)) pare(`a marca "${nome}" de src/tempos.json aponta a palavra ${i} ("${PS[i].text}"), não "${palavra}": acerte o índice.`);
	for (const b of T.blocos) if (!T.cenas.some((c) => c.id === b.cena)) pare(`o bloco ${b.id} de src/tempos.json está na cena ${b.cena}, que não existe em "cenas".`);
	if (T.duracao_q < q(PS[n - 1].end)) pare(`"duracao_q" (${T.duracao_q}) corta a fala, que acaba no quadro ${q(PS[n - 1].end)}: aumente em src/tempos.json.`);
}

export const ini = (i: number) => q(PS[i].start); // quadro em que a palavra i é dita
/** quadro da marca do plano (src/tempos.json → "marcas"); a tela que pede uma marca que o plano não tem para com a mensagem */
export const marca = (nome: string) => {
	const m = T.marcas?.[nome];
	return m ? ini(m[0]) : pare(`src/cenas.tsx pede a marca "${nome}", que não está em src/tempos.json → "marcas". Ponha "${nome}": [índice da palavra, "palavra"] ou tire o uso dela da tela.`);
};
export const txt = (i: number) => (T.texto as Record<string, string>)[String(i)] ?? PS[i].text;
export const cena = (id: string) => T.cenas.find((c) => c.id === id)!;

// MODELO §4, Registro 1: Ouro na Noite
export const COR = {
	fundo: '#000000',
	fundo2: '#040100',
	nevoa: '#1B0E04',
	nevoa2: '#312616',
	fogo: '#F48907',
	fogoNevoa: '#B06419',
	borda: '#F38934',
	ouro: '#F2BE3A',
	ouroAlto: '#F8D834',
	nucleo: '#FFFEDD',
	tensao: '#E0030A',
	tensaoFundo: '#3B0000',
	tensaoTexto: '#FFE0E8',
	tensaoHalo: '#E13B50',
	texto: '#FFFFF7',
	creme: '#F3E3C3',
};

const {fontFamily, waitUntilDone} = loadFont('normal', {weights: ['500', '700'], subsets: ['latin', 'latin-ext']});
export const INTER = fontFamily;

// carrega a Inter e mede textos (para a palavra gigante do T1)
export const useFonte = () => {
	const [ok, setOk] = useState(false);
	const [h] = useState(() => delayRender('fonte Inter'));
	useEffect(() => {
		waitUntilDone().then(() => {
			setOk(true);
			continueRender(h);
		});
	}, [h]);
	return ok;
};
let ctx: CanvasRenderingContext2D | null = null;
export const mede = (s: string, fs: number, peso = 700) => {
	if (!ctx) ctx = document.createElement('canvas').getContext('2d');
	if (!ctx) return s.length * fs * 0.55;
	ctx.font = `${peso} ${fs}px ${INTER}`;
	(ctx as unknown as {letterSpacing: string}).letterSpacing = `${-0.02 * fs}px`;
	return ctx.measureText(s).width;
};

export const E = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	io: Easing.bezier(0.65, 0, 0.35, 1),
	in: Easing.bezier(0.55, 0, 0.75, 0.2),
	back: Easing.bezier(0.34, 1.56, 0.64, 1),
	lin: (x: number) => x,
};
export const tw = (f: number, a: number, b: number, v0: number, v1: number, ease: (x: number) => number = E.out) =>
	interpolate(f, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

// brilho neon: núcleo quase branco, a cor mora no halo (MODELO §5)
export const HALO_TEXTO = `0 0 10px rgba(255,214,140,0.35), 0 0 34px rgba(244,137,7,0.22)`;
export const HALO_OURO = `0 0 6px rgba(248,216,52,0.9), 0 0 22px rgba(242,190,58,0.75), 0 0 54px rgba(244,137,7,0.5)`;
export const HALO_TENSAO = `0 0 6px rgba(225,59,80,0.95), 0 0 22px rgba(225,59,80,0.8), 0 0 50px rgba(224,3,10,0.55)`;
export const FILTRO_NEON = (cor = COR.fogo) => `drop-shadow(0 0 3px ${cor}) drop-shadow(0 0 12px ${cor}) drop-shadow(0 0 30px ${cor}aa)`;

// entrada mais usada nas duas refs: desfoque para foco com leve escala
export const surge = (f: number, n: number, dur = 7, blur = 16, esc = 0.14): React.CSSProperties => {
	if (f < n) return {opacity: 0};
	const p = tw(f, n, n + dur, 0, 1, E.out);
	if (p >= 1) return {};
	return {opacity: clamp(p * 1.7), filter: `blur(${(1 - p) * blur}px)`, transform: `scale(${1 + esc * (1 - p)}) translateY(${(1 - p) * 10}px)`};
};

type Linha = {ids: number[]; fs: number; y: number; tipo?: string; ouro?: number[]; gigante?: number[]};
export type Bloco = {id: string; cena: string; pos: string; linhas: Linha[]; de_q?: number; ate_q?: number; estilo?: string; encolhe_q?: number};
export const BLOCOS = T.blocos as Bloco[];
export const bloco = (id: string) => BLOCOS.find((b) => b.id === id)!;
export const limites = (b: Bloco) => {
	const c = cena(b.cena);
	return {de: b.de_q ?? c.de_q, ate: b.ate_q ?? c.ate_q, cenaAte: c.ate_q};
};
export const nasce = (b: Bloco, i: number) => Math.max(ini(i), limites(b).de);

// uma palavra da tela: grotesca Bold; variantes ouro, tensão, contorno neon
export const Palavra: React.FC<{i: number; b: Bloco; f: number; fs: number; tipo?: string; ouro?: boolean; tensao?: boolean}> = ({i, b, f, fs, tipo, ouro, tensao}) => {
	const n = nasce(b, i);
	const base: React.CSSProperties = {display: 'inline-block', whiteSpace: 'pre', fontFamily: INTER, fontWeight: 700, fontSize: fs, letterSpacing: '-0.02em', lineHeight: 1};
	if (tipo === 'contorno') {
		// palavra só em contorno neon, escrita da esquerda para a direita (ref1 "perceber")
		const p = tw(f, n, n + 9, 0, 1, E.out);
		return (
			<span style={{...base, color: 'transparent', WebkitTextStroke: `${fs * 0.028}px ${COR.nucleo}`, filter: FILTRO_NEON(COR.fogo), clipPath: `inset(-20% ${(1 - p) * 102}% -20% -5%)`, opacity: f < n ? 0 : 1}}>
				{txt(i)}
			</span>
		);
	}
	const cor = tensao ? COR.tensaoTexto : ouro ? COR.ouroAlto : COR.texto;
	const sombra = tensao ? HALO_TENSAO : ouro ? HALO_OURO : HALO_TEXTO;
	return <span style={{...base, color: cor, textShadow: sombra, ...surge(f, n)}}>{txt(i)}</span>;
};

// um bloco de texto inteiro, linhas centradas em x 540; saída por desfoque quando não termina num flash
export const BlocoView: React.FC<{id: string; f: number; estiloLinha?: (l: Linha, k: number) => React.ReactNode | null}> = ({id, f, estiloLinha}) => {
	const b = bloco(id);
	const {de, ate, cenaAte} = limites(b);
	if (f < de || f >= (ate < cenaAte ? ate + 4 : ate)) return null;
	const saida = ate < cenaAte ? tw(f, ate, ate + 4, 0, 1, E.in) : 0;
	let enc: React.CSSProperties = {};
	if (b.encolhe_q !== undefined) {
		const p = tw(f, b.encolhe_q, b.encolhe_q + 7, 0, 1, E.io);
		const ys = b.linhas.map((l) => l.y);
		const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
		enc = {transform: `translateY(${p * (590 - cy)}px) scale(${1 - 0.42 * p})`, transformOrigin: `540px ${cy}px`};
	}
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 1 - saida, filter: saida > 0 ? `blur(${saida * 14}px)` : undefined, ...enc}}>
			{b.linhas.map((l, k) => {
				const esp = estiloLinha?.(l, k);
				if (esp !== undefined && esp !== null) return <React.Fragment key={k}>{esp}</React.Fragment>;
				return (
					<div key={k} style={{position: 'absolute', left: 0, width: W, top: l.y - l.fs * 0.5, height: l.fs, textAlign: 'center', whiteSpace: 'nowrap'}}>
						{l.ids.map((i, j) => (
							<React.Fragment key={i}>
								{j > 0 && <span style={{display: 'inline-block', width: l.fs * 0.27}} />}
								<Palavra i={i} b={b} f={f} fs={l.fs} tipo={l.tipo} ouro={l.ouro?.includes(i)} tensao={b.estilo === 'tensao'} />
							</React.Fragment>
						))}
					</div>
				);
			})}
		</div>
	);
};

// flash de tela cheia: sobe em 2 quadros, desce em ~0,3 s; a tela nova já está embaixo (MODELO §8)
export const Flashes: React.FC<{f: number}> = ({f}) => (
	<>
		{T.flashes.map((fl, k) => {
			if (f < fl.q - 2 || f > fl.q + 10) return null;
			const o = f < fl.q ? tw(f, fl.q - 2, fl.q, 0, 1, E.lin) : tw(f, fl.q, fl.q + 10, 1, 0, E.out);
			const bg =
				fl.cor === 'branco'
					? 'radial-gradient(circle at 50% 45%, #FFFFFF 0%, #FFF9EC 55%, #F4E6CC 100%)'
					: fl.cor === 'sol'
						? 'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FFD27A 30%, #F48907 70%, #7A3A05 100%)'
						: 'radial-gradient(circle at 50% 45%, #FFF6DC 0%, #FFD58A 40%, #F48907 85%, #B06419 100%)';
			return <div key={k} style={{position: 'absolute', inset: 0, background: bg, opacity: o * (fl.cor === 'branco' ? 0.92 : 0.95)}} />;
		})}
	</>
);

// poeira dourada fina e estrelas brancas pequenas (random(seed): o render sai igual sempre)
export const Poeira: React.FC<{f: number; seed: string; n?: number; cor?: string; estrelas?: number; area?: [number, number, number, number]; sobe?: number}> = ({
	f,
	seed,
	n = 70,
	cor = COR.ouro,
	estrelas = 26,
	area = [0, 0, W, H],
	sobe = 0.6,
}) => {
	const [x0, y0, x1, y1] = area;
	const pts = [];
	for (let k = 0; k < n + estrelas; k++) {
		const est = k >= n;
		const rx = random(`${seed}x${k}`), ry = random(`${seed}y${k}`), rs = random(`${seed}s${k}`), rp = random(`${seed}p${k}`);
		const hh = y1 - y0;
		const y = y0 + ((((ry * hh - f * sobe * (0.4 + rs)) % hh) + hh) % hh);
		const x = x0 + rx * (x1 - x0) + Math.sin(f * 0.03 + rp * 6.28) * 12;
		const tam = est ? 1.5 + rs * 2 : 1.4 + rs * 3.2;
		const brilho = est ? 0.35 + 0.65 * Math.abs(Math.sin(f * 0.07 + rp * 9)) : 0.3 + 0.7 * rs;
		pts.push(
			<div
				key={k}
				style={{
					position: 'absolute',
					left: x,
					top: y,
					width: tam,
					height: tam,
					borderRadius: '50%',
					background: est ? '#FFFFFF' : COR.nucleo,
					opacity: brilho,
					boxShadow: est ? '0 0 4px #fff' : `0 0 ${4 + rs * 6}px ${cor}, 0 0 ${10 + rs * 10}px ${cor}`,
				}}
			/>,
		);
	}
	return <>{pts}</>;
};

// névoa quente de fundo
export const Nevoa: React.FC<{x?: number; y?: number; r?: number; cor?: string; o?: number}> = ({x = 50, y = 30, r = 60, cor = 'rgba(176,100,25,0.45)', o = 1}) => (
	<div style={{position: 'absolute', inset: 0, opacity: o, background: `radial-gradient(circle at ${x}% ${y}%, ${cor} 0%, rgba(27,14,4,0.35) ${r * 0.55}%, rgba(0,0,0,0) ${r}%)`}} />
);

// fachos de luz laranja e amarela vindos de baixo à esquerda (ref1 1,4 s)
export const Fachos: React.FC<{f: number; o?: number; lado?: 'esq' | 'dir'}> = ({f, o = 1, lado = 'esq'}) => (
	<div style={{position: 'absolute', inset: 0, opacity: o, transform: lado === 'dir' ? 'scaleX(-1)' : undefined}}>
		{[
			{a: -38, c: 'rgba(244,137,7,0.55)', w: 220, d: 0},
			{a: -24, c: 'rgba(248,216,52,0.38)', w: 140, d: 1.7},
			{a: -52, c: 'rgba(176,100,25,0.5)', w: 300, d: 3.1},
		].map((fa, k) => (
			<div
				key={k}
				style={{
					position: 'absolute',
					left: -160,
					bottom: -260,
					width: fa.w,
					height: 2300,
					transformOrigin: '50% 100%',
					transform: `rotate(${fa.a + Math.sin(f * 0.025 + fa.d) * 4}deg)`,
					background: `linear-gradient(to top, ${fa.c}, rgba(0,0,0,0) 85%)`,
					filter: 'blur(38px)',
					opacity: 0.75 + 0.25 * Math.sin(f * 0.05 + fa.d),
				}}
			/>
		))}
	</div>
);

export const Vinheta: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.85) 100%)', pointerEvents: 'none'}} />
);

// seta desenhada a lápis, dourada (T10)
export const Seta: React.FC<{d: string; ponta: [number, number, number]; f: number; n: number; cor?: string; largura?: number}> = ({d, ponta, f, n, cor = COR.ouro, largura = 9}) => {
	if (f < n) return null;
	const p = tw(f, n, n + 9, 0, 1, E.out);
	const pp = tw(f, n + 6, n + 10, 0, 1, E.out);
	const [px, py, ang] = ponta;
	return (
		<g style={{filter: `drop-shadow(0 0 6px ${cor}) drop-shadow(0 0 18px ${COR.fogo})`}}>
			<path d={d} fill="none" stroke={COR.nucleo} strokeWidth={largura} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} filter="url(#lapis)" />
			<g transform={`translate(${px} ${py}) rotate(${ang}) scale(${pp})`} opacity={pp}>
				<path d="M -34 -26 L 0 0 L -34 26" fill="none" stroke={COR.nucleo} strokeWidth={largura} strokeLinecap="round" strokeLinejoin="round" filter="url(#lapis)" />
			</g>
		</g>
	);
};

// estrela de 4 pontas (ref1 11,3 s)
export const Estrela: React.FC<{x: number; y: number; r: number; f: number; n: number}> = ({x, y, r, f, n}) => {
	if (f < n) return null;
	const p = tw(f, n, n + 8, 0, 1, E.back);
	const pulso = 0.85 + 0.15 * Math.sin((f - n) * 0.3);
	const s = r * p * pulso;
	return (
		<path
			d={`M ${x} ${y - s} Q ${x + s * 0.12} ${y - s * 0.12} ${x + s} ${y} Q ${x + s * 0.12} ${y + s * 0.12} ${x} ${y + s} Q ${x - s * 0.12} ${y + s * 0.12} ${x - s} ${y} Q ${x - s * 0.12} ${y - s * 0.12} ${x} ${y - s} Z`}
			fill={COR.nucleo}
			style={{filter: `drop-shadow(0 0 6px ${COR.ouro})`}}
		/>
	);
};

export const DefsSvg: React.FC = () => (
	<defs>
		<filter id="lapis" x="-20%" y="-20%" width="140%" height="140%">
			<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="r" />
			<feDisplacementMap in="SourceGraphic" in2="r" scale={4} />
		</filter>
		<filter id="halo" x="-30%" y="-30%" width="160%" height="160%">
			<feGaussianBlur stdDeviation={7} />
		</filter>
		<filter id="haloLargo" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation={18} />
		</filter>
	</defs>
);
