window.imageBuilder = (function (Dropzone, html2canvas) {
  var imageBuilder = {
    options: {},

    init: function (options) {
      imageBuilder.options = options;

      // configuration du drag & drop des images
      Dropzone.autoDiscover = false;
      var dzOptions         = {
        url:                'fi', // pas besoin d'URL : on n'envoie pas les images au serveur
        autoProcessQueue:   false,
        thumbnailWidth:     imageBuilder.options.width,
        thumbnailHeight:    imageBuilder.options.height,
        dictDefaultMessage: imageBuilder.options.dropzoneMessage,
        thumbnail:          imageBuilder.injectImage
      };

      // initialisation de la dropzone
      new Dropzone(".dropzone", dzOptions);
    },

    saveImage: function (filename, cb) {
      var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var scene     = document.getElementById('scene');

      // on transform la scene en image
      html2canvas(scene, {
        onrendered: function (canvas) {
          // repositionnement du scroll car html2canvas fait un scrollTop à la fin du rendu ><
          window.scrollTo(0, scrollPos);

          // Téléchargement de l'image générée
          imageBuilder.downloadURI(canvas.toDataURL('image/png'), filename);

          // appel de la fonction de retour
          cb();
        }
      });
    },

    downloadURI: function (uri, name) {
      var link      = document.createElement("a");
      link.download = name;
      link.href     = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      delete link;
    },

    // quand l'image est prête, on l'injecte dans la scène
    injectImage: function (file, dataUrl) {
      console.log(imageBuilder.options);
      imageBuilder.options.thumbnail(dataUrl);
      document.getElementById('preview').setAttribute('style', 'background-image: url(' + dataUrl + ')');
    }
  };

  return imageBuilder;
})(window.Dropzone, window.html2canvas);
