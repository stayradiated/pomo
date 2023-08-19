import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as pomoDoc from '@stayradiated/pomo-doc';
import type { Doc } from '@stayradiated/pomo-doc';
import { errorBoundary } from '@stayradiated/error-boundary';
import { getEnv } from './env.js';

type GetDocFn = () => Promise<Doc | Error>;

type Ref = {
	doc: Doc | undefined;
};

const ref: Ref = {
	doc: undefined
};

const getDocFilePath = (): string => {
	const env = getEnv();
	return path.join(env.POMO_DIR, 'state');
};

const getDoc: GetDocFn = async (): Promise<Doc | Error> => {
	if (ref.doc) {
		return ref.doc;
	}

	const inputFilePath = getDocFilePath();

	const exists = await errorBoundary(async () => fs.stat(inputFilePath));
	if (exists instanceof Error && 'code' in exists) {
		if (exists.code === 'ENOENT') {
			return pomoDoc.createDoc();
		}

		return exists;
	}

	const byteArray = await fs.readFile(inputFilePath);
	const doc = pomoDoc.loadDoc(byteArray);

	ref.doc = doc;

	return doc;
};

const saveDoc = async () => {
	const doc = ref.doc;
	if (!doc) {
		throw new Error('No doc');
	}

	const filePath = getDocFilePath();
	const byteArray = pomoDoc.encodeStateAsUpdate(doc);
	await fs.writeFile(filePath, byteArray);
};

export { getDoc, saveDoc };
