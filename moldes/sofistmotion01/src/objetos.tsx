// Objetos desenhados em código (nada de terceiros): anel neon, cartões de tela vertical, notebook e celular em CSS 3D,
// roleta, pasta de vidro dourado, ícones de linha, cursor.
import React from 'react';
import {COR, E, INTER, tw, clamp} from './base';

// ---------- traço neon: halo largo colorido + núcleo quase branco ----------
export const AnelNeon: React.FC<{cx: number; cy: number; r: number; cor?: string; larg?: number; arcos?: number; abertura?: number; rot?: number; o?: number}> = ({
	cx,
	cy,
	r,
	cor = COR.ouro,
	larg = 3,
	arcos = 0,
	abertura = 0.25,
	rot = 0,
	o = 1,
}) => {
	const C = 2 * Math.PI * r;
	const dash = arcos > 0 ? `${(C / arcos) * (1 - abertura)} ${(C / arcos) * abertura}` : undefined;
	return (
		<g transform={`rotate(${rot} ${cx} ${cy})`} opacity={o}>
			<circle cx={cx} cy={cy} r={r} fill="none" stroke={cor} strokeWidth={larg * 6} strokeDasharray={dash} filter="url(#halo)" opacity={0.8} />
			<circle cx={cx} cy={cy} r={r} fill="none" stroke={cor} strokeWidth={larg * 2} strokeDasharray={dash} opacity={0.9} />
			<circle cx={cx} cy={cy} r={r} fill="none" stroke={COR.nucleo} strokeWidth={larg} strokeDasharray={dash} />
		</g>
	);
};

// ---------- conteúdo genérico de uma tela vertical (cada "modelo" de edição é um desenho abstrato diferente) ----------
export const TelaModelo: React.FC<{k: number; f: number; w: number; h: number}> = ({k, f, w, h}) => {
	const v = k % 6;
	const pul = 0.5 + 0.5 * Math.sin(f * 0.12 + k);
	const barra = (x: number, y: number, bw: number, bh: number, c: string, o = 1) => (
		<div style={{position: 'absolute', left: x * w, top: y * h, width: bw * w, height: bh * h, background: c, borderRadius: bh * h * 0.5, opacity: o}} />
	);
	if (v === 0)
		return (
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#1a1006,#050302)'}}>
				<div style={{position: 'absolute', left: '30%', top: '18%', width: '40%', height: '30%', borderRadius: '50%', background: 'radial-gradient(circle,#6b4a2a,#2a1a0c)'}} />
				{barra(0.14, 0.6, 0.72, 0.075, '#FFFFF7')}
				{barra(0.24, 0.7, 0.52 * (0.6 + 0.4 * pul), 0.05, COR.ouroAlto)}
			</div>
		);
	if (v === 1)
		return (
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#F48907 0%,#7a2f05 45%,#120702 100%)'}}>
				<div style={{position: 'absolute', left: '22%', top: '12%', width: '56%', height: '32%', borderRadius: '50%', border: '3px solid #FFFEDD', opacity: 0.8}} />
				{barra(0.1, 0.62, 0.8, 0.06, '#FFFFF7')}
				{barra(0.1, 0.71, 0.5, 0.06, '#FFFFF7', 0.6)}
			</div>
		);
	if (v === 2)
		return (
			<div style={{position: 'absolute', inset: 0, background: '#0b0806'}}>
				<div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '48%', background: 'linear-gradient(135deg,#3a2510,#140c05)'}} />
				<div style={{position: 'absolute', left: 0, top: '52%', width: '100%', height: '48%', background: 'linear-gradient(135deg,#2a1a0a,#0d0804)'}} />
				{barra(0.18, 0.45, 0.64, 0.1, COR.fogo)}
			</div>
		);
	if (v === 3)
		return (
			<div style={{position: 'absolute', inset: 0, background: '#F3E3C3'}}>
				<div style={{position: 'absolute', left: '18%', top: '16%', width: '64%', height: '36%', borderRadius: 14, background: '#1b120a'}} />
				<div style={{position: 'absolute', left: '40%', top: '27%', width: '20%', height: '14%', borderRadius: '50%', background: COR.fogo, opacity: 0.6 + 0.4 * pul}} />
				{barra(0.14, 0.62, 0.72, 0.06, '#1b120a')}
				{barra(0.14, 0.71, 0.46, 0.06, '#1b120a', 0.55)}
			</div>
		);
	if (v === 4)
		return (
			<div style={{position: 'absolute', inset: 0, background: '#070504', padding: '10%', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6%'}}>
				{[0, 1, 2, 3, 4, 5].map((j) => (
					<div key={j} style={{borderRadius: 8, background: j % 3 === 0 ? '#5a3a16' : j % 3 === 1 ? '#2a1c0c' : '#8a5a1c', opacity: 0.6 + 0.4 * Math.abs(Math.sin(f * 0.08 + j))}} />
				))}
			</div>
		);
	return (
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 35%,#3d2a14,#060403 70%)'}}>
			<div style={{position: 'absolute', left: '12%', right: '12%', top: '64%', display: 'flex', alignItems: 'flex-end', gap: '4%', height: '14%'}}>
				{[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
					<div key={j} style={{flex: 1, height: `${30 + 70 * Math.abs(Math.sin(f * 0.2 + j * 1.3))}%`, background: COR.ouro, borderRadius: 4}} />
				))}
			</div>
		</div>
	);
};

