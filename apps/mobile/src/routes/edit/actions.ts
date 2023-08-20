import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';

const $schema = zfd.formData({
	startedAtLocal: zfd.text(),
	pointId: zfd.repeatable(z.array(zfd.text()).min(1))
});

const actions = {
	default: async ({ request }) => {
		const formData = $schema.parse(await request.formData());
		const { startedAtLocal, pointId: userPointIdList } = formData;

		const doc = await getDoc();
		if (doc instanceof Error) {
			throw error(500, doc.message);
		}

		// verify that each point exists
		const pointList = userPointIdList.map((pointId) => {
			const point = getPointById({ doc, pointId });
			if (point instanceof Error) {
				throw error(400, point.message);
			}
			return point;
		});

		const timeZone = getUserTimeZone({ doc });
		const startedAt = toDate(startedAtLocal, { timeZone }).getTime();

		const pointIdList = [...new Set(pointList.map((point) => point.id))];

		const result = transact(doc, () => updatePointStartedAt({ doc, pointIdList, startedAt }));
		if (result instanceof Error) {
			throw error(500, result.message);
		}

		throw redirect(303, '/log');
	}
};

export { actions };
