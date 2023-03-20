// ==UserScript==
// @name     fast-poipoi
// @version  1
// @grant    none
// @run-at   document-start
// @match    https://gikopoipoi.net/*
// ==/UserScript==

function inject() {
  var json = Response.prototype.json;
  Response.prototype.json = async function () {
    var obj = await json.call(this);
    if (!this.url.indexOf('https://gikopoipoi.net/characters/'))
      for (var key in obj)
        obj[key].isBase64 = true;
    return obj;
  };
  var origImage = Image;
  window.Image = function () {
    var image = new origImage();
    Object.defineProperty(image, 'src', {
      get: () => image.getAttribute('src'),
      set: s => {
        var pngurl = 'data:image/png;base64,';
        image.setAttribute('src', !s.indexOf(pngurl) && s[pngurl.length] === '<' ? 'data:image/svg+xml;base64,' + btoa(s.slice(pngurl.length)) : s);
      }
    });
    image.decoding = 'async';
    return image;
  };
};
window.eval(`(${inject})()`);
