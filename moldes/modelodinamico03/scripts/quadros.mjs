// Fotos de conferência.  node scripts/quadros.mjs [--previas] [--sem-tratamento] [--efeitos] 1 13.8 ...  -> conferencia/q_1.00.png
// As props partem do padrão da composição (src/Root.tsx); cada opção só liga o que for pedido. ESCALA=1 para tamanho cheio.
// Rodar com a trava: QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const liga = (o) => args.includes(`--${o}`);
const tempos = args.filter((a) => !a.startsWith('--')).map(Number);
fs.mkdirSync('conferencia', {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
const padrao = (await selectComposition({serveUrl: serve, id: 'VitrineDinamico03'})).defaultProps;
// o tratamento quente é o padrão do modelo (CORRECOES M3-3); --sem-tratamento tira
const props = {...padrao, previas: liga('previas'), tratamento: !liga('sem-tratamento'), efeitos: liga('efeitos')};
const comp = await selectComposition({serveUrl: serve, id: 'VitrineDinamico03', inputProps: props});
const sufixo = ['previas', 'sem-tratamento', 'efeitos'].filter(liga).map((o) => `_${o}`).join('');
for (const t of tempos) {
	const out = `conferencia/q_${t.toFixed(2)}${sufixo}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: props, imageFormat: 'png', scale: process.env.ESCALA ? Number(process.env.ESCALA) : 0.5});
	console.log(out);
}
