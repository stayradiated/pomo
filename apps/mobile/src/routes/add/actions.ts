import { goto } from '$app/navigation';
import {
	getStreamList,
	upsertPoint,
	updatePoint,
	transact,
	getUserTimeZone,
	upsertLabel
} from '@stayradiated/pomo-doc';
import type { Doc } from '@stayradiated/pomo-doc';
import { getCurrentPoints } from '@stayradiated/pomo-core';
import { toDate } from 'date-fns-tz';
import { zfd } from 'zod-form-data';
import { z } from 'zod';

const $FormDataSchema = zfd.formData({
	startedAtLocal: zfd.text(),
	stream: zfd.repeatable(
		z.array(
			z.object({
				id: zfd.text(),
				value: zfd.text(z.string().optional().default('')),
				label: zfd.repeatable(
					z.array(
						z.discriminatedUnion('type', [
							z.object({
								type: z.literal('connect'),
								id: zfd.text()
							}),
							z.object({
								type: z.literal('create'),
								name: zfd.text()
							})
						])
					)
				)
			})
		)
	)
});

type HandleFormSubmitOptions = {
	doc: Doc;
	formData: FormData;
};

const handleFormSubmit = async (options: HandleFormSubmitOptions) => {
	const { doc, formData: rawFormData } = options;

	const formData = $FormDataSchema.parse(rawFormData);
	const { startedAtLocal, stream: streamValueList } = formData;

	const timeZone = getUserTimeZone({ doc });
	const startedAt = toDate(startedAtLocal, { timeZone }).getTime();

	const streamList = getStreamList({ doc });
	const currentPoints = getCurrentPoints({
		doc,
		streamList,
		currentTime: startedAt
	});
	for (const streamValue of streamValueList) {
		const { id: streamId, value: valueRaw, label: labelRaw } = streamValue;

		const currentPoint = currentPoints.get(streamId);

		const labelIdList: string[] = labelRaw.map((labelInput) => {
			switch (labelInput.type) {
				case 'connect': {
					return labelInput.id;
				}
				case 'create': {
					const labelId = transact(doc, () =>
						upsertLabel({
							doc,
							name: labelInput.name,
							streamId
						})
					);
					if (labelId instanceof Error) {
						throw labelId;
					}
					return labelId;
				}
				default: {
					throw new Error(`Unknown label type: ${JSON.stringify(labelInput)}`);
				}
			}
		});

		const value = valueRaw.replace(/\r/g, '');
		const hasDifferentValue = currentPoint?.value !== value;
		const hasDifferentLabel =
			JSON.stringify(currentPoint?.labelIdList) !== JSON.stringify(labelIdList);

		if (hasDifferentValue || hasDifferentLabel) {
			const result = transact(doc, () => {
				return currentPoint?.startedAt === startedAt
					? updatePoint({
							doc,
							pointId: currentPoint.id,
							value,
							labelIdList
					  })
					: upsertPoint({
							doc,
							streamId,
							value,
							labelIdList,
							startedAt
					  });
			});
			if (result instanceof Error) {
				throw result;
			}
		}
	}

	goto('/log');
};

export { handleFormSubmit };
