import { zfd } from 'zod-form-data';
import { z } from 'zod';
import type { Doc } from '@stayradiated/pomo-doc';
import { goto } from '$app/navigation';
import {
	getPointById,
	getUserTimeZone,
	updatePointStartedAt,
	transact
} from '@stayradiated/pomo-doc';
import { toDate } from 'date-fns-tz';

const $FormDataSchema = zfd.formData({
	startedAtLocal: zfd.text(),
	pointId: zfd.repeatable(z.array(zfd.text()).min(1))
});

type HandleFormSubmitOptions = {
	doc: Doc;
	formData: FormData;
};

const handleFormSubmit = (options: HandleFormSubmitOptions) => {
	const { doc, formData: rawFormData } = options;

	const formData = $FormDataSchema.parse(rawFormData);
	const { startedAtLocal, pointId: userPointIdList } = formData;

	// verify that each point exists
	const pointList = userPointIdList.map((pointId) => {
		const point = getPointById({ doc, pointId });
		if (point instanceof Error) {
			throw point;
		}
		return point;
	});

	const timeZone = getUserTimeZone({ doc });
	const startedAt = toDate(startedAtLocal, { timeZone }).getTime();

	const pointIdList = [...new Set(pointList.map((point) => point.id))];

	const result = transact(doc, () => updatePointStartedAt({ doc, pointIdList, startedAt }));
	if (result instanceof Error) {
		throw result;
	}

	goto('/log');
};

export { handleFormSubmit };
