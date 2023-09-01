import type { PageLoad } from './$types';
import { listOrError } from '@stayradiated/error-boundary';
import { getDoc } from '$lib/doc.js';
import {
	getStreamByName,
	getLabelByName,
	getUserTimeZone,
	retrievePointList
} from '@stayradiated/pomo-doc';
import {
	startOfDayWithTimeZone,
	endOfDayWithTimeZone,
	mapPointListToLineList,
	clampAndGroupLineListByDay
} from '@stayradiated/pomo-core';
import * as dateFns from 'date-fns';

const load = (async () => {
	const doc = await getDoc();
	if (doc instanceof Error) {
		throw doc;
	}

	const timeZone = getUserTimeZone({ doc });
	const instant = Date.now();
	const rangeStartDate = dateFns
		.subDays(startOfDayWithTimeZone({ timeZone, instant }), 30)
		.getTime();
	const rangeEndDate = endOfDayWithTimeZone({ timeZone, instant }).getTime();

	const stream = getStreamByName({ doc, name: 'project' });
	if (stream instanceof Error) {
		throw stream;
	}

	const labelList = listOrError([
		getLabelByName({ doc, streamId: stream.id, name: 'Product.app' }),
		getLabelByName({ doc, streamId: stream.id, name: 'Bowline' })
	]);
	if (labelList instanceof Error) {
		throw labelList;
	}

	const fullPointList = retrievePointList({
		doc,
		startDate: rangeStartDate,
		endDate: rangeEndDate,
		where: { streamIdList: [stream.id] }
	});
	const fullLineList = mapPointListToLineList(fullPointList);
	if (fullLineList instanceof Error) {
		throw fullLineList;
	}

	const dayList = clampAndGroupLineListByDay({
		lineList: fullLineList.filter((line) => {
			return line.labelIdList.some((labelId) => {
				return labelList.find((haystack) => haystack.id === labelId);
			});
		}),
		currentTime: Date.now(),
		startDate: rangeStartDate,
		endDate: rangeEndDate,
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

	return {
		sumMap,
		stream,
		labelList,
		rangeStartDate,
		rangeEndDate,
		timeZone
	};
}) satisfies PageLoad;

export { load };
