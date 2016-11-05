(function() {
    'use strict';
    
    let template = `
        <style>
            :host {
                display: block;
            }
            
            .row {
                padding: 7px 10px;
            }
            .row:hover {
                background-color: var(--highlight-color);
            }
            
            .highlight {
                background-color: var(--highlight-color);
            }
            
            .icon {
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                height: 18px;
                width: 18px;
                float: left;
                margin-right: 10px;
            }
            
            .title {
                font-size: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        </style>
        
        <div class="row">
            <div class="icon"></div>
            <div class="title">Site Title</div>
        </div>
    `;
    
    class CardRow extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$row = this.shadowRoot.querySelector('.row');
            this.$icon = this.shadowRoot.querySelector('.icon');
            this.$title = this.shadowRoot.querySelector('.title');

            this.addEventListener('click', (ev) => {
                return ev.button === 0 ? this.handlePrimaryClick() : this.handleAuxClick(ev.altKey);
            });

            this.addEventListener('auxclick', (ev) => {
                return this.handleAuxClick(ev.altKey);
            });
        }
        
        attachedCallback() {
            this.$icon.style.backgroundImage = 'url("https://plus.google.com/_/favicon?domain=' + this.url + '")';
            this.$title.textContent = this.title;
        }

        handlePrimaryClick() {
            ChromeService.updateTab(this.url);
        }

        handleAuxClick(alt) {
            ChromeService.openNewTab(this.url, alt);
        }
        
        attributeChanged(attrName, oldVal, newVal) {
            console.log('list-card-row', attrName + " changed");
            switch (attrName) {
                case 'title':
                    this.$title.textContent = this.title;
                    break;
                case 'url':
                    this.$icon.style.backgroundImage = 'url("https://plus.google.com/_/favicon?domain=' + this.url + '")';
                    break;
                case 'highlight':
                    this.updateHighlight();
                    break;
            }
        }
        
        get title() {
            let title = this.getAttribute('title');
            return title;
        }
        
        set title(val) {
            this.setAttribute('title', val);
        }
        
        get url() {
            return this.getAttribute('url');
        }
        
        set url(val) {
            this.setAttribute('url', val);
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
                this.$row.classList.add('highlight');
            } else {
                this.$row.classList.remove('highlight');
            }
        }
        
    }
    
    document.registerElement('list-card-row', CardRow);
})();