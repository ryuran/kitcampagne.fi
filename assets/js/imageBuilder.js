window.ImageBuilder = (function () {

  var defaultConfig = {
    canvasID: 'canvas'
  };

  function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i])
        continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          out[key] = arguments[i][key];
      }
    }

    return out;
  };

  function ImageBuilder(config) {
    this.config = extend({}, defaultConfig, config);

    this.canvas = document.getElementById(this.config.canvasID);

    this.width = this.canvas.getAttribute('width');
    this.height = this.canvas.getAttribute('height');
  }

  ImageBuilder.prototype.addImg = function addImg(img) {
    var context = this.canvas.getContext('2d');

    // default offset is center
    var offsetX = 0.5;
    var offsetY = 0.5;

    var w = this.canvas.width,
        h = this.canvas.height,
        iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    context.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
  };

  ImageBuilder.prototype.clear = function clear() {
    var context = this.canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  ImageBuilder.prototype.getDaraUri = function getDaraUri() {
    return this.canvas.toDataURL('image/png');
  }

  return ImageBuilder;
})();
