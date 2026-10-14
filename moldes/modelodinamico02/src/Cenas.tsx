import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, DURACAO, E, MONO, P, SANS, SCRIPT, SERIF, limpa, mola, tempoDe, tw, useT, w} from './tema';

const PALAVRAS = P.palavras;

/* ------------------------------------------------------------------ tipos e montagem */
type Fonte = 'sans' | 'script' | 'serif';
type Efeito = 'corta' | 'sublinha' | 'moldura' | 'anel';
type Linha = {txt: string; tam: number; fonte?: Fonte; peso?: number; acento?: boolean; efeito?: Record<string, Efeito>};
type Spec = {id: string; fundo: 'E' | 'L'; topo: number; linhas: Linha[]; heroi?: React.FC<{c: Cena}>; alinha?: 'left' | 'center'; iris?: boolean; de?: () => number};
type Palavra = {txt: string; de: number; efeito?: Efeito};
type LinhaPronta = Linha & {palavras: Palavra[]};
export type Cena = Omit<Spec, 'linhas' | 'de'> & {linhas: LinhaPronta[]; de: number; ate: number};

const montar = (specs: Spec[]): Cena[] => {
	const prontas = specs.map((s) => {
		const linhas = s.linhas.map((l) => ({
			...l,
			palavras: l.txt.split(' ').map((tk) => ({txt: tk.replace(/^~/, ''), de: tempoDe(tk), efeito: l.efeito?.[tk]})),
		}));
		const primeira = linhas[0]?.palavras[0]?.de;
		return {...s, linhas, de: s.de ? s.de() : primeira - 0.06};
	});
	prontas[0].de = 0;
	return prontas.map((c, i) => ({...c, ate: i + 1 < prontas.length ? prontas[i + 1].de : DURACAO}));
};

const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: x, top: y, ...extra});
/** o perfil (props da composição) na assinatura do fecho; vazio esconde */
export const Perfil = React.createContext({arroba: '', foto: '', arquivo: ''});
/** os quadros reais que enchem a palavra "frame" (arquivos em public/; null = a palavra em cor sólida). Num vídeo novo:
 * ffmpeg -ss <segundo> -i base/fala.mp4 -frames:v 1 -q:v 3 public/quadros/f600.jpg (um quadro da sua gravação) */
const FRAME_FOTOS: [string | null, string | null] = ['quadros/f600.jpg', 'quadros/f602.jpg'];
const cores = (f: 'E' | 'L') => (f === 'E' ? {fg: C.creme, acento: C.laranja, sub: 'rgba(251,239,230,0.82)'} : {fg: C.tinta, acento: C.creme, sub: 'rgba(26,13,8,0.8)'});

