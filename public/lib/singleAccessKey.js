"use strict";


MAKey.SingleAccessKey = class {

  constructor(main) {
    this.main = main;
    this.history = [];
    this.divHistory = [];
    this.keyInput = document.querySelector('#single-access-view');
    this.keyInput.classList.add('smart-tree');
    this.hide();
  }
  
  setKey(keyName) {
    keyName = keyName || MAKey.mainKey;
    this.appendKeyEntity(keyName);
  }
  
  show() {
    this.keyInput.style.display = 'block';
    if (this.selectedRow) {
      this.selectRow(this.selectedRow);
    }

    // TODO - to be checked!
    this.main.focussed = this;
  }
  
  hide() {
    this.keyInput.style.display = 'none';
  }
  
  itemDoubleClicked(event) {
    this.executeDiv(event.currentTarget);
    STree.clearTextSelection();
  }
  
  keydown(event, keyCode) {
    switch (keyCode) {
      case 32: // Enter
      case 13: // Space
        this.executeDiv();
        break;
      case 27: // Escape
        break;
      case 37: // Arrow left
        event.preventDefault();     // Prevent scroll
        this.moveKeySelectionUp();
        break;
        break;
      case 38: // Arrow up
        event.preventDefault();     // Prevent scroll
        this.moveKeySelectionUp('row');
        break;
      case 39: // Arrow right
        event.preventDefault();     // Prevent scroll
        this.moveKeySelectionDown();
        break;
      case 40: // Arrow down
        event.preventDefault();     // Prevent scroll
        this.moveKeySelectionDown('row');
        break;
    }   
  }
  
  moveKeySelectionDown(option) {
    if (option === 'row') {
      let row = this.selectedRow.nextSibling;
      if (row) {
        this.selectRow(row);
      } else {
        this.moveKeySelectionDown();
      }
    } else {
      let res = this.selectedKeyOption.nextSibling;
      if (!res) {
        let histIdx = this.getHistIdx();
        if (histIdx < this.divHistory.length - 1) {
          res = this.divHistory[histIdx + 1]
        }
      }        
      this.selectKeyOption(res, 'first');
    }
  }
    
  moveKeySelectionUp(option) {
    if (option === 'row') {
      let row = this.selectedRow.previousSibling;
      if (row && row.previousSibling) {
        this.selectRow(row);
      } else {
        this.moveKeySelectionUp();
      }
    } else {
      let res = this.selectedKeyOption.previousSibling;
      if (!res) {
        let histIdx = this.getHistIdx();
        if (histIdx > 0) {
          res = this.divHistory[histIdx - 1];
        }
      }
      this.selectKeyOption(res, 'last');
    }
  }
  
  appendKeyEntity(keyName, id, keyOptionToSelect) {
    let self = this;

    function writeCharacters(div, opt, characterPathBase) {
      for (let charPath in opt) {
        if (!'fig|next|taxon|sex'.includes(charPath)) {
          let charDesc = opt[charPath];
          if (!Array.isArray(charDesc) && typeof charDesc === 'object') {
            writeCharacters(div, charDesc, characterPathBase + charPath + '|');
          } else {
            let title = MAKey.getCharacterTitle(charPath);
            title = title.replace('|', ' | ');
            let txt = '';
            if (charDesc[0] === 'VARIANTS') {
              for (let i = 1; i < charDesc.length; i++) {
                txt = txt + '\nVariant ' + i + ': ' +
                MAKey.Parser.variantToText(charDesc[i], characterPathBase + charPath);
              }
            } else {
              txt = MAKey.Parser.variantToText(charDesc, characterPathBase + charPath);
            }
            let p = STree.appendParagraph(div, title + ': ' + txt);
            p.dataset.charPath = charPath;
            p.addEventListener('click', self.rowClicked.bind(self));          }
        }
      }
    }
    
    id = id || 1;
    let key = MAKey.keys[keyName];
    let keyOptions = key.singleAccessKey[id];
    // Create a HTML container, append a history entry and create a link from the container to the history.
    let keyOptionsDiv = document.createElement('div');
    keyOptionsDiv.dataset.histIdx = this.history.length;
    let historyEntry = {id: id};
    this.history.push(historyEntry);
    
    // Fill the HTML container with the key options.
    let selectedDiv;
    for (let i in keyOptions) {
      let div = document.createElement('div');      
      if (!selectedDiv) {
        selectedDiv = div;
      }
      if (i == keyOptionToSelect) {
        selectedDiv = div;
      }
      div.dataset.keyName = keyName;
      div.dataset.keyEntity = id;
      div.dataset.keyOpt = i;
      div.addEventListener('dblclick', this.itemDoubleClicked.bind(this));
      STree.appendParagraph(div, (key.shortTitle || key.title || keyName) + ' ' + id + '.' + i, 'key-id');
      let opt = keyOptions[i];
      writeCharacters(div, opt, '');
      if (opt.taxon) {
        let className =  (opt.next) ? 'taxon-interim-result' : 'taxon-final';
        let taxons = (typeof opt.taxon == 'object') ? opt.taxon : [opt.taxon];
        taxons.forEach((taxon, idx) => {
          let p = STree.appendParagraph(div, taxon, className);
          p.dataset.taxon = taxon;
          p.addEventListener('click', this.rowClicked.bind(this));
        });
      }
      keyOptionsDiv.appendChild(div);
    }

    // Show the HTML container with the key options and one selected option.
    this.keyInput.appendChild(keyOptionsDiv);
    this.divHistory.push(selectedDiv);
    this.selectKeyOption(selectedDiv, 'first');
  }
  
  rowClicked(event) {
    event.stopPropagation();
    this.main.focussed = this;
    if (this.selectedRow != event.currentTarget) {
      this.selectKeyOption( null, event.currentTarget);
    }
  }
  
  selectKeyOption(div, row) {
    if (!div) {
      div = row.parentElement;
    }
    if (div) {
      if( div !== this.selectedKeyOption) {
        if (this.selectedKeyOption) {
          this.setItemsClassName(this.selectedKeyOption, 'item-hidden');
          let histIdx = this.getHistIdx();
          let choosenDiv = this.divHistory[histIdx];
          choosenDiv.className = 'item-inactive';
        }
        this.setItemsClassName(div, 'item-alternative');
        this.selectedKeyOption = div;
        div.className = 'item-current';
      }
      if (row === 'last') {
        this.selectRow(div.childNodes[div.childNodes.length - 1]);
      } else if (row === 'first') {
        this.selectRow(div.childNodes[1]);
      } else if (div) {
        this.selectRow(row);
      }
    }
  }

  selectRow(row) {
    if (this.selectedRow) {
      this.selectedRow.classList.remove('row-selected');
    }
    this.selectedRow = row;
    row.classList.add('row-selected');

    // Show related notes and images within info window.
    this.main.infoWindow.clear();
    let rds = row.dataset;
    if (rds.taxon) {
      this.main.appendTaxonResources(rds.taxon);
    } else if (rds.charPath) {
      let dEntity = this.selectedKeyOption.dataset;
      let key = MAKey.keys[dEntity.keyName];
      let keyOptions = key.singleAccessKey[dEntity.keyEntity];
      let opt = keyOptions[dEntity.keyOpt];
      let charDesc = opt[rds.charPath];
      let c = MAKey.Parser.parseCharacter(charDesc, rds.charPath);
      this.main.appendResources(c.globalDescMeta);
      this.main.appendResources(c.meta);
    }
    this.scrollIntoView();
  }

  // Scrolls the current selection into view.
  scrollIntoView() {
    var keyFrame = this.keyInput.parentElement;
    var divRow = this.selectedRow;
    setTimeout(() => {
      let 
        frameStyle = window.getComputedStyle(keyFrame),
        frameHeight = parseFloat(frameStyle.height),
        divOpt = divRow.parentElement,
        divEntity = divOpt.parentElement,
        entityStyle = window.getComputedStyle(divEntity),
        entityHeight = parseFloat(entityStyle.height);
      if (frameHeight > entityHeight) {
        divEntity.scrollIntoView();
      } else {
        let 
          optStyle = window.getComputedStyle(divOpt),
          optHeight = parseFloat(optStyle.height);
          if (frameHeight > optHeight) {
            divOpt.scrollIntoView();
          } else {
            divRow.scrollIntoView();
          }
      }
    }, 0);
  }
  
  setItemsClassName(itemDiv, className) {
    let parent = itemDiv.parentElement;
    parent.childNodes.forEach(el => {
      el.className = className;
    });
  }
  
  executeDiv() {
    let d = this.selectedKeyOption.dataset;
    if (d.keyOpt) {
      let currentKeyOption = MAKey.keys[d.keyName].singleAccessKey[d.keyEntity][d.keyOpt];
      let nextKeyName = d.keyName;
      let nextKeyOpt = currentKeyOption.next;
      if (!nextKeyOpt && currentKeyOption.taxon && MAKey.keys[currentKeyOption.taxon]) {
        nextKeyName = currentKeyOption.taxon;
        nextKeyOpt = 1;
      }
      if (nextKeyOpt) {
        let histIdx = parseInt(this.selectedKeyOption.parentElement.dataset.histIdx);
        let oldKeyOpt = this.history[histIdx].keyOpt;
        let curKeyOpt = parseInt(d.keyOpt);
        if (oldKeyOpt === curKeyOpt) {
          this.selectKeyOption(this.divHistory[histIdx + 1], 'first');
        } else {
          if (!isNaN(oldKeyOpt)) {
            this.history[histIdx].path = this.history[histIdx].path || [];
            let path = this.history.splice(histIdx + 1);
            this.history[histIdx].path[oldKeyOpt] = path;
            // Remove subsequent shown key options.
            for (let i = this.divHistory.length - 1; i > histIdx; i--) {
              this.divHistory[i].parentElement.remove();
            }
            this.divHistory.splice(histIdx + 1);
          }
          this.history[histIdx].keyOpt = curKeyOpt;
          this.divHistory[histIdx] = this.selectedKeyOption;
          this.appendKeyEntity(nextKeyName , nextKeyOpt);
        }
      }
    }
  }
  
  getHistIdx() {
    return parseInt(this.selectedKeyOption.parentElement.dataset.histIdx);
  }
}
