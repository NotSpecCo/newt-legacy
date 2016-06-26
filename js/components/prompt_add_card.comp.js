(function() {
    'use strict';
    
    let template = `
        <style>
            :host {
                display: block;
            }

            .prompt {
                display: flex;
                flex-direction: column;
                background-color: var(--background-color);
                padding: 10px;
                box-shadow: 0px 2px 3px var(--shadow-color);
                border-radius: 5px;
                height: 200px;
                width: 300px;
                z-index: 1000;
                position: fixed;
                top: calc(50vh - 100px);
                left: calc(50vw - 150px);
            }

            .header {
                font-weight: 400;
                font-size: 22px;
                margin-bottom: 15px;
            }

            .content {
                flex: 1;
                font-size: 14px;
            }

            #inpName {
                border: none;
                border-bottom: 1px solid var(--divider-color);
                background-color: rgba(0,0,0,0);
                color: inherit;
                margin: 15px 0;
                padding: 7px 0;
                flex: 1;
                width: 100%;
            }

            #inpName:focus {
                outline: none;
                border-bottom-color: var(--accent-color);
            }

            .actions {
                text-align: end;
            }

            .actions > div {
                display: inline-block;
                color: var(--accent-color);
                padding: 8px 15px;
                font-size: 15px;
                cursor: pointer;
                text-align: center;
            }

            .actions > div:hover {
                background-color: var(--highlight-color);
            }

        </style>
        
        <div class="prompt">
            <span class="header">Add Card</span>
            <div class="content">
                <div class="message">What would you like to name this card?</div>
                <input type="text" id="inpName" placeholder="Card name" />
            </div>
            <div class="actions">
                <div id="btnCreate">Create</div>
                <div id="btnCancel">Cancel</div>
            </div>
        </div>
    `;
    
    class PromptBox extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$inpName = this.shadowRoot.querySelector('#inpName');
            this.$btnCreate = this.shadowRoot.querySelector('#btnCreate');
            this.$btnCancel = this.shadowRoot.querySelector('#btnCancel');
            
            this.$inpName.focus();
            
            this.$btnCreate.addEventListener('click', () => {
                if (this.$inpName.value.length > 0) {
                    Newt.createNewCard(this.$inpName.value);
                }
            });
            this.$btnCancel.addEventListener('click', () => Newt.hideAddCardPrompt() );
        }

        attachedCallback() {
            this.$inpName.focus();
        }
    }
    
    document.registerElement('prompt-add-card', PromptBox);
})();