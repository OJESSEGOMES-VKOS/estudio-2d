import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';
import {Camera, Chave, POSE} from './Camera';
import {FPS, H, W, fr} from './tempos';

/**
 * Vitrine no youtubeedition01 (../../modelos/youtubeedition01/MODELO.md), 9:16.
 * Encanamento da apresentação do modelo (a câmera em janela) e dos scripts da vitrine; o visual NÃO é o da
 * apresentação recusada: sai das quatro referências. Formato A (método com a tela, S), espinha título-capítulo.
 * Plano frase a frase em ../plano.md.
 *
 * Identidade "Gelo, tinta e amarelo" (MODELO §9, medida em quadro cheio das refs):
 *   gelo #F8F8F8 = fundo das explicações (S 02:59 e J 09:13 medem #F8F8F8)
 *   tinta #0A0A0A = texto sobre o gelo e texto ATRÁS da pessoa (S mede #000808 no branco)
 *   branco #FCFCFC = texto na frente da pessoa (J 04:59 e D 10:37 medem #FCFCFC)
 *   amarelo #FCDC00 = o único acento, palavra-chave (M 00:01 e M 21:32 medem #FCDC00; J 12:25 pílulas amarelas)
 *   ruim #FC0000 (S 00:43, anel que risca); não usado neste vídeo
 *   Inter Tight 900/800/700: grotesca pesada de entreletra apertada, caixa alta no R3 (S), frase em caixa baixa no CTA (J)
 */
export const DURACAO_Q = 910;

const it = loadInterTight('normal', {weights: ['600', '700', '800', '900'], subsets: ['latin', 'latin-ext']});
const SANS = it.fontFamily;

export const COR = {gelo: '#F8F8F8', tinta: '#0A0A0A', branco: '#FCFCFC', amarelo: '#FCDC00', ruim: '#FC0000', cinza: '#7A7A7A'};
const SOMBRA_TXT = '0 4px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.5)';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = OUT) => interpolate(t, [a, b], [v0, v1], {...clamp, easing: e});

export type Props = {previas: boolean; nomesPrevias: [string, string]};

/* ---------------------------------------------------------------- tempos (s), tirados de src/palavras.json */
const T = {
	punch1: 1.2, // "100%"
	editado: 1.74,
	pelo: 2.3,
	claude: 2.52,
	largo1: 3.54, // "criado": o bloco 100% sai aqui (4 palavras, 2,34 s)
	tela1: 5.24, // "diferença": o cartão gira, entram dois
	varios: 5.82, // a grade 3x2
	zoom: 6.3,
	montagem: 8.26, // "editar qualquer tipo de vídeo"
	largo2: 9.52, // "usando o Claude."
	punch2: 10.7, // "Inclusive"
	reel: 11.75, // "Instagram": o plano encolhe para a tela de reels
	nome: 13.24, // "um desses modelos.": YOUTUBE / EDITION01 atrás
	previas: 14.84, // "posso": a janela das prévias
	entraPrevia: 15.04, // "até colocar"
	mas: 19.99,
	tela2: 21.91, // "outros modelos": callback da grade
	esse: 23.4, // "como esse": contorno e nome no cartão
	largo3: 24.75, // "aprender"
	cta: 26.75, // "comenta"
	edicao: 27.35,
	aqui: 27.91,
	fim: DURACAO_Q / FPS,
};

/* ---------------------------------------------------------------- câmera: as chaves */
const chaves = (previas: boolean): Chave[] => [
	[0, POSE.punch(1.15, 0.36), 0],
	[T.punch1, POSE.cheio, 0], // abre para o plano inteiro: a parede acima da cabeça recebe o 100%
	[T.largo1, POSE.punch(1.12, 0.36), 0],
	[T.tela1, POSE.cartao, 0.38, true],
	[T.montagem, POSE.cheio, 0], // escondida pela montagem
	[T.largo2, POSE.cheio, 0],
	[T.punch2, POSE.punch(1.2, 0.36), 0],
	[T.reel, POSE.reel, 0.4],
	[T.nome, POSE.punch(1.12, 0.33), 0],
	...((previas
		? [
				[T.previas, POSE.baixo(1), 0.32],
			]
		: [[T.previas, POSE.cheio, 0]]) as Chave[]),
	[T.mas, POSE.punch(1.2, 0.36), 0],
	[T.tela2, POSE.cartao, 0.38, true],
	[T.largo3, POSE.cheio, 0],
	[T.cta, POSE.punch(1.15, 0.3), 0],
];
/** Cortes secos (para a conferência de texto x corte). */
export const CORTES = [T.punch1, T.largo1, T.montagem, 8.58, 8.9, 9.22, T.largo2, T.punch2, T.nome, T.previas /* só sem prévias */, T.mas, T.largo3, T.cta];

