(function(Dropzone, Vue, html2canvas){

  var templates = [
    'assets/images/templates/photo-profil-rw.svg',
    'assets/images/templates/photo-profil-br.svg',
    'assets/images/templates/photo-profil-bw.svg'
  ];

  // configuration du drag & drop des images
  Dropzone.autoDiscover = false;
  var options           = {
    url:                'fi', // pas besoin d'URL : on n'envoie pas les images au serveur
    autoProcessQueue:   false,
    thumbnailWidth:     512,
    thumbnailHeight:    512,
    dictDefaultMessage: 'Cliquez ou glissez votre photo ici pour générer votre photo de profil',
    thumbnail:          function (file, dataUrl) {
      app.image.url = dataUrl // quand l'image est prête, on l'injecte dans la scène
      document.getElementById('preview').setAttribute('src', dataUrl);
    }
  };

  function downloadURI(uri, name) {
    var link      = document.createElement("a");
    link.download = name;
    link.href     = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  }

  new Dropzone(".dropzone", options);
  // initialisation de Vue
  var app = new Vue({
    el:      '#app',
    data:    {
      image:     { url: null },
      templates: templates,
      selected:  null,
      image_url: null,
      debat:     false
    },
    methods: {
      reflechissez: function () {
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var scene     = document.getElementById('scene');
        this.debat    = true;
        // on attend 100ms que l'image soit "prête"
        setTimeout(function () {
          // on transform la scene en image
          html2canvas(scene, {
            onrendered: function (canvas) {
              // repositionnement du scroll car html2canvas fait un scrollTop à la fin du rendu ><
              window.scrollTo(0, scrollPos);
              // modification du lien de l'image générée
              downloadURI(canvas.toDataURL('image/jpeg'), 'Photo de profil');
              setTimeout(function () {
                app.debat = false;
              }, 2500);
            }
          });
        }, 300);
      }
    }
  });
})(window.Dropzone, window.Vue, window.html2canvas);
