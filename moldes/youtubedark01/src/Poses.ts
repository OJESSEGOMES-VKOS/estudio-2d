import type {Pose} from './Boneco';

/** poses-base (locais, olhando para +x). y do quadril = chão - 217*s quando em pé. */
export const EM_PE: Omit<Pose, 'x' | 'y'> = {
	abre: 0.35,
	mT: [-26, 18],
	mF: [26, 20],
	pT: [-14, 197],
	pF: [16, 198],
	olhos: 'normal',
	boca: 'reto',
};
export const ALT_PE = 217;

/** sentado numa cadeira/cama com as coxas pra frente e os pés no chão (assento = quadril; chão = +115*s) */
export const SENTADO: Omit<Pose, 'x' | 'y'> = {
	abre: 0.2,
	mT: [60, -40],
	mF: [80, -40],
	pT: [100, 98],
	pF: [118, 98],
	kT: [1, -1],
	kF: [1, -1],
	olhos: 'normal',
	boca: 'reto',
};

/** ciclo de caminhada: fase em radianos */
export const andar = (base: Pose, fase: number, passo = 46): Pose => {
	const s1 = Math.sin(fase);
	const s2 = Math.sin(fase + Math.PI);
	const lev = (k: number) => Math.max(0, Math.cos(k)) * 26;
	return {
		...base,
		y: base.y - Math.abs(Math.cos(fase)) * 7 * (base.s ?? 1),
		rot: (base.rot ?? 0) + 3 * (base.dir ?? 1),
		pF: [8 + passo * s1, 198 - lev(fase)],
		pT: [-8 + passo * s2, 198 - lev(fase + Math.PI)],
		mF: [18 - 34 * s1, 14],
		mT: [-18 - 34 * s2, 14],
		kF: [1, 0],
		kT: [1, 0],
	};
};
