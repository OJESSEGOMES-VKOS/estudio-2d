import React from 'react';
import {Freeze, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {C, DIVISA, E, FPS, MONO, Previas, R, SANS, SERIF, SOMBRA, montaCenas, mola, rostoX, tw, useT, w} from './tema';
import {CardPalco, ChipClaude, Cursor, Faisca, Fala, FalaEm, RostoPalco, Selecao, Titulo, Troca, pop} from './ui';

/** os tempos dos cortes são os mesmos com ou sem prévias (só o modo da cena das prévias muda) */
const CENAS = montaCenas(false);
const cena = (id: string) => CENAS.find((c) => c.id === id)!;
const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: x, top: y, ...extra});
const surge = (t: number, at: number, d = 0.22, dx = 0, dy = 18) => {
	const k = tw(t, at, at + d, 0, 1);
	return {opacity: k, transform: `translate(${(1 - k) * dx}px, ${(1 - k) * dy}px)`};
};

/** os modelos mostrados na vitrine (texto de tela do vídeo de origem) */
const MODELOS = ['modelodinamico01', 'modelopadrao01', 'modelodinamico03', 'pregacaodinamica01', 'profissional01', 'storypodcast01', 'superpodcast01', 'youtubeedition01'];

/** um quadro parado da própria fala (para miniaturas) */
const Quadro: React.FC<{seg: number; s: number; x?: number; y?: number}> = ({seg, s, x = 0, y = 0}) => (
	<Freeze frame={Math.round(seg * FPS)}>
		<Fala s={s} x={x} y={y} />
	</Freeze>
);

