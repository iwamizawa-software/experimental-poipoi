// ==UserScript==
// @name     experimental-poipoi-config
// @version  2
// @grant    none
// @run-at   document-end
// @match    https://gikopoipoi.net/*
// ==/UserScript==

var script = document.createElement('script');
script.textContent = '(' + function () {

  window.experimentalConfig = {
    // 入室してすぐ配信を受信する→1 しない→0
    takeStreamImmediately : 1,
    // 名無しに番号を振る→1 振らない→0 全員に白トリップを付ける→2
    numbering : 1,
    // Enter1回で吹き出しも消す→1 消さない→0
    clearBubble: 1,
    // 名前を呼ばれたとき通知を出す→1 出さない→0
    notifyMention: 1,
    // 呼出通知をクリックしたときに返信する言葉 返信しない→''
    replyMsg: 'ｎ',
    // 入退室を通知　常に通知→3 非アクティブ時に通知→2 アクティブ時に通知→1 通知しない→0
    notifyAccess: 1,
    // 入退室をログに出す→1 出さない→0
    accessLog: 0,
    // 自動相互あぼーん　誰もあぼーんしない→''
    // 名前を'で囲んでカンマ区切り　例：令和と◆SENVEYuLkwが含まれる名前をあぼーん→'令和,◆SENVEYuLkw'
    // RegExpオブジェクトも指定可
    autoBlock: '',
    // ログ窓のCSS ``の間に書く
    logWindowCSS: `
.message {
  padding: 2px 0;
  border-bottom: 1px solid #000;
}
    `
  };


  if (document.currentScript)
    document.currentScript.parentNode.removeChild(document.currentScript);

} + ')()';
document.querySelector('head').appendChild(script);

