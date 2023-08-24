import { writable, readonly } from 'svelte/store';
import { syncWithRemote } from '@stayradiated/pomo-doc';
import type { SyncTransportData } from '@stayradiated/pomo-doc';
import { errorBoundary, serializeError } from '@stayradiated/error-boundary';
import type { Doc } from '@stayradiated/pomo-doc';

const transport = async (
	remoteUrl: string,
	local: SyncTransportData
): Promise<SyncTransportData | Error> => {
	const formData = new FormData();
	if (local.diff) {
		formData.append('diff', new Blob([local.diff]));
	}

	if (local.stateVector) {
		formData.append('stateVector', new Blob([local.stateVector]));
	}

	const body = await errorBoundary(async () => {
		const response = await fetch(remoteUrl, {
			method: 'POST',
			body: formData
		});
		return response.formData();
	});
	if (body instanceof Error) {
		return new Error(`Could not POST form data to ${remoteUrl}`, { cause: body });
	}

	const remoteDiffFile = body.get('diff');
	const remoteStateVectorFile = body.get('stateVector');

	const remoteDiff =
		remoteDiffFile && remoteDiffFile instanceof File
			? new Uint8Array(await remoteDiffFile.arrayBuffer())
			: undefined;

	const remoteStateVector =
		remoteStateVectorFile && remoteStateVectorFile instanceof File
			? new Uint8Array(await remoteStateVectorFile.arrayBuffer())
			: undefined;

	return { diff: remoteDiff, stateVector: remoteStateVector };
};

const syncWithServer = async (doc: Doc): Promise<void | Error> => {
	const remoteUrl = '/api/sync';

	const remoteDataPartA = await transport(
		remoteUrl,
		syncWithRemote({
			doc,
			remote: undefined,
			shouldSendStateVector: true
		})
	);
	if (remoteDataPartA instanceof Error) {
		return new Error('Failed to sync with server while fetching part A', {
			cause: remoteDataPartA
		});
	}

	const remoteDataPartB = await transport(
		remoteUrl,
		syncWithRemote({
			doc,
			remote: remoteDataPartA,
			shouldApplyDiff: true,
			shouldSendDiff: true
		})
	);
	if (remoteDataPartB instanceof Error) {
		return new Error('Failed to sync with server while fetching part B', {
			cause: remoteDataPartB
		});
	}
};

type Log = {
	ts: number;
	message: string;
};

type LogList = Log[];

const internalSyncLogs = writable<LogList>([]);
const syncLogs = readonly(internalSyncLogs);

const markDocAsStale = async (doc: Doc) => {
	internalSyncLogs.update((logs) => [
		...logs,
		{
			ts: Date.now(),
			message: 'Sync started'
		}
	]);
	const result = await syncWithServer(doc);
	if (result instanceof Error) {
		const jsonError = JSON.stringify(serializeError(result));
		internalSyncLogs.update((logs) => [
			...logs,
			{
				ts: Date.now(),
				message: `Sync failed: ${jsonError}`
			}
		]);
		return;
	} else {
		internalSyncLogs.update((logs) => [
			...logs,
			{
				ts: Date.now(),
				message: 'Sync completed'
			}
		]);
	}
};

export { markDocAsStale, syncLogs };
export type { Log, LogList };
