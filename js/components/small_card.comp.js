(function() {
    'use strict';
    
    let template = `
        <style>
            :host {
                display: inline-block;
            }
            .card {
                display: flex;
                flex-direction: column;
                background-color: var(--background-color);
                margin: 10px;
                vertical-align: top;
                box-shadow: 0px 2px 3px var(--shadow-color);
                border-radius: 5px;
                overflow: hidden;
                height: 375px;
            }

            .card-title {
                font-size: 22px;
                font-weight: 400;
                background-color: var(--card-header-color1);
                color: var(--card-header-text-color1);
                padding: 7px 10px;
                overflow: ellipses;
                text-overflow: ellipses;
                white-space: nowrap;
                margin-bottom: 5px;
            }

            .over {
                border-bottom: 2px solid var(--accent-color);
                padding: 10px 10px 3px 10px;
            }
            
            .items-container {
                overflow-y: auto;
            }
            
            ::-webkit-scrollbar {
                width: 0px;
            }
        </style>
        
        <div class="card" draggable="true">
            <div class="card-title"></div>
            <div class="items-container">
                <content></content>
            </div>
        </div>
    `;
    
    class Card extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;

            this.$card = this.shadowRoot.querySelector('.card');
            this.$title = this.shadowRoot.querySelector('.card-title');
            this.$container = this.shadowRoot.querySelector('.items-container');
            
            let self = this;

            this.$card.addEventListener('dragstart', function(ev) {
                ev.dataTransfer.effectAllowed = 'move';
                ev.dataTransfer.setData('carddivid', self.data.id);
                this.classList.add('drag');

                return false;
            });

            this.$title.addEventListener('dragover', function(ev) {
                if (ev.dataTransfer.types.includes('sitedivid')) {
                    ev.preventDefault();
                    this.classList.add('over');
                }
            });

            this.$title.addEventListener('dragleave', function(ev) {
                if (ev.dataTransfer.types.includes('sitedivid')) {
                    ev.preventDefault();
                    this.classList.remove('over');
                }
            });

            this.$title.addEventListener('dragend', function(ev) {
                if (ev.dataTransfer.types.includes('sitedivid')) {
                    ev.preventDefault();
                    this.classList.remove('over');
                }
            });
            
            this.$title.addEventListener('drop', function(ev) {
                
                if (ev.dataTransfer.types.includes('sitedivid')) {
                    this.classList.remove('over');
                    
                    let fromRow = this.ownerDocument.getElementById(ev.dataTransfer.getData('sitedivid'));
                    let card = self;

                    card.insertBefore(fromRow, self.children[0]);
                    
                    ChromeService.moveBookmark(fromRow.data.id, card.data.id, 0);
                }
            });

            this.$title.addEventListener('contextmenu', ev => {
                ev.preventDefault();

                var event = new CustomEvent('showcardmenu', {
                    detail: {
                        card: self,
                        cardID: this.data.id
                    }
                });

                self.dispatchEvent(event);
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

        set config(val) {
            this.setAttribute('config', JSON.stringify(val));
            if (val.categoryColor > 0) {
                this.$title.style.backgroundColor = 'var(--card-header-color' + val.categoryColor + ')';
                this.$title.style.color = 'var(--card-header-text-color' + val.categoryColor + ')';
            } else {
                this.$title.style.backgroundColor = 'transparent';
                this.$title.style.color = 'var(--accent-color)';
            }
        }

        get config() {
            return JSON.parse(this.getAttribute('config'));
        }
    }
    
    document.registerElement('small-card', Card);
})();