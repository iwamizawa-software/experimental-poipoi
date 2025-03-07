/*
// アイコンデータの取得
var chars = {};
Array.from(document.querySelectorAll('label img')).forEach(img => {
  var name = img.previousElementSibling.value;
  chars[name] = {src: img.src, style: img.getAttribute('style')};
  var alt = new Image();
  alt.src = img.src.replace('front-standing', 'front-standing-alt');
  alt.onload = () => {
    chars[name + '_alt'] = Object.assign({}, chars[name]);
    chars[name + '_alt'].src = alt.src;
  };
});
setTimeout(() => console.log(JSON.stringify(chars, '', 2)), 5000);

// 本家で実行
var characterIconData = {};
Array.from(document.querySelectorAll('#character-selection label img')).forEach(img => {
  characterIconData[img.previousElementSibling.value] = true;
});
console.log('var characterIconData = ' + JSON.stringify(characterIconData) + ';');

// playgikopoiで実行
document.querySelector('head').appendChild(document.createElement('style')).textContent = `
#character-selection label {
    position: relative;
    height: 60px;
    min-width: 60px;
    margin: 2px;
    overflow: hidden;
    display: block;
    border: 1px solid #999999;
}
#character-selection {
    display: flex;
    width: 100%;
    overflow-x: auto;
    padding-top: 2px;
    padding-bottom: 2px;
    user-select: none;
}
#character-selection img{
    display: block;
    position: absolute;
    object-fit: cover;
    padding:0;
    height: auto;
}
`;
Object.keys(characterIconData).forEach(name => document.querySelector(`[for="${name}-selection"]`)?.remove());
Array.from(document.querySelectorAll('#character-selection label img')).forEach(img => img.setAttribute('style', characters[img.previousElementSibling.value]?.style || 'top:24%;left:-50%;width:190%'));

*/

