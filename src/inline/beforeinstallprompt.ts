declare global {
	interface Window {
		installPrompt: Event | null;
	}
}

const init = () => {
	window.addEventListener('beforeinstallprompt', (event) => {
		event.preventDefault();
		window.installPrompt = event;
	});
};

init();