/* ---------------------------------------------------------------- texto que acende (S: palavra a palavra, com borrão) */
const Acende: React.FC<{t: number; t0: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({t, t0, children, style, dy = 24}) => {
	if (t < t0) return null;
	const u = tw(t, t0, t0 + 0.2, 0, 1);
	return (
		<span style={{display: 'inline-block', opacity: u, filter: `blur(${(1 - u) * 14}px)`, transform: `translateY(${(1 - u) * dy}px) scale(${0.94 + 0.06 * u})`, ...style}}>
			{children}
		</span>
	);
};

/* R3 atrás: palavra-título gigante em tinta, entre o fundo e a pessoa recortada (S 01:03 "WHY NOW?", 02:48 "UNLIMITED") */
const Atras: React.FC<{t: number; t0: number; linhas: string[]; size: number; top: number}> = ({t, t0, linhas, size, top}) => (
	<div style={{position: 'absolute', left: 0, width: W, top, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 0.86, letterSpacing: '-0.045em', color: COR.tinta}}>
		{linhas.map((l, i) => (
			<div key={l}>
				<Acende t={t} t0={t0 + i * 0.1} dy={40}>
					<span style={{opacity: 0.93}}>{l}</span>
				</Acende>
			</div>
		))}
	</div>
);

/* ---------------------------------------------------------------- os modelos reais desta vitrine (a "coisa real") */
const GRADE = ['modelodinamico03', 'superpodcast01', 'pregacaodinamica01', 'storypodcast01', 'profissional01', 'modelodinamico01'];
const TW = 310, TH = 551, X0 = 55, GX = 20, Y0 = 90, PASSO = 607;
const posGrade = (i: number) => ({x: X0 + (i % 3) * (TW + GX), y: Y0 + Math.floor(i / 3) * PASSO, w: TW, h: TH});
const posPar = (i: number) => ({x: 60 + i * 500, y: 230, w: 460, h: 818});

const Rotulo: React.FC<{texto: string; t: number; t0: number; w: number; cor?: string}> = ({texto, t, t0, w, cor = COR.tinta}) => (
	<div style={{width: w, textAlign: 'center', marginTop: 12, fontFamily: SANS, fontWeight: 800, fontSize: 23, letterSpacing: '0.01em', textTransform: 'uppercase', color: cor, whiteSpace: 'nowrap'}}>
		<Acende t={t} t0={t0} dy={10}>
			{texto}
		</Acende>
	</div>
);

const Tile: React.FC<{nome: string; de: number; box: {x: number; y: number; w: number; h: number}; t: number; t0: number; rotulo: number | null}> = ({nome, de, box, t, t0, rotulo}) => {
	if (t < t0) return null;
	const u = tw(t, t0, t0 + 0.32, 0, 1);
	return (
		<div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, opacity: Math.min(1, u * 1.6), transform: `translateY(${(1 - u) * 90}px)`, filter: `blur(${(1 - u) * 16}px)`}}>
			<div style={{width: box.w, height: box.h, borderRadius: 22, overflow: 'hidden', background: '#111', boxShadow: '0 18px 44px rgba(0,0,0,0.20), 0 3px 10px rgba(0,0,0,0.10)'}}>
				<Sequence from={fr(de)} layout="none">
					<OffthreadVideo muted startFrom={fr(de)} src={staticFile(`ex/${nome}.mp4`)} style={{width: box.w, height: box.h, objectFit: 'cover'}} />
				</Sequence>
			</div>
			{rotulo !== null && <Rotulo texto={nome} t={t} t0={rotulo} w={box.w} />}
		</div>
	);
};

