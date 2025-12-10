import { initColorScheme } from 'p1-front-box/src/inline/colorScheme';

initColorScheme((colorScheme) => {
	const appleMobileWebAppStatusBarStyle = document.createElement('meta');
	appleMobileWebAppStatusBarStyle.name = 'apple-mobile-web-app-status-bar-style';
	appleMobileWebAppStatusBarStyle.content = colorScheme === 'dark' ? 'black' : 'black-translucent';
	document.head.appendChild(appleMobileWebAppStatusBarStyle);
});
