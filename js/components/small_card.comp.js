'use strict';

(function() {
    let template = `
        <style>
            .card {
                display: flex;
                flex-direction: column;
                background-color: #fff;
                margin: 10px;
                vertical-align: top;
                box-shadow: 0px 2px 3px #aaa;
                border-radius: 5px;
                overflow: hidden;
                height: 375px;
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
                <content></content>
            </div>
        </div>
    `;
    
    class Card extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$title = this.shadowRoot.querySelector('.card-title');
            this.$container = this.shadowRoot.querySelector('.items-container');
        }
        
        set title(val) {
            this.setAttribute('title', val);
            this.$title.textContent = val;
        }
        
        set data(val) {
            this.setAttribute('data', JSON.stringify(val));
            this.$title.textContent = this.data.title;
        }
        
        get data() {
            return JSON.parse(this.getAttribute('data'));
        }
    }
    
    document.registerElement('small-card', Card);
})();