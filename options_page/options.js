(function() {
	document.querySelector('#btnResetTheme').addEventListener('click', () => {
		localStorage.setItem('theme', 'light');
	});
})();