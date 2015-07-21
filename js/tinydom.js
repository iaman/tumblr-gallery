window.TinyDOMSelection = (function () {
  TinyDOMSelection.name = 'TinyDOMSelection';


  function TinyDOMSelection (options) {
    if (typeof options == 'undefined' || typeof options.elements == 'undefined') return null;
    this.elements = options.elements;
  }

  TinyDOMSelection.prototype.bind = function(eventName, callback) {
    var el, i;

    for (i = 0; i < this.elements.length; i++) {
      el = this.elements[i];
      el.addEventListener(eventName, callback);
    }

    return this;
  }

  TinyDOMSelection.prototype.find = function(selector) {
    var i, j, children, selections;
    children = [];

    for (i = 0; i < this.elements.length; i++) {
      selections = tinyDOM.select(selector, this.elements[i], true);

      for (j = 0; j < selections.length; j++) {
        children.push(selections[j]);
      }
    }

    return new TinyDOMSelection({elements: children});
  }


  TinyDOMSelection.prototype.addClass = function(className) {
    var el, i;

    for (i = 0; i < this.elements.length; i++) {
      el = this.elements[i];
      el.classList.add(className);
    }

    return this;
  }

  TinyDOMSelection.prototype.removeClass = function(className) {
    var el, i;

    for (i = 0; i < this.elements.length; i++) {
      el = this.elements[i];
      el.classList.remove(className);
    }

    return this;
  }


  TinyDOMSelection.prototype.getAttribute = function (attribute) {
    var el, i, value;

    for (i = 0; i < this.elements.length; i++) {
      el = this.elements[i];

      if (attribute == 'value') {
        value = el.value;
      }
      else {
        value = el.getAttribute(attribute);
      }

      if (typeof value !== 'undefined') return value;
    }

    return null;
  }

  TinyDOMSelection.prototype.setAttribute = function (attribute, value) {
    var el, i;

    for (i = 0; i < this.elements.length; i++) {
      el = this.elements[i];

      if (typeof value == 'undefined') {
        el.removeAttribute(attribute);
      }

      else {
        el.setAttribute(attribute, value);
      }
    }
  }

  TinyDOMSelection.prototype.clearAttribute = TinyDOMSelection.prototype.setAttribute;


  TinyDOMSelection.prototype.html = function (html) {
    var el, i;

    for (i = 0; i < this.elements.length; i++) {
      el = this.elements[i];
      el.innerHTML = html;
    }
  }

  TinyDOMSelection.prototype.style = function(styles) {
    var el, elStyles, i, j, keys, newStyles;
    newStyles = [];

    for (i = 0; i < this.elements.length; i++) {
      el = this.elements[i];
      elStyles = el.getAttribute('style');

      if (typeof elStyle == 'object') {
        keys = Object.keys(styles);

        for (j = 0; j < keys.length; j++) {
          newStyles.push(keys[j] + ':' + styles[keys[j]]);
        }
      }
      else {
        var key, reducedStyles, rule;

        reducedStyles = [];
        elStyles = elStyles.split(';');

        for (j = 0; j < elStyles.length; j++) {
          rule = elStyles[j];
          key = rule.split[':'];
          if (typeof styles[key] != 'undefined') {
            newStyles.push(key + ':' + styles[key]);
            delete styles[key];
          }
          else {
            newStyles.push(rule);
          }
        }

        keys = Object.keys(styles);

        for (j = 0; j < keys.length; j++) {
          newStyles.push(keys[j] + ':' + styles[keys[j]])
        }

        for (j = 0; j < newStyles.length; j++) {
          if (newStyles[j].split(':')[1] !== '') {
            reducedStyles.push(newStyles[j]);
          }
        }

        newStyles = reducedStyles;
      }

      el.setAttribute('style', reducedStyles.join(';'));
    }

    return this;
  }

  return TinyDOMSelection;
})();

window.tinyDOM = {
  select: function (selector, parent, returnEls) {
    var selection, type;

    type = typeof selector;

    if (type == 'undefined') return null;

    else if (selector instanceof TinyDOMSelection) {
      return selector;
    }
    
    else if (type == 'string') {
      if (parent instanceof TinyDOMSelection) return parent.find(selector);
      else if (typeof parent == 'undefined') parent = document;
      selection = parent.querySelectorAll(selector)

      if (returnEls) return selection;
      else return this.wrap(selection);
    }
  },

  wrap: function (nodeList) {
    return new TinyDOMSelection({elements: nodeList});
  }
};