'use strict';

var isBrowser = typeof window !== 'undefined';

module.exports = function loadTexture(gl, url, opts, callback) {
  if (isBrowser) return loadTextureBrowser(gl, url, opts, callback);
  throw 'loadTexture: texture loading not yet supported from Node / Plask';
};

function loadTextureBrowser(gl, url) {
  var opts     = arguments.length === 4 ? arguments[2] : {};
  var callback = arguments.length === 3 ? arguments[2] : arguments[3];

  var img = new Image();

  img.onload = function onLoad() {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!opts.flip);

    var minFilter = opts.minFilter || opts.filter || gl.NEAREST;
    var magFilter = opts.magFilter || opts.filter || gl.NEAREST;
    var wraps     = opts.wrapS     || opts.wrap   || gl.CLAMP_TO_EDGE;
    var wrapt     = opts.wrapT     || opts.wrap   || gl.CLAMP_TO_EDGE;
    var iformat   = opts.internalFormat           || gl.RGBA;
    var format    = opts.format                   || gl.RGBA;
    var type      = opts.type                     || gl.UNSIGNED_BYTE;

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wraps);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapt);
    gl.texImage2D(gl.TEXTURE_2D, 0, iformat, format, type, img);

    // Make sure to unbind
    gl.bindTexture(gl.TEXTURE_2D, null);

    callback(null, tex);
  };

  img.onerror = function onError() {
    callback(new Error('Could not load texture: ' + url));
  };

  img.src = url;
}
