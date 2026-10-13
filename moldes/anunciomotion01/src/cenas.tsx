import React from 'react';
import {OffthreadVideo, Sequence, staticFile} from 'remotion';
import {C, E, FPS, SANS, T, cena, marca, mola, rnd, tw, useT} from './tema';
import {Aneis, Fundo, G, IconeVidro, Particulas, ab, brilho, hexA} from './ui';

/**
 * As 10 cenas da vitrine no anunciomotion01. Repertório do MODELO §4: número que conta com anéis (S1), produto
 * flutuando em placa inclinada (S2, S3, S7), ícone 3D herói (S4, S5), lista que destaca um (S6), pílula de destaque com
 * profundidade de campo (S8), interruptor que destrava (S9), fecho com anéis (S10). Telas claras de respiro em
 * S2, S6 e S9 (corte seco). Tudo desenhado em código: nenhuma marca, nenhuma tela de terceiro.
 */

const pop = (t: number, de: number, cfg = {}) => {
	const k = mola(t, de, {damping: 13, stiffness: 190, ...cfg});
	return {opacity: Math.min(1, k * 2), transform: `scale(${0.55 + 0.45 * k})`, filter: k < 0.6 ? `blur(${(0.6 - k) * 20}px)` : undefined} as React.CSSProperties;
};

/* ---------------------------------------------------------------- glifos novos (linha branca) */
const GL = {
	play: (s: number, cor = '#fff') => (
		<svg width={s} height={s} viewBox="0 0 100 100">
			<path d="M34 22 L80 50 L34 78 Z" fill={cor} stroke={cor} strokeWidth={8} strokeLinejoin="round" />
		</svg>
	),
	ff: (s: number, cor = '#fff') => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill={cor} stroke={cor} strokeWidth={6} strokeLinejoin="round">
			<path d="M14 26 L48 50 L14 74 Z" />
			<path d="M50 26 L84 50 L50 74 Z" />
		</svg>
	),
	mic: (s: number, cor = '#fff') => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={8} strokeLinecap="round">
			<rect x={36} y={12} width={28} height={48} rx={14} fill={cor} />
			<path d="M24 46 a26 26 0 0 0 52 0 M50 72 V88 M36 88 H64" />
		</svg>
	),
	camera: (s: number, cor = '#fff') => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={8} strokeLinejoin="round">
			<rect x={10} y={30} width={56} height={42} rx={10} fill={cor} />
			<path d="M66 44 L90 32 V70 L66 58 Z" fill={cor} />
		</svg>
	),
	celular: (s: number, cor = '#fff') => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={8}>
			<rect x={28} y={8} width={44} height={84} rx={10} />
			<line x1={44} y1={80} x2={56} y2={80} strokeLinecap="round" />
		</svg>
	),
	claquete: (s: number, cor = '#fff') => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth={7} strokeLinejoin="round">
			<rect x={12} y={42} width={76} height={46} rx={6} fill={cor} />
			<path d="M12 40 L84 22 L80 8 L10 26 Z" />
			<path d="M30 21 L38 33 M50 16 L58 28 M70 11 L76 22" />
		</svg>
	),
	coracao: (s: number, cor: string, cheio: number) => (
		<svg width={s} height={s} viewBox="0 0 100 100">
			<path d="M50 84 C 20 62, 8 46, 14 30 C 20 14, 42 12, 50 28 C 58 12, 80 14, 86 30 C 92 46, 80 62, 50 84 Z" fill={cheio > 0 ? cor : 'none'} stroke={cheio > 0 ? cor : '#fff'} strokeWidth={7} strokeLinejoin="round" style={cheio > 0 ? {filter: `drop-shadow(0 0 10px ${cor})`} : undefined} />
		</svg>
	),
	balao: (s: number) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke="#fff" strokeWidth={7} strokeLinejoin="round">
			<path d="M50 16 C 26 16, 12 30, 12 46 C 12 56, 18 64, 26 70 L 22 86 L 40 76 C 44 77, 47 77, 50 77 C 74 77, 88 62, 88 46 C 88 30, 74 16, 50 16 Z" />
		</svg>
	),
	envio: (s: number) => (
		<svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke="#fff" strokeWidth={7} strokeLinejoin="round">
			<path d="M10 46 L90 14 L64 88 L48 58 Z M48 58 L90 14" />
		</svg>
	),
	cursor: (s: number) => (
		<svg width={s} height={s * 1.22} viewBox="0 0 90 110">
			<path d="M8 6 L8 86 L28 68 L42 100 L56 94 L42 62 L70 62 Z" fill="#fff" stroke="#111" strokeWidth={5} strokeLinejoin="round" />
		</svg>
	),
};

