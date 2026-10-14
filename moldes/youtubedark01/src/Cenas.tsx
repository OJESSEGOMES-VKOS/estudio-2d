import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {Boneco, Pose} from './Boneco';
import {ALT_PE, EM_PE, SENTADO} from './Poses';
import {C, E, FONTE, FPS, NEON_OURO, NEON_VERDE, T, cena, ini, lerp, marca, tw, txt} from './base';
import {Cama, Facho, Janela, Luminaria, Mesa, Parede, Poeira, Svg} from './Cenarios';
import {Avanco, Cadeira, Cartao, Icone} from './Objetos';

/**
 * Família B: uma ilustração PARADA por frase (youtubedark01.md §4: "câmera parada"; o movimento vem do corte).
 * Só respiração/piscada do personagem e a poeira na luz dão vida. Chão em y 1140; legenda abaixo (y 1185-1490).
 */
type P = {f: number};
const CHAO = 1140;
const sec = (f: number) => f / FPS;
const emPe = (x: number, s: number, extra: Partial<Pose> = {}): Pose => ({...EM_PE, x, y: CHAO - ALT_PE * s, s, ...extra}) as Pose;

const Fundo: React.FC<{id: string; topo?: string}> = ({id, topo = '#121318'}) => (
	<>
		<Parede chao={CHAO} id={id} topo={topo} base="#09090b" />
		<rect x={0} y={CHAO + 2} width={1080} height={1920 - CHAO} fill="#060607" />
	</>
);
const Luz: React.FC<{cx: number; w0?: number; w1?: number; base?: number; op?: number; id: string; cor?: string}> = ({cx, w0 = 90, w1 = 520, base = CHAO, op = 1, id, cor = C.ouroClaro}) => (
	<Facho cx={cx} topo={-20} base={base} w0={w0} w1={w1} op={op} cor={cor} id={id} />
);

// S1 "Esse vídeo está sendo 100% editado pelo Claude." mesa de edição, a barra chega a 100%
export const S1: React.FC<P> = ({f}) => {
	const t = sec(f);
	const barra = f < marca('barra_cheia') ? 0.62 : tw(f, marca('barra_cheia'), marca('barra_fim'), 0.62, 1, E.out);
	const pose: Pose = {...SENTADO, x: 430, y: CHAO - 115, s: 1, mF: [150, -150], mT: [132, -142], olhos: 'aberto', boca: 'leve', olhar: [1, -0.3]} as Pose;
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="s1" />
				<Luz cx={560} w1={760} id="s1" op={0.85} />
				<Poeira t={t} x={260} y={300} w={600} h={800} n={22} op={0.45} cor={C.ouroClaro} seed={1} />
				<Mesa x0={540} x1={1010} topo={890} chao={CHAO} />
				<Luminaria bx={975} by={890} luz={1} cor={C.ouro} />
				{/* monitor */}
				<rect x={752} y={846} width={40} height={44} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
				<rect x={712} y={884} width={120} height={10} rx={4} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
				<rect x={590} y={560} width={370} height={290} rx={14} fill="#0d0f13" stroke={C.giz} strokeWidth={6} />
				{/* linha do tempo: três trilhas de clipes */}
				{[0, 1, 2].map((r) =>
					[0, 1, 2, 3].map((c) => {
						const x = 616 + c * 80 + ((r * 23) % 40);
						const w = 58 + ((r + c) % 3) * 8;
						if (x + w > 936) return null;
						const v = (r === 0 && c === 1) || (r === 1 && c === 2) || (r === 2 && c === 0);
						return <rect key={`${r}${c}`} x={x} y={600 + r * 52} width={w} height={36} rx={6} fill={v ? '#0b2a18' : '#1c1e24'} stroke={v ? C.verde : C.giz} strokeWidth={3.5} style={v ? {filter: NEON_VERDE} : undefined} />;
					}),
				)}
				<line x1={760} x2={760} y1={586} y2={760} stroke={C.ouro} strokeWidth={4} />
				{/* barra de progresso */}
				<rect x={616} y={788} width={318} height={30} rx={15} fill="#0a0b0d" stroke={C.giz} strokeWidth={4} />
				<rect x={621} y={793} width={308 * barra} height={20} rx={10} fill={C.verde} style={{filter: NEON_VERDE}} />
				<Cadeira x0={330} x1={480} y={CHAO - 115} chao={CHAO} />
				<Boneco p={pose} t={t} id="s1" />
			</Svg>
		</AbsoluteFill>
	);
};

