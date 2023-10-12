/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const log = (...args) => {
	console.info('[SW]', ...args);
};

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files, // everything in `static`

	'/add',
	'/calendar/day',
	'/calendar/week',
	'/label',
	'/log',
	'/quick-add',
	'/sync'
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') {
		log(`Passing through ${event.request.method} request`);
		return;
	}

	const getResponse = async () => {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			log(`Resolving cached asset: ${url.pathname}`);
			return cache.match(url.pathname);
		}

		// api requests must always be served from the network
		if (url.pathname.startsWith('/api')) {
			log(`Passing through API request: ${url.pathname}`);
			return fetch(event.request);
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);
			log(`Passing through API : GET ${url.pathname}`);

			if (response.status === 200) {
				log(`Caching response: ${url.pathname}`);
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			const match = await cache.match(event.request);
			if (match) {
				log(`Resolve response from cache: ${url.pathname}`);
				return match;
			}
			log(`No response found in cache: ${url.pathname}`);
			return undefined;
		}
	};

	const response = getResponse();
	event.respondWith(response);
});
