(function (Dropzone, ImageBuilder) {


  var DOMURL = window.URL || window.webkitURL || window;

  var builder = new ImageBuilder({
    canvasID: 'render'
  });

  var width = 512;
  var height = 512;

  var img = new Image();
  var svg = new Image(width, height);

  var downloadBtn = document.getElementById('download');
  function updateUrl(dataUri) {
    downloadBtn.setAttribute('href', dataUri);
  }

  function preventDefaultListener(e) {
    e.preventDefault();
  }

  function ennableDownload() {
    downloadBtn.removeEventListener('click', preventDefaultListener, false);
    downloadBtn.removeAttribute('aria-disabled');
  }

  downloadBtn.addEventListener('click', preventDefaultListener, false);

  img.addEventListener('load', function() {
    builder.clear()
    builder.addImg(img);
    var template = document.querySelector('.chooseTemplate-item > input:checked');
    if (template) {
      builder.addImg(svg);
    }
  }, false);

  svg.addEventListener('load', function() {
    builder.clear();
    if (img.src) {
      builder.addImg(img);
    }
    builder.addImg(svg);
    updateUrl(builder.getDaraUri());
    ennableDownload();
  }, false);

  Dropzone.autoDiscover = false;
  new Dropzone('.dropzone', {
    url: 'fi', // pas besoin d'URL : on n'envoie pas les images au serveur
    autoProcessQueue: false,
    thumbnailWidth: width,
    thumbnailHeight: height,
    dictDefaultMessage: 'Cliquez ou glissez votre photo ici pour générer votre photo de profil',
    thumbnail: function (file, dataUrl) {
      img.src = dataUrl;
      var previews = document.getElementsByClassName('preview');
      Array.prototype.forEach.call(previews, function(el, i){
        el.setAttribute('style', 'background-image: url('+dataUrl+')');
      });
    }
  });

  Array.prototype.forEach.call(document.querySelectorAll('.chooseTemplate-item > input'), function(el) {
    el.addEventListener('click', function() {
      var svgEl = document.getElementById(el.getAttribute('value'));
      var xml = (new XMLSerializer()).serializeToString(svgEl);

      svg.src = 'data:image/svg+xml;base64,' + window.btoa(xml);
    });
  });
})(window.Dropzone, window.ImageBuilder);
