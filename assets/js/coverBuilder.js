(function (Dropzone, ImageBuilder) {  
  Dropzone.autoDiscover = false;
  
  var DOMURL = window.URL || window.webkitURL || window;

  var builder = new ImageBuilder({
    canvasID: 'render'
  })

  var img = new Image();
  var svg = new Image(512, 515);

  img.addEventListener('load', function() {
    builder.addImg(img);
  }, false);

  svg.addEventListener('load', function() {
    builder.addImg(img);
    builder.addImg(svg);
    DOMURL.revokeObjectURL(svg.src);
  }, false);

  new Dropzone('.dropzone', {
    url: 'fi', // pas besoin d'URL : on n'envoie pas les images au serveur
    autoProcessQueue: false,
    thumbnailWidth: 512,
    thumbnailHeight: 512,
    dictDefaultMessage: 'Cliquez ou glissez votre photo ici pour générer votre photo de profil',
    thumbnail: function (file, dataUrl) {
      img.src = dataUrl; // quand l'image est prête, on l'injecte dans la scène
      var previews = document.getElementsByClassName('preview');
      Array.prototype.forEach.call(previews, function(el, i){
        el.setAttribute('style', 'background-image: url('+dataUrl+')');
      });  
    }
  });

  Array.prototype.forEach.call(document.querySelectorAll('.chooseTemplate-item > input'), function(el) {
    el.addEventListener('click', function() {
      var svgEl = document.getElementById(el.getAttribute('value'));
      var data = (new XMLSerializer()).serializeToString(svgEl);
      var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
      svg.src = DOMURL.createObjectURL(svgBlob);
    });
  });
})(window.Dropzone, window.ImageBuilder);
