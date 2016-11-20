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
                width: 300px;
                z-index: 1000;
                position: fixed;
                top: calc(50vh - 210px);
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

            .content > * {
                
            }

            .content .label {
                font-weight:bold;
                margin-top: 10px;
            }

            .content .input {
                width: 100%;
            }

            #inpName {
                border: none;
                border-bottom: 1px solid var(--divider-color);
                background-color: rgba(0,0,0,0);
                color: inherit;
                padding: 7px 0;
            }

            #inpName:focus {
                outline: none;
                border-bottom-color: var(--accent-color);
            }

            .color-row {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-bottom: 5px;
            }
            .color-row > input {
                margin-right: 10px;
            }
            .color-row .example {
                flex: 1;
                padding: 7px 10px;
            }

            .actions {
                text-align: end;
                margin-top: 10px;
            }

            .actions > button {
                border: none;
                background-color: transparent;
                color: var(--accent-color);
                padding: 8px 15px;
                font-size: 15px;
                cursor: pointer;
                text-align: center;
            }

            .actions > button:hover {
                background-color: var(--highlight-color);
            }

        </style>
        
        <div class="prompt">
            <form action="" id="cardMenuForm" name="cardMenuForm" novalidate style="margin-bottom: 0px">
            <span class="header">Modify Card</span>
            <div class="content">
                <div class="label">Title:</div>
                <input type="text" id="inpName" name="cardTitle" class="input" placeholder="Card title"/>
                <div class="label">Color:</div>
                <div class="color-row">
                    <input type="radio" name="cardColor" value="0" checked>
                    <div class="example" style="color: var(--accent-color)">Card Title</div>
                </div>
            </div>
            <div class="actions">
                <button type="submit" id="btnSave">Save</button>
                <button type="button" id="btnCancel">Cancel</button>
            </div>
        </div>
    `;
    
    class PromptBox extends HTMLElement {
        createdCallback() {
            this.createShadowRoot().innerHTML = template;
            
            this.$content = this.shadowRoot.querySelector('.content');
            this.$cardMenuform = this.shadowRoot.querySelector('#cardMenuform');
            this.$btnCancel = this.shadowRoot.querySelector('#btnCancel');

            var colorRow = document.createElement('div');
            colorRow.className = 'color-row';

            for (let i=1; i<6; i++) {
                let ele = colorRow.cloneNode(true);
                ele.innerHTML = `
                    <input type="radio" name="cardColor" value="${i}">
                    <div class="example" style="background-color: var(--card-header-color${i}); color: var(--card-header-text-color${i});">Card Title</div>
                `;

                this.$content.appendChild(ele);
            }
            
            this.$cardMenuform.addEventListener('submit', (ev) => {
                ev.preventDefault();

                var data = {
                    cardID: this.data.cardID,
                    title: this.$cardMenuform.elements['cardTitle'].value,
                    color: this.$cardMenuform.elements['cardColor'].value
                }

                Newt.saveEditedCard(data);
            });

            this.$btnCancel.addEventListener('click', () => {
                this.data = {};
                Newt.closeAllPopups();
            });
        }

        attachedCallback() {
            // this.$message.innerText = this.message;
        }

        get data() {
            let item = this.getAttribute('data');
            item = JSON.parse(item);
            return item;
        }
        
        set data(val) {
            this.setAttribute('data', JSON.stringify(val));

            this.$cardMenuform.elements['cardTitle'].value = val.title;
            this.$cardMenuform.elements['cardColor'].value = val.color;
        }
    }
    
    document.registerElement('dialog-card-menu', PromptBox);
})();