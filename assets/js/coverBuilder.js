(function (Dropzone, ImageBuilder) {
  var DOMURL = window.URL || window.webkitURL || window;

  var form = document.getElementById('generator');

  var templates = form.querySelectorAll('.chooseTemplate-item > svg');

  var builder = new ImageBuilder({
    canvasID: 'render'
  });

  var width = 835;
  var height = 315;

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

  function draw() {
    builder.clear();
    if (img.src) {
      builder.addImg(img);
    }
    if (svg.src) {
      builder.addImg(svg);
    }
    if (svg.src && img.src) {
      updateUrl(builder.getDaraUri());
      ennableDownload();
    }
  }

  function applyTemplate(id){
    var svgEl = document.getElementById(id);
    var data = (new XMLSerializer()).serializeToString(svgEl);
    var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    svg.src = DOMURL.createObjectURL(svgBlob);
  }

  function setTextInSvg (name, value) {
    Array.prototype.forEach.call(templates, function (el) {
      var textContainer = el.getElementById(el.id + '-' + name);
      if (textContainer) {
        textContainer.textContent = value;
      }
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    for (var i = 0; i < form.elements.length; i++) {
      var element = form.elements[i];
      var name = element.name;
      if (name !== 'template') {
        var value = element.value;
        setTextInSvg(element.name, element.value)
      }
    }

    var template = form.querySelector('.chooseTemplate-item > input:checked');
    if (template) {
      applyTemplate(template.value);
      draw();
    }
  }, false);

  downloadBtn.addEventListener('click', preventDefaultListener, false);

  img.addEventListener('load', draw, false);

  svg.addEventListener('load', draw, false);

  Dropzone.autoDiscover = false;
  new Dropzone('.dropzone', {
    url: 'fi', // pas besoin d'URL : on n'envoie pas les images au serveur
    autoProcessQueue: false,
    thumbnailWidth: width,
    thumbnailHeight: height,
    dictDefaultMessage: 'Cliquez ou glissez votre photo ici pour générer votre couverture Facebook',
    thumbnail: function (file, dataUrl) {
      img.src = dataUrl;
      var previews = document.getElementsByClassName('preview');
      Array.prototype.forEach.call(previews, function(el, i){
        el.setAttribute('style', 'background-image: url('+dataUrl+')');
      });
    }
  });

  Array.prototype.forEach.call(document.querySelectorAll('.chooseTemplate-item > input'), function (el) {
    el.addEventListener('click', function() {
      applyTemplate(el.value);
    });
  });
})(window.Dropzone, window.ImageBuilder);
