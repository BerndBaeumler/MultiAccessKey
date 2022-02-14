"use strict";


/**
 * A smart tree view.
 */
var STree = class STree {

  static clearTextSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE
      document.selection.empty();
    }
  }
  
  static firstToUpperCase(s) {
    return ((typeof s === 'string') && s[0]) ? s[0].toUpperCase() + s.slice(1) : s;
  }
  
  static firstToLowerCase(s) {
    return ((typeof s === 'string') && s[0]) ? s[0].toLowerCase() + s.slice(1) : s;
  }

  static appendParagraph(div, txt, className) {
    let p = document.createElement('p');
    p.innerText = txt;
    if (className) {
      p.className = className;
    }
    div.appendChild(p);
    return p;
  }

  static reNumberStr = new RegExp('^\\d+$');
  
  
  constructor(prefix, viewSelector, selectedClassName) {
    this.selectedClassName = selectedClassName;
    this.prefix = prefix;
    this.reIdStr = new RegExp('^' + prefix + '(\\d+)$');
    this.view = document.querySelector(viewSelector);
    this.view.parentElement.classList.add('smart-tree-container');
    this.view.classList.add('smart-tree');
    this.view.addEventListener('click', this.clicked.bind(this));
    this.view.addEventListener('dblclick', this.doubleClicked.bind(this));
    this.view.addEventListener('input', this.inputChanged.bind(this));
    this.isDataExpandable = true;
    this.noExpander = false;
    this.clear();
  }
  
  clear() {
    this.items = [null];   // Index 0 is not used to simplify the check for an undefined index.
    this.view.innerHTML = '';
    this.selected = undefined;
  }

  getLabel(item) {
    let d = item.desc;
    return d.label || d.title || d.name || d;
  }
   
  getId(idStringOrNumber) {
    if (typeof idStringOrNumber === 'number') {
      return idStringOrNumber;
    } else {
      let parsedId = this.reIdStr.exec(idStringOrNumber) || STree.reNumberStr.exec(idStringOrNumber); 
      return (parsedId) ? parsedId[1] : null;
    }
  }

  getItem(idOrItem) {
    if (idOrItem.dspl) {
      return idOrItem;
    } else {
      let id = this.getId(idOrItem);
      return this.items[id];
    }
  }
  
  showItem(item) {
    item.dspl.el.classList.remove('st-hidden');
  }

  hideItem(item) {
    item.dspl.el.classList.add('st-hidden');
  }
  
  /*
    Creates an object representing an item with the following DOM structure:
        .st-item
          .st-head
            .st-exp | .st-header (optional)
                    | <input> (optional) | .st-lable | <input> (optional)
  */
  createItem(desc, inputType, classNameExtension) {
    let item = {
      desc: desc,
      dspl: {id: this.items.length}
    };
    this.items.push(item);
    let dspl = item.dspl;
    dspl.el = document.createElement('div');
    dspl.el.className = 'st-item';
    dspl.el.id = this.prefix + dspl.id;
    dspl.head = document.createElement('div');
    dspl.head.className = 'st-head';
    let checkable = inputType === 'checkbox' || inputType === 'radio';
    if (!this.noExpander && !checkable) {
      dspl.exp = document.createElement('div');
      dspl.exp.innerText = String.fromCharCode(160);
      dspl.exp.className = 'st-exp';
      dspl.head.appendChild(dspl.exp);
    }
    if (checkable) {
      dspl.input = document.createElement('input');
      dspl.input.type = inputType;
      dspl.head.appendChild(dspl.input);
      inputType = null;
    }
    dspl.label = document.createElement('div');
    dspl.label.innerText = this.getLabel(item);
    if (inputType) {
      let cne = classNameExtension || inputType;
      dspl.label.className = 'st-label-' + cne;
      dspl.header = document.createElement('div');
      dspl.header.className = 'st-header';
      dspl.header.appendChild(dspl.label);
      if (inputType === 'div') {
        dspl.input = this.createInputDiv(desc);
      } else {
        dspl.input = document.createElement('input');
        dspl.input.type = inputType;
        dspl.input.className = 'st-input-' + cne;
      }
      dspl.header.appendChild(dspl.input);
      dspl.head.appendChild(dspl.header);
    } else {
      dspl.label.className = 'st-label';
      dspl.head.appendChild(dspl.label);
    }
    dspl.el.appendChild(dspl.head);
    return item;
  }
    
  /*
    DOM structure of an item:
        .st-item
          .st-head
            .st-exp | .st-header (optional)
                    | .st-lable | <input> (optional)
          .st-data (optional)
          .st-children (optional)
  */
  appendItem(parentItem, desc, inputType, classNameExtension) {
    let item = this.createItem(desc, inputType, classNameExtension);
    let view = this.view;
    if (parentItem) {
      parentItem.childItems = parentItem.childItems || [];
      parentItem.childItems.push(item);
      let dspl = parentItem.dspl;
      if (!dspl.children) {
        dspl.children = document.createElement('div');
        dspl.children.className = 'st-children';
        dspl.el.appendChild(dspl.children);
        if (dspl.exp) {
          dspl.exp.innerText = '-';
        }
      }
      view = dspl.children;
    }
    view.append(item.dspl.el);
    return item;
  }

  /*
    DOM structure of a data item:
        .st-item
          .st-head
            <input> (optional) | .st-header (optional)
                               | .st-lable | <input> (optional)
  */
  appendData(parentItem, desc, inputType) {
    let view = this.view;
    let item = this.createItem(desc, inputType);
    if (parentItem) {
      parentItem.dataItems = parentItem.dataItems || [];
      parentItem.dataItems.push(item);
      let dspl = parentItem.dspl;
      if (!dspl.data) {
        dspl.data = document.createElement('div');
        dspl.data.className = 'st-data';
        if (this.isDataExpandable && dspl.exp && !dspl.children) {
          dspl.exp.innerText = '-';
        }
        if (dspl.children) {
          dspl.children.before(dspl.data);
        } else {
          dspl.el.appendChild(dspl.data);
        }
      }
      view = dspl.data;
    }
    view.appendChild(item.dspl.el);
    return item;
  }

  getItemFromEvent(event) {
    let el = event.target;
    while (el && (!el.id || !this.reIdStr.exec(el.id))) {
      el = el.parentElement;
    }
    let item = this.getItem(el.id);
    return item;
  }
  
  inputDivClicked(event, item) {
    // May be implemented by a child class.
  }

  checkboxChanged(event, item) {
    // May be implemented by a child class.
  }
  
  textChanged(event, item) {
    // May be implemented by a child class.
  }

  inputChanged(event) {
    let item = this.getItemFromEvent(event);
    let inType = event.target.type;
    if (inType === 'checkbox' || inType === 'radio') {
      this.checkboxChanged(event, item);
    } else {
      this.textChanged(event, item);
    }
  }
  
  setExpanded(idOrItem, toBeExpanded, isDataExpandable) {
    if (isDataExpandable === undefined) {
      isDataExpandable = this.isDataExpandable;
    }
    let item = this.getItem(idOrItem);
    let dspl = item.dspl;
    let changed;
    if (dspl.exp && (dspl.children || (dspl.data && isDataExpandable))) {
      if (toBeExpanded === undefined || toBeExpanded === null) {
        toBeExpanded = dspl.exp.innerText === '+';
      }
      if (toBeExpanded === true) {
        dspl.exp.innerText = '-';
        if (dspl.data && isDataExpandable) {
          dspl.data.classList.remove('st-hidden');
        }
        if (dspl.children) {
          dspl.children.classList.remove('st-hidden');
        }
      } else if (toBeExpanded === false) {
        dspl.exp.innerText = '+';
        if (dspl.data && isDataExpandable) {
          dspl.data.classList.add('st-hidden');
        }
        if (dspl.children) {
          dspl.children.classList.add('st-hidden');
        }
      }
    }
    return changed;
  }
  
  toggleInput() {
    let toggled = false;
    if (this.selected) {
      let input = this.selected.input;
      let inType = (input) ? this.selected.input.type : null;
      if (inType === 'checkbox' || inType === 'radio') {
        input.click();
        toggled = true;
      } else {
        this.setExpanded(this.selected);
      }
    }
    return toggled;
  }
  
  doubleClicked(event) {
    STree.clearTextSelection();
    if (!this.toggleInput()) {
        // TODO Scrolling seems to be unnecessary:
        // this.view.scrollTop = this.selected.el.offsetTop - this.view.offsetTop - 8 - this.view.offsetHeight / 3;
    }
  }
  
  clicked(event) {
    let item = this.getItemFromEvent(event);
    if (item) {
      event.stopPropagation();
      if (this.selected !== item) {
        this.select(item);
      }
      if (event.target.classList.contains('st-exp')) {
        this.setExpanded(this.selected);
      }
    }
  }

  select(idOrItem) {
    if (this.selected) {
      let el = this.selected.dspl.header || this.selected.dspl.label;
      el.classList.remove(this.selectedClassName);
    }
    this.selected = this.getItem(idOrItem || 1);
    if (this.selected) {
      let el = this.selected.dspl.header || this.selected.dspl.label;
      el.classList.add(this.selectedClassName);
    }
  }

  execute(rules, item, callback) {
    
    function exec(item) {
      let dataIsMatching, itemsAreMatching;
      if (!rules.ignoreData && item.dataItems) {
        item.dataItems.forEach(di => {
          dataIsMatching = exec(di) || dataIsMatching;
        });
      }
      if (!rules.ignoreChildren && item.childItems) {
        item.childItems.forEach(child => {
          itemsAreMatching = exec(child) || itemsAreMatching;
        });
      }
      return callback(item, dataIsMatching, itemsAreMatching);
    }
    
    exec(item);
  }
    
  getCharForSelectByChar(id) {
    return this.getItemName(id)[0].toUpperCase();
  }
  
  selectByChar(c, startId, getCharForSelectByChar) {
    getCharForSelectByChar = getCharForSelectByChar || this.getCharForSelectByChar.bind(this);
    let id = startId || 0;
    let lastId = id;
    let fc;
    while (!isNaN(id)) {
      fc = getCharForSelectByChar(id);
      if (fc >= c) {
        break;
      }
      lastId = id;
      id = this.items[id].next;
    }
    id = (fc === c) ? id : lastId;
    if (!isNaN(id)) {
      return this.select(id);
    }
  }
  
  moveSelectionUp() {
    let res = this.selected;
    let item = this.items[this.selected];
    if (!isNaN(item.pre)) {
      res = item.pre;
    } else if (!isNaN(item.parent)) {
      res = item.parent;
    }
    this.select(res);
  }
  
  moveSelectionDown(baseId) {
    baseId = (isNaN(baseId)) ? this.selected : baseId;
    let item = this.items[baseId];
    if (!isNaN(item.next)) {
      this.select(item.next);
    } else if (!isNaN(item.parent)) {
      this.moveSelectionDown(item.parent);
    }
  }
  
  moveSelectionBack() {
    let id = this.selected;
    while (!isNaN(this.items[id].pre)) {
      id = this.items[id].pre;
    }
    if (isNaN(this.items[id].parent)) {
      this.moveSelectionUp();
    } else {
      id = this.items[id].parent;
      this.select(id);
    }
  }
  
  keydown(event, keyCode) {
    let c = String.fromCharCode(keyCode).toUpperCase();
    if (c >= 'A' && c <= 'Z')  {
      this.selectByChar(c);
    } else if (this.selected) {
      switch (keyCode) {
        case 32: // Enter
        case 13: // Space
          event.preventDefault();     // Prevent scroll
          this.toggleInput();
          break;
        case 27: // Escape
          break;
        /*
        case 37: // Arrow left
          this.moveSelectionBack();
          break;
        case 39: // Arrow right
          {
            let firstChild = this.items[this.selected].firstChild;
            if (firstChild && this.expand(this.selected)) {
              this.select(firstChild);
            } else {
              this.moveSelectionDown();
            }
          }
          break;
        case 38: // Arrow up
          event.preventDefault();     // Prevent scroll
          this.moveSelectionUp();
          break;
        case 40: // Arrow down
          event.preventDefault();     // Prevent scroll
          this.moveSelectionDown();
          break;
        */
      }
    }
  }
  
}


if (typeof exports !== 'undefined') {
  exports.STree = STree;
}
