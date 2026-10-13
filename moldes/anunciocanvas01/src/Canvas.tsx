import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {C, DURACAO, E as EZ, P as PAL, SANS, existe, mola, pare, rnd, seq, tw, useT, w, wf} from './tema';
import {Bolha, Celular, G, Glitch, IconeVidro, ImgOuTela, Linha, MarcaTexto, Notif, Pilula, Risco, Simbolo, Wordmark, brilho, hexA} from './ui';

/**
 * anunciocanvas01 v5 (../../modelos/anunciocanvas01/MODELO.md), tema Marcaí.
 *
 * A v4 ainda era "uma página gigante com uma cena em cada pedaço e a câmera indo de um pro outro". A v5 não
 * tem cena nem estação:
 *  - CADA ELEMENTO (frase, pílula, balão, celular, cartão, número) mora no seu próprio ponto do canvas, na sua
 *    profundidade, e aparece no tempo da palavra;
 *  - a CÂMERA percorre um caminho contínuo com keyframes suavizados (o "auto bezier" do After Effects:
 *    Hermite com tangente pelos vizinhos, velocidade contínua, nunca para). O rumo vira aos poucos (sorteio
 *    fixo), a distância respira (aproxima/afasta), o giro e a inclinação ondulam devagar;
 *  - cada frase tem um keyframe; os elementos dela ficam em volta desse ponto, então chegam pelo lado pra onde
 *    a câmera vai, passam pelo centro enquanto são lidos e ficam pra trás, saindo do quadro sozinhos;
 *  - o fundo muda de cor no tempo (claro nas frases claras, escuro com uma mancha da cor do momento).
 */
const W = 1080, H = 1920, P = 1000;
const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/* ---------------------------------------------------------------- O PLANO: a fala para a qual ele foi feito (o roteiro.txt dito) */
const FALA = 'Sua agenda ainda vive no meio das mensagens? O cliente pede horário às onze da noite. Você responde de manhã, e ele já marcou em outro lugar. Outro confirma e, no dia, não aparece. É uma hora parada que ninguém paga. Agora tem o Marcaí. Você manda o seu link e o cliente marca sozinho. Escolhe o serviço, o horário e paga o sinal no Pix. A confirmação chega na hora. Um dia antes, o lembrete vai sozinho. E quem já pagou o sinal não esquece. De manhã, você abre o painel e vê o dia inteiro. Doze atendimentos, todos confirmados. Sem parar o corte pra responder mensagem. Pra salão, barbearia e estúdio de estética. Teste grátis por catorze dias. Marcaí. Marcou, tá marcado.';
{
	const limpa = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
	const plano = FALA.split(/\s+/).map(limpa).filter(Boolean);
	const fala = PAL.palavras.map((p) => limpa(p.texto)).filter(Boolean);
	const k = plano.findIndex((x, i) => x !== fala[i]);
	if (k >= 0 || plano.length !== fala.length) {
		const j = k >= 0 ? k : Math.min(plano.length, fala.length);
		pare(
			`O plano não bate com a fala. src/Canvas.tsx foi feito para outra fala: na palavra ${j + 1} o plano tem "${plano[j] ?? '(fim)'}" e src/palavras.json tem "${fala[j] ?? '(fim)'}". ` +
				'Refaça FRASES e a Coreografia em src/Canvas.tsx sobre a fala nova (LEIA, "Vídeo novo") e cole o texto dela em FALA (linha 24).',
		);
	}
}

/* ---------------------------------------------------------------- as frases (índices de palavras.json) */
type Tom = 'marca' | 'dor' | 'noite' | 'claro';
const FRASES: [number, number, Tom][] = [
	[0, 7, 'marca'], [8, 15, 'noite'], [16, 26, 'claro'], [27, 33, 'dor'], [34, 40, 'dor'], [41, 44, 'marca'],
	[45, 54, 'claro'], [55, 65, 'marca'], [66, 70, 'claro'], [71, 77, 'marca'], [78, 85, 'claro'], [86, 96, 'marca'],
	[97, 100, 'marca'], [101, 107, 'claro'], [108, 114, 'marca'], [115, 119, 'marca'], [120, 123, 'marca'],
];
FRASES.forEach(([a, b], k) => {
	const antes = k ? FRASES[k - 1][1] + 1 : 0;
	if (a !== antes || b < a || b >= PAL.palavras.length)
		pare(`FRASES[${k}] em src/Canvas.tsx vai da palavra ${a} à ${b}, mas tem de começar em ${antes} e ficar dentro da fala (0 a ${PAL.palavras.length - 1}): as frases cobrem a fala inteira, em ordem.`);
});
if (FRASES[FRASES.length - 1][1] !== PAL.palavras.length - 1) pare(`FRASES em src/Canvas.tsx acaba na palavra ${FRASES[FRASES.length - 1][1]}, e a fala vai até ${PAL.palavras.length - 1}: a última frase tem de fechar a fala.`);
const ini = (k: number) => PAL.palavras[FRASES[k][0]].de;
const fim = (k: number) => PAL.palavras[FRASES[k][1]].ate;
/** o keyframe de cada frase fica no meio dela (o grupo passa pelo centro do quadro enquanto é lido) */
const TK = FRASES.map((_, k) => (k === FRASES.length - 1 ? Math.min(DURACAO - 0.6, fim(k) + 0.6) : (ini(k) + fim(k)) / 2));

