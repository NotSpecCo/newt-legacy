/* global ChromeService */
'use strict';

(function() {
    let template = `
        <style>
            .card {
                display: flex;
                flex-direction: column;
                background-color: #fff;
                margin: 10px auto;
                padding: 10px;
                vertical-align: top;
                box-shadow: 0px 2px 3px #aaa;
                border-radius: 5px;
                overflow: hidden;
                min-height: 375px;
                max-width: 800px;
            }

            .card-title {
                font-size: 22px;
                font-weight: 400;
                color: #03A9F4;
                // padding: 10px 10px 5px 10px;
                margin-bottom: 5px;
                overflow: ellipses;
                text-overflow: ellipses;
                /*text-align: center;*/
                white-space: nowrap;
                /*background-color: #29B6F6;*/
            }
            
            .settings-row {
                // display: flex;
                // flex-direction: row;
                padding: 10px 10px;
                border-bottom: 1px solid #eaeaea;
            }
            
            .main {
                display: flex;
                flex-direction: row;
                // padding: 10px 10px;
                // border-bottom: 1px solid #eaeaea;
            }
            
            .settings-row .label {
                flex: 1;
                font-size: 16px;
            }
            
            .settings-row .description {
                margin-top: 10px;
                display: none;
            }
        </style>
        
        <div class='card'>
            <div class='card-title'>Settings</div>
            <div class='settings-row'>
                <div class='main'>
                    <div class='label'>Theme</div>
                    <select id='prefTheme' name='theme'>
                        <option value='light'>Light</option>
                        <option value='dark'>Dark</option>
                        <option value='espresso'>Espresso</option>
                        <option value='custom'>Custom*</option>
                    </select>
                </div>
                <div class='description' id='themeDesc'>
                    * This is an advanced feature! To use a custom theme, write your CSS in a file named "theme-custom.css" and place it in Newt's /css folder.
                </div>
            </div>
        </div>
    `;
    
    class SettingsCard extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$card = this.shadowRoot.querySelector('.card');
            this.$theme = this.shadowRoot.querySelector('#prefTheme');
            
            // Add event listeners to save changes to preferences
            this.$theme.addEventListener('change', this.prefChanged.bind(this));
            
            // TODO: This is not a good way to handle this. Improve before adding more settings
            if (Newt.prefs.theme == 'dark') {
                this.$theme.selectedIndex = 1;
            } else if (Newt.prefs.theme == 'espresso') {
                this.$theme.selectedIndex = 2;
            } else if (Newt.prefs.theme == 'custom') {
                this.$theme.selectedIndex = 3;
                this.shadowRoot.querySelector('#themeDesc').style.display = 'block';
            } else {
                this.$theme.selectedIndex = 0;
            }
        }
        
        prefChanged(ev) {
            console.log(ev.target);
            let element = ev.target;
            
            if (element.name == 'theme') {
                console.log(this);
                let display = element.value == 'custom' ? 'block' : 'none';
                this.shadowRoot.querySelector('#themeDesc').style.display = display;
            }
            
            Newt.updatePref(element.name, element.value);
        }

    }
    
    document.registerElement('settings-card', SettingsCard);
})();