/* ------------------------------------------------------------------ peças */
const Faisca: React.FC<{size: number; cor: string; giro?: number}> = ({size, cor, giro = 0}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${giro}deg)`}}>
		{Array.from({length: 12}, (_, i) => {
			const a = (i / 12) * Math.PI * 2;
			const r = i % 2 ? 34 : 45;
			return <line key={i} x1={Math.cos(a) * 8} y1={Math.sin(a) * 8} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={cor} strokeWidth={8} strokeLinecap="round" />;
		})}
	</svg>
);

/** palavra que entra desfocada e fica nítida em ~5 quadros (MODELO §3) */
const Pal: React.FC<{p: Palavra; cor: string; destaque: string; primeira: boolean}> = ({p, cor, destaque, primeira}) => {
	const {t} = useT();
	const k = tw(t, p.de - 0.04, p.de + 0.14, 0, 1);
	const e = p.efeito ? tw(t, p.de + 0.18, p.de + 0.45, 0, 1, E.inOut) : 0;
	const estilo: React.CSSProperties = {display: 'inline-block', position: 'relative', marginLeft: primeira ? 0 : '0.24em', opacity: k, filter: `blur(${(1 - k) * 18}px)`, transform: `translateX(${(1 - k) * 40}px)`};
	if (p.efeito === 'corta')
		return (
			<span style={estilo}>
				<span style={{visibility: 'hidden'}}>{p.txt}</span>
				<span style={{position: 'absolute', left: -14 * e, top: 0, clipPath: 'inset(0 0 52% 0)'}}>{p.txt}</span>
				<span style={{position: 'absolute', left: 14 * e, top: 0, clipPath: 'inset(48% 0 0 0)'}}>{p.txt}</span>
				<span style={{position: 'absolute', left: '-6%', top: '50%', width: `${112 * e}%`, height: 6, background: destaque, borderRadius: 3}} />
			</span>
		);
	return (
		<span style={estilo}>
			{p.txt}
			{p.efeito === 'sublinha' && <span style={{position: 'absolute', left: 0, bottom: '-0.04em', width: `${100 * e}%`, height: '0.09em', background: destaque, borderRadius: 8}} />}
			{p.efeito === 'moldura' && (
				<svg style={{position: 'absolute', left: '-6%', top: '2%', width: '112%', height: '100%', overflow: 'visible'}} viewBox="0 0 100 100" preserveAspectRatio="none">
					<rect x={0} y={0} width={100} height={100} rx={6} fill="none" stroke={destaque} strokeWidth={2.2} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e} style={{strokeWidth: 8}} />
				</svg>
			)}
			{p.efeito === 'anel' && (
				<svg style={{position: 'absolute', left: '-12%', top: '-18%', width: '124%', height: '136%', overflow: 'visible', filter: `drop-shadow(0 0 18px ${destaque})`}} viewBox="0 0 100 100" preserveAspectRatio="none">
					<ellipse cx={50} cy={50} rx={49} ry={47} fill="none" stroke={destaque} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e} style={{strokeWidth: 7}} vectorEffect="non-scaling-stroke" />
				</svg>
			)}
		</span>
	);
};

const Bloco: React.FC<{c: Cena}> = ({c}) => {
	const {fg, acento, sub} = cores(c.fundo);
	return (
		<div style={ab(80, c.topo, {width: 920, textAlign: c.alinha ?? 'center'})}>
			{c.linhas.map((l, i) => {
				const grande = l.tam >= 120;
				const fonte = l.fonte === 'script' ? SCRIPT : l.fonte === 'serif' ? SERIF : SANS;
				const cor = l.acento ? acento : grande ? fg : sub;
				const estilo: React.CSSProperties = {
					fontFamily: fonte,
					fontSize: l.tam,
					fontWeight: l.fonte ? 400 : l.peso ?? (grande ? 900 : 700),
					letterSpacing: l.fonte ? '0' : grande ? '-0.055em' : '-0.025em',
					lineHeight: l.fonte === 'script' ? 1.15 : grande ? 0.95 : 1.15,
					color: cor,
					whiteSpace: 'nowrap',
					position: 'relative',
					marginBottom: grande ? 14 : 0,
				};
				const conteudo = l.palavras.map((p, j) => <Pal key={j} p={p} cor={cor} destaque={c.fundo === 'E' ? C.laranja : C.creme} primeira={j === 0} />);
				return (
					<div key={i} style={estilo}>
						{l.fonte === 'script' && (
							<div style={{position: 'absolute', inset: 0, transform: 'scale(1.7)', filter: 'blur(16px)', opacity: 0.32, pointerEvents: 'none'}}>{conteudo}</div>
						)}
						<div style={{position: 'relative'}}>{conteudo}</div>
					</div>
				);
			})}
		</div>
	);
};

/* ------------------------------------------------------------------ heróis (o objeto que faz o que a frase diz)
 * Cada herói recebe a própria tela (c) e pinta com cores(c.fundo): a mesma cena funciona no fundo escuro e no laranja. */
/** início da palavra se ela é dita dentro desta tela; senão o começo da tela (o herói nunca nasce pronto) */
const naTela = (c: Cena, texto: string) => PALAVRAS.find((p) => limpa(p.texto) === limpa(texto) && p.de >= c.de - 0.01 && p.de < c.ate)?.de ?? c.de;

const Cem: React.FC<{c: Cena}> = ({c}) => {
	const {t} = useT();
	const {acento} = cores(c.fundo);
	const a = w('claude');
	const k = mola(t, a);
	return <div style={ab(390, 1180, {opacity: Math.min(1, k * 1.5), transform: `scale(${0.4 + 0.6 * k})`})}><Faisca size={300} cor={acento} giro={(t - a) * 25} /></div>;
};

const Arquivo: React.FC<{c: Cena}> = ({c}) => {
	const {t} = useT();
	const {fg, acento} = cores(c.fundo);
	const contra = c.fundo === 'E' ? C.tinta : C.creme;
	const {arquivo} = React.useContext(Perfil);
	const gravei = w('gravei');
	const mandei = w('mandei');
	const kf = mola(t, gravei);
	const ks = mola(t, mandei - 0.2);
	const viaja = tw(t, mandei + 0.1, mandei + 0.65, 0, 1, E.inOut);
	const feixe = tw(t, mandei - 0.05, mandei + 0.2, 0, 1) * (1 - tw(t, mandei + 0.6, mandei + 0.9, 0, 1));
	const chega = mola(t, mandei + 0.65, {damping: 9});
	const fx = 160 + viaja * 600;
	const fy = 1030 + viaja * 160;
	return (
		<>
			<svg style={ab(0, 0)} width={1080} height={1920}>
				<defs>
					<linearGradient id="feixe" x1="0" x2="1">
						<stop offset="0" stopColor={acento} stopOpacity={0.55} />
						<stop offset="1" stopColor={acento} stopOpacity={0.05} />
					</linearGradient>
				</defs>
				<polygon points="300,1120 300,1290 870,1215 870,1195" fill="url(#feixe)" opacity={feixe} />
			</svg>
			{t >= mandei - 0.2 && (
				<div style={ab(760, 1090, {width: 220, height: 220, borderRadius: 54, background: acento, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${(0.5 + 0.5 * ks) * (1 + 0.12 * Math.sin(chega * Math.PI))})`, opacity: Math.min(1, ks * 1.5), boxShadow: `0 0 80px rgba(224,89,42,0.55)`})}>
					<Faisca size={160} cor={fg} />
				</div>
			)}
			{t >= gravei && viaja < 1 && (
				<div style={ab(fx, fy, {width: 260, height: 330, borderRadius: '24px 70px 24px 24px', background: fg, transform: `scale(${(0.5 + 0.5 * kf) * (1 - 0.7 * viaja)})`, opacity: Math.min(1, kf * 1.5) * (1 - viaja * 0.6), display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 26, boxSizing: 'border-box'})}>
					<div style={{fontFamily: SANS, fontWeight: 900, fontSize: 74, color: contra, letterSpacing: '-0.05em'}}>.mp4</div>
					{arquivo && <div style={{fontFamily: MONO, fontSize: 19, color: C.cinza}}>{arquivo}</div>}
				</div>
			)}
		</>
	);
};