// S2 "Ele foi criado justamente para te mostrar a diferença entre vários modelos" três cartões diferentes
export const S2: React.FC<P> = ({f}) => {
	const t = sec(f);
	const xs = [330, 545, 760];
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="s2" />
				{xs.map((x, i) => (
					<Luz key={i} cx={x + 85} w0={50} w1={300} base={CHAO} op={0.75} id={`s2${i}`} />
				))}
				<Cartao x={xs[0]} y={470} w={170} tipo="leg" estado="giz" />
				<Cartao x={xs[1]} y={470} w={170} tipo="divide" estado="giz" />
				<Cartao x={xs[2]} y={470} w={170} tipo="grade" estado="giz" />
				<Boneco p={emPe(190, 1.0, {abre: 0.4, mF: [178, -168], jF: [0, 1], mT: [-30, 14], olhos: 'aberto', boca: 'leve', olhar: [1, -0.4]})} t={t} id="s2" />
			</Svg>
		</AbsoluteFill>
	);
};

// S3 "que eu criei e melhorei para editar qualquer tipo de vídeo usando o Claude." o cartão verde e os tipos de vídeo
export const S3: React.FC<P> = ({f}) => {
	const t = sec(f);
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="s3" />
				<Luz cx={540} w1={700} id="s3" />
				<Poeira t={t} x={200} y={300} w={680} h={820} n={26} op={0.5} cor={C.ouroClaro} seed={3} />
				<Icone x={170} y={500} s={130} tipo="mic" rot={-8} />
				<Icone x={905} y={430} s={130} tipo="camera" rot={6} />
				<Icone x={150} y={860} s={120} tipo="claquete" rot={-4} />
				<Icone x={920} y={830} s={120} tipo="celular" rot={8} />
				<Boneco p={emPe(420, 1.08, {abre: 0.55, mF: [120, -120], mT: [112, -104], jF: [-0.2, 1], jT: [-0.2, 1], olhos: 'aberto', boca: 'dentes', sobr: 'firme', olhar: [1, -0.2]})} t={t} id="s3" />
				<Cartao x={548} y={556} w={200} tipo="play" estado="verde" rot={6} />
			</Svg>
		</AbsoluteFill>
	);
};

// S4 "Inclusive, se você estiver no Instagram agora," na cama, rolando o feed (sem marca: só um feed genérico)
export const S4: React.FC<P> = ({f}) => {
	const t = sec(f);
	const pose: Pose = {x: 470, y: 975, s: 1.12, rot: -5, abre: 0.45, pT: [185, 8], pF: [198, -4], kT: [1, -0.4], kF: [1, -0.4], mF: [64, -205], mT: [44, -192], jF: [-0.2, 1], jT: [-0.2, 1], olhos: 'cansado', olhar: [0.5, 0.5], boca: 'reto'};
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="s4" topo="#10141f" />
				<Janela x={640} y={330} w={260} h={260} id="s4" />
				<path d="M 652 594 L 888 594 L 760 1140 L 360 1140 Z" fill="#c8d4ee" opacity={0.05} filter="url(#desfoque2)" />
				<Cama x0={300} topo={975} chao={CHAO} />
				<rect x={320} y={926} width={150} height={52} rx={26} fill="#4a5068" stroke={C.cobertaLinha} strokeWidth={4} />
				<Boneco p={pose} t={t} id="s4" celular={{luz: 1}} />
				<path d="M 560 930 Q 640 890 760 905 L 1080 905 L 1080 1000 L 540 1000 Z" fill={C.coberta} stroke={C.cobertaLinha} strokeWidth={4.5} strokeLinejoin="round" />
				<path d="M 640 930 Q 700 950 760 940 M 820 925 Q 880 945 960 932" fill="none" stroke={C.cobertaLinha} strokeWidth={3.5} strokeLinecap="round" />
			</Svg>
		</AbsoluteFill>
	);
};

