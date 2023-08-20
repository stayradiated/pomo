import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { deleteLabels, transact } from '@stayradiated/pomo-doc';

const $schema = zfd.formData({
	'action:delete': zfd.text(),
	stream: zfd.text(),
	label: zfd.repeatable(z.array(zfd.text()))
});

const actions = {
	default: async ({ request }) => {
		const formData = $schema.parse(await request.formData());
		const { label: labelIdList, stream: streamId } = formData;
		const action = formData['action:delete'] ? 'delete' : undefined;

		const doc = await getDoc();
		if (doc instanceof Error) {
			throw error(500, doc.message);
		}

		switch (action) {
			case 'delete': {
				const result = transact(doc, () => deleteLabels({ doc, streamId, labelIdList }));
				if (result instanceof Error) {
					throw error(500, result.message);
				}
				break;
			}
			default: {
				throw error(400, 'Invalid action');
			}
		}

		return {};
	}
};

export {};
