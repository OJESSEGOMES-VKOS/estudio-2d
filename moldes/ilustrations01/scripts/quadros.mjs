// Fotos de conferência.  node scripts/quadros.mjs [--previas] [--pasta=x] 1 13.8 ...  -> conferencia/q_1.00.png (ESCALA=1 para tamanho cheio)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const previas = args.includes('--previas');
const pasta = (args.find((a) => a.startsWith('--pasta=')) ?? '--pasta=conferencia').slice(8);
const tempos = args.filter((a) => !a.startsWith('--')).map(Number);
fs.mkdirSync(pasta, {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
// as props são as padrão do vídeo; PROPS=<arquivo.json> usa as mesmas do render, e --previas liga as prévias por cima
const props = {...(process.env.PROPS ? JSON.parse(fs.readFileSync(process.env.PROPS, 'utf-8')) : {}), ...(previas ? {previas: true} : {})};
const comp = await selectComposition({serveUrl: serve, id: 'VitrineIlustrations01', inputProps: props});
for (const t of tempos) {
	const out = `${pasta}/q_${t.toFixed(2)}${previas ? '_previas' : ''}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: props, imageFormat: 'png', scale: process.env.ESCALA ? Number(process.env.ESCALA) : 0.5});
	console.log(out);
}
