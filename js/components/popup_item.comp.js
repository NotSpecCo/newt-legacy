(function() {
    'use strict';
    
    let template = `
        <i class="material-icons md-24 md-dark">info_outline</i>
        <slot></slot>
    `;
    
    class PopupMenuItem extends HTMLElement {
        constructor() {
            super();

            this.innerHTML = template;
            
            this.$icon = this.querySelector('.material-icons');
            this.$icon.innerHTML = this.icon;
            this.addEventListener('click', this.clicked);
        }
        
        clicked(ev) {
            Newt.changeTab(this.action);
        }

        get action() {
            return this.getAttribute('action');
        }
        
        set action(val) {
            this.setAttribute('action', val);
        }

        get icon() {
            return this.getAttribute('icon');
        }
        
        set icon(val) {
            this.setAttribute('icon', val);
        }
    }

    customElements.define('popup-menu-item', PopupMenuItem);
})();