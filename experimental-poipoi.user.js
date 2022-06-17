// ==UserScript==
// @name     experimental-poipoi
// @version  14
// @grant    none
// @run-at   document-end
// @match    https://gikopoipoi.net/*
// ==/UserScript==

var inject = function inject() {

  if (!window.vueApp || !vueApp.updateRoomState || !window.experimentalConfig) {
    setTimeout(inject, 2000);
    return;
  }
  if (document.currentScript)
    document.currentScript.parentNode.removeChild(document.currentScript);
  Object.defineProperty(console, 'error', {
    set: function () {},
    get: function () { return console.log; }
  });
  var text = (_gen, _for) => vueApp.areaId === 'gen' ? _gen : _for;
  var systemMessage = msg => vueApp.writeMessageToLog('SYSTEM', msg, null);
  var sendMessage = function (msg) {
    vueApp.socket.emit('user-msg', msg);
    vueApp.socket.emit('user-msg', '');
  };
  // 入室時
  var updateRoomState = vueApp.updateRoomState;
  vueApp.updateRoomState = async function (dto) {
    var r = await updateRoomState.call(this, dto);
    // デフォルトで受信状態にする
    if (experimentalConfig.takeStreamImmediately)
      for (var i = 0; i < dto.streams.length; i++)
        vueApp.wantToTakeStream(i);
    // アドレスバーを現在の部屋のURLに書き換え
    history.replaceState(null, '', '/?areaid=' + vueApp.areaId + '&roomid=' + dto.currentRoom.id);
    return r;
  };
  // ユーザー追加時
  var addUser = vueApp.addUser;
  vueApp.addUser = function (userDTO) {
    // 名無しナンバリング
    if (experimentalConfig.numbering && typeof userDTO.id === 'string') {
      userDTO.name = vueApp.toDisplayName(userDTO.name);
      if (experimentalConfig.numbering === 1 && userDTO.name === vueApp.toDisplayName(''))
        userDTO.name += parseInt(userDTO.id.slice(-3), 16);
    }
    // 自動あぼーん
    var autoBlock = experimentalConfig.autoBlock;
    if (
      autoBlock &&
      userDTO.id !== vueApp.myUserID &&
      (typeof autoBlock === 'string' ? autoBlock.split(',').some(name => userDTO.name.indexOf(name) !== -1) : autoBlock.test(userDTO.name))
    ) {
      setTimeout(function () {
        vueApp.socket.emit('user-block', userDTO.id);
        systemMessage(userDTO.name + text('を自動相互あぼーんした', ' has been blocked automatically'));
      }, 0);
    }
    return addUser.call(this, userDTO);
  };
  // Ctrl+Delキーで吹き出し消す
  document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.key === 'Delete') {
      for (var id in vueApp.users)
        vueApp.users[id].message = '';
      vueApp.resetBubbleImages();
    }
  });
  // 新しいメッセージボタン
  var chatLog, isAtBottom = () => (chatLog.scrollHeight - chatLog.clientHeight) - chatLog.scrollTop < 5;
  var newMessageButtonContainer = document.createElement('div');
  newMessageButtonContainer.id = 'login-page';
  newMessageButtonContainer.setAttribute('style', 'position:relative;top:-46px;text-align:center;width:100%;user-select:none;pointer-events:none');
  var newMessageButton = newMessageButtonContainer.appendChild(document.createElement('button'));
  newMessageButton.onclick = () => {
    chatLog.scrollTop = chatLog.scrollHeight - chatLog.clientHeight;
  };
  newMessageButton.style.pointerEvents = 'auto';
  var writeMessageToLog = vueApp.writeMessageToLog;
  vueApp.writeMessageToLog = function (userName, msg, userId) {
    if (!chatLog) {
      chatLog = document.getElementById('chatLog');
      chatLog.addEventListener('scroll', () => {
        if (isAtBottom())
          newMessageButtonContainer.style.display = 'none';
      });
    }
    if (!chatLog.parentNode.contains(newMessageButtonContainer)) {
      newMessageButton.textContent = text('↓ 新しいメッセージ', '↓ New Messages');
      newMessageButtonContainer.style.display = 'none';
      chatLog.parentNode.appendChild(newMessageButtonContainer);
    }
    if (!isAtBottom())
      newMessageButtonContainer.style.display = '';
    return writeMessageToLog.apply(this, arguments);
  };
  // Enter1回で吹き出しを消す
  var handleMessageInputKeypress = vueApp.handleMessageInputKeypress;
  vueApp.handleMessageInputKeypress = function (event) {
    var v = handleMessageInputKeypress.apply(this, arguments);
    if (experimentalConfig.clearBubble)
      vueApp.socket.emit('user-msg', '');
    return v;
  };
  // ログ分割
  var rightUsers = {};
  var splittedLogStyle = document.querySelector('head').appendChild(document.createElement('style'));
  var updateLogStyle = function () {
    var y = document.getElementById('chatLog').scrollTop;
    var rightUsersList = Object.keys(rightUsers);
    if (rightUsersList.length)
      splittedLogStyle.textContent = rightUsersList.map(id => '[data-user-id="' + id + '"]').join(',') + `{position:relative;left:50%}
.message{
width: 50%;
}
.dark-mode .message,.dark-mode .message:nth-child(2n){
background-color: unset !important;
}
`;
    else
      splittedLogStyle.textContent = '';
    setTimeout(() => document.getElementById('chatLog').scrollTop = y, 0);
  };
  var resetLogStyle = function () {
    rightUsers = {};
    updateLogStyle();
  };
  var moveLog = function (userId) {
    if (rightUsers[userId])
      delete rightUsers[userId];
    else
      rightUsers[userId] = 1;
    updateLogStyle();
  };
  // ログメニュー
  var logMenu = document.body.appendChild(document.createElement('select'));
  var selectedUserId;
  logMenu.setAttribute('style', 'position:fixed;display:none');
  logMenu.size = 6;
  logMenu.onchange = function () {
    switch (logMenu.value) {
      case 'moveLog':
        moveLog(selectedUserId);
        break;
      case 'block':
        vueApp.blockUser(selectedUserId);
        break;
      case 'resetSplit':
        resetLogStyle();
        break;
      case 'clearLog':
        vueApp.clearLog();
        break;
    }
    logMenu.style.display = 'none';
  };
  document.addEventListener('click', function (event) {
    if (event.target.parentNode !== logMenu)
      logMenu.style.display = 'none';
  });
  document.addEventListener('contextmenu', function (event) {
    logMenu.style.display = 'none';
    if (!event.ctrlKey && event.target.classList.contains('message-author')) {
      selectedUserId = event.target.parentNode.dataset.userId;
      logMenu.innerHTML = `
<option disabled selected>-
<option value="moveLog">${rightUsers[selectedUserId] ? text('左寄せ', 'Align left') : text('右寄せ', 'Align right')}
<option value="block">${text('相互あぼーん', 'Block')}
<option disabled>-
<option value="resetSplit">${text('右寄せ全解除', 'Align left all')}
<option value="clearLog">${text('ログをクリア', 'Clear log')}
`;
      logMenu.options[0].text = (vueApp.users[selectedUserId] || {name: event.target.textContent}).name;
      logMenu.style.bottom = (document.documentElement.clientHeight - event.clientY) + 'px';
      logMenu.style.left = event.pageX + 'px';
      logMenu.style.display = 'block';
      event.preventDefault();
    }
  });
  // ユーザーリスト表示時
  var getUserListForListPopup = vueApp.getUserListForListPopup;
  vueApp.getUserListForListPopup = function () {
    var output = getUserListForListPopup.apply(this, arguments);
    if (experimentalConfig.numbering === 2)
      output.forEach(u => {
        if (u.isInRoom)
          u.name = u.name.replace(/(◆.+)?$/, '◇' + btoa(u.id.replace(/-/g, '').replace(/../g, function (s) {return String.fromCharCode('0x' + s)})).slice(0, 6) + '$1')
      });
    return output;
  };
  // ログ追加時
  var writeLogToWindow;
  HTMLDivElement.prototype.appendChild = function (aChild) {
    if (this.id === 'chatLog') {
      try {
        // 白トリップ表示
        if (experimentalConfig.numbering === 2 && aChild.dataset.userId && aChild.dataset.userId !== 'null')
          aChild.querySelector('.message-author').innerHTML += '◇' + btoa(aChild.dataset.userId.replace(/-/g, '').replace(/../g, function (s) {return String.fromCharCode('0x' + s)})).slice(0, 6);
        // ログ窓に書き出し
        if (writeLogToWindow && !aChild.classList.contains('ignored-message'))
          writeLogToWindow(aChild.innerText);
      } catch (err) {
        console.log(err);
      }
    }
    return Node.prototype.appendChild.call(this, aChild);
  };
  // ログイン時
  var onlogin = function () {
    // 音声入力
    var textbox = document.getElementById('input-textbox');
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      textbox.parentNode.insertBefore(document.createElement('span'), textbox).innerHTML = '<br><label><input type="checkbox" id="enableSpeech">' + text('音声', 'Voice') + '</label>';
      textbox.previousSibling.firstChild.before(textbox.parentNode.firstChild);
      var enableSpeech = document.getElementById('enableSpeech');
      enableSpeech.onclick = function () {
        recognition.locale = vueApp._i18n.locale;
        recognition[enableSpeech.checked ? 'start' : 'stop']();
      };
      var recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = function (event) {
        var result = [];
        for (var i = event.resultIndex; i < event.results.length; i++)
          if (event.results[i].isFinal)
            result.push(event.results[i][0].transcript);
        sendMessage(text('音声入力:', 'Voice input:') + result.join(' '));
      };
      recognition.onend = function () {
        if (enableSpeech.checked)
          recognition.start();
      };
    }
    // ログ窓
    var logWindow;
    writeLogToWindow = function (text, forceScroll) {
      if (!logWindow || logWindow.closed)
        return;
      var log = logWindow.document.body.firstElementChild;
      var bottom = (log.scrollHeight - log.clientHeight) - log.scrollTop < 5;
      log.value += ('' + text).replace(/(^|\n)\[[\d\-\s:]+\]\s/g, '$1') + '\n';
      if (forceScroll || bottom)
        log.scrollTop = log.scrollHeight - log.clientHeight;
    };
    var logWindowButton = document.createElement('input');
    logWindowButton.type = 'button';
    logWindowButton.value = text('ログ窓', 'Log Window');
    logWindowButton.onclick = function () {
      if (logWindow && !logWindow.closed) {
        logWindow.focus();
        return;
      }
      logWindow = open('about:blank', 'log', 'width=300,height=500,menubar=no,toolbar=no,location=no');
      if (!logWindow) {
        vueApp.showWarningToast(text('ポップアップを許可してください', 'Allow to popup'));
        return;
      }
      logWindow.document.write(`
<!doctype html>
<title>${text('ギコっぽいぽいログ', 'Gikopoipoi Log')}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;width:100%;height:100%;resize:none}
textarea{height:calc(100% - 3em);padding:2px;font-size:12px;line-height:1.5}
input{display:block;position:fixed;bottom:0;height:2em}
</style>
<textarea readonly></textarea><input type="text">
`);
      logWindow.onload = function () {
        writeLogToWindow(document.getElementById('chatLog').innerText, true);
        logWindow.document.body.lastElementChild.onkeypress = function (event) {
          if (this.value && event.key === 'Enter') {
            sendMessage(this.value);
            this.value = '';
          }
        };
      };
      logWindow.onfocus = function () {
        logWindow.document.body.lastElementChild.focus();
      };
      logWindow.document.close();
    };
    document.getElementById('chatLog').before(logWindowButton);
  };
  if (document.getElementById('input-textbox')) {
    onlogin();
  } else {
    var connectToServer = vueApp.connectToServer;
    vueApp.connectToServer = async function () {
      var r = await connectToServer.apply(this, arguments);
      onlogin();
      return r;
    };
  }
  // 呼び出し通知
  var getCharacterPath = user => {
    var name = user.characterId || (user.character && user.character.characterName);
    return 'characters/' + name + '/front-standing.' + (vueApp.allCharacters.find(c=>c.characterName===name) || {format:'svg'}).format;
  }
  var pngCache = {};
  var SVG2PNG = async function (url) {
    var callback;
    if (url.slice(-3) === 'png')
      return url;
    if (pngCache[url])
      return pngCache[url];
    try {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = canvas.height;
        ctx.drawImage(img, 0, 0);
        callback(pngCache[url] = canvas.toDataURL('image/png'));
      };
      img.src = 'data:image/svg+xml,' + encodeURIComponent(await (await fetch(url)).text());
    } catch (err) {
      return url;
    }
    return {then:c=>callback=c};
  };
  var mention;
  var mentionNotification = async function (user, msg) {
    if (
      experimentalConfig.notifyMention &&
      !document.hasFocus() &&
      !vueApp.ignoredUserIds.has(user.id) &&
      vueApp.mentionSoundFunction &&
      vueApp.mentionSoundFunction(msg)
    ) {
      mention = new Notification(user.name, {
        // ChromeはNotification.iconにSVGを指定できない
        icon: await SVG2PNG(getCharacterPath(user)),
        tag: 'mention',
        body: msg,
        requireInteraction: true
      });
      mention.onclick = function () {
        if (experimentalConfig.replyMsg)
          sendMessage(experimentalConfig.replyMsg);
        // Chromeはクリック時既定の動作がない
        focus();
        document.getElementById('input-textbox').focus();
      };
    }
  };
  addEventListener('focus', function () {
    if (mention)
      mention.close();
  });
  // 入退室通知
  var accessNotification = async function (user, msg) {
    var notifyAccess = experimentalConfig.notifyAccess;
    if (
      (((notifyAccess & 1) && document.hasFocus()) || ((notifyAccess & 2) && !document.hasFocus())) &&
      !vueApp.ignoredUserIds.has(user.id)
    ) {
      (new Notification(user.name, {
        // ChromeはNotification.iconにSVGを指定できない
        icon: await SVG2PNG(getCharacterPath(user)),
        tag: 'access',
        body: msg
      })).onclick = function (event) {
        this.close();
        event.preventDefault();
      };
    }
  };
  // socket event
  var socketEvent = function (eventName) {
    switch (eventName) {
      // 入退室ログ
      case 'server-user-joined-room':
        setTimeout(() => {
          var user = arguments[1];
          if (!user || user.id === vueApp.myUserID)
            return;
          if (experimentalConfig.accessLog)
            vueApp.writeMessageToLog('SYSTEM',  user.name + text('が入室', ' has joined the room'), null);
          accessNotification(user, text('入室', 'join'));
        }, 0);
        break;
      case 'server-user-left-room':
        var user = vueApp.users[arguments[1]];
        if (!user || user.id === vueApp.myUserID)
          return;
        if (experimentalConfig.accessLog)
          vueApp.writeMessageToLog('SYSTEM', user.name + text('が退室', ' has left the room'), null);
        accessNotification(user, text('退室', 'leave'));
        break;
      case 'server-msg':
        // 呼び出し通知
        mentionNotification(vueApp.users[arguments[1]], arguments[2]);
        break;
    }
  };
  var _io = window.io;
  window.io = function () {
    var socket = _io.apply(this, arguments);
    socket.prependAny(socketEvent);
    return socket;
  };
  if (vueApp.socket)
    vueApp.socket.prependAny(socketEvent);
};

var script = document.createElement('script');
script.textContent = '(' + inject + ')()';
document.querySelector('head').appendChild(script);

