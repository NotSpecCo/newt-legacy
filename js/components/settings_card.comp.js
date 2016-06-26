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
                line-height: 32px;
            }
            
            .settings-row i {
                margin-right: 10px;
                cursor: pointer;
                line-height: 32px;
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
                    <span class='label'>Theme</span>
                    <i id="iconDeleteTheme" class="material-icons md-24" title="Delete the currently selected theme">delete</i>
                    <i id="iconEditTheme" class="material-icons md-24" title="Edit the currently selected theme">edit</i>
                    <i id="iconAddTheme" class="material-icons md-24" title="Build a new theme">add</i>
                    <select id='prefTheme' name='theme'>
                        
                    </select>
                    
                </div>
                <div class='description' id='descTheme'>
                    
                </div>
            </div>
            <div class='settings-row'>
                <div class='main'>
                    <span class='label'>Keyboard Shortcuts</span>
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
            this.$iconDeleteTheme = this.shadowRoot.querySelector('#iconDeleteTheme');
            this.$iconEditTheme = this.shadowRoot.querySelector('#iconEditTheme');
            
            // Event listeners
            this.$prefTheme.addEventListener('change', this.prefChanged.bind(this));
            this.$iconAddTheme.addEventListener('click', Newt.openThemeBuilder);
            this.$iconDeleteTheme.addEventListener('click', () => {
                if (this.$prefTheme.value.indexOf('customtheme') > -1) {
                    Newt.showConfirmPrompt('Are you sure you want to delete this theme?', 'deleteTheme', this.$prefTheme.value);
                }
            });
            this.$iconEditTheme.addEventListener('click', () => {
                Newt.openThemeBuilder(true, this.$prefTheme.value);
            })

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

            this.updateIcons();
        }
        
        prefChanged(ev) {
            let element = ev.target;
            
            Newt.updatePref(element.name, element.value);

            this.updateIcons();
        }

        updateIcons() {
            if (this.$prefTheme.value.includes('customtheme')) {
                this.$iconDeleteTheme.style.display = 'block';
                this.$iconEditTheme.style.display = 'block';
            } else {
                this.$iconDeleteTheme.style.display = 'none';
                this.$iconEditTheme.style.display = 'none';
            }
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
            this.updateIcons();

            Newt.updatePref('theme', AppPrefs.theme);
        }

    }
    
    document.registerElement('settings-card', SettingsCard);
})();