// Quadros soltos do vídeo em PNG, com um pacote só (bem mais rápido que um `remotion still` por quadro).
// uso (na pasta do vídeo): QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs <pasta> <segundos...>
// ex.: ... node scripts/quadros.mjs conferencia/q 1.2 5.45 8.6   (grava conferencia/q/q_0005.450.png e imprime o sha256)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

const [pasta, ...tempos] = process.argv.slice(2);
if (!pasta || !tempos.length) {
	console.error('uso: node scripts/quadros.mjs <pasta> <segundos...>');
	process.exit(1);
}
mkdirSync(pasta, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const inputProps = {voz: false};
const composition = await selectComposition({serveUrl, id: 'Anuncio', inputProps});
for (const s of tempos) {
	const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
	const output = path.join(pasta, `q_${Number(s).toFixed(3).padStart(8, '0')}.png`);
	await renderStill({serveUrl, composition, frame, output, inputProps, imageFormat: 'png'});
	console.log(createHash('sha256').update(readFileSync(output)).digest('hex'), `${s}s`, `quadro ${frame}`, output);
}
