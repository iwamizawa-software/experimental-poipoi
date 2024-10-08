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
      name: text('いらないボタン', 'Hide button'),
      description: text('設定ボタンを消した場合は#configコマンドで出せます。', 'Use #config command instead of button.'),
      type: 'title'
    },
    {
      key: 'hideVoiceButton',
      name: text('音声入力', 'Voice Input'),
      type: 'checkbox',
      value: false
    },
    {
      key: 'hideWidgetButton',
      name: 'Widget',
      type: 'checkbox',
      value: false
    },
    {
      key: 'hideLogWindowButton',
      name: text('ログ窓', 'Log Window'),
      type: 'checkbox',
      value: false
    },
    {
      key: 'hideClearButton',
      name: text('ログクリア', 'Clear Log'),
      type: 'checkbox',
      value: false
    },
    {
      key: 'hideSaveButton',
      name: text('ログ保存', 'Save Log'),
      type: 'checkbox',
      value: false
    },
    {
      key: 'hideConfigButton',
      name: text('設定', 'Config'),
      type: 'checkbox',
      value: false
    },
    {
      key: 'hidePIP',
      name: 'PIP',
      type: 'checkbox',
      value: false
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
      value: 0,
      relations: ['iconSize']
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
      value: 0,
      relations: ['autoColorList']
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
      name: text('配信事故防止', 'Streaming stopper list'),
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
      description: text('指定した文字を消してから自動あぼーんやNGワード判定します。例：「./ー」と指定するとア.ホ、ア/ホ、アーホが全てアホと見なされる', 'Remove set characters before filtering. (When set "/_", f/*/*/k or f_*_*_k is same as f**k.)'),
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
      name: text('SYSTEMのあぼーんメッセージを非表示', 'Hide blocking message'),
      type: 'onoff',
      value: 0
    },
    {
      name: text('特殊な自動あぼーん', 'Optional auto ignore/block'),
      type: 'separator'
    },
    {
      key: 'ignoreAll',
      name: text('ホワイトリスト型自動あぼーん', 'Allowlist mode'),
      description: text('指定した名前の人以外全員あぼーんします。', 'Block or Ignore everyone without allowlist members.'),
      type: [
        'OFF',
        text('一方あぼーん', 'Auto ignore'),
        text('相互あぼーん', 'Auto block')
      ],
      value: 0,
      relations: ['unignoreList']
      
    },
    {
      key: 'unignoreList',
      name: text('ホワイトリスト', 'Allowlist'),
      type: 'list',
      value: []
    },
    {
      key: 'spammer',
      name: text('連投あぼーん', 'Spammer'),
      type: [
        'OFF',
        text('一方あぼーん', 'Auto ignore'),
        text('相互あぼーん', 'Auto block')
      ],
      value: 0,
      relations: ['minMsgInterval', 'minMsgIntervalAverage', 'displayMsgInterval', 'hideSpamAbonMsg']
    },
    {
      key: 'minMsgInterval',
      name: text('発言間隔秒数', 'Lower limit of message interval (seconds)'),
      description: text('指定した秒数以下の発言をした人を自動あぼーんします。(小数点使用可)', 'Block or ignore user below the limit.'),
      type: 'input',
      value: ''
    },
    {
      key: 'minMsgIntervalAverage',
      name: text('平均発言間隔秒数', 'Lower limit of message interval (average)'),
      description: text('1回の発言は速くないが平均的に速い人を自動あぼーんします。', 'Judge by average value.'),
      type: 'input',
      value: ''
    },
    {
      key: 'displayMsgInterval',
      name: text('発言間隔秒数と平均値をログに表示する', 'Add time of message interval to log'),
      description: text('設定値を決めるための参考として使います。1番目は発言間隔、2番目は平均値が表示されます。', 'Reference for config'),
      type: 'onoff',
      value: 0
    },
    {
      key: 'hideSpamAbonMsg',
      name: text('連投あぼーんメッセージを非表示', 'Hide spam blocking message'),
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
      value: 1,
      relations: ['replyMsg', 'mentionSound', 'mentionVolume']
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
      name: text('入退室通知', 'Enter and Exit notifications'),
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
      name: text('入退室ログ', 'Log enter and exit'),
      type: [
        'OFF',
        'ON',
        text('IDも出力', 'Output with ID')
      ],
      value: 0
    },
    {
      key: 'withoutAnon',
      name: text('入退室通知とログで名無しを除外', 'Enter and exit log without anon'),
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
      name: 'Widget',
      type: 'separator'
    },
    {
      name: text('表示する内容', 'Display'),
      type: 'title'
    },
    {
      key: 'widgetStreaming',
      name: text('配信開始', 'Start streaming'),
      type: 'checkbox',
      value: false
    },
    {
      key: 'widgetMention',
      name: text('メンション', 'Mention'),
      type: 'checkbox',
      value: false
    },
    {
      key: 'widgetAccess',
      name: text('入退室', 'Enter and Exit'),
      type: 'checkbox',
      value: true
    },
    {
      key: 'widgetAnonAccess',
      name: text('名無しの入退室', 'Anon enter and exit'),
      type: 'checkbox',
      value: true
    },
    {
      key: 'widgetComment',
      name: text('発言', 'Comment'),
      type: 'checkbox',
      value: true
    },
    {
      key: 'widgetAnonComment',
      name: text('名無しの発言', 'Anon Comment'),
      type: 'checkbox',
      value: true
    },
    {
      key: 'widgetLength',
      name: text('最大行数', 'Length'),
      type: 'input',
      value: '30'
    },
    {
      key: 'widgetWidth',
      name: text('横幅', 'Width'),
      type: 'input',
      value: '250'
    },
    {
      key: 'widgetHeight',
      name: text('高さ', 'Height'),
      type: 'input',
      value: '500'
    },
    {
      key: 'widgetFps',
      name: 'fps',
      type: 'input',
      value: '2'
    },
    {
      key: 'widgetCSS',
      name: 'CSS',
      type: 'textarea',
      description: `Sample HTML
<div class="log">
<p class="streaming"><span class="name">test</span><span class="ihash">◇AAAAAA</span><span class="content"> has started streaming.</span></p>
<p class="access"><span class="name">test</span><span class="ihash">◇AAAAAA</span><span class="content"> has joined the room.</span></p>
<p class="comment anon"><span class="name">Anonymous</span><span class="ihash">◇AAAAAA</span><span class="separator">: </span><span class="content">test</span></p>
<p class="comment mention"><span class="name"></span><span class="ihash">◇AAAAAA</span><span class="trip">◆AAAAAAAAAA</span><span class="separator">: </span><span class="content">hi test</span></p>
</div>`,
      value: 'body{margin:0;padding:0;width:100%;height:100%;border:1px solid #000;box-sizing:border-box;background:#fff}.log{position:fixed;bottom:1px;width:100%}p{margin:0;padding:2px;font-size:0.8em;border-top:1px solid #000;word-break:break-all}.ihash{display:none}'
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
      key: 'voiceFormatGen',
      name: 'Voice input format in _gen',
      type: 'input',
      value: '音声入力:message'
    },
    {
      key: 'voiceFormatFor',
      name: 'Voice input format in _for',
      type: 'input',
      value: 'Voice input:message'
    },
    {
      key: 'youtube',
      name: 'Open iframe YouTube player on click YouTube URL',
      type: 'onoff',
      value: 0
    },
    {
      key: 'disablePixelRatio',
      name: 'Disable calc pixel ratio',
      type: 'onoff',
      value: 0
    },
    {
      key: 'showColorPicker',
      name: 'Show color picker',
      type: 'onoff',
      value: 0
    },
    {
      key: 'debugWebhook',
      name: 'Webhook URL for debug',
      type: 'input',
      value: ''
    },/*
    {
      name: 'Debug buttons',
      type: 'title'
    },
    {
      type: 'button',
      textContent: '午後',
      onclick: () => {
        prompt('↓の文をコピーして報告してください', '```' + JSON.stringify({
          experimentalVersion: localStorage.getItem('experimentalVersion'),
          experimentalColor: localStorage.getItem('experimentalColor'),
          CSS: currentValue.userCSS
        }, null, 2) + '```');
      }
    },*/
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
      if (!obj.hasOwnProperty(item.key))
        return;
      var element = document.getElementById(item.key), value = obj[item.key];
      switch (item.type) {
        case 'checkbox':
          element.checked = value;
          break;
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
          if (item.type?.constructor === Array) {
            element.selectedIndex = value;
            element.onchange?.();
          }
      }
    });
    Object.assign(currentValue, obj);
  };
  var update = function (key, value) {
    if (key)
      currentValue[key] = value;
    if (window.opener) {
      try {
        opener.modifyConfig(currentValue);
      } catch (err) {
        alert(text('設定の適用に失敗しました。ギコっぽいぽいを開きなおしてください。', 'Failed to save config. Open gikopoipoi again.'));
      }
    } else {
      console.log(currentValue);
    }
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
  var divs = {};
  var append = function (tagName, group, attr) {
    var parent = document.body;
    if (typeof group === 'string') {
      parent = divs[group] || (divs[group] = append('div'));
    } else {
      attr = group;
    }
    var element = parent.appendChild(document.createElement(tagName));
    Object.assign(element, attr);
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
          append('p').innerText = item.description;
        return;
      case 'title':
        append('h2').textContent = item.name;
        if (item.description)
          append('p').innerText = item.description;
        return;
      case 'button':
        append('button', item);
        return;
      case 'checkbox':
        append('label').append(
          append('input',{
            id: item.key,
            type: 'checkbox',
            checked: item.value,
            onchange: function () {
              update(item.key, this.checked);
            }
          }),
          item.name
        );
        break;
      case 'textarea':
      case 'input':
        append('h2', item.key).textContent = item.name;
        if (item.description)
          append('p', item.key).innerText = item.description;
        var input = append(item.type, item.key, {id: item.key, spellcheck: false});
        if (item.type === 'input') {
          input.type = 'text';
          input.style.width = '30em';
        } else {
          input.setAttribute('style', 'width:50em;height:8em');
        }
        append('input', item.key, {
          type: 'button',
          value: 'Apply',
          onclick: function () {
            update(item.key, input.value);
          }
        });
        append('input', item.key, {
          type: 'button',
          value: 'Reset',
          onclick: function () {
            if (confirm(text('初期値に戻しますか？', 'Do you set default value?')))
              update(item.key, input.value = item.value);
          }
        });
        break;
      case 'color':
      case 'list':
        append('h2', item.key).textContent = item.name;
        if (item.description)
          append('p', item.key).innerText = item.description;
        var addText = append('input', item.key, {
          type: 'text',
          onkeypress: function (event) {
            if (event.key === 'Enter')
              addButton.click();
          }
        });
        addText.setAttribute('style', 'width:20em;box-sizing:border-box');
        var addButton = append('input', item.key, {
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
        append('br', item.key);
        var select = append('select', item.key, {
          id: item.key,
          size: 6
        });
        select.setAttribute('style', 'width:20em;box-sizing:border-box');
        append('input', item.key, {
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
        append('h2', item.key).textContent = item.name;
        if (item.description)
          append('p', item.key).innerText = item.description;
        var changeStyle = () => {
          select.style.backgroundColor = {ON: '#afa', OFF: '#faa'}[select.value] || '';
          if (item.relations)
            item.relations.forEach(id => document.getElementById(id).parentNode.className = select.value === 'OFF' ? 'hide' : '');
        };
        var select = append('select', item.key, {
          id: item.key,
          onchange: function (event) {
            if (event)
              update(item.key, select.selectedIndex);
            changeStyle();
          }
        });
        item.type?.forEach?.(option => select.appendChild(document.createElement('option')).text = option);
        queueMicrotask(changeStyle);
        break;
    }
    defaultValue[item.key] = item.value;
  });
  load(defaultValue);
  document.querySelector('head').appendChild(document.createElement('style')).textContent = 'h1{color:#06f;cursor:pointer;text-decoration:underline;margin:0;padding:10px 0}.hide{display:none}label{padding:10px;display:inline-block}input[type=button]{padding-left:30px;padding-right:30px;}';
  Array.from(document.getElementsByTagName('h1')).forEach(h1 => h1.click());
})();
