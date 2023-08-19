import type { RequestEvent } from './$types';
import { getDoc, saveDoc } from '$lib/doc.server.js';
import { syncWithRemote } from '@stayradiated/pomo-doc';

const POST = async ({ request }: RequestEvent) => {
	// TODO: use an API key or something

	const requestFormData = await request.formData();

	const doc = await getDoc();
	if (doc instanceof Error) {
		return new Response(doc.message, { status: 500 });
	}

	const remoteDiffFile = requestFormData.get('diff');
	const remoteDiff =
		remoteDiffFile && remoteDiffFile instanceof File
			? new Uint8Array(await remoteDiffFile.arrayBuffer())
			: undefined;

	const remoteStateVectorFile = requestFormData.get('stateVector');
	const remoteStateVector =
		remoteStateVectorFile && remoteStateVectorFile instanceof File
			? new Uint8Array(await remoteStateVectorFile.arrayBuffer())
			: undefined;

	const shouldApplyDiff = Boolean(remoteDiff);
	const shouldSendStateVector = Boolean(remoteStateVector);
	const shouldSendDiff = Boolean(remoteStateVector);

	const result = syncWithRemote({
		doc,
		remote: { diff: remoteDiff, stateVector: remoteStateVector },
		shouldApplyDiff,
		shouldSendStateVector,
		shouldSendDiff
	});

	await saveDoc();

	const responseFormData = new FormData();
	if (result.diff) {
		responseFormData.append('diff', new Blob([result.diff]));
	}
	if (result.stateVector) {
		responseFormData.append('stateVector', new Blob([result.stateVector]));
	}

	return new Response(responseFormData, { status: 200 });
};

export { POST };
