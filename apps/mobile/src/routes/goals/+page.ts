import type { PageLoad } from './$types';
import { getDoc } from '$lib/doc.js';
import {
	getStreamByName,
	getLabelByName,
	getUserTimeZone,
	retrievePointList
} from '@stayradiated/pomo-doc';
import {
	startOfWeekWithTimeZone,
	endOfWeekWithTimeZone,
	mapPointListToLineList,
	clampAndGroupLineListByDay,
	formatDurationRough
} from '@stayradiated/pomo-core';

const load = (async () => {
	const doc = await getDoc();
	if (doc instanceof Error) {
		throw doc;
	}

	const timeZone = getUserTimeZone({ doc });
	const instant = Date.now();
	const startDate = startOfWeekWithTimeZone({ timeZone, instant }).getTime();
	const endDate = endOfWeekWithTimeZone({ timeZone, instant }).getTime();

	const stream = getStreamByName({ doc, name: 'project' });
	if (stream instanceof Error) {
		throw stream;
	}

	const label = getLabelByName({ doc, streamId: stream.id, name: 'Runn' });
	if (label instanceof Error) {
		throw label;
	}

	const fullPointList = retrievePointList({
		doc,
		startDate,
		endDate,
		where: { streamIdList: [stream.id] }
	});
	const fullLineList = mapPointListToLineList(fullPointList);
	if (fullLineList instanceof Error) {
		throw fullLineList;
	}

	const dayList = clampAndGroupLineListByDay({
		lineList: fullLineList.filter((line) => {
			return line.labelIdList.includes(label.id);
		}),
		currentTime: Date.now(),
		startDate,
		endDate,
		timeZone
	});

	const sumMap = new Map(
		[...dayList.entries()].map(([dayStart, lineList]) => {
			const sum = lineList.reduce((sum, line) => {
				return sum + line.durationMs;
			}, 0);
			return [dayStart, sum];
		})
	);

	for (const [date, durationMs] of sumMap.entries()) {
		const dateStr = new Date(date).toISOString().slice(0, 10);
		console.log(`${dateStr} ${formatDurationRough(durationMs)}`);
	}

	const total = [...sumMap.values()].reduce((sum, durationMs) => {
		return sum + durationMs;
	}, 0);
	console.log(`Total: ${formatDurationRough(total)}`);

	return {};
}) satisfies PageLoad;

export { load };