/* ---------------------------------------------------------------- telinhas abstratas de "modelo de edição" */
/** desenho genérico de um vídeo vertical editado (variante 0-3); nada de tela real, nada de terceiro */
const Telinha: React.FC<{v: number; larg: number; alt: number; t: number; claro?: boolean}> = ({v, larg, alt, t, claro}) => {
	const fundo = claro ? 'linear-gradient(170deg, #E3F4EC, #CFE9DD)' : 'linear-gradient(170deg, #12201A, #070D0A)';
	const tinta = claro ? 'rgba(13,26,20,0.75)' : 'rgba(255,255,255,0.85)';
	const fraco = claro ? 'rgba(13,26,20,0.18)' : 'rgba(255,255,255,0.16)';
	const u = larg / 100;
	const pulso = 0.5 + 0.5 * Math.sin(t * 3 + v);
	return (
		<div style={{position: 'absolute', inset: 0, background: fundo, overflow: 'hidden'}}>
			{v === 0 && (
				<>
					<div style={ab(larg / 2 - 18 * u, alt * 0.22, {width: 36 * u, height: 36 * u, borderRadius: '50%', background: fraco})} />
					<div style={ab(larg / 2 - 34 * u, alt * 0.22 + 38 * u, {width: 68 * u, height: 50 * u, borderRadius: `${34 * u}px ${34 * u}px 0 0`, background: fraco})} />
					<div style={ab(14 * u, alt * 0.66, {width: 72 * u, height: 7 * u, borderRadius: 4 * u, background: tinta})} />
					<div style={ab(24 * u, alt * 0.66 + 11 * u, {width: 52 * u * (0.4 + 0.6 * pulso), height: 7 * u, borderRadius: 4 * u, background: C.v, boxShadow: `0 0 ${6 * u}px ${C.v}`})} />
				</>
			)}
			{v === 1 && (
				<>
					<div style={ab(0, 0, {width: larg, height: alt / 2 - 2 * u, background: fraco})} />
					<div style={ab(larg / 2 - 15 * u, alt / 4 - 15 * u, {width: 30 * u, height: 30 * u, borderRadius: '50%', background: claro ? 'rgba(13,26,20,0.25)' : 'rgba(255,255,255,0.25)'})} />
					<div style={ab(12 * u, alt * 0.58, {width: 76 * u, height: 26 * u, borderRadius: 6 * u, border: `${1.5 * u}px solid ${C.v}`})} />
					<div style={ab(12 * u, alt * 0.82, {width: 50 * u, height: 6 * u, borderRadius: 3 * u, background: tinta})} />
				</>
			)}
			{v === 2 &&
				[0, 1, 2, 3].map((k) => (
					<div key={k} style={ab(8 * u + (k % 2) * 44 * u, alt * 0.14 + Math.floor(k / 2) * 44 * u * 1.4, {width: 40 * u, height: 40 * u * 1.3, borderRadius: 6 * u, background: k === Math.floor(t * 2 + v) % 4 ? hexA(C.v, 0.55) : fraco})} />
				))}
			{v === 3 && (
				<>
					<div style={ab(12 * u, alt * 0.2, {width: 76 * u, height: 14 * u, borderRadius: 4 * u, background: tinta})} />
					<div style={ab(12 * u, alt * 0.2 + 18 * u, {width: 46 * u, height: 14 * u, borderRadius: 4 * u, background: C.v, boxShadow: `0 0 ${6 * u}px ${C.v}`})} />
					<svg style={ab(10 * u, alt * 0.62)} width={80 * u} height={24 * u} viewBox="0 0 80 24">
						{Array.from({length: 16}, (_, k) => {
							const h = 4 + 16 * Math.abs(Math.sin(k * 1.7 + t * 5));
							return <rect key={k} x={k * 5} y={12 - h / 2} width={3} height={h} rx={1.5} fill={tinta} />;
						})}
					</svg>
				</>
			)}
			<div style={ab(6 * u, alt - 9 * u, {width: 88 * u, height: 2.4 * u, borderRadius: u, background: fraco})} />
			<div style={ab(6 * u, alt - 9 * u, {width: 88 * u * ((t * 0.3 + v * 0.23) % 1), height: 2.4 * u, borderRadius: u, background: C.v})} />
		</div>
	);
};

