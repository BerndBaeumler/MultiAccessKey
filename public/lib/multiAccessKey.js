"use strict";


MAKey.MultiAccessKey = class extends MAKey.CharacterTreeView {
  
  constructor(main) {
    super(main, 'ma', '#multi-access-view', 'row-selected');
    this.option = 'redraw';
    this.characterSet = [];
    this.results = {};
    this.matchingTaxons = {};
    for (let taxonName in MAKey.taxons) {
      this.results[taxonName] = {};
      for (let sex in MAKey.taxons[taxonName]) {
        this.matchingTaxons[taxonName + '|' + sex] = MAKey.taxons[taxonName][sex];
      }
    };
    this.taxonsTree = new MAKey.TaxonsTree(main, this, 'list');
  }
  
  redraw() {
    let self = this;
    
    function showChildren(characterTreeItem, displayedParentItem) {
      characterTreeItem.children.forEach(ctItem => {
        let displayedItem;
        let chr = ctItem.character;
        let inType = (chr && chr.type === 'number') ? 'number' :
                     (chr && chr.type === 'enum') ? 'div' : null;
        if (inType) {
          self.appendData(displayedParentItem, {label: ctItem.name, charId: chr.id}, inType);
        } else {
          displayedItem = self.appendItem(displayedParentItem, ctItem.name);
        }
        if (chr) {
          if (chr.type === 'desc') {
            for (let id in chr.desc) {
              if (STree.reNumberStr.exec(id)) {
                let cd = chr.desc;
                let dataItemDesc = {
                  label: (Array.isArray(cd[id])) ? cd[id][0] : cd[id],
                  charId: chr.id,
                  value: parseInt(id)
                };
                self.appendData(displayedItem, dataItemDesc, 'checkbox');
              }
            }
          }
        }
        if (ctItem.children) {
          showChildren(ctItem, displayedItem);
          self.setExpanded(displayedItem, false);
        }
      });
    }
    
    this.clear();
    this.displayRootItem = {dspl: {el: this.view}};
    showChildren(this.characterTree, this.displayRootItem);
    let dspl = this.displayRootItem.dspl;
    if (dspl.data) {
      dspl.data.classList.remove('st-data');
    }
    if (dspl.children) {
      dspl.children.classList.remove('st-children');
    }
    this.hideIrrelevantCharacters();
  }

  hideIrrelevantCharacters() {
    // Determine relevant characters
    let relevantCharacters = {};
    for (let id in this.matchingTaxons) {
      let taxonDesc = this.matchingTaxons[id];
      if (taxonDesc) {
        for (let chrId in taxonDesc.charSet) {
          relevantCharacters[chrId] = true;
        }
      }
    }
    // Update visibility of characters
    this.execute({}, this.displayRootItem,
      (item, dataIsMatching, itemsAreMatching) => {
        let isRelevant = item.desc && (relevantCharacters[item.desc.charId] || item.dspl.input);
        let matching = dataIsMatching || itemsAreMatching || isRelevant || item.isUsed;
        if (matching) {
          this.showItem(item);
        } else {
          this.hideItem(item);
        }
        return matching;
      });
  }

  updateResults(taxonName, sex, oldMatch, newMatch) {
    let result = this.results[taxonName][sex];
    if (!result) {
      result = this.results[taxonName][sex] = {matches: 0, deviations: 0};
    }
    
    function assertNotNegative(param) {
      if (result[param] < 0) {
        console.log('INTERNAL ERROR Negative', param, 'count of', result[param], 'for', taxonName);
      }
    }
    
    if (newMatch !== oldMatch) {
      if (oldMatch === false) {
        result.deviations--;
        if (result.deviations === 0) {
          // console.log('Append', taxonName, sex);
          this.matchingTaxons[taxonName + '|' + sex] = MAKey.taxons[taxonName][sex];
          this.taxonsTree.showTaxon(taxonName, sex);
        } else {
          assertNotNegative('deviations');
        }
      }
      if (newMatch === false) {
        result.deviations++;
        if (result.deviations === 1) {
          // console.log('Remove', taxonName, sex);
          this.matchingTaxons[taxonName + '|' + sex] = null;
          this.taxonsTree.hideTaxon(taxonName, sex);
        }
      }
      if (oldMatch === true) {
        result.matches--;
        assertNotNegative('matches');
      }
      if (newMatch === true) {
        result.matches++;
      }
    }
  }
  
  checkboxChanged(event, item) {
    
    function matches(taxonVal, inVal) {
      let inValCount = Object.keys(inVal).length;
      if (!taxonVal || inValCount === 0) {
        return null;
      } else {
        if (taxonVal.val < 0) {
          return inValCount > 1 || !inVal[taxonVal.val];
        } else {
          return inVal[taxonVal.val] === true;
        }
      }
    }

    // Determine old and new multiple choice input
    let values = this.characterSet[item.desc.charId] || {};
    let oldValues = Object.assign({}, values);
    if (event.target.checked) {
      values[item.desc.value] = true;
    } else {
      delete values[item.desc.value];
    }
    this.characterSet[item.desc.charId] = values;
    item.isUsed = Object.keys(values).length > 0;
    // Determine matching taxons and there characters
    this.relevantCharacters = {};
    Object.keys(MAKey.taxons).forEach(taxonName => {
      Object.keys(MAKey.taxons[taxonName]).forEach(sex => {
        let taxonValues = MAKey.taxons[taxonName][sex].charSet[item.desc.charId];
        let oldMatch = matches(taxonValues, oldValues);
        let newMatch = matches(taxonValues, values);
        if (oldMatch !== newMatch) {
          // console.log(taxonName, sex, oldMatch, newMatch);
          this.updateResults(taxonName, sex, oldMatch, newMatch);
        }
      });
    });
    this.hideIrrelevantCharacters();
  }

  textChanged(event, item) {
    let strictRanges = this.strictRanges;
    
    function matches(range, inVal) {
      if (!range || !inVal) {
        return null;
      } else {
        let min, max;
        if (strictRanges) {
          min = range[1] || range[0];
          max = range[3] || range[4];
        } else {
          min = range[0] || range[1];
          max = range[4] || range[3];
        }
        return (!min || min <= inVal) && (!max || max >= inVal);
      }
    }

    let oldValue = this.characterSet[item.desc.charId];
    let newValue = this.characterSet[item.desc.charId] = parseFloat(event.target.value);
    item.isUsed = newValue !== NaN;
    // Determine matching taxons and there characters
    this.relevantCharacters = {};
    Object.keys(MAKey.taxons).forEach(taxonName => {
      Object.keys(MAKey.taxons[taxonName]).forEach(sex => {
        let c = MAKey.taxons[taxonName][sex].charSet[item.desc.charId];
        let taxonValueRange = (c) ? c.val : null;
        let oldMatch = matches(taxonValueRange, oldValue);
        let newMatch = matches(taxonValueRange, newValue);
        if (oldMatch !== newMatch) {
          // console.log(taxonName, sex, oldMatch, newMatch);
          this.updateResults(taxonName, sex, oldMatch, newMatch);
        }
      });
    });
    this.hideIrrelevantCharacters();
  }

  enumChanged(item, inValue) {
    
    function matches(taxCharSet, inVal) {
      let res;
      // For all taxon variants
      for (let i = 0; i < taxCharSet.length; i++) {
        let taxVal = taxCharSet[i].val;
        res = (inVal.selector == taxVal.global); // Using "==" so that null and undefined are considered to be identical.
        if (res) {
          for (let i = 0; i < inVal.singleChoice.length; i++) {
            if (!taxVal[inVal.singleChoice[i]]) {
              res = false;
              break;
            }
          }
        }
        res = res && (taxVal.length >= inVal.multipleChoice.length);
        if (res) {
          for (let j = 0; j < inVal.multipleChoice.length; j++) {
            // console.log('in ', inVal.multipleChoice[j]);
            res = false;
            for (let i = 0; i < taxVal.length; i++) {
              // console.log('tax ', JSON.stringify(taxVal[i]));
              if (taxVal[i][inVal.multipleChoice[j]]) {
                res = true;
                // console.log('true');
                break;
              }
            }
            if (!res) {
              break;
            }
          }
        }
        if (res) {
          break;
        }
      }
      return res;
    }

    item.isUsed = false;
    let newValue = {
      singleChoice: [],
      selector: inValue.selector,
      multipleChoice: []
    };
    if (inValue.singleChoice) {
      for (let i = 0; i < inValue.singleChoice.length; i++) {
        let iv = inValue.singleChoice[i];
        if (iv) {
          newValue.singleChoice.push(iv);
          item.isUsed = true;
        }
      }
    }
    for (let i = 0; i < inValue.multipleChoice.length; i++) {
      let values = [];
      for (let j = 0; j < inValue.multipleChoice[i].length; j++) {
        let iv = inValue.multipleChoice[i][j];
        if (iv) {
          values.push(iv);
        }
      }
      if (values.length) {
        newValue.multipleChoice.push(values);
        item.isUsed = true;
      }
    }
    item.isUsed = item.isUsed || inValue.selector;
    let oldValue = this.characterSet[item.desc.charId];
    this.characterSet[item.desc.charId] = newValue;
    // console.log(oldValue, newValue);
    // Determine matching taxons and there characters
    this.relevantCharacters = {};
    Object.keys(MAKey.taxons).forEach(taxonName => {
      Object.keys(MAKey.taxons[taxonName]).forEach(sex => {
        let taxCharSet = MAKey.taxons[taxonName][sex].charSet[item.desc.charId];
        if (taxCharSet) {
          let oldMatch = (oldValue) ? matches(taxCharSet, oldValue) : null;
          let newMatch = matches(taxCharSet, newValue);
          if (oldMatch !== newMatch) {
            // console.log(taxonName, sex, oldMatch, newMatch);
            this.updateResults(taxonName, sex, oldMatch, newMatch);
          }
        }
      });
    });
    this.hideIrrelevantCharacters();
  }
  
  createInputDiv(desc) {
    return EnumPicker.createInput((event) => {
      let item = this.getItemFromEvent(event);
      if (!this.enumPicker) {
        this.enumPicker = new EnumPicker();
      }
      let inputRule = MAKey.CharacterValues.getInputRule(desc.charId);
      let pickerEl = this.enumPicker.updatePicker(event.target, inputRule, data => {
        this.enumChanged(item, data);
      });
      item.dspl.head.after(pickerEl);
    });
  }
    
}