/* ---------------------------------------------------------------- M2: o gancho, o próprio Reel no celular + 100% + Claude (ref1 4,0 a 6,0) */
export const Gancho: React.FC = () => {
	const {t} = useT();
	// o primeiro quadro já mostra o celular (é a capa do Reel)
	const e = mola(t, -0.3, {damping: 16});
	const cem = w('100%');
	const n = Math.round(tw(t, cem, cem + 0.35, 90, 100, E.out));
	const sc = 1008 / 1920;
	return (
		<>
			<div style={ab(70, 200, {width: 500, height: 1040, borderRadius: 80, background: '#121212', padding: 16, boxShadow: SOMBRA, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 120}px)`})}>
				<TelaReels largura={468} altura={1008} raio={64} s={sc} />
			</div>
			{t >= cem && (
				<div style={ab(620, 600, {width: 400, height: 200, borderRadius: 30, background: C.branco, boxShadow: SOMBRA, display: 'flex', alignItems: 'center', justifyContent: 'center', ...pop(t, cem)})}>
					<span style={{fontFamily: SANS, fontWeight: 800, fontSize: 132, letterSpacing: '-0.05em', color: C.tinta}}>{n}%</span>
				</div>
			)}
			{t >= w('claude') && (
				<div style={ab(745, 860, pop(t, w('claude')))}>
					<ChipClaude size={150} />
				</div>
			)}
		</>
	);
};

/** a tela do Reels com o próprio vídeo tocando (interface desenhada, sem logo) */
const TelaReels: React.FC<{largura: number; altura: number; raio: number; s: number; children?: React.ReactNode}> = ({largura, altura, raio, s, children}) => {
	const {t} = useT();
	const {arroba, foto} = React.useContext(Previas);
	const k = largura / 468;
	return (
		<div style={{position: 'relative', width: largura, height: altura, borderRadius: raio, overflow: 'hidden', background: '#000'}}>
			<Fala s={s} x={largura / 2 - s * rostoX(t)} />
			<div style={ab(0, 0, {width: largura, height: 150 * k, background: 'linear-gradient(rgba(0,0,0,0.45), transparent)'})} />
			<div style={ab(0, altura - 188 * k, {width: largura, height: 188 * k, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))'})} />
			<div style={ab(largura / 2 - 65 * k, 14 * k, {width: 130 * k, height: 36 * k, borderRadius: 18 * k, background: '#000'})} />
			<div style={ab(44 * k, 20 * k, {color: C.branco, fontFamily: SANS, fontWeight: 600, fontSize: 22 * k})}>9:41</div>
			<div style={ab(0, 72 * k, {width: largura, textAlign: 'center', color: C.branco, fontFamily: SANS, fontWeight: 700, fontSize: 26 * k})}>
				Reels <span style={{opacity: 0.55, fontWeight: 600}}>Amigos</span>
			</div>
			{[0, 1, 2].map((i) => (
				<div key={i} style={ab(largura - 58 * k, altura * 0.555 + i * 86 * k, {width: 40 * k, height: 40 * k})}>
					{i === 0 ? (
						<svg viewBox="0 0 24 24" width={40 * k} height={40 * k}>
							<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF3040" />
						</svg>
					) : (
						<div style={{width: 34 * k, height: 34 * k, margin: 3 * k, borderRadius: i === 1 ? 17 * k : 4 * k, border: `${3.5 * k}px solid ${C.branco}`, boxSizing: 'border-box'}} />
					)}
				</div>
			))}
			<div style={ab(28 * k, altura - 108 * k, {display: 'flex', alignItems: 'center', gap: 12 * k})}>
				{foto && <Img src={staticFile(foto)} style={{width: 46 * k, height: 46 * k, borderRadius: 23 * k, objectFit: 'cover', border: '2px solid #fff'}} />}
				{arroba && <span style={{color: C.branco, fontFamily: SANS, fontWeight: 700, fontSize: 24 * k}}>{arroba}</span>}
				{arroba && <span style={{color: C.branco, fontFamily: SANS, fontWeight: 600, fontSize: 20 * k, border: '2px solid rgba(255,255,255,0.7)', borderRadius: 8 * k, padding: `${2 * k}px ${10 * k}px`}}>Seguir</span>}
			</div>
			{children}
		</div>
	);
};

/* ---------------------------------------------------------------- M3: dividido. Em cima o visual, embaixo o rosto */
/** largura do rosto (px) da gravação do vídeo aprovado: no dividido o rosto fica do mesmo tamanho que lá (26% a 28% da
 * altura do quadro) mesmo que a gravação nova tenha o rosto mais perto ou mais longe; no aprovado a escala dá 1 */
const LARGURA_APROVADO = 398.6;
const Dividido: React.FC<{children: React.ReactNode}> = ({children}) => (
	<>
		<div style={ab(0, 0, {width: 1080, height: DIVISA, overflow: 'hidden'})}>{children}</div>
		<div style={ab(0, 0, {width: 1080, height: 1920, clipPath: `inset(${DIVISA}px 0 0 0)`})}>
			<FalaEm s={LARGURA_APROVADO / R.largura} cx={540} oy={1170} />
		</div>
	</>
);

/** pasta e arquivo (ícones desenhados) */
const Pasta: React.FC<{cor?: string; cheia?: number}> = ({cor = C.destaque, cheia = 1}) => (
	<svg width={36} height={30} viewBox="0 0 36 30" style={{flex: 'none'}}>
		<path d="M2 5 Q2 2 5 2 L13 2 L16 6 L31 6 Q34 6 34 9 L34 25 Q34 28 31 28 L5 28 Q2 28 2 25 Z" fill={cor} fillOpacity={0.18 + 0.72 * cheia} stroke={cor} strokeWidth={2.5} />
	</svg>
);
const Arq: React.FC<{cor?: string}> = ({cor = '#9C958A'}) => (
	<svg width={36} height={30} viewBox="0 0 36 30" style={{flex: 'none'}}>
		<path d="M9 2 L22 2 L29 9 L29 28 L9 28 Z" fill="none" stroke={cor} strokeWidth={2.5} strokeLinejoin="round" />
		<path d="M22 2 L22 9 L29 9" fill="none" stroke={cor} strokeWidth={2.5} strokeLinejoin="round" />
	</svg>
);

/* ---------------------------------------------------------------- M3: "Ele foi criado justamente para te mostrar" */
export const Criado: React.FC = () => {
	const {t} = useT();
	const c = cena('criado');
	const linhas: {at: number; nivel: number; nome: string; pasta: boolean}[] = [
		{at: c.de + 0.2, nivel: 0, nome: '2026-10-10-vitrine/', pasta: true}, // texto de tela do vídeo de origem
		{at: w('criado'), nivel: 1, nome: 'base/fala.mp4', pasta: false},
		{at: w('justamente'), nivel: 1, nome: 'BRIEF.md', pasta: false},
		{at: w('para'), nivel: 1, nome: 'modelodinamico01/', pasta: true},
	];
	const sel = w('mostrar');
	return (
		<Dividido>
			<div style={ab(110, 90, {width: 860, height: 660, borderRadius: 26, background: C.branco, boxShadow: SOMBRA, border: '1px solid #E6E1D8', overflow: 'hidden', ...pop(t, c.de)})}>
				<div style={ab(0, 0, {width: 860, height: 70, borderBottom: '1px solid #EEE9E1', display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 28})}>
					{['#FF5F57', '#FEBC2E', '#28C840'].map((k) => (
						<div key={k} style={{width: 18, height: 18, borderRadius: 9, background: k}} />
					))}
					<div style={{flex: 1, textAlign: 'center', marginRight: 120, fontFamily: MONO, fontSize: 22, color: C.suave}}>Claude Code</div>
				</div>
				<div style={ab(760, 100, {transform: `rotate(${t * 140}deg)`})}>
					<Faisca size={60} cor={C.destaque} />
				</div>
				<div style={ab(48, 110, {fontFamily: MONO, fontSize: 26, color: C.suave})}>videos /</div>
				{linhas.map((l, i) =>
					t >= l.at - 0.02 ? (
						<div
							key={l.nome}
							style={ab(36 + l.nivel * 52, 180 + i * 92, {
								display: 'flex',
								alignItems: 'center',
								gap: 18,
								padding: '12px 18px',
								borderRadius: 12,
								fontFamily: MONO,
								fontWeight: 500,
								fontSize: 32,
								color: i === 3 && t >= sel ? C.branco : C.tinta,
								background: i === 3 && t >= sel ? C.selecao : 'transparent',
								...surge(t, l.at - 0.02, 0.2, -50, 0),
							})}
						>
							{l.pasta ? <Pasta cor={i === 3 && t >= sel ? C.branco : C.destaque} /> : <Arq />}
							{l.nome}
						</div>
					) : null
				)}
			</div>
		</Dividido>
	);
};

/* ---------------------------------------------------------------- M1: a diferença entre vários modelos / qualquer tipo de vídeo usando o Claude */
export const Modelos: React.FC = () => {
	const c = cena('modelos');
	const editar = w('editar') - 0.08;
	return (
		<>
			<Titulo serif="a diferença" sans="entre modelos" de={c.de} />
			<CardPalco de={c.de}>
				<Troca de={c.de} ate={editar} primeira>
					<ListaModelos />
				</Troca>
				<Troca de={editar} ate={c.ate}>
					<Tipos de={editar} />
				</Troca>
			</CardPalco>
			<RostoPalco />
		</>
	);
};

const ListaModelos: React.FC = () => {
	const {t} = useT();
	const varios = w('vários');
	const criei = w('criei');
	const melhorei = w('melhorei');
	const barra = tw(t, melhorei, melhorei + 0.5, 0, 1, (x) => x);
	return (
		<div style={ab(0, 0, {width: 966, height: 705, background: C.papel})}>
			<div style={ab(48, 36, {fontFamily: MONO, fontSize: 26, color: C.suave})}>estudio-2d / modelos /</div>
			{MODELOS.map((m, i) => {
				const at = Math.min(varios, cena('modelos').de + 0.12) + i * 0.08;
				const cheia = tw(t, criei + i * 0.05, criei + i * 0.05 + 0.15, 0, 1);
				const ok = barra * 8 > i + 0.5;
				return t >= at - 0.02 ? (
					<div key={m} style={ab(48, 96 + i * 72, {width: 870, height: 60, display: 'flex', alignItems: 'center', gap: 20, fontFamily: MONO, fontWeight: 500, fontSize: 32, color: C.tinta, ...surge(t, at - 0.02, 0.2, 40, 0)})}>
						<Pasta cheia={cheia} />
						{m}
						{ok && <div style={{marginLeft: 'auto', width: 40, height: 40, borderRadius: 20, background: C.verde, color: C.branco, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 24, ...pop(t, melhorei + (i + 0.5) / 16)}}>✓</div>}
					</div>
				) : null;
			})}
			{t >= melhorei && barra < 1 && <div style={ab(36, 92 + barra * 8 * 72 - 4, {width: 894, height: 68, borderRadius: 12, background: 'rgba(217,119,87,0.14)', border: `2px solid ${C.destaque}`})} />}
		</div>
	);
};

const Tipos: React.FC<{de: number}> = ({de}) => {
	const {t} = useT();
	const tiles = [
		{at: de + 0.02, x: 56, y: 60, w: 250, h: 444, rot: 'reel 9:16', s: 444 / 1920, oy: 444 * 0.32},
		{at: w('qualquer'), x: 346, y: 60, w: 564, h: 317, rot: 'youtube 16:9', s: 0.74, oy: 120},
		{at: w('tipo'), x: 346, y: 438, w: 270, h: 152, rot: 'podcast', s: 0.42, oy: 62},
		{at: w('vídeo', 2), x: 640, y: 438, w: 270, h: 152, rot: 'pregação', s: 0.42, oy: 62},
	];
	const claude = w('claude', 2);
	return (
		<div style={ab(0, 0, {width: 966, height: 705, background: C.escuro})}>
			{tiles.map((k, i) =>
				t >= k.at - 0.02 ? (
					<div key={k.rot} style={ab(k.x, k.y, {width: k.w, ...pop(t, k.at - 0.02)})}>
						<div style={{position: 'relative', width: k.w, height: k.h, borderRadius: 14, overflow: 'hidden', background: '#000', outline: t >= claude + i * 0.06 ? `4px solid ${C.destaque}` : '2px solid #3A3633'}}>
							<FalaEm s={k.s} cx={k.w / 2} oy={k.oy} />
						</div>
						<div style={{marginTop: 12, fontFamily: MONO, fontSize: 24, color: '#B9B2A7'}}>{k.rot}</div>
					</div>
				) : null
			)}
			{t >= claude && (
				<div style={ab(56, 560, pop(t, claude))}>
					<ChipClaude size={120} />
				</div>
			)}
		</div>
	);
};

/* ---------------------------------------------------------------- M2: "Inclusive, se você estiver no Instagram agora" (ref1 2,0 a 3,5) */
export const Instagram: React.FC = () => {
	const {t} = useT();
	const c = cena('instagram');
	const e = mola(t, c.de, {damping: 16});
	const toque = w('estiver');
	const insta = w('instagram');
	const agora = w('agora');
	const sc = 1118 / 1920;
	const anel = tw(t, toque, toque + 0.35, 0, 1);
	const kc = mola(t, agora, {damping: 9, stiffness: 220});
	const someCoracao = tw(t, agora + 0.55, agora + 0.75, 0, 1);
	const aba = mola(t, insta);
	return (
		<div style={ab(255, 150, {width: 570, height: 1170, borderRadius: 86, background: '#121212', padding: 16, boxShadow: SOMBRA, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 120}px)`})}>
			<TelaReels largura={538} altura={1138} raio={72} s={sc}>
				{t >= insta && <div style={ab(209, 112, {width: 70, height: 5, borderRadius: 3, background: C.branco, transform: `scaleX(${aba})`})} />}
				{t >= toque && anel < 1 && <div style={ab(269 - 60 * (1 + anel), 640 - 60 * (1 + anel), {width: 120 * (1 + anel), height: 120 * (1 + anel), borderRadius: '50%', border: '6px solid rgba(255,255,255,0.85)', opacity: 1 - anel})} />}
				{t >= agora && someCoracao < 1 && (
					<div style={ab(269 - 110, 470, {width: 220, height: 220, transform: `scale(${0.3 + 0.7 * kc}) rotate(${(1 - kc) * -18}deg)`, opacity: 1 - someCoracao})}>
						<svg viewBox="0 0 24 24" width={220} height={220} style={{filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))'}}>
							<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={C.branco} />
						</svg>
					</div>
				)}
			</TelaReels>
		</div>
	);
};

