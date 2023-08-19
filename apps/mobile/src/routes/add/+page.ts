import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getLabelRecord, getStreamList, getUserTimeZone } from '@stayradiated/pomo-doc';
import { getDoc } from '$lib/doc.js';
import { getCurrentPoints } from '@stayradiated/pomo-core';
import { formatInTimeZone } from 'date-fns-tz';
import type { Label } from '@stayradiated/pomo-doc';

// TODO: move to core
type StreamLabelRecord = Record<string, Record<string, Label>>;
const groupLabelByStream = (labelRecord: Record<string, Label>): StreamLabelRecord => {
	const byStream: StreamLabelRecord = {};
	for (const label of Object.values(labelRecord)) {
		const { streamId } = label;
		if (!byStream[streamId]) {
			byStream[streamId] = {};
		}
		byStream[streamId][label.id] = label;
	}
	return byStream;
};

const load = (async () => {
	const currentTime = Date.now();
	const doc = await getDoc();
	if (doc instanceof Error) {
		throw error(500, doc.message);
	}

	const streamList = getStreamList({ doc });
	const currentPoints = getCurrentPoints({ doc, streamList, currentTime });

	const timeZone = getUserTimeZone({ doc });
	const startedAtLocal = formatInTimeZone(Date.now(), timeZone, 'yyyy-MM-dd HH:mm');

	const labelRecord = getLabelRecord({ doc });
	const streamLabelRecord = groupLabelByStream(labelRecord);

	return {
		doc,
		startedAtLocal,
		streamList,
		currentPoints,
		streamLabelRecord
	};
}) satisfies PageLoad;

export { load };
