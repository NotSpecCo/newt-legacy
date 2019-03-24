(function() {
    'use strict';
    
    let template = `
        <style>
            :host {
                display: block;
            }
            .card {
                display: flex;
                flex-direction: column;
                background-color: var(--background-color);
                margin: 10px auto;
                vertical-align: top;
                box-shadow: 0px 2px 3px var(--shadow-color);
                border-radius: 5px;
                overflow: hidden;
                min-height: 375px;
                max-height: 90vh;
                max-width: 800px;
            }

            .card-title {
                font-size: 22px;
                font-weight: 400;
                color: var(--accent-color);
                padding: 10px 10px 5px 10px;
                overflow: ellipses;
                text-overflow: ellipses;
                white-space: nowrap;
            }
            
            .items-container {
                overflow-y: auto;
            }
            
            ::-webkit-scrollbar {
                width: 0px;
            }
        </style>
        
        <div class="card">
            <div class="card-title"></div>
            <div class="items-container">
                <slot></slot>
            </div>
        </div>
    `;
    
    class ListCard extends HTMLElement {
        constructor() {
            super();
            
            this.attachShadow({mode: 'open'}).innerHTML = template;
            
            this.$title = this.shadowRoot.querySelector('.card-title');
            this.$container = this.shadowRoot.querySelector('.items-container');
        }
        
        set title(val) {
            this.setAttribute('title', val);
            this.$title.textContent = val;
        }
        
        set sites(val) {
            for (var row of val) {
                let ele = document.createElement('list-card-row');
                
                if (row.tab) {
                    ele.title = row.tab.title;
                    ele.url = row.tab.url;
                } else {
                    ele.title = row.title;
                    ele.url = row.url;
                }
                    
                this.$container.appendChild(ele);
            }
        }
    }
    
    customElements.define('list-card', ListCard);
})();