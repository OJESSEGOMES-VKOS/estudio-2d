// modelodinamico02: fotos de conferência.  node d2/quadros.mjs 2 5.6 9.3 -> conferencia/d2/q_2.00.png
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const tempos = process.argv.slice(2).map(Number);
fs.mkdirSync('conferencia/d2', {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
const props = {voz: false};
const comp = await selectComposition({serveUrl: serve, id: 'Dinamico02', inputProps: props});
for (const t of tempos) {
	const out = `conferencia/d2/q_${t.toFixed(2)}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.round(t * 30), inputProps: props, imageFormat: 'png', scale: 0.5});
	console.log(out);
}
