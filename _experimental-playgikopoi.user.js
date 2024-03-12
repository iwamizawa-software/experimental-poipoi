// ==UserScript==
// @name     _experimental-playgikopoi
// @version  1
// @grant    none
// @run-at   document-end
// @match    https://play.gikopoi.com/*
// ==/UserScript==

document.querySelector('head').appendChild(document.createElement('script').appendChild(document.createTextNode('(' + async function inject() {

  document.currentScript?.remove();
  var GITHUB_PATH = 'https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/';
  var consolelog = function () {
    var log = Array.from(arguments).map(err => err.stack ? err.message + '\n' + err.stack : err).join('\n');
    console.log(log);
    if (experimentalConfig?.debugWebHook)
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
  var sleep = t => ({then: f => setTimeout(f, t)});
  var objectExists = async function (obj, key) {
    while (!obj[key])
      await sleep(1000);
    return obj[key];
  };
  var elementExists = async function (query) {
    var element;
    while (!(element = document.querySelector(query)))
      await sleep(1000);
    return element;
  };
  // ルーラリンク
  var roomNameToKey = {}, roomNameRegex = /0^/;
  var createRoomNameRegex = function () {
    Object.keys(vueApp._i18n.messages.en.room).forEach(key => {
      var roomName = vueApp._i18n.t('room.' + key, 'ja').split(' ');
      roomNameToKey[roomName = roomName[1] || roomName[0]] = key;
      var halfSize = roomName.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt() - (0xFF01 - 0x21)));
      roomNameToKey[key] = roomNameToKey[halfSize] = roomNameToKey[halfSize.toLowerCase()] = roomNameToKey[roomName.toLowerCase()] = key;
    });
    roomNameToKey['開発前'] = 'admin_st';
    roomNameRegex = new RegExp('(^|じゃ|[ 　「])(' + Object.keys(roomNameToKey).sort((a, b) => b.length - a.length).join('|') + ')(で$|$|に?(?:来|集|きて|こい|行|[居い][るた])|にて|[ 　」])', 'g');
  };
  var replaceRulaLink = html => html.replace(roomNameRegex, (s, s1, s2, s3) => `${s1}<a href="javascript:void%20vueApp.changeRoom('${roomNameToKey[s2]}')">${s2}</a>${s3}`);

  await ready(window, 'vueApp');
  await ready(window.vueApp, '_isMounted');
  createRoomNameRegex();
  elementExists('#login-button').then(loginButton => {
    var select = document.createElement('select');
    Object.keys(vueApp._i18n.messages.en.room).map(key => ({
      value: key,
      text: vueApp._i18n.t('room.' + key, 'ja') + ' - ' + vueApp._i18n.messages.en.room[key],
      reading: vueApp._i18n.t('room.' + key, 'ja', {reading: true})
    })).sort((a, b) => a.reading > b.reading ? 1 : -1).forEach(({value, text}) => {
      var option = select.appendChild(document.createElement('option'));
      option.value = value;
      option.text = text;
    });
    select.value = (new URL(location.href)).searchParams.get('roomid') || 'bar';
    document.getElementById('area-selection').onchange = select.onchange = () => {
      history.replaceState(null, '', '?areaid=' + vueApp.areaId + '&roomid=' + select.value);
    };
    select.style.display = 'block';
    loginButton.before(select);
  });
  console.log('injected');

  Array.from(document.querySelectorAll('#character-selection label')).forEach(label => label.setAttribute('style', 'font-size:0'));

  if (window.iPhoneBookmarklet) {
    var audio = new Audio();
    audio.src = 'data:audio/mpeg;base64,/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    audio.loop = audio.controls = true;
    audio.setAttribute('style', 'position:fixed;bottom:0;right:0');
    document.body.append(audio);
    document.querySelector('head').appendChild(document.createElement('style')).textContent = '#main-section{padding-bottom:20px}';
  }

  if (localStorage.getItem('isInfoboxVisible') === null)
    vueApp.toggleInfobox();

  var text = (_gen, _for) => vueApp.areaId === 'gen' ? _gen : _for;
  var systemMessage = msg => vueApp.writeMessageToLog('SYSTEM', msg, null);
  var sendMessage = function (msg) {
    vueApp.socket.emit('user-msg', msg);
    if (experimentalConfig.clearBubble)
      vueApp.socket.emit('user-msg', '');
  };
  var asyncAlert = text => new Promise(resolve => vueApp.openDialog(text, '', ['OK'], 0, resolve));
  var createButtonContainer = function () {
    var fakePopup = document.createElement('div');
    fakePopup.className = 'popup';
    fakePopup.style.all = 'unset';
    return fakePopup;
  };
  var toIHash = id => '◇' + btoa(id.replace(/-/g, '').replace(/../g, function (s) {return String.fromCharCode('0x' + s)})).slice(0, 6);
  var addIHash = (name, id) => experimentalConfig.numbering === 2 ? name.replace(/(◆.+)?$/, toIHash(id) + '$1') : name;
  var removeSpace = str => str.replace(/[\u{0009}-\u{000D}\u{0020}\u{0085}\u{00A0}\u{00AD}\u{034F}\u{061C}\u{070F}\u{115F}\u{1160}\u{1680}\u{17B4}\u{17B5}\u{180E}\u{2000}-\u{200F}\u{2028}-\u{202F}\u{205F}-\u{206F}\u{2800}\u{3000}\u{3164}\u{FEFF}\u{FFA0}\u{110B1}\u{1BCA0}-\u{1BCA3}\u{1D159}\u{1D173}-\u{1D17A}\u{E0000}-\u{E0FFF}]/gu, '');
  var match = (str, cond) => {
    if (!cond || cond.constructor !== Array || typeof str !== 'string')
      return false;
    var nospace = removeSpace(str || '');
    return cond.some(c => {
      if (!c)
        return false;
      if (/^\/.+\/([dgimsuy]*)$/i.test(c)) {
        var regex = new RegExp(c.slice(1, -(1 + RegExp.$1.length)), RegExp.$1);
        return regex.test(nospace) || regex.test(str);
      } else {
        return nospace.indexOf(c) !== -1 || str.indexOf(c) !== -1;
      }
    });
  };
  // userscript CSS
  document.querySelector('head').appendChild(document.createElement('style')).textContent = '#chat-log-label{display:none}#chat-log-container{flex-direction:column}#enableSpeech:checked+button{background-color:#9f6161}';
  // config
  var userCSS = document.querySelector('head').appendChild(document.createElement('style')), mentionSound, experimentalConfig;
  var vnCSS = document.querySelector('head').appendChild(document.createElement('style'));
  var apply = function () {
    userCSS.textContent = experimentalConfig.userCSS || '';
    vnCSS.textContent = (experimentalConfig.vtuberNiconico & 1 ? '.vtuber-character{display:none}' : '') +
                        (experimentalConfig.vtuberNiconico & 2 ? '.nico-nico-messages-container{display:none}' : '') +
                        (experimentalConfig.hideVoiceButton ? '#voiceButton{display:none}' : '') +
                        (experimentalConfig.brightness ? '#room-canvas{filter: brightness(' + experimentalConfig.brightness + ')}' : '');
    if (experimentalConfig.hasOwnProperty('roomColor') && vueApp.currentRoom) {
      vueApp.currentRoom.backgroundColor = experimentalConfig.roomColor;
      vueApp.isRedrawRequired = true;
    }
    if (mentionSound = experimentalConfig.mentionSound && new Audio(experimentalConfig.mentionSound))
      mentionSound.volume = experimentalConfig.mentionVolume || 1;
    if (experimentalConfig.stopBack)
      history.pushState(null, null);
  };
  window.modifyConfig = function (obj) {
    var json = JSON.stringify(obj);
    if (experimentalConfig.useCookie) {
      document.cookie = 'experimentalConfig=' + encodeURIComponent(json) + '; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
    } else {
      document.cookie = 'experimentalConfig=; expires=Fri, 31-Dec-1999 23:59:59 GMT;';
      localStorage.setItem('experimentalConfig', json);
    }
    experimentalConfig = JSON.parse(json);
    apply();
  };
  var configText = document.cookie.match(/experimentalConfig=([^;]+)/);
  experimentalConfig = Function('return (' + (
    (configText?.[1] ? decodeURIComponent(configText[1]) : localStorage.getItem('experimentalConfig')) ||
    await (await fetch(GITHUB_PATH + 'config.json?t=' + (new Date).getTime())).text()
  ) + ')')();
  ['ttsAllowList', 'ttsDenyList', 'autoBlock', 'autoIgnore', 'wordFilter'].forEach(key => {
    if (experimentalConfig[key] && experimentalConfig[key].constructor !== Array)
      experimentalConfig[key] = experimentalConfig[key].split?.(',') || [experimentalConfig[key] + ''];
  });
  apply();
  // 入室時
  var updateRoomState = vueApp.updateRoomState;
  var lastRoomName, henshined, bubbleChanged;
  vueApp.updateRoomState = async function (dto) {
    // 部屋背景色変更
    if (experimentalConfig.roomColor)
      dto.currentRoom.backgroundColor = experimentalConfig.roomColor;
    // 部屋名をログ出力
    var roomName = vueApp._i18n.t('room.' + dto?.currentRoom?.id);
    var numberOfUsers = (dto.connectedUsers.some(u => u.id === vueApp.myUserID) ? 0 : 1) + dto.connectedUsers.length;
    if (experimentalConfig.logRoomName && lastRoomName !== roomName)
      systemMessage(text(`${roomName}に入室 (${numberOfUsers}人)`, `Entered to  ${roomName} (${numberOfUsers} users)`));
    lastRoomName = roomName;
    // 入室時吹き出しを読み上げない
    var enableTTS = vueApp.enableTextToSpeech;
    vueApp.enableTextToSpeech = false;
    var r = await updateRoomState.call(this, dto);
    vueApp.enableTextToSpeech = enableTTS;
    // 開発前の吹き出しを消す
    if (experimentalConfig.clearBubbleAtLogin === 1 ? dto?.currentRoom?.id === 'admin_st' : experimentalConfig.clearBubbleAtLogin) {
      Object.values(vueApp.users).forEach(u => u.message = '');
      vueApp.resetBubbleImages();
    }
    // デフォルトで受信状態にする
    if (experimentalConfig.takeStreamImmediately)
      for (var i = 0; i < dto.streams.length; i++)
        vueApp.wantToTakeStream(i);
    // ログ窓タイトル変更
    if (logWindow && !logWindow.closed)
      logWindow.onresize();
    // デフォで変身
    if (experimentalConfig.henshin && !henshined) {
      objectExists(vueApp, 'socket').then(socket => socket.emit('user-msg', '#henshin'));
      henshined = true;
    }
    // デフォで吹き出し位置変更
    if (experimentalConfig.bubblePosition && !bubbleChanged) {
      objectExists(vueApp, 'socket').then(socket => socket.emit('user-bubble-position', ['up', 'right',  'left',  'down'][experimentalConfig.bubblePosition]));
      bubbleChanged = true;
    }
    // グラフ
    graph = new Graph(dto);
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
    // 偽SYSTEM
    if (match(userDTO.name, ['' + /[SＳ][YＹ][SＳ][TＴ][EＥ][MＭ]/]))
      userDTO.name += '(偽)';
    // 自動あぼーん
    if (userDTO.id !== vueApp.myUserID && match(userDTO.name, experimentalConfig.autoBlock) && vueApp.socket) {
        vueApp.ignoreUser(userDTO.id);
        vueApp.socket.emit('user-block', userDTO.id);
        if (!experimentalConfig.withoutBlockMsg)
          systemMessage(userDTO.name + text('を自動相互あぼーんした', ' has been blocked automatically'));
    }
    // 自動一方あぼーん
    if (userDTO.id !== vueApp.myUserID && match(userDTO.name, experimentalConfig.autoIgnore))
      vueApp.ignoreUser(userDTO.id);
    // 吹き出しNGワード
    if (match(userDTO.lastRoomMessage, experimentalConfig.bubbleFilter))
      queueMicrotask(() => {if (vueApp.users[userDTO.id]) vueApp.users[userDTO.id].message = '';});
    return addUser.call(this, userDTO);
  };
  // 名前補完
  var autoComplete = {};
  autoComplete.onkeydown = function (event) {
    if (experimentalConfig.autoComplete && event.target.id === 'input-textbox') {
      if (event.key === 'Tab') {
        event.preventDefault();
        if (!autoComplete.candidates) {
          var search = event.target.value.match(/[^ 　@＠>＞]*$/)?.[0] || '', s = search.toLowerCase();
          autoComplete.body = event.target.value.slice(0, event.target.value.length - search.length);
          autoComplete.candidates = Array.from(new Set(Object.values(vueApp.users)
            .filter(u => {
              if (u.id === vueApp.myUserID)
                return false;
              var n = ('' + u.name).normalize('NFKD').replace(/[\u0300-\u036f]+/g, '').normalize().toLowerCase();
              delete u.tripComplete;
              return (n[0] !== '◆' && !n.indexOf(s)) || (u.tripComplete = n.indexOf('◆' + s) !== -1);
            })
            .sort((a, b) => (a.lastCommentTime || 0) < (b.lastCommentTime || 0) ? 1 : -1)
            .map(u => u.tripComplete ? u.name : u.name.split('◆')[0])
          ));
          autoComplete.candidates.push(search);
          autoComplete.index = 0;
        }
        event.target.value = autoComplete.body + autoComplete.candidates[autoComplete.index];
        autoComplete.index = (autoComplete.index + 1) % autoComplete.candidates.length;
      } else {
        delete autoComplete.candidates;
      }
    }
  };
  // ブラウザバックを止める
  addEventListener('popstate', () => {
    if (experimentalConfig.stopBack)
      history.go(1);
  });
  document.addEventListener('keydown', event => {
    if (!event.key)
      return;
    // Ctrl+Delキーで吹き出し消す
    if (event.ctrlKey && event.key === 'Delete') {
      for (var id in vueApp.users)
        vueApp.users[id].message = '';
      vueApp.resetBubbleImages();
    // 動画回転
    } else if (event.altKey && [0, 1, 1, 1][event.key]) {
      var video = document.getElementById('received-video-' + (event.key - 1));
      if (video)
        video.style.transform = 'rotate(' + (video.dataset.rotate = (+(video.dataset.rotate || 0) + 90) % 360) + 'deg)';
    // 経路移動中止
    } else if (event.key === 'Escape' || !event.key.indexOf('Arrow')) {
      vueApp.route.clear();
    }
    // 名前補完
    autoComplete.onkeydown(event);
  });
  // 新しいメッセージボタン
  var chatLog, isAtBottom = () => (chatLog.scrollHeight - chatLog.clientHeight) - chatLog.scrollTop < 5;
  var newMessageButtonContainer = document.createElement('div');
  newMessageButtonContainer.id = 'new-message-button-container';
  newMessageButtonContainer.setAttribute('style', 'height:0;position:relative;top:-80px;text-align:center;width:100%;user-select:none;pointer-events:none');
  var newMessageButton = newMessageButtonContainer.appendChild(createButtonContainer()).appendChild(document.createElement('button'));
  newMessageButton.onclick = () => {
    chatLog.scrollTop = chatLog.scrollHeight - chatLog.clientHeight;
  };
  newMessageButton.style.pointerEvents = 'auto';
  var displayUserMessage = vueApp.displayUserMessage;
  vueApp.displayUserMessage = async function (user, msg) {
    // 配信遠隔停止
    if (vueApp.streamSlotIdInWhichIWantToStream !== null && /^(?:配信停止|stop streaming)$/i.test(msg) && match(vueApp.users[user?.id]?.name, experimentalConfig.streamStopper))
      vueApp.stopStreaming();
    // NGワード
    if (user?.id && match(msg, experimentalConfig.wordFilter)) {
      if (user.id !== vueApp.myUserID && experimentalConfig.wordBlock) {
        if (experimentalConfig.wordBlock === 3)
          vueApp.ignoreUser(user.id);
        else
          (await objectExists(vueApp, 'socket')).emit('user-block', user.id);
        if (!experimentalConfig.withoutBlockMsg)
          systemMessage(user.name + text('をNGワードあぼーんした', ' has been blocked by filtering'));
      }
      if (experimentalConfig.wordBlock !== 2)
        return;
    }
    // 吹き出しNGワード
    if (match(msg, experimentalConfig.bubbleFilter))
      queueMicrotask(() => {if (user) user.message = '';});
    // 読み上げ許可拒否リスト
    if (
      vueApp.enableTextToSpeech && 
      (
        (experimentalConfig.ttsAllowList?.length && !match(user?.name, experimentalConfig.ttsAllowList)) ||
        match(user?.name, experimentalConfig.ttsDenyList)
      )
    ) {
      vueApp.enableTextToSpeech = false;
      var promise = displayUserMessage.apply(this, arguments);
      vueApp.enableTextToSpeech = true;
      return promise;
    }
    return displayUserMessage.apply(this, arguments);
  };
  var writeMessageToLog = vueApp.writeMessageToLog;
  vueApp.writeMessageToLog = async function (userName, msg, userId) {
    // 新しいメッセージボタン
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
    if (experimentalConfig.clearBubble && v === false)
      vueApp.socket.emit('user-msg', '');
    return v;
  };
  // ログ右クリックメニュー
  var logMenu = document.body.appendChild(document.createElement('select'));
  var selectedMessage = {};
  logMenu.setAttribute('style', 'position:fixed;display:none');
  logMenu.onchange = function () {
    switch (logMenu.value) {
      case 'color':
        var colorPicker = document.getElementById('colorPicker');
        var style = (document.getElementById('color-' + selectedMessage.userId) || document.querySelector('head').appendChild(document.createElement('style')));
        style.id = 'color-' + selectedMessage.userId;
        if (logWindow && !logWindow.closed) {
          var logDoc = logWindow.document;
          var style2 = (logDoc.getElementById(style.id) || logDoc.querySelector('head').appendChild(logDoc.createElement('style')));
          style2.id = style.id;
        }
        (colorPicker.onchange = colorPicker.oninput = function () {
          style.textContent = `[data-user-id="${selectedMessage.userId}"],[data-user-id="${selectedMessage.userId}"] .message-author{color:${colorPicker.value}}`;
          if (style2)
            style2.textContent = style.textContent;
        })();
        colorPicker.click();
        break;
      case 'uncolor':
        document.getElementById('color-' + selectedMessage.userId)?.remove();
        if (logWindow && !logWindow.closed)
          logWindow.document.getElementById('color-' + selectedMessage.userId)?.remove();
        break;
      case 'ignore':
        vueApp.ignoreUser(selectedMessage.userId);
        break;
      case 'block':
        vueApp.blockUser(selectedMessage.userId);
        break;
      case 'mention':
        var textbox = document.getElementById('input-textbox');
        if (!textbox)
          break;
        textbox.value += (textbox.value.length && !textbox.value.endsWith(' ') ? ' ' : '') + '@' + selectedMessage.name + ' ';
        textbox.focus();
        break;
      case 'quote':
        var textbox = document.getElementById('input-textbox');
        if (!textbox)
          break;
        var length = textbox.value.length;
        textbox.value += ' > ' + selectedMessage.body;
        textbox.focus();
        textbox.setSelectionRange(length, length);
        break;
    }
    logMenu.style.display = 'none';
  };
  document.addEventListener('click', function (event) {
    if (event.target.parentNode !== logMenu)
      logMenu.style.display = 'none';
    if (experimentalConfig.youtube && event.target.href && /^https:\/\/(?:(?:www\.|m\.)?youtube\.com|youtu\.be)\/./.test(event.target.href))
      event.target.href = 'https://iwamizawa-software.github.io/experimental-poipoi/youtube.html#' + encodeURIComponent(event.target.href);
  });
  document.addEventListener('contextmenu', function (event) {
    logMenu.style.display = 'none';
    if (!event.ctrlKey && event.target.classList.contains('message-author')) {
      selectedMessage = {
        userId: event.target.parentNode.dataset.userId,
        body: event.target.parentNode.querySelector('.message-body')?.textContent || ''
      };
      logMenu.innerHTML = `
<option disabled selected>-
<option value="color">${text('色', 'Color')}
<option value="uncolor">${text('色解除', 'Uncolor')}
<option value="mention">${text('メンション', 'Mention')}
<option value="quote">${text('引用', 'Quote')}
<option value="ignore">${text('一方あぼーん', 'Ignore')}
<option value="block">${text('相互あぼーん', 'Block')}
`;
      logMenu.size = logMenu.options.length;
      logMenu.options[0].text = selectedMessage.name = (event.target.textContent[0] === '◆' ? event.target.previousSibling.textContent : '') + event.target.textContent;
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
        // ルーラリンク
        var messageBody = aChild.querySelector('.message-body>span') || aChild.querySelector('.message-body');
        if (messageBody && !aChild.querySelector('.message-body a') && (messageBodyHTML = replaceRulaLink(messageBody.innerHTML)) !== messageBody.innerHTML)
          messageBody.innerHTML = messageBodyHTML;
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
      buttonContainer.innerHTML += '<br><input type="checkbox" id="enableSpeech" style="display:none"><button id="voiceButton" onclick="this.previousSibling.click()">' + text('音声', 'Voice') + '</button>'
      textbox.before(buttonContainer);
      var enableSpeech = document.getElementById('enableSpeech');
      enableSpeech.onclick = function () {
        recognition.lang = experimentalConfig.voiceLang || vueApp._i18n.locale;
        recognition[enableSpeech.checked ? 'start' : 'stop']();
      };
      var recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = function (event) {
        var result = [];
        for (var i = event.resultIndex; i < event.results.length; i++)
          if (event.results[i].isFinal)
            result.push(event.results[i][0].transcript);
        if (!(result = result.join(' ')))
          return;
        if (experimentalConfig.voiceLog)
          vueApp.writeMessageToLog(text('音声入力', 'Voice input'), result, 'voice input');
        else
          sendMessage(text('音声入力:', 'Voice input:') + result);
      };
      recognition.onend = function () {
        if (enableSpeech.checked)
          recognition.start();
      };
    }
    // ログ窓
    var logButtons = createButtonContainer();
    document.getElementById('chatLog').after(logButtons);
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
    var logWindowButton = logButtons.appendChild(document.createElement('button'));
    logWindowButton.textContent = text('ログ窓', 'Log Window');
    logWindowButton.onclick = function () {
      if (logWindow && !logWindow.closed) {
        logWindow.focus();
        return;
      }
      window.logWindow = logWindow = open('about:blank', 'log' + (new Date()).getTime(), 'width=300,height=500,menubar=no,toolbar=no,location=no');
      if (!logWindow) {
        asyncAlert(text('ポップアップを許可してください', 'Allow to popup'));
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
<script>window.experimental = true;
window.interval = setInterval(function () {
  try {
    if (opener.logWindow !== window)
      throw 1;
  } catch (err) {
    document.title = "${text('切断されたログ', 'Disconnected log')}";
    clearInterval(interval);
  }
}, 10000);</script>
</head>
<body><input type="text" id="input-textbox"></body>
`);
      logWindow.onload = function () {
        var log = logWindow.document.importNode(document.getElementById('chatLog'), true);
        log.style.height = log.style.width = '';
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
        logWindow.document.body.lastElementChild.onkeydown = autoComplete.onkeydown;
      };
      logWindow.onfocus = function () {
        logWindow.document.body.lastElementChild.focus();
      };
      logWindow.onstorage = function () {
        logWindow.document.getElementById('log-style').textContent = experimentalConfig.logWindowCSS;
      };
      logWindow.vueApp = window.vueApp;
      logWindow.document.close();
    };
    addEventListener('unload', () => {
      if (logWindow && !logWindow.closed) {
        logWindow.document.title = text('切断されたログ', 'Disconnected log');
        logWindow.clearInterval(logWindow.interval);
      }
    });
    // ログクリアボタン
    var clearLog = logButtons.appendChild(document.createElement('button'));
    clearLog.textContent = text('クリア', 'Clear');
    clearLog.onclick = vueApp.clearLog;
    // ログ保存ボタン
    var download = logButtons.appendChild(document.createElement('button'));
    download.textContent = text('保存', 'Save');
    var downloadLink = document.createElement('a');
    download.onclick = function () {
      URL.revokeObjectURL(downloadLink.href);
      var log = document.getElementById('chatLog').innerText;
      if (!log)
        return;
      downloadLink.href = URL.createObjectURL(new Blob([log.replace(/([^\r])\n/g, '$1\r\n')], {type: 'application/octet-stream'}));
      var opts = {year: 'numeric'};
      opts.month = opts.day = opts.hour = opts.minute = opts.second = '2-digit';
      downloadLink.download = (new Date()).toLocaleString([], opts).replace(/\D/g, '') + '.txt';
      downloadLink.click();
    };
    // カラーピッカー
    var colorPicker = logButtons.appendChild(document.createElement('input'));
    colorPicker.id = 'colorPicker';
    colorPicker.type = 'color';
    colorPicker.setAttribute('style', 'visibility:hidden;width:0;padding:0;border:0');
    // 設定
    var configButton = logButtons.appendChild(document.createElement('button')), configWindow;
    configButton.textContent = text('設定', 'Config');
    configButton.onclick = function () {
      if (configWindow && !configWindow.closed) {
        try {
          configWindow.location.href;
          configWindow.focus();
          return;
        } catch (err) {}
      }
      configWindow = open('about:blank');
      if (!configWindow) {
        asyncAlert(text('ポップアップを許可してください', 'Allow to popup'));
        return;
      }
      configWindow.document.write(`
<!doctype html>
<head>
<title>${text('スクリプトの設定', 'Experimental Config')}</title>
<script>window.experimental = true; var text = function () {return arguments[${text(0, 1)}]};</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<script>
(async function () {
  eval(await (await fetch('${GITHUB_PATH}experimental-config.js?t=' + (new Date).getTime())).text());
  load(${JSON.stringify(experimentalConfig)});
})();
</script>
</body>
`);
      configWindow.document.close();
    };
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
      window.Notification &&
      experimentalConfig.notifyMention &&
      !document.hasFocus() &&
      user &&
      !vueApp.ignoredUserIds.has(user.id) &&
      vueApp.mentionSoundFunction?.(msg)
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
      mentionSound?.play?.();
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
      window.Notification &&
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
    if (window.Notification && experimentalConfig.notifyStream && !vueApp.showNotifications && !document.hasFocus()) {
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
  // チェス通知
  var chess;
  var chessNotification = function () {
    if (window.Notification) {
      chess = new Notification(text('チェス', 'Chess'), {
        tag: 'chess',
        body: text('あなたの番です', "It's your turn."),
        requireInteraction: true
      });
      chess.onclick = focus.bind(window);
    }
    mentionSound?.play?.();
  };
  var closeChessNotification = function () {
    chess?.close();
  };
  addEventListener('focus', closeChessNotification);
  addEventListener('mousedown', closeChessNotification);
  // PC音声追加
  const DEVICE_ID = '3526701059AE4F9F8B811CA0EF190593';
  navigator.mediaDevices.enumerateDevices = async function () {
    var list = await MediaDevices.prototype.enumerateDevices.call(navigator.mediaDevices);
    return list.concat({
      deviceId: DEVICE_ID,
      label: 'Speaker Sound',
      kind: 'audioinput'
    });
  };
  navigator.mediaDevices.getUserMedia = async function (option) {
    var userMedia, stream;
    if (option?.audio?.deviceId?.exact === DEVICE_ID) {
      try {
        await asyncAlert('Check "Share audio", and share screen. Video is not changed.\nMaybe Firefox and mobile cannot use "Share audio".');
        var stream = await navigator.mediaDevices.getDisplayMedia({
          video: {displaySurface: 'monitor'},
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            channelCount: 2
          }
        });
        stream.getVideoTracks().forEach(track => {
          track.stop();
          stream.removeTrack(track);
        });
        if (!stream.getAudioTracks().length)
          throw new Error('Audio track not found');
        delete option.audio;
      } catch (err) {
        asyncAlert('Audio track not found');
        console.log(err);
        throw err;
      }
    }
    if (option.video || option.audio) {
      userMedia = await MediaDevices.prototype.getUserMedia.apply(navigator.mediaDevices, arguments);
      if (stream)
        userMedia.addTrack(stream.getAudioTracks()[0]);
    } else {
      userMedia = stream;
    }
    return userMedia;
  };
  // グラフ
  var graph, Graph = function ({currentRoom, connectedUsers}) {
    this.nodes = eval('[' + ('[' + '{},'.repeat(currentRoom.size.x) + '],').repeat(currentRoom.size.y) + ']');
    this.room = currentRoom.id;
    currentRoom.blocked.forEach(({x, y}) => this.nodes[y][x] = null);
    var flag = [false];
    for (var y = 0; y < currentRoom.size.y; y++)
      for (var x = 0; x < currentRoom.size.x; x++) {
        var node = this.nodes[y][x], tmp;
        if (!node)
          continue;
        node.edges = new Map();
        if (tmp = this.nodes[y][x - 1])
          node.edges.set(tmp, {direction: 'left', reverse: 'right'});
        else if (tmp === null)
          node.blocked = 'left';
        if (tmp = this.nodes[y][x + 1])
          node.edges.set(tmp, {direction: 'right', reverse: 'left'});
        else if (tmp === null)
          node.blocked = 'right';
        if (tmp = this.nodes[y - 1]?.[x])
          node.edges.set(tmp, {direction: 'down', reverse: 'up'});
        else if (tmp === null)
          node.blocked = 'down';
        if (tmp = this.nodes[y + 1]?.[x])
          node.edges.set(tmp, {direction: 'up', reverse: 'down'});
        else if (tmp === null)
          node.blocked = 'up';
        node.users = new Map();
        node.flag = flag;
      }
    currentRoom.forbiddenMovements.forEach(({xFrom, yFrom, xTo, yTo}) => {
      var from = this.nodes[yFrom]?.[xFrom], to = this.nodes[yTo]?.[xTo];
      if (!from || !to)
        return;
      var edge = from.edges.get(to);
      if (edge?.direction) {
        if (!from.blocked)
          from.blocked = edge.direction;
        if (edge.reverse)
          delete edge.direction;
        else
          from.edges.delete(to);
      }
      var edge = to.edges.get(from);
      if (edge.direction)
        delete edge?.reverse;
      else
        to.edges.delete(from);
    });
    connectedUsers.forEach(({id, position}) => this.nodes[position.y]?.[position.x]?.users.set(id));
    for (var id in currentRoom.doors) {
      var door = currentRoom.doors[id];
      if (this.nodes[door.y]?.[door.x])
        this.nodes[door.y][door.x].door = {id, direction: door.direction};
    }
  };
  Graph.prototype.update = function (userId, xFrom, yFrom, xTo, yTo) {
    this.nodes[yFrom]?.[xFrom]?.users.delete(userId);
    this.nodes[yTo]?.[xTo]?.users.set(userId);
  };
  Graph.prototype.search = function (xFrom, yFrom, xTo, yTo, direction) {
    var target = this.nodes[yTo]?.[xTo];
    if (!target)
      return;
    var from = this.nodes[yFrom]?.[xFrom];
    if (!from || target === from)
      return;
    var queue = [{node: target, path: {length: 0}}], current, door, flag = target.flag = [true];
    while (current = queue.shift()) {
      var iterator = current.node.edges.entries();
      for (var [node, edge] of iterator) {
        if (node.flag[0] || !edge.reverse || (door && node.door && from !== node))
          continue;
        var i = current.path.length, child = {node, path: {length: i}};
        if (i && current.path[i - 1] !== edge.reverse)
          child.path[child.path.length++] = current.path[i - 1];
        child.path[child.path.length++] = edge.reverse;
        child.path.__proto__ = current.path;
        if (from === node) {
          if (direction !== edge.reverse)
            child.path[child.path.length++] = edge.reverse;
          flag[0] = false;
          var path = Array.from(child.path).reverse();
          if (target.blocked && target.blocked !== child.path[0])
            path.push(target.blocked);
          return path;
        }
        node.flag = flag;
        if (node.door) {
          if (node.door.direction !== edge.reverse)
            child.path[child.path.length++] = edge.reverse;
          child.path[child.path.length++] = [this.room, node.door.id];
          door = Array.from(child.path).reverse();
          if (target.blocked && target.blocked !== child.path[0])
            door.push(target.blocked);
          continue;
        }
        queue.push(child);
      }
    }
    flag[0] = false;
    return door || (target.door && [[this.room, target.door.id]]);
  };
  Graph.prototype.escape = function ({x, y, direction}, far) {
    var currentNode = this.nodes[y]?.[x];
    if (!currentNode || currentNode.users.size < 2)
      return;
    var candidate = [], second = [];
    var queue = [{node: currentNode, path: {length: 0}}], current, flag = currentNode.flag = [true];
    while (current = queue.shift()) {
      var iterator = current.node.edges.entries();
      for (var [node, edge] of iterator) {
        if (node.flag[0] || !edge.direction || node.door)
          continue;
        var i = current.path.length, child = {node, path: {length: i}};
        if ((current.path[i - 1] || direction) !== edge.direction)
          child.path[child.path.length++] = edge.direction;
        child.path[child.path.length++] = edge.direction;
        child.path.__proto__ = current.path;
        node.flag = flag;
        queue.push(child);
        (node.users.size || (far && child.path.length < 4) ? second : candidate).push(child.path);
      }
      if (!far)
        break;
    }
    flag[0] = false;
    return Array.from(candidate.length ? candidate[Math.random() * candidate.length | 0] : second[Math.random() * second.length | 0]);
  };
  var physicalToLogical = function (x, y) {
    var room = vueApp.currentRoom, scale = vueApp.getCanvasScale();
    var blockWidth = room.blockWidth || 80, blockHeight = room.blockHeight || 40;
    x = ((x - vueApp.canvasGlobalOffset.x) / scale - room.originCoordinates.x) / blockWidth;
    y = (room.originCoordinates.y - (blockHeight / 2) - (y - vueApp.canvasGlobalOffset.y) / scale) / blockHeight;
    return {x: Math.floor(x - y), y: Math.floor(x + y)};
  };
  document.addEventListener('dblclick', event => {
    if (event.target.id === 'room-canvas' && !experimentalConfig.disableMove) {
      var from = vueApp.users[vueApp.myUserID], to = physicalToLogical(event.offsetX * devicePixelRatio, event.offsetY * devicePixelRatio);
      vueApp.route.add(graph?.search(from.logicalPositionX, from.logicalPositionY, to.x, to.y, from.direction));
    }
  });
  // 経路移動
  vueApp.route = {
    queue: [],
    next: function (prev) {
      if (!this.queue.length || (prev === 'room' ? Array !== this.queue[0].constructor : (prev && prev !== this.queue[0]))) {
        this.clear();
        return;
      }
      this.queue.shift();
      this.move();
    },
    move: async function () {
      if (!this.queue.length)
        return;
      if (typeof this.queue[0] === 'string') {
        vueApp.socket.emit('user-move', this.queue[0]);
      } else {
        vueApp.changeRoom.apply(vueApp, this.queue[0]);
      }
    },
    add: function (q) {
      if (this.queue.length || q?.constructor !== Array)
        return;
      this.queue = q;
      this.move();
    },
    clear: function () {
      this.queue = [];
    }
  };
  // URL短縮
  document.addEventListener('paste', async event => {
    if (event.target.id === 'input-textbox') {
      var url = event.clipboardData.getData('text');
      if (url.length > (event.target.maxLength || 500) - event.target.value.length && /^https?:\/\/[^\/]/.test(url)) {
        event.preventDefault();
        var end, failed = function () {
          if (end)
            return;
          end = true;
          asyncAlert(text('貼り付けようとしたURLが最大文字数をオーバーしています', 'Pasted URL is too long'));
        };
        setTimeout(failed, +experimentalConfig.shortenerTimeout * 1000 || 2000);
        try {
          var shortURL = (await (await fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(url))).json()).shorturl;
          var domain = ('' + url.match(/^https?:\/\/([^\/]+)/)[1]).replace(/www\./, 'www\u200b.');
        } catch (err) {
          console.log(err);
        }
        if (end)
          return;
        if (!shortURL || shortURL.indexOf('https://is.gd/'))
          failed();
        else
          event.target.value += shortURL + ` ( ${domain} )`;
        end = true;
      }
    }
  });
  // nimado
  var nimado = function () {
    if (nimado !== this)
      return nimado.call(nimado);
    var users = Object.values(vueApp.users).filter(u => u.id !== vueApp.myUserID);
    this.stopCount = users.length;
    this.dead = [];
    this.users = [];
    users.forEach(u => setTimeout(()=>vueApp.socket.emit('user-block', u.id), 0));
  };
  nimado.count = function (userCount) {
    if (!this.stopCount)
      return;
    if (this.dead.length > 1)
      this.users.push('(' + this.dead.join(' = ') + ')');
    this.dead = [];
    if (!--this.stopCount)
      systemMessage(text(`二窓ユーザーが${this.users.length}人いました。${this.users}`, `${this.users.length} duplicate users.${this.users}`));
  };
  nimado.left = function (name) {
    if (!this.stopCount)
      return;
    this.dead.push(name);
  };
  var quizWindow, sendMessageToServer = vueApp.sendMessageToServer;
  vueApp.sendMessageToServer = function () {
    var t = document.getElementById('input-textbox');
    if (t) {
      if (t.value === '#nimado') {
        nimado();
        t.value = '';
        return;
      } else if (t.value === '#quiz') {
        quizWindow = open('https://iwamizawa-software.github.io/experimental-poipoi/quiz.html' + text('', '?en'), JSON.stringify(Object.values(vueApp.users).map(({id, name, character}) => ({id, name, characterId: character.characterName}))));
        t.value = '';
        return;
      } else if (!t.value.indexOf('#block ')) {
        vueApp.socket.emit('user-block', t.value.slice(7));
        t.value = '';
        return;
      }
    }
    return sendMessageToServer.apply(this, arguments);
  };
  // チェス棋譜
  var fens = [], pgnButton = document.createElement('button'), pgnWindow;
  pgnButton.onclick = function () {
    try {
      if (!pgnWindow || pgnWindow.closed)
        throw 1;
      pgnWindow.location.href;
      pgnWindow.focus();
    } catch (err) {
      pgnWindow = open('about:blank');
    }
    if (!pgnWindow) {
      asyncAlert(text('ポップアップを許可してください', 'Allow to popup'));
      return;
    }
    pgnWindow.document.open();
    pgnWindow.document.write(`<!doctype html>
<title>${pgnButton.textContent}</title>
<script src="https://iwamizawa-software.github.io/fen-to-pgn/fen-to-pgn.js"></script>
<body>
<script>document.body.appendChild(document.createElement('pre')).textContent = fenToPgn(${JSON.stringify(fens)});</script>
<p><a href="https://www.chesscompass.com/analyze" target="_blank">${text('分析', 'Analyze')}</a></body>
`);
    pgnWindow.document.close();
  };
  var getChessMovement = function () {
    if (fens.length < 2)
      return;
    try {
      var before = fens[fens.length - 2].split(' ')[0].replace(/[1-8]/g, n => ' '.repeat(n)).replace(/\//g, '');
      var after = fens[fens.length - 1].split(' ')[0].replace(/[1-8]/g, n => ' '.repeat(n)).replace(/\//g, '');
      for (var i = 0; i < after.length; i++)
        if (after[i] !== ' ' && before[i] !== after[i])
          return 'abcdefgh'[i % 8] + (8 - Math.floor(i / 8));
    } catch (err) {
      console.log(err);
    }
  };
  var chessSquare;
  var updateFEN = function () {
    if (chessSquare)
      chessSquare.style.backgroundColor = '';
    var address = getChessMovement();
    if (address && (chessSquare = document.querySelector('[data-square=' + address + ']')))
      chessSquare.style.backgroundColor = '#faa';
    if (document.contains(pgnButton))
      return;
    document.querySelector('.chessboard-slot-wrapper :last-child')?.before(pgnButton);
    pgnButton.textContent = text('棋譜', 'Notation');
  };
  // クリックで吹き出しを削除
  var bubbleUsers = [], selectedBubbleUser;
  var drawBubbles = vueApp.drawBubbles;
  vueApp.drawBubbles = function () {
    bubbleUsers.length = 0;
    var value = drawBubbles.apply(this, arguments), area;
    if (area = selectedBubbleUser?.bubbleArea) {
      vueApp.canvasContext.beginPath();
      vueApp.canvasContext.rect(area.x0, area.y0, area.width, area.height);
      vueApp.canvasContext.strokeStyle = 'red';
      vueApp.canvasContext.lineWidth = 1;
      vueApp.canvasContext.stroke();
    }
    return value;
  };
  var getBubbleImage = vueApp.getBubbleImage;
  vueApp.getBubbleImage = function (user) {
    var bubbleImage = getBubbleImage.apply(this, arguments);
    if (!bubbleImage)
      return;
    var getImage = bubbleImage.getImage;
    bubbleImage.getImage = function () {
      var image = getImage.apply(this, arguments);
      if (!vueApp.canvasContext)
        return image;
      var area = user.bubbleArea = user.bubbleArea || {};
      area.x0 = user.currentPhysicalPositionX + vueApp.blockWidth/2 + (user.bubblePosition === 'up' || user.bubblePosition === 'right' ? 21 : -21 - user.bubbleImage.width);
      area.y0 = user.currentPhysicalPositionY - (user.bubblePosition === 'down' || user.bubblePosition === 'right'  ? 62 : 70 + user.bubbleImage.height);
      area.x0 = Math.round(vueApp.getCanvasScale() * (area.x0 || 0) + vueApp.canvasGlobalOffset.x);
      area.y0 = Math.round(vueApp.getCanvasScale() * (area.y0 || 0) + vueApp.canvasGlobalOffset.y);
      area.x1 = area.x0 + image.width;
      area.y1 = area.y0 + image.height;
      area.width = image.width;
      area.height = image.height;
      bubbleUsers.unshift(user);
      return image;
    };
    return bubbleImage;
  };
  var currentX, currentY;
  var bubbleAreaCondition = ({bubbleArea}) => bubbleArea.x0 <= currentX && currentX <= bubbleArea.x1 && bubbleArea.y0 <= currentY && currentY <= bubbleArea.y1;
  var selectBubbleEvent = event => {
    var lastSelected = selectedBubbleUser, x, y;
    if (event?.target?.id === 'room-canvas') {
      currentX = event.offsetX * devicePixelRatio;
      currentY = event.offsetY * devicePixelRatio;
      selectedBubbleUser = bubbleUsers.find(bubbleAreaCondition);
    } else {
      selectedBubbleUser = null;
    }
    if (lastSelected !== selectedBubbleUser)
      vueApp.isRedrawRequired = true;
  };
  addEventListener('mousedown', selectBubbleEvent);
  var lastMouseMoveEvent = {};
  addEventListener('mousemove', event => {
    if (lastMouseMoveEvent.x !== event.x || lastMouseMoveEvent.y !== event.y)
      selectBubbleEvent(event.buttons ? null : event);
    lastMouseMoveEvent = event;
  });
  addEventListener('click', event => {
    if (event.target.id === 'room-canvas' && selectedBubbleUser) {
      selectedBubbleUser.message = '';
      selectedBubbleUser = null;
      vueApp.isRedrawRequired = true;
    }
  });
  // socket event
  var streamStates = [];
  var moved = false;
  var socketEvent = function (eventName) {
    switch (eventName) {
      case 'server-move':
        var dto = arguments[1], user = vueApp.users[dto.userId];
        // グラフ
        if (dto && user)
          graph?.update(dto.userId, user.logicalPositionX, user.logicalPositionY, dto.x, dto.y);
        // 経路移動
        if (dto?.direction && dto?.userId === vueApp.myUserID) {
          vueApp.route.next(dto.direction);
          moved = true;
        }
        // 重なり回避
        if (experimentalConfig.escape && moved) {
          var myself = vueApp.users[vueApp.myUserID];
          vueApp.route.add(graph.escape(dto?.userId === vueApp.myUserID ? dto : {x: myself?.logicalPositionX, y: myself?.logicalPositionY, direction: myself?.direction}, experimentalConfig.escape === 2));
        }
        break;
      case 'server-reject-movement':
        vueApp.route.next();
        break;
      case 'server-user-joined-room':
        var user = arguments[1];
        // グラフ
        if (user)
          graph?.update(user.id, null, null, user.position.x, user.position.y);
        // 重なり回避
        if (experimentalConfig.escape && moved) {
          var myself = vueApp.users[vueApp.myUserID];
          vueApp.route.add(graph.escape(user.id === vueApp.myUserID
            ? {x: user.position.x, y: user.position.y, direction: user.direction}
            : {x: myself?.logicalPositionX, y: myself?.logicalPositionY, direction: myself?.direction}
          , experimentalConfig.escape === 2));
        }
        // 入室ログ
        setTimeout(() => {
          if (!user || user.id === vueApp.myUserID)
            return;
          if (!experimentalConfig.withoutAnon || user.name?.indexOf(vueApp.toDisplayName(''))) {
            if (experimentalConfig.accessLog)
              systemMessage(addIHash(user.name, user.id) + text('が入室', ' has joined the room') + (experimentalConfig.accessLog === 2 ? ' (ID:' + user.id +')' : ''));
            accessNotification(user, text('入室', 'join'));
          }
        }, 0);
        break;
      case 'server-user-left-room':
        var user = vueApp.users[arguments[1]];
        // グラフ
        if (user)
          graph?.update(arguments[1], user.logicalPositionX, user.logicalPositionY, null, null);
        // 退室ログ
        if (!user || user.id === vueApp.myUserID)
          return;
        if (!experimentalConfig.withoutAnon || user.name?.indexOf(vueApp.toDisplayName(''))) {
          if (experimentalConfig.accessLog)
            systemMessage(addIHash(user.name, user.id) + text('が退室', ' has left the room') + (experimentalConfig.accessLog === 2 ? ' (ID:' + user.id +')' : ''));
          accessNotification(user, text('退室', 'leave'));
        }
        // 配信通知
        var stream = vueApp.streams.find(s => s.userId === user.id);
        if (stream)
          stream.isActive = false;
        // nimado
        nimado.left(user.name);
        break;
      case 'server-msg':
        var user = vueApp.users[arguments[1]];
        if (!user)
          return;
        // 最終発言時間
        user.lastCommentTime = (new Date()).getTime();
        // 呼び出し通知
        mentionNotification(user, arguments[2]);
        break;
      case 'server-update-current-room-state':
        // 配信通知
        streamStates = arguments[1].streams.map(s => s.isActive && s.isReady && s.isAllowed && s.userId !== vueApp.myUserID);
        // 経路移動
        vueApp.route.next('room');
        moved = false;
        // チェス棋譜
        fens = [];
        break;
      case 'server-update-current-room-streams':
        // 配信通知
        var currentStates = arguments[1].map(s => s.isActive && s.isReady && s.isAllowed && s.userId !== vueApp.myUserID);
        var index = currentStates.findIndex((s, i) => s && !streamStates[i] && !vueApp.takenStreams[i]);
        streamStates = currentStates;
        if (index !== -1)
          streamNotification(vueApp.users[arguments[1][index].userId], index);
        break;
      // 全部屋ﾙｰﾗ
      case 'server-room-list':
        var streams = 0;
        arguments[1].forEach(room => streams += room.streams.length);
        arguments[1].push(
          {id: 'admin_old', group: 'gikopoi', userCount: '?', streamers: [], streams: +vueApp.serverStats.streamCount <= streams ? [] : [{userName: '?'}]},
          {id: 'badend', group: 'gikopoipoi', userCount: '?', streamers: [], streams: []}
        );
        break;
      case 'server-update-chessboard':
        var state = arguments[1] || {};
        // チェス通知
        if (state[{w: 'whiteUserID', b: 'blackUserID'}[state.turn]] === vueApp.myUserID)
          chessNotification();
        // チェス棋譜
        if (arguments[1].fenString) {
          if (arguments[1].fenString === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
            fens = [arguments[1].fenString];
          else if (fens[fens.length - 1] !== arguments[1].fenString)
            fens.push(arguments[1].fenString);
          updateFEN();
        }
        break;
      // nimado
      case 'server-stats':
        nimado.count();
        break;
    }
    if (quizWindow && !quizWindow.closed)
      queueMicrotask(() => quizWindow.postMessage(Array.from(arguments), 'https://iwamizawa-software.github.io'));
  };
  var _io = window.io;
  if (_io) {
    window.io = function () {
      var socket = _io.apply(this, arguments);
      socket.prependAny(socketEvent);
      return socket;
    };
    if (vueApp.socket)
      vueApp.socket.prependAny(socketEvent);
  } else {
    (await objectExists(vueApp, 'socket')).prependAny(socketEvent);
  }

} + ')()')).parentNode);

