import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {C, DISPLAY, E, MONO, P, SOMBRA, T, fundoClaro, mola, presenca, tw, usePrevias, useT} from './tema';
import {CEL, CEL_H} from './Rosto';
import {Titulo, paginasDe} from './Editor';
import {Bolinha, Coluna, Etiqueta, Faisca, Painel} from './ui';

export const MODELO = 'modelopadrao01';
const NOMES = ['modelodinamico01', 'modelopadrao01', 'modelodinamico03', 'pregacaodinamica01', 'profissional01', 'storypodcast01', 'superpodcast01', 'youtubeedition01'];

/**
 * "a diferença entre vários modelos que eu criei e melhorei para editar qualquer tipo de vídeo usando o Claude"
 * (tela dividida, entra direto do editor): os cartões dos modelos entram um a um até "modelos", ganham o ✓ em
 * "criei", a barra enche em "melhorei"; em "editar" eles saem e o mesmo vídeo aparece em três formatos
 * ("qualquer / tipo / vídeo"); em "usando o Claude" tudo entra no Claude (o mesmo gesto das regras do v4).
 */
export const Modelos: React.FC = () => {
	const {t} = useT();
	const S = T.modelos;
	if (!S) return null;
	const passo = (S.modelos - S.de - 0.12) / (NOMES.length - 1);
	const saiCartoes = tw(t, S.editar, S.editar + 0.35, 0, 1, E.inOut);
	const usando = S.formatos[2] + 0.18;
	const junta = tw(t, usando, usando + 0.5, 0, 1, E.inOut);
	const chip = mola(t, S.claude, {damping: 11, stiffness: 240});
	const FORMATOS = [
		{w: 214, h: 380, x: 96},
		{w: 360, h: 203, x: 340},
		{w: 260, h: 260, x: 730},
	];
	return (
		<Painel de={S.de} ate={S.sai} funde>
			{saiCartoes < 1
				? NOMES.map((nome, k) => {
						const p = mola(t, S.de + 0.12 + k * passo, {damping: 13, stiffness: 220, mass: 0.7});
						const col = k % 2, lin = Math.floor(k / 2);
						const gx = 100 + col * 450, gy = 250 + lin * 132;
						const x = gx + (340 - gx) * saiCartoes, y = gy + (460 - gy) * saiCartoes;
						const ok = mola(t, S.criei + k * 0.05, {damping: 10, stiffness: 300, mass: 0.6});
						const barra = tw(t, S.melhorei + k * 0.05, S.melhorei + 0.45 + k * 0.05, 0, 1, E.inOut);
						return (
							<div key={nome} style={{position: 'absolute', left: x, top: y, width: 425, height: 108, borderRadius: 26, background: C.papel, boxShadow: SOMBRA, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', opacity: Math.min(1, p * 2) * (1 - saiCartoes), transform: `scale(${(0.4 + 0.6 * p) * (1 - 0.5 * saiCartoes)}) rotate(${(1 - p) * (k % 2 ? 10 : -10)}deg)`}}>
								{ok > 0 ? (
									<div style={{transform: `scale(${ok})`}}>
										<Bolinha size={44} />
									</div>
								) : (
									<div style={{width: 44, height: 44, flex: 'none', borderRadius: 22, border: `3px solid ${C.grade}`}} />
								)}
								<div style={{flex: 1}}>
									<div style={{fontFamily: MONO, fontSize: 29, fontWeight: 600, color: C.tinta, letterSpacing: '-0.02em'}}>{nome}</div>
									<div style={{marginTop: 10, height: 8, borderRadius: 4, background: C.grade, overflow: 'hidden'}}>
										<div style={{width: `${barra * 100}%`, height: 8, borderRadius: 4, background: C.verde}} />
									</div>
								</div>
							</div>
						);
					})
				: null}
			{FORMATOS.map((fm, k) => {
				const p = mola(t, S.formatos[k], {damping: 13, stiffness: 200});
				if (p <= 0) return null;
				const cx = fm.x + fm.w / 2, cy = 520;
				const x = fm.x + (540 - cx) * junta, y = cy - fm.h / 2;
				return (
					<div key={k} style={{position: 'absolute', left: x, top: y, width: fm.w, height: fm.h, borderRadius: 24, overflow: 'hidden', border: `9px solid ${C.papel}`, boxShadow: SOMBRA, opacity: Math.min(1, p * 2) * (1 - junta), transform: `translateY(${(1 - p) * 60}px) scale(${(0.7 + 0.3 * p) * (1 - 0.6 * junta)})`}}>
						<Img src={staticFile('quadro.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', display: 'block'}} />
					</div>
				);
			})}
			{chip > 0 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16, background: C.papel, borderRadius: 60, padding: '22px 40px', boxShadow: `0 0 0 ${10 * (1 - chip)}px rgba(217,119,87,0.25), ${SOMBRA}`, fontFamily: DISPLAY, fontWeight: 800, fontSize: 60, color: C.tinta, transform: `scale(${0.6 + 0.4 * chip})`}}>
						<Faisca size={60} />
						Claude
					</div>
				</div>
			) : null}
		</Painel>
	);
};

