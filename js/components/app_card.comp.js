(function() {
    'use strict';
    
    let template = `
        <style>
            .card {
                // width: calc(100% / 3 - 40px);
                display: flex;
                flex-direction: column;
                background-color: #fff;
                margin: 10px;
                padding: 10px;
                vertical-align: top;
                box-shadow: 0px 2px 3px #aaa;
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
                color: #03A9F4;
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
                // color: #f00;
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
                color: #03A9F4;
                padding: 5px 10px;
                /*float: right;*/
                font-size: 15px;
                cursor: pointer;
                text-align: center;
            }

            .actions > *:active {
                background-color: #B3E5FC;
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
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
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
            
            this.$icon.src = val.icons[val.icons.length-1].url;
            this.$title.textContent = val.name;
            this.$description.textContent = val.description;
            
            if (!val.enabled) {
                this.$card.style.opacity = .4;
                this.$disabled.style.display = 'block';
            }
        }

    }
    
    document.registerElement('app-card', AppCard);
})();