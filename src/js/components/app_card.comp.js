(function() {
    'use strict';
    
    let template = `
        <style>
            :host {
                display: inline-block;
            }
            .card {
                display: flex;
                flex-direction: column;
                background-color: var(--background-color);
                margin: 10px;
                padding: 10px;
                vertical-align: top;
                box-shadow: 0px 2px 3px var(--shadow-color);
                border-radius: 5px;
                overflow: hidden;
                height: 200px;
            }

            .card > .content {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .app-card-title {
                font-size: 22px;
                font-weight: 400;
                color: var(--accent-color);
                padding: 5px 10px;
                overflow: ellipses;
                text-overflow: ellipses;
                white-space: nowrap;
            }

            .icon {
                height: 64px;
                width: 64px;
                float: left;
                margin: 0 10px 10px 0;
            }

            .title {
                font-weight: 400;
                font-size: 18px;
                padding-top: 10px;
            }

            .disabled {
                display: none;
                font-weight: 500;
            }

            .description {
                font-weight: 400;
                font-size: 15px;
                flex: 1;
                overflow: hidden;
                margin-top: 5px;
            }

            .actions {
                text-align: right;
            }

            .actions > * {
                display: inline-block;
                color: var(--accent-color);
                padding: 5px 10px;
                /*float: right;*/
                font-size: 15px;
                cursor: pointer;
                text-align: center;
            }
            
            .highlight {
                background-color: var(--highlight-color);
            }

            .actions > *:active {
                background-color: var(--highlight-color);
            }
        </style>
        
        <div class="card">
            <div>
                <img class="icon">
                <div class="title">App Name</div>
                <div class="disabled">(Disabled)</div>
            </div>
            <div class="description">{{description}}</div>
            <div class="actions">
                <div id="btnStore">Web Store</div>
                <div id="btnLaunch">Launch</div>
            </div>
        </div>
    `;
    
    class AppCard extends HTMLElement {
        constructor() {
            super();
            
            this.attachShadow({mode: 'open'}).innerHTML = template;
            
            this.$card = this.shadowRoot.querySelector('.card');
            this.$icon = this.shadowRoot.querySelector('.icon');
            this.$title = this.shadowRoot.querySelector('.title');
            this.$disabled = this.shadowRoot.querySelector('.disabled');
            this.$description = this.shadowRoot.querySelector('.description');
            this.$btnStore = this.shadowRoot.querySelector('#btnStore');
            this.$btnLaunch = this.shadowRoot.querySelector('#btnLaunch');
            
            let self = this;
            
            this.$btnStore.addEventListener('click', function() {
                ChromeService.openNewTab(self.data.homepageUrl);
            });
            
            this.$btnLaunch.addEventListener('click', function() {
                if (self.data.appLaunchUrl) {
                    ChromeService.updateTab(self.data.appLaunchUrl);
                } else {
                    ChromeService.openApp(self.data.id);
                }
            })
        }
        
        get data() {
            return JSON.parse(this.getAttribute('data'));
        }
        
        set data(val) {
            this.setAttribute('data', JSON.stringify(val));
            
            let icon = val.icons ? val.icons[val.icons.length-1].url : 'assets/icons/apps-dark.png';
            this.$icon.src = icon;
            
            this.$title.textContent = val.name;
            this.$description.textContent = val.description;
            
            if (!val.enabled) {
                this.$card.style.opacity = .4;
                this.$disabled.style.display = 'block';
            }
        }
        
        get highlight() {
            return JSON.parse(this.getAttribute('highlight'));
        }
        
        set highlight(val) {
            this.setAttribute('highlight', JSON.stringify(val));
            this.updateHighlight();
        }
        
        updateHighlight() {
            if (this.highlight === true) {
                this.$btnLaunch.classList.add('highlight');
            } else {
                this.$btnLaunch.classList.remove('highlight');
            }
        }

    }
    
    customElements.define('app-card', AppCard);
})();