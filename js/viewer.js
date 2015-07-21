window.Viewer = {
  init: function () {
    var form, input, viewer;

    form = tinyDOM.select('.viewer-form');
    if (form == null) return null;

    input = tinyDOM.select('.viewer-form-input', form);
    if (input == null) return null;

    viewer = tinyDOM.select('.viewer');
    if (viewer == null) return null;

    this.form = form;
    this.input = input;
    this.viewer = viewer;

    this.form.bind('submit', function (e) {
      e.preventDefault();
      form.setAttribute('disabled', true);
      tinyTumblr.get({
        onError: function () {
          form.find('p').html('Oops, that was not so good. Try another username?');
          form.clearAttribute('disabled');
        },
        onSuccess: function (data) {
          viewer.style({display: 'block'});
          Viewer.render(data.response.posts);
        },
        tumblr: input.getAttribute('value')
      });
    });
  },

  render: function (posts) {

  }
}