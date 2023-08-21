import { z } from 'zod';
import { once } from './once.js';
import { env } from '$env/dynamic/private';

const getEnv = once(() =>
	z
		.object({
			POMO_DIR: z.string(),
			OPENAI_API_KEY: z.string()
		})
		.parse(env)
);

export { getEnv };
