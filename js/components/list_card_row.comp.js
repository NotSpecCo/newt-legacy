(function() {
    'use strict';
    
    let template = `
        <style>
            .row {
                padding: 7px 10px;
            }
            .row:hover {
                background-color: #eaeaea;
            }
            
            .icon {
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                height: 18px;
                width: 18px;
                float: left;
                margin-right: 10px;
                // background-color: #ccc;
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
            
            this.$icon = this.shadowRoot.querySelector('.icon');
            
            
            this.$title = this.shadowRoot.querySelector('.title');
            
            
            this.addEventListener('click', function() {
                chrome.tabs.update({url: this.url});
            });
        }
        
        attachedCallback() {
            this.$icon.style.backgroundImage = 'url("https://plus.google.com/_/favicon?domain=' + this.url + '")';
            this.$title.textContent = this.title;
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
        
    }
    
    document.registerElement('list-card-row', CardRow);
})();