/** placa inclinada em perspectiva, com sombra e contorno brilhante (MODELO §4.5) */
const Placa: React.FC<{x: number; y: number; larg: number; alt: number; rx?: number; ry?: number; rz?: number; s?: number; acesa?: number; op?: number; blur?: number; claro?: boolean; children: React.ReactNode}> = ({x, y, larg, alt, rx = 0, ry = 0, rz = 0, s = 1, acesa = 0, op = 1, blur = 0, claro, children}) => (
	<div style={ab(x - larg / 2, y - alt / 2, {width: larg, height: alt, transform: `perspective(1800px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`, opacity: op, filter: blur > 0.3 ? `blur(${blur}px)` : undefined})}>
		<div style={{position: 'absolute', inset: 0, borderRadius: larg * 0.08, overflow: 'hidden', border: `${3 + 2 * acesa}px solid ${acesa > 0 ? hexA(C.v, 0.5 + 0.5 * Math.min(1, acesa)) : claro ? 'rgba(13,26,20,0.12)' : 'rgba(255,255,255,0.14)'}`, boxShadow: `${claro ? '0 30px 60px rgba(10,80,50,0.18)' : '0 40px 80px rgba(0,0,0,0.6)'}${acesa > 0 ? `, 0 0 ${70 * acesa}px ${hexA(C.v, Math.min(1, 0.7 * acesa))}` : ''}`}}>
			{children}
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 34%)'}} />
		</div>
	</div>
);

/* ================================================================ S1: "Esse vídeo está sendo 100% editado pelo Claude." */
export const S1: React.FC = () => {
	const {t} = useT();
	const cem = marca('cem');
	return (
		<>
			<Fundo tom="marca" />
			<Particulas n={26} semente={2} de={0} cor={C.vClaro} />
			<Aneis de={marca('inicio')} cx={500} cy={760} r0={250} passo={115} n={4} cor={C.v} />
			{/* antes do número: o play de vidro no centro, que dá lugar ao contador em "100%" */}
			{t < cem + 0.2 && (
				<div style={ab(500 - 130, 760 - 130, {...pop(t, marca('inicio') - 0.05), opacity: (1 - tw(t, cem - 0.08, cem + 0.12, 0, 1)) * Math.min(1, mola(t, marca('inicio') - 0.05) * 2)})}>
					<IconeVidro tam={260} giroY={Math.sin(t * 1.6) * 16} giroX={Math.cos(t * 1.2) * 6}>
						{GL.play(140)}
					</IconeVidro>
				</div>
			)}
			<Particulas n={40} semente={3} explode={cem} cor={C.v} />
		</>
	);
};

