(function (Vue, imageBuilder) {
  var options = {
    width:           851,
    height:          315,
    dropzoneMessage: 'Cliquez ou glissez votre photo ici pour générer votre photo de couverture',
    filename:        'Photo de couverture insoumiseBen' +
                     '',
    templates:       [
      '/assets/images/templates/photo-profil-rw.svg',
      '/assets/images/templates/photo-profil-br.svg',
      '/assets/images/templates/photo-profil-bw.svg'
    ]
  };

  // initialisation de Vue
  var app = new Vue({
    el:      '#app',
    data:    {
      image:     { url: null },
      templates: options.templates,
      selected:  null,
      image_url: null,
      debat:     false
    },
    methods: {
      reflechissez: function () {
        this.debat = true;

        var cb = function () {
          setTimeout(function () {
            app.debat = false;
          }, 1000);
        };

        // on attend 100ms que l'image soit "prête"
        setTimeout(function () {
          imageBuilder.saveImage(options.filename, cb);
        }, 301);
      }
    }
  });

  options.thumbnail = function (dataUrl) {
    app.image.url = dataUrl;
  };

  imageBuilder.init(options);

  return app;
})(window.Vue, window.imageBuilder);
