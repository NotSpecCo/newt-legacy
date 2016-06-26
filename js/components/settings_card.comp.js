(function() {
    'use strict';
    
    let template = `
        <style>
            @import url('css/shared.css');

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
            
            .settings-row {
                padding: 10px 10px;
                border-bottom: 1px solid var(--divider-color);
            }
            
            .settings-row .main {
                display: flex;
                flex-direction: row;
            }
            
            .settings-row .label {
                flex: 1;
                font-size: 16px;
            }
            
            .settings-row i {
                margin-left: 10px;
                cursor: pointer;
            }

            .settings-row i:hover {
                color: var(--accent-color);
            }

            .settings-row .description {
                margin-top: 10px;
                display: none;
            }

            .button {
                color: var(--accent-color);
                padding: 8px 15px;
                float: right;
                font-size: 15px;
                cursor: pointer;
                text-align: center;
            }

            .button:hover {
                background-color: var(--highlight-color);
            }
        </style>
        
        <div class='card'>
            <div class='card-title'>Settings</div>
            <div class='settings-row'>
                <div class='main'>
                    <div class='label'>Theme</div>
                    <select id='prefTheme' name='theme'>
                        
                    </select>
                    <i id="iconAddTheme" class="material-icons md-24" title="Build a new theme">add</i>
                    <i id="deleteTheme" class="material-icons md-24" title="Delete currently selected theme">delete</i>
                </div>
                <div class='description' id='descTheme'>
                    
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
            this.$iconAddTheme = this.shadowRoot.querySelector('#iconAddTheme');
            this.$deleteTheme = this.shadowRoot.querySelector('#deleteTheme');
            
            // Event listeners
            this.$prefTheme.addEventListener('change', this.prefChanged.bind(this));
            this.$iconAddTheme.addEventListener('click', Newt.openThemeBuilder);
            this.$deleteTheme.addEventListener('click', () => {
                if (this.$prefTheme.value.indexOf('customtheme') > -1) {
                    Newt.showConfirmPrompt('Are you sure you want to delete this theme?', 'deleteTheme', this.$prefTheme.value);
                }
            });
            this.$prefKeyboardShortcuts.addEventListener('change', this.prefChanged.bind(this));
            
            let self = this;

            let allThemes = AppPrefs.baseThemes.concat(AppPrefs.customThemes);
            allThemes.forEach(function(theme) {
                let option = document.createElement('option');
                option.value = theme.id;
                option.innerText = theme.name;

                self.$prefTheme.appendChild(option);
            });

            this.$prefTheme.value = AppPrefs.theme;
            this.$prefKeyboardShortcuts.value = AppPrefs.keyboardShortcuts;
        }
        
        prefChanged(ev) {
            let element = ev.target;
            // console.log()
            Newt.updatePref(element.name, element.value);
        }

        refreshThemes() {
            while (this.$prefTheme.lastChild) {
                this.$prefTheme.removeChild(this.$prefTheme.lastChild);
            }

            let self = this;
            let allThemes = AppPrefs.baseThemes.concat(AppPrefs.customThemes);
            allThemes.forEach(function(theme) {
                let option = document.createElement('option');
                option.value = theme.id;
                option.innerText = theme.name;

                self.$prefTheme.appendChild(option);
            });

            this.$prefTheme.value = AppPrefs.theme;

            Newt.updatePref('theme', AppPrefs.theme);
        }

    }
    
    document.registerElement('settings-card', SettingsCard);
})();