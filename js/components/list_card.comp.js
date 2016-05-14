(function() {
    'use strict';
    
    let template = `
        <style>
            .card {
                display: flex;
                flex-direction: column;
                background-color: #fff;
                margin: 10px auto;
                vertical-align: top;
                box-shadow: 0px 2px 3px #aaa;
                border-radius: 5px;
                overflow: hidden;
                min-height: 375px;
                max-width: 800px;
            }

            .card-title {
                font-size: 22px;
                font-weight: 400;
                color: #03A9F4;
                padding: 10px 10px 5px 10px;
                overflow: ellipses;
                text-overflow: ellipses;
                /*text-align: center;*/
                white-space: nowrap;
                /*background-color: #29B6F6;*/
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
                
            </div>
        </div>
    `;
    
    class ListCard extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
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
    
    document.registerElement('list-card', ListCard);
})();