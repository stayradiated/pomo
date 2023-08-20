import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import {
	getPointById,
	getStreamList,
	getUserTimeZone,
	updatePointStartedAt,
	transact
} from '@stayradiated/pomo-doc';
import { getDoc } from '$lib/doc';
import { getCurrentPoints } from '@stayradiated/pomo-core';
import { toDate, formatInTimeZone } from 'date-fns-tz';

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

	const streamList = getStreamList({ doc });
	const pointMap = getCurrentPoints({ doc, streamList, currentTime: startedAt });
	const pointList = [...pointMap.values()].filter((point) => {
		return point.startedAt >= startedAt;
	});

	const timeZone = getUserTimeZone({ doc });
	const startedAtLocal = formatInTimeZone(startedAt, timeZone, 'yyyy-MM-dd HH:mm');

	return {
		startedAtLocal,
		streamList,
		pointList
	};
}) satisfies PageLoad;

export { load };