/* ================================================================ S2 (claro): "Ele foi criado justamente para" */
export const S2: React.FC = () => {
	const {t} = useT();
	const de = cena('S2').de;
	const k = mola(t, de, {damping: 17, stiffness: 90, mass: 1});
	const clipes = [
		{tr: 0, x: 0, l: 34, de: marca('clipe1'), cor: C.vFundo},
		{tr: 0, x: 36, l: 26, de: marca('clipe2'), cor: C.tinta},
		{tr: 1, x: 10, l: 30, de: marca('clipe3'), cor: '#7FE3B8'},
		{tr: 0, x: 64, l: 34, de: marca('clipe4'), cor: C.vFundo},
		{tr: 1, x: 44, l: 40, de: marca('clipe5'), cor: C.tinta},
		{tr: 2, x: 0, l: 96, de: marca('clipe3'), cor: '#BFE9D6'},
	];
	const cab = tw(t, de, de + 1.5, 4, 92, (x) => x);
	return (
		<>
			<Fundo claro />
			<Placa x={540} y={640 + (1 - k) * 500} larg={860} alt={680} rx={14 - 6 * k} ry={-14 + Math.sin(t) * 3} rz={-4 + 2 * k} op={Math.min(1, k * 2)} claro>
				<div style={{position: 'absolute', inset: 0, background: '#FFFFFF'}} />
				{/* prévia do vídeo em cima */}
				<div style={ab(40, 36, {width: 780, height: 330, borderRadius: 22, background: 'linear-gradient(160deg, #11201A, #050807)', overflow: 'hidden'})}>
					<div style={ab(390 - 60, 165 - 60, {width: 120, height: 120, borderRadius: 60, background: hexA(C.v, 0.18), border: `3px solid ${C.v}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${hexA(C.v, 0.5)}`})}>{GL.play(70, C.v)}</div>
				</div>
				{/* linha do tempo: três trilhas, um clipe cai a cada palavra */}
				{[0, 1, 2].map((tr) => (
					<div key={tr} style={ab(40, 400 + tr * 84, {width: 780, height: 64, borderRadius: 14, background: '#EEF5F1'})} />
				))}
				{clipes.map((c, i) => {
					const kc = mola(t, c.de, {damping: 14, stiffness: 200});
					if (t < c.de) return null;
					return <div key={i} style={ab(40 + c.x * 7.8, 400 + c.tr * 84 - (1 - kc) * 120, {width: c.l * 7.8 - 6, height: 64, borderRadius: 14, background: c.cor, opacity: Math.min(1, kc * 2), boxShadow: c.cor === C.vFundo ? `0 6px 20px ${hexA(C.vFundo, 0.4)}` : undefined})} />;
				})}
				<div style={ab(40 + cab * 7.8, 380, {width: 5, height: 280, background: C.tinta, borderRadius: 3})} />
				<div style={ab(40 + cab * 7.8 - 14, 366, {width: 32, height: 22, borderRadius: 6, background: C.tinta})} />
			</Placa>
		</>
	);
};

/* ================================================================ S3: "te mostrar a diferença entre vários modelos que eu criei e melhorei" */
export const S3: React.FC = () => {
	const {t} = useT();
	const ents = [marca('placa1'), marca('placa2'), marca('placa3')];
	const melhorei = marca('melhorei');
	const acesa = tw(t, melhorei, melhorei + 0.25, 0, 1);
	const kc = mola(t, melhorei + 0.05, {damping: 11, stiffness: 170});
	const pos = [
		{x: 250, ry: 28, rz: -6, v: 1},
		{x: 750, ry: -28, rz: 6, v: 2},
		{x: 500, ry: 0, rz: 0, v: 0},
	];
	return (
		<>
			<Fundo tom="marca" />
			<Particulas n={18} semente={4} de={4.5} />
			{pos.map((p, i) => {
				const k = mola(t, ents[i] - 0.05, {damping: 15, stiffness: 110});
				if (t < ents[i] - 0.05) return null;
				const centro = i === 2;
				return (
					<Placa key={i} x={p.x} y={680 + (1 - k) * 700 + Math.sin(t * 1.3 + i) * 8} larg={centro ? 380 : 320} alt={centro ? 676 : 570} ry={p.ry * (0.6 + 0.4 * k) + (1 - k) * (i === 1 ? -40 : 40)} rz={p.rz} rx={8} op={Math.min(1, k * 2) * (centro ? 1 : 1 - 0.45 * acesa)} acesa={centro ? acesa : 0} blur={centro ? 0 : 3 * acesa}>
						<Telinha v={p.v} larg={centro ? 380 : 320} alt={centro ? 676 : 570} t={t} />
					</Placa>
				);
			})}
			{t >= melhorei && (
				<div style={ab(610, 300, {opacity: Math.min(1, kc * 2), transform: `scale(${0.3 + 0.7 * kc})`})}>
					<IconeVidro tam={150} giroY={(1 - kc) * 90 + Math.sin(t * 1.5) * 8}>
						{G.check(100, '#fff', tw(t, melhorei + 0.1, melhorei + 0.4, 0, 1))}
					</IconeVidro>
				</div>
			)}
		</>
	);
};

