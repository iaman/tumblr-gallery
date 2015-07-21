window.Viewer = {
  init: function () {
    var form, input;

    form = tinyDOM.select('.viewer-form')[0];
    if (form == null) return null;

    input = tinyDOM.select('.viewer-input');
    if (input == null) return null;

    this.form = form;
    this.input = input;

    this.form.bind('submit', function (e) {
      e.preventDefault();
    });
  }
}