/**
 * "Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos": o vídeo vira um Reel
 * no celular (o rosto mora na tela do celular, como na pré-visualização do editor). Em "Instagram" a interface do
 * Reel aparece; em "um" o NOME do modelo; em "desses" os outros modelos saem de trás. Devolve o rosto em "posso".
 */
const S_C = T.celular; // null: o vídeo não tem a tela do celular
export const vidaCel = (t: number) => (S_C ? Math.min(tw(t, S_C.de - 0.05, S_C.de + 0.3, 0, 1, E.inOut), 1 - tw(t, S_C.devolve - 0.05, S_C.devolve + 0.2, 0, 1, E.in)) : 0);
// "Inclusive," "se você estiver" "no Instagram agora," "você está vendo" "apenas um desses modelos." (scripts/gerar_tempos.py, titulos.celular)
export const PAG_CEL = T.titulos.celular ? paginasDe(T.titulos.celular.i0, T.titulos.celular.grupos) : [];

export const CelularFundo: React.FC = () => {
	const {t} = useT();
	const v = vidaCel(t);
	if (v <= 0 || !S_C) return null;
	const sai = tw(t, S_C.desses - 0.1, S_C.desses + 0.4, 0, 1, E.out);
	return (
		<AbsoluteFill style={{...fundoClaro, opacity: Math.min(1, v * 1.4)}}>
			{/* os outros modelos, atrás do celular */}
			{[-1, 1].map((lado) =>
				sai > 0 ? (
					<div key={lado} style={{position: 'absolute', left: CEL.x - 14, top: CEL.y - 14, width: CEL.w + 28, height: CEL_H + 28, borderRadius: 46, background: C.papel, border: `3px dashed ${C.grade}`, boxShadow: SOMBRA, transform: `translateX(${lado * 330 * sai}px) rotate(${lado * 7 * sai}deg) scale(${1 - 0.18 * sai})`, opacity: sai}}>
						<div style={{position: 'absolute', left: '50%', top: '45%', width: 90, height: 90, marginLeft: -45, marginTop: -45, borderRadius: 45, background: C.grade, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<svg width={38} height={38} viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z" fill={C.papel} /></svg>
						</div>
					</div>
				) : null,
			)}
			<div style={{position: 'absolute', left: CEL.x - 14, top: CEL.y - 14, width: CEL.w + 28, height: CEL_H + 28, borderRadius: 46, background: '#121212', boxShadow: '0 30px 60px rgba(0,0,0,0.30)'}} />
		</AbsoluteFill>
	);
};

const Icone: React.FC<{d: string}> = ({d}) => (
	<svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))'}}>
		<path d={d} />
	</svg>
);