/* ---------------------------------------------------------------- M1: "você está vendo apenas um desses modelos" + o nome do modelo */
export const Nome: React.FC = () => {
	const {t} = useT();
	const c = cena('nome');
	const vendo = w('vendo');
	const um = w('um');
	const apaga = tw(t, um, um + 0.25, 1, 0.32);
	const cresce = mola(t, um, {damping: 16});
	const lados = [
		{x: -120, nome: 'superpodcast01', o: 0.5},
		{x: 92, nome: 'modelopadrao01', o: 1},
		{x: 694, nome: 'youtubeedition01', o: 1},
		{x: 906, nome: 'storypodcast01', o: 0.5},
	];
	return (
		<>
			<Titulo serif="modelodinamico01" de={c.de} />
			<CardPalco escuro de={c.de}>
				{lados.map((l, i) => {
					const at = vendo - 0.1 + i * 0.07;
					return t >= at ? (
						<div key={l.nome} style={ab(l.x, 150, {width: 180, ...surge(t, at, 0.22, 0, 30), opacity: l.o * apaga * tw(t, at, at + 0.22, 0, 1)})}>
							<div style={{width: 180, height: 320, borderRadius: 14, background: C.escuro2, border: '2px solid #34312E', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<div style={{width: 0, height: 0, borderTop: '20px solid transparent', borderBottom: '20px solid transparent', borderLeft: '32px solid #6E6862', marginLeft: 8}} />
							</div>
							<div style={{marginTop: 14, textAlign: 'center', fontFamily: MONO, fontSize: 19, color: '#8C877F'}}>{l.nome}</div>
						</div>
					) : null;
				})}
				<div style={ab(333, 70, {width: 300, height: 533, ...pop(t, c.de + 0.04)})}>
					<div style={{position: 'absolute', inset: 0, transform: `scale(${1 + 0.06 * cresce})`}}>
						<div style={{position: 'relative', width: 300, height: 533, borderRadius: 16, overflow: 'hidden', background: '#000'}}>
							<FalaEm s={533 / 1920} cx={150} oy={533 * 0.32} />
						</div>
						{t >= um && <Selecao o={tw(t, um, um + 0.12, 0, 1)} pad={12} />}
					</div>
				</div>
			</CardPalco>
			<RostoPalco />
		</>
	);
};

/* ---------------------------------------------------------------- as prévias: "duas prévias rápidas aqui em cima, aceleradas em três vezes" */
/** com previas=false a cena é o rosto cheio e nada das prévias aparece; com true é o dividido com as duas em cima */
export const PreviasCena: React.FC = () => {
	const {previas} = React.useContext(Previas);
	return previas ? <PreviasEmCima /> : <RostoCheio />;
};

const SLOT = {w: 360, h: 640, y: 120, x: [150, 570]};
const PreviasEmCima: React.FC = () => {
	const {t} = useT();
	const {nomesPrevias} = React.useContext(Previas);
	const c = cena('previas');
	const entra = [w('colocar'), w('colocar') + 0.22];
	const tres = w('aceleradas');
	const fim = c.ate;
	return (
		<Dividido>
			{SLOT.x.map((x, i) => {
				// o contorno desenhado no traço (ref3, ~8 quadros), depois o vídeo entra dentro
				const traco = tw(t, c.de + i * 0.08, c.de + i * 0.08 + 0.27, 0, 1);
				const v = tw(t, entra[i], entra[i] + 0.2, 0, 1);
				const de = Math.round(entra[i] * FPS);
				return (
					<div key={i} style={ab(x, SLOT.y, {width: SLOT.w, height: SLOT.h})}>
						<svg width={SLOT.w + 8} height={SLOT.h + 8} style={{position: 'absolute', left: -4, top: -4}}>
							<rect x={4} y={4} width={SLOT.w} height={SLOT.h} rx={22} fill="rgba(255,255,255,0.35)" stroke={C.tinta} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - traco} />
						</svg>
						{t >= entra[i] && (
							<div style={{position: 'absolute', inset: 0, borderRadius: 22, overflow: 'hidden', background: '#000', boxShadow: SOMBRA, opacity: v, transform: `scale(${0.92 + 0.08 * v})`}}>
								<Sequence from={de} durationInFrames={Math.max(1, Math.round(fim * FPS) - de)} layout="none">
									<OffthreadVideo muted src={staticFile(`previa${i + 1}.mp4`)} style={{width: SLOT.w, height: SLOT.h, objectFit: 'cover'}} />
								</Sequence>
							</div>
						)}
						{t >= entra[i] && (
							<div style={ab(-2, -54, {background: C.selecao, color: C.branco, fontFamily: MONO, fontWeight: 500, fontSize: 30, padding: '4px 12px', borderRadius: 6, whiteSpace: 'nowrap', ...pop(t, entra[i] + 0.05)})}>{nomesPrevias[i]}</div>
						)}
						{t >= tres + i * 0.08 && (
							<div style={ab(SLOT.w - 104, SLOT.h - 70, {width: 86, height: 52, borderRadius: 26, background: '#1F1F1F', color: C.branco, fontFamily: MONO, fontWeight: 600, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', ...pop(t, tres + i * 0.08)})}>3x</div>
						)}
					</div>
				);
			})}
		</Dividido>
	);
};

/* ---------------------------------------------------------------- M4: rosto cheio (frase de virada) */
export const RostoCheio: React.FC = () => <FalaEm s={1} cx={540} oy={616} fixo />;
/** a virada do "Mas": o mesmo rosto mais perto (punch-in no corte) */
export const RostoPerto: React.FC = () => <FalaEm s={1.2} cx={540} oy={640} />;

/* ---------------------------------------------------------------- M1: outros modelos de edição como esse / aprender a usar nos seus vídeos */
export const Outros: React.FC = () => {
	const c = cena('outros');
	const aprender = w('aprender');
	return (
		<>
			<Titulo serif="outros modelos" sans="de edição" de={c.de} ate={aprender - 0.3} />
			<Titulo serif="nos seus vídeos" de={aprender - 0.04} />
			<CardPalco de={c.de}>
				<Troca de={c.de} ate={aprender - 0.08} primeira>
					<Catalogo />
				</Troca>
				<Troca de={aprender - 0.08} ate={c.ate}>
					<PromptSkill de={aprender - 0.08} />
				</Troca>
			</CardPalco>
			<RostoPalco />
		</>
	);
};

const CATALOGO = [
	{nome: 'modelopadrao01', seg: 3.2},
	{nome: 'modelodinamico03', seg: 8.6},
	{nome: 'pregacaodinamica01', seg: 12.4},
	{nome: 'profissional01', seg: 17.0},
	{nome: 'modelodinamico01', seg: 21.8},
	{nome: 'youtubeedition01', seg: 25.4},
];
const Catalogo: React.FC = () => {
	const {t} = useT();
	const ver = w('ver');
	const como = w('como');
	const esse = w('esse', 2);
	const k = tw(t, como - 0.1, esse - 0.04, 0, 1, E.inOut);
	const alvo = {x: 340 + 140, y: 360 + 150};
	const cx = 900 + (alvo.x - 900) * k;
	const cy = 760 + (alvo.y - 760) * k;
	const clique = t > esse - 0.06 && t < esse + 0.1 ? 1 : 0;
	return (
		<div style={ab(0, 0, {width: 966, height: 705, background: C.papel})}>
			{CATALOGO.map((m, i) => {
				const x = 40 + (i % 3) * 300;
				const y = 40 + Math.floor(i / 3) * 320;
				const at = ver + i * 0.1;
				const este = m.nome === 'modelodinamico01' && t >= esse;
				return t >= at - 0.02 ? (
					<div key={m.nome} style={ab(x, y, {width: 286, ...pop(t, at - 0.02)})}>
						<div style={{position: 'relative', width: 286, height: 230, borderRadius: 14, overflow: 'hidden', background: '#000', outline: este ? `5px solid ${C.destaque}` : '1px solid #E2DCD1'}}>
							<div style={{position: 'absolute', inset: 0, filter: este ? 'none' : 'saturate(0.35) brightness(0.8)'}}>
								<Quadro seg={m.seg} s={0.3} x={143 - 0.3 * 550} y={115 - 0.3 * 616} />
							</div>
							<div style={ab(113, 85, {width: 60, height: 60, borderRadius: 30, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center'})}>
								<div style={{width: 0, height: 0, borderTop: '13px solid transparent', borderBottom: '13px solid transparent', borderLeft: '20px solid #fff', marginLeft: 5}} />
							</div>
						</div>
						<div style={{marginTop: 12, fontFamily: MONO, fontWeight: 500, fontSize: 22, color: este ? C.destaque : C.tinta}}>{m.nome}</div>
					</div>
				) : null;
			})}
			{t >= como - 0.1 && <Cursor x={cx} y={cy} clique={clique} />}
		</div>
	);
};

const PromptSkill: React.FC<{de: number}> = ({de}) => {
	const {t} = useT();
	const como = w('como', 2);
	const isso = w('isso');
	const videos = w('vídeos');
	const cmd = '/modelodinamico01';
	const n = Math.round(tw(t, como, como + 0.45, 0, cmd.length, (x) => x));
	const arq = tw(t, isso, isso + 0.3, 0, 1);
	const envia = t >= videos + 0.05;
	const clique = t > videos - 0.05 && t < videos + 0.1 ? 1 : 0;
	const kc = tw(t, isso + 0.3, videos - 0.05, 0, 1, E.inOut);
	const cursorVisivel = Math.floor(t * 2.2) % 2 === 0 || (t > como && t < como + 0.6);
	return (
		<div style={ab(0, 0, {width: 966, height: 705, background: C.papel})}>
			<div style={ab(0, 110, {width: 966, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22})}>
				<div style={{transform: `rotate(${envia ? (t - videos) * 200 : 0}deg)`}}>
					<Faisca size={84} cor={C.destaque} />
				</div>
				<span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 104, color: C.tinta, lineHeight: 1}}>Claude</span>
			</div>
			<div style={ab(40, 290, {width: 886, height: 330, borderRadius: 28, background: C.branco, border: `2.5px solid ${n > 0 ? C.destaque : '#E5E0D6'}`, boxShadow: SOMBRA})}>
				{arq > 0 && (
					<div style={ab(36 + (1 - arq) * 600, 32, {display: 'flex', alignItems: 'center', gap: 14, background: '#F3EFE8', borderRadius: 12, padding: '10px 18px', fontFamily: MONO, fontSize: 26, color: C.tinta, opacity: arq})}>
						<div style={{width: 44, height: 70, borderRadius: 8, overflow: 'hidden', background: '#000', position: 'relative'}}>
							<Quadro seg={24} s={70 / 1920} />
						</div>
						seu-video.mp4
					</div>
				)}
				<div style={ab(40, 150, {fontFamily: SANS, fontWeight: 500, fontSize: 52, letterSpacing: '-0.01em', whiteSpace: 'nowrap'})}>
					{n === 0 ? (
						<span style={{color: '#B0A99E'}}>Digite / para comandos</span>
					) : (
						<span style={{fontFamily: MONO, fontWeight: 500, fontSize: 46, color: C.selecao, background: 'rgba(59,130,246,0.12)', borderRadius: 8, padding: '2px 10px'}}>{cmd.slice(0, n)}</span>
					)}
					{n > 0 && !envia && cursorVisivel && <span style={{display: 'inline-block', width: 4, height: 54, background: C.tinta, marginLeft: 6, verticalAlign: '-8px'}} />}
				</div>
				<div style={ab(40, 250, {fontFamily: SANS, fontSize: 44, color: '#B0A99E'})}>+</div>
				<div style={ab(796, 240, {width: 62, height: 62, borderRadius: 31, background: envia ? C.verde : C.destaque, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${envia ? 0.9 + 0.1 * mola(t, videos + 0.05) : 1})`})}>
					{envia ? (
						<span style={{color: C.branco, fontFamily: SANS, fontWeight: 800, fontSize: 32}}>✓</span>
					) : (
						<svg width={30} height={30} viewBox="0 0 24 24">
							<path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					)}
				</div>
			</div>
			{t >= isso + 0.3 && t < videos + 0.5 && <Cursor x={600 + (836 - 600) * kc} y={660 + (560 - 660) * kc} clique={clique} o={1 - tw(t, videos + 0.3, videos + 0.5, 0, 1)} />}
		</div>
	);
};

/* ---------------------------------------------------------------- M2: o fechamento, comentário EDIÇÃO + a DM chegando (ref1 24 a 26; legenda em cima, card embaixo como na ref3) */
export const Comenta: React.FC = () => {
	const {t} = useT();
	const {arroba, foto} = React.useContext(Previas);
	const c = cena('comenta');
	const e = mola(t, c.de, {damping: 18});
	const edicao = w('edição', 2);
	const aqui = w('aqui', 2);
	const embaixo = w('embaixo');
	const dm = w('dm');
	const palavra = 'EDIÇÃO';
	const n = Math.round(tw(t, edicao, edicao + 0.42, 0, palavra.length, (x) => x));
	const publica = aqui + 0.06;
	const postado = t >= publica;
	const coracao = t >= embaixo + 0.15;
	const toque1 = c.de + 0.22;
	// o cursor: entra pelo canto, toca no campo, depois em Publicar
	const k1 = tw(t, c.de, toque1, 0, 1, E.inOut);
	const k2 = tw(t, edicao + 0.42, publica - 0.04, 0, 1, E.inOut);
	const cx = 1100 + (420 - 1100) * k1 + (905 - 420) * k2;
	const cy = 1900 + (1690 - 1900) * k1;
	const clique = Math.abs(t - toque1) < 0.07 || Math.abs(t - publica) < 0.07 ? 1 : 0;
	const que = w('que', 2);
	const banner = mola(t, que, {damping: 16});
	const bate = 1 + 0.04 * Math.max(0, 1 - Math.abs(t - dm - 0.08) / 0.12);
	const kp = mola(t, publica, {damping: 15});
	return (
		<>
			<div style={ab(40, 600, {width: 1000, height: 1400, borderRadius: '44px 44px 0 0', background: C.branco, boxShadow: SOMBRA, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 140}px)`})}>
				<div style={ab(460, 18, {width: 80, height: 8, borderRadius: 4, background: '#DADADA'})} />
				<div style={ab(0, 50, {width: 1000, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.tinta})}>Comentários</div>
				<div style={ab(0, 116, {width: 1000, borderTop: '1px solid #EDEDED'})} />
				{/* a legenda fixada do próprio post */}
				<div style={ab(44, 160, {display: 'flex', gap: 22, alignItems: 'flex-start'})}>
					{foto && <Img src={staticFile(foto)} style={{width: 80, height: 80, borderRadius: 40, objectFit: 'cover'}} />}
					<div style={{width: 780}}>
						{arroba && (
							<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.tinta}}>
								{arroba} <span style={{fontWeight: 500, color: '#8E8E8E', fontSize: 26}}>· Fixado</span>
							</div>
						)}
						<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 32, color: C.tinta, marginTop: 6, lineHeight: 1.3}}>Comenta EDIÇÃO que eu te mando na DM</div>
					</div>
				</div>
				{/* o comentário publicado */}
				{postado && (
					<div style={ab(44, 520, {width: 912, display: 'flex', gap: 22, alignItems: 'center', opacity: Math.min(1, kp * 1.6), transform: `translateY(${(1 - kp) * 40}px)`})}>
						<div style={{width: 80, height: 80, borderRadius: 40, background: '#DBDBDB', flex: 'none', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'}}>
							<div style={{width: 46, height: 46, borderRadius: 23, background: '#F5F5F5', marginBottom: -14}} />
						</div>
						<div>
							<div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: '#8E8E8E'}}>você · agora</div>
							<div style={{position: 'relative', display: 'inline-block', fontFamily: SANS, fontWeight: 800, fontSize: 96, letterSpacing: '-0.02em', color: C.tinta, lineHeight: 1.05, marginTop: 6, padding: '0 10px'}}>
								EDIÇÃO
								<Selecao o={tw(t, publica + 0.1, publica + 0.25, 0, 1)} pad={4} />
							</div>
						</div>
						<div style={{marginLeft: 'auto', transform: `scale(${coracao ? 0.8 + 0.2 * mola(t, embaixo + 0.15, {damping: 8}) + 0.0 : 1})`}}>
							<svg viewBox="0 0 24 24" width={56} height={56}>
								<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={coracao ? '#FF3040' : 'none'} stroke={coracao ? '#FF3040' : '#262626'} strokeWidth={1.8} />
							</svg>
						</div>
					</div>
				)}
			</div>
			{/* o campo de comentário, embaixo como no app */}
			<div style={ab(40, 1590, {width: 1000, height: 330, background: C.branco, borderTop: '1px solid #EDEDED', opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 140}px)`})}>
				<div style={ab(44, 52, {width: 80, height: 80, borderRadius: 40, background: '#DBDBDB'})} />
				<div style={ab(150, 36, {width: 806, height: 112, borderRadius: 56, border: `2.5px solid ${t >= toque1 && !postado ? C.tinta : '#DBDBDB'}`, display: 'flex', alignItems: 'center', paddingLeft: 36, boxSizing: 'border-box'})}>
					{n === 0 || postado ? (
						<span style={{fontFamily: SANS, fontWeight: 500, fontSize: 34, color: '#8E8E8E'}}>Adicione um comentário...</span>
					) : (
						<span style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.tinta, letterSpacing: '-0.01em'}}>{palavra.slice(0, n)}</span>
					)}
					{t >= toque1 && !postado && Math.floor(t * 4) % 2 === 0 && <span style={{display: 'inline-block', width: 4, height: 60, background: C.tinta, marginLeft: 6}} />}
					<span style={{marginLeft: 'auto', marginRight: 36, fontFamily: SANS, fontWeight: 700, fontSize: 34, color: n > 0 && !postado ? C.azul : '#B3DBFF'}}>Publicar</span>
				</div>
			</div>
			{/* a DM chegando */}
			{t >= que && (
				<div style={ab(40, 40 + (1 - banner) * -260, {width: 1000, height: 150, borderRadius: 34, background: 'rgba(255,255,255,0.97)', boxShadow: SOMBRA, display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px', boxSizing: 'border-box', transform: `scale(${bate})`})}>
					{foto && <Img src={staticFile(foto)} style={{width: 88, height: 88, borderRadius: 44, objectFit: 'cover'}} />}
					<div style={{flex: 1}}>
						{arroba && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.tinta}}>{arroba}</div>}
						<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, color: '#555'}}>nova mensagem</div>
					</div>
					<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, color: '#8E8E8E'}}>agora</div>
					{t >= dm && <div style={{width: 22, height: 22, borderRadius: 11, background: C.azul, ...pop(t, dm)}} />}
				</div>
			)}
			{t >= c.de && <Cursor x={cx} y={cy} clique={clique} o={1 - tw(t, publica + 0.3, publica + 0.5, 0, 1)} />}
		</>
	);
};

export const CENA_COMP: Record<string, React.FC> = {
	gancho: Gancho,
	criado: Criado,
	modelos: Modelos,
	instagram: Instagram,
	nome: Nome,
	previas: PreviasCena,
	mas: RostoPerto,
	outros: Outros,
	comenta: Comenta,
};
