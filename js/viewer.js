window.Viewer = {
  init: function () {
    var form, input;

    form = tinyDOM.select('.viewer-form');
    if (form == null) return null;

    input = tinyDOM.select('.viewer-form-input', form);
    if (input == null) return null;

    this.form = form;
    this.input = input;

    this.form.bind('submit', function (e) {
      e.preventDefault();
      form.setAttribute('disabled', true);
      tinyTumblr.get({
        onError: function (data) {
          form.find('p').html('Oops, that was not so good. Try another handle?');
          form.clearAttribute('disabled');
        },
        onSuccess: function (data) {
          console.log(data);
        },
        tumblr: input.getAttribute('value')
      });
    });
  }
}