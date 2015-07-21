var TinyDOMSelection;

TinyDOMSelection = (function () {
  TinyDOMSelection.name = 'TinyDOMSelection';

  function TinyDOMSelection (options) {
    if (typeof options == 'undefined' || typeof options.elements == 'undefined') return null;
    this.elements = options.elements;
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

window.TinyDOMSelection = TinyDOMSelection;

var tinyDOM = {
  select: function (selector) {
    var selection, type;

    type = typeof selector;
    if (type == 'undefined') return null;
    else if (type == 'TinyDOMSelection') return selector;
    else if (type == 'string') {
      return this.wrap(document.querySelectorAll(selector));
    }
  },

  wrap: function (nodeList) {
    return new TinyDOMSelection({elements: nodeList});
  }
};