export const Cartao: React.FC<{k: number; f: number; w: number; destaque?: number; cor?: string; blur?: number; style?: React.CSSProperties}> = ({k, f, w, destaque = 0, cor = COR.fogo, blur = 0, style}) => {
	const h = w * (16 / 9);
	const bw = destaque > 0 ? w * 0.065 : w * 0.018;
	const bc = destaque > 0 ? (destaque > 1 ? COR.ouroAlto : COR.borda) : cor;
	return (
		<div
			style={{
				position: 'absolute',
				width: w,
				height: h,
				borderRadius: w * 0.09,
				border: `${bw}px solid ${bc}`,
				boxShadow: `0 0 ${destaque > 1 ? 50 : 22}px ${bc}, 0 0 ${destaque > 1 ? 110 : 50}px ${bc}88, inset 0 0 18px rgba(0,0,0,0.6)`,
				overflow: 'hidden',
				background: '#000',
				filter: blur > 0 ? `blur(${blur}px)` : undefined,
				...style,
			}}
		>
			<TelaModelo k={k} f={f} w={w} h={h} />
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 35%)'}} />
		</div>
	);
};

// ---------- ícones de linha brancos ----------
export const Icone: React.FC<{nome: string; s: number; cor?: string; larg?: number}> = ({nome, s, cor = '#FFFFF7', larg = 2.4}) => {
	const p = {fill: 'none', stroke: cor, strokeWidth: larg, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" style={{overflow: 'visible'}}>
			{nome === 'mic' && (
				<g {...p}>
					<rect x={9} y={3} width={6} height={11} rx={3} />
					<path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
				</g>
			)}
			{nome === 'camera' && (
				<g {...p}>
					<rect x={2.5} y={6.5} width={13} height={11} rx={2} />
					<path d="M15.5 10.5l6-3.5v10l-6-3.5" />
				</g>
			)}
			{nome === 'play' && (
				<g {...p}>
					<circle cx={12} cy={12} r={9.5} />
					<path d="M10 8.5v7l6-3.5z" />
				</g>
			)}
			{nome === 'celular' && (
				<g {...p}>
					<rect x={6.5} y={2.5} width={11} height={19} rx={2.5} />
					<path d="M10.5 18.5h3" />
				</g>
			)}
			{nome === 'claquete' && (
				<g {...p}>
					<rect x={3} y={9} width={18} height={12} rx={1.5} />
					<path d="M3 9l2-5 16 0-2 5M8 4l-2 5M13 4l-2 5M18 4l-2 5" />
				</g>
			)}
			{nome === 'onda' && (
				<g {...p}>
					<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10M21 12h0" />
				</g>
			)}
			{nome === 'coracao' && <path {...p} d="M12 20s-7-4.4-9.2-8.6C1.2 8.2 3.2 4.5 6.7 4.5c2 0 3.3 1.1 5.3 3.2 2-2.1 3.3-3.2 5.3-3.2 3.5 0 5.5 3.7 3.9 6.9C19 15.6 12 20 12 20z" />}
			{nome === 'balao' && <path {...p} d="M4 5h16v11H9l-5 4z" />}
			{nome === 'aviao' && <path {...p} d="M21 3L3 10.5l7 2.5 2.5 7zM10 13l11-10" />}
			{nome === 'chapeu' && (
				<g {...p}>
					<path d="M2 9l10-5 10 5-10 5z" />
					<path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" />
				</g>
			)}
			{nome === 'filme' && (
				<g {...p}>
					<rect x={3} y={4} width={18} height={16} rx={2} />
					<path d="M7 4v16M17 4v16M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" />
				</g>
			)}
			{nome === 'doc' && (
				<g {...p}>
					<path d="M6 2.5h8l4 4v15H6z" />
					<path d="M14 2.5v4h4M9 11h6M9 14.5h6M9 18h4" />
				</g>
			)}
		</svg>
	);
};

