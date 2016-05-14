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
                padding: 10px 10px;
                border-bottom: 1px solid #eaeaea;
            }
            
            .settings-row .main {
                display: flex;
                flex-direction: row;
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
                        <option value='light' selected>Light</option>
                        <option value='dark'>Dark</option>
                        <option value='espresso'>Espresso</option>
                        <!-- <option value='custom'>Custom*</option> -->
                    </select>
                </div>
                <div class='description' id='descTheme'>
                    * This is an advanced feature! To use a custom theme, write your CSS in a file named "theme-custom.css" and place it in Newt's /css folder.
                </div>
            </div>
            <div class='settings-row'>
                <div class='main'>
                    <div class='label'>Keyboard Shortcuts</div>
                    <select id='prefKeyboardShortcuts' name='keyboardShortcuts'>
                        <option value='disabled' selected>Disabled</option>
                        <option value='enabled'>Enabled</option>
                    </select>
                </div>
                <div class='description' id='descKeyboardShortcuts'>
                    
                </div>
            </div>
        </div>
    `;
    
    class SettingsCard extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$card = this.shadowRoot.querySelector('.card');
            this.$prefTheme = this.shadowRoot.querySelector('#prefTheme');
            this.$prefKeyboardShortcuts = this.shadowRoot.querySelector('#prefKeyboardShortcuts');
            
            // Add event listeners to save changes to preferences
            this.$prefTheme.addEventListener('change', this.prefChanged.bind(this));
            this.$prefKeyboardShortcuts.addEventListener('change', this.prefChanged.bind(this));
            
            this.$prefTheme.value = Newt.prefs.theme;
            this.$prefKeyboardShortcuts.value = Newt.prefs.keyboardShortcuts;
        }
        
        prefChanged(ev) {
            let element = ev.target;
            
            if (element.name == 'theme') {
                let display = element.value == 'custom' ? 'block' : 'none';
                this.shadowRoot.querySelector('#descTheme').style.display = display;
            }
            
            Newt.updatePref(element.name, element.value);
        }

    }
    
    document.registerElement('settings-card', SettingsCard);
})();