// S5 "você está vendo apenas um desses modelos." cinco cartões, só um aceso
export const S5: React.FC<P> = ({f}) => {
	const t = sec(f);
	const lado: [number, number, 'leg' | 'divide' | 'grade' | 'onda', number][] = [
		[70, 440, 'grade', -6],
		[250, 400, 'leg', -3],
		[690, 400, 'onda', 3],
		[870, 440, 'divide', 6],
	];
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="s5" topo="#0d0e12" />
				<Luz cx={540} w0={60} w1={420} id="s5" />
				{lado.map(([x, y, tp, r], i) => (
					<Cartao key={i} x={x} y={y} w={140} tipo={tp} estado="apagado" rot={r} />
				))}
				<Cartao x={430} y={310} w={220} tipo="play" estado="verde" />
				<Boneco p={emPe(540, 0.72, {abre: 0.9, mF: [30, 10], mT: [-30, 10], olhos: 'aberto', boca: 'o', olhar: [0, -1]})} t={t} id="s5" />
			</Svg>
		</AbsoluteFill>
	);
};

// S6/S7 a parede das prévias: dois focos; as prévias entram nos quadros (componente Previas, abaixo)
export const QUADROS = [
	{x: 140, y: 290, w: 300},
	{x: 640, y: 290, w: 300},
];
const ParedePrevias: React.FC<{f: number; aponta: boolean}> = ({f, aponta}) => {
	const t = sec(f);
	const pose = aponta
		? emPe(540, 0.75, {abre: 0.6, mF: [48, -330], jF: [1, 0], mT: [-30, 12], olhos: 'aberto', boca: 'dentes', olhar: [0.4, -1]})
		: emPe(540, 0.75, {abre: 0.9, mF: [34, 12], mT: [-34, 12], olhos: 'aberto', boca: 'o', olhar: [0, -1]});
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="s6" topo="#0e0f13" />
				{QUADROS.map((q, i) => (
					<Luz key={i} cx={q.x + q.w / 2} w0={60} w1={420} base={CHAO} op={0.9} id={`s6${i}`} />
				))}
				<Poeira t={t} x={120} y={250} w={840} h={880} n={24} op={0.4} cor={C.ouroClaro} seed={6} />
				{aponta ? <Avanco x={700} y={1020} s={1.15} /> : null}
				<Boneco p={pose} t={t} id="s6" />
			</Svg>
		</AbsoluteFill>
	);
};
export const S6: React.FC<P> = ({f}) => <ParedePrevias f={f} aponta={false} />;
export const S7: React.FC<P> = ({f}) => <ParedePrevias f={f} aponta />;

/** as duas prévias penduradas nos quadros da parede, cada uma com a etiqueta do modelo dela; só com previas=true */
export const Previas: React.FC<{f: number; nomes: [string, string]}> = ({f, nomes}) => {
	if (!T.previas) return null; // o plano sem "previas": a parede fica só com os focos
	const {de_q, ate_q} = T.previas;
	if (f < de_q || f >= ate_q) return null;
	const op = tw(f, de_q, de_q + 4, 0, 1, E.lin);
	return (
		<AbsoluteFill style={{opacity: op}}>
			<Sequence from={de_q} durationInFrames={ate_q - de_q} layout="none">
				{QUADROS.map((q, i) => {
					const h = (q.w * 16) / 9;
					return (
						<React.Fragment key={i}>
							<div style={{position: 'absolute', left: q.x - 12, top: q.y - 12, width: q.w + 24, height: h + 24, borderRadius: 10, background: '#1a1408', border: `5px solid ${C.ouro}`, boxSizing: 'border-box', filter: NEON_OURO}} />
							<div style={{position: 'absolute', left: q.x, top: q.y, width: q.w, height: h, overflow: 'hidden', borderRadius: 4, background: '#000'}}>
								<OffthreadVideo src={staticFile(`previa${i + 1}.mp4`)} muted style={{width: q.w, height: h, objectFit: 'cover'}} />
								<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,231,163,0.16) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.25) 100%)'}} />
							</div>
							<div style={{position: 'absolute', left: q.x - 40, width: q.w + 80, top: q.y + h + 26, textAlign: 'center', fontFamily: FONTE, fontWeight: 700, fontSize: 36, color: C.giz, textShadow: '0 2px 10px #000'}}>
								{nomes[i]}
							</div>
						</React.Fragment>
					);
				})}
			</Sequence>
		</AbsoluteFill>
	);
};

