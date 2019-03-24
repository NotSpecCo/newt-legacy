(function() {
    'use strict';
    
    let template = `
        <style>
            :host {
                display: block;
            }

            .input-row {
                display: flex;
                flex-direction: row;
                /*background-image: url('assets/icons/apps-dark.png');*/
                background-repeat: no-repeat;
                background-size: 28px;
                background-position: top right;
            }

            input {
                border: none;
                border-bottom: 1px solid var(--divider-color);
                background-color: rgba(0,0,0,0);
                color: inherit;
                margin: 0px 0 20px 0;
                padding: 7px 0;
                flex: 1;
            }

            input:focus {
                outline: none;
                border-bottom-color: var(--accent-color);
            }

            .color-swatch {
                height: inherit;
                width: 28px;
                height: 28px;
                margin-left: 10px;
                border-radius: 4px;
            }
        </style>
        
        <div class="row">
            <span class="label"></span>
            <div class="input-row">
                <input type="text" id="inpColor" placeholder="#000000" />
                <div class="color-swatch"></div>
            </div>
        </div>
    `;
    
    class ColorRow extends HTMLElement {
        constructor() {
            super();
            
            this.attachShadow({mode: 'open'}).innerHTML = template;
            this.$row = this.shadowRoot.querySelector('.row');
            this.$label = this.shadowRoot.querySelector('.label');
            this.$inpColor = this.shadowRoot.querySelector('#inpColor');
            this.$swatch = this.shadowRoot.querySelector('.color-swatch');
            
            let self = this;
            
            this.$inpColor.addEventListener('change', function(ev) {
                self.color = this.value;

                self.updateColorSwatch();
                self.updateGlobalColor()
                
            });
        }
        
        updateGlobalColor() {
            document.documentElement.style.setProperty('--' + this.colorID, this.color);
        }

        updateColorSwatch() {
            this.$swatch.style.backgroundColor = this.color;
        }

        get color() {
            let item = this.getAttribute('color');
            item = JSON.parse(item);
            return item;
        }
        
        set color(val) {
            this.setAttribute('color', JSON.stringify(val));
            this.$inpColor.value = val;
            this.updateColorSwatch(val);
        }

        get colorID() {
            let item = this.getAttribute('colorID');
            item = JSON.parse(item);
            return item;
        }
        
        set colorID(val) {
            this.setAttribute('colorID', JSON.stringify(val));
            this.$label.innerText = val;
        }
    }
    
    customElements.define('color-row', ColorRow);
})();