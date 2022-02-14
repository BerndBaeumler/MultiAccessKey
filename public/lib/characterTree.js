"use strict";


MAKey.CharacterTree = class {
  
  constructor() {
    this.root = {};
    let items = this.items = [];
    let bodyParts = {};

    function appendItem(parent, name) {
      let item = {
        parent: parent,
        name: name,
        id: items.length
      };
      items.push(item);
      parent.children = parent.children || [];
      parent.children.push(item);
      return item;
    }
        
    function processBodyParts(parent, list) {
      list.forEach(name => {
        let item = appendItem(parent, name);
        if (bodyParts[name] === undefined) {
          bodyParts[name] = item;
        } else {
          // Set ambiguous body parts as invalid.
          bodyParts[name] = null;
          // console.log('INFO Ambiguous body part: ' + name);
        }
        if (MAKey.bodyParts[name]) {
          processBodyParts(item, MAKey.bodyParts[name]);
        }
      });
    }
    
    // Create the basic character tree from structured body parts 
    processBodyParts(this.root, MAKey.bodyParts.main);
    // Append all known characters to the character tree
    let charPaths = Object.keys(MAKey.characterByPath);
    charPaths.sort();
    for (let j = 0; j < charPaths.length; j++) {
      let characterPath = charPaths[j];
      let parts = characterPath.split('|');
      let node = bodyParts[parts[0]];
      let i = (node) ? 1 : 0;
      if (!node) {
        node = this.root;
      }
      // Walk through the existing parts of the character tree
      for ( ; i < parts.length; i++) {
        let nextNode;
        if (node.children) {
          for (let k = 0; k < node.children.length; k++) {
            if (node.children[k].name === parts[i]) {
              nextNode = node.children[k];
              break;
            }
          }
        }
        if (nextNode) {
          node = nextNode;
        } else {
          break;
        }
      }
      // Append missing parts of the character path to the character tree
      for ( ; i < parts.length; i++) {
        node = appendItem(node, parts[i]);
      }
      // Append the character to the character path
      node.character = MAKey.characterByPath[characterPath];
    }
    return this.root;
  }
}

  
MAKey.CharacterTreeView = class extends STree {

  constructor(main, prefix, viewSelector, selectedClassName) {
    super(prefix, viewSelector, selectedClassName);
    this.main = main;
    this.hide();
    this.characterTree = new MAKey.CharacterTree();
  }
  
  show(data, option) {
    let redraw = (data && (data !== this.data)) || (option !== this.option);
    this.option = option;
    this.data = data;
    if (redraw) {
      this.redraw();
    }
    this.view.style.display = 'block';
    this.main.focussed = this;
    this.select(this.selected);
  }
  
  hide() {
    this.view.style.display = 'none';
  }
  
  getLabel(item) {
    let label = super.getLabel(item);
    let note = item.desc.characterNote;
    if (note) {
      label = label + ' ' + note;
    }
    return label;
  }
    
  redraw() {
    this.clear();
    let d = this.data;
    if (d && d.charSet) {
      Object.keys(d.charSet).forEach(charId => {
        let character = MAKey.characterById[charId];
        let displayPath = character.path.replace('|', ' | ');
        let item = this.appendItem(null, displayPath);
        let value = MAKey.Parser.characterToText(d.charSet[charId], character.path);
        this.appendItem(item, value);
      });
    }
  }

  select(idOrItem) {
    this.main.focussed = this;
    super.select(idOrItem);
    this.main.infoWindow.clear();
    if (this.selected && this.selected.desc && this.selected.desc.charId) {
      let character = MAKey.characterById[this.selected.desc.charId];
      let c = MAKey.Parser.parseCharacter(this.selected.desc.value, character.path);
      this.main.appendResources(c.globalDescMeta);
      this.main.appendResources(c.meta);
    }
  }
  
  keydown(event, keyCode) {
    let c = String.fromCharCode(keyCode);
    c = c.toLowerCase();
    if (c >= 'a' && c <= 'z') {
      console.log('TODO To be implemented');
      /* 
      if (!isNaN(this.selected) && !isNaN(this.items[this.selected].parent) {
        let parent = this.items[this.selected].parent;
        let first = this.items[parent].firstChild;
        let chrIdx = this.getItemName(first).indexOf(' ') + 1;
        this.selectByChar(c, first, (id) => {
          return this.getItemName(id)[chrIdx];
        });
      }
      */
    } else {
      super.keydown(event, keyCode);
    }
  }
}