// S8 "Mas se você quiser realmente ver" porta fechada com luz vazando
export const S8: React.FC<P> = ({f}) => {
	const t = sec(f);
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="s8" topo="#0f1014" />
				<g style={{filter: NEON_OURO}}>
					<rect x={512} y={502} width={300} height={638} fill="none" stroke={C.ouro} strokeWidth={5} opacity={0.75} />
					<rect x={500} y={CHAO - 6} width={324} height={8} fill={C.ouroClaro} />
				</g>
				<path d={`M 512 ${CHAO} L 812 ${CHAO} L 900 ${CHAO + 40} L 440 ${CHAO + 40} Z`} fill={C.ouro} opacity={0.18} filter="url(#desfoque2)" />
				<rect x={516} y={506} width={292} height={630} fill="#15161b" stroke={C.movelLinha} strokeWidth={4} />
				<rect x={548} y={548} width={228} height={230} rx={8} fill="none" stroke="#2c2e35" strokeWidth={4} />
				<rect x={548} y={830} width={228} height={260} rx={8} fill="none" stroke="#2c2e35" strokeWidth={4} />
				<circle cx={552} cy={860} r={13} fill={C.ouro} />
				<Boneco p={emPe(380, 1.0, {abre: 0.3, mF: [166, -58], jF: [0, 1], mT: [-26, 16], olhos: 'normal', boca: 'reto', olhar: [1, 0]})} t={t} id="s8" />
			</Svg>
		</AbsoluteFill>
	);
};

// S9 "outros modelos de edição como esse e aprender" porta aberta: a sala cheia de cartões acesos
export const S9: React.FC<P> = ({f}) => {
	const t = sec(f);
	const tipos = ['leg', 'divide', 'grade', 'onda', 'play'] as const;
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="s9" topo="#0f1014" />
				<defs>
					<radialGradient id="s9sala" cx="50%" cy="45%" r="70%">
						<stop offset="0%" stopColor="#2a2410" />
						<stop offset="100%" stopColor="#070806" />
					</radialGradient>
				</defs>
				<rect x={290} y={400} width={500} height={740} fill="url(#s9sala)" />
				{[0, 1, 2].map((r) =>
					[0, 1, 2, 3].map((c) => (
						<Cartao key={`${r}${c}`} x={318 + c * 116} y={432 + r * 196} w={96} tipo={tipos[(r * 4 + c) % 5]} estado={(r + c) % 3 === 0 ? 'ouro' : 'verde'} />
					)),
				)}
				<rect x={282} y={392} width={516} height={748} fill="none" stroke={C.movelLinha} strokeWidth={10} />
				<path d={`M 282 392 L 196 340 L 196 1188 L 282 ${CHAO}`} fill="#15161b" stroke={C.movelLinha} strokeWidth={4} />
				<path d={`M 290 ${CHAO} L 790 ${CHAO} L 980 1250 L 100 1250 Z`} fill={C.ouro} opacity={0.16} filter="url(#desfoque2)" />
				<g style={{filter: `drop-shadow(0 0 18px ${C.ouro}) drop-shadow(0 0 6px ${C.ouroClaro})`}}>
					<Boneco p={emPe(540, 0.82, {abre: 1, mF: [60, 0], mT: [-60, 0], jF: [1, 0], jT: [-1, 0]})} t={t} id="s9" plano="#050505" />
				</g>
			</Svg>
		</AbsoluteFill>
	);
};

