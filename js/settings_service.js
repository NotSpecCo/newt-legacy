let SettingsService = (function() {
	function getSettings(key) {
		chrome.promise = new ChromePromise();

		if (key === 'all') {
			let prefs = chrome.promise.storage.sync.get('prefs').then(res => res['prefs']);
			let customThemes = chrome.promise.storage.sync.get('customThemes').then(res => res['customThemes']);
			let categoryColors = chrome.promise.storage.sync.get('categoryColors').then(res => res['categoryColors']);

			return Promise.all([prefs, customThemes, categoryColors]).then(values => {
				// Since the user may have not migrated settings yet, check localStorage if something is null and use that

				if (values[0] == null) {
					values[0] = {
						selectedTheme: localStorage.getItem('theme') || 'basic',
						keyboardShortcuts: localStorage.getItem('keyboardShortcuts') || 'disabled'
					}
				}
				
				if (values[1] == null) {
					values[1] = JSON.parse(localStorage.getItem('customThemes')) || [];
				}

				// Old custom themes may not have header styles, so add them.
				values[1].forEach((theme) => {
					if (theme.styles.length == 10) {
						let headerStyles = [
							{name: 'card-header-color1', val: '#FFEBEE'},
							{name: 'card-header-text-color1', val: '#212121'},
							{name: 'card-header-color2', val: '#E8F5E9'},
							{name: 'card-header-text-color2', val: '#212121'},
							{name: 'card-header-color3', val: '#E3F2FD'},
							{name: 'card-header-text-color3', val: '#212121'},
							{name: 'card-header-color4', val: '#F3E5F5'},
							{name: 'card-header-text-color4', val: '#212121'},
							{name: 'card-header-color5', val: '#FFF3E0'},
							{name: 'card-header-text-color5', val: '#212121'}
						];
						theme.styles = theme.styles.concat(headerStyles);
					}
				});

				// if (values[2] == null) {
					values[2] = JSON.parse(localStorage.getItem('categoryColors')) || {};
				// }

				return {
					prefs: values[0],
					customThemes: values[1],
					categoryColors: values[2]
				}
			});
		} else {
			if (key === 'categoryColors') {
				return new Promise((resolve, reject) => {
					let res = JSON.parse(localStorage.getItem('categoryColors')) || {};
					resolve(res);
				})
			} else {
				return chrome.promise.storage.sync.get(key).then(res => res[key]);
			}
			
		}
	}

	function setSettings(key, val) {
		if (key === 'categoryColors') {
			return new Promise((resolve, reject) => {
				let processed = typeof val === 'string' ? val : JSON.stringify(val);
				localStorage.setItem('categoryColors', processed);
				resolve(true);
			})
		} else {
			chrome.promise = new ChromePromise();

			const data = {};
			data[key] = val;
			return chrome.promise.storage.sync.set(data).then(() => {
				// console.log('Saved settings', key, val);
			});
		}
	}

	function migrateToChromeStorage() {
		// Preferences
		const prefs = {
			selectedTheme: localStorage.getItem('theme') || 'basic',
			keyboardShortcuts: localStorage.getItem('keyboardShortcuts') || 'disabled'
		};

		let prefsStore = this.setSettings('prefs', prefs);

		// Custom themes
		let customThemes = JSON.parse(localStorage.getItem('customThemes')) || [];
		let customThemesStore = this.setSettings('customThemes', customThemes);

		// Category colors
		let categoryColors = JSON.parse(localStorage.getItem('categoryColors')) || {};
		let categoryColorsStore = this.setSettings('categoryColors', categoryColors);

		return Promise.all([prefsStore, customThemesStore, categoryColorsStore]).then(() => {
			console.log('Settings migration completed');
			return true;
		});
	}

	function checkAndPerformInitialMigration() {
		chrome.promise = new ChromePromise();

		let prefs = chrome.promise.storage.sync.get('prefs').then(res => res['prefs']);
		let customThemes = chrome.promise.storage.sync.get('customThemes').then(res => res['customThemes']);
		let categoryColors = chrome.promise.storage.sync.get('categoryColors').then(res => res['categoryColors']);

		Promise.all([prefs, customThemes, categoryColors]).then(values => {
			if (values[0] == null && values[1] == null && values[2] == null) {
				console.log('Chrome.storage not used yet. Migrating...');
				this.migrateToChromeStorage();
			} else {
				// console.log('Already using chrome.storage. Do nothing.');
			}
		});
	}

	return ({
		getSettings: getSettings,
		setSettings: setSettings,
		migrateToChromeStorage: migrateToChromeStorage,
		checkAndPerformInitialMigration: checkAndPerformInitialMigration
	});
})();