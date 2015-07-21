window.TinyTemplate = (function() {
  TinyTemplate.name = 'TinyTemplate';

  function TinyTemplate (template) {
    this.template = template;
  }

  TinyTemplate.prototype.render = function (options) {
    var i, templateFragment, templateFragments, templateString;

    templateFragments = this.template.split('~');
    templateString = '';

    for (i = 0; i < templateFragments.length; i++) {
      templateFragment = templateFragments[i];

      try {
        if (options[templateFragment]) {
          templateString += options[templateFragment];
        }
        else throw new Error('whatever');
      }

      catch (e) {
        templateString += templateFragment;
      }
    }

    return templateString;
  }

  return TinyTemplate;
})();