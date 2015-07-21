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
    this.templates = {};

    this.templates.viewerPaneTemplate = new TinyTemplate('<figure class="viewer-pane" id="~postId~"><div class="viewer-images">~imageSection~</div>~captionSection~</figure>');
    this.templates.viewerImageTemplate = new TinyTemplate('<img src="~imageSrc~" />');
    this.templates.viewerCaptionTemplate = new TinyTemplate('<figcaption class="viewer-caption">~captionString~</figcaption>');

    this.form.bind('submit', function (e) {
      e.preventDefault();

      form.setAttribute('disabled', true);

      tinyTumblr.get({
        onError: function () {
          form.select('p').html('Oops, that was not so good. Try another username?');
          form.clearAttribute('disabled');
        },

        onSuccess: function (data) {
          form.addClass('hidden');
          viewer.removeClass('hidden');
          Viewer.render(data.response.posts);
        },

        tumblr: input.getAttribute('value')
      });
    });

    document.body.addEventListener('keydown', function (e) {
      if (Viewer.currentViewerPane == null) return null;

      if (e.keyCode == 37) {
        Viewer.goBackward();
      }

      else if (e.keyCode == 39) {
        Viewer.goForward();
      }

      else if (e.keyCode == 27) {
        Viewer.tearDownViewer();
      }
    });
  },

  render: function (posts) {
    var i, renderedString, viewerPane, viewerPanes;

    renderedString = '';
    viewerPanes = [];

    for (i = 0; i < posts.length; i++) {
      viewerPane = new ViewerPane(this.templates, posts[i]);
      renderedString += viewerPane.render();
      viewerPanes.push(viewerPane);
    }

    renderedString += '<a class="close-button">&times;</a><a class="left-button hidden">&lt;</a><a class="right-button">&gt;</a>';

    this.viewer.html(renderedString).style({transform:''});
    this.viewer.select('.close-button').bind('click', this.tearDownViewer);
    this.viewer.select('.left-button').bind('click', this.goBackward);
    this.viewer.select('.right-button').bind('click', this.goForward);

    for (i = 0; i < viewerPanes.length; i++) {
      viewerPane = viewerPanes[i];
      viewerPane.el = tinyDOM.select('#' + viewerPane.post.postId);
    }

    this.currentViewerPane = 0;

    viewerPanes[0].el.addClass('state-viewer-pane-active');
    viewerPanes[0].el.select('img:first-child').bind('load', function (e) {
      e.target.classList.add('state-image-active');
    });

    this.viewerPanes = viewerPanes;
  },

  goBackward: function (e) {
    if (typeof e !== 'undefined') e.preventDefault();
    var currentViewerPane;

    currentViewerPane = Viewer.viewerPanes[Viewer.currentViewerPane];

    if (Viewer.currentViewerPane !== 0 && currentViewerPane.currentImage == 0) {
      Viewer.shiftViewerPane(false);
    }

    else if (currentViewerPane.currentImage > 0) {
      currentViewerPane.shiftImage(false);
    }

    if (Viewer.currentViewerPane == Viewer.viewerPanes.length - 2 || (Viewer.currentViewerPane == Viewer.viewerPanes.length - 1 && Viewer.viewerPanes[Viewer.currentViewerPane].currentImage == Viewer.viewerPanes[Viewer.currentViewerPane].images.length - 2)) {
      Viewer.viewer.select('.right-button').removeClass('hidden');
    }
    else if (Viewer.currentViewerPane == 1 || (Viewer.currentViewerPane == 0 && Viewer.viewerPanes[Viewer.currentViewerPane].currentImage == 0)) {
      Viewer.viewer.select('.left-button').addClass('hidden');
    }
  },

  goForward: function () {
    if (typeof e !== 'undefined') e.preventDefault();
    var currentViewerPane;

    currentViewerPane = Viewer.viewerPanes[Viewer.currentViewerPane];

    if (Viewer.currentViewerPane !== (Viewer.viewerPanes.length - 1) && currentViewerPane.currentImage == (currentViewerPane.images.length - 1)) {
      Viewer.shiftViewerPane(true);
    }

    else if (currentViewerPane.currentImage < currentViewerPane.images.length - 1) {
      currentViewerPane.shiftImage(true);
    }

    if (Viewer.currentViewerPane == 0 && Viewer.viewerPanes[Viewer.currentViewerPane].currentImage == 1) {
      Viewer.viewer.select('.left-button').removeClass('hidden');
    }
    else if (Viewer.currentViewerPane == Viewer.viewerPanes.length - 1 && Viewer.viewerPanes[Viewer.currentViewerPane].currentImage == (Viewer.viewerPanes[Viewer.currentViewerPane].length || 1) - 1) {
      Viewer.viewer.select('.right-button').addClass('hidden');
    } 
  },

  shiftViewerPane: function (forward) {
    if ((!forward && this.currentViewerPane == 0) || (forward && this.currentViewerPane == this.viewerPanes.length - 1)) return null;
    var currentViewerPane, newViewerPane;

    currentViewerPane = this.viewerPanes[this.currentViewerPane];
    currentViewerPane.el.bind('transitionend', this.hideViewerPane);

    if (forward) {
      currentViewerPane.el.style({transform: 'translateX(-500%)'}).removeClass('state-viewer-pane-active');
      this.currentViewerPane++;
      newViewerPane = this.viewerPanes[this.currentViewerPane];
    }
    else {
      currentViewerPane.el.style({transform: 'translateX(500%)'}).removeClass('state-viewer-pane-active');
      this.currentViewerPane--;
      newViewerPane = this.viewerPanes[this.currentViewerPane];
    }

    newViewerPane.el.unbind('transitionend', this.hideViewerPane);
    newViewerPane.el.removeClass('hidden').addClass('state-viewer-pane-active').style({transform: ''});
    newViewerPane.el.select('img:first-child').addClass('state-image-active');
  },

  hideViewer: function () {
    Viewer.viewer.html('');
    Viewer.viewer.addClass('hidden');
    Viewer.viewer.unbind('transitionend', Viewer.hideViewer);
  },

  hideViewerPane: function (e) {
    if (e.target.classList.contains('viewer-pane')) {
      e.target.classList.add('hidden');
    }
  },

  tearDownViewer: function () {
    Viewer.viewer.style({transform: 'translateX(500%)'}).bind('transitionend', Viewer.hideViewer);
    Viewer.form.clearAttribute('disabled').removeClass('hidden');
    Viewer.currentViewerPane = null;
  }
}