/* ---------------------------------------------------------------- a câmera (keyframes + auto bezier) */
/* v6 ("mescla uma aleatoriedade entre esse, o v4, o v3 e o v2"): cada passagem de uma frase pra outra sorteia
 * (sorteio fixo) um dos três jeitos que o Jessé já viu, sem repetir o mesmo 3 vezes seguidas:
 *  - FLUXO (v5): passo curto, a câmera desliza contínua e os elementos passam pelo quadro (easy ease 35%);
 *  - CURVA (v3/v4): viagem mais longa em arco (keyframe extra no meio do vão, desviado pro lado) até a frase
 *    seguinte, que assenta mais (easy ease 12%): parece chegar numa composição;
 *  - CHICOTE (v2): a câmera segura até a fala acabar e salta longe no vão entre as frases, rápido, com borrão
 *    de movimento (calculado pela velocidade, em Canvas).
 * A virada ("Agora tem o Marcaí") é sempre chicote; o fecho, curva. */
type Tipo = 'fluxo' | 'curva' | 'chicote';
type K = {t: number; x: number; y: number; d: number; roll: number; ease: number};
export const TIPOS: Tipo[] = (() => {
	const r: Tipo[] = ['fluxo'];
	for (let k = 1; k < FRASES.length; k++) {
		const u = rnd(k * 11.3);
		let tp: Tipo = k === 5 ? 'chicote' : k === FRASES.length - 1 ? 'curva' : u < 0.4 ? 'fluxo' : u < 0.7 ? 'curva' : 'chicote';
		if (k !== 5 && r[k - 1] === tp && r[k - 2] === tp) tp = tp === 'fluxo' ? 'curva' : 'fluxo';
		r.push(tp);
	}
	return r;
})();
const montar = () => {
	const ks: K[] = [];
	const fk: K[] = []; // o keyframe de cada frase (os elementos ficam em volta dele)
	let x = 0, y = 0, rumo = -0.3;
	FRASES.forEach((_, k) => {
		const tp = TIPOS[k];
		const d = 1080 + (rnd(k * 5.3) - 0.5) * 220, roll = (rnd(k * 2.1) - 0.5) * 7;
		if (k > 0) {
			rumo += (rnd(k * 3.7) - 0.5) * (tp === 'chicote' ? 2.4 : 1.5);
			const passo = tp === 'fluxo' ? 460 + rnd(k * 9.1) * 240 : tp === 'curva' ? 1000 + rnd(k * 9.1) * 300 : 1600 + rnd(k * 9.1) * 300;
			const nx = x + Math.cos(rumo) * passo, ny = y + Math.sin(rumo) * passo;
			const ant = fk[k - 1];
			if (tp === 'curva') {
				const lado = rnd(k * 7.7) < 0.5 ? -1 : 1;
				const tm = (fim(k - 1) + ini(k)) / 2;
				ks.push({t: Math.max(ant.t + 0.15, Math.min(TK[k] - 0.15, tm)), x: (x + nx) / 2 - Math.sin(rumo) * passo * 0.3 * lado, y: (y + ny) / 2 + Math.cos(rumo) * passo * 0.3 * lado, d: (ant.d + d) / 2 + 120, roll: (ant.roll + roll) / 2 + lado * 2, ease: 1});
			}
			if (tp === 'chicote') {
				const segura = Math.max(ant.t + 0.12, Math.min(fim(k - 1) + 0.02, ini(k) - 0.3));
				const chega = Math.min(TK[k] - 0.12, Math.max(ini(k) + 0.02, segura + 0.28));
				ks.push({t: segura, x: x + Math.cos(rumo) * 40, y: y + Math.sin(rumo) * 40, d: ant.d, roll: ant.roll, ease: 0});
				ks.push({t: chega, x: nx - Math.cos(rumo) * 40, y: ny - Math.sin(rumo) * 40, d, roll, ease: 0});
			}
			x = nx;
			y = ny;
		}
		const kf: K = {t: TK[k], x, y, d, roll, ease: tp === 'curva' ? 0.12 : tp === 'chicote' ? 0.25 : 0.35};
		ks.push(kf);
		fk.push(kf);
	});
	const a = ks[0], b = ks[1], z = ks[ks.length - 1], y2 = ks[ks.length - 2];
	ks.unshift({t: -1.2, x: a.x - (b.x - a.x) * 0.45, y: a.y - (b.y - a.y) * 0.45, d: a.d + 120, roll: a.roll - 2, ease: 1});
	ks.push({t: DURACAO + 1.5, x: z.x + (z.x - y2.x) * 0.25, y: z.y + (z.y - y2.y) * 0.25, d: z.d + 160, roll: z.roll + 1, ease: 1});
	return {ks, fk};
};
const {ks: KS, fk: FK} = montar();
const hermite = (key: 'x' | 'y' | 'd' | 'roll', t: number) => {
	let i = 0;
	while (i < KS.length - 2 && t > KS[i + 1].t) i++;
	const a = KS[i], b = KS[i + 1];
	const tan = (j: number) => {
		const p = KS[Math.max(0, j - 1)], n = KS[Math.min(KS.length - 1, j + 1)];
		// easy ease do After Effects: no keyframe a velocidade cai pro "ease" dele (0 = segura, 1 = auto bezier)
		return ((n[key] - p[key]) / (n.t - p.t)) * KS[j].ease;
	};
	const h = b.t - a.t, s = cl((t - a.t) / h), s2 = s * s, s3 = s2 * s;
	return (2 * s3 - 3 * s2 + 1) * a[key] + (s3 - 2 * s2 + s) * h * tan(i) + (-2 * s3 + 3 * s2) * b[key] + (s3 - s2) * h * tan(i + 1);
};
/** "wiggle" macio de After Effects: senos de períodos que não se repetem juntos */
const wig = (t: number, f: number[], fase: number) => f.reduce((acc, q, i) => acc + Math.sin(t * q + fase * (i + 1.7)) / (i + 1), 0);
const camera = (t: number) => ({
	x: hermite('x', t) + 14 * wig(t, [0.31, 0.57], 1.1),
	y: hermite('y', t) + 11 * wig(t, [0.27, 0.63], 3.2),
	d: hermite('d', t) + 30 * wig(t, [0.19, 0.41], 2.4),
	roll: hermite('roll', t) + 0.6 * wig(t, [0.23, 0.49], 0.7),
	tx: 2.4 * wig(t, [0.21, 0.44], 1.9), // inclinação 3D lenta (a paralaxe entre as camadas aparece)
	ty: 3.0 * wig(t, [0.17, 0.39], 4.4),
});

