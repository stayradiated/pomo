import { error, redirect } from '@sveltejs/kit';
import { getDoc } from '$lib/doc.js';
import { updateLabel, transact } from '@stayradiated/pomo-doc';
import { zfd } from 'zod-form-data';
import { z } from 'zod';

const $schema = zfd.formData({
	name: zfd.text(),
	icon: zfd.text(z.string().optional()),
	color: zfd.text()
});

const actions = async ({ params, request }) => {
	const { labelId } = params;

	const formData = $schema.parse(await request.formData());
	const { name, icon, color } = formData;

	const doc = await getDoc();
	if (doc instanceof Error) {
		throw error(500, doc.message);
	}

	const result = transact(doc, () =>
		updateLabel({
			doc,
			labelId,
			name,
			icon: icon || null,
			color
		})
	);
	if (result instanceof Error) {
		throw error(500, result.message);
	}

	throw redirect(302, '/label');
};

export { actions };
