(function() {
    'use strict';
    
    let template = `
        <style>
            @import url('css/shared.css');

            :host {
                display: block;
            }

            .menu-item {
                height: 58px;
                width: 58px;
                line-height: 58px;
                margin-bottom: 5px;
                opacity: .7;
                background-position: center;
                background-repeat: no-repeat;
                background-size: 32px;
                color: var(--sidebar-icon-color);
            }
            
            .menu {
                opacity: 1;
            }
            
            .selected {
                opacity: 1;
            }
        </style>

        <div class="container">
            <i class="material-icons md-36 menu-item">delete</i>
        </div>
    `;
    
    class MenuItem extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$item = this.shadowRoot.querySelector('.menu-item');
            var icon = this.getIcon(this.action);
            this.$item.innerHTML = icon;

            if (this.action == 'menu') {
                this.$item.classList.add('menu');
            }
            
            this.addEventListener('click', this.clicked);
        }
        
        attributeChangedCallback(attrName, oldVal, newVal) {
            switch (attrName) {
                case 'selected':
                    if (this.selected) {
                        this.$item.style.opacity = 1;
                    } else {
                        this.$item.style.opacity = .7;
                    }
            }
        }
        
        getIcon(action) {
            let icon;

            switch (action) {
                case 'bookmarks':
                    icon = 'dashboard';
                    break;
                case 'apps':
                    icon = 'shop';
                    break;
                case 'frequents':
                    icon = 'favorite_border';
                    break;
                case 'new':
                    icon = 'bookmark_border';
                    break;
                case 'recents':
                    icon = 'access_time';
                    break;
                case 'devices':
                    icon = 'devices';
                    break;
                case 'menu':
                    icon = 'more_horiz';
                    break;
            }

            return icon;
        }

        get action() {
            return this.getAttribute('action');
        }
        
        get selected() {
            if (this.getAttribute('selected') == 'true') {
                return true;
            } else {
                return false;
            }
        }
        
        set selected(val) {
            if (val === true) {
               this.setAttribute('selected', 'true');
            } else {
                this.setAttribute('selected', 'false');
            }
        }
        
        clicked(ev) {
            Newt.changeTab(this.action);
        }
    }
    
    document.registerElement('menu-item', MenuItem);
})();