/* ---------------------------------------------------------------- o elemento solto no canvas */
const frente = (t: number, de: number, cfg = {}) => {
	const k = mola(t, de, {damping: 15, stiffness: 150, ...cfg});
	return {opacity: Math.min(1, k * 2), transform: `scale(${0.7 + 0.3 * k})`, filter: k < 0.7 ? `blur(${(0.7 - k) * 22}px)` : undefined} as React.CSSProperties;
};
/** um elemento: preso ao keyframe da frase k, deslocado (x, y) em px de tela, na profundidade z.
 *  Some devagar (desfoca) um tempo depois da frase acabar, se ainda estiver no quadro. */
const El: React.FC<{k: number; x: number; y: number; z?: number; rot?: number; fica?: boolean; children: React.ReactNode}> = ({k, x, y, z = 0, rot = 0, fica, children}) => {
	const {t} = useT();
	const key = FK[k];
	const sai = fica ? 0 : tw(t, fim(k) + 0.45, fim(k) + 1.05, 0, 1, EZ.suave);
	if (sai >= 1) return null;
	const esc = (key.d - z) / P; // o deslocamento de tela vira deslocamento no mundo naquela distância
	return (
		<div style={{position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d',
			transform: `translate3d(${key.x + x * esc}px, ${key.y + y * esc}px, ${z}px) rotateZ(${key.roll}deg)`}}>
			<div style={{position: 'absolute', transform: `translate(-50%, -50%) rotate(${rot}deg)`, opacity: 1 - sai, filter: sai > 0.02 ? `blur(${(sai * 18).toFixed(1)}px)` : z < -150 ? `blur(${Math.min(8, -z / 70).toFixed(1)}px)` : undefined, whiteSpace: 'nowrap'}}>
				{children}
			</div>
		</div>
	);
};
const L: React.FC<{de: number; txt: string; tam: number; cor: string; peso?: number; glow?: string; extra?: (i: number) => React.ReactNode}> = ({de, txt, tam, cor, peso = 700, glow, extra}) => (
	<Linha p={seq(de, txt)} tam={tam} cor={cor} peso={peso} glow={glow} extra={extra} />
);
const Pop: React.FC<{de: number; children: React.ReactNode}> = ({de, children}) => {
	const {t} = useT();
	return <div style={frente(t, de)}>{children}</div>;
};