export const CelularFrente: React.FC = () => {
	const {t} = useT();
	const {arroba, foto} = usePrevias();
	const v = vidaCel(t);
	if (v <= 0 || !S_C) return null;
	const ig = mola(t, S_C.instagram, {damping: 14, stiffness: 200});
	const nome = mola(t, S_C.nome, {damping: 13, stiffness: 220});
	const marca = tw(t, S_C.nome + 0.3, S_C.nome + 0.7, 0, 1, E.inOut);
	const progresso = tw(t, S_C.instagram, S_C.devolve, 0, 1, E.lin);
	return (
		<AbsoluteFill style={{opacity: v}}>
			<Titulo t={t} paginas={PAG_CEL} />
			{ig > 0 ? (
				<div style={{position: 'absolute', left: CEL.x, top: CEL.y, width: CEL.w, height: CEL_H, borderRadius: 34, overflow: 'hidden', opacity: Math.min(1, ig * 2)}}>
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 220, background: 'linear-gradient(transparent, rgba(0,0,0,0.45))'}} />
					<div style={{position: 'absolute', right: 18, bottom: 120, display: 'flex', flexDirection: 'column', gap: 26, transform: `translateX(${(1 - ig) * 60}px)`}}>
						<Icone d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
						<Icone d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5z" />
						<Icone d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
					</div>
					<div style={{position: 'absolute', left: 18, bottom: 40, display: 'flex', alignItems: 'center', gap: 12, transform: `translateY(${(1 - ig) * 40}px)`}}>
						{foto ? <Img src={staticFile(foto)} style={{width: 46, height: 46, borderRadius: 23, border: '2px solid #fff', objectFit: 'cover'}} /> : null}
						{arroba ? <div style={{color: '#fff', fontFamily: '-apple-system, "Segoe UI", ' + DISPLAY, fontWeight: 700, fontSize: 24, textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>{arroba}</div> : null}
						{arroba ? <div style={{color: '#fff', fontFamily: '-apple-system, "Segoe UI", ' + DISPLAY, fontWeight: 700, fontSize: 20, border: '2px solid rgba(255,255,255,0.85)', borderRadius: 10, padding: '3px 12px 5px'}}>Seguir</div> : null}
					</div>
					<div style={{position: 'absolute', left: 0, bottom: 0, height: 5, width: `${progresso * 100}%`, background: 'rgba(255,255,255,0.9)'}} />
				</div>
			) : null}
			{nome > 0 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: CEL.y + CEL_H + 44, display: 'flex', justifyContent: 'center'}}>
					<Etiqueta p={nome} style={{padding: '14px 34px 16px 16px', gap: 18, borderRadius: 60}}>
						<Bolinha size={58} />
						<span style={{position: 'relative', fontFamily: DISPLAY, fontWeight: 800, fontSize: 60, letterSpacing: '-0.035em'}}>
							<span style={{position: 'absolute', left: -4, right: -4, bottom: '0.14em', height: '0.36em', borderRadius: 6, background: C.menta, transform: `scaleX(${marca})`, transformOrigin: '0 50%'}} />
							<span style={{position: 'relative'}}>{MODELO}</span>
						</span>
					</Etiqueta>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/**
 * "duas prévias rápidas aqui em cima, aceleradas em três vezes": tela dividida com as duas prévias de outros
 * modelos lado a lado em cima (public/previa1.mp4 e previa2.mp4, já 3x, sem som), cada uma com o nome do modelo
 * dela; "3x" entra em "aceleradas". Só com `previas: true`; com false nada aparece e nenhum arquivo é pedido.
 */
export const PreviasCena: React.FC = () => {
	const {t} = useT();
	const {previas, nomesPrevias} = usePrevias();
	const S = T.previas;
	if (!previas || !S) return null;
	const x3 = mola(t, S.x3, {damping: 10, stiffness: 300, mass: 0.6});
	return (
		<Painel de={S.de} ate={S.sai}>
			{[0, 1].map((i) => {
				const p = mola(t, S.de + 0.1 + i * 0.12, {damping: 14, stiffness: 200});
				return (
					<div key={i} style={{position: 'absolute', left: 150 + i * 400, top: 205, width: 380, height: 676, borderRadius: 30, overflow: 'hidden', border: `10px solid ${C.papel}`, boxShadow: SOMBRA, background: '#1B1B1A', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 60}px)`}}>
						<Sequence from={Math.round(S.de * T.fps)} layout="none">
							<OffthreadVideo src={staticFile(`previa${i + 1}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
						</Sequence>
						<div style={{position: 'absolute', left: 14, top: 14, background: 'rgba(0,0,0,0.65)', borderRadius: 14, padding: '7px 14px 9px', fontFamily: MONO, fontSize: 25, fontWeight: 600, color: C.branco}}>{nomesPrevias[i]}</div>
						{x3 > 0 ? (
							<div style={{position: 'absolute', right: 14, bottom: 14, background: C.menta, borderRadius: 14, padding: '6px 16px 8px', fontFamily: MONO, fontSize: 34, fontWeight: 600, color: C.tinta, transform: `scale(${x3})`}}>3x</div>
						) : null}
					</div>
				);
			})}
		</Painel>
	);
};

/** "ver outros modelos de edição como esse": a etiqueta pequena na coluna ao lado do rosto */
export const Outros: React.FC = () => {
	const {t} = useT();
	const S = T.outros;
	if (!S) return null;
	const p = presenca(t, S.de, S.sai);
	if (p <= 0) return null;
	return (
		<Coluna top={330}>
			<Etiqueta p={p} style={{fontFamily: MONO, fontSize: 34, transform: `translateX(${(1 - p) * -40}px) scale(${0.85 + 0.15 * p})`}}>
				<svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.verde} strokeWidth={2} strokeLinejoin="round">
					<rect x={7} y={3} width={13} height={15} rx={2} />
					<path d="M4 7v12a2 2 0 0 0 2 2h10" />
				</svg>
				outros modelos
			</Etiqueta>
		</Coluna>
	);
};

