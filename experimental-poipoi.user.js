// ==UserScript==
// @name     experimental-poipoi
// @version  9
// @grant    none
// @run-at   document-end
// @match    https://gikopoipoi.net/
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
  // デフォルトで受信状態にする
  var updateRoomState = vueApp.updateRoomState;
  vueApp.updateRoomState = async function (dto) {
    var r = await updateRoomState.call(this, dto);
    if (experimentalConfig.takeStreamImmediately)
      for (var i = 0; i < dto.streams.length; i++)
        vueApp.wantToTakeStream(i);
    return r;
  };
  // ユーザー追加時
  var addUser = vueApp.addUser;
  vueApp.addUser = function (userDTO) {
    // 名無しナンバリング
    if (experimentalConfig.numbering && typeof userDTO.id === 'string') {
      userDTO.name = vueApp.toDisplayName(userDTO.name);
      if (userDTO.name === vueApp.toDisplayName(''))
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
  // 音声入力
  var connectToServer = vueApp.connectToServer;
  vueApp.connectToServer = async function () {
    var r = await connectToServer.apply(this, arguments);
    try {
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
          vueApp.socket.emit('user-msg', text('音声入力:', 'Voice input:') + result.join(' '));
          vueApp.socket.emit('user-msg', '');
        };
        recognition.onend = function () {
          if (enableSpeech.checked)
            recognition.start();
        };
      }
    } catch (err) {
      console.log(err);
    }
    return r;
  };
  // 呼び出し通知
  var getCharacterPath = user => {
    var name = user.characterId || (user.character && user.character.characterName);
    return 'characters/' + name + '/front-standing.' + (vueApp.allCharacters.find(c=>c.characterName===name) || {format:'svg'}).format;
  }
  var pngCache = {};
  var SVG2PNG = async function (url) {
    var callback;
    if (url.slice(-3) === 'png')
      return {then:c=>c(url)};
    if (pngCache[url])
      return {then:c=>c(pngCache[url])};
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
      return {then:c=>c(url)};
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
        if (experimentalConfig.replyMsg) {
          vueApp.socket.emit('user-msg', experimentalConfig.replyMsg);
          vueApp.socket.emit('user-msg', '');
        }
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