const Mira: React.FC<{c: Cena}> = ({c}) => {
	const {t} = useT();
	const {fg, acento} = cores(c.fundo);
	const k = tw(t, c.de, c.de + 0.3, 0, 1);
	const s = 60 * k;
	const canto = (x: number, y: number, r: number) => (
		<div style={ab(x, y, {width: s, height: s, borderTop: `8px solid ${acento}`, borderLeft: `8px solid ${acento}`, transform: `rotate(${r}deg)`, transformOrigin: '0 0'})} />
	);
	return (
		<>
			{canto(100, 640, 0)}
			{canto(980, 640, 90)}
			{canto(980, 1240, 180)}
			{canto(100, 1240, 270)}
			<div style={ab(140, 680, {display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 34, color: fg, opacity: k})}>
				<div style={{width: 24, height: 24, borderRadius: 12, background: '#FF3B30', opacity: Math.floor(t * 3) % 2 ? 1 : 0.25}} />
				REC
			</div>
		</>
	);
};

const Converge: React.FC<{c: Cena}> = ({c}) => {
	const {t} = useT();
	const {fg, acento} = cores(c.fundo);
	const d = naTela(c, 'decidiu');
	const ed = naTela(c, 'editou');
	const k = tw(t, d - 0.1, d + 0.35, 0, 1);
	const pulso = 1 + 0.15 * Math.max(0, 1 - Math.abs(t - ed - 0.1) / 0.2);
	return (
		<>
			{Array.from({length: 12}, (_, i) => {
				const a = (i / 12) * Math.PI * 2;
				const r = 470 - 150 * k;
				const x = 540 + Math.cos(a) * r;
				const y = 1330 + Math.sin(a) * r;
				return (
					<div key={i} style={ab(x - 50, y - 6, {width: 100, height: 12, opacity: k, transform: `rotate(${(a * 180) / Math.PI + 180}deg)`})}>
						<div style={{width: 80, height: 10, background: fg, borderRadius: 5}} />
						<div style={{position: 'absolute', right: 0, top: -12, width: 0, height: 0, borderTop: '17px solid transparent', borderBottom: '17px solid transparent', borderLeft: `28px solid ${fg}`}} />
					</div>
				);
			})}
			<div style={ab(420, 1210, {transform: `scale(${pulso})`})}>
				<Faisca size={240} cor={acento} giro={t * 20} />
			</div>
		</>
	);
};