// S10 "a como usar isso nos seus vídeos," o livro aberto brilhando, um vídeo saindo dele
export const S10: React.FC<P> = ({f}) => {
	const t = sec(f);
	const pose: Pose = {...SENTADO, x: 380, y: CHAO - 115, s: 1, mF: [168, -108], mT: [150, -98], olhos: 'aberto', boca: 'leve', olhar: [1, 0.6]} as Pose;
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="s10" topo="#100f0c" />
				<Luz cx={600} w0={70} w1={520} id="s10" op={0.6} />
				{Array.from({length: 7}).map((_, i) => {
					const a = (-150 + i * 20) * (Math.PI / 180);
					return <path key={i} d={`M 600 925 L ${600 + Math.cos(a) * 420} ${925 + Math.sin(a) * 420}`} stroke={C.ouroClaro} strokeWidth={10} opacity={0.12} filter="url(#desfoque2)" />;
				})}
				<Cartao x={530} y={560} w={140} tipo="leg" estado="verde" rot={4} />
				<Cadeira x0={280} x1={430} y={CHAO - 115} chao={CHAO} />
				<Boneco p={pose} t={t} id="s10" />
				<g style={{filter: NEON_OURO}}>
					<path d="M 500 930 Q 545 902 600 922 Q 655 902 700 930 L 700 950 Q 655 926 600 946 Q 545 926 500 950 Z" fill={C.ouroClaro} stroke={C.ouro} strokeWidth={4} strokeLinejoin="round" />
				</g>
				<path d="M 600 922 L 600 946" stroke="#a8862f" strokeWidth={3} />
			</Svg>
		</AbsoluteFill>
	);
};

// S11 fecho: comenta "EDIÇÃO" (fixo, na caixa de comentário); ele em cima da caixa apontando pra ela
export const S11: React.FC<P> = ({f}) => {
	const t = sec(f);
	const topoCaixa = 875;
	const sub = tw(f, marca('risco') + 6, marca('risco') + 15, 0, 1, E.inOut);
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Parede chao={topoCaixa} id="s11" topo="#121318" base="#09090b" />
				<rect x={0} y={topoCaixa} width={1080} height={1920} fill="#060607" />
				<Luz cx={330} w0={70} w1={420} base={topoCaixa} id="s11" />
				<Boneco p={{...emPe(330, 0.95, {abre: 0.45, mF: [150, 52], jF: [0, -1], mT: [-28, 14], olhos: 'aberto', boca: 'dentes', olhar: [1, 1]}), y: topoCaixa - ALT_PE * 0.95}} t={t} id="s11" />
				{f >= marca('caixa') ? (
					<g>
						<path d={`M 110 ${topoCaixa + 10} L 970 ${topoCaixa + 10} Q 990 ${topoCaixa + 10} 990 ${topoCaixa + 30} L 990 1115 Q 990 1135 970 1135 L 250 1135 L 196 1166 L 204 1135 L 110 1135 Q 90 1135 90 1115 L 90 ${topoCaixa + 30} Q 90 ${topoCaixa + 10} 110 ${topoCaixa + 10} Z`} fill="#0d0e12" stroke={C.giz} strokeWidth={6} strokeLinejoin="round" />
						{sub > 0 ? (
							<path
								d={Array.from({length: 25}, (_, i) => `${i ? 'L' : 'M'} ${300 + i * 20} ${1100 + (i % 2 ? 8 : -8)}`).join(' ')}
								fill="none"
								stroke={C.verm}
								strokeWidth={9}
								strokeLinecap="round"
								strokeLinejoin="round"
								pathLength={1}
								strokeDasharray="1 1"
								strokeDashoffset={1 - sub}
							/>
						) : null}
					</g>
				) : null}
			</Svg>
		</AbsoluteFill>
	);
};

/* Exemplos reaproveitáveis (cenas de um vídeo novo feito pelo youtubedark01.md; o aprovado não usa nenhuma):
 * N2 grava no celular e manda o arquivo (marca "mandei"), N3 três cartões que acendem um por vez (marcas "corte",
 * "legenda", "tela"), N4 a tela que edita sozinha e o visto (marca "decidiu"). Para usar, ponha as marcas no plano. */
