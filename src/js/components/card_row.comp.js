(function () {
  'use strict';

  let template = `
        <style>
            :host {
                display: block;
                cursor: pointer;
            }
            .row {
                padding: 7px 10px;
                display: flex;
                align-items: center;
            }
            .row:hover {
                background-color: var(--highlight-color);
            }
            
            .drag {
                // opacity: .7;
            }
            
            .over {
                border-bottom: 2px solid var(--accent-color);
                padding: 7px 10px 5px 10px;
            }
            
            .highlight {
                background-color: var(--highlight-color);
            }
            
            .icon {
                height: 18px;
                width: 18px;
                float: left;
                margin-right: 10px;
            }
            .title {
                flex: 1;
                border: none;
                background-color: transparent;
                color: var(--text-color);
                font-size: 16px;
                font-family: "Segoe UI", Helvetica, sans-serif;
                cursor: pointer;
            }
            .title:focus {
                outline: none;
            }
            .title.editing {
                cursor: text;
            }

            .menu .item {
                text-align: center;
                font-size: 16px;
                padding: 7px 10px;
            }
            .menu .item:hover {
                text-decoration: underline;
            }
        </style>
        
        <div class="row" draggable="true">
            <img class="icon"></img>
            <input class="title">
        </div>
        <div class="menu" style="display: none">
            <div id="menuRename" class="item">Rename</div>
            <div id="menuDelete" class="item">Delete</div>
        </div>
    `;

  class CardRow extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' }).innerHTML = template;
      this.$row = this.shadowRoot.querySelector('.row');
      this.$icon = this.shadowRoot.querySelector('.icon');
      this.$title = this.shadowRoot.querySelector('.title');
      this.$menu = this.shadowRoot.querySelector('.menu');
      this.$menuRename = this.shadowRoot.querySelector('#menuRename');
      this.$menuDelete = this.shadowRoot.querySelector('#menuDelete');

      this.isRenaming = false;
      this.isMenuOpen = false;

      let self = this;

      this.$row.addEventListener('dragstart', function (ev) {
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData('sitedivid', self.id);
        this.classList.add('drag');

        return false;
      });

      this.$row.addEventListener('dragend', function (ev) {
        if (ev.dataTransfer.types.includes('sitedivid')) {
          this.classList.remove('drag');
          ev.preventDefault();

          return false;
        }
      });

      this.$row.addEventListener('dragover', function (ev) {
        if (ev.dataTransfer.types.includes('sitedivid')) {
          ev.dataTransfer.dropEffect = 'move';

          if (ev.preventDefault) {
            ev.preventDefault();
          }

          this.classList.add('over');

          return false;
        }
      });

      this.$row.addEventListener('dragleave', function (ev) {
        if (ev.dataTransfer.types.includes('sitedivid')) {
          ev.preventDefault();
          this.classList.remove('over');
        }
      });

      this.$row.addEventListener('drop', function (ev) {
        if (ev.dataTransfer.types.includes('sitedivid')) {
          if (ev.stopPropagation) {
            ev.stopPropagation();
          }

          this.classList.remove('over');

          let fromRow = this.ownerDocument.getElementById(
            ev.dataTransfer.getData('sitedivid')
          );
          let toRow = this.parentNode.host;
          let card = this.parentNode.host.parentNode;

          let index;
          for (let i = 0; i < card.children.length; i++) {
            if (toRow.id == card.children[i].id) {
              index = i + 1;
            }
          }

          card.insertBefore(fromRow, toRow.nextSibling);

          ChromeService.moveBookmark(fromRow.data.id, card.data.id, index);
        }
      });

      this.$row.addEventListener('click', (ev) => {
        // console.log('click', ev);
        if (ev.button === 0) {
          this.handlePrimaryClick();
        } else if (ev.button === 1) {
          this.handleAuxClick(ev.altKey);
        }
      });

      this.$row.addEventListener('auxclick', (ev) => {
        // console.log('auxclick', ev);
        if (ev.button === 1) {
          this.handleAuxClick(ev.altKey);
        }
      });

      this.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();

        if (this.isEditable && !this.isRenaming) {
          this.toggleMenu();
        }
      });

      this.$menuRename.addEventListener('click', () => {
        this.toggleRename();
      });

      this.$menuDelete.addEventListener('click', () => {
        console.log('menuDelete click', this);
        ChromeService.deleteBookmark(this.data.id);
        this.remove();
      });

      this.$title.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && this.$title.value.length > 0) {
          this.title = this.$title.value;
          ChromeService.updateBookmark(
            this.data.id,
            this.data.title,
            this.data.url
          );
          this.toggleRename();
        } else if (ev.key === 'Escape') {
          this.$title.value = this.data.title;
          this.toggleRename();
        }
      });

      this.$title.readOnly = true;
    }

    handlePrimaryClick() {
      if (!this.isMenuOpen && !this.isRenaming) {
        ChromeService.updateTab(this.data.url);
      }
    }

    handleAuxClick(alt) {
      if (!this.isMenuOpen && !this.isRenaming) {
        ChromeService.openNewTab(this.data.url, alt);
      }
    }

    toggleMenu() {
      if (this.$menu.style.display == 'none') {
        this.$menu.style.display = 'block';
        this.isMenuOpen = true;
      } else {
        this.$menu.style.display = 'none';
        this.isMenuOpen = false;
      }
    }

    toggleRename() {
      this.isRenaming = !this.isRenaming;
      this.$title.readOnly = !this.isRenaming;

      if (this.isRenaming) {
        this.closeMenu();
        this.$title.classList.add('editing');
        this.$title.focus();
      } else {
        this.$title.classList.remove('editing');
        this.$title.blur();
      }
    }

    closeMenu() {
      this.$menu.style.display = 'none';
      this.isMenuOpen = false;
    }

    attributeChanged(attrName, oldVal, newVal) {
      console.log(attrName + ' changed');
      switch (attrName) {
        case 'highlight':
          this.updateHighlight();
          break;
      }
    }

    get site() {
      let s = this.getAttribute('site');
      s = JSON.parse(s);
      return s;
    }

    set site(val) {
      this.setAttribute('site', JSON.stringify(val));
    }

    get title() {
      return this.data.title;
    }

    set title(val) {
      var newData = this.data;
      newData.title = val;
      this.data = newData;
    }

    get data() {
      return JSON.parse(this.getAttribute('data'));
    }

    set data(val) {
      this.setAttribute('data', JSON.stringify(val));

      this.$icon.src = 'chrome://favicon/' + new URL(val.url).origin;
      this.$title.value = val.title;
    }

    get highlight() {
      return JSON.parse(this.getAttribute('highlight'));
    }

    set highlight(val) {
      this.setAttribute('highlight', JSON.stringify(val));
      this.updateHighlight();
    }

    get isEditable() {
      return JSON.parse(this.getAttribute('isEditable'));
    }

    set isEditable(val) {
      this.setAttribute('isEditable', JSON.stringify(val));
    }

    updateInfo() {
      this.$icon.src = 'chrome://favicon/' + this.data.url;
      this.$title.value = this.data.title;
    }

    updateHighlight() {
      if (this.highlight === true) {
        this.$row.classList.add('highlight');
      } else {
        this.$row.classList.remove('highlight');
      }
    }
  }

  customElements.define('card-row', CardRow);
})();
