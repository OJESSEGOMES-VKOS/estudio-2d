// pregacaodinamica01: fotos de conferência.  node scripts/quadros.mjs [--previas] 1 13.9 ... -> conferencia/q_1.00.png (ESCALA=1 para tamanho cheio)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const previas = args.includes('--previas');
const tempos = args.filter((a) => a !== '--previas').map(Number);
fs.mkdirSync('conferencia', {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
const props = {previas, nomesPrevias: ['modelodinamico01', 'storypodcast01'], fundoCor: false};
const comp = await selectComposition({serveUrl: serve, id: 'VitrinePregacao', inputProps: props});
for (const t of tempos) {
	const out = `conferencia/q_${t.toFixed(2)}${previas ? '_previas' : ''}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: props, imageFormat: 'png', scale: process.env.ESCALA ? Number(process.env.ESCALA) : 0.5});
	console.log(out);
}
