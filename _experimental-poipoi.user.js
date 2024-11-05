// ==UserScript==
// @name     _experimental-poipoi
// @version  87
// @grant    none
// @run-at   document-end
// @match    https://gikopoipoi.net/*
// @match    https://gikopoi.hu/*
// ==/UserScript==

document.currentScript?.remove();
document.querySelector('head').appendChild(document.createElement('script').appendChild(document.createTextNode('(' + async function inject() {

  document.currentScript?.remove();
  if (window.experimental || location.href.includes('video-tab.html'))
    return;
  window.experimental = true;
  if (window.iPhoneBookmarklet) {
    eval(await (await fetch('https://raw.githubusercontent.com/iwamizawa-software/poipoi-extension/refs/heads/main/src/poipoi-extension.js?t=' + (new Date).getTime())).text());
    return;
  }
  var migrateButtonContainer = document.createElement('div');
  migrateButtonContainer.id = 'migrateButtonContainer';
  migrateButtonContainer.setAttribute('style', 'position:absolute;top:0;right:20px;z-index:10001');
  document.body.insertBefore(migrateButtonContainer, document.body.firstChild);
  migrateButtonContainer.innerHTML = '<button style="background-color:#c88">スクリプトから拡張機能に移行します Migrate from userscript to extension</button>';
  migrateButtonContainer.onclick = () => open('https://iwamizawa-software.github.io/experimental-poipoi/migrate1.html', '_blank', 'noreferrer');

} + ')()')).parentNode);

