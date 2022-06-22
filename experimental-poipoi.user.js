// ==UserScript==
// @name     experimental-poipoi
// @version  17
// @grant    none
// @run-at   document-end
// @match    https://gikopoipoi.net/*
// ==/UserScript==


(async function () {
  try {
    var script = document.createElement('script');
    script.textContent = await (await fetch('https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/_experimental-poipoi.user.js?t=' + (new Date).getTime())).text();
    document.querySelector('head').append(script);
  } catch (err) {
    console.log(err);
  }
})();
