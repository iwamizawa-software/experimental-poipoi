// ==UserScript==
// @name     _experimental-poipoi
// @version  24
// @grant    none
// @run-at   document-end
// @match    https://gikopoipoi.net/*
// ==/UserScript==

document.querySelector('head').appendChild(document.createElement('script').appendChild(document.createTextNode('(' + async function inject() {

  if (document.currentScript)
    document.currentScript.remove();
  var consolelog = function () {
    var log = Array.from(arguments).map(err => err.stack ? err.message + '\n' + err.stack : err).join('\n');
    console.log(log);
    if (experimentalConfig.debugWebHook)
      fetch(experimentalConfig.debugWebHook, { method : 'POST', headers : {'Content-Type' : 'application/json'}, body : JSON.stringify({content : log})});
  };
  window.onunhandledrejection = event => { consolelog(event.reason);};
  Object.defineProperty(console, 'error', {
    set: function () {},
    get: () => consolelog
  });
  var ready = async function (obj, key) {
    if (obj[key])
      return obj[key];
    var value, callback;
    Object.defineProperty(obj, key, {
      set: v => {
        if (value = v) {
          console.log(key + ' is ready');
          callback(value);
        }
      },
      get: () => value
    });
    return {then: c=>{callback = c}};
  };

  await ready(window, 'vueApp');
  await ready(vueApp, '_isMounted');
  console.log('injected');

  var text = (_gen, _for) => vueApp.areaId === 'gen' ? _gen : _for;
  var systemMessage = msg => vueApp.writeMessageToLog('SYSTEM', msg, null);
  var sendMessage = function (msg) {
    vueApp.socket.emit('user-msg', msg);
    vueApp.socket.emit('user-msg', '');
  };
  var createButtonContainer = function () {
    var fakePopup = document.createElement('div');
    fakePopup.className = 'popup';
    fakePopup.style.all = 'unset';
    return fakePopup;
  };
  var toIHash = id => '◇' + btoa(id.replace(/-/g, '').replace(/../g, function (s) {return String.fromCharCode('0x' + s)})).slice(0, 6);
  var addIHash = (name, id) => experimentalConfig.numbering === 2 ? name.replace(/(◆.+)?$/, toIHash(id) + '$1') : name;
  
  // config
  var configButtonContainer = createButtonContainer();
  configButtonContainer.style.all = '';
  configButtonContainer.setAttribute('style', 'all:unset;position:fixed;right:30px;top:0');
  var saveButton = configButtonContainer.appendChild(document.createElement('button'));
  saveButton.textContent = 'save';
  saveButton.style.display = 'none';
  saveButton.onclick = function () {
    try {
      experimentalConfig = Function('return (' + configEditor.value + ')')();
      localStorage.setItem('experimentalConfig', configText = configEditor.value);
      setUserCSS();
      configButton.click();
      if (experimentalConfig.hasOwnProperty('roomColor') && vueApp.currentRoom) {
        vueApp.currentRoom.backgroundColor = experimentalConfig.roomColor;
        vueApp.isRedrawRequired = true;
      }
    } catch (err) {
      alert(text('設定の書式が間違っていて保存できない', 'Faild to save by wrong format'));
    }
  };
  var configButton = configButtonContainer.appendChild(document.createElement('button'));
  configButton.textContent = 'config';
  var configEditor = document.body.appendChild(document.createElement('textarea'));
  configEditor.setAttribute('style', 'position:fixed;right:30px;top:34px;display:none;width:50vw;height:50vh;resize:vertical');
  var editing;
  configButton.onclick = function () {
    if (editing) {
      if (configEditor.value === configText) {
        configButton.textContent = 'config';
        saveButton.style.display = configEditor.style.display = 'none';
        editing = false;
      } else if (confirm(text('変更を破棄しますか？', 'Discard changes?'))) {
        configEditor.value = configText;
        configButton.click();
      }
    } else {
      editing = true;
      configButton.textContent = 'cancel';
      saveButton.style.display = configEditor.style.display = 'inline';
    }
  };
  document.body.append(configButtonContainer);
  document.body.append(configEditor);
  var configText = localStorage.getItem('experimentalConfig') || await (await fetch('https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/config.js?t=' + (new Date).getTime())).text();
  configEditor.value = configText;
  var experimentalConfig = Function('return (' + configEditor.value + ')')();
  // userCSS
  var userCSS = document.querySelector('head').appendChild(document.createElement('style'));
  var setUserCSS = function () {
    if (experimentalConfig.userCSS)
      userCSS.textContent = experimentalConfig.userCSS;
  };
  setUserCSS();
  // 入室時
  var updateRoomState = vueApp.updateRoomState;
  vueApp.updateRoomState = async function (dto) {
    // 部屋背景色変更
    if (experimentalConfig.roomColor)
      dto.currentRoom.backgroundColor = experimentalConfig.roomColor;
    var r = await updateRoomState.call(this, dto);
    // デフォルトで受信状態にする
    if (experimentalConfig.takeStreamImmediately)
      for (var i = 0; i < dto.streams.length; i++)
        vueApp.wantToTakeStream(i);
    // アドレスバーを現在の部屋のURLに書き換え
    history.replaceState(null, '', '/?areaid=' + vueApp.areaId + '&roomid=' + dto.currentRoom.id);
    // ログ窓タイトル変更
    if (logWindow && !logWindow.closed)
      logWindow.onresize();
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
  newMessageButtonContainer.setAttribute('style', 'position:relative;top:-40px;text-align:center;width:100%;user-select:none;pointer-events:none');
  var newMessageButton = newMessageButtonContainer.appendChild(createButtonContainer()).appendChild(document.createElement('button'));
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
          u.name = addIHash(u.name, u.id);
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
          aChild.querySelector('.message-author').innerHTML += toIHash(aChild.dataset.userId);
        // ログ窓に書き出し
        if (writeLogToWindow)
          writeLogToWindow(aChild);
      } catch (err) {
        console.log(err);
      }
    }
    return Node.prototype.appendChild.call(this, aChild);
  };
  // ログイン時
  var logWindow;
  var onlogin = function () {
    // 音声入力
    var textbox = document.getElementById('input-textbox');
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      var buttonContainer = createButtonContainer();
      buttonContainer.appendChild(textbox.previousSibling);
      buttonContainer.innerHTML += '<br><input type="checkbox" id="enableSpeech" style="display:none"><button onclick="this.previousSibling.click()">' + text('音声', 'Voice') + '</button>'
      textbox.before(buttonContainer);
      document.querySelector('head').appendChild(document.createElement('style')).textContent = '#enableSpeech:checked+button{background-color:#9f6161}';
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
    writeLogToWindow = function (div) {
      if (!logWindow || logWindow.closed)
        return;
      var log = logWindow.document.body.firstElementChild;
      var bottom = (log.scrollHeight - log.clientHeight) - log.scrollTop < 5;
      log.append(logWindow.document.importNode(div, true));
      if (bottom)
        log.scrollTop = log.scrollHeight - log.clientHeight;
      else
        logWindow.document.title = text('↓ 新しいメッセージ', '↓ New Messages');
    };
    var logWindowButton = document.createElement('button');
    logWindowButton.textContent = text('ログ窓', 'Log Window');
    logWindowButton.onclick = function () {
      if (logWindow && !logWindow.closed) {
        logWindow.focus();
        return;
      }
      window.logWindow = logWindow = open('about:blank', 'log' + (new Date()).getTime(), 'width=300,height=500,menubar=no,toolbar=no,location=no');
      if (!logWindow) {
        vueApp.showWarningToast(text('ポップアップを許可してください', 'Allow to popup'));
        return;
      }
      logWindow.document.write(`
<!doctype html>
<head>
<title>${vueApp._i18n.t('room.' + vueApp.currentRoom.id)}</title>
<style>
html,body,#chatLog,input{margin:0;padding:0;box-sizing:border-box;width:100%;height:100%;resize:none;overflow:auto}
#chatLog{height:calc(100% - 3em);padding:2px;font-size:12px}
.message-timestamp,.ignored-message{display:none}
input{display:block;position:fixed;bottom:0;height:2em}
</style>
<style id="log-style">${experimentalConfig.logWindowCSS}</style>
<script>window.interval = setInterval(function () {
  try {
    if (opener.logWindow !== window)
      throw 1;
  } catch (err) {
    document.title = "${text('切断されたログ', 'Disconnected log')}";
    clearInterval(interval);
  }
}, 10000);</script>
</head>
<body><input type="text"></body>
`);
      logWindow.onload = function () {
        var log = logWindow.document.importNode(document.getElementById('chatLog'), true);
        logWindow.document.body.firstElementChild.before(log);
        log.scrollTop = log.scrollHeight - log.clientHeight;
        logWindow.onresize = log.onscroll = function () {
          if ((log.scrollHeight - log.clientHeight) - log.scrollTop < 5)
            logWindow.document.title = vueApp._i18n.t('room.' + vueApp.currentRoom.id);
        };
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
      logWindow.onstorage = function () {
        logWindow.document.getElementById('log-style').textContent = experimentalConfig.logWindowCSS;
      };
      logWindow.document.close();
    };
    document.getElementById('chatLog').before(createButtonContainer().appendChild(logWindowButton).parentNode);
    addEventListener('unload', () => {
      if (logWindow && !logWindow.closed) {
        logWindow.document.title = text('切断されたログ', 'Disconnected log');
        logWindow.clearInterval(logWindow.interval);
      }
    });
  };
  if (document.getElementById('input-textbox')) {
    onlogin();
  } else {
    var connectToServer = vueApp.connectToServer;
    vueApp.connectToServer = async function () {
      // 内藤髪制御
      if (localStorage.getItem('characterId') === 'naito' && experimentalConfig.hairControl) {
        vueApp.characterId = experimentalConfig.hairControl === 1 ? 'naito' : 'funkynaito';
        vueApp.selectedCharacter = vueApp.allCharacters.find(c => c.characterName === vueApp.characterId);
      }
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
  // 配信通知
  var streamNotification = async function (user, index) {
    if (experimentalConfig.notifyStream && !document.hasFocus()) {
      (new Notification(user.name, {
        // ChromeはNotification.iconにSVGを指定できない
        icon: await SVG2PNG(getCharacterPath(user)),
        tag: 'stream',
        body: text('ﾁｬﾝﾈﾙ' + (index + 1) + 'で配信開始', 'Start stream in Channel ' + (index + 1))
      })).onclick = function (event) {
        vueApp.wantToTakeStream(index);
        this.close();
        event.preventDefault();
      };
    }
  };
  var streamStates = [];
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
            vueApp.writeMessageToLog('SYSTEM', addIHash(user.name, user.id) + text('が入室', ' has joined the room'), null);
          accessNotification(user, text('入室', 'join'));
        }, 0);
        break;
      case 'server-user-left-room':
        var user = vueApp.users[arguments[1]];
        if (!user || user.id === vueApp.myUserID)
          return;
        if (experimentalConfig.accessLog)
          vueApp.writeMessageToLog('SYSTEM', addIHash(user.name, user.id) + text('が退室', ' has left the room'), null);
        accessNotification(user, text('退室', 'leave'));
        break;
      case 'server-msg':
        // 呼び出し通知
        mentionNotification(vueApp.users[arguments[1]], arguments[2]);
        break;
      // 配信通知
      case 'server-update-current-room-state':
        streamStates = arguments[1].streams.map(s => s.isActive && s.isReady && s.isAllowed && s.userId !== vueApp.myUserID);
        break;
      case 'server-update-current-room-streams':
        var currentStates = arguments[1].map(s => s.isActive && s.isReady && s.isAllowed && s.userId !== vueApp.myUserID);
        var index = currentStates.findIndex((s, i) => s && !streamStates[i] && !vueApp.takenStreams[i]);
        streamStates = currentStates;
        if (index !== -1)
          streamNotification(vueApp.users[arguments[1][index].userId], index);
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

} + ')()')).parentNode);

