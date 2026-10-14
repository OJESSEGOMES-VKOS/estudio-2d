// Fotos de conferência.  node scripts/quadros.mjs [--previas] [--sem-fundo] 1 13.8 ...  -> conferencia/q_1.00.png (ESCALA=1 para tamanho cheio)
// O efeitoFundo vem ligado, como no render (precisa de public/fala_grade.mp4); --sem-fundo desliga. NOMES=a,b troca os nomes das prévias.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const previas = args.includes('--previas');
const fundo = !args.includes('--sem-fundo'); // --fundo (antigo) continua aceito: já é o padrão
const tempos = args.filter((a) => !a.startsWith('--')).map(Number);
fs.mkdirSync('conferencia', {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
const props = {previas, nomesPrevias: (process.env.NOMES || 'modelopadrao01,profissional01').split(','), musica: false, efeitoFundo: fundo};
const comp = await selectComposition({serveUrl: serve, id: 'VitrineStoryPodcast01', inputProps: props});
for (const t of tempos) {
	const out = `conferencia/q_${t.toFixed(2)}${previas ? '_previas' : ''}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: props, imageFormat: 'png', scale: process.env.ESCALA ? Number(process.env.ESCALA) : 0.5});
	console.log(out);
}