/* ================================================================ S4: "para editar qualquer tipo de vídeo usando o Claude." */
export const S4: React.FC = () => {
	const {t} = useT();
	const de = cena('S4').de;
	const k = mola(t, de, {damping: 12, stiffness: 110, mass: 0.9});
	const orb = [
		{de: marca('orbita1'), g: GL.mic},
		{de: marca('orbita2'), g: GL.camera},
		{de: marca('orbita3'), g: GL.celular},
		{de: marca('orbita4'), g: GL.claquete},
	];
	return (
		<>
			<Fundo tom="marca" />
			<Aneis de={de} cx={540} cy={620} r0={230} passo={120} n={3} cor={C.v} />
			<Particulas n={22} semente={5} de={de} />
			<div style={ab(540 - 170, 620 - 170, {opacity: Math.min(1, k * 1.8), transform: `scale(${0.3 + 0.7 * k})`})}>
				<IconeVidro tam={340} giroY={(1 - k) * -140 + Math.sin(t * 1.4) * 12} giroX={Math.cos(t * 1.1) * 6}>
					{GL.play(180)}
				</IconeVidro>
			</div>
			{orb.map((o, i) => {
				if (t < o.de - 0.04) return null;
				const ko = mola(t, o.de - 0.04, {damping: 13, stiffness: 160});
				const a = (i / 4) * Math.PI * 2 - Math.PI * 0.75 + (t - de) * 0.35;
				const r = 330 * (0.5 + 0.5 * ko);
				const x = 540 + Math.cos(a) * r;
				const y = 620 + Math.sin(a) * r * 0.78;
				return (
					<div key={i} style={ab(x - 65, y - 65, {opacity: Math.min(1, ko * 2), transform: `scale(${0.4 + 0.6 * ko})`})}>
						<IconeVidro tam={130} giroY={Math.sin(t * 1.7 + i) * 18}>
							{o.g(70)}
						</IconeVidro>
					</div>
				);
			})}
		</>
	);
};

