import { error } from '@sveltejs/kit';
import { getDoc } from '$lib/doc.js';
import { getLabelRecord, getStreamList } from '@stayradiated/pomo-doc';
import type { Label } from '@stayradiated/pomo-doc';
import type { PageLoad } from './$types';

const load = (async () => {
	const doc = await getDoc();
	if (doc instanceof Error) {
		throw error(500, doc.message);
	}

	const streamList = getStreamList({ doc });
	const labelRecord = getLabelRecord({ doc });
	const labelList = Object.values(labelRecord);

	const streamLabelListMap = new Map<string, Map<string | null, Label[]>>();
	for (const label of labelList) {
		const streamId = label.streamId;

		if (!streamLabelListMap.has(streamId)) {
			streamLabelListMap.set(streamId, new Map());
		}
		const streamLabelMap = streamLabelListMap.get(streamId)!;

		if (!streamLabelMap.has(label.parentId)) {
			streamLabelMap.set(label.parentId, []);
		}
		const labelList = streamLabelMap.get(label.parentId)!;

		labelList.push(label);
	}

	for (const streamLabelMap of streamLabelListMap.values()) {
		for (const labelList of streamLabelMap.values()) {
			labelList.sort((a, b) => a.name.localeCompare(b.name));
		}
	}

	return {
		streamList,
		labelRecord,
		streamLabelListMap
	};
}) satisfies PageLoad;

export { load };
