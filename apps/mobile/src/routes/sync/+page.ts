import type { PageLoad } from './$types';
import { getDoc } from '$lib/doc.js';
import { markDocAsStale } from '$lib/sync.js';

const load = (async () => {
	const doc = await getDoc();

	return {
		async handleSync() {
			await markDocAsStale(doc);
		}
	};
}) satisfies PageLoad;

export { load };