/* ================================================================ S5: "Inclusive, se você estiver no Instagram agora," */
export const S5: React.FC = () => {
	const {t} = useT();
	const de = cena('S5').de;
	const k = mola(t, de, {damping: 18, stiffness: 170, mass: 0.8});
	const insta = marca('coracao');
	const kh = mola(t, insta, {damping: 9, stiffness: 220});
	const p = t - de;
	const L = 400;
	const H = L * 2.05;
	return (
		<>
			<Fundo tom="marca" />
			<Particulas n={16} semente={8} de={de} />
			<div style={ab(540 - L / 2 - 14, 150 + (1 - k) * 900, {transform: `perspective(2200px) rotateX(${12 - 5 * k + Math.sin(p * 1.2) * 2}deg) rotateY(${-24 + 10 * k + p * 3}deg) rotateZ(${6 - 3 * k}deg)`, opacity: Math.min(1, k * 2)})}>
				<div style={{width: L + 28, height: H + 28, borderRadius: L * 0.15, background: 'linear-gradient(145deg, #2E3B35, #090D0B 40%, #1A2420)', padding: 14, boxSizing: 'border-box', boxShadow: `0 0 0 2px rgba(255,255,255,0.10), 0 40px 90px rgba(0,0,0,0.6), 0 0 120px ${hexA(C.v, 0.3)}`}}>
					<div style={{position: 'relative', width: L, height: H, borderRadius: L * 0.12, overflow: 'hidden'}}>
						{/* um vídeo vertical genérico tocando: este próprio, com o 100% da abertura */}
						<Telinha v={3} larg={L} alt={H} t={t} />
						<div style={ab(0, H * 0.36, {width: L, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 120, letterSpacing: '-0.06em', color: '#fff', textShadow: brilho(C.v, 1.2)})}>
							100<span style={{color: C.v}}>%</span>
						</div>
						{[0, 1, 2, 3].map((i) => (
							<div key={i} style={ab(18 + i * ((L - 36) / 4), 26, {width: (L - 36) / 4 - 6, height: 5, borderRadius: 3, background: i < 1 ? '#fff' : i === 1 ? `linear-gradient(90deg, #fff ${((p * 40) % 100).toFixed(0)}%, rgba(255,255,255,0.3) 0)` : 'rgba(255,255,255,0.3)'})} />
						))}
						<div style={ab(L - 78, H * 0.5, {display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center'})}>
							<div style={{transform: `scale(${1 + 0.45 * Math.sin(Math.min(1, (t - insta) * 3) * Math.PI) * (t > insta ? 1 : 0)})`}}>{GL.coracao(62, C.v, t >= insta ? kh : 0)}</div>
							{GL.balao(58)}
							{GL.envio(54)}
						</div>
					</div>
				</div>
			</div>
			{t >= insta && <Particulas n={18} semente={9} explode={insta} cor={C.v} />}
		</>
	);
};

/* ================================================================ S6 (claro): "você está vendo apenas um desses modelos." */
export const S6: React.FC = () => {
	const {t} = useT();
	const de = cena('S6').de;
	const apenas = marca('apenas');
	const um = marca('um');
	const apaga = tw(t, apenas, apenas + 0.2, 0, 1);
	const ku = mola(t, um, {damping: 13, stiffness: 150});
	return (
		<>
			<Fundo claro />
			{[0, 2, 3, 4, 5, 1].map((i) => {
				const col = i % 3;
				const lin = Math.floor(i / 3);
				const k = mola(t, de + i * 0.05, {damping: 15, stiffness: 160});
				const eleito = i === 1;
				const x = 210 + col * 290;
				const y = 520 + lin * 400;
				const s = eleito ? 1 + 0.32 * ku : 1 - 0.08 * apaga;
				return (
					<div key={i} style={{position: 'absolute', inset: 0, filter: eleito ? undefined : `grayscale(${apaga}) blur(${apaga * 4}px)`, opacity: eleito ? 1 : 1 - 0.55 * apaga}}>
						<Placa x={x} y={eleito ? y + 140 * ku : y} larg={240} alt={360} rx={6} ry={(col - 1) * -10} s={s * (0.6 + 0.4 * k)} op={Math.min(1, k * 2)} acesa={eleito ? ku : 0} claro>
							<Telinha v={i % 4} larg={240} alt={360} t={t} claro={!eleito} />
						</Placa>
					</div>
				);
			})}
		</>
	);
};

/* ================================================================ S7: prévias "Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes." */
const PREV = {w: 330, h: 587, x: [290, 710], y: 560};
export const Previas: React.FC<{nomes: [string, string]}> = ({nomes}) => {
	const {t} = useT();
	if (!T.previas) return null; // o plano sem "previas": fica só o ícone de avanço
	const de = T.previas.de_q / FPS;
	if (t < de) return null;
	return (
		<>
			{[0, 1].map((i) => {
				const n = de + i * 0.1;
				const k = mola(t, n, {damping: 16, stiffness: 100});
				const x = PREV.x[i] + (1 - k) * (i === 0 ? -620 : 620);
				const ry = (i === 0 ? 14 : -14) * (0.4 + 0.6 * k) + (1 - k) * (i === 0 ? 50 : -50) + Math.sin(t * 1.1 + i) * 2;
				const kl = tw(t, n + 0.35, n + 0.6, 0, 1);
				return (
					<React.Fragment key={i}>
						<Placa x={x} y={PREV.y + Math.sin(t * 1.8 + i * 1.7) * 6} larg={PREV.w} alt={PREV.h} rx={6} ry={ry} rz={i === 0 ? -2 : 2} acesa={0.8} op={Math.min(1, k * 2)}>
							<div style={{position: 'absolute', inset: 0, background: '#000'}}>
								<Sequence from={Math.round(n * FPS)} layout="none">
									<OffthreadVideo muted src={staticFile(`previa${i + 1}.mp4`)} style={{width: PREV.w, height: PREV.h, objectFit: 'cover'}} />
								</Sequence>
							</div>
						</Placa>
						<div style={ab(PREV.x[i] - 200, PREV.y + PREV.h / 2 + 22, {width: 400, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: '-0.01em', color: '#fff', textShadow: brilho(C.v, 0.35), opacity: kl, filter: kl < 1 ? `blur(${(1 - kl) * 10}px)` : undefined})}>{nomes[i]}</div>
					</React.Fragment>
				);
			})}
		</>
	);
};

const Seta: React.FC<{d: string; ponta: string; de: number}> = ({d, ponta, de}) => {
	const {t} = useT();
	const k = tw(t, de, de + 0.35, 0, 1, E.inOut);
	const kp = tw(t, de + 0.3, de + 0.42, 0, 1);
	if (t < de) return null;
	return (
		<svg style={ab(0, 0)} width={1080} height={1920}>
			<path d={d} fill="none" stroke={C.v} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} style={{filter: `drop-shadow(0 0 8px ${C.v})`}} />
			<path d={ponta} fill="none" stroke={C.v} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={kp} style={{filter: `drop-shadow(0 0 8px ${C.v})`}} />
		</svg>
	);
};

export const S7: React.FC<{previas: boolean; nomes: [string, string]}> = ({previas, nomes}) => {
	const {t} = useT();
	const de = cena('S7').de;
	const pv = T.previas ? T.previas.de_q / FPS : 0;
	const acel = marca('aceleradas');
	const k = mola(t, de + 0.1, {damping: 12, stiffness: 120});
	const saiIcone = previas && T.previas ? tw(t, pv - 0.15, pv + 0.1, 0, 1) : 0;
	const corre = t > acel ? t - acel : -1;
	return (
		<>
			<Fundo tom="marca" />
			<Aneis de={de} cx={500} cy={560} r0={300} passo={140} n={3} cor={C.v} />
			<Particulas n={20} semente={10} de={de} />
			{/* o ícone de avanço rápido segura a tela até as prévias pousarem (sem prévias, fica) */}
			{saiIcone < 1 && (
				<div style={ab(500 - 150, 560 - 150, {opacity: Math.min(1, k * 2) * (1 - saiIcone), transform: `scale(${(0.3 + 0.7 * k) * (1 - 0.4 * saiIcone)})`, filter: saiIcone > 0 ? `blur(${saiIcone * 20}px)` : undefined})}>
					<IconeVidro tam={300} giroY={(1 - k) * 120 + Math.sin(t * 1.5) * 12}>
						{GL.ff(170)}
					</IconeVidro>
				</div>
			)}
			{/* "aceleradas": riscos de velocidade atravessando atrás */}
			{corre >= 0 &&
				Array.from({length: 9}, (_, i) => {
					const y = 300 + rnd(i + 40) * 560;
					const vel = 1600 + rnd(i + 41) * 1400;
					const x = -400 + (((corre + rnd(i + 42) * 0.6) * vel) % 2000);
					return <div key={i} style={ab(x, y, {width: 240 + rnd(i + 43) * 200, height: 5, borderRadius: 3, background: `linear-gradient(90deg, rgba(60,242,164,0), ${C.v})`, opacity: 0.55 * (1 - tw(t, acel + 1.2, acel + 1.6, 0, 1)), boxShadow: `0 0 12px ${C.v}`})} />;
				})}
			{previas && <Previas nomes={nomes} />}
			{/* "aqui em cima": duas setas desenhadas apontando para o alto */}
			<Seta d="M 90 1080 C 60 980, 80 930, 120 880" ponta="M 96 902 L 120 878 L 140 906" de={marca('setas')} />
			<Seta d="M 910 1080 C 940 980, 920 930, 880 880" ponta="M 860 906 L 880 878 L 904 902" de={marca('setas') + 0.06} />
		</>
	);
};

/* ================================================================ S8: "Mas se você quiser realmente ver [outros modelos de edição] como esse e aprender" */
export const S8: React.FC = () => {
	const {t} = useT();
	const de = cena('S8').de;
	const outros = marca('outros');
	const foco = tw(t, outros - 0.1, outros + 0.3, 0, 1);
	const planos = [
		{x: 170, y: 520, z: 0.8, v: 0},
		{x: 860, y: 430, z: 0.9, v: 1},
		{x: 300, y: 980, z: 1.15, v: 2},
		{x: 800, y: 1010, z: 1.05, v: 3},
		{x: 540, y: 380, z: 0.65, v: 2},
	];
	return (
		<>
			<Fundo tom="marca" />
			<Particulas n={30} semente={11} de={de} />
			{planos.map((p, i) => {
				const k = mola(t, de + i * 0.08, {damping: 16, stiffness: 90});
				return (
					<Placa key={i} x={p.x + Math.sin(t * 0.6 + i) * 20} y={p.y - (t - de) * 18 * p.z} larg={220 * p.z} alt={390 * p.z} rx={10} ry={(p.x < 540 ? 24 : -24) + Math.sin(t + i) * 4} rz={p.x < 540 ? -5 : 5} op={Math.min(1, k * 2) * (0.85 - 0.4 * foco)} blur={2 + 7 * foco * p.z} acesa={0.3}>
						<Telinha v={p.v} larg={220 * p.z} alt={390 * p.z} t={t} />
					</Placa>
				);
			})}
			{t >= outros && <Aneis de={outros} cx={500} cy={870} r0={300} passo={120} n={2} cor={C.v} />}
		</>
	);
};

/* ================================================================ S9 (claro): "a como usar isso nos seus vídeos," */
export const S9: React.FC = () => {
	const {t} = useT();
	const de = cena('S9').de;
	const usar = marca('usar');
	const videos = marca('videos');
	const liga = tw(t, usar, usar + 0.2, 0, 1, E.inOut);
	const kb = mola(t, de, {damping: 15, stiffness: 150});
	const cur = tw(t, de + 0.05, usar - 0.02, 0, 1, E.inOut);
	const aperta = Math.max(0, 1 - Math.abs(t - usar) / 0.1);
	return (
		<>
			<Fundo claro />
			{/* interruptor OFF -> ON (MODELO §4.10) */}
			<div style={ab(500 - 200, 470 - 100, {width: 400, height: 200, borderRadius: 100, opacity: Math.min(1, kb * 2), transform: `scale(${(0.7 + 0.3 * kb) * (1 - 0.05 * aperta)})`, background: liga > 0 ? `linear-gradient(160deg, ${C.vClaro}, ${C.vFundo})` : '#DCE6E1', boxShadow: liga > 0 ? `0 0 ${80 * liga}px ${hexA(C.vFundo, 0.6)}, inset 0 4px 12px rgba(0,0,0,0.08)` : 'inset 0 6px 16px rgba(0,0,0,0.12)'})}>
				<div style={ab(16 + 200 * liga, 16, {width: 168, height: 168, borderRadius: 84, background: '#fff', boxShadow: '0 10px 26px rgba(10,60,40,0.25)'})} />
			</div>
			{t < usar + 0.3 && (
				<div style={ab(860 - cur * 200, 760 - cur * 230, {opacity: 1 - tw(t, usar + 0.1, usar + 0.3, 0, 1), transform: `scale(${1 - 0.15 * aperta})`})}>{GL.cursor(80)}</div>
			)}
			{liga > 0 && <Particulas n={16} semente={19} explode={usar} cor={C.vFundo} />}
			{/* "seus vídeos": três telinhas sobem já editadas */}
			{[0, 1, 2].map((i) => {
				const n = videos + i * 0.08;
				if (t < n - 0.03) return null;
				const k = mola(t, n - 0.03, {damping: 14, stiffness: 160});
				return (
					<Placa key={i} x={250 + i * 250} y={840 + (1 - k) * 200} larg={200} alt={300} rx={6} ry={(i - 1) * -14} op={Math.min(1, k * 2)} acesa={i === 1 ? 0.7 : 0} claro>
						<Telinha v={[0, 3, 1][i]} larg={200} alt={300} t={t} claro={i !== 1} />
					</Placa>
				);
			})}
		</>
	);
};

/* ================================================================ S10: comenta "EDIÇÃO" aqui embaixo que eu vou te mandar na sua DM agora. */
export const S10: React.FC = () => {
	const {t} = useT();
	const de = cena('S10').de;
	const ed = marca('edicao');
	const emb = marca('embaixo');
	return (
		<>
			<Fundo tom="marca" />
			<Particulas n={26} semente={20} de={de} />
			{t >= ed && <Aneis de={ed} cx={500} cy={880} r0={330} passo={130} n={3} cor={C.v} />}
			<Particulas n={40} semente={21} explode={ed} cor={C.v} />
			<Seta d="M 500 985 C 470 1030, 530 1060, 500 1105" ponta="M 476 1082 L 500 1108 L 524 1082" de={emb} />
		</>
	);
};
