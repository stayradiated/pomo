import { error } from '@sveltejs/kit';
import { getDoc } from '$lib/doc.js';
import { getLabelRecord, getStreamRecord } from '@stayradiated/pomo-doc';
import type { PageLoad } from './$types';

const load = (async ({ params }) => {
	const { labelId } = params;

	const doc = await getDoc();
	if (doc instanceof Error) {
		throw error(500, doc.message);
	}

	const streamRecord = getStreamRecord({ doc });
	const labelRecord = getLabelRecord({ doc });

	const label = labelRecord[labelId];
	const stream = streamRecord[label.streamId];

	return {
		stream,
		label
	};
}) satisfies PageLoad;

export { load };
