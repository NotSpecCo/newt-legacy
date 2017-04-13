(function () {
    'use strict';

    let template = `
        <style>
            @import url('css/shared.css');

            a {
                color: var(--accent-color);
            }
            
            .card {
                display: flex;
                flex-direction: column;
                background-color: var(--background-color);
                margin: 10px auto;
                padding: 10px;
                vertical-align: top;
                box-shadow: 0px 2px 3px var(--shadow-color);
                border-radius: 5px;
                overflow: hidden;
                min-height: 375px;
                max-width: 800px;
                font-size: 16px;
            }

            .card-title {
                font-size: 22px;
                font-weight: 400;
                color: var(--accent-color);
                margin-bottom: 5px;
                overflow: ellipses;
                text-overflow: ellipses;
                white-space: nowrap;
            }

            .subtitle {
                font-weight: normal;
            }
            
        </style>
        
        <div class='card'>
            <div class='card-title'>About</div>

            <p>
                Newt was designed to be a simple, lightweight replacement for Google Chrome's New Tab page. It gives you easy access to your favorite websites and apps without any of that other clutter or special effects. Newt is developed and maintained by Garrett Downs. Want to get in contact with me? Feel free to <a href="mailto:garrettdowns@gmail.com">drop me an email</a>, <a href="https://twitter.com/choorp" target="_blank">tweet me</a>, or leave a comment on the <a href="https://chrome.google.com/webstore/detail/newt-a-better-new-tab/foegdfijkhoodfijcpgpffodjanmdbmh/support" target="_blank">Chrome Web Store</a>. I welcome all feedback!
            </p>

            <h3 class="subtitle">Changelog</h3>

            <u>5.6.3</u>
            <ul>
                <li>Bug fixes</li>
            </ul>

            <u>5.6.2</u>
            <ul>
                <li>Bug fixes</li>
            </ul>

            <u>5.6.0</u>
            <ul>
                <li>Added: About card. You can access it from the popup menu.</li>
                <li>Added: Settings sync! Newt now stores your preferences and custom themes using Chrome's storage sync. This means that if you change someting here, it'll be reflected on your other computers running Newt and signed into the same Google account. Please visit the Settings page for more information.</li>
            </ul>

            <u>5.5.3</u>
            <ul>
                <li>Better temporary fix for favicon issue that should work for all sites.</li>
            </ul>

            <u>5.5.2</u>
            <ul>
                <li>Temporary, partial fix for broken website icons until I can write  proper fix.</li>
            </ul>

            <u>5.5.1</u>
            <ul>
                <li>Fixed: Device cards were being displayed with a header color.</li>
            </ul>

            <u>5.5.0</u>
            <ul>
                <li>Added: You can now rename cards</li>
                <li>Added: New theme options! You can set a background color for each card header, making it easier to organize them. You can set five different color styles for each custom theme. Visit the Theme Builder to define these styles. Right-click a card header to choose a color and/or rename the card.</li>
                <li>Modified: When creating a new theme, the currently selected theme is used as the base. This makes it very easy to make tweaks to existing themes without having to start from scratch.</li>
                <li>Added: New default theme, Basic.</li>
                <li>Fixed: Some style issues, bugs.</li>
            </ul>

            <u>5.4.0</u>
            <ul>
                <li>Added: New menu when you right-click a site on the main page with actions like Rename and Delete.</li>
                <li>Added: Rename sites. Right-click a site and then click Rename. Enter the new name and press Enter. The Escape key will cancel this action.</li>
                <li>Added: Delete sites. There is now another way to delete sites from cards. Right-click a site and then click Delete. There is no confirmation prompt, so be sure you want to delete it.</li>
                <li>Added: Middle-click on a site to open it as a new tab in the background. Alt (Option on Mac) + middle-click to open as a new tab and switch to it.</li>
            </ul>

            <u>5.3.3</u>
            <ul>
                <li>Added: Drag cards on the main page to reorder them.</li>
                <li>Added: Drag cards or sites to the top right of the screen to delete them. When deleting a card, you'll get a confirmation prompt before it is actually deleted.</li>
                <li>Modified: Changed some curor styles to better represent the action taken when clicking on things.</li>
            </ul>

            <u>5.3.2</u>
            <ul>
                <li>Fixes to prevent the app from breaking in a future Chrome update.</li>
                <li>Performance improvements.</li>
            </ul>

            <u>5.3.1</u>
            <ul>
                <li>You can now edit themes that you've built.</li>
                <li>Added two new stock themes, Slate and Mocha.</li>
                <li>Improved styling on some elements.</li>
                <li>Bug fixes.</li>
            </ul>

            <u>5.3.0</u>
            <ul>
                <li>Added: Theme builder. This update's big feature is a brand new theme builder. Yes, it's back! It works very similarly to the old one, with some nice improvements. In short, better customization and you can build as many as you'd like. Please see above for more information.</li>
                <li>Added: 'Add New Card' button. In the overflow menu, you'll find a new option that will let you add new cards right from the app. No more having to go all the way to Chrome Bookmark Manager.</li>
                <li>Of course, there are a handful of tweaks and fixes behind the scenes to improve your experience.</li>
            </ul>

            <u>5.2.5</u>
            <ul>
                <li>Keyboard navigation! You can now use a keyboard to navigate around Newt. Switching tabs, moving within and in between different cards, it's all there. Just use the arrow keys after enabling it in the settings.</li>
                <li>Fixed drag-and-drop so you can drag sites to an empty card.</li>
                <li>General optimization and code cleanup.</li>
            </ul>

            <u>5.2.3</u>
            <ul>
                <li>Added Espresso theme</li>
            </ul>

            <u>5.2.1</u>
            <ul>
                <li>Optimization! Making things smaller and faster.</li>
            </ul>

            <u>5.2.0</u>
            <ul>
                <li>Complete rewrite using only vanilla Javascript and some goodies from ES2015</li>
                <li>Smaller and faster</li>
                <li>Dark theme! This was a popular request. Thanks to all who wrote me about it.</li>
            </ul>

            <u>5.0.1</u>
            <ul>
                <li>Initial release</li>
            </ul>
        </div>
    `;

    class SettingsCard extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
        }
    }

    document.registerElement('about-card', SettingsCard);
})();