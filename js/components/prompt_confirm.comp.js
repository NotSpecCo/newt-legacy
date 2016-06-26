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
            <span class="header">Confirm Action</span>
            <div class="content">
                <div class="message">Message text</div>
            </div>
            <div class="actions">
                <div id="btnConfirm">Yes, do it!</div>
                <div id="btnCancel">No, wait.</div>
            </div>
        </div>
    `;
    
    class PromptBox extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$message = this.shadowRoot.querySelector('.message');
            this.$btnConfirm = this.shadowRoot.querySelector('#btnConfirm');
            this.$btnCancel = this.shadowRoot.querySelector('#btnCancel');
            
            this.$btnConfirm.addEventListener('click', () => {
                var func = this.confirmAction;
                Newt[func](this.data);
                Newt.hideConfirmPrompt();
            });
            this.$btnCancel.addEventListener('click', Newt.closeAllPopups);
        }

        attachedCallback() {
            this.$message.innerText = this.message;
        }

        get message() {
            let item = this.getAttribute('message');
            item = JSON.parse(item);
            return item;
        }
        
        set message(val) {
            this.setAttribute('message', JSON.stringify(val));
        }

        get confirmAction() {
            let item = this.getAttribute('confirmAction');
            item = JSON.parse(item);
            return item;
        }
        
        set confirmAction(val) {
            this.setAttribute('confirmAction', JSON.stringify(val));
        }

        get data() {
            let item = this.getAttribute('data');
            item = JSON.parse(item);
            return item;
        }
        
        set data(val) {
            this.setAttribute('data', JSON.stringify(val));
        }
    }
    
    document.registerElement('prompt-confirm', PromptBox);
})();