/** "e aprender a como usar isso nos seus vídeos": a caixa do Claude com as palavras dele, digitadas quando ditas */
export const Prompt: React.FC = () => {
	const {t} = useT();
	const S = T.prompt;
	if (!S || !S.palavras.length) return null;
	const txt = S.textos; // as palavras ditas, sem a pontuação (scripts/gerar_tempos.py)
	const caixa = mola(t, S.de + 0.15);
	const ultima = S.palavras[S.palavras.length - 1];
	const envia = mola(t, ultima, {damping: 10, stiffness: 300, mass: 0.6});
	return (
		<Painel de={S.de} ate={S.sai}>
			<div style={{position: 'absolute', left: 100, right: 130, top: 330, opacity: Math.min(1, caixa * 1.6), transform: `translateY(${(1 - caixa) * 30}px)`}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, color: C.tinta}}>
					<Faisca size={44} />
					Claude
				</div>
				<div style={{position: 'relative', background: C.papel, borderRadius: 30, border: `2px solid ${C.linha}`, boxShadow: SOMBRA, padding: '34px 36px 100px', fontFamily: DISPLAY, fontWeight: 600, fontSize: 58, letterSpacing: '-0.02em', lineHeight: 1.18, color: C.tinta, minHeight: 250}}>
					{txt.map((w, k) => (t >= S.palavras[k] ? <span key={k}>{(k ? ' ' : '') + w}</span> : null))}
					{t < ultima + 0.3 ? <span style={{opacity: Math.floor(t * 2.5) % 2 ? 1 : 0, color: C.claude}}>▍</span> : null}
					<div style={{position: 'absolute', right: 26, bottom: 24, width: 64, height: 64, borderRadius: 32, background: t >= ultima ? C.claude : C.grade, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.12 * Math.sin(Math.PI * Math.min(1, envia))})`}}>
						<svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
					</div>
				</div>
			</div>
		</Painel>
	);
};

/**
 * fecho: "comenta EDIÇÃO aqui embaixo": o campo de comentário minimalista no jeito do Instagram, embaixo, com
 * EDIÇÃO digitada no instante em que é dita (a palavra que a pessoa vai comentar); "que eu vou te mandar na sua DM":
 * a mensagem chega em cima (foto, @ e o aviãozinho que sai em "DM").
 */
export const Fecho: React.FC = () => {
	const {t} = useT();
	const {arroba, foto} = usePrevias();
	const S = T.fecho;
	if (!S || t < S.comenta) return null;
	const card = mola(t, S.comenta + 0.3, {damping: 15, stiffness: 170}); // espera o painel do prompt subir
	const PALAVRA = S.palavra; // a palavra a comentar, em caixa alta (scripts/gerar_tempos.py)
	const n = Math.floor(tw(t, S.edicao, S.edicao + 0.42, 0, PALAVRA.length + 0.999, E.lin));
	const marca = tw(t, S.edicao + 0.45, S.edicao + 0.85, 0, 1, E.inOut);
	const aperta = mola(t, S.embaixo, {damping: 10, stiffness: 300, mass: 0.6});
	const dm = mola(t, S.mandar, {damping: 15, stiffness: 170});
	const voa = tw(t, S.dm, S.dm + 0.5, 0, 1, E.out);
	const fonte = '-apple-system, "Segoe UI", ' + DISPLAY;
	const avatar = (lado: number) => foto && (
		<div style={{width: lado, height: lado, flex: 'none', borderRadius: lado / 2, padding: 4, background: 'linear-gradient(45deg,#F9CE34,#EE2A7B,#6228D7)'}}>
			<Img src={staticFile(foto)} style={{width: lado - 8, height: lado - 8, borderRadius: (lado - 8) / 2, border: '3px solid #fff', objectFit: 'cover', display: 'block'}} />
		</div>
	);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 110, right: 140, top: 1236, opacity: Math.min(1, card * 1.5), transform: `translateY(${(1 - card) * 80}px)`}}>
				<div style={{background: C.branco, borderRadius: 36, boxShadow: SOMBRA, padding: '24px 24px', display: 'flex', alignItems: 'center', gap: 20, fontFamily: fonte}}>
					{avatar(96)}
					<div style={{flex: 1, height: 128, borderRadius: 64, background: '#EFEFEF', display: 'flex', alignItems: 'center', padding: '0 30px'}}>
						<span style={{position: 'relative', fontFamily: DISPLAY, fontWeight: 800, fontSize: 88, letterSpacing: '-0.02em', color: C.tinta, lineHeight: 1}}>
							<span style={{position: 'absolute', left: -6, right: -6, bottom: '0.02em', height: '0.4em', borderRadius: 6, background: C.menta, transform: `scaleX(${marca})`, transformOrigin: '0 50%'}} />
							<span style={{position: 'relative'}}>{PALAVRA.slice(0, n)}</span>
						</span>
						{marca < 1 ? <span style={{width: 5, height: 76, marginLeft: 6, background: C.tinta, opacity: Math.floor(t * 2.5) % 2 ? 1 : 0}} /> : null}
					</div>
					<div style={{width: 80, height: 80, flex: 'none', borderRadius: 40, background: n > 0 ? '#0095F6' : '#DBDBDB', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.12 * Math.sin(Math.PI * Math.min(1, aperta))})`}}>
						<svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
					</div>
				</div>
			</div>
			{dm > 0 ? (
				<div style={{position: 'absolute', left: 170, right: 200, top: 200, opacity: Math.min(1, dm * 1.5), transform: `translateY(${(1 - dm) * -60}px)`}}>
					<div style={{background: C.branco, borderRadius: 32, boxShadow: SOMBRA, padding: '16px 26px 16px 16px', display: 'flex', alignItems: 'center', gap: 18, fontFamily: fonte}}>
						{avatar(72)}
						<div style={{flex: 1, fontWeight: 700, fontSize: 36, color: '#000'}}>{arroba}</div>
						<svg width={46} height={46} viewBox="0 0 24 24" fill={voa > 0 ? '#0095F6' : 'none'} stroke={voa > 0 ? '#0095F6' : '#000'} strokeWidth={2} strokeLinejoin="round" style={{transform: `translate(${voa * 14}px, ${-voa * 10}px) rotate(${-voa * 12}deg)`}}>
							<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
						</svg>
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
