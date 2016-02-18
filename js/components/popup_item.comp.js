'use strict';

(function() {
    let template = `
        <style>
            font-size: 16px;
            padding: 15px 10px 15px 39px;
            border: 1px solid #aaa;
            background-size: 24px;
            background-position: 10px center;
            background-repeat: no-repeat;
            background-image: url('../assets/icons/about-dark.png');
        </style>
        
        <div class="popup-menu-item">
            <content></content>
        </div>
    `;
    
    class PopupMenuItem extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$item = this.shadowRoot.querySelector('.popup-menu-item');
            this.addEventListener('click', this.clicked);
        }
        
        clicked(ev) {
            Newt.changeTab(this.action);
        }
    }
    
    document.registerElement('popup-menu-item', PopupMenuItem);
})();