import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { deleteLabels, transact } from '@stayradiated/pomo-doc';
import type { Doc } from '@stayradiated/pomo-doc';

const $DeleteFormDataSchema = zfd.formData({
	stream: zfd.text(),
	label: zfd.repeatable(z.array(zfd.text()))
});

type HandleDeleteFormSubmitOptions = {
	doc: Doc;
	formData: FormData;
};

const handleDeleteFormSubmit = (options: HandleDeleteFormSubmitOptions) => {
	const { doc, formData: rawFormData } = options;

	const formData = $DeleteFormDataSchema.parse(rawFormData);
	const { label: labelIdList, stream: streamId } = formData;

	const result = transact(doc, () => deleteLabels({ doc, streamId, labelIdList }));
	if (result instanceof Error) {
		throw result;
	}
};

export { handleDeleteFormSubmit };