const Prompt: React.FC = () => {
	const {t} = useT();
	const c = CENAS.find((x) => x.id === 'prompt')!;
	const k = mola(t, c.de, {damping: 18});
	const ini = w('edita');
	const fim = w('mim');
	const P2 = PALAVRAS.filter((p) => p.de >= ini - 0.01 && p.de <= fim + 0.01);
	const texto = P2.map((p) => (t < p.de ? '' : p.texto.replace(/[.,]$/, '').slice(0, Math.ceil(p.texto.length * tw(t, p.de, p.de + 0.3, 0, 1, (x) => x))))).filter(Boolean).join(' ');
	return (
		<div style={ab(80, 620, {width: 920, height: 380, borderRadius: 40, background: C.tinta, boxShadow: '0 40px 80px rgba(60,20,5,0.35)', opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 80}px) scale(${1 + (t - c.de) * 0.015})`})}>
			<div style={ab(50, 44, {display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 30, color: C.cinza})}>
				<Faisca size={40} cor={C.laranja} />
				Claude
			</div>
			<div style={ab(50, 130, {width: 820, fontFamily: SANS, fontWeight: 700, fontSize: 70, lineHeight: 1.1, color: C.creme, letterSpacing: '-0.03em'})}>
				{texto}
				<span style={{display: 'inline-block', width: 6, height: 70, background: C.laranja, marginLeft: 6, verticalAlign: '-10px', opacity: Math.floor(t * 2.5) % 2 ? 1 : 0.2}} />
			</div>
		</div>
	);
};

const Pastas: React.FC = () => {
	const {t} = useT();
	const m = w('método');
	return (
		<>
			{Array.from({length: 9}, (_, i) => {
				const k = mola(t, m + i * 0.11);
				const y = 1560 - i * 78;
				const cor = i % 2 ? '#3B1D10' : C.tinta;
				return (
					<div key={i} style={ab(300, y, {width: 480, height: 240, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 120}px)`, zIndex: 20 - i})}>
						<div style={ab(0, -34, {width: 190, height: 56, borderRadius: '18px 18px 0 0', background: cor})} />
						<div style={ab(0, 0, {width: 480, height: 240, borderRadius: '0 24px 24px 24px', background: cor, boxShadow: '0 -8px 24px rgba(0,0,0,0.3)'})} />
						<div style={ab(28, -30, {fontFamily: SANS, fontWeight: 900, fontSize: 48, color: C.creme, lineHeight: 1})}>{i + 1}</div>
					</div>
				);
			}).reverse()}
		</>
	);
};

const Cento: React.FC = () => {
	const {t} = useT();
	const a = w('analisando');
	const n160 = w('160');
	const n = Math.floor(tw(t, a, n160, 0, 160, (x) => x));
	const chegou = t >= n160;
	const k = mola(t, n160, {damping: 10});
	return (
		<>
			<div style={ab(0, 400, {width: 1080, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 400, letterSpacing: '-0.07em', lineHeight: 1, color: C.laranja, transform: `scale(${chegou ? 1 + 0.08 * (1 - k) : 0.92})`})}>
				{n}
				{chegou && <span style={{fontFamily: SERIF, fontWeight: 400, color: C.creme}}>+</span>}
			</div>
			<div style={ab(0, 820, {width: 1080, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 110, letterSpacing: '-0.04em', color: C.creme, opacity: tw(t, w('vídeos') - 0.04, w('vídeos') + 0.14, 0, 1), filter: `blur(${(1 - tw(t, w('vídeos') - 0.04, w('vídeos') + 0.14, 0, 1)) * 16}px)`})}>vídeos</div>
			{Array.from({length: 160}, (_, i) => (
				<div key={i} style={ab(80 + (i % 16) * 57.5, 1080 + Math.floor(i / 16) * 56, {width: 50, height: 48, borderRadius: 8, background: i < n ? (i === n - 1 ? C.laranja : 'rgba(251,239,230,0.85)') : 'rgba(251,239,230,0.08)'})} />
			))}
		</>
	);
};