/** A tela da grade: fundo gelo, os modelos tocando no mesmo segundo da fala. `par`: começa com dois lado a lado. */
const Grade: React.FC<{t: number; de: number; ate: number; par: boolean}> = ({t, de, ate, par}) => {
	if (t < de || t >= ate) return null;
	const tg = par ? T.varios : de + 0.12;
	const z = par ? tw(t, T.zoom, T.montagem, 1, 1.06, Easing.inOut(Easing.sin)) : tw(t, de + 0.6, ate, 1, 1.05, Easing.inOut(Easing.sin));
	return (
		<AbsoluteFill style={{background: COR.gelo}}>
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 30%'}}>
				{GRADE.map((nome, i) => {
					if (par && i < 2) {
						// os dois da comparação entram grandes e depois encaixam na grade
						const a = posPar(i), b = posGrade(i);
						const m = tw(t, T.varios, T.varios + 0.4, 0, 1, Easing.inOut(Easing.cubic));
						const box = {x: a.x + (b.x - a.x) * m, y: a.y + (b.y - a.y) * m, w: a.w + (b.w - a.w) * m, h: a.h + (b.h - a.h) * m};
						return <Tile key={nome} nome={nome} de={de} box={box} t={t} t0={de + 0.1 + i * 0.09} rotulo={T.varios + 0.3} />;
					}
					return <Tile key={nome} nome={nome} de={de} box={posGrade(i)} t={t} t0={tg + (par ? i - 2 : i) * 0.07} rotulo={tg + 0.25} />;
				})}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** Contorno amarelo e nome no cartão do rosto, no "como esse" (dêitico: este vídeo). */
const EsteModelo: React.FC<{t: number}> = ({t}) => {
	if (t < T.esse || t >= T.largo3) return null;
	const c = POSE.cartao;
	const u = tw(t, T.esse, T.esse + 0.25, 0, 1);
	return (
		<>
			<div style={{position: 'absolute', left: c.x - 9, top: c.y - 9, width: c.w + 18, height: c.h + 18, borderRadius: c.r + 9, border: `7px solid ${COR.amarelo}`, opacity: u, transform: `scale(${1.06 - 0.06 * u})`}} />
			<div style={{position: 'absolute', left: c.x, top: c.y + c.h + 4}}>
				<Rotulo texto="youtubeedition01" t={t} t0={T.esse} w={c.w} />
			</div>
		</>
	);
};

/* ---------------------------------------------------------------- montagem: um modelo por palavra (D 00:43) */
const MONTAGEM: [number, number, string][] = [
	[T.montagem, 8.58, 'modelopadrao01'],
	[8.58, 8.9, 'profissional01'],
	[8.9, 9.22, 'modelodinamico03'],
	[9.22, T.largo2, 'superpodcast01'],
];
const Montagem: React.FC<{t: number}> = ({t}) => (
	<>
		{MONTAGEM.map(([a, b, nome]) =>
			t >= a && t < b ? (
				<AbsoluteFill key={nome}>
					<Sequence from={fr(a)} layout="none">
						<OffthreadVideo muted startFrom={fr(a - 8.0)} src={staticFile(`ex/cheio_${nome}.mp4`)} style={{width: W, height: H}} />
					</Sequence>
				</AbsoluteFill>
			) : null,
		)}
	</>
);

/* ---------------------------------------------------------------- tela de reels recriada (E5, ilustração assumida, sem logo) */
const Icone: React.FC<{d: string; y: number; u: number}> = ({d, y, u}) => (
	<svg width={62} height={62} viewBox="0 0 24 24" style={{position: 'absolute', left: 0, top: y, opacity: u, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))'}}>
		<path d={d} fill="none" stroke="#fff" strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" />
	</svg>
);
const CORACAO = 'M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3.1 1.5-1.9 3-3.1 5.1-3.1 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z';
const BALAO = 'M20.5 11.6c0 4.4-3.8 7.9-8.5 7.9-1.3 0-2.6-.3-3.7-.8L3.5 20l1.4-3.9C4 14.8 3.5 13.3 3.5 11.6c0-4.4 3.8-7.9 8.5-7.9s8.5 3.5 8.5 7.9z';
const AVIAO = 'M21 3L10.5 13.5M21 3l-6.6 18-3.9-7.5L3 9.6 21 3z';
const Reel: React.FC<{t: number}> = ({t}) => {
	if (t < T.reel || t >= T.nome) return null;
	const r = POSE.reel;
	const u = tw(t, T.reel + 0.15, T.reel + 0.4, 0, 1);
	return (
		<div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.r, overflow: 'hidden', opacity: u}}>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 360, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))'}} />
			<div style={{position: 'absolute', right: 26, top: r.h - 560, width: 62, height: 420}}>
				<Icone d={CORACAO} y={0} u={u} />
				<Icone d={BALAO} y={130} u={u} />
				<Icone d={AVIAO} y={260} u={u} />
			</div>
			<div style={{position: 'absolute', left: 30, bottom: 44, display: 'flex', alignItems: 'center', gap: 16, fontFamily: SANS}}>
				<Img src={staticFile('avatar.jpg')} style={{width: 66, height: 66, borderRadius: 33, border: '2px solid #fff'}} />
				<span style={{color: '#fff', fontWeight: 700, fontSize: 30, textShadow: SOMBRA_TXT}}>ojessegomes</span>
			</div>
		</div>
	);
};

