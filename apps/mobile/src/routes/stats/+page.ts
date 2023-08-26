import type { PageLoad } from './$types.js';
import { getDoc } from '$lib/doc.js';
import {
	getUserTimeZone,
	getStreamList,
	getLabelRecord,
	retrievePointList
} from '@stayradiated/pomo-doc';
import {
	startOfDayWithTimeZone,
	mapPointListToLineList,
	clampLineList
} from '@stayradiated/pomo-core';
import type { Line } from '@stayradiated/pomo-core';
import * as dateFns from 'date-fns';

const load = (async ({ url }) => {
	const requestDate = url.searchParams.get('date');
	const instant = requestDate
		? dateFns.parse(requestDate, 'yyyy-MM-dd', new Date()).getTime()
		: Date.now();

	console.log({ requestDate, instant });

	const doc = await getDoc();
	if (doc instanceof Error) {
		throw doc;
	}

	const timeZone = getUserTimeZone({ doc });
	const startDate = startOfDayWithTimeZone({
		instant,
		timeZone
	}).getTime();
	const endDate = dateFns.addDays(startDate, 1).getTime();

	console.log({ startDate, endDate });

	const streamList = getStreamList({ doc });
	const labelRecord = getLabelRecord({ doc });

	const pointList = retrievePointList({
		doc,
		startDate,
		endDate,
		where: {}
	});

	const extendedLineList = mapPointListToLineList(pointList);
	if (extendedLineList instanceof Error) {
		throw extendedLineList;
	}

	const lineList = clampLineList({
		lineList: extendedLineList,
		currentTime: Date.now(),
		startDate,
		endDate
	});

	const streamLineListMap = new Map<string, Line[]>();

	for (const line of lineList) {
		const { streamId } = line;

		if (!streamLineListMap.has(streamId)) {
			streamLineListMap.set(streamId, []);
		}

		const streamList = streamLineListMap.get(streamId)!;
		streamList.push(line);
	}

	const firstStream = streamList.find((stream) => stream.name === 'project');
	const firstStreamLineList = firstStream ? streamLineListMap.get(firstStream.id) ?? [] : [];

	const totalMap = new Map<string, number>();
	for (const line of firstStreamLineList) {
		for (const labelId of line.labelIdList) {
			const total = totalMap.get(labelId) ?? 0;
			totalMap.set(labelId, total + line.durationMs);
		}
	}
	const totalMs = Array.from(totalMap.values()).reduce((a, b) => a + b, 0);

	const chartData = [...totalMap.entries()].map(([labelId, durationMs]) => {
		const label = labelRecord[labelId]!.name;
		const frequency = durationMs / totalMs;
		return { label, frequency };
	});

	return {
		chartData,

		instant,
		timeZone
	};
}) satisfies PageLoad;

export { load };
