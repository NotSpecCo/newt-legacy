let AppPrefs = {};

var Newt = (function() {
    'use strict';
    
    let CardMap = {};
    
    let MainContent = document.querySelector('.main-content');
    let MenuBar = document.querySelector('.menu-bar');
    
    function init() {
        getAppPrefs();
        
        window.addEventListener('storage', AppPrefsChanged);
        window.addEventListener('keydown', handleKeyPress, false);
        document.querySelector('#scrim').addEventListener('click', () => closeAllPopups() );
        document.querySelector('#btnAddCard').addEventListener('click',() => { hideMenu(); showAddCardPrompt(); });
        // document.querySelector('#btnAbout').addEventListener('click', () => { hideMenu(); changeTab('about')(); });
        document.querySelector('#btnSettings').addEventListener('click', () => { hideMenu(); changeTab('settings'); });
        console.log('this', this);

        MainContent = document.querySelector('.main-content');
        MenuBar = document.querySelector('.menu-bar');
        
        changeTab('bookmarks');
    }
    
    function getAppPrefs() {
        AppPrefs = {
            theme: localStorage.getItem('theme') || 'light',
            keyboardShortcuts: localStorage.getItem('keyboardShortcuts') || 'disabled'
        };
        // console.log('AppPrefs', AppPrefs);
        
        changeTheme();
    }
    
    function updatePref(key, val) {
        let oldVal = AppPrefs[key];
        AppPrefs[key] = val;
        
        localStorage.setItem(key, val);
        
        if (oldVal != val) {
            switch (key) {
                case 'theme':
                    changeTheme();
                    break;
            }
        }
    }
    
    function AppPrefsChanged(e) {
        // console.log('AppPrefsChanged', e);
        
        AppPrefs[e.key] = e.newValue;
        
        if (e.key == 'theme' && e.oldValue != e.newValue) {
            changeTheme();
        }
    }
    
    function changeTheme() {
        let theme = 'theme-' + AppPrefs.theme;
		let head = document.getElementsByTagName("head")[0];
        
        //console.log('Applying theme ' + theme);

		// Remove any other theme stylesheets
		let themeList = ["theme-light", "theme-dark", "theme-espresso", "theme-custom"];
		let appsheets = document.getElementsByTagName("link");
		let foundTheme;

		for (let i=0; i < appsheets.length; i++) {
			let sheet = appsheets[i];
			for (let a=0; a < themeList.length; a++) {
				let findTheme = sheet.href.search(themeList[a]);
				if (findTheme > -1 && theme != themeList[a]) {
					console.log("Removing theme: " + themeList[a]);
					foundTheme = themeList[a];
					head.removeChild(sheet);
				}
			}
		}

		if (theme != "theme-light" && theme != foundTheme) {
			// Add the new theme stylesheet
			// console.log("Applying new theme stylesheet: " + theme);
			var e = document.createElement("link");
			e.setAttribute("rel", "stylesheet");
			e.setAttribute("type", "text/css");
			e.setAttribute("href", "css/" + theme + ".css");

			head.appendChild(e);
		}
    }
    
    function createBookmarkCards(cards) {
        // console.log('Creating bookmark cards...');
        
        let self = this;
        ChromeService.getBookmarks().then(function(cards) {
            // console.log(cards);

            // Clear out the main content div
            removeAllChildNodes(MainContent);
        
            if (cards.length == 0) {
                // The user doesn't have any cards set up yet, so display a welcome message
                MainContent.innerHTML = `
                    <div class="welcome-card" ng-show="showWelcomeCard">
                        <h1>Hi</h1>
                        <p>
                            It looks like your don't have any sites saved to Newt yet. That's alright, adding some is easy. There are two main ways of doing so.
                        </p>
                        <p>
                        <h4>Method 1:</h4>
                            Visit whichever site you want to add and right click anywhere on the page. You'll see an option to 'Add to Newt'. There's just one little problem... You need to create some cards first or you'll have nothing to add sites to! That conveniently brings us to...
                        <h4>Method 2:</h4>
                            Open up Chrome's Bookmarks Manager and look for the folder named 'NewtData'. That's where everything is stored. Each top level folder you make in here will display on this page as a card. Any bookmarks in these folders will display in their respective cards.
                        </p>
                        <p>
                            After you've added some things, give this page a quick refresh.
                        </p>
                    </div>
                `;
            }
            
            for (var card of cards) {                
                let ele = document.createElement('small-card');
                ele.className = 'card-container';
                ele.data = {
                    title: card.title,
                    id: card.id,
                    parentId: card.parentId,
                    index: card.index
                };
                
                for (var site of card.children) {
                    let row = document.createElement('card-row');
                    row.id = site.parentId + "_" + site.id;
                    row.data = site;
                    
                    ele.appendChild(row);
                }
                
                MainContent.appendChild(ele);
            }
        });
    }
    
    function createAppCards() {
        ChromeService.getApps().then(function(apps) {
            
            // TODO: More efficient way of sorting this
            let enabled = [];
            let disabled = [];
            
            for (var app of apps) {
                if (app.enabled) {
                    enabled.push(app);
                } else {
                    disabled.push(app);
                }
            }
            
            apps = enabled.concat(disabled);
            
            // Clear out the main content div
            removeAllChildNodes(MainContent);
            
            for (var app of apps) {                
                let ele = document.createElement('app-card');
                ele.className = 'card-container';
                ele.data = app;
                
                MainContent.appendChild(ele);
            }
        });
    }
    
    function createFrequentsCard() {
        ChromeService.getFrequents().then(function(sites) {
            let ele = document.createElement('list-card');
            ele.title = 'Frequents';
            
            for (var i=0; i<sites.length; i++) {
                let row = document.createElement('list-card-row');
                row.title = sites[i].title;
                row.url = sites[i].url;

                ele.appendChild(row);
            }
            
            // Clear out the main content div
            removeAllChildNodes(MainContent);
            
            MainContent.appendChild(ele);
        });
    }
    
    function createRecentlyAddedCard() {
        ChromeService.getRecentlyAdded().then(function(sites) {
            let ele = document.createElement('list-card');
            ele.title = 'Recently Added';
            
            for (var i=0; i<sites.length; i++) {
                let row = document.createElement('list-card-row');
                row.title = sites[i].title;
                row.url = sites[i].url;

                ele.appendChild(row);
            }
            
            // Clear out the main content div
            removeAllChildNodes(MainContent);
            
            MainContent.appendChild(ele);
        });
    }
    
    function createRecentlyClosedCard() {
        ChromeService.getRecentlyClosed().then(function(sites) {
            let ele = document.createElement('list-card');
            ele.title = 'Recently Closed';
            
            for (var i=0; i<sites.length; i++) {
                if (sites[i].tab) {
                    let row = document.createElement('list-card-row');
                    row.title = sites[i].tab.title;
                    row.url = sites[i].tab.url;

                    ele.appendChild(row);
                }
            }
            
            // Clear out the main content div
            removeAllChildNodes(MainContent);
            
            MainContent.appendChild(ele);
        });
    }
    
    function createDeviceCards() {
        ChromeService.getDevices().then(function(devices) {
            
            // Clear out the main content div
            removeAllChildNodes(MainContent);
            
            for (var device of devices) {                
                let card = document.createElement('small-card');
                card.className = 'card-container';
                card.title = device.title;
                
                for (var site of device.sites) {
                    let row = document.createElement('card-row');
                    row.data = site;
                    
                    card.appendChild(row);
                }
                
                MainContent.appendChild(card);
            }
        });
    }
    
    function createSettingsCard() {
        // console.log('Creating settings menu...');
        
        // Clear out the main content div
        removeAllChildNodes(MainContent);
        
        let card = document.createElement('settings-card');
        MainContent.appendChild(card);
    }

    function createAboutCard() {

    }
    
    function changeTab(tab, direction) {
        if (tab == 'menu') {
            toggleMenu();
            return;
        }

        console.log('changeTab', tab);

        // Set the style for the new active tab
        let buttons = MenuBar.querySelectorAll('menu-item');
        
        if (direction) {
            let currentIndex;
            for (let i=0; i<buttons.length; i++) {
                if (buttons[i].selected) {
                    currentIndex = i;
                    break;
                }
            }

            if (direction === 'next') {
                tab = currentIndex + 1 > buttons.length - 2 ? buttons[0].action : buttons[currentIndex + 1].action;
            } else {
                tab = currentIndex - 1 < 0 ? buttons[buttons.length - 2].action : buttons[currentIndex - 1].action;
            }
        }
        
        for (let i=0; i<buttons.length; i++) {
            if (buttons[i].action != 'menu') {
                if (buttons[i].action == tab) {
                    buttons[i].selected = true;
                } else {
                    buttons[i].selected = false;
                }
            }
        }
        
        // Load the tab's content into the main view
        switch (tab) {
            case 'bookmarks':
                createBookmarkCards();
                break;
            case 'apps':
                createAppCards();
                break;
            case 'frequents':
                createFrequentsCard();
                break;
            case 'new':
                createRecentlyAddedCard();
                break;
            case 'recents':
                createRecentlyClosedCard();
                break;
            case 'devices':
                createDeviceCards();
                break;
            case 'menu':
                toggleMenu();
                break;
            case 'settings':
                createSettingsCard();
                break;
            case 'about':
                createAboutCard();
        }
        
        CardMap.currentTab = tab;
        CardMap.tabChanged = true;
    }
    
    function removeAllChildNodes(node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }

    function closeAllPopups() {
        hideMenu();
        hideAddCardPrompt();
    }

    function toggleMenu() {
        if (document.querySelector('#menu').style.display == 'block') {
            document.querySelector('#menu').style.display = 'none';
            document.querySelector('#scrim').style.display = 'none';
        } else {
            
            document.querySelector('#menu').style.display = 'block';
            document.querySelector('#scrim').style.display = 'block';
        }
    }

    function hideMenu() {
        document.querySelector('#menu').style.display = 'none';
        document.querySelector('#scrim').style.display = 'none';
    }
    
    function handleKeyPress(ev) {
        // console.log('keypress', ev);
        
        if (AppPrefs.keyboardShortcuts === 'disabled') {
            return;
        }
        
        switch (ev.code) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                ev.preventDefault();
                navigateCardMap(ev.code);
                break;
            case 'Enter':
                if (CardMap.currentActive) {
                    let item = CardMap.currentActive;
                    
                    if (CardMap.currentTab === 'apps') {
                        if (item.row.data.appLaunchUrl) {
                            ChromeService.updateTab(item.row.data.appLaunchUrl);
                        } else {
                            ChromeService.openApp(item.row.data.id);
                        }
                    } else {
                        let url = item.row.url || item.row.data.url;
                        ChromeService.updateTab(url);
                    }
                }
                break;
            case 'Escape':
                if (CardMap.currentActive) {
                    CardMap.currentActive.row.highlight = false;
                    CardMap.currentActive = null;
                }
        }
    }
    
    function navigateCardMap(key) {
        if (CardMap.tabChanged) {
            let cardType;
            let tab = CardMap.currentTab;
            switch (tab) {
                case 'bookmarks':
                case 'devices':
                    cardType = 'small-card';
                    break;
                case 'frequents':
                case 'new':
                case 'recents':
                    cardType = 'list-card';
                    break;
                case 'apps':
                    cardType = 'app-card';
                    break;
            }
            CardMap = generateCardMap(cardType);
            CardMap.currentTab = tab;
            // console.log('Generated CardMap:', CardMap);
        }
        
        if (CardMap.currentActive === null) {
            switch (key) {
                case 'ArrowUp':
                    changeTab(null, 'previous');
                    break;
                case 'ArrowDown':
                    changeTab(null, 'next');
                    break;
                case 'ArrowRight':
                    CardMap.currentActive = {
                        row: CardMap.data[0][0],
                        indexX: 0,
                        indexY: 0
                    }
                    CardMap.currentActive.row.highlight = true;
            }
            
           
        } else {
            CardMap.currentActive.row.highlight = false;
            
            let a = CardMap.currentActive;
            let data = CardMap.data;
            
            switch (key) {
                case 'ArrowUp':
                    a.indexY = a.indexY === 0 ? data[a.indexX].length - 1 : (a.indexY - 1);
                    break;
                case 'ArrowDown':
                    a.indexY = a.indexY === data[a.indexX].length - 1 ? 0 : (a.indexY + 1);
                    break;
                case 'ArrowLeft':
                    if (a.indexX === 0) {
                        a = null;
                        CardMap.currentActive = null;
                        
                    } else {
                        a.indexX--;
                        
                        let highestIndex = data[a.indexX].length - 1;
                        a.indexY = a.indexY <= highestIndex ? a.indexY : highestIndex;
                    }
                    break;
                case 'ArrowRight':
                    let lastX = data.length - 1;
                    if (a.indexX < lastX) {
                        a.indexX++;
                        
                        let highestIndex = data[a.indexX].length - 1;
                        a.indexY = a.indexY <= highestIndex ? a.indexY : highestIndex;
                    }
                    break;
            }

            if (a) {
                a.row = data[a.indexX][a.indexY];
                a.row.highlight = true;
            }
        }

        if (CardMap.currentActive) {
            // We need to make sure the card and row are both in full view
            if (CardMap.currentTab === 'apps') {
                let main = CardMap.currentActive.row.parentNode;
                let card = CardMap.currentActive.row;
                
                main.scrollTop = card.offsetTop + card.clientHeight - main.clientHeight;
            } else if (CardMap.currentTab === 'bookmarks' || CardMap.currentTab === 'devices') {
                let main = CardMap.currentActive.row.parentNode.parentNode;
                let card = CardMap.currentActive.row.parentNode;
                let container = CardMap.currentActive.row.parentNode.$container;
                let row = CardMap.currentActive.row;
                
                main.scrollTop = card.offsetTop + card.clientHeight - main.clientHeight;
                
                if (row.offsetTop > container.clientHeight) {
                    container.scrollTop = row.offsetTop - card.offsetTop - container.clientHeight;
                } else {
                    container.scrollTop = 0;
                }
            } else {
                let container = CardMap.currentActive.row.parentNode.$container;
                let row = CardMap.currentActive.row;
                
                if (row.offsetTop > container.clientHeight) {
                    container.scrollTop = row.offsetTop - container.clientHeight;
                } else {
                    container.scrollTop = 0;
                }
            }
        }
    }
    
    function generateCardMap(cardType) {
        let map = {
            data: [],
            currentActive: null,
            currentTab: null,
            tabChanged: false
        };
        
        let cards = document.querySelectorAll(cardType);
         
        for (let i=0; i<cards.length; i++) {
            let data = cardType === 'app-card' ? [cards[i]] : cards[i].children;
            map.data.push(data);
        }
        
        return map;
    }

    function showAddCardPrompt() {
        var prompt = document.createElement('prompt-box');
        prompt.id = 'newCardPrompt';

        document.body.appendChild(prompt);
        document.querySelector('#scrim').style.display = 'block';
    }

    function hideAddCardPrompt() {
        if (document.querySelector('#newCardPrompt')) {
            document.querySelector('#newCardPrompt').remove();
        }
        document.querySelector('#scrim').style.display = 'none';
    }

    function createNewCard(name) {
        hideAddCardPrompt();
        ChromeService.createFolder(name).then(function(card) {

            let ele = document.createElement('small-card');
            ele.className = 'card-container';
            ele.data = {
                title: card.title,
                id: card.id,
                parentId: card.parentId,
                index: card.index
            };
            
            MainContent.appendChild(ele);
        });
    }

    function openAbout() {

    }

    function openSettings() {
        this.createSettingsCard();
    }
    
    return({
        init: init,
        changeTab: changeTab,
        updatePref: updatePref,
        toggleMenu: toggleMenu,
        hideMenu: hideMenu,
        hideAddCardPrompt: hideAddCardPrompt,
        createNewCard: createNewCard
    })
})();

Newt.init();