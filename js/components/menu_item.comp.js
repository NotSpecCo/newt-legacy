(function() {
    'use strict';
    
    let template = `
        <style>
            .menu-item {
                height: 58px;
                width: 58px;
                margin-bottom: 5px;
                opacity: .7;
                background-position: center;
                background-repeat: no-repeat;
                background-size: 32px;
            }
            
            .bookmarks {
                background-image: urL("../assets/icons/dashboard-light.png");
            }
            .apps {
                background-image: urL("../assets/icons/apps-light.png");
            }
            .frequents {
                background-image: urL("../assets/icons/favorite-light.png");
            }
            .new {
                background-image: urL("../assets/icons/bookmark-light.png");
            }
            .recents {
                background-image: urL("../assets/icons/recents-light.png");
            }
            .devices {
                background-image: urL("../assets/icons/devices-light.png");
            }
            .settings {
                background-image: urL("../assets/icons/settings-light.png");
                margin-bottom: 0px;
                opacity: 1;
            }
            
            .selected {
                opacity: 1;
            }
        </style>
        
        <div class="menu-item"></div>
    `;
    
    class MenuItem extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$item = this.shadowRoot.querySelector('.menu-item');
            this.$item.className = 'menu-item ' + this.action;
            
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