/* ---------------------------------------------------------------- momento 2: prévias em cima (prop `previas`) */
const PREV = {w: 400, h: 711, y: 66, x: [100, 580]};
export const PreviasEmCima: React.FC<{t: number; nomes: [string, string]}> = ({t, nomes}) => {
	if (t < T.previas || t >= T.mas) return null;
	return (
		<>
			{[0, 1].map((i) => {
				const t0 = T.entraPrevia + i * 0.14;
				if (t < t0) return null;
				const u = tw(t, t0, t0 + 0.32, 0, 1);
				return (
					<div key={i} style={{position: 'absolute', left: PREV.x[i], top: PREV.y, width: PREV.w, opacity: Math.min(1, u * 1.6), transform: `translateY(${(1 - u) * -80}px)`, filter: `blur(${(1 - u) * 16}px)`}}>
						<div style={{width: PREV.w, height: PREV.h, borderRadius: 24, overflow: 'hidden', background: '#111', boxShadow: '0 18px 44px rgba(0,0,0,0.22), 0 3px 10px rgba(0,0,0,0.10)'}}>
							<Sequence from={fr(t0)} layout="none">
								<OffthreadVideo muted src={staticFile(`previa${i + 1}.mp4`)} style={{width: PREV.w, height: PREV.h, objectFit: 'cover'}} />
							</Sequence>
						</div>
						<Rotulo texto={nomes[i]} t={t} t0={t0 + 0.12} w={PREV.w} />
					</div>
				);
			})}
		</>
	);
};

/* ---------------------------------------------------------------- R3 na frente do hook (S 00:05 "USING CLAUDE", 00:48 "100% PROFIT") */
const Frente100: React.FC<{t: number}> = ({t}) => {
	if (t < T.editado || t >= T.largo1) return null;
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: 1215, textAlign: 'center', fontFamily: SANS, textTransform: 'uppercase', letterSpacing: '-0.03em', textShadow: SOMBRA_TXT}}>
			<div style={{fontWeight: 800, fontSize: 88, lineHeight: 1, color: COR.branco}}>
				<Acende t={t} t0={T.editado}>editado</Acende> <Acende t={t} t0={T.pelo}>pelo</Acende>
			</div>
			<div style={{fontWeight: 900, fontSize: 196, lineHeight: 0.95, color: COR.amarelo, marginTop: 6}}>
				<Acende t={t} t0={T.claude}>Claude</Acende>
			</div>
		</div>
	);
};

/* ---------------------------------------------------------------- momento 1: o nome do modelo (S 03:18 "NICHE": a palavra-título no
   centro do A-roll, branca e pesada, com o fio fino; no 9:16 a parede acima da cabeça não comporta duas linhas atrás) */