const Frame: React.FC = () => {
	const {t} = useT();
	const marcas = [w('frame'), w('por', 1), w('frame', 2)];
	const palavra = (texto: string, foto: string | null, y: number, at: number, tam: number) => {
		const k = tw(t, at - 0.04, at + 0.14, 0, 1);
		return (
			<div
				style={ab(0, y, {
					width: 1080,
					textAlign: 'center',
					fontFamily: SANS,
					fontWeight: 900,
					fontSize: tam,
					letterSpacing: '-0.06em',
					lineHeight: 1,
					opacity: k,
					filter: `blur(${(1 - k) * 18}px)`,
					transform: `scale(${1 + (t - at) * 0.03})`,
					...(foto
						? {backgroundImage: `url(${staticFile(foto)})`, backgroundSize: 'cover', backgroundPosition: 'center 30%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextStroke: `3px ${C.tinta}`}
						: {color: C.tinta}),
				})}
			>
				{texto}
			</div>
		);
	};
	return (
		<>
			{palavra('frame', FRAME_FOTOS[0], 360, marcas[0], 340)}
			{palavra('por', null, 760, marcas[1], 150)}
			{palavra('frame', FRAME_FOTOS[1], 960, marcas[2], 340)}
			{marcas.map((m, i) =>
				t >= m ? (
					<div key={i} style={ab(0, [720, 920, 1320][i], {width: 1080, textAlign: 'center', fontFamily: MONO, fontSize: 32, color: C.tinta, opacity: i === 1 ? 0 : 0.75})}>
						quadro {String(600 + i).padStart(4, '0')}
					</div>
				) : null
			)}
		</>
	);
};

const TOPICOS = ['retenção', 'legenda', 'movimento', 'transições', 'som', 'ritmo'];
const Orbita: React.FC = () => {
	const {t} = useT();
	const d = w('desenvolvemos', 2);
	const arco = tw(t, d - 0.3, d + 0.6, 0, 1);
	const cx = 540;
	const cy = 1520;
	const r = 290;
	return (
		<>
			<svg style={ab(0, 0)} width={1080} height={1920}>
				<path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="rgba(251,239,230,0.35)" strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arco} />
			</svg>
			<div style={ab(cx - 90, cy - 90)}>
				<Faisca size={180} cor={C.laranja} giro={t * 18} />
			</div>
			{TOPICOS.map((tp, i) => {
				const a = Math.PI + (i / (TOPICOS.length - 1)) * Math.PI;
				const x = cx + Math.cos(a) * r;
				const y = cy + Math.sin(a) * r;
				const k = mola(t, d + i * 0.22);
				const esquerda = Math.cos(a) < -0.1;
				const direita = Math.cos(a) > 0.1;
				return (
					<div key={tp} style={{opacity: Math.min(1, k * 1.5)}}>
						<div style={ab(x - 14, y - 14, {width: 28, height: 28, borderRadius: 14, background: C.laranja, transform: `scale(${k})`})} />
						<div style={ab(x + Math.cos(a) * 95 - 150, y + Math.sin(a) * 60 - 22, {width: 300, textAlign: 'center', fontFamily: MONO, fontSize: 32, color: C.creme})}>{tp}</div>
					</div>
				);
			})}
		</>
	);
};

