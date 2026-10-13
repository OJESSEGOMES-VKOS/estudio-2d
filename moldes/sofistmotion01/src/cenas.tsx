// As 10 telas do vídeo (plano.md). Cada uma recebe o quadro global f. O texto é desenhado por fora (Reel.tsx),
// fora da câmera de cada cena, para não sair da zona segura quando a câmera aproxima.
import React from 'react';
import {OffthreadVideo, Sequence, staticFile} from 'remotion';
import {AnelNeon, Cartao, Celular, Cursor, Ladrilho, Notebook, Pasta, Roleta, TelaEditor, TelaReels} from './objetos';
import {COR, DefsSvg, E, Estrela, Fachos, FILTRO_NEON, H, HALO_TEXTO, INTER, Nevoa, Poeira, Seta, T, W, cena, clamp, ini, marca, mede, surge, tw, txt} from './base';

/** início e fim (quadros) da cena no plano: cada tela conta o tempo a partir do começo dela */
const janela = (id: string) => {
	const c = cena(id);
	return {c0: c.de_q, c1: c.ate_q, dur: c.ate_q - c.de_q};
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}>
		<DefsSvg />
		{children}
	</svg>
);
const Camera: React.FC<{s?: number; x?: number; y?: number; r?: number; ox?: number; oy?: number; blur?: number; children: React.ReactNode}> = ({s = 1, x = 0, y = 0, r = 0, ox = 540, oy = 960, blur = 0, children}) => (
	<div style={{position: 'absolute', inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>{children}</div>
);

// ============ C1: T1 palavra gigante deslizando + T3 contador no anel ============
const FSG = 300;
export const marquee = (f: number) => 230 - 30 * (f - 4);
/** a linha do bloco que nasce da palavra gigante (tipo "gigante" no src/tempos.json; "gigante" = os ids que deslizam) */
export const linhaGigante = () => T.blocos.flatMap((b) => b.linhas as {ids: number[]; fs: number; y: number; tipo?: string; gigante?: number[]}[]).find((l) => l.tipo === 'gigante');
export const C1: React.FC<{f: number; ok: boolean}> = ({f: fg, ok}) => {
	const {c0, dur} = janela('C1');
	const f = fg - c0;
	const lg = linhaGigante();
	const g = lg?.gigante ?? [];
	const giante = ok && f < 28 && !!lg;
	// gigante → encolhe para a 1ª linha do bloco (y 770, 68 px), ref1 0,5 s
	const L = ok && lg ? 540 - mede(lg.ids.map(txt).join(' '), lg.fs) / 2 : 0;
	const p = tw(f, 20, 27, 0, 1, E.io);
	const X = lerp(marquee(Math.min(f, 31)), L, p);
	const Y = lerp(960, lg?.y ?? 960, p);
	const s = lerp(1, (lg?.fs ?? FSG) / FSG, p);
	const og = f < 24 ? 1 : tw(f, 24, 27, 1, 0, E.lin);
	const xs = g.map((_, k) => (ok && k > 0 ? mede(g.slice(0, k).map(txt).join(' ') + ' ', FSG) : 0));
	const palavra = (k: number, texto: string, x: number) => <span key={k} style={{position: 'absolute', left: x, top: 0, ...surge(fg, ini(k), 5, 22, 0.06)}}>{texto}</span>;
	const gigantes = () => g.map((k, j) => palavra(k, txt(k), xs[j]));
	// anel de progresso + contador (100% dito em 1,20 s)
	const n0 = marca('contador');
	const prog = tw(fg, n0, n0 + 16, 0, 1, E.out);
	const ea = tw(fg, n0 - 2, n0 + 10, 0, 1, E.out);
	const pico = fg >= n0 + 16 ? Math.exp(-(fg - n0 - 16) / 6) : 0;
	const R = 432;
	const C = 2 * Math.PI * R;
	return (
		<div style={{position: 'absolute', inset: 0, background: COR.fundo}}>
			<Camera s={1 + 0.05 * (f / dur)} r={f * 0.012}>
				<Nevoa x={18} y={10} r={70} cor="rgba(176,100,25,0.55)" />
				<Nevoa x={85} y={95} r={55} cor="rgba(176,100,25,0.3)" />
				<Poeira f={f} seed="c1" n={80} />
				{fg >= n0 - 2 && (
					<Svg style={{opacity: ea, transform: `scale(${0.72 + 0.28 * ea})`, transformOrigin: '540px 960px', filter: ea < 1 ? `blur(${(1 - ea) * 12}px)` : undefined}}>
						<AnelNeon cx={540} cy={960} r={R + 62} arcos={28} abertura={0.45} rot={-f * 0.4} larg={1.6} o={0.7} />
						<AnelNeon cx={540} cy={960} r={R - 50} arcos={3} abertura={0.55} rot={f * 0.9} larg={1.6} cor={COR.fogo} o={0.75} />
						<circle cx={540} cy={960} r={R} fill="none" stroke={COR.fogoNevoa} strokeWidth={10} opacity={0.35} />
						{[...Array(72)].map((_, k) => {
							const a = (k / 72) * Math.PI * 2 - Math.PI / 2;
							const aceso = k / 72 <= prog;
							const r0 = R + 22, r1 = R + (k % 6 === 0 ? 44 : 34);
							return <line key={k} x1={540 + r0 * Math.cos(a)} y1={960 + r0 * Math.sin(a)} x2={540 + r1 * Math.cos(a)} y2={960 + r1 * Math.sin(a)} stroke={aceso ? COR.nucleo : COR.fogoNevoa} strokeWidth={k % 6 === 0 ? 3 : 2} opacity={aceso ? 1 : 0.45} />;
						})}
						<g transform="rotate(-90 540 960)">
							<circle cx={540} cy={960} r={R} fill="none" stroke={COR.fogo} strokeWidth={34 + 30 * pico} strokeDasharray={`${C * prog} ${C}`} filter="url(#haloLargo)" opacity={0.9} />
							<circle cx={540} cy={960} r={R} fill="none" stroke={COR.ouro} strokeWidth={12} strokeDasharray={`${C * prog} ${C}`} strokeLinecap="round" />
							<circle cx={540} cy={960} r={R} fill="none" stroke={COR.nucleo} strokeWidth={4} strokeDasharray={`${C * prog} ${C}`} strokeLinecap="round" />
						</g>
						{prog > 0 && prog < 1 && <circle cx={540 + R * Math.cos(prog * 2 * Math.PI - Math.PI / 2)} cy={960 + R * Math.sin(prog * 2 * Math.PI - Math.PI / 2)} r={10} fill={COR.nucleo} style={{filter: `drop-shadow(0 0 14px ${COR.ouroAlto})`}} />}
						<Estrela x={540} y={960 - R} r={60} f={fg} n={n0 + 16} />
						<Estrela x={540 + R * 0.72} y={960 - R * 0.72} r={30} f={fg} n={n0 + 18} />
					</Svg>
				)}
			</Camera>
			{giante && (
				<div style={{position: 'absolute', left: 0, top: Y - FSG * 0.5, height: FSG, transformOrigin: '0 50%', transform: `translateX(${X}px) scale(${s})`, opacity: og}}>
					{f < 22 &&
						[3, 2, 1].map((k) => (
							<div key={k} style={{position: 'absolute', left: k * 46, top: 0, whiteSpace: 'nowrap', fontFamily: INTER, fontWeight: 700, fontSize: FSG, letterSpacing: '-0.02em', lineHeight: 1, color: '#FBFBFB', opacity: [0, 0.22, 0.11, 0.05][k], filter: `blur(${2 + k * 3}px)`}}>
								{gigantes()}
							</div>
						))}
					<div style={{position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', fontFamily: INTER, fontWeight: 700, fontSize: FSG, letterSpacing: '-0.02em', lineHeight: 1, color: '#FBFBFB', textShadow: '0 0 30px rgba(255,214,140,0.35)'}}>
						{gigantes()}
					</div>
				</div>
			)}
		</div>
	);
};

// linha do contador do B1: "100%" com o número contando e o "%" em contorno neon
export const LinhaContador: React.FC<{f: number; y: number; fs: number; i: number}> = ({f, y, fs, i}) => {
	const n0 = ini(i);
	if (f < n0) return null;
	const v = Math.round(100 * tw(f, n0, n0 + 16, 0, 1, E.out));
	const dig = String(v).padStart(3, '0');
	const zeros = dig.length - String(v).length;
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: y - fs * 0.5, height: fs, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: INTER, fontWeight: 700, fontSize: fs, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...surge(f, n0, 6, 18, 0.1)}}>
			{dig.split('').map((d, k) => (
				<span key={k} style={{color: COR.texto, opacity: k < zeros ? 0 : 1, textShadow: `0 0 14px rgba(248,216,52,0.55), 0 0 40px rgba(244,137,7,0.45)`}}>
					{d}
				</span>
			))}
			<span style={{color: 'transparent', WebkitTextStroke: `${fs * 0.024}px ${COR.nucleo}`, filter: FILTRO_NEON(COR.fogo), marginLeft: fs * 0.03}}>%</span>
		</div>
	);
};

// ============ C2: T2 notebook entrando girando, a linha do tempo se montando ============
export const C2: React.FC<{f: number}> = ({f}) => {
	const {c0, c1, dur} = janela('C2');
	const p = tw(f, c0, c0 + 15, 0, 1, E.out);
	const ry = lerp(168, -16, p) - Math.max(0, f - (c0 + 15)) * 0.18;
	const mergulho = tw(f, c1 - 9, c1, 0, 1, E.in);
	return (
		<div style={{position: 'absolute', inset: 0, background: COR.fundo}}>
			<Camera s={1 + 0.03 * ((f - c0) / dur)}>
				<Nevoa x={10} y={80} r={70} cor="rgba(244,137,7,0.4)" />
				<Fachos f={f} />
				<Poeira f={f} seed="c2" n={50} estrelas={12} />
			</Camera>
			<Camera s={1 + 4.2 * mergulho} ox={540} oy={560} blur={mergulho > 0.6 ? (mergulho - 0.6) * 25 : 0}>
				<div style={{position: 'absolute', inset: 0, perspective: 2200, perspectiveOrigin: '540px 640px'}}>
					<div style={{position: 'absolute', left: 540 - 380, top: 320, transformStyle: 'preserve-3d', transform: `translate3d(${(1 - p) * 320}px, ${(1 - p) * 90}px, 0) scale(${0.72 + 0.28 * p})`}}>
						<Notebook w={760} f={f} rx={-9} ry={ry}>
							<TelaEditor f={f} w={760 * 0.95} h={760 * 0.63 * 0.945} n0={marca('editor')} />
						</Notebook>
					</div>
				</div>
			</Camera>
		</div>
	);
};

// ============ C3: T8 anéis concêntricos com cartões orbitando, frase no centro ============
export const C3: React.FC<{f: number}> = ({f}) => {
	const {c0, dur} = janela('C3');
	const CARTOES_C3 = [
		{k: 0, x: 280, y: 520, w: 170, n: c0, blur: 2.5},
		{k: 1, x: 800, y: 470, w: 200, n: marca('cartao1'), blur: 0, destaque: true},
		{k: 2, x: 230, y: 1395, w: 170, n: marca('cartao2'), blur: 3},
		{k: 3, x: 850, y: 1380, w: 175, n: marca('cartao3'), blur: 0},
		{k: 4, x: 560, y: 1660, w: 150, n: marca('cartao4'), blur: 1.5},
	];
	const e = tw(f, c0, c0 + 11, 0, 1, E.out);
	const ev = CARTOES_C3.map((c) => c.n).concat([marca('melhorei')]);
	const pulso = ev.reduce((a, n) => a + (f >= n ? Math.exp(-(f - n) / 5) : 0), 0);
	const th = ((f - c0) * 0.05 * Math.PI) / 180;
	const melhorei = marca('melhorei');
	const fl = tw(f, melhorei, melhorei + 8, 0, 1, E.back);
	return (
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #1a0f04 0%, #070300 55%, #000 100%)'}}>
			<Camera s={(2.3 - 1.3 * e) * (1 + 0.06 * ((f - c0) / dur))} blur={(1 - e) * 16} r={(f - c0) * 0.03}>
				<Poeira f={f} seed="c3" n={110} estrelas={20} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 957, height: 6, background: 'linear-gradient(90deg, rgba(0,0,0,0), rgba(242,190,58,0.5) 30%, rgba(255,254,221,0.7) 50%, rgba(242,190,58,0.5) 70%, rgba(0,0,0,0))', filter: 'blur(3px)', opacity: 0.5}} />
				<Svg>
					{[70, 200, 370, 600, 860].map((r, k) => (
						<AnelNeon key={r} cx={540} cy={960} r={r} arcos={[0, 3, 4, 2, 5][k]} abertura={[0, 0.3, 0.22, 0.35, 0.25][k]} rot={(k % 2 ? 1 : -1) * (f - c0) * (0.5 + k * 0.15) + k * 40} larg={2.2 + 0.4 * clamp(pulso)} o={0.6 + 0.35 * clamp(pulso)} />
					))}
				</Svg>
				{CARTOES_C3.map((c) => {
					if (f < c.n) return null;
					const pp = tw(f, c.n, c.n + 8, 0, 1, E.back);
					const dx = c.x - 540, dy = c.y - 960;
					const x = 540 + dx * Math.cos(th) - dy * Math.sin(th);
					const y = 960 + dx * Math.sin(th) + dy * Math.cos(th) + Math.sin(f * 0.07 + c.k) * 7;
					const h = c.w * (16 / 9);
					const esc = (0.55 + 0.45 * pp) * (c.destaque ? 1 + 0.12 * fl : 1);
					return (
						<Cartao
							key={c.k}
							k={c.k}
							f={f}
							w={c.w}
							destaque={c.destaque ? (f >= melhorei ? 2 : 1) : 0}
							cor={COR.fogoNevoa}
							blur={c.blur + (1 - clamp(pp)) * 10}
							style={{left: x - c.w / 2, top: y - h / 2, transform: `scale(${esc})`, opacity: clamp(pp * 1.5)}}
						/>
					);
				})}
			</Camera>
		</div>
	);
};

