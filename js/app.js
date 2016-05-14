let AppPrefs = {};

var Newt = (function() {
    'use strict';
    
    // var AppPrefs = {};
    let MainContent = document.querySelector('.main-content');
    let MenuBar = document.querySelector('.menu-bar');
    let X = 1;
    
    function init() {
        getAppPrefs();
        
        window.addEventListener('storage', AppPrefsChanged);
        window.addEventListener('keydown', handleKeyPress, false);
        
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
        // console.log('Creating app cards...');
        
        let self = this;
        
        ChromeService.getApps().then(function(apps) {
            // console.log(apps);
            
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
        // console.log('Creating frequents card...');
        
        let self = this;
        
        ChromeService.getFrequents().then(function(sites) {
            // console.log(sites);
            let ele = document.createElement('list-card');
            ele.title = 'Frequents';
            ele.sites = sites;
            
            // Clear out the main content div
            removeAllChildNodes(MainContent);
            
            MainContent.appendChild(ele);
        });
    }
    
    function createRecentlyAddedCard() {
        // console.log('Creating recently added card...');
        
        let self = this;
        
        ChromeService.getRecentlyAdded().then(function(sites) {
            // console.log(sites);
            let ele = document.createElement('list-card');
            ele.title = 'Recently Added';
            ele.sites = sites;
            
            // Clear out the main content div
            removeAllChildNodes(MainContent);
            
            MainContent.appendChild(ele);
        });
    }
    
    function createRecentlyClosedCard() {
        // console.log('Creating recently closed card...');
        
        let self = this;
        
        ChromeService.getRecentlyClosed().then(function(sites) {
            // console.log(sites);
            let ele = document.createElement('list-card');
            ele.title = 'Recently Closed';
            ele.sites = sites;
            
            // Clear out the main content div
            removeAllChildNodes(MainContent);
            
            MainContent.appendChild(ele);
        });
    }
    
    function createDeviceCards() {
        // console.log('Creating devices cards...');
        
        let self = this;
        
        ChromeService.getDevices().then(function(devices) {
            // console.log(devices);
            
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
    
    function createSettingsMenu() {
        // console.log('Creating settings menu...');
        
        // Clear out the main content div
        removeAllChildNodes(MainContent);
        
        let card = document.createElement('settings-card');
        MainContent.appendChild(card);
    }
    
    function changeTab(tab) {
        // console.log('changeTab', tab);

        // Set the style for the new active tab
        let buttons = MenuBar.querySelectorAll('menu-item');
        
        for (let i=0; i<buttons.length; i++) {
            if (buttons[i].action != 'settings') {
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
            case 'settings':
                createSettingsMenu();
                break;
        }
        
    }
    
    function removeAllChildNodes(node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }
    
    function handleKeyPress(ev) {
        console.log('keypress', ev);
    }
    
    return({
        init: init,
        changeTab: changeTab,
        updatePref: updatePref
    })
})();

Newt.init();