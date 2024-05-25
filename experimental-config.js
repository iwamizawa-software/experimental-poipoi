(function () {
  window.text = window.text || String;
  var config = [
    {
      name: text('実験的機能', 'Experimental Config'),
      type: 'separator'
    },
    {
      key: 'numbering',
      name: text('名前に識別子を付ける', 'Add identifier to name'),
      description: text('番号や白トリップはログインするたびに変わるランダムな値のため個人の特定には利用できません。', 'The number and white trip are random values.'),
      type: [
        'OFF',
        text('名無しに番号を振る', 'Assign a number to anon'),
        text('全員に疑似白トリップを付ける', 'Add white trip')
      ],
      value: 1
    },
    {
      key: 'escape',
      name: text('キャラが重なったときに逃げる', 'Escape from overlapping'),
      type: [
        'OFF',
        text('１歩逃げる', 'Escape to a step'),
        text('遠くに逃げる', 'Escape to far away')
      ],
      value: 0
    },
    {
      key: 'shortenerTimeout',
      name: text('長いURLを貼った時にURL短縮処理を待つ秒数', 'Waiting time for shortening URL (seconds)'),
      type: 'input',
      value: '2'
    },
    {
      key: 'autoComplete',
      name: text('Tabキーでメンションの名前を補完', 'Name autocomplete by Tab key'),
      description: text('IME変換中は機能しません。複数候補がいる場合はTabキーを押すたびに切り替わります。', 'When there are two or more candidates, the name is toggled each to press Tab key.'),
      type: 'onoff',
      value: 0
    },
    {
      name: text('見た目', 'Display'),
      type: 'separator'
    },
    {
      key: 'hideVoiceButton',
      name: text('音声入力ボタンを消す', 'Hide voiceinput button'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'vtuberNiconico',
      name: text('VTuberモードとニコ動モード', 'VTuber and Niconico mode'),
      type: [
        text('有効', 'Enable'),
        text('VTuberモードを無効化', 'Disable VTuber'),
        text('ニコ動モードを無効化', 'Disable Niconico'),
        text('両方無効', 'Disable all')
      ],
      value: 0
    },
    {
      key: 'outdoor',
      name: text('タイトルとキャラ選択とマップを消す', 'Hide gikopoipoi parts'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'displayIcon',
      name: text('ログにキャラを表示', 'Display character in log'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'iconSize',
      name: text('ログのキャラサイズ', 'Character size in log'),
      type: 'input',
      value: 25
    },
    {
      key: 'autoColor',
      name: text('自動でログを色分けする', 'Auto colored log'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'autoColorList',
      name: text('自動ログ色リスト', 'Palette of auto colored log'),
      description: text('自動色分けで使う色をカラーコードで指定します。', 'Set hex colors for auto colored log.'),
      type: 'color',
      value: ['#ff8000', '#008000', '#0080ff', '#8060ff', '#ff60ff']
    },
    {
      name: text('名前指定系', 'Name list'),
      type: 'separator',
      description: text('両端を半角スラッシュ(/)にすると正規表現として扱われます。', 'You can set /test/ as RegExp.')
    },
    {
      key: 'ttsAllowList',
      name: text('読み上げ許可リスト', 'TTS allow list'),
      description: text('このリストが空のときは全員読み上げます。指定がある場合は許可している人以外は読み上げません。', 'If the list is empty, everyone is allowed.'),
      type: 'list',
      value: []
    },
    {
      key: 'ttsDenyList',
      name: text('読み上げ拒否リスト', 'TTS deny list'),
      type: 'list',
      value: []
    },
    {
      key: 'streamStopper',
      name: text('配信停止権限付与', 'Streaming stopper list'),
      description: text('ここに追加された名前の人が配信停止と発言すると自分の配信を止めることができます。', 'Listed persons can stop my streaming to say "stop streaming".'),
      type: 'list',
      value: []
    },
    {
      name: text('自動あぼーん系', 'Auto Block'),
      type: 'separator',
      description: text('両端を半角スラッシュ(/)にすると正規表現として扱われます。', 'You can set /test/ as RegExp.')
    },
    {
      key: 'filteringHelper',
      name: text('フィルタリング補助', 'Filtering Helper'),
      description: text('指定した文字を消してから自動あぼーんやNGワード判定します。例：「./ー」と指定するとア.ホ、ア/ホ、アーホが全てアホと見なされる', 'Remove set characters from tested message. (When set "/_", f/*/*/k or f_*_*_k is same as f**k.)'),
      type: 'input',
      value: ''
    },
    {
      key: 'autoBlock',
      name: text('自動相互一方あぼーん', 'Auto block'),
      description: text('名前を部分一致で指定します。例：無だけ指定すると名無しさんと無職くんをあぼーん', 'Partial Match'),
      type: 'list',
      value: []
    },
    {
      key: 'autoIgnore',
      name: text('自動一方あぼーん', 'Auto ignore'),
      type: 'list',
      value: []
    },
    {
      key: 'wordFilter',
      name: text('NGワード', 'Word filter'),
      description: text('意図しないフィルタリングで意志疎通に問題が発生する可能性があります。', 'Unintended filtering may cause communication problems.'),
      type: 'list',
      value: []
    },
    {
      key: 'wordBlock',
      name: text('NGワードを発言したら', 'Word filter penalty'),
      type: [
        text('その発言を非表示', 'Invisible message'),
        text('相互あぼーん', 'Block'),
        text('NGワードが見える相互あぼーん', 'Block and visible message'),
        text('一方あぼーん', 'Ignore')
      ],
      value: 0
    },
    {
      key: 'withoutBlockMsg',
      name: text('SYSTEMのあぼーんメッセージを非表示', 'Invisible block message'),
      type: 'onoff',
      value: 0
    },
    {
      name: text('吹き出し', 'Bubble'),
      type: 'separator'
    },
    {
      key: 'clearBubble',
      name: text('自分の吹き出しを常に消す', 'Always clear my bubble'),
      type: 'onoff',
      value: 1
    },
    {
      key: 'bubblePosition',
      name: text('デフォの吹き出し位置', 'Bubble position'),
      type: [
        text('右上', 'Right-top'),
        text('右下', 'Right-bottom'),
        text('左上', 'Left-top'),
        text('左下', 'Left-bottom')
      ],
      value: 0
    },
    {
      key: 'clearBubbleAtLogin',
      name: text('入室時吹き出しを消す', 'Clear bubbles at entering room'),
      type: [
        'OFF',
        text('開発前だけ消す', 'Clear bubbles on Kanrinin street only'),
        'ON'
      ],
      value: 0
    },
    {
      key: 'bubbleFilter',
      name: text('吹き出しNGワード', 'Bubble Filter'),
      description: text('両端を半角スラッシュ(/)にすると正規表現として扱われます。', 'You can set /test/ as RegExp.'),
      type: 'list',
      value: []
    },
    {
      name: text('通知とログ', 'Notifications And Log'),
      type: 'separator'
    },
    {
      key: 'notifyStream',
      name: text('配信通知', 'Stream notification'),
      type: 'onoff',
      value: 1
    },
    {
      key: 'notifyMention',
      name: text('メンション通知', 'Mention notification'),
      type: 'onoff',
      value: 1
    },
    {
      key: 'replyMsg',
      name: text('メンション通知をクリックした時返答する言葉', 'Message at clicking mention notification'),
      type: 'input',
      value: ''
    },
    {
      key: 'mentionSound',
      name: text('メンションが来たときに再生する音声ファイルのURL', 'Mention Sound URL'),
      description: text('本家でも音を鳴らす設定にしている場合は２つ同時に鳴ります。', 'If you enable mention sound on poipoi and this script, two sounds are played.'),
      type: 'input',
      value: ''
    },
    {
      key: 'mentionVolume',
      name: text('メンションが来たときに再生する音の大きさ', 'Mention Sound Volume'),
      description: text('0～1の実数で指定', 'between 0 and 1'),
      type: 'input',
      value: ''
    },
    {
      key: 'notifyAccess',
      name: text('入退室通知', 'Enter and leave notifications'),
      type: [
        'OFF',
        text('アクティブ時のみ', 'Active'),
        text('非アクティブ時のみ', 'Inactive'),
        text('常に通知', 'Always')
      ],
      value: 0
    },
    {
      key: 'accessLog',
      name: text('入退室ログ', 'Log enter and leave'),
      type: [
        'OFF',
        'ON',
        text('IDも出力', 'Output with ID')
      ],
      value: 0
    },
    {
      key: 'withoutAnon',
      name: text('入退室通知とログで名無しを除外', 'Enter and leave log without anon'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'logRoomName',
      name: text('部屋名をログに記録する', 'Log room name'),
      type: 'onoff',
      value: 0
    },
    {
      name: text('その他', 'Others'),
      type: 'separator'
    },
    {
      key: 'takeStreamImmediately',
      name: text('入室時に自動で受信ボタンを押す', 'Press the button to get stream at entering'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'hairControl',
      name: text('内藤の髪', "Naito's hair"),
      type: [
        text('通常', 'Normal'),
        text('絶対に生えない', 'Absolutely no hair'),
        text('絶対に生える', 'Hair always exists')
      ],
      value: 0
    },
    {
      key: 'henshin',
      name: text('最初から#henshinする', 'Henshin at login'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'disableMove',
      name: text('ダブルクリック移動を無効化', 'Disable double click moving'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'stopBack',
      name: text('ブラウザバックを禁止する', 'Stop backward'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'useCookie',
      name: text('設定の保存場所', 'Config data location'),
      type: [
        'Local Storage',
        'Cookie'
      ],
      value: 0
    },
    {
      key: 'roomColor',
      name: 'Room background CSS <color> value',
      type: 'input',
      value: ''
    },
    {
      key: 'brightness',
      name: 'Brightness of room',
      type: 'input',
      value: ''
    },
    {
      key: 'userCSS',
      name: 'User CSS',
      type: 'textarea',
      value: ''
    },
    {
      key: 'logWindowCSS',
      name: 'Log window CSS',
      type: 'textarea',
      value: '.message {\n  padding: 2px 0;\n  border-bottom: 1px solid #000;\n}'
    },
    {
      key: 'voiceLog',
      name: 'Voice input',
      type: [
        'Send',
        'Output to log'
      ],
      value: 0
    },
    {
      key: 'voiceLang',
      name: 'Voice input language code',
      type: 'input',
      value: ''
    },
    {
      key: 'youtube',
      name: 'Open iframe YouTube player on click YouTube URL',
      type: 'onoff',
      value: 0
    },
    {
      key: 'debugWebhook',
      name: 'Webhook URL for debug',
      type: 'input',
      value: ''
    },
  ];
  var currentValue = {};
  window.load = function (obj) {
    try {
      if (typeof obj === 'string')
        obj = JSON.parse(obj);
    } catch (err) {
      alert(err);
    }
    config.forEach(item => {
      if (item.type === 'separator' || !obj.hasOwnProperty(item.key))
        return;
      var element = document.getElementById(item.key), value = obj[item.key];
      switch (item.type) {
        case 'textarea':
        case 'input':
          element.value = value;
          break;
        case 'color':
        case 'list':
          element.innerHTML = '';
          value?.forEach?.(value => {
            var option = element.appendChild(document.createElement('option'));
            option.text = value;
            if (item.type === 'color') {
              option.style.color = value;
              option.style.fontWeight = 'bold';
            }
          });
          break;
        default:
          if (item.type?.constructor === Array)
            element.selectedIndex = value;
      }
    });
    Object.assign(currentValue, obj);
  };
  var update = function (key, value) {
    if (key)
      currentValue[key] = value;
    if (window.opener)
      opener.modifyConfig(currentValue);
    else
      console.log(currentValue);
  };
  var downloadLink = document.createElement('a'), file = document.createElement('input'), reader = new FileReader();
  file.type = 'file';
  file.accept = '.json';
  file.onchange = function () {
    reader.readAsText(file.files[0]);
    file.value = '';
  };
  reader.onload = function () {
    load(reader.result);
    update();
  };
  var append = function (tagName, attr) {
    var element = document.body.appendChild(document.createElement(tagName));
    Object.assign(element, attr);
    if (tagName !== 'h1' && tagName !== 'hr')
      element.style.display
    return element;
  };
  var fileMenu = append('select');
  fileMenu.appendChild(document.createElement('option')).text = text('設定ファイル', 'Config file');
  fileMenu.appendChild(document.createElement('option')).text = text('開く...', 'Load...');
  fileMenu.appendChild(document.createElement('option')).text = text('保存...', 'Save...');
  fileMenu.selectedIndex = 0;
  fileMenu.onchange = function () {
    switch (fileMenu.selectedIndex) {
      case 1:
        file.click();
        break;
      case 2:
        URL.revokeObjectURL(downloadLink.href);
        downloadLink.href = URL.createObjectURL(new Blob([JSON.stringify(currentValue, null, 2) + '\n'], {type: 'application/octet-stream'}));
        downloadLink.download = 'experimental-poipoi-config.json';
        downloadLink.click();
        break;
    }
    fileMenu.selectedIndex = 0;
  };
  append('input', {
    type: 'button',
    value: text('設定ページを閉じる', 'Close this page'),
    onclick: function () {
      close();
    }
  }).style.marginLeft = '5em';
  var defaultValue = {};
  config.forEach(item => {
    switch (item.type) {
      case 'separator':
        append('hr');
        append('h1', {
          textContent: item.name,
          onclick: function () {
            var element = this.nextElementSibling;
            while (element && element.tagName !== 'HR') {
              element.style.display = element.style.display ? '' : 'none';
              element = element.nextElementSibling;
            }
          }
        });
        if (item.description)
          append('p').textContent = item.description;
        return;
      case 'textarea':
      case 'input':
        append('h2').textContent = item.name;
        if (item.description)
          append('p').textContent = item.description;
        var input = append(item.type, {id: item.key, spellcheck: false});
        if (item.type === 'input') {
          input.type = 'text';
          input.style.width = '30em';
        } else {
          input.setAttribute('style', 'width:50em;height:8em');
        }
        append('input', {
          type: 'button',
          value: 'Apply',
          onclick: function () {
            update(item.key, input.value);
          }
        });
        break;
      case 'color':
      case 'list':
        append('h2').textContent = item.name;
        if (item.description)
          append('p').textContent = item.description;
        var addText = append('input', {
          type: 'text',
          onkeypress: function (event) {
            if (event.key === 'Enter')
              addButton.click();
          }
        });
        addText.setAttribute('style', 'width:20em;box-sizing:border-box');
        var addButton = append('input', {
          type: 'button',
          value: 'Add',
          onclick: function () {
            if (!addText.value)
              return;
            if (/^\/.+\/([dgimsuy]*)$/i.test(addText.value)) {
              try {
                new RegExp(addText.value.slice(1, -(1 + RegExp.$1.length)), RegExp.$1);
              } catch (err) {
                alert(text('正規表現の書き方が違う:', '') + err);
                return;
              }
            }
            var option = select.insertBefore(document.createElement('option'), select.firstChild);
            option.text = addText.value;
            if (item.type === 'color') {
              option.style.color = addText.value;
              option.style.fontWeight = 'bold';
            }
            addText.value = '';
            update(item.key, Array.from(select.options).map(option => option.value));
          }
        });
        append('br');
        var select = append('select', {
          id: item.key,
          size: 6
        });
        select.setAttribute('style', 'width:20em;box-sizing:border-box');
        append('input', {
          type: 'button',
          value: 'Delete',
          onclick: function () {
            var i = select.selectedIndex;
            select.remove(i);
            select.selectedIndex = Math.min(i, select.options.length - 1);
            update(item.key, Array.from(select.options).map(option => option.value));
          }
        });
        break;
      case 'onoff':
        item.type = ['OFF', 'ON'];
      default:
        if (item.type?.constructor !== Array)
          break;
        append('h2').textContent = item.name;
        if (item.description)
          append('p').textContent = item.description;
        var changeColor = () => select.style.backgroundColor = {ON: '#afa', OFF: '#faa'}[select.value] || '';
        var select = append('select', {
          id: item.key,
          onchange: function () {
            update(item.key, select.selectedIndex);
            changeColor();
          }
        });
        item.type?.forEach?.(option => select.appendChild(document.createElement('option')).text = option);
        queueMicrotask(changeColor);
        break;
    }
    defaultValue[item.key] = item.value;
  });
  load(defaultValue);
  document.querySelector('head').appendChild(document.createElement('style')).textContent = 'h1{color:#06f;cursor:pointer;text-decoration:underline;margin:0;padding:10px 0}';
  Array.from(document.getElementsByTagName('h1')).forEach(h1 => h1.click());
})();
