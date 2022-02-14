"use strict";


MAKey.Menu = class Menu {
  click(selector) {
    let item = document.querySelector(selector);
    item.click();
  }
  
  clicked(event) {
    if (this.selectedItem) {
      this.selectedItem.classList.remove('menu-item-selected');
    }
    this.selectedItem = event.currentTarget;
    if (this.selectedItem) {
      this.selectedItem.classList.add('menu-item-selected');
    }
  }
}


MAKey.InfoWindow = class {
  constructor(main) {
    this.main = main;
    this.view = document.createElement('div');
    this.view.id = 'info-view';
    this.view.addEventListener('click', () => {
      this.main.focussed = this;
    });
    let win = document.querySelector('#info-window');
    win.appendChild(this.view);
  }
  clear() {
    this.view.innerHTML = '';
  }
  append(el) {
    this.view.appendChild(el);
  }
  appendCaption(desc) {
    if (desc) {
      let div = document.createElement('div');
      div.className = 'ma-caption';
      if (desc.caption) {
        let p = document.createElement('p');
        p.innerText = desc.caption;
        div.appendChild(p);
      }
      let p = document.createElement('p');
      p.className = 'ma-small-line';
      if (desc.source) {
        let a = document.createElement('a');
        a.innerText = desc.c || desc.source;
        a.href = desc.source;
        a.target = '_blank';
        p.appendChild(a);
        div.appendChild(p);
      } else if (desc.c) {
        p.innerText = desc.c;
        div.appendChild(p);
      }
      this.view.appendChild(div);
    }
  }
}


MAKey.Browser = class Browser {
  
  constructor() {
    this.infoWindow = new MAKey.InfoWindow(this);
    this.multiAccessKey = new MAKey.MultiAccessKey(this);
    this.singleAccessKey = new MAKey.SingleAccessKey(this);
    this.singleAccessKey.setKey();

    this.menu = new MAKey.Menu();
    document.querySelector('#mi-single-access-key').addEventListener('click', event => {
      this.menu.clicked(event);
      this.activate(this.singleAccessKey);
    });
    document.querySelector('#mi-multi-access-key').addEventListener('click', event => {
      this.menu.clicked(event);
      this.activate(this.multiAccessKey);
    });
    this.menu.click('#mi-multi-access-key');

    this.activate(this.multiAccessKey);
    document.addEventListener('keydown', this.keydown.bind(this));
  }
  
  activate(screen) {
    if (screen && screen !== this.activeScreen) {
      if (this.activeScreen) {
        this.activeScreen.hide();
      }
      this.activeScreen = screen;
      screen.show();
    }
  }

  appendResources(desc, heading) {
    let self = this;
    function append(htmlElement) {
      if (heading) {
        STree.appendParagraph(self.infoWindow.view, heading, 'ma-heading');
        heading = null;
      }
      self.infoWindow.append(htmlElement);
    }

    if (desc && desc.fig) {
      let caption, figs = desc.fig;
      figs = (Array.isArray(figs)) ? figs : [figs];
      figs.forEach(desc => {
        desc = (Array.isArray(desc)) ? desc : [desc];
        let fig = desc[0];
        let path = fig;
        if (typeof fig === 'number') {
          fig = '' + fig;
          path = 'data/' + fig.substr(0, 3) + '/' + fig.substr(-2) + '.jpg';
          caption = MAKey.figures[fig];
        }
        if (path.endsWith('.pdf')) {
          let iframe = document.createElement('iframe');          
          iframe.className = 'embedded-pdf';
          iframe.src = path;
          append(iframe);
        } else {
          let img = document.createElement('img');          
          img.className = 'info-window-element';
          img.src = path;
          append(img);
        }
        this.infoWindow.appendCaption(caption);
      });
    }
  }

  appendTaxonResources(desc, sex) {
    if (typeof desc === 'string') {
      STree.appendParagraph(this.infoWindow.view, desc, 'ma-title');
      desc = MAKey.taxons[desc];
    }
    if (sex && sex !== 'common') {
      this.appendResources(desc[sex], STree.firstToUpperCase(sex));
    } else {
      for (let sex in desc) {
        if (sex) {
          this.appendResources(desc[sex], STree.firstToUpperCase(sex));
        }
      }
    }
  }

  keydown(event) {
    let keyCode = event.keyCode || event.which || event.charCode;
    if (this.focussed) {
      this.focussed.keydown(event, keyCode);
    }
  }
  
}  

MAKey.browser = new MAKey.Browser();