const FrenteNome: React.FC<{t: number}> = ({t}) => {
	if (t < T.nome || t >= T.previas) return null;
	const fio = tw(t, T.nome + 0.15, T.nome + 0.5, 0, 1);
	return (
		<div style={{position: 'absolute', left: 0, width: W, top: 1150, textAlign: 'center', fontFamily: SANS, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', color: COR.branco, textShadow: SOMBRA_TXT}}>
			<div style={{fontSize: 176, lineHeight: 0.88}}>
				<Acende t={t} t0={T.nome}>youtube</Acende>
			</div>
			<div style={{fontSize: 176, lineHeight: 0.88}}>
				<Acende t={t} t0={T.nome + 0.08}>edition01</Acende>
			</div>
			<div style={{width: 640 * fio, height: 6, background: COR.amarelo, margin: '26px auto 0', boxShadow: '0 2px 10px rgba(0,0,0,0.35)'}} />
		</div>
	);
};

/* ---------------------------------------------------------------- momento 3: o pedido (J 04:59 degradê + frase; M 00:31 palavra-chave amarela) */
const Cta: React.FC<{t: number}> = ({t}) => {
	if (t < T.cta) return null;
	const g = tw(t, T.cta, T.cta + 0.25, 0, 1);
	const seta = t >= T.aqui ? Math.sin((t - T.aqui) * 6) * 8 : 0;
	return (
		<>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 900, opacity: g, background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.42) 35%, rgba(0,0,0,0.78))'}} />
			<div style={{position: 'absolute', left: 0, width: W, top: 1268, textAlign: 'center', fontFamily: SANS, textShadow: SOMBRA_TXT}}>
				<div style={{fontWeight: 700, fontSize: 70, color: COR.branco, letterSpacing: '-0.02em'}}>
					<Acende t={t} t0={T.cta}>comenta</Acende>
				</div>
				<div style={{fontWeight: 900, fontSize: 248, lineHeight: 0.92, color: COR.amarelo, letterSpacing: '-0.04em', marginTop: 4}}>
					<Acende t={t} t0={T.edicao} dy={40}>EDIÇÃO</Acende>
				</div>
				<div style={{fontWeight: 700, fontSize: 70, color: COR.branco, letterSpacing: '-0.02em', marginTop: 14}}>
					<Acende t={t} t0={T.aqui}>aqui embaixo</Acende>
				</div>
				{t >= T.aqui + 0.1 && (
					<svg width={70} height={70} viewBox="0 0 24 24" style={{marginTop: 18, transform: `translateY(${seta}px)`, opacity: tw(t, T.aqui + 0.1, T.aqui + 0.3, 0, 1)}}>
						<path d="M12 4v15M5 12l7 7 7-7" fill="none" stroke={COR.branco} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				)}
			</div>
		</>
	);
};

/* ---------------------------------------------------------------- o vídeo */
export const VitrineYoutubeEdition01: React.FC<Props> = ({previas, nomesPrevias}) => {
	const t = useCurrentFrame() / FPS;
	const ch = chaves(previas);
	let atras: React.ReactNode = null;
	if (t >= T.punch1 && t < T.largo1) atras = <Atras t={t} t0={T.punch1} linhas={['100%']} size={250} top={118} />;
	const telaGelo = (t >= T.tela1 && t < T.montagem) || (t >= T.reel && t < T.nome) || (t >= T.tela2 && t < T.largo3) || (previas && t >= T.previas && t < T.mas);
	return (
		<AbsoluteFill style={{background: telaGelo ? COR.gelo : '#000'}}>
			<Grade t={t} de={T.tela1} ate={T.montagem} par />
			<Grade t={t} de={T.tela2} ate={T.largo3} par={false} />
			{previas && <PreviasEmCima t={t} nomes={nomesPrevias} />}
			<Camera chaves={ch} t={t} atras={atras} />
			<Reel t={t} />
			<EsteModelo t={t} />
			<Frente100 t={t} />
			<FrenteNome t={t} />
			<Montagem t={t} />
			<Cta t={t} />
		</AbsoluteFill>
	);
};
