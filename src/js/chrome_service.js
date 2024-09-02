let ChromeService = (function () {
	'use strict';

	let NewtFolderID = null;

	async function getBookmarks() {
		// console.log("Getting bookmarks");

		return chrome.bookmarks
			.search('NewtData')
			.then(function (res) {
				if (res.length > 0) {
					NewtFolderID = res[0].id;
					return chrome.bookmarks.getSubTree(res[0].id);
				} else {
					var folder = {
						title: 'NewtData'
					};

					chrome.bookmarks.create(folder, function (res) {
						// console.log("Created NewtData:");
						// console.log(res);
					});

					return [];
				}
			})
			.then(function (res) {
				return res[0].children;
			})
			.catch(function (error) {
				console.log('Error: ' + error);
			});
	}

	function getApps() {
		// console.log('Getting apps');

		return chrome.management.getAll().then(function (res) {
			var apps = [];

			for (var item of res) {
				if (item.isApp) {
					apps.push(item);
				}
			}

			var compare = function (a, b) {
				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				return 0;
			};
			apps.sort(compare);

			return apps;
		});
	}

	function getFrequents() {
		return chrome.topSites.get().then(function (res) {
			return res;
		});
	}

	function getRecentlyAdded() {
		return chrome.bookmarks.getRecent(40).then(function (res) {
			return res;
		});
	}

	async function getRecentlyClosed() {
		const hasPermission = await verifyPermission('tabs');
		if (!hasPermission) {
			return [];
		}
		return chrome.sessions.getRecentlyClosed().then(function (res) {
			return res;
		});
	}

	async function getDevices() {
		const hasPermission = await verifyPermission('tabs');
		if (!hasPermission) {
			return [];
		}

		return chrome.sessions.getDevices().then(function (res) {
			var cards = [];

			for (var device of res) {
				var card = {
					deviceName: device.deviceName,
					info: device.info,
					title: device.deviceName,
					lastModified: device.sessions[0].lastModified,
					sites: device.sessions[0].window.tabs
				};

				cards.push(card);
			}

			return cards;
		});
	}

	function moveBookmark(bookmark, folder, index) {
		// console.log("Moving bookmark\nid: " + bookmark + "\nparentId: " + folder + "\nindex: " + index);
		chrome.bookmarks.move(bookmark, { parentId: folder, index: index });
	}

	function moveFolder(folderID, index) {
		chrome.bookmarks.move(folderID, { parentId: NewtFolderID, index: index });
	}

	function updateBookmark(id, title, url) {
		return chrome.bookmarks.update(id, { title: title, url: url }).then(function (res) {
			return res;
		});
	}

	function deleteBookmark(bookmarkID) {
		chrome.bookmarks.remove(bookmarkID);
	}

	function deleteBookmarkTree(bookmarkID) {
		chrome.bookmarks.removeTree(bookmarkID);
	}

	function createFolder(name) {
		console.log('Newt', NewtFolderID);

		return chrome.bookmarks
			.create({ parentId: NewtFolderID, title: name })
			.then(function (res) {
				return res;
			});
	}

	function updateTab(url) {
		chrome.tabs.update({ url: url });
	}

	function openNewTab(url, active) {
		chrome.tabs.create({ url: url, active: active });
	}

	function openApp(id) {
		chrome.management.launchApp(id);
	}

	function getFaviconUrl(url) {
		const result = new URL(chrome.runtime.getURL('/_favicon/'));
		result.searchParams.set('pageUrl', url);
		result.searchParams.set('size', '64');
		return result.toString();
	}

	async function verifyPermission(permission) {
		let hasPermission = await chrome.permissions.contains({ permissions: [permission] });
		if (!hasPermission) {
			hasPermission = await chrome.permissions.request({ permissions: [permission] });
		}
		return hasPermission;
	}

	return {
		getBookmarks: getBookmarks,
		getApps: getApps,
		getFrequents: getFrequents,
		getRecentlyAdded: getRecentlyAdded,
		getRecentlyClosed: getRecentlyClosed,
		getDevices: getDevices,
		moveBookmark: moveBookmark,
		moveFolder: moveFolder,
		updateBookmark: updateBookmark,
		deleteBookmark: deleteBookmark,
		deleteBookmarkTree: deleteBookmarkTree,
		createFolder: createFolder,
		updateTab: updateTab,
		openNewTab: openNewTab,
		openApp: openApp,
		getFaviconUrl: getFaviconUrl,
		verifyPermission: verifyPermission
	};
})();
