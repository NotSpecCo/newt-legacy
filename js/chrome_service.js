let ChromeService = (function() {
    'use strict';
    
    function getBookmarks() {
        // console.log("Getting bookmarks");
        
        chrome.promise = new ChromePromise();
        var deferred = Promise.defer();

        chrome.promise.bookmarks.search("NewtData").then(function(res) {
            if (res.length > 0) {
                return chrome.promise.bookmarks.getSubTree(res[0].id);
            } else {
                var folder = {
                    title: "NewtData"
                };

                chrome.bookmarks.create(folder, function(res){
                    // console.log("Created NewtData:");
                    // console.log(res);
                });

                deferred.resolve([]);
            }
        }).then(function(res) {
            deferred.resolve(res[0].children);
        }).catch(function(error) {
            console.log("Error: " + error);
        });

        return deferred.promise;
    }
    
    function getApps() {
        // console.log('Getting apps');
        
        chrome.promise = new ChromePromise();
        var deferred = Promise.defer();

        chrome.promise.management.getAll().then(function(res) {
            var apps = [];

            for (var item of res) {
                if (item.isApp) {
                    apps.push(item);
                }
            }

            var compare = function(a,b) {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            };
            apps.sort(compare);

            deferred.resolve(apps);
        });

        return deferred.promise;
    }
    
    function getFrequents() {
        chrome.promise = new ChromePromise();
        var deferred = Promise.defer();

        chrome.promise.topSites.get().then(function(res) {
            // console.log(res);

            deferred.resolve(res);
        });

        return deferred.promise;
    }
    
    function getRecentlyAdded() {
        chrome.promise = new ChromePromise();
        var deferred = Promise.defer();

        chrome.promise.bookmarks.getRecent(40).then(function(res) {
            // console.log(res);

            deferred.resolve(res);
        });

        return deferred.promise;
    };

    function getRecentlyClosed() {
        chrome.promise = new ChromePromise();
        var deferred = Promise.defer();

        chrome.promise.sessions.getRecentlyClosed().then(function(res) {
            // console.log(res);

            deferred.resolve(res);
        });

        return deferred.promise;
    }

    function getDevices() {
        chrome.promise = new ChromePromise();
        var deferred = Promise.defer();

        chrome.promise.sessions.getDevices().then(function(res) {
            // console.log(res);

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

            deferred.resolve(cards);
        });

        return deferred.promise;
    }
    
    function moveBookmark(bookmark, folder, index) {
        // console.log("Moving bookmark\nid: " + bookmark + "\nparentId: " + folder + "\nindex: " + index);
        chrome.bookmarks.move(bookmark, {parentId: folder, index: index});
    }
    
    function updateTab(url) {
        chrome.tabs.update({url: url});
    }
    
    function openNewTab(url) {
        chrome.tabs.create({url: url});
    }
    
    function openApp(id) {
        chrome.management.launchApp(id);
    }

    return ({
        getBookmarks: getBookmarks,
        getApps: getApps,
        getFrequents: getFrequents,
        getRecentlyAdded: getRecentlyAdded,
        getRecentlyClosed: getRecentlyClosed,
        getDevices: getDevices,
        moveBookmark: moveBookmark,
        updateTab: updateTab,
        openNewTab: openNewTab,
        openApp: openApp
    });

})();