/* ---------------------------------------------------------------- peças pequenas próprias da v5 */
const Hora2347: React.FC = () => {
	const {t} = useT();
	const o = w('onze');
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 26, ...frente(t, o - 0.06)}}>
			<div style={{filter: 'drop-shadow(0 0 26px rgba(120,140,255,0.7))'}}>{G.lua(120, '#C9D0FF')}</div>
			<div style={{fontFamily: SANS, fontWeight: 300, fontSize: 210, letterSpacing: '-0.04em', color: '#EEF0FF', lineHeight: 1, textShadow: '0 0 30px rgba(110,130,255,0.8)'}}>23:47</div>
		</div>
	);
};
const Data15: React.FC = () => {
	const {t} = useT();
	const nao = w('não');
	return (
		<div style={{...frente(t, w('dia,') - 0.05), width: 300, borderRadius: 40, background: 'linear-gradient(160deg, #26212F, #15121C)', border: '2px solid rgba(255,255,255,0.1)', overflow: 'hidden', textAlign: 'center', fontFamily: SANS, filter: t > nao ? 'grayscale(1) brightness(0.7)' : undefined}}>
			<div style={{background: '#3A3346', color: '#fff', fontWeight: 700, fontSize: 32, padding: '12px 0', letterSpacing: '0.12em'}}>QUA</div>
			<div style={{color: '#fff', fontWeight: 800, fontSize: 130, lineHeight: 1.05, letterSpacing: '-0.05em'}}>15</div>
			<div style={{color: '#CFC8DD', fontWeight: 600, fontSize: 34, paddingBottom: 20}}>14:30 · Corte</div>
		</div>
	);
};
const Relogio: React.FC = () => {
	const {t} = useT();
	const giro = tw(t, w('hora'), w('paga.') + 0.3, 0, 1, EZ.suave);
	const k = mola(t, w('é') - 0.05, {damping: 16, stiffness: 120});
	const R = 190;
	return (
		<svg width={480} height={480} viewBox="-240 -240 480 480" style={{opacity: k, transform: `scale(${0.8 + 0.2 * k})`, overflow: 'visible'}}>
			<circle r={R} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={10} />
			<circle r={R} fill="none" stroke={C.vermelho} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${giro} 1`} transform="rotate(-90)" style={{filter: `drop-shadow(0 0 14px ${C.vermelho})`}} />
			<g transform="translate(-110 -118)" style={{filter: 'drop-shadow(0 0 20px rgba(255,42,42,0.35))'}}>{G.cadeira(220, '#BDB5CC')}</g>
		</svg>
	);
};
const Campo: React.FC = () => {
	const {t} = useT();
	const m = w('manda');
	const txt = 'agendar · Studio Aurora';
	const n = Math.round(tw(t, m + 0.05, m + 0.5, 0, txt.length, (x) => x));
	return (
		<div style={{...frente(t, m - 0.04), width: 700, height: 120, borderRadius: 60, background: '#fff', border: `3px solid ${hexA(C.vFundo, 0.35)}`, boxShadow: `0 24px 60px rgba(70,30,170,0.18)`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 20, fontFamily: SANS, fontSize: 34, fontWeight: 600, color: C.tinta}}>
			<div style={{width: 86, height: 86, borderRadius: 43, background: C.vFundo, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{G.link(52, '#fff')}</div>
			<span style={{flex: 1}}>{txt.slice(0, n)}</span>
		</div>
	);
};
const Fone: React.FC<{src: string; larg: number; de: number; giro?: number}> = ({src, larg, de, giro = -18}) => {
	const {t} = useT();
	const k = mola(t, de, {damping: 18, stiffness: 80, mass: 1});
	return (
		<div style={{perspective: 2200}}>
			<div style={{transform: `translateY(${(1 - k) * 260}px) rotateX(${8 - 4 * k}deg) rotateY(${giro + 8 * k + Math.sin(t * 0.7) * 3}deg)`, opacity: Math.min(1, k * 2)}}>
				<Celular src={src} larg={larg} />
			</div>
		</div>
	);
};
const SinalPago: React.FC = () => {
	const {t} = useT();
	const p = w('pagou');
	const kc = tw(t, p + 0.2, p + 0.5, 0, 1);
	return (
		<div style={{...frente(t, p - 0.05), width: 640, borderRadius: 44, background: '#fff', boxShadow: '0 30px 80px rgba(70,30,170,0.18)', border: '2px solid #ECE8F3', padding: '34px 40px', display: 'flex', alignItems: 'center', gap: 30, fontFamily: SANS}}>
			<div style={{width: 120, height: 120, borderRadius: 60, background: C.vFundo, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{G.check(88, '#fff', kc)}</div>
			<div>
				<div style={{fontSize: 32, color: C.sub, fontWeight: 600}}>Sinal pago</div>
				<div style={{fontSize: 74, fontWeight: 800, color: C.tinta, letterSpacing: '-0.04em', lineHeight: 1.05}}>R$ 20,00</div>
			</div>
		</div>
	);
};
const PainelImg: React.FC = () => {
	const {t} = useT();
	const de = w('painel');
	const k = mola(t, de - 0.3, {damping: 18, stiffness: 60, mass: 1});
	const L2 = 1150;
	return (
		<div style={{perspective: 2000}}>
			<div style={{width: L2, height: L2 * (1440 / 2160), transform: `rotateX(${22 - 8 * k}deg) rotateY(${-14 + Math.sin(t * 0.5) * 3}deg) rotateZ(-5deg)`, opacity: Math.min(1, k * 2), borderRadius: 24, overflow: 'hidden', boxShadow: `0 0 0 3px ${hexA(C.vClaro, 0.5)}, 0 0 100px ${hexA(C.v, 0.45)}, 0 50px 100px rgba(0,0,0,0.6)`}}>
				<ImgOuTela src="painel.png" larg={L2} alt={L2 * (1440 / 2160)} />
			</div>
		</div>
	);
};
const Doze: React.FC = () => {
	const {t} = useT();
	const d = w('doze'), todos = w('todos');
	const n = Math.round(tw(t, d - 0.05, d + 0.55, 0, 12, EZ.out));
	const k = mola(t, d - 0.08, {damping: 13, stiffness: 140});
	return (
		<div style={{position: 'relative', width: 640, height: 640, opacity: Math.min(1, k * 2), transform: `scale(${0.7 + 0.3 * k})`}}>
			<svg width={640} height={640} viewBox="-320 -320 640 640" style={{position: 'absolute', inset: 0}}>
				{Array.from({length: 12}, (_, i) => {
					const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
					const ac = tw(t, todos + i * 0.06, todos + i * 0.06 + 0.12, 0, 1);
					const x = Math.cos(a) * 270, y = Math.sin(a) * 270;
					return (
						<g key={i}>
							<circle cx={x} cy={y} r={24} fill={ac > 0 ? C.vFundo : '#1C1826'} stroke={ac > 0 ? C.vClaro : 'rgba(255,255,255,0.18)'} strokeWidth={3} />
							<path d={`M${x - 10} ${y + 1} L${x - 3} ${y + 8} L${x + 11} ${y - 7}`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ac} />
						</g>
					);
				})}
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 300, letterSpacing: '-0.06em', color: '#fff', textShadow: brilho(C.v, 2)}}>{n}</div>
		</div>
	);
};
const Neon: React.FC<{de: number; cor: string; ic: (s: number, c: string) => React.ReactNode; txt: string; sub?: string}> = ({de, cor, ic, txt, sub}) => {
	const {t} = useT();
	const p = t - (de - 0.06);
	const flick = p < 0.22 ? (rnd(Math.floor(p * 60)) > 0.45 ? 1 : 0.25) : 1;
	return (
		<div style={{...frente(t, de - 0.06), display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: t < de - 0.06 ? 0 : flick}}>
			<div style={{filter: `drop-shadow(0 0 14px ${cor}) drop-shadow(0 0 36px ${cor})`}}>{ic(180, cor)}</div>
			{sub && <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 52, color: '#fff', textShadow: brilho(cor, 0.5)}}>{sub}</div>}
			<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 120, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, textShadow: `0 0 10px ${cor}, 0 0 30px ${cor}, 0 0 70px ${cor}`, WebkitTextStroke: `3px ${cor}`}}>{txt}</div>
		</div>
	);
};
const Botao: React.FC = () => {
	const {t} = useT();
	const clique = w('grátis') + 0.12;
	const acende = tw(t, clique, clique + 0.18, 0, 1);
	const kb = mola(t, w('teste') - 0.1, {damping: 15, stiffness: 150});
	return (
		<div style={{width: 700, height: 170, borderRadius: 85, opacity: Math.min(1, kb * 2), transform: `scale(${0.7 + 0.3 * kb})`, background: acende > 0 ? `linear-gradient(160deg, ${C.vClaro}, ${C.vFundo} 50%, ${C.vEscuro})` : '#24202E', boxShadow: acende > 0 ? `0 0 ${80 * acende}px ${hexA(C.v, 0.8)}` : '0 20px 60px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: SANS, fontWeight: 800, fontSize: 78, letterSpacing: '-0.035em', color: acende > 0 ? '#fff' : '#6E6880'}}>
			{G.cadeado(70, acende > 0 ? '#fff' : '#6E6880', acende)}
			Teste grátis
		</div>
	);
};
const Marca: React.FC = () => {
	const {t} = useT();
	const m = w('marcaí.', 2);
	const k = mola(t, m - 0.12, {damping: 12, stiffness: 120});
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
			<div style={{opacity: Math.min(1, k * 2), transform: `rotate(${(1 - k) * -200}deg) scale(${0.2 + 0.8 * k})`, filter: `drop-shadow(0 0 40px ${hexA(C.v, 0.8)})`}}>
				<Simbolo tam={250} check={tw(t, m + 0.15, m + 0.5, 0, 1, EZ.inOut)} />
			</div>
			<Wordmark tam={170} texto="marcaı" letras={tw(t, m + 0.05, m + 0.45, 0, 6, (x) => x)} />
		</div>
	);
};

/* ---------------------------------------------------------------- a coreografia: cada elemento no seu lugar */
const B = '#fff', T = C.tinta, SUB = '#CFC8DD', SUBC = '#5E5770';
const Coreografia: React.FC = () => {
	const {t} = useT();
	return (
		<>
			{/* 0. Sua agenda ainda vive no meio das mensagens? */}
			<El k={0} x={-60} y={-140}><L de={0.1} txt="Sua agenda" tam={124} cor={B} peso={800} /></El>
			<El k={0} x={70} y={0}><L de={0.6} txt="ainda vive no meio das" tam={56} cor={SUB} peso={400} /></El>
			<El k={0} x={0} y={140}><Pilula texto="mensagens?" de={w('mensagens?')} tam={96} /></El>
			<El k={0} x={-300} y={-520} z={-260} rot={-6}><Pop de={w('mensagens?') + 0.05}><Bolha texto="oi, tem horário hoje?" lado="in" tam={40} /></Pop></El>
			<El k={0} x={320} y={460} z={-320} rot={5}><Pop de={w('mensagens?') + 0.15}><Bolha texto="consegue 18h?" lado="in" tam={40} /></Pop></El>

			{/* 1. O cliente pede horário às onze da noite. */}
			<El k={1} x={-40} y={-300}><L de={2.7} txt="O cliente pede horário" tam={60} cor="#E4DEF2" peso={400} /></El>
			<El k={1} x={-120} y={-150}><Pop de={w('pede') - 0.1}><Bolha texto="Oi! Tem horário amanhã?" lado="in" tam={46} hora="23:47" /></Pop></El>
			<El k={1} x={40} y={110}><Hora2347 /></El>
			<El k={1} x={0} y={320}><L de={3.8} txt="às onze da noite." tam={64} cor={B} /></El>

			{/* 2. Você responde de manhã, e ele já marcou em outro lugar. */}
			<El k={2} x={0} y={-330}><L de={5.0} txt="Você responde de manhã," tam={60} cor={T} peso={600} /></El>
			<El k={2} x={120} y={-150}><Pop de={w('responde') - 0.05}><div style={{position: 'relative'}}><Bolha texto="Bom dia! Tenho às 10h, pode ser?" lado="out" claro tam={42} hora="08:12" checks /><Risco de={w('lugar.') + 0.05} espessura={10} /></div></Pop></El>
			<El k={2} x={-110} y={30}><Pop de={w('marcou') - 0.05}><Bolha texto="Ah, já marquei em outro lugar." lado="in" claro tam={42} hora="08:40" /></Pop></El>
			<El k={2} x={0} y={250}><L de={6.4} txt="e ele já marcou" tam={56} cor={SUBC} peso={400} /></El>
			<El k={2} x={0} y={350}><L de={7.3} txt="em outro lugar." tam={104} cor={T} peso={800} /></El>

			{/* 3. Outro confirma e, no dia, não aparece. */}
			<El k={3} x={-150} y={-300}><L de={8.2} txt="Outro confirma" tam={60} cor="#E4DEF2" peso={400} /></El>
			<El k={3} x={120} y={-80}><Data15 /></El>
			<El k={3} x={0} y={260}>{t > w('não') - 0.05 ? <Glitch texto="não aparece" de={w('não')} tam={116} /> : <span />}</El>

			{/* 4. É uma hora parada que ninguém paga. */}
			<El k={4} x={60} y={-150}><Relogio /></El>
			<El k={4} x={-30} y={190}><L de={11.1} txt="É uma hora parada que" tam={70} cor={B} /></El>
			<El k={4} x={0} y={300}>{t >= w('ninguém') - 0.04 ? <Glitch texto="ninguém paga." de={w('ninguém')} tam={96} peso={500} cor="#FF7A7A" /> : <span />}</El>

			{/* 5. Agora tem o Marcaí. */}
			<El k={5} x={0} y={-300}><L de={13.4} txt="Agora tem o" tam={64} cor="#E4DEF2" peso={400} /></El>
			<El k={5} x={0} y={-20}>{(() => { const m = w('marcaí.'); const kk = mola(t, m - 0.12, {damping: 12, stiffness: 110, mass: 0.9}); return <div style={{opacity: Math.min(1, kk * 1.8), transform: `scale(${0.3 + 0.7 * kk})`}}><IconeVidro tam={300} giroY={(1 - kk) * -140 + Math.sin(t * 1.4) * 10}>{G.cal(170)}</IconeVidro></div>; })()}</El>
			<El k={5} x={0} y={280}><div style={{filter: `drop-shadow(0 0 30px ${hexA(C.v, 0.6)})`}}><Wordmark tam={150} texto="marcaı" letras={tw(t, w('marcaí.'), w('marcaí.') + 0.4, 0, 6, (x) => x)} /></div></El>

			{/* 6. Você manda o seu link e o cliente marca sozinho. */}
			<El k={6} x={-120} y={-420}><L de={14.8} txt="Você manda o seu" tam={62} cor={T} peso={600} /></El>
			<El k={6} x={-40} y={-310}><L de={15.6} txt="link" tam={130} cor={C.vFundo} peso={800} /></El>
			<El k={6} x={60} y={-140}><Campo /></El>
			<El k={6} x={-180} y={190} z={40}><Fone src="reserva.png" larg={360} de={w('cliente', 2) - 0.1} giro={-22} /></El>
			<El k={6} x={230} y={180}><L de={15.9} txt="e o cliente" tam={52} cor={SUBC} peso={400} /></El>
			<El k={6} x={230} y={260}><L de={16.6} txt="marca sozinho." tam={78} cor={T} peso={800} /></El>

			{/* 7. Escolhe o serviço, o horário e paga o sinal no Pix. */}
			<El k={7} x={-90} y={40} z={30}><Fone src="reserva.png" larg={520} de={w('escolhe') - 0.25} giro={-12} /></El>
			<El k={7} x={260} y={-440}><Pilula texto="serviço" de={w('serviço,')} tam={70} solida /></El>
			<El k={7} x={290} y={-110}><Pilula texto="horário" de={w('horário', 2)} tam={70} solida /></El>
			<El k={7} x={250} y={230}><Pilula texto="sinal no Pix" de={w('sinal')} tam={70} solida /></El>

			{/* 8. A confirmação chega na hora. */}
			<El k={8} x={0} y={-420}><L de={20.4} txt="A confirmação" tam={64} cor={T} peso={600} /></El>
			<El k={8} x={0} y={-310}><L de={21.4} txt="chega na hora." tam={104} cor={T} peso={800} extra={(i) => (i >= 1 ? <MarcaTexto de={w('na') + 0.05 + (i - 1) * 0.12} cor={C.v} /> : null)} /></El>
			<El k={8} x={130} y={160} z={20}><Fone src="confirmado.png" larg={380} de={w('confirmação') - 0.3} giro={-24} /></El>
			<El k={8} x={-230} y={240} z={60}>{(() => { const c = w('confirmação'); const kc = mola(t, c, {damping: 11, stiffness: 160}); return <div style={{opacity: Math.min(1, kc * 2), transform: `scale(${0.3 + 0.7 * kc})`}}><IconeVidro tam={220} giroY={(1 - kc) * 90 + Math.sin(t * 1.5) * 8}>{G.check(140, '#fff', tw(t, c + 0.1, c + 0.4, 0, 1))}</IconeVidro></div>; })()}</El>

			{/* 9. Um dia antes, o lembrete vai sozinho. */}
			<El k={9} x={-40} y={-430}><L de={22.4} txt="Um dia antes," tam={104} cor={B} peso={800} /></El>
			{[0, 1].map((i) => (
				<El key={i} k={9} x={30 - i * 40} y={-160 + i * 200} z={i * -40} rot={i ? 2 : -1.5}><Pop de={w('lembrete') + i * 0.22}><Notif titulo="Marcaí · Lembrete" texto={i ? 'Amanhã, 10:30 · Corte feminino com Bia.' : 'Amanhã, 14:30 · Corte + barba com Teo.'} larg={760} /></Pop></El>
			))}
			<El k={9} x={60} y={300}><L de={23.5} txt="o lembrete vai" tam={58} cor="#E4DEF2" peso={400} /></El>
			<El k={9} x={60} y={400}><L de={24.1} txt="sozinho." tam={116} cor={B} peso={800} glow={C.v} /></El>

			{/* 10. E quem já pagou o sinal não esquece. */}
			<El k={10} x={-40} y={-200}><SinalPago /></El>
			<El k={10} x={30} y={110}><L de={24.9} txt="E quem já pagou o sinal" tam={58} cor="#4A4458" peso={500} /></El>
			<El k={10} x={0} y={220}><L de={26.0} txt="não esquece." tam={124} cor={T} peso={800} extra={(i) => (i === 1 ? <MarcaTexto de={w('esquece.') + 0.08} cor={C.v} /> : null)} /></El>

			{/* 11. De manhã, você abre o painel e vê o dia inteiro. */}
			<El k={11} x={-60} y={-470}><L de={26.9} txt="De manhã, você abre o" tam={54} cor="#E4DEF2" peso={400} /></El>
			<El k={11} x={-60} y={-370}><L de={28.1} txt="painel" tam={120} cor={B} peso={800} glow={C.v} /></El>
			<El k={11} x={80} y={40} z={-40}><PainelImg /></El>
			<El k={11} x={40} y={430}><L de={28.6} txt="e vê o dia inteiro." tam={84} cor={B} peso={800} /></El>

			{/* 12. Doze atendimentos, todos confirmados. */}
			<El k={12} x={0} y={-130}><Doze /></El>
			<El k={12} x={0} y={260}><L de={30.1} txt="atendimentos," tam={62} cor="#E4DEF2" peso={400} /></El>
			<El k={12} x={0} y={360}><L de={30.9} txt="todos confirmados." tam={96} cor={B} peso={800} glow={C.v} /></El>

			{/* 13. Sem parar o corte pra responder mensagem. */}
			<El k={13} x={130} y={-300}>{(() => { const c = w('corte'); const snip = t > c - 0.05 ? Math.abs(Math.sin((t - c + 0.05) * 14)) * (t < c + 0.7 ? 1 : 0) : 0.15; return <Pop de={w('sem') - 0.05}><div style={{transform: `rotate(${-20 + (t - c) * 6}deg)`, filter: 'drop-shadow(0 18px 30px rgba(80,40,180,0.25))'}}>{G.tesoura(260, C.vFundo, snip)}</div></Pop>; })()}</El>
			<El k={13} x={-30} y={60}><L de={32.4} txt="Sem parar o corte" tam={96} cor={T} peso={800} /></El>
			<El k={13} x={40} y={180}><div style={{position: 'relative'}}><L de={33.5} txt="pra responder mensagem." tam={62} cor="#4A4458" peso={500} /><Risco de={wf('mensagem.') - 0.1} espessura={9} dur={0.2} /></div></El>

			{/* 14. Pra salão, barbearia e estúdio de estética. (cada nicho num ponto diferente) */}
			<El k={14} x={-40} y={-520}><L de={34.9} txt="Pra" tam={56} cor={SUB} peso={400} /></El>
			<El k={14} x={-210} y={-270}><Neon de={w('salão,')} cor={C.vClaro} ic={G.secador} txt="salão" /></El>
			<El k={14} x={190} y={30}><Neon de={w('barbearia')} cor={C.ambar} ic={G.navalha} txt="barbearia" /></El>
			<El k={14} x={-120} y={380}><Neon de={w('estúdio')} cor={C.ciano} ic={G.brilho} txt="estética" sub="estúdio de" /></El>

			{/* 15. Teste grátis por catorze dias. */}
			<El k={15} x={0} y={60}><Botao /></El>
			<El k={15} x={140} y={-130}>{(() => { const c = w('catorze'); const kb = mola(t, c - 0.04, {damping: 11, stiffness: 180}); return <div style={{opacity: Math.min(1, kb * 2), transform: `scale(${0.6 + 0.4 * kb}) rotate(${Math.sin((t - c) * 3) * 2}deg)`, background: '#fff', color: C.tinta, fontFamily: SANS, fontWeight: 800, fontSize: 66, letterSpacing: '-0.03em', padding: '18px 40px', borderRadius: 36, boxShadow: `0 0 50px ${hexA(C.v, 0.5)}`}}>por 14 dias</div>; })()}</El>

			{/* 16. Marcaí. Marcou, tá marcado. (fica até o fim) */}
			<El k={16} x={0} y={-120} fica><Marca /></El>
			<El k={16} x={0} y={260} fica><L de={40.6} txt="Marcou, tá marcado." tam={70} cor={B} peso={600} /></El>
			<El k={16} x={0} y={420} fica>{(() => { const kr = tw(t, wf('marcado.') + 0.2, wf('marcado.') + 0.6, 0, 1); return <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 42, color: C.vClaro, opacity: kr, filter: kr < 1 ? `blur(${(1 - kr) * 10}px)` : undefined}}>Teste grátis por 14 dias</div>; })()}</El>
		</>
	);
};

/* ---------------------------------------------------------------- o fundo, no tempo */
const AMB: Record<Tom, {base: string; mancha: string}> = {
	marca: {base: C.preto, mancha: 'rgba(139,92,255,0.34)'},
	dor: {base: '#0B0506', mancha: 'rgba(255,42,42,0.26)'},
	noite: {base: '#05060D', mancha: 'rgba(70,90,255,0.26)'},
	claro: {base: C.claro, mancha: 'rgba(160,123,255,0.24)'},
};
const Fundo: React.FC<{mx: number; my: number}> = ({mx, my}) => {
	const {t} = useT();
	let k = 0;
	FRASES.forEach((_, i) => { if (t >= ini(i) - 0.35) k = i; });
	const u = k > 0 ? tw(t, ini(k) - 0.35, ini(k) + 0.15, 0, 1, EZ.suave) : 1;
	const camada = (tom: Tom, op: number) => (
		<AbsoluteFill style={{opacity: op, background: `radial-gradient(ellipse 75% 48% at ${50 + mx}% ${46 + my}%, ${AMB[tom].mancha}, rgba(0,0,0,0) 72%), ${AMB[tom].base}`}} />
	);
	return (
		<>
			{k > 0 && camada(FRASES[k - 1][2], 1)}
			{camada(FRASES[k][2], u)}
		</>
	);
};

/** o som: o mix pronto (som.m4a) ou, sem ele, só a narração (voz.wav ou voz.mp3) */
const SOM = ['som.m4a', 'voz.wav', 'voz.mp3'].find(existe);
export const Canvas: React.FC<{voz: boolean}> = ({voz}) => {
	if (voz && !SOM) pare('voz: true pede public/som.m4a (voz + trilha mixadas) ou só a narração em public/voz.wav ou public/voz.mp3 (o kit/voz.py grava o .mp3; LEIA, "Vídeo novo"). Ou renderize com voz: false.');
	const {t} = useT();
	const c = camera(t);
	const c2 = camera(t + 1 / 60), c0 = camera(t - 1 / 60);
	const vel = Math.hypot(c2.x - c0.x, c2.y - c0.y) * 30; // px/s
	const borrao = Math.min(20, Math.max(0, (vel - 2600) / 320)); // só o chicote passa disso
	const T3 = `translateZ(${P}px) rotateZ(${-c.roll}deg) rotateX(${c.tx}deg) rotateY(${c.ty}deg) translate3d(${-c.x}px, ${-c.y}px, ${-c.d}px)`;
	return (
		<AbsoluteFill style={{background: C.preto, overflow: 'hidden'}}>
			<Fundo mx={Math.sin(t * 0.21) * 4} my={Math.cos(t * 0.17) * 3} />
			<AbsoluteFill style={{perspective: P, perspectiveOrigin: '50% 50%', filter: borrao > 0.5 ? `blur(${borrao.toFixed(1)}px)` : undefined}}>
				<div style={{position: 'absolute', left: W / 2, top: H / 2, width: 0, height: 0, transformStyle: 'preserve-3d', transform: T3}}>
					<Coreografia />
				</div>
			</AbsoluteFill>
			{voz && SOM && <Audio src={staticFile(SOM)} />}
		</AbsoluteFill>
	);
};