const REGRAS = ['corte sem respiração', 'legenda no tempo da fala', 'a tela encena a frase', 'nada cobre o rosto', 'número como foi dito', 'corte seco entre modos'];
const POS: [number, number, boolean][] = [
	[70, 740, false],
	[1010, 900, true],
	[70, 1060, false],
	[1010, 1380, true],
	[70, 1530, false],
	[1010, 1680, true],
];
const Fichas: React.FC = () => {
	const {t} = useT();
	const r = w('regras');
	const cl = w('claude', 3);
	const ks = mola(t, cl, {damping: 11});
	const cx = 540;
	const cy = 1240;
	return (
		<>
			<svg style={ab(0, 0)} width={1080} height={1920}>
				{POS.map(([x, y, dir], i) => {
					const ax = dir ? x - 200 : x + 200;
					const k = tw(t, cl + 0.1 + i * 0.05, cl + 0.5 + i * 0.05, 0, 1);
					return <line key={i} x1={cx} y1={cy} x2={cx + (ax - cx) * k} y2={cy + (y + 40 - cy) * k} stroke={C.tinta} strokeWidth={4} strokeDasharray="12 12" opacity={0.6} />;
				})}
			</svg>
			{REGRAS.map((g, i) => {
				const [x, y, dir] = POS[i];
				const k = mola(t, r + 0.15 + i * 0.2);
				return (
					<div key={g} style={{position: 'absolute', top: y, ...(dir ? {right: 1080 - x} : {left: x}), padding: '18px 28px', borderRadius: 20, background: C.creme, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.tinta, letterSpacing: '-0.02em', boxShadow: '0 16px 30px rgba(60,20,5,0.22)', opacity: Math.min(1, k * 1.5), transform: `scale(${0.6 + 0.4 * k})`, whiteSpace: 'nowrap'}}>
						{g}
					</div>
				);
			})}
			{t >= cl && (
				<div style={ab(cx - 95, cy - 95, {width: 190, height: 190, borderRadius: 48, background: C.tinta, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.4 + 0.6 * ks})`, opacity: Math.min(1, ks * 2)})}>
					<Faisca size={130} cor={C.laranja} />
				</div>
			)}
		</>
	);
};

const Guias: React.FC = () => {
	const {t} = useT();
	const c = CENAS.find((x) => x.id === 'aplicadas')!;
	const k = mola(t, c.de, {damping: 18});
	const g = [w('algumas'), w('dessas'), w('regras', 2)].map((a) => tw(t, a, a + 0.35, 0, 1));
	const X = 340;
	const Y = 900;
	return (
		<div style={{opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 80}px)`}}>
			<div style={ab(X, Y, {width: 400, height: 711, borderRadius: 48, border: '6px solid rgba(251,239,230,0.85)'})} />
			<div style={ab(X, Y + 250, {width: 400 * g[0], borderTop: `6px dashed ${C.laranja}`})} />
			{g[1] > 0 && <div style={ab(X + 40, Y + 450, {width: 320, height: 110, border: `6px dashed ${C.laranja}`, borderRadius: 14, opacity: g[1]})} />}
			{g[2] > 0 && <div style={ab(X + 24, Y + 24, {width: 340, height: 651, border: '4px dashed rgba(251,239,230,0.6)', borderRadius: 32, opacity: g[2]})} />}
		</div>
	);
};

const Carimbo: React.FC = () => {
	const {t} = useT();
	const a = w('teste') + 0.15;
	const k = mola(t, a, {damping: 12, stiffness: 260});
	if (t < a) return null;
	return (
		<div style={ab(140, 1050, {width: 800, textAlign: 'center', transform: `rotate(-8deg) scale(${2.2 - 1.2 * k})`, opacity: Math.min(1, k * 2)})}>
			<span style={{display: 'inline-block', border: `12px solid ${C.laranja}`, borderRadius: 24, padding: '10px 40px', fontFamily: SANS, fontWeight: 900, fontSize: 150, letterSpacing: '-0.04em', color: C.laranja}}>TESTE #01</span>
		</div>
	);
};

const Um: React.FC = () => {
	const {t} = useT();
	const a = w('primeiro');
	const k = tw(t, a - 0.2, a + 0.4, 0, 1);
	return (
		<div style={ab(0, 940, {width: 1080, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 780, lineHeight: 1, letterSpacing: '-0.08em', color: 'transparent', WebkitTextStroke: `5px ${C.creme}`, opacity: 0.75 * k, transform: `scale(${0.9 + 0.1 * k + (t - a) * 0.02})`})}>01</div>
	);
};

const Barra: React.FC = () => {
	const {t} = useT();
	const p = tw(t, w('sendo'), w('método', 3), 0, 1, (x) => x);
	const H = 900;
	const Y = 760;
	return (
		<>
			<div style={ab(400, Y, {width: 280, height: H, borderRadius: 18, background: 'linear-gradient(#2E1A12, #1E110C)'})} />
			<div style={ab(400, Y + H * (1 - p), {width: 280, height: H * p, borderRadius: 18, background: `linear-gradient(${C.acento}, ${C.laranja})`, boxShadow: `0 0 60px rgba(224,89,42,${0.5 * p})`})} />
			<div style={ab(710, Y, {width: 26, height: H, borderTop: '4px solid rgba(251,239,230,0.6)', borderBottom: '4px solid rgba(251,239,230,0.6)', borderRight: '4px solid rgba(251,239,230,0.6)'})} />
			<div style={ab(760, Y + H * (1 - p) - 30, {fontFamily: MONO, fontSize: 60, color: C.creme})}>{Math.round(p * 100)}%</div>
		</>
	);
};

const Dial: React.FC = () => {
	const {t} = useT();
	const c = w('calibrando');
	const k = mola(t, CENAS.find((x) => x.id === 'calibrando')!.de, {damping: 18});
	const ang = -70 + 110 * tw(t, c, c + 0.4, 0, 1, E.inOut) - 60 * tw(t, c + 0.45, c + 0.8, 0, 1, E.inOut) + 35 * tw(t, c + 0.85, c + 1.2, 0, 1, E.inOut);
	const cx = 540;
	const cy = 1340;
	return (
		<div style={{opacity: Math.min(1, k * 1.5), transform: `scale(${0.8 + 0.2 * k})`, transformOrigin: `${cx}px ${cy}px`, position: 'absolute', inset: 0}}>
			<div style={ab(cx - 270, cy - 270, {width: 540, height: 540, borderRadius: 270, border: `8px solid ${C.tinta}`})} />
			{Array.from({length: 31}, (_, i) => {
				const a = -150 + i * 10;
				return <div key={i} style={ab(cx - 3, cy - 250, {width: 6, height: i % 5 ? 22 : 44, background: C.tinta, transformOrigin: '3px 250px', transform: `rotate(${a}deg)`, opacity: 0.85})} />;
			})}
			<div style={ab(cx - 7, cy - 200, {width: 14, height: 210, borderRadius: 7, background: C.creme, transformOrigin: '7px 200px', transform: `rotate(${ang}deg)`})} />
			<div style={ab(cx - 40, cy - 40, {width: 80, height: 80, borderRadius: 40, background: C.tinta})} />
		</div>
	);
};

const Assinatura: React.FC = () => {
	const {t} = useT();
	const {arroba, foto} = React.useContext(Perfil);
	const c = CENAS.find((x) => x.id === 'segue')!;
	const k = mola(t, c.de + 0.2, {damping: 16});
	const s = w('segue');
	const aqui = w('aqui', 3);
	const kh = tw(t, s - 0.04, s + 0.14, 0, 1);
	const anel = tw(t, aqui, aqui + 0.45, 0, 1, E.inOut);
	return (
		<>
			{foto && (
				<div style={ab(370, 1000, {width: 340, height: 340, borderRadius: 170, padding: 10, boxSizing: 'border-box', background: `conic-gradient(${C.laranja}, #FEDA75, ${C.laranja})`, opacity: Math.min(1, k * 1.5), transform: `scale(${0.6 + 0.4 * k})`})}>
					<Img src={staticFile(foto)} style={{width: 320, height: 320, borderRadius: 160, objectFit: 'cover', border: `8px solid ${C.escuro}`, boxSizing: 'border-box'}} />
				</div>
			)}
			{arroba && (
			<div style={ab(0, 1400, {width: 1080, textAlign: 'center', fontFamily: MONO, fontSize: 64, color: C.creme, opacity: kh, filter: `blur(${(1 - kh) * 16}px)`})}>
				<span style={{position: 'relative', display: 'inline-block', padding: '0 20px'}}>
					@{arroba}
					<svg style={{position: 'absolute', left: '-6%', top: '-40%', width: '112%', height: '180%', overflow: 'visible', filter: `drop-shadow(0 0 16px ${C.laranja})`}} viewBox="0 0 100 100" preserveAspectRatio="none">
						<ellipse cx={50} cy={50} rx={49} ry={46} fill="none" stroke={C.laranja} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - anel} style={{strokeWidth: 6}} vectorEffect="non-scaling-stroke" />
					</svg>
				</span>
			</div>
			)}
		</>
	);
};