// N2 "Eu só gravei e mandei o arquivo." grava no celular; em "mandei" o cartão do arquivo voa da mão para a direita
export const N2: React.FC<P> = ({f}) => {
	const t = sec(f);
	const k = tw(f, marca('mandei'), marca('mandei') + 12, 0, 1, E.out);
	const cx = lerp(430, 720, k);
	const cy = lerp(700, 520, k);
	const w = lerp(70, 170, k);
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="n2" />
				<Luz cx={360} w0={70} w1={520} id="n2a" op={0.85} />
				<Luz cx={800} w0={50} w1={340} id="n2b" op={0.5} />
				<Poeira t={t} x={120} y={300} w={840} h={800} n={20} op={0.4} cor={C.ouroClaro} seed={12} />
				{k > 0 ? <path d={`M 450 760 Q 600 560 ${cx - 10} ${cy + 140}`} fill="none" stroke={C.giz} strokeWidth={5} strokeDasharray="14 16" strokeLinecap="round" opacity={0.6 * k} /> : null}
				<Boneco p={emPe(330, 1.0, {abre: 0.4, mF: [96, -130], jF: [0, 1], mT: [-28, 14], olhos: 'aberto', boca: 'leve', olhar: [1, -0.2]})} t={t} id="n2" celular={{luz: 0.6, ang: 0}} />
				{k > 0 ? <Cartao x={cx - w / 2} y={cy - (w * 16) / 18} w={w} tipo="play" estado="verde" rot={lerp(-12, 4, k)} /> : null}
			</Svg>
		</AbsoluteFill>
	);
};

// N3 "Cada corte, cada legenda, cada tela" três cartões sob três focos, acendem um por vez
export const N3: React.FC<P> = ({f}) => {
	const t = sec(f);
	const xs = [150, 455, 760];
	const tipos = ['divide', 'leg', 'grade'] as const;
	const quando = [marca('corte'), marca('legenda'), marca('tela')];
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="n3" />
				{xs.map((x, i) => (
					<Luz key={i} cx={x + 85} w0={50} w1={300} base={CHAO} op={f >= quando[i] ? 0.9 : 0.35} id={`n3${i}`} />
				))}
				{xs.map((x, i) => (
					<Cartao key={i} x={x} y={430} w={170} tipo={tipos[i]} estado={f >= quando[i] ? 'verde' : 'apagado'} />
				))}
				<Boneco p={emPe(540, 0.72, {abre: 0.9, mF: [30, 10], mT: [-30, 10], olhos: 'aberto', boca: 'o', olhar: [0, -1]})} t={t} id="n3" />
			</Svg>
		</AbsoluteFill>
	);
};

// N4 "que você está vendo aqui foi ele que decidiu e editou." a tela edita sozinha; o visto em "decidiu"
export const N4: React.FC<P> = ({f}) => {
	const t = sec(f);
	const de = cena('N4').de_q;
	const ok = tw(f, marca('decidiu'), marca('decidiu') + 8, 0, 1, E.out);
	return (
		<AbsoluteFill style={{background: C.preto}}>
			<Svg>
				<Fundo id="n4" />
				<Luz cx={600} w1={720} id="n4" op={0.85} />
				<Poeira t={t} x={260} y={300} w={640} h={800} n={22} op={0.45} cor={C.ouroClaro} seed={4} />
				<rect x={410} y={470} width={420} height={330} rx={16} fill="#0d0f13" stroke={C.giz} strokeWidth={6} />
				<rect x={600} y={800} width={40} height={60} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
				<rect x={540} y={856} width={160} height={12} rx={5} fill={C.movel} stroke={C.movelLinha} strokeWidth={3} />
				{[0, 1, 2].map((r) =>
					[0, 1, 2, 3].map((c) => {
						const x = 440 + c * 92 + ((r * 23) % 40);
						const w = 64 + ((r + c) % 3) * 8;
						if (x + w > 800) return null;
						const n = de + 4 + (r * 4 + c) * 3;
						const v = f >= n;
						return <rect key={`${r}${c}`} x={x} y={510 + r * 58} width={w} height={40} rx={6} fill={v ? '#0b2a18' : '#1c1e24'} stroke={v ? C.verde : C.apagado} strokeWidth={3.5} style={v ? {filter: NEON_VERDE} : undefined} />;
					}),
				)}
				{ok > 0 ? (
					<path d="M 560 740 L 605 775 L 690 700" fill="none" stroke={C.verde} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ok} style={{filter: NEON_VERDE}} />
				) : null}
				<Boneco p={emPe(230, 0.95, {abre: 0.3, mF: [-20, 10], mT: [-40, 10], olhos: 'aberto', boca: 'leve', olhar: [1, -0.4]})} t={t} id="n4" />
			</Svg>
		</AbsoluteFill>
	);
};

