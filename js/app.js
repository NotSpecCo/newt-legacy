let AppPrefs = {};

var Newt = (function() {
    'use strict';
    
    let CardMap = {};
    let CurrentlyActiveTab = null;
    let EditingTheme = false;
    let EditingThemeID = null;
    
    let MainContent = document.querySelector('.main-content');
    let MenuBar = document.querySelector('.menu-bar');
    
    function init() {
        getAppPrefs();
        
        window.addEventListener('storage', AppPrefsChanged);
        window.addEventListener('keydown', handleKeyPress, false);
        document.querySelector('#scrim').addEventListener('click', () => closeAllPopups() );

        // Popup Menu
        document.querySelector('#btnAddCard').addEventListener('click',() => { hideMenu(); showAddCardPrompt(); });
        // document.querySelector('#btnAbout').addEventListener('click', () => { hideMenu(); changeTab('about')(); });
        document.querySelector('#btnSettings').addEventListener('click', () => { hideMenu(); changeTab('settings'); });

        // Theme Builder
        document.querySelector('#btnSaveTheme').addEventListener('click', saveCustomTheme);
        document.querySelector('#btnCancelTheme').addEventListener('click', cancelCustomTheme);

        MainContent = document.querySelector('.main-content');
        MenuBar = document.querySelector('.menu-bar');
        
        changeTab('bookmarks');
    }
    
    function getAppPrefs() {
        let baseThemes = [
            {
                name: 'Light',
                id: 'light',
                styles: [
                    {name: 'main-background-color', val: '#efefef'},
                    {name: 'background-color', val: '#fff'},
                    {name: 'main-color', val: '#03A9F4'},
                    {name: 'accent-color', val: '#03A9F4'},
                    {name: 'highlight-color', val: '#E3F2FD'},
                    {name: 'text-color', val: '#212121'},
                    {name: 'shadow-color', val: '#aaa'},
                    {name: 'divider-color', val: 'rgba(0,0,0,.1)'},
                    {name: 'sidebar-icon-color', val: 'rgba(255, 255, 255, 1)'},
                    {name: 'popup-icon-color', val: 'rgba(0, 0, 0, 0.54)'},
                ]
            },
            {
                name: 'Dark',
                id: 'dark',
                styles: [
                    {name: 'main-background-color', val: '#222'},
                    {name: 'background-color', val: '#333'},
                    {name: 'main-color', val: '#111'},
                    {name: 'accent-color', val: '#fff'},
                    {name: 'highlight-color', val: '#2a2a2a'},
                    {name: 'text-color', val: '#ccc'},
                    {name: 'shadow-color', val: '#111'},
                    {name: 'divider-color', val: 'rgba(255,255,255,.1)'},
                    {name: 'sidebar-icon-color', val: 'rgba(255, 255, 255, 1)'},
                    {name: 'popup-icon-color', val: 'rgba(255, 255, 255, .8)'},
                ]
            },
            {
                name: 'Espresso',
                id: 'espresso',
                styles: [
                    {name: 'main-background-color', val: '#231b17'},
                    {name: 'background-color', val: '#1d1713'},
                    {name: 'main-color', val: '#1d1713'},
                    {name: 'accent-color', val: '#e36026'},
                    {name: 'highlight-color', val: '#2d241f'},
                    {name: 'text-color', val: '#bdae9d'},
                    {name: 'shadow-color', val: 'rgba(0,0,0,0)'},
                    {name: 'divider-color', val: 'rgba(0,0,0,.1)'},
                    {name: 'sidebar-icon-color', val: 'rgba(255, 255, 255, 1)'},
                    {name: 'popup-icon-color', val: 'rgba(255, 255, 255, .8)'},
                ]
            }
        ];

        let customThemes = JSON.parse(localStorage.getItem('customThemes')) || [];
        let allThemes = baseThemes.concat(customThemes);

        let selectedTheme = localStorage.getItem('theme') || 'light';

        AppPrefs = {
            theme: selectedTheme,
            keyboardShortcuts: localStorage.getItem('keyboardShortcuts') || 'disabled',
            baseThemes: baseThemes,
            customThemes: customThemes
        };
        
        changeTheme(AppPrefs.theme);
    }
    
    function updatePref(key, val) {
        let oldVal = AppPrefs[key];
        AppPrefs[key] = val;
        // console.log('updatePref', key, val);
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
    
    function changeTheme(theme) {
        let themeID = theme || AppPrefs.theme;
        let allThemes = AppPrefs.baseThemes.concat(AppPrefs.customThemes);
        let selectedTheme = allThemes.find(theme => {return theme.id == themeID});

        selectedTheme.styles.forEach(function(style) {
            document.documentElement.style.setProperty('--' + style.name, style.val);
        });
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
                        First, you're going to have to create some cards to add sites to. To do so, just click the overflow menu in the bottom left of your screen and then 'Add New Card'. Give it a name and it'll show up below. Now, to add a site, you have a couple options.
                        <h4>Method 1:</h4>
                            Visit whichever site you want to add and right click anywhere on the page. You'll see an option to 'Add to Newt'. Choose a card, confirm the title you want, and submit.
                        <h4>Method 2:</h4>
                            Open up Chrome's Bookmarks Manager and look for the folder named 'NewtData' in Other Bookmarks. That's where everything is stored. Each top level folder you make in here will display on this page as a card. Any bookmarks in these folders will display in their respective cards.
                        </p>
                        <p>
                            After you've added some things, give this page a quick refresh.
                        </p>
                    </div>
                `;
            }
            
            for (var card of cards) { 
                // console.log('Card', card);

                if (!card.children) {
                    console.warn('Found malformed card: ', card);
                    continue;
                }

                let ele = document.createElement('small-card');
                ele.className = 'card-container';
                ele.data = {
                    title: card.title,
                    id: card.id,
                    parentId: card.parentId,
                    index: card.index
                };
                
                for (var site of card.children) {
                    // Check to make this isn't a folder. They don't have the url property.
                    if (site.url) {
                        let row = document.createElement('card-row');
                        row.id = site.parentId + "_" + site.id;
                        row.data = site;
                        
                        ele.appendChild(row);
                    }
                    
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

        // console.log('changeTab', tab);
        CurrentlyActiveTab = tab;

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
    
    function openThemeBuilder(editing, themeID) {
        document.querySelector('.theme-builder').style.display = 'flex';

        let styles = [];

        if (editing && typeof editing == 'boolean') {
            EditingTheme = true;
            EditingThemeID = themeID;

            let theme = AppPrefs.customThemes.find(function(x) { return x.id == themeID});

            styles = theme.styles;
            document.querySelector('#inpThemeName').value = theme.name;
            changeTheme(themeID);
        } else {
            styles = AppPrefs.baseThemes[0].styles;
            changeTheme('light');
        }
        

        let ThemeSettings = document.querySelector('.theme-settings');
        removeAllChildNodes(ThemeSettings);

        styles.forEach(function(style) {
            let row = document.createElement('color-row');
            row.colorID = style.name;
            row.color = style.val;

            ThemeSettings.appendChild(row);
        });
    }

    function closeThemeBuilder() {
        document.querySelector('.theme-builder').style.display = 'none';
    }

    function saveCustomTheme() {
        // console.log('AppPrefs', AppPrefs);

        let abortSave = false;

        var themeName = document.querySelector('#inpThemeName').value;
        if (themeName.length == 0) {
            abortSave = true;
        }

        var colorRows = document.querySelectorAll('color-row');
        var styles = [];
        for (let i=0; i<colorRows.length; i++) {
            let item = colorRows[i];

            if (item.color.length == 0) {
                abortSave = true;
            }

            styles.push({
                name: item.colorID,
                val: item.color
            });
        }

        let themeID;
        if (AppPrefs.customThemes.length == 0) {
            themeID = 'customtheme1';
        } else {
            let lastTheme = AppPrefs.customThemes[AppPrefs.customThemes.length-1].id.slice(11);
            themeID = 'customtheme' + (parseInt(lastTheme) + 1);
        }
        
        if (!abortSave) {
            if (EditingTheme) {
                let index = AppPrefs.customThemes.findIndex(function(x){return x.id == EditingThemeID});

                AppPrefs.customThemes[index].name = themeName;
                AppPrefs.customThemes[index].styles = styles;
            } else {
                AppPrefs.customThemes.push({
                    name: themeName,
                    id: themeID,
                    styles: styles
                });
                AppPrefs.theme = themeID;
            }
            

            localStorage.setItem('customThemes', JSON.stringify(AppPrefs.customThemes));
            // console.log('AppPrefs.customThemes', AppPrefs.customThemes);

            changeTheme();

            document.querySelector('#inpThemeName').value = '';
            EditingTheme = false;
            EditingThemeID = null;

            if (document.querySelector('settings-card') != null) {
                document.querySelector('settings-card').refreshThemes();
            }

            closeThemeBuilder();
        } else {
            console.warn('Custom theme wasn\'t saved. Missing info.', themeName, themeID, styles);
        }
    }

    function cancelCustomTheme() {
        document.querySelector('#inpThemeName').value = '';
        EditingTheme = false;
        EditingThemeID = null;

        changeTheme();
        closeThemeBuilder();
    }

    function deleteTheme(theme) {
        var index = AppPrefs.customThemes.map(function(x){return x.id}).indexOf(theme);
        AppPrefs.customThemes.splice(index, 1);

        localStorage.setItem('customThemes', JSON.stringify(AppPrefs.customThemes));

        AppPrefs.theme = 'light';
        changeTheme();

        if (document.querySelector('settings-card') != null) {
            document.querySelector('settings-card').refreshThemes();
        }
    } 

    function removeAllChildNodes(node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }

    function closeAllPopups() {
        hideMenu();
        hideAddCardPrompt();
        hideConfirmPrompt();
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

        let targetNode = ev.target.nodeName.toLowerCase();
        if (targetNode == "prompt-add-card" ||
            targetNode == 'input' ||
            targetNode == 'color-row') {
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
        let prompt = document.createElement('prompt-add-card');
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
            
            if (CurrentlyActiveTab == 'bookmarks') {
                MainContent.appendChild(ele);
            }
        });
    }

    function openAbout() {

    }

    function openSettings() {
        this.createSettingsCard();
    }

    function showConfirmPrompt(message, confirmAction, data) {
        let prompt = document.createElement('prompt-confirm');
        prompt.id = 'confirmPrompt';
        prompt.message = message;
        prompt.confirmAction = confirmAction;
        prompt.data = data;

        document.body.appendChild(prompt);
        document.querySelector('#scrim').style.display = 'block';
    }

    function hideConfirmPrompt() {
        if (document.querySelector('#confirmPrompt')) {
            document.querySelector('#confirmPrompt').remove();
        }
        document.querySelector('#scrim').style.display = 'none';
    }
    
    return({
        init: init,
        changeTab: changeTab,
        updatePref: updatePref,
        toggleMenu: toggleMenu,
        hideMenu: hideMenu,
        hideAddCardPrompt: hideAddCardPrompt,
        showConfirmPrompt: showConfirmPrompt,
        hideConfirmPrompt: hideConfirmPrompt,
        closeAllPopups: closeAllPopups,
        createNewCard: createNewCard,
        openThemeBuilder: openThemeBuilder,
        deleteTheme: deleteTheme
    })
})();

Newt.init();