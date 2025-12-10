import { mount } from 'svelte';
import 'p1-front-box/src/base.css';
import 'p1-front-box/src/app.css';
import EntryApp from './EntryApp.svelte';

declare global {
	interface Window {
		isUnsupportedBrowser?: boolean;
	}
}

window.addEventListener('unhandledrejection', (event) => {
	alert('Error: ' + event.reason.message);
});

let app = null;

if (!window.isUnsupportedBrowser) {
	app = mount(EntryApp, {
		target: document.getElementById('app')!
	});
}

export default app;