window.ViewerPane = (function() {
  ViewerPane.name = 'ViewerPane';

  function ViewerPane(templates, post) {
    var i;

    this.post = {
      captionString: post.caption,
      postId: 'viewer-pane-' + post.id
    };

    this.currentImage = 0;
    this.images = [];
    this.templates = templates;

    for (i = 0; i < post.photos.length; i++) {
      this.images.push({imageSrc: post.photos[i].original_size.url});
    }
  }

  ViewerPane.prototype.render = function () {
    var captionSection, i, images, imageSection;

    imageSection = '';

    for (i = 0; i < this.images.length; i++) {
      imageSection += this.templates.viewerImageTemplate.render(this.images[i]);
    }

    this.post.imageSection = imageSection;

    if (this.post.captionString) {
      this.post.captionSection = this.templates.viewerCaptionTemplate.render(this.post);
    }
    else this.post.captionSection = ' ';

    return this.templates.viewerPaneTemplate.render(this.post);
  }

  ViewerPane.prototype.shiftImage = function (forward) {
    if ((!forward && this.currentImage == 0) || (forward && this.currentImage == this.images.length - 1)) return null;
    var currentImage = this.el.select('img:nth-child(' + (this.currentImage + 1) + ')');

    if (forward) {
      currentImage.style({transform: 'translateX(-500%)'}).removeClass('state-image-active');
      this.currentImage++;
    }
    else {
      currentImage.style({transform: 'translateX(500%)'}).removeClass('state-image-active');
      this.currentImage--;
    }

    currentImage = this.el.select('img:nth-child(' + (this.currentImage + 1) + ')');
    currentImage.addClass('state-image-active').style({transform: ''});
  }

  return ViewerPane;
})();