// ============ C4: T6 roleta que gira um gomo por palavra + fileira de cartões rolando ============
export const C4: React.FC<{f: number}> = ({f}) => {
	const {c0, c1, dur} = janela('C4');
	const ticks = ['roleta1', 'roleta2', 'roleta3', 'roleta4'].map(marca);
	const ang = tw(f, c0, c0 + 10, -160, 0, E.out) - ticks.reduce((a, n) => a + 60 * tw(f, n, n + 6, 0, 1, E.back), 0) - (f - c0) * 0.06;
	const ativo = (((Math.round(-ang / 60) % 6) + 6) % 6);
	const preto = tw(f, c1 - 5, c1, 1, 0, E.in);
	const rol = (f - c0) * 7.5;
	const passo = 356 + 26;
	return (
		<div style={{position: 'absolute', inset: 0, background: COR.fundo, opacity: preto}}>
			<Camera s={1.02 + 0.03 * ((f - c0) / dur)} r={-(f - c0) * 0.02}>
				<Nevoa x={0} y={33} r={75} cor="rgba(244,137,7,0.5)" />
				<Nevoa x={80} y={30} r={60} cor="rgba(176,100,25,0.25)" />
				<Poeira f={f} seed="c4" n={50} estrelas={10} />
				{/* fileira de cartões rolando para cima */}
				<div style={{position: 'absolute', left: 540, top: 90, width: 470, height: 1080, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 14%, #000 82%, transparent 100%)'}}>
					{[0, 1].map((col) =>
						[...Array(5)].map((_, j) => {
							const y = ((((j * passo - rol - col * 190) % (5 * passo)) + 5 * passo) % (5 * passo)) - passo * 0.6;
							const dest = (j + col) % 3 === 0;
							return <Cartao key={`${col}-${j}`} k={j + col * 2 + 1} f={f} w={200} destaque={dest ? 1 : 0} cor={COR.fogo} style={{left: 18 + col * 232, top: y}} />;
						}),
					)}
				</div>
				<Svg>
					<Roleta cx={-30} cy={640} ro={500} ri={190} ang={ang} ativo={ativo} />
					<g style={{filter: FILTRO_NEON(COR.ouro)}}>
						<path d="M 528 612 L 486 640 L 528 668 Z" fill={COR.nucleo} />
					</g>
				</Svg>
			</Camera>
		</div>
	);
};

// ============ C5: T2 celular entrando girando, este vídeo no Reels ============
export const C5: React.FC<{f: number}> = ({f}) => {
	const {c0, dur} = janela('C5');
	const p = tw(f, c0, c0 + 16, 0, 1, E.out);
	const ry = lerp(-172, 14, p) - Math.max(0, f - (c0 + 16)) * 0.2;
	const cor = marca('coracao');
	const pulso = f >= cor ? tw(f, cor, cor + 4, 0, 1, E.out) * Math.exp(-Math.max(0, f - cor - 4) / 6) : 0;
	return (
		<div style={{position: 'absolute', inset: 0, background: COR.fundo}}>
			<Camera s={1 + 0.04 * ((f - c0) / dur)}>
				<Nevoa x={8} y={85} r={70} cor="rgba(244,137,7,0.42)" />
				<Fachos f={f} lado="dir" o={0.9} />
				<Poeira f={f} seed="c5" n={40} estrelas={14} />
			</Camera>
			<div style={{position: 'absolute', inset: 0, perspective: 2000, perspectiveOrigin: '540px 650px'}}>
				<div style={{position: 'absolute', left: 340, top: 240, transformStyle: 'preserve-3d', transform: `translate3d(${(1 - p) * -340}px, ${(1 - p) * 60}px, 0) scale(${0.8 + 0.2 * p})`}}>
					<Celular w={400} f={f} rx={6} ry={ry}>
						<TelaReels f={f} w={400 - 28} h={820 - 28} pulsoCoracao={pulso} />
					</Celular>
				</div>
			</div>
		</div>
	);
};

// ============ C6: T4 pico vermelho, o mesmo celular de perto ============
export const C6: React.FC<{f: number}> = ({f}) => {
	const {c0, dur} = janela('C6');
	const l = f - c0;
	const ap = marca('apenas');
	const some = tw(f, ap, ap + 6, 0, 1, E.out);
	const foco = tw(f, c0, c0 + 7, 0, 1, E.out);
	return (
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, #BC051B 0%, #7a0612 28%, #3B0000 58%, #120000 100%)'}}>
			<Camera s={1 + 0.06 * (l / dur)}>
				<div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${50 + Math.sin(l * 0.05) * 8}% 30%, rgba(255,80,100,0.25), rgba(0,0,0,0) 45%)`}} />
				{[
					{x: 160, y: 300, k: 2},
					{x: 920, y: 280, k: 3},
					{x: 120, y: 900, k: 4},
					{x: 960, y: 880, k: 0},
				].map((c, j) => (
					<Cartao key={j} k={c.k} f={f} w={190} cor={COR.tensaoHalo} blur={7 + 7 * some} style={{left: c.x - 95, top: c.y - 169, opacity: 0.6 - 0.38 * some, transform: `rotate(${(j % 2 ? 1 : -1) * 8}deg)`}} />
				))}
				<Poeira f={f} seed="c6" n={30} estrelas={0} cor={COR.tensaoHalo} />
			</Camera>
			<div style={{position: 'absolute', inset: 0, perspective: 1800, perspectiveOrigin: '540px 620px', filter: foco < 1 ? `blur(${(1 - foco) * 10}px)` : undefined}}>
				<div style={{position: 'absolute', left: 340, top: 210, transformStyle: 'preserve-3d', transform: `scale(${1.12 + 0.07 * (l / dur)})`, transformOrigin: '200px 410px'}}>
					<Celular w={400} f={f} rx={4} ry={16 - l * 0.12} rz={-4} aro={COR.tensaoHalo}>
						<TelaReels f={f} w={372} h={792} tingir={0.28} />
					</Celular>
				</div>
			</div>
		</div>
	);
};

// ============ C7: T9 clarão + portas, túnel; prévias no alto; T10 setas; T3 selo 3x ============
const PREV = {w: 330, h: 587, x: [330, 750], y: 556};
export const C7: React.FC<{f: number; previas: boolean; nomes: [string, string]}> = ({f, previas, nomes}) => {
	const {c0} = janela('C7');
	const abre = tw(f, c0 + 6, c0 + 20, 0, 1, E.io);
	const sol = tw(f, c0, c0 + 6, 0.3, 1, E.out) * (1 - tw(f, c0 + 6, c0 + 25, 0, 0.85, E.out));
	const fase = (f - (c0 + 6)) * 0.014;
	const cx = 540, cy = 700;
	const grade = (
		<Svg>
			<g stroke={COR.fogo} strokeWidth={2} opacity={0.55} style={{filter: `drop-shadow(0 0 6px ${COR.fogo})`}}>
				{[...Array(14)].map((_, k) => {
					const y = 960 + 30 * Math.pow(1.38, k);
					const y2 = 960 - 30 * Math.pow(1.38, k);
					return (
						<g key={k}>
							<line x1={0} y1={y} x2={W} y2={y} />
							<line x1={0} y1={y2} x2={W} y2={y2} />
						</g>
					);
				})}
				{[...Array(17)].map((_, k) => {
					const x = -1600 + k * 200 + 540 - 1000 + 1000;
					return (
						<g key={k}>
							<line x1={540} y1={960} x2={x} y2={H + 200} />
							<line x1={540} y1={960} x2={x} y2={-200} />
						</g>
					);
				})}
			</g>
		</Svg>
	);
	const solDiv = <div style={{position: 'absolute', left: 540 - 700, top: 960 - 700, width: 1400, height: 1400, borderRadius: '50%', background: 'radial-gradient(circle, #FFFFFF 0%, #FFF0B8 10%, #F8D834 20%, #F48907 38%, rgba(244,137,7,0.25) 55%, rgba(0,0,0,0) 70%)', opacity: sol, transform: `scale(${0.6 + 0.5 * sol})`}} />;
	return (
		<div style={{position: 'absolute', inset: 0, background: COR.fundo}}>
			{/* túnel de retângulos dourados (atrás das portas); some embaixo para não cruzar o texto */}
			<div style={{position: 'absolute', inset: 0, WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 52%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0.12) 100%)'}}>
			<Camera s={1 + 0.02 * Math.sin(f * 0.03)}>
				<div style={{position: 'absolute', left: cx - 600, top: cy - 600, width: 1200, height: 1200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,137,7,0.35) 0%, rgba(176,100,25,0.12) 40%, rgba(0,0,0,0) 70%)'}} />
				<Svg>
					{[...Array(6)].map((_, k) => {
						const z = k + 1 - (fase % 1);
						const s = 1 / (0.45 + 0.42 * z);
						const w = 860 * s, h = 1180 * s;
						const o = clamp((2.25 - s) * 1.1) * clamp(s * 2.2 - 0.3);
						return (
							<g key={k} opacity={o}>
								<rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={46 * s} fill="none" stroke={COR.ouro} strokeWidth={14 * s} filter="url(#halo)" />
								<rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={46 * s} fill="none" stroke={COR.nucleo} strokeWidth={2 + 2.5 * s} />
							</g>
						);
					})}
					<g stroke={COR.fogoNevoa} strokeWidth={1.5} opacity={0.4}>
						{[...Array(9)].map((_, k) => (
							<line key={k} x1={cx} y1={cy} x2={-400 + k * 235} y2={H} />
						))}
					</g>
				</Svg>
			</Camera>
			</div>
			<Poeira f={f} seed="c7" n={50} estrelas={16} />
			{/* clarão de sol sobre a grade, que abre em duas portas */}
			{abre < 1 &&
				[0, 1].map((lado) => (
					<div key={lado} style={{position: 'absolute', inset: 0, clipPath: lado === 0 ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)', transform: `translateX(${(lado === 0 ? -1 : 1) * abre * 600}px)`, background: '#050200'}}>
						{grade}
						{solDiv}
						<div style={{position: 'absolute', top: 0, bottom: 0, left: lado === 0 ? 536 : 540, width: 4, background: COR.nucleo, boxShadow: `0 0 30px ${COR.ouroAlto}, 0 0 80px ${COR.fogo}`, opacity: abre > 0 ? 1 : 0}} />
					</div>
				))}
			{previas && <PreviasNoAlto f={f} nomes={nomes} />}
		</div>
	);
};

// prévias de outros modelos: dois cartões de vidro que voam dos lados e pousam no alto (prop previas)
export const PreviasNoAlto: React.FC<{f: number; nomes: [string, string]}> = ({f, nomes}) => {
	if (!T.previas) return null; // o plano sem "previas": fica só o túnel
	const de = T.previas.de_q;
	if (f < de) return null;
	const aqui = marca('setas');
	const tres = marca('tres');
	const sel = tw(f, tres, tres + 8, 0, 1, E.back);
	const contagem = f < tres + 3 ? '1x' : f < tres + 6 ? '2x' : '3x';
	return (
		<>
			<div style={{position: 'absolute', inset: 0, perspective: 1600, perspectiveOrigin: '540px 560px'}}>
				{[0, 1].map((i) => {
					const n = de + i * 3;
					const p = tw(f, n, n + 13, 0, 1, E.out);
					if (f < n) return null;
					const tx = PREV.x[i];
					const x = lerp(i === 0 ? -380 : W + 380, tx, p);
					const ry = lerp(i === 0 ? 75 : -75, i === 0 ? 10 : -10, p) + Math.sin(f * 0.035 + i) * 2.5;
					const y = PREV.y + Math.sin(f * 0.06 + i * 1.7) * 6;
					const brilho = ((f * 9 + i * 200) % 900) / 900;
					return (
						<div key={i} style={{position: 'absolute', left: x - PREV.w / 2, top: y - PREV.h / 2, width: PREV.w, height: PREV.h, transform: `rotateY(${ry}deg) scale(${0.82 + 0.18 * p})`, transformStyle: 'preserve-3d'}}>
							<div style={{position: 'absolute', inset: 0, borderRadius: 26, overflow: 'hidden', border: `3px solid ${COR.nucleo}`, boxShadow: `0 0 18px ${COR.ouro}, 0 0 50px rgba(244,137,7,0.6), 0 30px 60px rgba(0,0,0,0.6)`, background: '#000'}}>
								<Sequence from={n} layout="none">
									<OffthreadVideo muted src={staticFile(`previa${i + 1}.mp4`)} style={{width: PREV.w, height: PREV.h, objectFit: 'cover'}} />
								</Sequence>
								<div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${brilho * 160 - 40}%, rgba(255,255,255,0.22) ${brilho * 160 - 25}%, rgba(255,255,255,0) ${brilho * 160 - 10}%)`}} />
								<div style={{position: 'absolute', inset: 0, borderRadius: 24, boxShadow: 'inset 0 0 0 2px rgba(255,236,170,0.35), inset 0 0 40px rgba(244,137,7,0.25)'}} />
							</div>
						</div>
					);
				})}
			</div>
			{[0, 1].map((i) => (
				<div key={i} style={{position: 'absolute', left: PREV.x[i] - 200, width: 400, top: 880 - 19, height: 38, textAlign: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 34, letterSpacing: '-0.01em', color: COR.texto, lineHeight: 1, textShadow: HALO_TEXTO, ...surge(f, de + 14 + i * 3)}}>
					{nomes[i]}
				</div>
			))}
			<Svg>
				<Seta d="M 150 1160 C 70 1080, 120 990, 196 930" ponta={[196, 930, -38]} f={f} n={aqui} />
				<Seta d="M 930 1160 C 1010 1080, 960 990, 884 930" ponta={[884, 930, -142]} f={f} n={aqui + 1} />
				<Estrela x={92} y={985} r={26} f={f} n={aqui + 4} />
				<Estrela x={990} y={1000} r={20} f={f} n={aqui + 6} />
				{f >= tres && (
					<g transform={`translate(540 792) scale(${sel})`} opacity={clamp(sel)}>
						<circle r={80} fill="rgba(14,8,3,0.88)" />
						<AnelNeon cx={0} cy={0} r={80} larg={3} />
						<g transform="rotate(-90)">
							<circle r={66} fill="none" stroke={COR.fogo} strokeWidth={8} strokeDasharray={`${(2 * Math.PI * 66 * (contagem === '1x' ? 1 : contagem === '2x' ? 2 : 3)) / 3} 999`} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${COR.fogo})`}} />
						</g>
						<text x={0} y={24} textAnchor="middle" fontFamily={INTER} fontWeight={700} fontSize={68} fill={COR.texto} style={{filter: `drop-shadow(0 0 10px ${COR.ouroAlto})`}}>
							{contagem}
						</text>
					</g>
				)}
			</Svg>
		</>
	);
};

// ============ C8: T7 palavra que nasce do desfoque + horizonte de planeta subindo ============
export const C8: React.FC<{f: number}> = ({f}) => {
	const {c0, dur} = janela('C8');
	const l = f - c0;
	const enc = c0 + 50;
	const topo = tw(f, c0 + 48, c0 + 90, 2080, 1268, E.out) - Math.max(0, f - (c0 + 90)) * 0.5;
	const R = 1150;
	const lin = tw(f, enc + 7, enc + 19, 0, 1, E.out);
	return (
		<div style={{position: 'absolute', inset: 0, background: COR.fundo}}>
			<Camera s={1.0 + 0.05 * (l / dur)}>
				<div style={{position: 'absolute', left: 540 - 260, top: -300, width: 520, height: 1300, background: 'radial-gradient(ellipse at 50% 0%, rgba(244,137,7,0.75) 0%, rgba(176,100,25,0.35) 35%, rgba(0,0,0,0) 70%)', filter: 'blur(30px)', opacity: 0.55 + 0.25 * tw(f, c0, c0 + 60, 0, 1)}} />
				<Poeira f={f} seed="c8" n={45} estrelas={18} sobe={0.4} />
				<Svg>
					<defs>
						<radialGradient id="planeta" cx={540} cy={topo + R} r={R} gradientUnits="userSpaceOnUse">
							<stop offset={0.86} stopColor="#000" stopOpacity={0} />
							<stop offset={0.97} stopColor={COR.fogo} stopOpacity={0.45} />
							<stop offset={1} stopColor={COR.ouroAlto} stopOpacity={0.9} />
						</radialGradient>
					</defs>
					<circle cx={540} cy={topo + R} r={R + 60} fill="none" stroke={COR.fogo} strokeWidth={140} filter="url(#haloLargo)" opacity={0.55} />
					<circle cx={540} cy={topo + R} r={R} fill="url(#planeta)" />
					<circle cx={540} cy={topo + R} r={R} fill="none" stroke={COR.fogo} strokeWidth={26} filter="url(#halo)" />
					<circle cx={540} cy={topo + R} r={R} fill="none" stroke={COR.nucleo} strokeWidth={5} />
					{/* linha de luz sob o termo protagonista (ref1 6,9 s) */}
					{lin > 0 && (
						<g>
							<line x1={540 - 360 * lin} y1={1000} x2={540 + 360 * lin} y2={1000} stroke={COR.fogo} strokeWidth={10} filter="url(#halo)" />
							<line x1={540 - 360 * lin} y1={1000} x2={540 + 360 * lin} y2={1000} stroke={COR.nucleo} strokeWidth={2} />
							<Estrela x={540 + 360 * lin * Math.cos(l * 0.05)} y={1000} r={22} f={f} n={enc + 4} />
						</g>
					)}
				</Svg>
			</Camera>
		</div>
	);
};

// ============ C9: T5 cursor clica, a pasta de vidro dourado abre e os ícones saltam ============
const ICONES_C9 = [
	{nome: 'play', x: 320, y: 470, marca: 'icone1'},
	{nome: 'chapeu', x: 460, y: 385, marca: 'icone2'},
	{nome: 'filme', x: 620, y: 385, marca: 'icone3'},
	{nome: 'doc', x: 760, y: 470, marca: 'icone4'},
];
export const C9: React.FC<{f: number}> = ({f}) => {
	const {c0, dur} = janela('C9');
	const l = f - c0;
	const clique = marca('clique');
	const abre = tw(f, clique + 1, clique + 10, 0, 1, E.back);
	const ida = tw(f, c0, clique, 0, 1, E.out);
	const cx = lerp(980, 610, ida) + tw(f, clique + 4, clique + 40, 0, 120, E.io);
	const cy = lerp(1180, 850, ida) + tw(f, clique + 4, clique + 40, 0, 110, E.io);
	const aperta = f >= clique ? tw(f, clique, clique + 2, 0, 1, E.out) * tw(f, clique + 3, clique + 6, 1, 0, E.out) : 0;
	const onda = tw(f, clique, clique + 12, 0, 1, E.out);
	const brilho = f >= clique ? Math.exp(-(f - clique) / 8) : 0;
	return (
		<div style={{position: 'absolute', inset: 0, background: COR.fundo}}>
			<Camera s={1.03 + 0.03 * (l / dur)} r={l * 0.03} oy={720}>
				<div style={{position: 'absolute', inset: -200, background: 'repeating-linear-gradient(45deg, rgba(244,137,7,0.10) 0px, rgba(244,137,7,0.10) 46px, rgba(0,0,0,0) 46px, rgba(0,0,0,0) 92px)', WebkitMaskImage: 'radial-gradient(circle at 50% 40%, #000 0%, transparent 65%)'}} />
				<Nevoa x={50} y={38} r={55} cor="rgba(244,137,7,0.4)" />
				<Svg>
					<g opacity={0.4} transform={`rotate(${l * 0.15} 540 720)`}>
						{[...Array(40)].map((_, k) => {
							const a = (k / 40) * Math.PI * 2;
							return <line key={k} x1={540 + 470 * Math.cos(a)} y1={720 + 470 * Math.sin(a)} x2={540 + 1400 * Math.cos(a)} y2={720 + 1400 * Math.sin(a)} stroke={COR.ouro} strokeWidth={k % 3 === 0 ? 2.5 : 1.2} />;
						})}
					</g>
					<circle cx={540} cy={720} r={440} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.45} />
				</Svg>
				<Poeira f={f} seed="c9" n={50} estrelas={10} />
			</Camera>
			<div style={{position: 'absolute', left: 540 - 260, top: 760 - 187, transform: `scale(${1 + 0.04 * brilho})`}}>
				<Pasta w={520} abre={abre} brilho={brilho} />
			</div>
			{ICONES_C9.map((ic, k) => {
				const n = marca(ic.marca);
				if (f < n) return null;
				const p = tw(f, n, n + 10, 0, 1, E.out);
				const x = lerp(540, ic.x, p);
				const y = lerp(720, ic.y, p) - Math.sin(p * Math.PI) * 90 + Math.sin(f * 0.08 + k) * 6;
				return (
					<div key={k} style={{position: 'absolute', left: x - 60, top: y - 60, transform: `scale(${0.3 + 0.7 * p}) rotate(${(1 - p) * -30}deg)`, opacity: clamp(p * 2)}}>
						<Ladrilho nome={ic.nome} s={120} />
					</div>
				);
			})}
			<Svg>
				{onda > 0 && onda < 1 && <circle cx={610} cy={850} r={20 + 130 * onda} fill="none" stroke={COR.ouroAlto} strokeWidth={6 * (1 - onda)} opacity={1 - onda} style={{filter: `drop-shadow(0 0 10px ${COR.fogo})`}} />}
				<Estrela x={250} y={390} r={24} f={f} n={marca('icone3')} />
				<Estrela x={840} y={360} r={18} f={f} n={marca('icone4')} />
			</Svg>
			<div style={{position: 'absolute', left: cx, top: cy}}>
				<Cursor s={70} aperta={aperta} />
			</div>
		</div>
	);
};

// ============ C10: T20 assinatura "EDIÇÃO" em ouro com volume e luz passando, seta para baixo ============
export const C10: React.FC<{f: number}> = ({f}) => {
	const {c0, dur} = janela('C10');
	const l = f - c0;
	const fim = T.escurece_q ? tw(f, T.escurece_q[0], T.escurece_q[1], 1, 0, E.io) : 1;
	const seta = marca('seta_baixo');
	return (
		<div style={{position: 'absolute', inset: 0, background: COR.fundo, opacity: fim}}>
			<Camera s={1 + 0.04 * (l / dur)}>
				<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 40% at 50% 46%, rgba(92,60,24,0.95) 0%, rgba(49,38,22,0.8) 35%, rgba(27,14,4,0.5) 65%, rgba(0,0,0,0) 100%)'}} />
				<Poeira f={f} seed="c10" n={60} estrelas={18} sobe={0.3} />
				<Svg>
					<AnelNeon cx={540} cy={890} r={520} arcos={6} abertura={0.6} rot={l * 0.25} larg={1.4} o={0.35} />
				</Svg>
			</Camera>
			<Svg style={{transform: `translateY(${f > seta + 12 ? Math.sin((f - seta) * 0.16) * 10 : 0}px)`}}>
				<Seta d="M 540 1218 C 516 1290, 566 1350, 540 1430" ponta={[540, 1430, 92]} f={f} n={seta} />
			</Svg>
		</div>
	);
};

// linha da assinatura do B12: “EDIÇÃO” em ouro metálico com volume, luz passando, assenta em branco com bisel
export const LinhaAssinatura: React.FC<{f: number; y: number; fs: number; texto: string; n: number}> = ({f, y, fs, texto, n}) => {
	if (f < n) return null;
	const e = tw(f, n, n + 9, 0, 1, E.out);
	const luz = tw(f, n + 3, n + 28, -30, 130, E.io);
	const luz2 = f > n + 60 ? (((f - n - 60) * 3.2) % 260) - 60 : -100;
	const assenta = tw(f, n + 30, n + 48, 0, 1, E.io);
	const base: React.CSSProperties = {position: 'absolute', left: 0, width: W, top: 0, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: INTER, fontWeight: 700, fontSize: fs, letterSpacing: '-0.02em', lineHeight: 1};
	const volume = [1, 2, 3, 4, 5, 6, 7, 8].map((d) => `0 ${d * 1.4}px 0 ${['#d79a24', '#c4861a', '#ad7314', '#94600f', '#7b4e0b', '#633e08', '#4c2f05', '#382203'][d - 1]}`).join(', ');
	const faixa = (pos: number, o: number) => ({
		...base,
		color: 'transparent',
		backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${pos - 14}%, rgba(255,255,255,${o}) ${pos}%, rgba(255,255,255,0) ${pos + 14}%)`,
		WebkitBackgroundClip: 'text' as const,
		backgroundClip: 'text' as const,
	});
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: y - fs * 0.5, height: fs, opacity: clamp(e * 1.6), filter: e < 1 ? `blur(${(1 - e) * 14}px)` : undefined, transform: `scale(${1 + 0.25 * (1 - e)})`, transformOrigin: `540px ${fs * 0.5}px`}}>
			<div style={{position: 'absolute', left: 540 - 520, width: 1040, top: -fs * 0.6, height: fs * 2.2, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(242,190,58,0.28) 0%, rgba(176,100,25,0.12) 45%, rgba(0,0,0,0) 72%)'}} />
			<div style={{...base, color: '#5a3806', textShadow: `${volume}, 0 16px 30px rgba(0,0,0,0.7), 0 0 60px rgba(244,137,7,${0.55 - 0.25 * assenta})`}}>{texto}</div>
			<div
				style={{
					...base,
					color: 'transparent',
					backgroundImage: 'linear-gradient(180deg, #FFF6C8 0%, #F8D834 28%, #D9961C 52%, #9a5f0e 62%, #F2BE3A 82%, #FFF3B0 100%)',
					WebkitBackgroundClip: 'text',
					backgroundClip: 'text',
					opacity: 1 - assenta,
				}}
			>
				{texto}
			</div>
			<div style={{...base, color: '#FFF7F3', opacity: assenta, textShadow: `0 -1px 0 rgba(255,255,255,0.9), 0 0 18px rgba(248,216,52,0.45), 0 0 46px rgba(244,137,7,0.35)`}}>{texto}</div>
			<div style={faixa(luz, 0.95)}>{texto}</div>
			{luz2 > -60 && <div style={faixa(luz2, 0.55)}>{texto}</div>}
		</div>
	);
};
