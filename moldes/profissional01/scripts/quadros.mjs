// Fotos de conferência.  node scripts/quadros.mjs [--previas] 1 13.8 28.4 -> conferencia/q_1.00.png (q_*_previas.png com --previas)
// ESCALA=1 para tamanho cheio (padrão 0.5).
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const previas = args.includes('--previas');
const tempos = args.filter((a) => a !== '--previas').map(Number);
const escala = Number(process.env.ESCALA || 0.5);
fs.mkdirSync('conferencia', {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
const props = {previas, nomesPrevias: (process.env.NOMES || 'superpodcast01,modelodinamico03').split(',')};
const comp = await selectComposition({serveUrl: serve, id: 'VitrineProfissional01', inputProps: props});
for (const t of tempos) {
	const out = `conferencia/q_${t.toFixed(2)}${previas ? '_previas' : ''}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: props, imageFormat: 'png', scale: escala});
	console.log(out);
}
