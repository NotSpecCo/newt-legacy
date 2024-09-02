(function () {
	console.log('Newt background service ready.');
	var cards = [];

	function updateList(event) {
		chrome.bookmarks
			.search('NewtData')
			.then(function (res) {
				if (res.length > 0) {
					return chrome.bookmarks.getSubTree(res[0].id);
				} else {
					var folder = {
						title: 'NewtData'
					};

					chrome.bookmarks.create(folder, function (res) {
						console.log('Created NewtData:');
						console.log(res);
					});
				}
			})
			.then(function (res) {
				cards = res[0].children;

				var removed = chrome.contextMenus.removeAll();

				var id = chrome.contextMenus.create({
					id: 'addToNewt',
					title: 'Add to Newt',
					contexts: ['page', 'link']
				});
				for (var card of cards) {
					var create = chrome.contextMenus.create({
						id: card.id,
						title: card.title,
						contexts: ['page', 'link'],
						parentId: 'addToNewt'
					});
					card.menuId = create;
					// console.log("Create menu item: " + create);
				}
			})
			.catch(function (error) {
				console.log('Error: ' + error);
			});
	}

	function genericOnClick(info, tab) {
		var catName;
		for (var i = 0; i < cards.length; i++) {
			if (info.menuItemId == cards[i].menuId) {
				catName = cards[i].title;
			}
		}

		var bookmark = {
			parentId: info.menuItemId.toString(),
			title: tab.title,
			url: tab.url
		};
		// console.log(bookmark);
		chrome.bookmarks.create(bookmark, function (response) {
			console.log(response);
		});
	}

	chrome.contextMenus.onClicked.addListener(genericOnClick);

	// Keep track of any changes so we can update the context menu
	chrome.bookmarks.onCreated.addListener(updateList);
	chrome.bookmarks.onRemoved.addListener(updateList);
	chrome.bookmarks.onChanged.addListener(updateList);

	updateList();
})();
