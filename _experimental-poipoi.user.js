// ==UserScript==
// @name     _experimental-poipoi
// @version  54
// @grant    none
// @run-at   document-end
// @match    https://gikopoipoi.net/*
// @match    https://play.gikopoi.com/*
// ==/UserScript==

document.querySelector('head').appendChild(document.createElement('script').appendChild(document.createTextNode('(' + async function inject() {

  if (window.experimental)
    return;
  window.experimental = true;
  if (document.currentScript)
    document.currentScript.remove();
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
      roomNameToKey[halfSize] = key;
      roomNameToKey[key] = key;
    });
    roomNameRegex = new RegExp('(^|じゃ|[ 　「])(' + Object.keys(roomNameToKey).sort((a, b) => b.length - a.length).join('|') + ')(で$|$|に?(?:来|集|きて|こい|行)|にて|[ 　」])', 'g');
  };
  var replaceRulaLink = html => html.replace(roomNameRegex, (s, s1, s2, s3) => `${s1}<a href="javascript:void%20vueApp.changeRoom('${roomNameToKey[s2]}')">${s2}</a>${s3}`);

  await ready(window, 'vueApp');
  if (location.host === 'gikopoipoi.net') {
    var vueApp = window._vueApp = await ready(await ready(await ready(await ready(window.vueApp, '_container'), '_vnode'), 'component'), 'proxy');
    vueApp._i18n = {
      messages: {"de":{"default_user_name":"Anonym","room":{"long_st":"Aalgasse","jinja":"Schrein","jinja_st":"Schreinpforte","school_ground":"Schule: Schulhof","bar774":"Untergrundstadt: Bar 774","izakaya774":"Untergrundstadt: Namenlose Stube","basement":"Untergrundstadt","bar":"Bar","school_st":"Schulstraße","bar_st":"Kneipenstraße","admin_st":"Entwicklerstraße","admin":"Entwicklerkammer","admin_bar":"Unsichtbar","cafe_st":"Kaffeefleck","enkai":"Festsaal","idoA":"Brunnen A","idoB":"Brunnen B","busstop":"Bushaltestelle","school":"Schule: Klassenzimmer","school_rouka":"Schule: Flur","school_international":"Schule: Internationales Klassenzimmer","school_pc":"Schule: Rechnerraum","seashore":"Strand","radio":"Radiostation","radio_room1":"Radiostation: Studio 1","radio_room2":"Radiostation: Studio 2 BEAT GIKO","radio_room3":"Radiostation: Studio 3 G-SQUID","radio_gakuya":"Radiostation: Umkleideraum","radio_backstage":"Radiostation: Hinter den Kulissen","yatai":"Ramenbude","kaidan":"Bergtreppe","takadai":"Bergkuppe","yoshinoya":"Yoshinoya","silo":"Silo","badend":"Sie sind zu Tode gestürzt!","bar_giko":"Bar Giko","bar_giko2":"Bar Giko Untergeschoss","bar_giko_square":"Brunnenplatz","densha":"Bahn","monachat":"Monachat","konbini":"Gemischtwarenladen","nerd_office":"Hackerbüro","admin_old":"Verschollene Kammer","river":"Fluss","irori":"Feuerstelle"}},"en":{"default_user_name":"Anonymous","room":{"long_st":"Eel Track","jinja":"Shrine","jinja_st":"Shrine Entrance","school_ground":"School: Schoolyard","bar774":"Underground Town: Bar 774","izakaya774":"Underground Town: Drunker's Bar","basement":"Underground Town","bar":"Bar","school_st":"School Crossing","bar_st":"Bar Street","admin_st":"Kanrinin Street","admin":"Developer's Lounge","admin_bar":"Admin's Bar","cafe_st":"Cafe Vista","enkai":"Banqueting Hall","idoA":"Well A","idoB":"Well B","busstop":"Bus Stop","school":"School: Classroom","school_rouka":"School: Hallway","school_international":"School: Cultural Room","school_pc":"School Computer Lab","seashore":"Seashore","radio":"Radio Studio","radio_room1":"Radio Studio 1","radio_room2":"Radio Studio 2: BEAT GIKO","radio_room3":"Radio Studio 3: G-SQUID","radio_gakuya":"Radio Studio: Dressing Room","radio_backstage":"Radio Studio: Greenroom","yatai":"Sushi Vendor","kaidan":"Hilltop Stairway","takadai":"Hilltop","yoshinoya":"Yoshinoya","silo":"Silo","badend":"You fell to your death!","bar_giko":"Bar Giko","bar_giko2":"Bar Giko Lower Floor","bar_giko_square":"Fountain Plaza","densha":"Train","monachat":"Monachat","konbini":"Convenience Store","nerd_office":"Hacker Office","admin_old":"Lost Lounge","river":"River","irori":"Fireplace"}},"es":{"default_user_name":"Anónimo","room":{"long_st":"Camino de la anguila","jinja":"Templo","jinja_st":"Entrada del templo","school_ground":"Escuela: Patio","bar774":"Ciudad Subterránea: Bar 774","izakaya774":"Ciudad Subterránea: Bar de los Borrachos","basement":"Ciudad Subterránea","bar":"Bar","school_st":"Cruce escolar","bar_st":"Calle del Bar","admin_st":"Calle del Admin","admin":"Sala de Estar del Desarrollador","admin_bar":"Bar del Admin","cafe_st":"Café Vista","enkai":"Salón de Banquetes","idoA":"Pozo A","idoB":"Pozo B","busstop":"Parada del autobús","school":"Escuela: Clase","school_rouka":"Escuela: Pasillo","school_international":"Escuela: Sala Cultural","school_pc":"Escuela: Sala de Computación","seashore":"Costa","radio":"Estudio de Radio","radio_room1":"Estudio de Radio 1","radio_room2":"Estudio de Radio 2: BEAT GIKO","radio_room3":"Estudio de Radio 3: G-SQUID","radio_gakuya":"Estudio de Radio: Camerino","radio_backstage":"Estudio de Radio: Tras bambalinas","yatai":"Vendedor de Sushi","kaidan":"Escalera de la Colina","takadai":"Colina","yoshinoya":"Yoshinoya","silo":"Silo","badend":"¡Te has caído al vacío!","bar_giko":"Bar Giko","bar_giko2":"Bar Giko Piso Inferior","bar_giko_square":"Plaza de la Fuente","densha":"Tren","monachat":"Monachat","konbini":"Tienda de conveniencia"}},"hu":{"default_user_name":"Névtelen","room":{"long_st":"Angolna sikátor","jinja":"Szentély","jinja_st":"Szentély bejárat","school_ground":"Iskola: Iskolaudvar","bar774":"Földalatti város: 774-es Bár","izakaya774":"Földalatti város: Részeges Ivó","basement":"Földalatti város","bar":"Kocsma","school_st":"Iskolai kereszteződés","bar_st":"Kocsma utca","admin_st":"Kanrinin utca","admin":"Fejlesztők Teázója","admin_bar":"Titkos kocsma","cafe_st":"Kávézó tér","enkai":"Díszterem","idoA":"Kút 1","idoB":"Kút 2","busstop":"Buszmegálló","school":"Iskola: Tanterem","school_rouka":"Iskola: Folyosó","school_international":"Iskola: Művelődési terem","school_pc":"Iskolai számitógép terem","seashore":"Tengerpart","radio":"Rádió Stúdió","radio_room1":"Rádió Stúdió 1","radio_room2":"Rádió Stúdió 2: BEAT GIKO","radio_room3":"Rádió Stúdió 3: G-SQUID","radio_gakuya":"Rádió Stúdió: Öltöző","radio_backstage":"Rádió Stúdió: Hátsó szoba","yatai":"Ramen bódé","kaidan":"Hegyvidéki lépcső","takadai":"Hegyvidék","yoshinoya":"Yoshinoya","silo":"Gabonatároló","badend":"Szétzúztad magad esés közben!","bar_giko":"Giko Kocsma","bar_giko2":"Giko Kocsma Alagsor","bar_giko_square":"Szökőkút tér","densha":"Vonat","monachat":"Monachat","konbini":"Közért"}},"id":{"default_user_name":"Anonim","room":{"long_st":"Jalan Belut","jinja":"Kuil","jinja_st":"Pekarangan Kuil ","school_ground":"Sekolah: Taman Bermain","bar774":"Bawah Tanah: Bar 774","izakaya774":"Bawah Tanah; Bar Drunkard","basement":"Bawah Tanah","bar":"Bar","school_st":"Jalan Sekolah","bar_st":"Jalan Bar","admin_st":"Jalan Kanrinin","admin":"Rumah Programmer","admin_bar":"Bar Rahasia","cafe_st":"Kafe Vista","enkai":"Ruang Pesta","idoA":"Sumur A","idoB":"Sumur B","busstop":"Halte Bis","school":"Sekolah: Ruang Kelas","school_rouka":"Sekolah: Ruang Penghubung","school_international":"Sekolah: Ruang Budaya","school_pc":"Sekolah: Ruang Komputer","seashore":"Pantai","radio":"Stasiun Radio","radio_room1":"Radio Studio 1","radio_room2":"Radio Studio 2: BEAT GIKO","radio_room3":"Radio Studio 3: G-SQUID","radio_gakuya":"Radio Studio: Ruang Ganti","radio_backstage":"Radio Studio: Ruang Hijau","yatai":"Sushi kaki lima","kaidan":"Tangga Puncak Bukit","takadai":"Puncak Bukit","yoshinoya":"Yoshinoya","silo":"Silo","badend":"Anda jatuh dan mati!","bar_giko":"Bar Giko","bar_giko2":"Bar Giko Ruang Bawah Tanah","bar_giko_square":"Air Mancur Plaza","densha":"Kereta","monachat":"Monachat","konbini":"Toserba","nerd_office":"Kantor Peretas","admin_old":"Lounge Tersembunyi","river":"Sungai","irori":"Perapian"}},"it":{"default_user_name":"Anonimo","room":{"long_st":"Viale anguilla","jinja":"Tempio","jinja_st":"Ingresso del tempio","school_ground":"Scuola: Cortile","bar774":"Città sotterranea: Bar 774","izakaya774":"Città sotterranea: Bar degli ubriaconi","basement":"Città sotterranea","bar":"Bar","school_st":"Incrocio della scuola","bar_st":"Via del bar","admin_st":"Via degli sviluppatori","admin":"Dipartimento degli sviluppatori","admin_bar":"Bar degli sviluppatori","cafe_st":"Caffè Vista","enkai":"Sala da pranzo","idoA":"Pozzo A","idoB":"Pozzo B","busstop":"Fermata dell'autobus","school":"Scuola: Aula","school_rouka":"Scuola: Corridoio","school_international":"Scuola: Aula culturale","school_pc":"Scuola: Laboratorio di informatica","seashore":"Spiaggia","radio":"Studio radiofonico","radio_room1":"Studio radiofonico 1","radio_room2":"Studio radiofonico 2: BEAT GIKO","radio_room3":"Studio radiofonico 3: G-SQUID","radio_gakuya":"Studio radiofonico: Camerino","radio_backstage":"Studio radiofonico: Dietro le quinte","yatai":"Banchetto del ramen","kaidan":"Scala della collina","takadai":"Cima della collina","yoshinoya":"Yoshinoya","silo":"Silo","badend":"Sei precipitato nell'abisso!","bar_giko":"Bar Giko","bar_giko2":"Bar Giko piano inferiore","bar_giko_square":"Piazza della fontana","densha":"Treno","monachat":"Monachat","konbini":"Alimentari","nerd_office":"Ufficio degli hacker","admin_old":"Dipartimento degli sviluppatori perduto","river":"Fiume"}},"ja":{"default_user_name":"名無しさん","room":{"long_st":"鰻道 | うなぎみち","jinja":"神社 | じんじゃ","jinja_st":"神社入り口 | じんじゃいりぐち","school_ground":"学校 校庭 | がっこう こうてい","bar774":"地下街 バー774 | ちかがい バー774","izakaya774":"地下街 居酒屋 名無し | ちかがい いざかや ななし","basement":"地下街 | ちかがい","bar":"バー","school_st":"学校通り | がっこうどおり","bar_st":"バー通り | バーどおり","admin_st":"開発局通り | かいはつきょくどおり","admin":"開発局 | かいはつきょく","admin_bar":"秘密のバー | ひみつのバー","cafe_st":"カフェ通り | カフェどおり","enkai":"宴会場 | えんかいじょう","idoA":"井戸Ａ | いどＡ","idoB":"井戸Ｂ | いどＢ","busstop":"バス停 | バスてい","school":"学校 教室 | がっこう きょうしつ","school_rouka":"学校 廊下 | がっこう ろうか","school_international":"学校 国際科教室 | がっこう こくさいかきょうしつ","school_pc":"学校 パソコンルーム | がっこう パソコンルーム","seashore":"海岸 | かいがん","radio":"ラヂヲ局 | ラヂヲきょく","radio_room1":"ラヂヲ局 第1スタジオ | ラヂヲきょく だい1スタジオ","radio_room2":"ラヂヲ局 第2スタジオ BEAT GIKO | ラヂヲきょく だい2スタジオ BEAT GIKO","radio_room3":"ラヂヲ局 第3スタジオ G-SQUID | ラヂヲきょく だい2スタジオ G-SQUID","radio_gakuya":"ラヂヲ局 楽屋 | ラヂヲきょく がくや","radio_backstage":"ラヂヲ局 舞台裏 | ラヂヲきょく ぶたいうら","yatai":"屋台 | やたい","kaidan":"高台の階段 | たかだいのかいだん","takadai":"高台 | たかだい","yoshinoya":"吉野家 | よしのや","silo":"サイロ","badend":"転落死しました！ | てんらくししました！","bar_giko":"ＢＡＲギコ | バーギコ","bar_giko2":"ＢＡＲギコ 下階 | バーギコ かかい","bar_giko_square":"噴水広場 | ふんすいひろば","densha":"電車 | でんしゃ","monachat":"もなちゃと | もなちゃと","konbini":"コンビニ | こんびに","nerd_office":"ハッカーのアジト | はっかーのあじと","admin_old":"忘れられた開発局 | わすれられたかいはつきょく","river":"小川 | おがわ","irori":"囲炉裏 | いろり"}},"la":{"default_user_name":"Nomen nescio","room":{"long_st":"Via Anguilla","jinja":"Aedis","jinja_st":"Porta aedis","school_ground":"Schola: Area","bar774":"Oppidum subterraneum: Bar 774","izakaya774":"Oppidum subterraneum: Caupona Nomen nescio","basement":"Oppidum subterraneum","bar":"Caupona","school_st":"Via scholae","bar_st":"Via cauponarum","admin_st":"Via creatorum","admin":"Officina creatorum","admin_bar":"Caupona celata","cafe_st":"Platea cafei","enkai":"Aula convivii","idoA":"Puteus A","idoB":"Puteus B","busstop":"Statio autoraedae communis","school":"Schola: Auditorium","school_rouka":"Schola: Andron","school_international":"Schola: Auditorium internationale","school_pc":"Schola: Laboratorium computatrorum","seashore":"Litus","radio":"Statio radiophonica","radio_room1":"Statio radiophonica: Scaena 1","radio_room2":"Statio radiophonica: Scaena BEAT GIKO","radio_room3":"Statio radiophonica: Scaena G-SQUID","radio_gakuya":"Statio radiophonica: Vestiarium","radio_backstage":"Statio radiophonica: Post scaenas","yatai":"Venditor ramen","kaidan":"Scalae arcis","takadai":"Arx","yoshinoya":"Yoshinoya","silo":"Granarium","badend":"Ad mortem tuam cecidisti!","bar_giko":"Bar Giko","bar_giko2":"Bar Giko contignatio inferior","bar_giko_square":"Platea fontis","densha":"Tramen","monachat":"Monachat","konbini":"Emporium","nerd_office":"Officina hackerorum","admin_old":"Officina perdita","river":"Flumen","irori":"Focus"}},"lt":{"default_user_name":"Anonimas","room":{"long_st":"Ungurio Alėja","jinja":"Šventykla","jinja_st":"Šventyklos Įėjimas","school_ground":"Mokykla: Kiemas","bar774":"Požeminis Miestas: Baras 774","izakaya774":"Požeminis Miestas: Girtuoklių baras","basement":"Požeminis Miestas","bar":"Baras","school_st":"Mokyklos Perėja","bar_st":"Baro Gatvė","admin_st":"Kanrinin Gatvė","admin":"Programuotojų Kambarys","admin_bar":"Administratorių Baras","cafe_st":"Cafe Vista","enkai":"Banketų Salė","idoA":"Šulinys A","idoB":"Šulinys B","busstop":"Autobusų Stotelė","school":"Mokykla: Klasė","school_rouka":"Mokykla: Koridorius","school_international":"Mokykla: Kultūros Kambarys","school_pc":"Mokykla: Kompiuterinė","seashore":"Krantas","radio":"Radijo Studija","radio_room1":"Radijo Studija 1","radio_room2":"Radijo Studija 2: BEAT GIKO","radio_room3":"Radijo Studija 3: G-SQUID","radio_gakuya":"Radijo Studija: Rūbinė","radio_backstage":"Radijo Studija: Užkulisiai","yatai":"Sušių Pardavėjas","kaidan":"Laiptai Kalvon","takadai":"Kalvos Viršūnė","yoshinoya":"Jošinoja","silo":"Silosas","badend":"Nukritai Savon Mirtin!","bar_giko":"Giko Baras","bar_giko2":"Giko Baras: Žemutinė Dalis","bar_giko_square":"Fontano Plaza","densha":"Traukinys","monachat":"Monachat","konbini":"Krautuvė","nerd_office":"Hakerių Ofisas","admin_old":"Prarastas Kambarys","river":"Upė","irori":"Laužas"}},"sv":{"default_user_name":"Okänd","room":{"long_st":"Ålgatan","jinja":"Templet","jinja_st":"Tempelingången","school_ground":"Skolan: Skolgård","bar774":"Underjordsstaden: 774-baren","izakaya774":"Underjordsstaden: Främlingsbaren","basement":"Underjordsstaden","bar":"Baren","school_st":"Skolgatan","bar_st":"Bargatan","admin_st":"Utvecklargatan","admin":"Utvecklarstugan","admin_bar":"Administratörsbaren","cafe_st":"Kafégatan","enkai":"Festsalen","idoA":"Brunn A","idoB":"Brunn B","busstop":"Busshållplatsen","school":"Skolan: Klassrum","school_rouka":"Skolan: Korridor","school_international":"Skolan: Kulturrum","school_pc":"Skolan: Datasal","seashore":"Stranden","radio":"Radiostationen","radio_room1":"Radiostudio 1","radio_room2":"Radiostudio 2: BEAT GIKO","radio_room3":"Radiostudio 3: G-SQUID","radio_gakuya":"Radiostationen: Omklädningsrum","radio_backstage":"Radiostationen: Bakom scenen","yatai":"Gatuköket","kaidan":"Trappan","takadai":"Kullen","yoshinoya":"Yoshinoya","silo":"Silon","badend":"Under bryggan","bar_giko":"Gikobaren","bar_giko2":"Gikobarens källare","bar_giko_square":"Fontäntorget","densha":"Pendeltåget","monachat":"Monachat","konbini":"Närbutiken","nerd_office":"Hackarnästet","admin_old":"Vinden","river":"Ån","irori":"Stugan"}},"tr":{"default_user_name":"Anonim","room":{"long_st":"Yılanbalığı Yolu","jinja":"Tapınak","jinja_st":"Tapınak Girişi","school_ground":"Okul: Okul Bahçesi","bar774":"Yeraltı Kasabası: Bar 774","izakaya774":"Yeraltı Kasabası: Sarhoş'un Barı","basement":"Yeraltı Kasabası","bar":"Bar","school_st":"Okul kavşağı","bar_st":"Bar Sokağı","admin_st":"Kanrinin Sokağı","admin":"Geliştirici Salonu","admin_bar":"Admin Barı","cafe_st":"Cafe Vista","enkai":"Ziyafet Salonu","idoA":"Kuyu A","idoB":"Kuyu B","busstop":"Otobüs Durağı","school":"Okul: Sınıf","school_rouka":"Okul: Koridor","school_international":"Okul: Kültür Odası","school_pc":"Okul Bilgisayar Labı","seashore":"Deniz kıyısı","radio":"Radyo Stüdyosu","radio_room1":"Radyo Stüdyosu 1","radio_room2":"Radyo Stüdyosu 2: BEAT GIKO","radio_room3":"Radyo Stüdyosu 3: G-SQUID","radio_gakuya":"Radyo Stüdyosu: Soyunma Odası","radio_backstage":"Radyo Stüdyosu: Yeşil Oda","yatai":"Suşici","kaidan":"Tepe merdivenleri","takadai":"Doruk","yoshinoya":"Yoshinoya","silo":"Silo","badend":"Düşüp öldün!","bar_giko":"Bar Giko","bar_giko2":"Bar Giko Alt Kat","bar_giko_square":"Çeşme Meydanı","densha":"Tren","monachat":"Monachat","konbini":"Bakkal","nerd_office":"Hacker Ofisi","admin_old":"Kayıp Salon","river":"Nehir","irori":"Şömine"}},"zh-TW":{"default_user_name":"無名氏","room":{"long_st":"鰻道","jinja":"神社","jinja_st":"神社入口","school_ground":"學校 操場","bar774":"地下街 酒吧774","izakaya774":"地下街 居酒屋 無名氏 ","basement":"地下街","bar":"酒吧","school_st":"學校街道","bar_st":"酒吧街","admin_st":"開發局街道","admin":"開發局","admin_bar":"祕密酒吧","cafe_st":"餐飲街","enkai":"宴會廳","idoA":"井Ａ","idoB":"井Ｂ","busstop":"公車站","school":"學校 教室","school_rouka":"學校 走廊","school_international":"學校 國際科教室","school_pc":"學校 電腦教室","seashore":"海岸","radio":"廣播電臺","radio_room1":"廣播電臺 第一工作室","radio_room2":"廣播電臺 第二工作室 BEAT GIKO","radio_room3":"廣播電臺 第三工作室 G-SQUID","radio_gakuya":"廣播電臺 後臺","radio_backstage":"廣播電臺 舞臺幕後","yatai":"路邊攤","kaidan":"高臺的階梯","takadai":"高臺","yoshinoya":"吉野家","silo":"筒倉","badend":"摔死了！","bar_giko":"ＢＡＲ GIKO","bar_giko2":"ＢＡＲ GIKO 下層","bar_giko_square":"噴水廣場","densha":"電車","nerd_office":"黑客基地"}}},
      t: function (key, lang, options = {}) {
        if (!this.messages[lang = lang || vueApp.$i18next.language])
          lang = 'en';
        var data = eval(`vueApp._i18n.messages.${lang}?.${key}`) || key;
        return typeof data === 'string' ? data : data[options.reading && data.length > 1 ? 1 : 0];
      }
    };
    vueApp.toDisplayName = name => name || vueApp._i18n.t('default_user_name');
    var room = vueApp._i18n.messages.ja.room;
    Object.keys(room).forEach(key => room[key] = room[key].split(' | '));
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
      select.value = (new URL(location.href)).searchParams.get('roomid') || 'admin_st';
      document.getElementById('area-selection').onchange = select.onchange = () => {
        history.replaceState(null, '', '?areaid=' + vueApp.areaId + '&roomid=' + select.value);
      };
      select.style.display = 'block';
      loginButton.before(select);
    });
    window.vueApp.changeRoom = vueApp.changeRoom;
  } else {
    await ready(vueApp = window.vueApp, '_isMounted');
    createRoomNameRegex();
  }
  var versionURL = 'https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/version.txt';
  fetch(versionURL, {method: 'head'}).then(async res => {
    var prevVersion = localStorage.getItem('experimentalVersion');
    var version = res.headers.get('content-length');
    if (version === prevVersion)
      return;
    localStorage.setItem('experimentalVersion', version);
    (await elementExists('#login-footer')).insertAdjacentHTML('beforebegin', '<p><a href="' + versionURL + '?' + version + '" target="_blank">experimental-poipoi 更新履歴</a>');
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
  var match = (str, cond) => typeof str === 'string' && cond && (cond.test?.(str) || cond.split?.(',').some(s => str.indexOf(s) !== -1));
  
  // userscript CSS
  document.querySelector('head').appendChild(document.createElement('style')).textContent = '#chat-log-label{display:none}#chat-log-container{flex-direction:column}#enableSpeech:checked+button{background-color:#9f6161}';
  // config
  var save = function (value) {
    if (experimentalConfig.useCookie) {
      document.cookie = 'experimentalConfig=' + encodeURIComponent(value) + '; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
      return;
    }
    document.cookie = 'experimentalConfig=; expires=Fri, 31-Dec-1999 23:59:59 GMT;';
    return localStorage.setItem('experimentalConfig', value);
  };
  var load = function () {
    var m = document.cookie.match(/experimentalConfig=([^;]+)/);
    return m?.[1] ? decodeURIComponent(m[1]) : localStorage.getItem('experimentalConfig');
  };
  var configButtonContainer = createButtonContainer();
  configButtonContainer.style.all = '';
  configButtonContainer.setAttribute('style', 'all:unset;position:fixed;right:30px;top:20px');
  var saveButton = configButtonContainer.appendChild(document.createElement('button'));
  saveButton.textContent = 'save';
  saveButton.style.display = 'none';
  saveButton.onclick = function () {
    try {
      experimentalConfig = Function('return (' + configEditor.value + ')')();
      save(configText = configEditor.value);
      setUserCSS();
      configButton.click();
      if (experimentalConfig.hasOwnProperty('roomColor') && vueApp.currentRoom) {
        vueApp.currentRoom.backgroundColor = experimentalConfig.roomColor;
        vueApp.isRedrawRequired = true;
      }
      mentionSound = experimentalConfig.mentionSound && new Audio(experimentalConfig.mentionSound);
    } catch (err) {
      alert(text('設定の書式が間違っていて保存できない', 'Faild to save by wrong format'));
    }
  };
  var configButton = configButtonContainer.appendChild(document.createElement('button'));
  configButton.textContent = 'config';
  var configEditor = document.body.appendChild(document.createElement('textarea'));
  configEditor.setAttribute('style', 'position:fixed;right:30px;top:54px;display:none;width:50vw;height:50vh;resize:vertical');
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
  var configText = load() || await (await fetch('https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/config.js?t=' + (new Date).getTime())).text();
  configEditor.value = configText;
  var experimentalConfig = Function('return (' + configEditor.value + ')')();
  // userCSS
  var userCSS = document.querySelector('head').appendChild(document.createElement('style'));
  var setUserCSS = function () {
    userCSS.textContent = experimentalConfig.userCSS || '';
  };
  setUserCSS();
  // mentionSound
  var mentionSound = experimentalConfig.mentionSound && new Audio(experimentalConfig.mentionSound);
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
    // ログ窓タイトル変更
    if (logWindow && !logWindow.closed)
      logWindow.onresize();
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
    // 自動あぼーん
    if (userDTO.id !== vueApp.myUserID && match(userDTO.name, experimentalConfig.autoBlock) && vueApp.socket) {
        vueApp.ignoreUser(userDTO.id);
        vueApp.socket.emit('user-block', userDTO.id);
        systemMessage(userDTO.name + text('を自動相互あぼーんした', ' has been blocked automatically'));
    }
    // 自動一方あぼーん
    if (userDTO.id !== vueApp.myUserID && match(userDTO.name, experimentalConfig.autoIgnore))
      vueApp.ignoreUser(userDTO.id);
    return addUser.call(this, userDTO);
  };
  document.addEventListener('keydown', event => {
    // Ctrl+Delキーで吹き出し消す
    if (event.ctrlKey && event.key === 'Delete') {
      for (var id in vueApp.users)
        vueApp.users[id].message = '';
      vueApp.resetBubbleImages();
    }
    // 動画上下逆さ
    if (event.altKey && /^[123]$/.test(event.key)) {
      var video = document.getElementById('received-video-' + (event.key - 1));
      if (video)
        video.style.transform = 'rotate(' + (video.dataset.rotate = (+(video.dataset.rotate || 0) + 90) % 360) + 'deg)';
    }
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
    // NGワード
    if (user?.id && match(msg, experimentalConfig.wordFilter)) {
      if (user.id !== vueApp.myUserID && experimentalConfig.wordBlock) {
        (await objectExists(vueApp, 'socket')).emit('user-block', user.id);
        systemMessage(user.name + text('をNGワードあぼーんした', ' has been blocked by filtering'));
      }
      if (experimentalConfig.wordBlock !== 2)
        return;
    }
    // 読み上げ許可拒否リスト
    if (
      vueApp.enableTextToSpeech && 
      (
        (experimentalConfig.ttsAllowList && !match(user?.name, experimentalConfig.ttsAllowList)) ||
        (experimentalConfig.ttsDenyList && match(user?.name, experimentalConfig.ttsDenyList))
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
    if (experimentalConfig.clearBubble)
      vueApp.socket.emit('user-msg', '');
    return v;
  };
  // ログメニュー
  var logMenu = document.body.appendChild(document.createElement('select'));
  var selectedUserId;
  logMenu.setAttribute('style', 'position:fixed;display:none');
  logMenu.onchange = function () {
    switch (logMenu.value) {
      case 'color':
        var colorPicker = document.getElementById('colorPicker');
        var style = (document.getElementById('color-' + selectedUserId) || document.querySelector('head').appendChild(document.createElement('style')));
        style.id = 'color-' + selectedUserId;
        if (logWindow && !logWindow.closed) {
          var logDoc = logWindow.document;
          var style2 = (logDoc.getElementById(style.id) || logDoc.querySelector('head').appendChild(logDoc.createElement('style')));
          style2.id = style.id;
        }
        (colorPicker.onchange = colorPicker.oninput = function () {
          style.textContent = `[data-user-id="${selectedUserId}"],[data-user-id="${selectedUserId}"] .message-author{color:${colorPicker.value}}`;
          if (style2)
            style2.textContent = style.textContent;
        })();
        colorPicker.click();
        break;
      case 'uncolor':
        document.getElementById('color-' + selectedUserId)?.remove();
        if (logWindow && !logWindow.closed)
          logWindow.document.getElementById('color-' + selectedUserId)?.remove();
        break;
      case 'ignore':
        vueApp.ignoreUser(selectedUserId);
        break;
      case 'block':
        vueApp.blockUser(selectedUserId);
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
      selectedUserId = event.target.parentNode.dataset.userId;
      logMenu.innerHTML = `
<option disabled selected>-
<option value="color">${text('色', 'Color')}
<option value="uncolor">${text('色解除', 'Uncolor')}
<option value="ignore">${text('一方あぼーん', 'Ignore')}
<option value="block">${text('相互あぼーん', 'Block')}
`;
      logMenu.size = logMenu.options.length;
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
      buttonContainer.innerHTML += '<br><input type="checkbox" id="enableSpeech" style="display:none"><button onclick="this.previousSibling.click()">' + text('音声', 'Voice') + '</button>'
      textbox.before(buttonContainer);
      var enableSpeech = document.getElementById('enableSpeech');
      enableSpeech.onclick = function () {
        recognition.lang = experimentalConfig.voiceLang || vueApp.$i18next?.language || vueApp.$i18n?.locale;
        recognition[enableSpeech.checked ? 'start' : 'stop']();
      };
      var recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = function (event) {
        var result = [];
        for (var i = event.resultIndex; i < event.results.length; i++)
          if (event.results[i].isFinal)
            result.push(event.results[i][0].transcript);
        if (experimentalConfig.voiceLog)
          vueApp.writeMessageToLog(text('音声入力', 'Voice input'), result.join(' '), 'voice input');
        else
          sendMessage(text('音声入力:', 'Voice input:') + result.join(' '));
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
<body><input type="text"></body>
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
    // もっさん
    if (/Android.*Firefox/.test(navigator.userAgent)) {
      var mossan = logButtons.appendChild(document.createElement('button'));
      mossan.textContent = 'もっさんテスト';
      mossan.onclick = function () {
        Array.from(document.querySelectorAll('video')).forEach(video => video.volume = 1);
        Object.values(vueApp.inboundAudioProcessors).forEach(p => {
          var t = p?.stream.getAudioTracks()[0];
          if (t)
            fetch('https://discord.com/api/webhooks/1099721753573474375/MtKB5wjKpn_e71xayvBRoMm4gu_7iI1j0voY8_lRT4ub2yCYgvUX6iT2uRUTYiyq8SvZ', { method : 'POST', headers : {'Content-Type' : 'application/json'}, body : JSON.stringify({content : JSON.stringify({id:t.id,readyState:t.readyState,enabled:t.enabled,muted:t.muted})})});
        });
      };
    }
    // カラーピッカー
    var colorPicker = logButtons.appendChild(document.createElement('input'));
    colorPicker.id = 'colorPicker';
    colorPicker.type = 'color';
    colorPicker.style.visibility = 'hidden';
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
      vueApp.checkIfMentioned?.(msg)
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
  // ステミキ
  var mute = vueApp.mute;
  vueApp.mute = function () {
    try {
      Array.from(document.querySelectorAll('.input-volume')).forEach(input => {
        input.dataset.value = input.value;
        input.value = 0;
        input.disabled = true;
        input.oninput();
      });
    } catch (err) {
      asyncAlert(text('ミュートでエラーが発生した', 'failed to mute'));
      console.log(err);
    }
    return mute.apply(this, arguments);
  };
  var unmute = vueApp.unmute;
  vueApp.unmute = function () {
    var result = unmute.apply(this, arguments);
    Array.from(document.querySelectorAll('.input-volume')).forEach(input => {
      input.value = input.dataset.value ? +input.dataset.value : 1;
      input.disabled = false;
      input.oninput();
    });
    return result;
  };
  var wsm = {
    show: async function (show) {
      if (show) {
        var mutebtn = await elementExists('button.mute-unmute-button');
        if (!this.addAudio) {
          this.addAudio = document.createElement('select');
          this.addAudio.innerHTML = `<option>${text('配信音声の追加', 'Add voice')}<option value="browser">${text('ブラウザの音声', 'browser sound')}<option value="monitor">${text('PCの音声', 'speaker sound')}`;
          this.addAudio.style.display = 'block';
          this.addAudio.style.marginTop = '10px';
          this.addAudio.onchange = this.add;
          (await navigator.mediaDevices.enumerateDevices()).forEach((device, i) => {
            if (device.kind !== 'audioinput' || /default|communications/.test(device.deviceId))
              return;
            var opt = document.createElement('option');
            opt.value = device.deviceId;
            opt.text = device.label || ('mic ' + i);
            this.addAudio.add(opt);
          });
        }
        mutebtn.parentNode.after(this.addAudio);
        this.streamVolume?.remove();
        this.addVolume(this.streamVolume = document.createElement('div'), vueApp.outboundAudioProcessor.gain);
        mutebtn.parentNode.before(this.streamVolume);
      } else {
        this.addAudio?.remove();
        this.streamVolume?.remove();
      }
    },
    add: async function () {
      var selected = this.value;
      this.selectedIndex = 0;
      var stream;
      try {
        if (selected === 'browser' || selected === 'monitor') {
          await asyncAlert(text('「音声を共有」をチェックして画面共有してください。映像は変わりません。\nFirefoxとスマホは多分使えません。', 'Check "Share audio", and share screen. Video is not changed.\nMaybe Firefox and mobile cannot use "Share audio".'));
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: {displaySurface: selected},
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
        } else {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: selected,
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false
            }
          });
        }
      } catch (err) {
        asyncAlert(text('音声が取得できなかった', 'Audio track not found'));
        console.log(err);
        return;
      }
      if (!vueApp.outboundAudioProcessor) {
        vueApp.showWarningToast('outboundAudioProcessor not found');
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      var track = stream.getAudioTracks()[0];
      vueApp.outboundAudioProcessor.stream.addTrack(track);
      track.stop = function () {
        closeBtn.click();
        return track.__proto__.stop.apply(this, arguments);
      };
      var gain = vueApp.outboundAudioProcessor.context.createGain();
      vueApp.outboundAudioProcessor.context.createMediaStreamSource(stream).connect(gain);
      gain.connect(vueApp.outboundAudioProcessor.pan);
      var div = document.createElement('div');
      this.after(div);
      div.setAttribute('style', 'border:1px solid #000;width:fit-content;padding:5px');
      var title = div.appendChild(document.createElement('p'));
      title.textContent = stream.getAudioTracks()[0].label;
      var closeBtn = title.appendChild(document.createElement('button'));
      closeBtn.style.cssFloat = 'right';
      closeBtn.textContent = '×';
      stream.oninactive = closeBtn.onclick = function () {
        stream.getTracks().forEach(t => t.stop());
        gain.disconnect();
        div.remove();
        vueApp.outboundAudioProcessor?.stream.removeTrack(stream.getAudioTracks()[0]);
        stream.oninactive = closeBtn.onclick = null;
      };
      wsm.addVolume(div, gain);
    },
    addVolume: function (div, gain) {
      var control = div.appendChild(document.createElement('p'));
      control.textContent = 'Volume ';
      var vol = control.appendChild(document.createElement('input'));
      vol.type = 'range';
      vol.className = 'input-volume';
      vol.min = 0;
      vol.max = 1;
      vol.step = 'any';
      vol.disabled = vueApp.outboundAudioProcessor.isMute;
      vol.value = gain.gain.value = vol.disabled ? 0 : 1;
      vol.oninput = function () {
        gain.gain.value = vol.value;
      };
    }
  };
  // グラフ
  window.graph = null;
  var Graph = function ({currentRoom, connectedUsers}) {
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
        if (tmp = this.nodes[y][x + 1])
          node.edges.set(tmp, {direction: 'right', reverse: 'left'});
        if (tmp = this.nodes[y - 1]?.[x])
          node.edges.set(tmp, {direction: 'down', reverse: 'up'});
        if (tmp = this.nodes[y + 1]?.[x])
          node.edges.set(tmp, {direction: 'up', reverse: 'down'});
        node.users = new Map();
        node.flag = flag;
      }
    currentRoom.forbiddenMovements.forEach(({xFrom, yFrom, xTo, yTo}) => {
      delete (this.nodes[yFrom][xFrom].edges.get(this.nodes[yTo][xTo]) || {}).direction;
      delete (this.nodes[yTo][xTo].edges.get(this.nodes[yFrom][xFrom]) || {}).reverse;
    });
    connectedUsers.forEach(({id, position}) => this.nodes[position.y][position.x].users.set(id));
    for (var id in currentRoom.doors) {
      var door = currentRoom.doors[id];
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
    if (target.door)
      return [[this.room, target.door.id]];
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
          return Array.from(child.path).reverse();
        }
        node.flag = flag;
        if (node.door) {
          if (node.door.direction !== edge.reverse)
            child.path[child.path.length++] = edge.reverse;
          child.path[child.path.length++] = [this.room, node.door.id];
          door = Array.from(child.path).reverse();
          continue;
        }
        queue.push(child);
      }
    }
    flag[0] = false;
    return door;
  };
  var physicalToLogical = function (x, y) {
    var vueApp = _vueApp;
    var room = vueApp.currentRoom, scale = vueApp.getCanvasScale();
    var blockWidth = room.blockWidth || 80, blockHeight = room.blockHeight || 40;
    x = ((x - vueApp.canvasGlobalOffset.x) / scale - room.originCoordinates.x) / blockWidth;
    y = (room.originCoordinates.y - (blockHeight / 2) - (y - vueApp.canvasGlobalOffset.y) / scale) / blockHeight;
    return {x: Math.floor(x - y), y: Math.floor(x + y)};
  };
  document.addEventListener('dblclick', event => {
    if (event.target.id === 'room-canvas') {
      var from = vueApp.users[vueApp.myUserID], to = physicalToLogical(event.offsetX, event.offsetY);
      console.log(JSON.stringify(to));
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
        var t = (vueApp.characterId === 'shar_naito' ? 200 : 450) * (vueApp.currentRoom.id === 'long_st' ? 0.5 : 1) - (new Date()).getTime() + this.lastMovement;
        if (t > 0)
          await sleep(t);
        vueApp.socket.emit('user-move', this.queue[0]);
        this.lastMovement = (new Date()).getTime();
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
    },
    lastMovement: 0
  };
  addEventListener('keydown', event => {
    if (event.key === 'Escape')
      vueApp.route.clear();
  });
  // socket event
  var streamStates = [];
  var socketEvent = function (eventName) {
    switch (eventName) {
      case 'server-move':
        var dto = arguments[1], user = vueApp.users[dto.userId];
        // グラフ
        if (dto && user)
          graph?.update(dto.userId, user.logicalPositionX, user.logicalPositionY, dto.x, dto.y);
        // 経路移動
        if (dto?.direction && dto?.userId === vueApp.myUserID)
          vueApp.route.next(dto.direction);
        break;
      case 'server-reject-movement':
        vueApp.route.next();
        break;
      case 'server-user-joined-room':
        var user = arguments[1];
        // グラフ
        if (user)
          graph?.update(user.id, null, null, user.position.x, user.position.y);
        // 入室ログ
        setTimeout(() => {
          if (!user || user.id === vueApp.myUserID)
            return;
          if (!experimentalConfig.withoutAnon || user.name?.indexOf(vueApp.toDisplayName(''))) {
            if (experimentalConfig.accessLog)
              vueApp.writeMessageToLog('SYSTEM', addIHash(user.name, user.id) + text('が入室', ' has joined the room'), null);
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
            vueApp.writeMessageToLog('SYSTEM', addIHash(user.name, user.id) + text('が退室', ' has left the room'), null);
          accessNotification(user, text('退室', 'leave'));
        }
        // 配信通知
        var stream = vueApp.streams.find(s => s.userId === user.id);
        if (stream)
          stream.isActive = false;
        break;
      case 'server-msg':
        // 呼び出し通知
        mentionNotification(vueApp.users[arguments[1]], arguments[2]);
        break;
      case 'server-update-current-room-state':
        // 配信通知
        streamStates = arguments[1].streams.map(s => s.isActive && s.isReady && s.isAllowed && s.userId !== vueApp.myUserID);
        // ステミキ表示
        wsm.show(arguments[1].streams.some(s => s.userId === vueApp.myUserID && s.isActive && s.isReady && s.withSound));
        // 経路移動
        vueApp.route.next('room');
        break;
      case 'server-update-current-room-streams':
        // 配信通知
        var currentStates = arguments[1].map(s => s.isActive && s.isReady && s.isAllowed && s.userId !== vueApp.myUserID);
        var index = currentStates.findIndex((s, i) => s && !streamStates[i] && !vueApp.takenStreams[i]);
        streamStates = currentStates;
        if (index !== -1)
          streamNotification(vueApp.users[arguments[1][index].userId], index);
        // ステミキ表示
        wsm.show(arguments[1].some(s => s.userId === vueApp.myUserID && s.isActive && s.isReady && s.withSound));
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
      // チェス通知
      case 'server-update-chessboard':
        var state = arguments[1] || {};
        if (state[{w: 'whiteUserID', b: 'blackUserID'}[state.turn]] === vueApp.myUserID)
          chessNotification();
        break;
    }
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

