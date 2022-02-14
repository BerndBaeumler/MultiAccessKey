"use strict";

var EnumPicker = class EnumPicker {
  
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

  static appendDiv(owner, className, txt) {
    let el = document.createElement('div');
    if (txt) {
      el.innerText = txt;
    }
    if (className) {
      el.className = className;
    }
    if(owner) {
      owner.appendChild(el);
    }
    return el;
  }
  
  static emptyPlaceholder = String.fromCharCode(160).repeat(5);
  
  static createInput(callback) {
    let c = EnumPicker.appendDiv(null, 'ep-input-container');
    c.addEventListener('click', event => {
      event.stopPropagation();
      callback(event);
    });
    EnumPicker.appendDiv(c, 'ep-input-div', EnumPicker.emptyPlaceholder);
    return c;
  }
  
  static inputCombinations = {
    categories: ['singleChoice', 'multipleChoiceSelector', 'multipleChoice'],
    singleChoiceId: 0,
    selectorId: 1,
    firstMultipleChoiceId: 2
  };
    
  updatePicker(inputEl, inputRule, callback) {
    
    function appendRow(owner, fullData, typeId, index) {
      let used = [];
      fullData.forEach(item => {
        if (inputRule.values[item]) {
          used.push(item);
        }
      });
      if (used.length) {
        let row = EnumPicker.appendDiv(owner, 'ep-row');
        row.dataset.typeId = typeId;
        row.dataset.index = index;
        used.forEach(item => {
          EnumPicker.appendDiv(row, 'ep-item', item);
        });
      }
    }

    function appendTable(owner, data, typeId, index) {
      let n = 0;
      let panel = document.createElement('div');
      data.forEach(rowData => {
        let row = document.createElement('tr');
        rowData.forEach(item => {
          let td = document.createElement('td');
          td.innerText = item;
          if (inputRule.values[item]) {
            n++;
          } else {
            td.className = 'ep-disabled';
          }
          row.appendChild(td);
        });
        panel.appendChild(row);
      });
      if (n) {
        panel.className = 'ep-panel';
        panel.dataset.typeId = typeId;
        panel.dataset.index = index;
        owner.appendChild(panel);
      }
    }
    
    function appendBasicCharacters(view, basicCharacterNames, typeId, bcIdx) {
      basicCharacterNames.forEach(bcName => {
        let bc = MAKey.basicCharacters[bcName];
        if (!bc) {
          console.log('ERROR Unknown name of basic character', bcName);
        } else {
          bcIdx++;
          if (Array.isArray(bc[0])) {
            appendTable(view, bc, typeId, bcIdx);
          } else {
            appendRow(view, bc, typeId, bcIdx);
          }
        }
      });
    }
        
    function handleClick(event) {
      event.stopPropagation();
      EnumPicker.clearTextSelection();
      let t = event.target;
      let ds;
      if (t.nodeName === 'TD') {
        ds = t.parentElement.parentElement.dataset;
      }
      if (t.classList.contains('ep-item')) {
        ds = t.parentElement.dataset;
      }
      if (ds && ds.index) {
        if (this.empty) {
          this.empty = false;
          this.inputDiv[0].classList.add('ep-hidden');
        }
        let typeId = parseInt(ds.typeId);
        let catId = typeId;
        if (typeId === EnumPicker.inputCombinations.firstMultipleChoiceId) {
          if( this.scopeId === this.inputDiv.length-1) {
            this.inputDiv.push(EnumPicker.appendDiv(this.inputContainer, 'ep-input-div', EnumPicker.emptyPlaceholder));
          }
          if (this.scopeId > typeId) {
            catId = this.scopeId;
          }
        }
        this.dataByCat[catId] = this.dataByCat[catId] || [];
        this.dataByCat[catId][ds.index] = (this.dataByCat[catId][ds.index] === t.innerText) ? null : t.innerText;
        let txt = this.dataByCat[catId].filter(x => x !== null).join(' ');
        this.inputDiv[catId].innerText = txt || EnumPicker.emptyPlaceholder;
        this.inputDiv[catId].classList.remove('ep-hidden');
        let res = {
          singleChoice: this.dataByCat[EnumPicker.inputCombinations.singleChoiceId],
          multipleChoice: this.dataByCat.slice(EnumPicker.inputCombinations.firstMultipleChoiceId)
        };
        let sel = this.dataByCat[EnumPicker.inputCombinations.selectorId];
        if (sel && sel.length) {
          res.selector = sel[sel.length-1];
        }
        callback(JSON.parse(JSON.stringify(res)));
      }
    }
    
    let inContainer = inputEl;
    if (inContainer.className !== 'ep-input-container') {
      inContainer = inContainer.parentElement;
    }
    if (inContainer.className !== 'ep-input-container') {
      console.log('INTERNALERROR');
      return;
    }
    if (this.inputContainer === inContainer) {
      // Update input scope.
      this.scopeId = this.inputDiv.indexOf(inputEl);
    } else {
      // Define or redefine picker.
      this.inputContainer = inContainer;
      this.scopeId = EnumPicker.inputCombinations.firstMultipleChoiceId;
      this.empty = true;
      this.dataByCat = [];
      this.inputContainer.innerHTML = '';
      this.inputDiv = [];
      let cn = 'ep-input-div';
      for (let i = 0; i < EnumPicker.inputCombinations.categories.length; i++) {
        this.inputDiv[i] = EnumPicker.appendDiv(this.inputContainer, cn, EnumPicker.emptyPlaceholder);
        cn = 'ep-input-div ep-hidden'; 
      }
      if (this.view) {
        this.view.innerHTML = '';
      } else {
        this.picker = EnumPicker.appendDiv(null, 'ep-window');
        this.view = EnumPicker.appendDiv(this.picker, 'ep-view');
        if (callback) {
          this.view.addEventListener('click', handleClick.bind(this));
        }
      }
      let bcIdx = -1;
      EnumPicker.inputCombinations.categories.forEach((inputType, typeId) => {
        if (inputRule.inputCombination[inputType]) {
          let basicCharacterNames = inputRule.inputCombination[inputType].split(' ');
          appendBasicCharacters(this.view, basicCharacterNames, typeId, bcIdx);
          if (inputType === 'singleChoice' & inputRule.additionalBasicCharacterNames.length) {
            appendBasicCharacters(this.view, inputRule.additionalBasicCharacterNames, typeId, bcIdx);
          }
        }
      });
    }
    return this.picker;
  }

}
