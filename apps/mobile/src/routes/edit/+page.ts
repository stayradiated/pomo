import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getPointById, getStreamRecord, getUserTimeZone } from '@stayradiated/pomo-doc';
import { getDoc } from '$lib/doc';
import { getCurrentPointMap } from '@stayradiated/pomo-core';
import { formatInTimeZone } from 'date-fns-tz';

const load = (async ({ url }) => {
	const pointId = url.searchParams.get('ref') ?? undefined;
	if (!pointId) {
		throw error(400, 'Missing ref');
	}

	const doc = await getDoc();
	if (doc instanceof Error) {
		throw error(500, doc.message);
	}

	const point = getPointById({ doc, pointId: pointId });
	if (point instanceof Error) {
		throw point;
	}
	const startedAt = point.startedAt;

	const streamRecord = getStreamRecord({ doc });
	const streamIdList = Object.keys(streamRecord);
	const pointMap = getCurrentPointMap({ doc, streamIdList, currentTime: startedAt });
	const pointList = [...pointMap.values()].filter((point) => {
		return point.startedAt >= startedAt;
	});

	const timeZone = getUserTimeZone({ doc });
	const startedAtLocal = formatInTimeZone(startedAt, timeZone, 'yyyy-MM-dd HH:mm');

	return {
		doc,
		startedAtLocal,
		streamRecord,
		pointList
	};
}) satisfies PageLoad;

export { load };