export const CENAS: Record<string, React.FC<P>> = {S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, N2, N3, N4};

// ---------------------------------------------------------------- texto
const ESTILO_TXT = (fs: number, cor: string, brilho?: string): React.CSSProperties => ({
	display: 'inline-block',
	whiteSpace: 'pre',
	fontFamily: FONTE,
	fontWeight: 700,
	fontSize: fs,
	lineHeight: 1,
	letterSpacing: 1,
	color: cor,
	WebkitTextStroke: `${Math.round(fs * 0.16)}px #000`,
	paintOrder: 'stroke fill',
	textShadow: brilho ?? `0 ${fs * 0.07}px 0 #000`,
});

/** uma palavra: entra no quadro em que é dita, com um "pop" de 3 quadros (ref7: palavra grossa, branca, contorno preto) */
const Palavra: React.FC<{i: number; f: number; n: number; fs: number; verde?: boolean}> = ({i, f, n, fs, verde}) => {
	const s = tw(f, n, n + 3, 0.82, 1, E.out);
	const st = ESTILO_TXT(fs, verde ? C.verde : '#ffffff', verde ? `0 0 14px ${C.verde}, 0 0 30px rgba(61,255,138,0.6), 0 ${fs * 0.07}px 0 #000` : undefined);
	return <span style={{...st, opacity: f < n ? 0 : 1, transform: `scale(${s})`}}>{txt(i)}</span>;
};

type Bloco = {id: string; cena: string; linhas: number[][]; verde?: number[]};
export const BLOCOS = T.blocos as Bloco[];

/** a legenda: sempre na mesma posição (terço de baixo), blocos que duram a cena inteira, palavra por palavra */
export const Legenda: React.FC<{f: number}> = ({f}) => {
	const b = BLOCOS.find((x) => {
		const c = T.cenas.find((k) => k.id === x.cena)!;
		return f >= c.de_q && f < c.ate_q;
	});
	if (!b) return null;
	const c = T.cenas.find((k) => k.id === b.cena)!;
	const {fs, y0, passo} = T.legenda;
	const cx = (T.legenda as {cx?: number}).cx ?? 540; // centro da legenda; sem "cx" no plano, 540 (o aprovado)
	return (
		<AbsoluteFill>
			{b.linhas.map((l, k) => (
				<div key={k} style={{position: 'absolute', left: cx - 540, width: 1080, top: y0 + k * passo - fs * 0.5, height: fs, textAlign: 'center', whiteSpace: 'nowrap'}}>
					{l.map((i, j) => (
						<React.Fragment key={i}>
							{j > 0 && <span style={{display: 'inline-block', width: fs * 0.28}} />}
							<Palavra i={i} f={f} n={Math.max(c.de_q, ini(i))} fs={fs} verde={b.verde?.includes(i)} />
						</React.Fragment>
					))}
				</div>
			))}
		</AbsoluteFill>
	);
};

/** o comando fixo do fecho: COMENTA / "EDIÇÃO" dentro da caixa de comentário */
export const Fixo: React.FC<{f: number}> = ({f}) => {
	if (!T.fixo) return null; // o plano sem "fixo": sem comando fixo no fecho
	const c = T.cenas.find((k) => k.id === T.fixo!.cena)!;
	if (f < c.de_q) return null;
	return (
		<AbsoluteFill>
			{T.fixo.linhas.map((l, k) => (
				<div key={k} style={{position: 'absolute', left: 0, width: 1080, top: l.y - l.fs * 0.5, height: l.fs, textAlign: 'center', whiteSpace: 'nowrap'}}>
					{l.ids.map((i) => (
						<Palavra key={i} i={i} f={f} n={Math.max(c.de_q, ini(i))} fs={l.fs} />
					))}
				</div>
			))}
		</AbsoluteFill>
	);
};