// ---------- mini "Reels": este próprio vídeo (o anel 100%) com os botões desenhados ----------
export const TelaReels: React.FC<{f: number; w: number; h: number; pulsoCoracao?: number; tingir?: number}> = ({f, w, h, pulsoCoracao = 0, tingir = 0}) => {
	const r = w * 0.3;
	const C = 2 * Math.PI * r;
	return (
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, #2a1606 0%, #050200 70%)', overflow: 'hidden'}}>
			<svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
				<circle cx={w / 2} cy={h * 0.42} r={r} fill="none" stroke={COR.ouro} strokeWidth={10} filter="url(#halo)" opacity={0.8} />
				<circle cx={w / 2} cy={h * 0.42} r={r} fill="none" stroke={COR.nucleo} strokeWidth={2.5} strokeDasharray={`${C} 0`} />
			</svg>
			<div style={{position: 'absolute', left: 0, width: w, top: h * 0.42 - w * 0.1, textAlign: 'center', fontFamily: INTER, fontWeight: 700, fontSize: w * 0.2, color: COR.texto, lineHeight: 1, textShadow: `0 0 12px ${COR.fogo}`}}>
				100<span style={{color: 'transparent', WebkitTextStroke: `1.5px ${COR.nucleo}`, filter: `drop-shadow(0 0 6px ${COR.fogo})`}}>%</span>
			</div>
			{/* botões à direita */}
			<div style={{position: 'absolute', right: w * 0.05, top: h * 0.5, display: 'flex', flexDirection: 'column', gap: h * 0.035, alignItems: 'center'}}>
				<div style={{transform: `scale(${1 + 0.35 * pulsoCoracao})`, filter: pulsoCoracao > 0 ? `drop-shadow(0 0 ${10 * pulsoCoracao}px ${COR.fogo})` : undefined}}>
					<Icone nome="coracao" s={w * 0.11} cor={pulsoCoracao > 0.05 ? COR.ouroAlto : '#FFFFF7'} />
				</div>
				<Icone nome="balao" s={w * 0.1} />
				<Icone nome="aviao" s={w * 0.1} />
			</div>
			{/* legenda e perfil em barras abstratas */}
			<div style={{position: 'absolute', left: w * 0.06, top: h * 0.8, width: w * 0.1, height: w * 0.1, borderRadius: '50%', background: COR.fogoNevoa}} />
			<div style={{position: 'absolute', left: w * 0.2, top: h * 0.81, width: w * 0.36, height: h * 0.014, borderRadius: 6, background: '#FFFFF7', opacity: 0.85}} />
			<div style={{position: 'absolute', left: w * 0.06, top: h * 0.86, width: w * 0.64, height: h * 0.012, borderRadius: 6, background: '#FFFFF7', opacity: 0.45}} />
			<div style={{position: 'absolute', left: 0, bottom: 0, height: h * 0.006, width: w * (0.2 + ((f % 120) / 120) * 0.6), background: COR.ouroAlto, boxShadow: `0 0 8px ${COR.fogo}`}} />
			{tingir > 0 && <div style={{position: 'absolute', inset: 0, background: '#E0030A', mixBlendMode: 'multiply', opacity: tingir}} />}
		</div>
	);
};

