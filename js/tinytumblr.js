window.tinyTumblr = {

  // Generates a random function name to append to window since we need one for JSONP
  callbackGenerator: function (request, onSuccess, onError) {
    var randomFunctionName;

    randomFunctionName = 'tinyTumblrCallback' + Math.floor(Math.random() * 200);

    window[randomFunctionName] = function(data) {
      if (data.meta.status == 200) {
        onSuccess(data);
      }
      else {
        if (typeof onError == 'function') {
          onError(data);
        }
      }
      delete window[randomFunctionName];
      request.remove();
    }

    return randomFunctionName;
  },

  // Gets photo posts from a specific tumblr user
  get: function (options) {
    if (typeof options == 'undefined' || typeof options.tumblr == 'undefined' || typeof options.onSuccess == 'undefined') return null;
    var callback, request;

    request = document.createElement('script');
    callback = this.callbackGenerator(request, options.onSuccess, options.onError);

    // Eww, CORS workaround using JSONP
    request.src = 'http://api.tumblr.com/v2/blog/' + options.tumblr + '.tumblr.com/posts/photo?api_key=SVPcAcUniocBCwxybdOPyV3D0pHZL7kl0L7ndtvXQspDEPDXb8&jsonp=' + callback; // Shh, that's my API key
    document.head.appendChild(request);
  }
}