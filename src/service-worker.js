const FILES = [
	...(self.__WB_MANIFEST || []),
	{
		url: '/build-metadata.json'
	}
];

const CACHE_VERSION = (import.meta.env.APP_VERSION || 'v1') + '.' + import.meta.env.APP_BUILD_DATE;

const fetchWithRetries = async (req, attempts = 3, delay = 1000) => {
	for (let i = 0; i < attempts; i++) {
		try {
			const response = await fetch(req);

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			if (i < attempts - 1) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			} else {
				throw error;
			}
		}
	}
};

const precache = async () => {
	const cache = await caches.open(CACHE_VERSION);

	await Promise.allSettled(
		FILES.map(async (file) => {
			if (!file || !file.url) return;

			const url = new URL(file.url, location.origin);

			if (file.revision) {
				url.searchParams.append('__WB_REVISION', file.revision);
			} else {
				url.searchParams.append('__WB_CACHE_VERSION', CACHE_VERSION);
			}

			const match = await caches.match(url);

			if (match) {
				await cache.put(url, match.clone());
			} else {
				await cache.add(url);
			}
		})
	);
};

const cleanupCaches = async () => {
	const cachesKeys = await caches.keys();

	await Promise.allSettled(
		cachesKeys.map(async (key) => {
			if (CACHE_VERSION === key) return;
			await caches.delete(key);
		})
	);
};

let isFirstInstall = false;

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			isFirstInstall = (await caches.keys()).length === 0;
			precache();

			if (isFirstInstall) {
				self.skipWaiting();
			}
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			await cleanupCaches();

			if (isFirstInstall) {
				self.clients.claim();
			}
		})()
	);
});

const getIndexHTML = async (cache) => cache.match('/index.html', { ignoreSearch: true });

const fromCache = async (e) => {
	if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
		return fetch(e.request);
	}

	const cache = await caches.open(CACHE_VERSION);

	const { pathname } = new URL(e.request.url);
	const url = pathname === '/' ? '/index.html' : pathname;

	const match = await cache.match(url, { ignoreSearch: true });

	if (match) return match;

	const req = e.request;

	const isAcceptHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');

	try {
		const response = await fetchWithRetries(req);

		if (response.status === 404 && req.method === 'GET' && isAcceptHTML) {
			return (await getIndexHTML(cache)) || response;
		}

		if (response.status === 200) {
			await cache.put(req, response.clone());
		}

		return response;
	} catch (err) {
		if (isAcceptHTML) {
			const indexHTML = await getIndexHTML(cache);

			if (indexHTML) return indexHTML;
		}

		throw err;
	}
};

self.addEventListener('fetch', (e) => {
	e.respondWith(fromCache(e));
});
