(function() {
    'use strict';
    
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
            
            .over {
                border-bottom: 2px solid #aaa;
                padding: 10px 10px 3px 10px;
                
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
            
            this.$title.addEventListener('dragover', function(ev) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                }
                
                this.classList.add('over');
            });
            
            this.$title.addEventListener('dragleave', function(ev) {
                this.classList.remove('over');
            });
            
            let self = this;
            this.$title.addEventListener('drop', function(ev) {
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                }
                
                this.classList.remove('over');
                
                let fromRow = this.ownerDocument.getElementById(ev.dataTransfer.getData('divid'));
                let card = self;

                card.insertBefore(fromRow, self.children[0]);
                
                ChromeService.moveBookmark(fromRow.data.id, card.data.id, 0);
            });
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