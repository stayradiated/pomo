import { updateLabel, transact } from '@stayradiated/pomo-doc';
import type { Doc } from '@stayradiated/pomo-doc';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { goto } from '$app/navigation';

const $FormDataSchema = zfd.formData({
	name: zfd.text(),
	icon: zfd.text(z.string().optional()),
	color: zfd.text()
});

type HandleFormSubmitOptions = {
	doc: Doc;
	labelId: string;
	formData: FormData;
};

const handleFormSubmit = async (options: HandleFormSubmitOptions) => {
	const { doc, labelId, formData: rawFormData } = options;

	const formData = $FormDataSchema.parse(rawFormData);
	const { name, icon, color } = formData;

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
		throw result;
	}

	goto('/label');
};

export { handleFormSubmit };
