// Fotos de conferência.  node scripts/quadros.mjs [--previas] [--nome "<nome de quem fala>"] [--arroba "<@ de quem fala>"] 1 13.8 ...
//   -> conferencia/q_1.00.png (ESCALA=1 para tamanho cheio). --nome/--arroba mostram o terço inferior (vazios, ele some).
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const opcao = (o) => {
	const i = args.indexOf(`--${o}`);
	return i < 0 ? '' : args.splice(i, 2)[1] ?? '';
};
const nome = opcao('nome'), arroba = opcao('arroba');
const previas = args.includes('--previas');
const tempos = args.filter((a) => a !== '--previas').map(Number);
fs.mkdirSync('conferencia', {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
const props = {previas, nomesPrevias: ['modelodinamico01', 'modelopadrao01'], nome, arroba};
const comp = await selectComposition({serveUrl: serve, id: 'VitrineSuperPodcast01', inputProps: props});
for (const t of tempos) {
	const out = `conferencia/q_${t.toFixed(2)}${previas ? '_previas' : ''}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: props, imageFormat: 'png', scale: process.env.ESCALA ? Number(process.env.ESCALA) : 0.5});
	console.log(out);
}