// ---------- celular em CSS 3D (frente com tela, costas de titânio escuro, sem marca) ----------
export const Celular: React.FC<{w: number; f: number; rx: number; ry: number; rz?: number; children: React.ReactNode; aro?: string}> = ({w, f, rx, ry, rz = 0, children, aro = COR.ouro}) => {
	const h = w * 2.05;
	const raio = w * 0.15;
	return (
		<div style={{position: 'relative', width: w, height: h, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`}}>
			{/* espessura: camadas empilhadas */}
			{[...Array(8)].map((_, k) => (
				<div key={k} style={{position: 'absolute', inset: 0, borderRadius: raio, background: k === 0 || k === 7 ? '#3a342c' : '#1d1915', transform: `translateZ(${-k * 2.2}px)`, border: `1px solid ${aro}55`}} />
			))}
			<div style={{position: 'absolute', inset: 0, borderRadius: raio, background: '#0a0908', backfaceVisibility: 'hidden', boxShadow: `0 0 0 3px #2b2620, 0 0 0 5px ${aro}66, 0 0 40px ${aro}55`}}>
				<div style={{position: 'absolute', inset: w * 0.035, borderRadius: raio * 0.8, overflow: 'hidden'}}>{children}</div>
				<div style={{position: 'absolute', left: '50%', top: w * 0.07, width: w * 0.28, height: w * 0.075, marginLeft: -w * 0.14, borderRadius: w, background: '#000'}} />
				<div style={{position: 'absolute', inset: 0, borderRadius: raio, background: `linear-gradient(${115 + Math.sin(f * 0.04) * 10}deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.06) 100%)`}} />
			</div>
			<div style={{position: 'absolute', inset: 0, borderRadius: raio, transform: `rotateY(180deg) translateZ(${8 * 2.2}px)`, backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#4a4339,#211d18 60%,#3a332a)', boxShadow: `0 0 0 3px #2b2620, 0 0 30px ${aro}44`}}>
				<div style={{position: 'absolute', left: w * 0.08, top: w * 0.08, width: w * 0.38, height: w * 0.38, borderRadius: w * 0.09, background: '#15120f', border: '2px solid #4d463c'}}>
					{[0, 1, 2].map((j) => (
						<div key={j} style={{position: 'absolute', width: w * 0.12, height: w * 0.12, borderRadius: '50%', background: 'radial-gradient(circle,#2c3540,#050505)', border: '2px solid #5a5247', left: j === 2 ? w * 0.22 : w * 0.04, top: j === 1 ? w * 0.22 : w * 0.04}} />
					))}
				</div>
			</div>
		</div>
	);
};

// ---------- notebook em CSS 3D (tampa com a tela, base com teclado), sem marca ----------
export const Notebook: React.FC<{w: number; f: number; rx: number; ry: number; children: React.ReactNode}> = ({w, f, rx, ry, children}) => {
	const h = w * 0.63;
	return (
		<div style={{position: 'relative', width: w, height: h, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg)`}}>
			{/* tampa */}
			<div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transformOrigin: '50% 100%', transform: 'rotateX(-4deg)'}}>
				<div style={{position: 'absolute', inset: 0, borderRadius: w * 0.025, background: '#090807', border: '2px solid #4a4339', backfaceVisibility: 'hidden', boxShadow: `0 0 50px rgba(244,137,7,0.35)`}}>
					<div style={{position: 'absolute', left: w * 0.025, right: w * 0.025, top: w * 0.025, bottom: w * 0.03, overflow: 'hidden', borderRadius: 6}}>{children}</div>
					<div style={{position: 'absolute', inset: 0, borderRadius: w * 0.025, background: `linear-gradient(${120 + Math.sin(f * 0.05) * 8}deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 32%)`}} />
				</div>
				<div style={{position: 'absolute', inset: 0, borderRadius: w * 0.025, transform: 'rotateY(180deg) translateZ(1px)', backfaceVisibility: 'hidden', background: 'linear-gradient(140deg,#d9d4cc 0%,#9c968c 45%,#c9c3b9 70%,#77716a 100%)'}} />
			</div>
			{/* base deitada */}
			<div
				style={{
					position: 'absolute',
					left: -w * 0.03,
					top: h,
					width: w * 1.06,
					height: w * 0.66,
					transformOrigin: '50% 0',
					transform: 'rotateX(86deg)',
					borderRadius: `${w * 0.02}px ${w * 0.02}px ${w * 0.04}px ${w * 0.04}px`,
					background: 'linear-gradient(180deg,#bdb7ae,#8d877e)',
					border: '2px solid #5d574f',
				}}
			>
				<div style={{position: 'absolute', left: '6%', right: '6%', top: '7%', height: '52%', display: 'grid', gridTemplateColumns: 'repeat(14,1fr)', gap: 4}}>
					{[...Array(70)].map((_, k) => (
						<div key={k} style={{background: '#1b1916', borderRadius: 3}} />
					))}
				</div>
				<div style={{position: 'absolute', left: '33%', right: '33%', top: '64%', bottom: '8%', borderRadius: 8, background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.25)'}} />
			</div>
		</div>
	);
};

// tela do notebook: uma linha do tempo de edição em que os clipes vão caindo (genérica, desenhada)
export const TelaEditor: React.FC<{f: number; w: number; h: number; n0: number}> = ({f, w, h, n0}) => {
	const trilhas = [
		{y: 0.62, cor: COR.fogo, clipes: [[0.02, 0.2], [0.24, 0.18], [0.45, 0.24], [0.72, 0.22]]},
		{y: 0.71, cor: COR.ouro, clipes: [[0.06, 0.14], [0.3, 0.2], [0.55, 0.12], [0.7, 0.26]]},
		{y: 0.8, cor: COR.creme, clipes: [[0.0, 0.32], [0.36, 0.28], [0.68, 0.3]]},
	];
	let k = 0;
	const cab = clamp((f - n0) / 40);
	return (
		<div style={{position: 'absolute', inset: 0, background: '#0d0a07', fontFamily: INTER}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h * 0.06, background: '#16110c', display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 10}}>
				{['#e0503a', '#e8b23a', '#5fbf5a'].map((c) => (
					<div key={c} style={{width: h * 0.022, height: h * 0.022, borderRadius: '50%', background: c, opacity: 0.8}} />
				))}
			</div>
			{/* prévia vertical */}
			<div style={{position: 'absolute', left: w * 0.38, top: h * 0.09, width: h * 0.26, height: h * 0.46, borderRadius: 6, overflow: 'hidden', border: `1px solid ${COR.fogoNevoa}`}}>
				<TelaReels f={f} w={h * 0.26} h={h * 0.46} />
			</div>
			{[0.09, 0.17, 0.25, 0.33].map((y, j) => (
				<div key={j} style={{position: 'absolute', left: w * 0.03, top: h * y, width: w * 0.22, height: h * 0.05, borderRadius: 4, background: '#1e1710'}} />
			))}
			{[0.09, 0.15, 0.21, 0.27, 0.33, 0.39].map((y, j) => (
				<div key={j} style={{position: 'absolute', right: w * 0.03, top: h * y, width: w * (0.14 + (j % 3) * 0.04), height: h * 0.025, borderRadius: 4, background: '#2a2016'}} />
			))}
			<div style={{position: 'absolute', left: 0, right: 0, top: h * 0.58, bottom: 0, background: '#090705', borderTop: '1px solid #2a2016'}} />
			{trilhas.map((tr, j) =>
				tr.clipes.map(([x, cw]) => {
					const nk = n0 + k * 2;
					k++;
					const p = tw(f, nk, nk + 5, 0, 1, E.back);
					return (
						<div
							key={`${j}-${x}`}
							style={{
								position: 'absolute',
								left: w * (0.02 + x * 0.96),
								top: h * tr.y,
								width: w * cw * 0.96 - 4,
								height: h * 0.075,
								borderRadius: 5,
								background: `linear-gradient(180deg, ${tr.cor}, ${tr.cor}99)`,
								opacity: f < nk ? 0 : 1,
								transform: `translateY(${(1 - p) * -h * 0.12}px) scale(${0.7 + 0.3 * p})`,
								boxShadow: `0 0 10px ${tr.cor}88`,
							}}
						/>
					);
				}),
			)}
			<div style={{position: 'absolute', left: w * 0.02, right: w * 0.02, top: h * 0.89, height: h * 0.07, display: 'flex', alignItems: 'center', gap: 2}}>
				{[...Array(60)].map((_, j) => (
					<div key={j} style={{flex: 1, height: `${20 + 80 * Math.abs(Math.sin(j * 0.7 + f * 0.15))}%`, background: COR.ouro, opacity: 0.55}} />
				))}
			</div>
			<div style={{position: 'absolute', top: h * 0.58, bottom: 0, left: w * (0.04 + cab * 0.9), width: 2, background: COR.nucleo, boxShadow: `0 0 8px ${COR.fogo}`}} />
		</div>
	);
};

// ---------- roleta (T6): círculo com furo, gomos fogo / creme / tensão / ouro, ícone por gomo ----------
const GOMOS = [
	{cor: COR.fogo, ic: 'mic'},
	{cor: COR.creme, ic: 'camera'},
	{cor: '#B5121B', ic: 'play'},
	{cor: COR.ouro, ic: 'celular'},
	{cor: COR.creme, ic: 'claquete'},
	{cor: COR.fogo, ic: 'onda'},
];
export const Roleta: React.FC<{cx: number; cy: number; ro: number; ri: number; ang: number; ativo: number}> = ({cx, cy, ro, ri, ang, ativo}) => {
	const n = GOMOS.length;
	const seg = 360 / n;
	const pt = (r: number, a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
	return (
		<g>
			<defs>
				{GOMOS.map((g, k) => (
					<radialGradient key={k} id={`gomo${k}`} cx={cx} cy={cy} r={ro} gradientUnits="userSpaceOnUse">
						<stop offset={ri / ro} stopColor={g.cor} stopOpacity={0.55} />
						<stop offset={0.85} stopColor={g.cor} stopOpacity={0.95} />
						<stop offset={1} stopColor="#FFFEDD" stopOpacity={1} />
					</radialGradient>
				))}
			</defs>
			{GOMOS.map((g, k) => {
				const a0 = ang + k * seg - seg / 2 + 1.2;
				const a1 = ang + k * seg + seg / 2 - 1.2;
				const [x0, y0] = pt(ro, a0), [x1, y1] = pt(ro, a1), [x2, y2] = pt(ri, a1), [x3, y3] = pt(ri, a0);
				const d = `M ${x0} ${y0} A ${ro} ${ro} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${ri} ${ri} 0 0 0 ${x3} ${y3} Z`;
				const [ix, iy] = pt((ro + ri) / 2, ang + k * seg);
				const on = k === ativo;
				const escuro = g.cor === COR.creme;
				return (
					<g key={k}>
						<path d={d} fill={`url(#gomo${k})`} opacity={on ? 1 : 0.82} />
						{on && <path d={d} fill="none" stroke={COR.nucleo} strokeWidth={5} style={{filter: `drop-shadow(0 0 12px ${COR.ouroAlto}) drop-shadow(0 0 28px ${COR.fogo})`}} />}
						<g transform={`translate(${ix - 60} ${iy - 60}) rotate(${ang + k * seg + 90} 60 60)`}>
							<foreignObject width={120} height={120}>
								<div style={{width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: `drop-shadow(0 0 8px ${escuro ? 'rgba(0,0,0,0.5)' : COR.ouroAlto})`}}>
									<Icone nome={g.ic} s={on ? 104 : 88} cor={escuro ? '#3a1f08' : '#FFFFF7'} larg={2.2} />
								</div>
							</foreignObject>
						</g>
					</g>
				);
			})}
			<AnelNeon cx={cx} cy={cy} r={ro + 8} larg={3.5} />
			<AnelNeon cx={cx} cy={cy} r={ri - 6} larg={3} cor={COR.fogo} />
			<circle cx={cx} cy={cy} r={ri - 12} fill="#0a0603" />
		</g>
	);
};

// ---------- pasta de vidro dourado ----------
export const Pasta: React.FC<{w: number; abre: number; brilho: number}> = ({w, abre, brilho}) => {
	const h = w * 0.72;
	const vidro = 'linear-gradient(160deg, rgba(255,236,170,0.55) 0%, rgba(242,190,58,0.42) 35%, rgba(176,100,25,0.38) 100%)';
	const borda = `2.5px solid ${COR.nucleo}`;
	const halo = `0 0 ${20 + 30 * brilho}px rgba(242,190,58,0.75), 0 0 ${60 + 40 * brilho}px rgba(244,137,7,0.45), inset 0 0 30px rgba(255,254,221,0.25)`;
	return (
		<div style={{position: 'relative', width: w, height: h, transformStyle: 'preserve-3d'}}>
			{/* costas com aba */}
			<div style={{position: 'absolute', left: 0, top: -h * 0.1, width: w * 0.36, height: h * 0.2, borderRadius: '18px 18px 0 0', background: vidro, border: borda, borderBottom: 'none', boxShadow: halo}} />
			<div style={{position: 'absolute', inset: 0, borderRadius: 22, background: vidro, border: borda, boxShadow: halo}} />
			{/* papéis */}
			{[0, 1].map((j) => (
				<div key={j} style={{position: 'absolute', left: w * (0.16 + j * 0.06), right: w * (0.16 - j * 0.03), top: h * (0.22 - 0.2 * abre) + j * 16, height: h * 0.5, borderRadius: 10, background: j === 0 ? 'linear-gradient(180deg,#FFF6DC,#E9D6AE)' : 'linear-gradient(180deg,#F3E3C3,#cdb68a)', opacity: 0.55, boxShadow: '0 0 20px rgba(255,236,170,0.4)', transform: `rotate(${(j - 0.5) * 6 * abre}deg)`}} />
			))}
			{/* frente que abre para baixo */}
			<div
				style={{
					position: 'absolute',
					left: -w * 0.02,
					right: -w * 0.02,
					top: h * 0.2,
					bottom: 0,
					borderRadius: 22,
					transformOrigin: '50% 100%',
					transform: `perspective(1400px) rotateX(${abre * 52}deg)`,
					background: 'linear-gradient(170deg, rgba(255,240,190,0.62) 0%, rgba(242,190,58,0.5) 40%, rgba(200,120,30,0.5) 100%)',
					border: borda,
					boxShadow: halo,
					backdropFilter: 'blur(6px)',
				}}
			>
				<div style={{position: 'absolute', inset: 0, borderRadius: 22, background: 'linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 40%)'}} />
			</div>
		</div>
	);
};

export const Ladrilho: React.FC<{nome: string; s: number}> = ({nome, s}) => (
	<div
		style={{
			width: s,
			height: s,
			borderRadius: s * 0.24,
			background: 'linear-gradient(150deg, rgba(255,236,170,0.75) 0%, rgba(242,190,58,0.6) 45%, rgba(176,100,25,0.65) 100%)',
			border: `2.5px solid ${COR.nucleo}`,
			boxShadow: `0 0 18px rgba(242,190,58,0.8), 0 0 46px rgba(244,137,7,0.5), inset 0 0 16px rgba(255,254,221,0.35)`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<Icone nome={nome} s={s * 0.56} larg={2.2} />
	</div>
);

export const Cursor: React.FC<{s: number; aperta: number}> = ({s, aperta}) => (
	<svg width={s} height={s * 1.3} viewBox="0 0 20 26" style={{overflow: 'visible', transform: `scale(${1 - 0.15 * aperta})`, transformOrigin: '10% 5%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'}}>
		<path d="M2 1 L2 21 L7 16.5 L10.5 24 L13.5 22.6 L10 15.2 L17 15.2 Z" fill="#FFFFFF" stroke="#1a1209" strokeWidth={1.4} strokeLinejoin="round" />
	</svg>
);