var characters = {
  "giko": {
    "src": "https://gikopoipoi.net/characters/giko/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "naito": {
    "src": "https://gikopoipoi.net/characters/naito/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "shii": {
    "src": "https://gikopoipoi.net/characters/shii/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "hikki": {
    "src": "https://gikopoipoi.net/characters/hikki/front-standing.svg",
    "style": "top: -12%; left: -44%; width: 190%;"
  },
  "tinpopo": {
    "src": "https://gikopoipoi.net/characters/tinpopo/front-standing.svg",
    "style": "top: 26%; left: -50%; width: 190%;"
  },
  "shobon": {
    "src": "https://gikopoipoi.net/characters/shobon/front-standing.svg",
    "style": "top: -20%; left: -50%; width: 190%;"
  },
  "nida": {
    "src": "https://gikopoipoi.net/characters/nida/front-standing.svg",
    "style": "top: 27%; left: -50%; width: 190%;"
  },
  "salmon": {
    "src": "https://gikopoipoi.net/characters/salmon/front-standing.svg",
    "style": "top: -54%; left: 17%; width: 190%;"
  },
  "giko_hat": {
    "src": "https://gikopoipoi.net/characters/giko_hat/front-standing.svg",
    "style": "top: 10%; left: -50%; width: 190%;"
  },
  "shii_hat": {
    "src": "https://gikopoipoi.net/characters/shii_hat/front-standing.svg",
    "style": "top: 10%; left: -50%; width: 190%;"
  },
  "shobon_hat": {
    "src": "https://gikopoipoi.net/characters/shobon_hat/front-standing.svg",
    "style": "top: -20%; left: -41%; width: 190%;"
  },
  "furoshiki": {
    "src": "https://gikopoipoi.net/characters/furoshiki/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "golden_furoshiki": {
    "src": "https://gikopoipoi.net/characters/golden_furoshiki/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "furoshiki_shii": {
    "src": "https://gikopoipoi.net/characters/furoshiki_shii/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "sakura_furoshiki_shii": {
    "src": "https://gikopoipoi.net/characters/sakura_furoshiki_shii/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "furoshiki_shobon": {
    "src": "https://gikopoipoi.net/characters/furoshiki_shobon/front-standing.svg",
    "style": "top: -20%; left: -41%; width: 190%;"
  },
  "naitoapple": {
    "src": "https://gikopoipoi.net/characters/naitoapple/front-standing.svg",
    "style": "top: 10%; left: -50%; width: 190%;"
  },
  "shii_pianica": {
    "src": "https://gikopoipoi.net/characters/shii_pianica/front-standing.svg",
    "style": "top: 24%; left: -46%; width: 190%;"
  },
  "shii_uniform": {
    "src": "https://gikopoipoi.net/characters/shii_uniform/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "hungry_giko": {
    "src": "https://gikopoipoi.net/characters/hungry_giko/front-standing.svg",
    "style": "top: 15%; left: -45%; width: 190%;"
  },
  "rikishi_naito": {
    "src": "https://gikopoipoi.net/characters/rikishi_naito/front-standing.svg",
    "style": "top: -18%; left: -30%; width: 170%;"
  },
  "hentai_giko": {
    "src": "https://gikopoipoi.net/characters/hentai_giko/front-standing.svg",
    "style": "top: 33%; left: -45%; width: 170%;"
  },
  "shar_naito": {
    "src": "https://gikopoipoi.net/characters/shar_naito/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "dark_naito_walking": {
    "src": "https://gikopoipoi.net/characters/dark_naito_walking/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "ika": {
    "src": "https://gikopoipoi.net/characters/ika/front-standing.svg",
    "style": "top: 18%; left: 0%; width: 100%;"
  },
  "takenoko": {
    "src": "https://gikopoipoi.net/characters/takenoko/front-standing.svg",
    "style": "top: 0%; left: 0%; width: 100%;"
  },
  "kaminarisama_naito": {
    "src": "https://gikopoipoi.net/characters/kaminarisama_naito/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "panda_naito": {
    "src": "https://gikopoipoi.net/characters/panda_naito/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "wild_panda_naito": {
    "src": "https://gikopoipoi.net/characters/wild_panda_naito/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "funkynaito": {
    "src": "https://gikopoipoi.net/characters/funkynaito/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "molgiko": {
    "src": "https://gikopoipoi.net/characters/molgiko/front-standing.png",
    "style": "top: -70%; left: -80%; width: 190%;"
  },
  "tikan_giko": {
    "src": "https://gikopoipoi.net/characters/tikan_giko/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "hotsuma_giko": {
    "src": "https://gikopoipoi.net/characters/hotsuma_giko/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "dokuo": {
    "src": "https://gikopoipoi.net/characters/dokuo/front-standing.svg",
    "style": "top: -33%; left: -58%; width: 190%;"
  },
  "onigiri": {
    "src": "https://gikopoipoi.net/characters/onigiri/front-standing.svg",
    "style": "top: 20%; left: -38%; width: 170%;"
  },
  "tabako_dokuo": {
    "src": "https://gikopoipoi.net/characters/tabako_dokuo/front-standing.svg",
    "style": "top: -33%; left: -58%; width: 190%;"
  },
  "himawari": {
    "src": "https://gikopoipoi.net/characters/himawari/front-standing.svg",
    "style": "top: 0%; left: -47%; width: 190%;"
  },
  "zonu": {
    "src": "https://gikopoipoi.net/characters/zonu/front-standing.svg",
    "style": "top: -46%; left: -70%; width: 190%;"
  },
  "george": {
    "src": "https://gikopoipoi.net/characters/george/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "chotto_toorimasu_yo": {
    "src": "https://gikopoipoi.net/characters/chotto_toorimasu_yo/front-standing.svg",
    "style": "top: -34%; left: -54%; width: 190%;"
  },
  "tokita_naito": {
    "src": "https://gikopoipoi.net/characters/tokita_naito/front-standing.svg",
    "style": "top: 4%; left: -40%; width: 170%;"
  },
  "pumpkinhead": {
    "src": "https://gikopoipoi.net/characters/pumpkinhead/front-standing.svg",
    "style": "top: 34%; left: -74%; width: 230%;"
  },
  "naito_yurei": {
    "src": "https://gikopoipoi.net/characters/naito_yurei/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "shiinigami": {
    "src": "https://gikopoipoi.net/characters/shiinigami/front-standing.svg",
    "style": "top: 2%; left: -100%; width: 280%;"
  },
  "youkanman": {
    "src": "https://gikopoipoi.net/characters/youkanman/front-standing.svg",
    "style": "top: -50%; left: -46%; width: 180%;"
  },
  "baba_shobon": {
    "src": "https://gikopoipoi.net/characters/baba_shobon/front-standing.svg",
    "style": "top: -20%; left: -50%; width: 190%;"
  },
  "uzukumari": {
    "src": "https://gikopoipoi.net/characters/uzukumari/front-standing.svg",
    "style": "top: -69%; left: -98%; width: 190%;"
  },
  "giko_basketball": {
    "src": "https://gikopoipoi.net/characters/giko_basketball/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "mikan_naito": {
    "src": "https://gikopoipoi.net/characters/mikan_naito/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "giko_shamisen": {
    "src": "https://gikopoipoi.net/characters/giko_shamisen/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "shii_syakuhati": {
    "src": "https://gikopoipoi.net/characters/shii_syakuhati/front-standing.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "taiko_naito": {
    "src": "https://gikopoipoi.net/characters/taiko_naito/front-standing.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "shobon_raincoat": {
    "src": "https://gikopoipoi.net/characters/shobon_raincoat/front-standing.svg",
    "style": "top: -20%; left: -41%; width: 190%;"
  },
  "shii_raincoat": {
    "src": "https://gikopoipoi.net/characters/shii_raincoat/front-standing.svg",
    "style": "top: 24%; left: -46%; width: 190%;"
  },
  "shii_shintaisou": {
    "src": "https://gikopoipoi.net/characters/shii_shintaisou/front-standing.svg",
    "style": "top: 24%; left: -46%; width: 190%;"
  },
  "shii_toast": {
    "src": "https://gikopoipoi.net/characters/shii_toast/front-standing.svg",
    "style": "top: 24%; left: -46%; width: 190%;"
  },
  "shobon_alt": {
    "src": "https://gikopoipoi.net/characters/shobon/front-standing-alt.svg",
    "style": "top: -20%; left: -50%; width: 190%;"
  },
  "furoshiki_alt": {
    "src": "https://gikopoipoi.net/characters/furoshiki/front-standing-alt.svg",
    "style": "top: 24%; left: -50%; width: 190%;"
  },
  "furoshiki_shobon_alt": {
    "src": "https://gikopoipoi.net/characters/furoshiki_shobon/front-standing-alt.svg",
    "style": "top: -20%; left: -41%; width: 190%;"
  },
  "takenoko_alt": {
    "src": "https://gikopoipoi.net/characters/takenoko/front-standing-alt.svg",
    "style": "top: 0%; left: 0%; width: 100%;"
  },
  "onigiri_alt": {
    "src": "https://gikopoipoi.net/characters/onigiri/front-standing-alt.svg",
    "style": "top: 20%; left: -38%; width: 170%;"
  },
  "himawari_alt": {
    "src": "https://gikopoipoi.net/characters/himawari/front-standing-alt.svg",
    "style": "top: 0%; left: -47%; width: 190%;"
  },
  "george_alt": {
    "src": "https://gikopoipoi.net/characters/george/front-standing-alt.svg",
    "style": "top: 13%; left: -48%; width: 190%;"
  },
  "tokita_naito_alt": {
    "src": "https://gikopoipoi.net/characters/tokita_naito/front-standing-alt.svg",
    "style": "top: 4%; left: -40%; width: 170%;"
  },
  "youkanman_alt": {
    "src": "https://gikopoipoi.net/characters/youkanman/front-standing-alt.svg",
    "style": "top: -50%; left: -46%; width: 180%;"
  },
  "baba_shobon_alt": {
    "src": "https://gikopoipoi.net/characters/baba_shobon/front-standing-alt.svg",
    "style": "top: -20%; left: -50%; width: 190%;"
  },
  "shii_shintaisou_alt": {
    "src": "https://gikopoipoi.net/characters/shii_shintaisou/front-standing-alt.svg",
    "style": "top: 24%; left: -46%; width: 190%;"
  },
  "shii_toast_alt": {
    "src": "https://gikopoipoi.net/characters/shii_toast/front-standing-alt.svg",
    "style": "top: 24%; left: -46%; width: 190%;"
  },
  "mitsugiko": {
    "src": "https://play.gikopoi.com/characters/mitsugiko/front-standing.svg",
    "style": "top:-40%;left:-90%;width:190%"
  },
  "giko_cop": {
    "src": "https://play.gikopoi.com/characters/giko_cop/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "giko_batman": {
    "src": "https://play.gikopoi.com/characters/giko_batman/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "giko_hungover": {
    "src": "https://play.gikopoi.com/characters/giko_hungover/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "giko_islam": {
    "src": "https://play.gikopoi.com/characters/giko_islam/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "shii_islam": {
    "src": "https://play.gikopoi.com/characters/shii_islam/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "giko_shroom": {
    "src": "https://play.gikopoi.com/characters/giko_shroom/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "akai": {
    "src": "https://play.gikopoi.com/characters/akai/front-standing.png",
    "style": "top:-10%;left:-50%;width:190%"
  },
  "bif_alien": {
    "src": "https://play.gikopoi.com/characters/bif_alien/front-standing.png",
    "style": "top:-40%;left:-60%;width:190%"
  },
  "bif_wizard": {
    "src": "https://play.gikopoi.com/characters/bif_wizard/front-standing.png",
    "style": "top:-40%;left:-60%;width:190%"
  },
  "hotaru": {
    "src": "https://play.gikopoi.com/characters/hotaru/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "winter_shii": {
    "src": "https://play.gikopoi.com/characters/winter_shii/front-standing.svg",
    "style": "top:0%;left:-50%;width:190%"
  },
  "longcat": {
    "src": "https://play.gikopoi.com/characters/longcat/front-standing.png",
    "style": "top:-30%;left:-50%;width:190%"
  },
  "mona": {
    "src": "https://play.gikopoi.com/characters/mona/front-standing.png",
    "style": "top:30%;left:-50%;width:190%"
  },
  "foe": {
    "src": "https://play.gikopoi.com/characters/foe/front-standing.svg",
    "style": "top:-50%;left:-50%;width:190%"
  },
  "kimono_giko": {
    "src": "https://play.gikopoi.com/characters/kimono_giko/front-standing.svg",
    "style": "top:24%;left:-50%;width:190%"
  },
  "kimono_shii": {
    "src": "https://play.gikopoi.com/characters/kimono_shii/front-standing.svg",
    "style": "top:24%;left:-50%;width:190%"
  },
  "sonichu": {
    "src": "https://play.gikopoi.com/characters/sonichu/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "yume": {
    "src": "https://play.gikopoi.com/characters/yume/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "giko_gold": {
    "src": "https://play.gikopoi.com/characters/giko_gold/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "naito_npc": {
    "src": "https://play.gikopoi.com/characters/naito_npc/front-standing.png",
    "style": "top:0%;left:-50%;width:190%"
  },
  "habbo": {
    "src": "https://play.gikopoi.com/characters/habbo/front-standing.png",
    "style": "top:-50%;left:-50%;width:190%"
  },
  "blankchan": {
    "src": "https://play.gikopoi.com/characters/blankchan/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  },
  "goatse": {
    "src": "https://play.gikopoi.com/characters/goatse/front-standing.png",
    "style": "top:24%;left:-50%;width:190%"
  }
};
var elements = {}, settings = {msg: t('Congratulations!', 'おめでとうございます。')}, current = {}, quiz = {data:[], title: t('Quiz', 'クイズ')}, users = {}, rank = [];
var loadSettings = function () {
  try {
    var obj = JSON.parse(localStorage.getItem('experimental-quiz'));
    if (obj) {
      for (var id in obj) {
        if (elements[id].type === 'text' || id === 'encoding')
          elements[id].value = obj[id];
        else if (elements[id].type === 'checkbox')
          elements[id].checked = obj[id];
        else if (id === 'msg')
          settings.msg = obj[id];
      }
    }
  } catch (err) {
    console.log(err);
  }
};
var saveSettings = () => localStorage.setItem('experimental-quiz', JSON.stringify(settings));
var normalize = s => s?.normalize('NFKC').toUpperCase();
var update = function () {
  for (var i = 0; i < arguments.length; i++) {
    var value = eval(arguments[i]);
    Array.from(document.querySelectorAll('[data-bind="' + arguments[i] + '"]')).forEach(element => element.innerText = value);
  }
};
Array.from(document.querySelectorAll('[id]')).forEach(element => elements[element.id] = element);
var reader = new FileReader();
elements.file.onchange = function (event) {
  reader.readAsText(elements.file.files[0], elements.encoding.value);
  quiz.title = elements.file.value.replace(/^.*\\|\.[^\.]*$/g, '');
  update('quiz.title');
  elements.file.value = '';
};
reader.onload = function () {
  load(reader.result);
  elements.hideSettings.click();
};
var load = function (text) {
  var lines = text.replace(/^[\r\n]+|[\r\n]+$/g, '').split(/[\r\n]+/);
  quiz.data = lines.map((line, index) => {
    var fields = line.split(t('\t', ',')), q = {point: /^[0-9]+$/.test(fields[0]) ? +fields.shift() : 1};
    if (fields.length < 2) {
      alert(t(`Wrong line at ${index + 1}. Text:${line}`, `${index + 1}行目の形式がおかしい:${line}`));
      throw 1;
    }
    var qText = fields.shift().replace(/(https?:\/\/.+)(?: |$)/, (s, url) => {
      var youtube = url.match(/^https?:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([^\?&]+)(?:[\?&]t=(\d+).*)?$/);
      if (youtube) {
        q.youtube = {videoId: youtube[1]};
        if (youtube[2])
          q.youtube.playerVars = {start: youtube[2]};
      } else {
        q.image = url;
      }
      return '';
    }).replace(/\\n/g, '\n');
    q.question = qText.split(t(' ', ''));
    q.correct = fields.map(a => normalize(a));
    q.correctText = fields.join(', ');
    if (q.choice = /^[↖↗↙↘]$/.test(q.correct[0])) {
      q.answers = {};
      qText.match(/[↖↗↙↘][^↖↗↙↘]+/g)?.forEach(str => q.answers[str[0]] = str.slice(1));
      if (q.answers[q.correct[0]])
        q.correctText = [q.answers[q.correct[0]]].concat(q.correct.slice(1)).join(', ');
    }
    return q;
  });
  quiz.length = lines.length;
  current.count = settings.maxQuestions;
  elements.next.onclick();
  elements.maxQuestions.onkeyup();
  update('quiz.data.length');
  elements.main.className = 'title';
};
elements.reset.onclick = function () {
  if (confirm(t('Reset result.', '全員のポイントをリセットします'))) {
    rank.length = 0;
    elements.players.innerHTML = '';
  }
};
elements.maxQuestions.onkeyup = function () {
  settings.maxQuestions = (+this.value > quiz.length ? quiz.length : +this.value) || 1;
  update('settings.maxQuestions');
  saveSettings();
};
elements.encoding.onchange = elements.maxAnswers.onkeyup = elements.firstBonus.onkeyup = elements.secondBonus.onkeyup = elements.time.onkeyup = elements.autoplay.onclick = elements.random.onclick = function () {
  settings[this.id] = this.type === 'checkbox' ? this.checked : this.value;
  update('settings.' + this.id);
  saveSettings();
};
elements.playersFontSize.onkeyup = elements.quizFontSize.onkeyup = function () {
  elements[this.dataset.target].style.setProperty('--font-size', this.value + 'px');
  settings[this.id] = this.value;
  saveSettings();
};
elements.playerListWidth.onkeyup = function () {
  elements[this.dataset.target].style.setProperty('--player-list-width', this.value);
  settings[this.id] = this.value;
  saveSettings();
};
elements.dark.onclick = function () {
  document.documentElement.className = this.checked ? 'dark' : '';
};
elements.msg.onclick = function () {
  var msg = prompt(t('Set message to winner', '優勝者へのメッセージを指定'), settings.msg);
  if (msg) {
    settings.msg = msg;
    saveSettings();
  }
};
elements.start.onclick = function () {
  elements.main.className = 'quiz';
  current.count = 0;
  elements.next.onclick();
};
elements.quizImage.onerror = function (event) {
  this.parentNode.style.display = 'none';
  current.quiz.correctText += t(' Failed to load image.', 'の画像を開けませんでした。');
  update('current.quiz.correctText');
  close();
};
elements.quizImage.onload = function () {
  this.parentNode.style.display = '';
};
var timer, close = function () {
  if (!elements.closed.style.display)
    return;
  current.time = 0;
  clearInterval(timer);
  elements.closed.style.display = '';
  current.displayed += current.quiz.question.join('');
  update('current.displayed');
  rank.forEach(p => p.displayAnswer());
  rank.sort((a, b) => b.point - a.point).forEach((p, index) => p.setRank(index));
  if (settings.autoplay)
    timer = setTimeout(() => elements.next.onclick(), 5000);
};
var animationTimer, animation = function () {
  if (!current.time || !current.quiz.question.length)
    return;
  clearTimeout(animationTimer);
  current.displayed += current.quiz.question.shift() + t(' ', '');
  update('current.displayed');
  animationTimer = setTimeout(animation, 50);
};
elements.next.onclick = function () {
  clearInterval(timer);
  elements.closed.style.display = 'none';
  document.getElementById('youtube').parentNode.innerHTML = '<div id="youtube"></div>';
  rank.forEach(p => p.hideAnswer());
  if (++current.count > settings.maxQuestions) {
    elements.main.className = 'finish';
    for (var i = 1; i < rank.length; i++)
      if (rank[0].point !== rank[i].point)
        break;
    current.winner = t('1st: ', '優勝は') + (rank.length ? rank.slice(0, i).map(p => p.name).join(t('and', 'さんと')) + t('. ', 'さんでした。') + settings.msg : t('THE END', 'いませんでした。'));
    update('current.winner');
    return;
  }
  current.qualified = [];
  current.displayed = '';
  current.quiz = quiz.data.splice(settings.random ? Math.floor(Math.random() * quiz.data.length) : 0, 1)[0];
  elements.quizImage.parentNode.style.display = 'none';
  if (current.quiz.image)
    elements.quizImage.src = current.quiz.image;
  if (current.quiz.youtube)
    new YT.Player('youtube', Object.assign({events: {onReady: event => event.target.playVideo(), onError: event => {
      current.quiz.correctText += t(' Faild to load YouTube. Reason:', 'のYouTubeは再生できませんでした。理由:') + event.data;
      update('current.quiz.correctText');
      close();
    }}}, current.quiz.youtube));
  current.time = +settings.time;
  timer = setInterval(() => {
    if (--current.time <= 0)
      close();
    update('current.time');
  }, 1000);
  animation();
  update('current.time', 'current.count', 'current.quiz.point', 'current.displayed', 'current.quiz.correctText');
};
elements.extend.onclick = function () {
  current.time += 15;
  update('current.time');
};
elements.reduce.onclick = function () {
  current.time -= 15;
  update('current.time');
};
elements.showSettings.onclick = function () {
  elements.settings.style.display = '';
  location.href = '#settings';
};
elements.hideSettings.onclick = function () {
  elements.settings.style.display = 'none';
  location.href = '#main';
};
var checkErrorButton = elements.checkError.value;
elements.checkError.onclick = async function () {
  if (this.value !== checkErrorButton)
    return;
  this.value = '';
  var dummyYouTube = document.body.appendChild(document.createElement('div'));
  dummyYouTube.innerHTML = '<div id="dummy"></div>';
  dummyYouTube.style.display = 'none';
  var youtubeIsError = youtube => new Promise(resolve => new YT.Player('dummy', Object.assign({events: {onReady: () => setTimeout(() => resolve(0), 2000), onError: () => resolve(1)}}, youtube)));
  var dummyImage = new Image();
  var imgIsError = src => new Promise(resolve => Object.assign(dummyImage, {src, onload: () => resolve(0), onerror: () => resolve(1)}));
  for (var i = 0; i < quiz.data.length; i++) {
    if (quiz.data[i].image && await imgIsError(quiz.data[i].image)) {
      alert(t('Faild to load image at line ', '') + (i + 1) + t('. URL:', '番目の問題の画像はエラーです。URL:') + quiz.data[i].image);
      break;
    } else if (quiz.data[i].youtube && await youtubeIsError(quiz.data[i].youtube)) {
      alert(t('Faild to load YouTube at line ', '') + (i + 1) + t('. videoId:', '番目の問題のYouTubeはエラーです。videoId:') + quiz.data[i].youtube.videoId);
      break;
    } else {
      this.value = (i + 1) + '/' + quiz.data.length + t(' Completed', ' チェック完了');
    }
    dummyYouTube.innerHTML = '<div id="dummy"></div>';
  }
  dummyYouTube.remove();
  this.value = checkErrorButton;
  alert(t('Completed', 'チェック完了'));
};
var removeSpace = str => str.replace(/[\u{0000}\u{0009}-\u{000D}\u{0020}\u{0085}\u{00A0}\u{00AD}\u{034F}\u{061C}\u{070F}\u{115F}\u{1160}\u{1680}\u{17B4}\u{17B5}\u{180E}\u{2000}-\u{200F}\u{2028}-\u{202F}\u{205F}-\u{206F}\u{2800}\u{3000}\u{3164}\u{FEFF}\u{FFA0}\u{110B1}\u{1BCA0}-\u{1BCA3}\u{1D159}\u{1D173}-\u{1D17A}\u{E0000}-\u{E0FFF}]/gu, '');
var match = (str, cond, removeWorkaround) => {
  if (!cond || cond.constructor !== Array || typeof str !== 'string')
    return false;
  var targets = [];
  var nospace = removeSpace(str);
  if (nospace !== str)
    targets.push(nospace);
  if (removeWorkaround) {
    var removed = nospace.split('').filter(c => !removeWorkaround.includes(c)).join('');
    if (removed !== nospace)
      targets.push(removed);
  }
  targets.push(str);
  return cond.some(c => {
    if (!c)
      return false;
    if (/^\/.+\/([dgimsuy]*)$/i.test(c)) {
      var regex = new RegExp(c.slice(1, -(1 + RegExp.$1.length)), RegExp.$1);
      return targets.some(target => regex.test(target));
    } else {
      return targets.some(target => target.includes(c));
    }
  });
};
var getUserName = user => {
  var defaultName = t(location.search.includes('play') ? 'Spy' : 'Anonymous', '名無しさん');
  var name = user.name || defaultName;
  if (match(name, ['/' + defaultName + '\\d+/']))
    name = '(' + name + ')';
  name = name.replace(/◇|◊|🔶|🔷|🔸|🔹/g, 'O');
  if (name === defaultName)
    name += parseInt(user.id?.slice(-3), 16);
  return name;
};
var getUserIcon = user => (user.isAlternateCharacter && characters[user.characterId + '_alt'] ? characters[user.characterId + '_alt'] : characters[user.characterId]) || {
  src: 'https://play.gikopoi.com/characters/' + user.characterId + '/front-standing.png',
  style: 'max-width:100%;max-height:100%'
};
onmessage = function (event) {
  var args = event.data;
  switch (args[0]) {
    case 'server-update-current-room-state':
      document.body.className = 'ready';
      users = {};
      args[1]?.connectedUsers?.forEach(u => users[u.id] = u);
      break;
    case 'server-user-joined-room':
      users[args[1].id] = args[1];
      break;
    case 'server-user-left-room':
      delete users[args[1]];
      break;
    case 'server-character-changed':
      var user = users[args[1]];
      if (user) {
        Object.assign(user, {characterId: args[2], isAlternateCharacter: args[3]});
        var name = getUserName(user);
        var p = rank.find(p => p.name === name);
        if (p) {
          var icon = getUserIcon(user);
          var img = p.playerElement.querySelector('img');
          img.src = icon.src;
          img.setAttribute('style', icon.style);
        }
      }
      break;
    case 'server-bubble-position':
      if (!current?.quiz?.choice)
        break;
      args[2] = {left: 1, up: 2, down: 3, right: 4}[args[2]];
    case 'server-msg':
      if (elements.main.className !== 'quiz' || !args[2] || !current.time)
        return;
      if (current.quiz.choice) {
        if (/^[1234]$/.test(args[2]))
          args[2] = '↖↗↙↘'[args[2] - 1];
        else
          return;
      }
      var user = users[args[1]] || {name: '', characterId: 'giko'};
      var name = getUserName(user);
      if (current.qualified.includes(name))
        return;
      var p = rank.find(p => p.name === name);
      if (!p) {
        var icon = getUserIcon(user);
        var playerElement = elements.players.appendChild(document.createElement('div'));
        playerElement.style.setProperty('--rank', rank.length);
        playerElement.className = 'player';
        playerElement.innerHTML = `<figure><img src="${icon.src}" style="${icon.style}"></figure>`;
        playerElement.appendChild(document.createElement('p')).textContent = name;
        var pointElement = playerElement.appendChild(document.createElement('p'));
        pointElement.className = 'point';
        var ansElement = playerElement.appendChild(document.createElement('p'));
        rank.push(p = {
          name,
          playerElement,
          pointElement,
          ansElement,
          point: 0,
          setRank(i) {
            this.playerElement.style.setProperty('--rank', i);
          },
          displayAnswer() {
            if (this.correct) {
              this.playerElement.classList.add('correct');
              var point = current.quiz.point;
              if (+settings.maxAnswers > 1) {
                if (this.order === 0 && +settings.firstBonus > 1)
                  point *= settings.firstBonus;
                else if (this.order === 1 && +settings.secondBonus > 1 && +settings.firstBonus > +settings.secondBonus)
                  point *= settings.secondBonus;
              }
              this.point = Math.round((this.point + point) * 10) / 10;
            } else if (this.answer)
              this.playerElement.classList.add('incorrect');
            this.pointElement.textContent = this.point + t('', '点');
            this.ansElement.textContent = current.quiz.answers?.[this.answer] || this.answer;
            this.answer = '';
          },
          hideAnswer() {
            this.correct = false;
            this.ansElement.textContent = '';
            this.playerElement.className = 'player';
          }
        });
      }
      if ((p.correct = current.quiz.correct.includes(normalize(p.answer = args[2]))) && !current.quiz.choice) {
        p.order = current.qualified.length;
        current.qualified.push(name);
        if (current.qualified.length >= +settings.maxAnswers)
          close();
      }
      if (current.quiz.choice)
        p.ansElement.textContent = '回答済';
      break;
  }
};
loadSettings();
Array.from(document.querySelectorAll('#settings input[type=text]')).forEach(input => input.onkeyup?.());
Array.from(document.querySelectorAll('#settings input[type=checkbox]')).forEach(input => input.onclick?.());
if (window.name) {
  postMessage(['server-update-current-room-state', {connectedUsers: JSON.parse(name)}]);
  name = '';
}
(async () => load(await (await fetch('quiz-sample/' + encodeURIComponent(t('english.txt', '246題.txt')))).text()))();
var version = 6;
update('version');
if (location.protocol === 'file:')
  postMessage(["server-update-current-room-state",{"connectedUsers":[{"id":"0","name":"test1","characterId":"golden_furoshiki"},{"id":"1","name":"test2","characterId":"naitoapple"},{"id":"2","name":"test3","characterId":"furoshiki_shobon"},{"id":"3","name":"test4","characterId":"naito"},{"id":"4","name":"test5","characterId":"dark_naito_walking"}]}]);
/*
postMessage(["server-msg","0","あ"]);
postMessage(["server-msg","1","い"]);
postMessage(["server-msg","2","う"]);
postMessage(["server-msg","3","え"]);
postMessage(["server-msg","4","お"]);

postMessage(["server-bubble-position","0","up"]);
postMessage(["server-bubble-position","1","down"]);
postMessage(["server-bubble-position","2","left"]);
postMessage(["server-bubble-position","3","right"]);
postMessage(["server-bubble-position","4","right"]);
*/