/* ------------------------------------------------------------------ o roteiro de telas (ideia nova a cada 1,5 a 2,5 s, fundo alternando) */
export const CENAS: Cena[] = montar([
	{id: 'editado', fundo: 'E', topo: 720, linhas: [{txt: 'Esse vídeo foi', tam: 84}, {txt: 'editado', tam: 250, acento: true}]},
	{id: 'cem', fundo: 'L', topo: 300, linhas: [{txt: '100%', tam: 330}, {txt: 'pelo', tam: 84}, {txt: 'Claude Code', tam: 170, fonte: 'script'}], heroi: Cem},
	{id: 'arquivo', fundo: 'E', topo: 280, linhas: [{txt: 'Eu só gravei', tam: 90}, {txt: 'e mandei o', tam: 90}, {txt: 'arquivo', tam: 230, acento: true}], heroi: Arquivo},
	{
		id: 'cada',
		fundo: 'L',
		topo: 400,
		alinha: 'left',
		linhas: [
			{txt: 'Cada', tam: 84},
			{txt: 'corte,', tam: 200, efeito: {'corte,': 'corta'}},
			{txt: 'cada', tam: 84},
			{txt: 'legenda,', tam: 190, efeito: {'legenda,': 'sublinha'}},
			{txt: 'cada', tam: 84},
			{txt: 'tela', tam: 200, efeito: {tela: 'moldura'}},
		],
	},
	{id: 'vendo', fundo: 'E', topo: 800, linhas: [{txt: 'que você está', tam: 90}, {txt: 'vendo aqui', tam: 160, acento: true}], heroi: Mira},
	{id: 'decidiu', fundo: 'L', topo: 280, linhas: [{txt: 'foi ele que', tam: 90}, {txt: 'decidiu', tam: 220}, {txt: 'e editou.', tam: 170, fonte: 'script', acento: true}], heroi: Converge},
	{id: 'simplesmente', fundo: 'E', topo: 760, linhas: [{txt: 'Mas não foi', tam: 90}, {txt: 'simplesmente', tam: 170, fonte: 'script', acento: true}]},
	{id: 'prompt', fundo: 'L', topo: 380, linhas: [{txt: 'chegar ao Claude e', tam: 90}], heroi: Prompt},
	{id: 'verdade', fundo: 'E', topo: 800, linhas: [{txt: 'Na', tam: 90}, {txt: 'verdade,', tam: 200, acento: true}]},
	{id: 'metodo', fundo: 'L', topo: 260, iris: true, linhas: [{txt: 'ele está usando o', tam: 84}, {txt: 'método', tam: 260, fonte: 'serif'}, {txt: 'que nós desenvolvemos', tam: 84}], heroi: Pastas},
	{id: 'cento', fundo: 'E', topo: 230, linhas: [{txt: 'analisando mais de', tam: 84}], heroi: Cento},
	{id: 'frame', fundo: 'L', topo: 0, linhas: [], heroi: Frame, de: () => w('frame') - 0.06},
	{id: 'atraves', fundo: 'E', topo: 240, linhas: [{txt: 'E através disso,', tam: 76}, {txt: 'nós desenvolvemos esse', tam: 76}, {txt: 'método', tam: 230, fonte: 'serif', acento: true}], heroi: Orbita},
	{id: 'regras', fundo: 'L', topo: 230, linhas: [{txt: 'muitas', tam: 90}, {txt: 'regras', tam: 260}], heroi: Fichas},
	{id: 'aplicadas', fundo: 'E', topo: 220, linhas: [{txt: 'E aqui você está vendo apenas', tam: 56}, {txt: 'algumas dessas regras', tam: 80}, {txt: 'aplicadas', tam: 180, acento: true, efeito: {aplicadas: 'anel'}}], heroi: Guias},
	{id: 'mais', fundo: 'L', topo: 700, linhas: [{txt: 'E te falo', tam: 90}, {txt: 'mais', tam: 320}]},
	{id: 'teste', fundo: 'E', topo: 400, linhas: [{txt: 'o que você está vendo é apenas', tam: 62}, {txt: 'um teste', tam: 200, acento: true}], heroi: Carimbo},
	{id: 'primeiro', fundo: 'L', topo: 300, iris: true, linhas: [{txt: 'do', tam: 90}, {txt: 'primeiro', tam: 190}, {txt: 'vídeo', tam: 220, fonte: 'script'}], heroi: Um},
	{id: 'desenvolvimento', fundo: 'E', topo: 220, linhas: [{txt: 'sendo editado após todo o', tam: 70}, {txt: 'desenvolvimento', tam: 112, acento: true}, {txt: 'desse método', tam: 110, fonte: 'serif'}], heroi: Barra},
	{id: 'calibrando', fundo: 'L', topo: 260, linhas: [{txt: 'Ou seja, eu ainda estou', tam: 76}, {txt: 'calibrando', tam: 200, fonte: 'script'}, {txt: 'isso daqui.', tam: 90}], heroi: Dial},
	{id: 'segue', fundo: 'E', topo: 230, linhas: [{txt: 'Mas se você quer', tam: 64}, {txt: 'saber mais sobre isso,', tam: 64}, {txt: 'já me segue', tam: 150, acento: true}, {txt: 'aqui.', tam: 150, fonte: 'script'}], heroi: Assinatura},
]);

export const cenaEm = (t: number) => CENAS.find((c) => t >= c.de && t < c.ate) ?? CENAS[CENAS.length - 1];

/** uma tela: fundo + câmera que nunca para (aproxima 1,5% por segundo) + bloco de texto + herói */
export const Tela: React.FC<{c: Cena}> = ({c}) => {
	const {t} = useT();
	const z = 1 + Math.max(0, t - c.de) * 0.015;
	const fundo =
		c.fundo === 'E'
			? {background: `radial-gradient(ellipse 90% 60% at 50% 35%, #3A1A0E 0%, ${C.escuro} 70%)`}
			: {background: `radial-gradient(ellipse 90% 70% at 50% 30%, #F0743F 0%, ${C.laranja} 60%, #C9481C 100%)`};
	const H = c.heroi;
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...fundo}}>
			<div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '540px 960px'}}>
				{H && <H c={c} />}
				<Bloco c={c} />
			</div>
		</div>
	);
};
