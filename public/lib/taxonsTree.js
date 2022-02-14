"use strict";


MAKey.TaxonsTree = class extends STree {
  
  constructor(main, owner, option) {
    super('tx', '#taxons-tree', 'row-selected');
    this.main = main;
    this.owner = owner || main;
    this.characterTreeView = new MAKey.CharacterTreeView(main, 'ct', '#character-tree', 'row-selected');
    this.characterTreeView.noExpander = true;

    
    /*
    this.miTaxonsCaptured = document.querySelector('#mi-taxons-captured');
    this.miTaxonsCaptured.addEventListener('click', () => {
      this.show('captured');
    });
    this.miTaxonsAll = document.querySelector('#mi-taxons-all');
    this.miTaxonsAll.addEventListener('click', () => {
      this.show('all');
    });
    */
    this.show(option || 'redraw');
  }
  
  show(option) {
    if (option === 'redraw') {
      this.redraw();
    } else if (option && this.option !== option) {
      this.option = option;
      this.redraw();
    }
    this.view.style.display = 'block';
    this.main.focussed = this;
    let toBeSelected = this.selected || 1;
    this.select(toBeSelected);
  }
  
  hide() {
    this.view.style.display = 'none';
  }

  clear() {
    super.clear();
    this.taxons = {};
  }
  
  hideTaxon(name, sex) {
    let taxon = this.taxons[name][sex];
    taxon.dspl.el.classList.add('st-hidden');
  }
  
  showTaxon(name, sex) {
    let taxon = this.taxons[name][sex];
    taxon.dspl.el.classList.remove('st-hidden');
  }
  
  redraw() {
    this.clear();
    let taxonNames = Object.keys(MAKey.taxons);
    taxonNames.sort();
    if (this.option === 'list') {
      // Creates a list structure.
      for (let i = 0; i < taxonNames.length; i++) {
        let taxon = MAKey.taxons[taxonNames[i]];
        let item = this.taxons[taxonNames[i]] = {};
        if (taxon.common) {
          item.common = this.appendItem(null, taxonNames[i]);
        }
        if (taxon.male) {
          item.male = this.appendItem(null, taxonNames[i] + ', male');
        }
        if (taxon.female) {
          item.female = this.appendItem(null, taxonNames[i] + ', female');
        }
      }
    } else {
      // Creates a tree structure.
      // Add a dummy taxon to make sure that the last real taxon will be displayed.
      taxonNames.push('@@@');
      let lastGenus, genusItem, firstTaxonName;
      for (let i = 0; i < taxonNames.length; i++) {
        let genusName = /^(\S+)/.exec(taxonNames[i])[1];
        if (genusName !== lastGenus) {
          if (firstTaxonName) {
            this.appendItem(null, firstTaxonName);
            firstTaxonName = undefined;
          }
          lastGenus = genusName;
          if (taxonNames[i] !== lastGenus) {
            firstTaxonName = taxonNames[i];
          }
        } else {
          if (firstTaxonName === undefined) {
            firstTaxonName = taxonNames[i];
          } else {
            if (firstTaxonName) {
              genusItem = this.appendItem(null, lastGenus);
              this.appendItem(genusItem, firstTaxonName);
              firstTaxonName = null;
            }
            this.appendItem(genusItem, taxonNames[i]);
          }
        }
      }
    }
  }

  select(idOrItem) {
    this.main.focussed = this;
    let item = this.getItem(idOrItem);
    super.select(item);
    this.main.infoWindow.clear();
    let parts = item.desc.split(', ');
    let taxon = MAKey.taxons[parts[0]];
    let sex = parts[1] || 'common';
    this.characterTreeView.show(taxon[sex]);
    this.main.appendTaxonResources(parts[0], sex);
  }
  
  keydown(keyCode) {
    let c = String.fromCharCode(keyCode);
    c = c.toLowerCase();
    if (c >= 'a' && c <= 'z' && !isNaN(this.selected) && !isNaN(this.items[this.selected].parent)) {
      let parent = this.items[this.selected].parent;
      let first = this.items[parent].firstChild;
      let charIdx = this.getItemName(first).indexOf(' ') + 1;
      this.selectByChar(c, first, (id) => {
        return this.getItemName(id)[charIdx];
      });
    } else {
      super.keydown(keyCode);
    }
  }
    
}
