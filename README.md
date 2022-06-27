# experimental-poipoi

[ぽいぽい](https://gikopoipoi.net/)に実験的機能を追加するuserscript

## ライセンス

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png) ](https://creativecommons.org/publicdomain/zero/1.0/deed.ja)

## 問い合わせ

- ぽいぽいにいる◆PPppppppSIに「せんべい」と話しかける
- Discord　せんべい#1037

## 導入方法

1. ChromeでTampermonkey ([Edge用リンク](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Chrome用リンク](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja), [Firefox用リンク](https://addons.mozilla.org/ja/firefox/addon/tampermonkey/))をインストール
2. [experimental-poipoi](https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/experimental-poipoi.user.js)をインストール

## 設定方法

- [https://iwamizawa-software.github.io/experimental-poipoi/config.htmlを参照](https://iwamizawa-software.github.io/experimental-poipoi/config.html)

### 古い設定方法について

[experimental-poipoi](https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/experimental-poipoi.user.js)が最新であればexperimental-poipoi-configは要らなくなったので消していいです
![delete experimental-poipoi-config](https://user-images.githubusercontent.com/65465755/175765086-b2c797fe-8768-41ab-b533-a3f0afe2226e.png)


## 追加される機能

### 入室時に配信を受信状態する

- 設定でONOFF変えられる

![wantToTakeStream](https://user-images.githubusercontent.com/65465755/172407720-f05b7d17-7215-4d43-bb12-c53684cfbd38.png)

### 名無しにナンバリングする

- 名無しさん123のように数字をつける
- 数字は別人であることを保証するものではなく、別人でも重複することがある
- 設定でONOFF変えられる

![numbering](https://user-images.githubusercontent.com/65465755/172407813-83352ee1-a91f-4e0c-a8b9-a7fbfcbc8214.png)

### 疑似的な白トリップを付ける

- 名無しさん◇qaqEJAのように識別用トリップをつける
- ログインするたびに変わるランダムな値のため、個人の特定には使用できない
- 設定でONOFF変えられる

### Enter1回で吹き出しを消す

- 吹き出しを消すには2回Enterを押す必要があったが1回で消すようになる
- 逆に吹き出しを残したいときは入力欄の横にある発言ボタンを使う
- 設定でONOFF変えられる

### 呼出通知

- ぽいぽいの設定で名前が呼ばれると呼出音がなる設定にしているときに、右下に通知も表示する
- 設定でONOFF変えられる
- 通知をクリックすると自動でぽいぽいの画面に戻れる
- 自動返信も設定できる

![mention](https://user-images.githubusercontent.com/65465755/172417648-14007904-a41e-4dda-92cb-feca530b7dee.png)

### 入退室通知

- 入退室を通知する
- 通知をクリックしても閉じるだけ
- 設定でONOFF変えられる

![joined](https://user-images.githubusercontent.com/65465755/172408282-780133f3-fd0f-496a-965a-b50f76d66b47.png)

### 配信開始通知

- 同じ部屋で配信が開始されたら通知する
- 通知をクリックすると配信を聴ける
- 設定でONOFF変えられる
- 他の部屋の配信通知を実装することは技術的に可能だが個人的な考えにより実装予定なし

![stream](https://user-images.githubusercontent.com/65465755/175776785-6872263a-bc60-4024-bd3c-fc1f56d12410.png)

### 入退室ログ

- ログに入退室を記録する
- 設定でONOFF変えられる

### 自動あぼーん

- 設定した名前の人が入ってきたら自動であぼーんする

![autoblock](https://user-images.githubusercontent.com/65465755/172408369-ded6854d-8e7b-4966-aeec-5f9ad2d14f41.png)

### 新しいメッセージボタンの表示

- ログをさかのぼると新しい発言が来ても下にスクロールされないので、それがわかるようにボタンを表示する

![new message](https://user-images.githubusercontent.com/65465755/172408811-8aea617b-5695-4d5e-8765-f1f651444a68.png)

### ログの名前を右クリックしてメニューを出す

- 指定した人のログを右寄せ、相互あぼーん、右寄せの全解除、ログのクリアができる

![contextmenu](https://user-images.githubusercontent.com/65465755/172408890-942fddbd-20db-4eef-b999-d1d8865d9751.png)

### 音声入力

- 音声にチェックを入れている間音声入力が出来る
- 配信と同時に使えるので配信を聞いてない人にもメッセージを送れる（かもしれない、音声認識が実用レベルか不明）

![voice input](https://user-images.githubusercontent.com/65465755/173175478-65838885-05d2-4463-bab4-1581b9d67b0c.png)

### ログ窓

- ログを新しいウィンドウで開く
- [最前面でポーズ](https://www.vector.co.jp/soft/winnt/util/se468861.html)等の指定ウィンドウを最前面にするツールと組み合わせて使うと作業しながらチャットしやすいと思う

![log window](https://user-images.githubusercontent.com/65465755/175764744-717dc617-44c1-4015-b06a-d126c49ec9ad.png)

### アドレスバーを現在の部屋のURLに書き換え

- 部屋のURLから入ると初期部屋がそこになる

![enkai url](https://user-images.githubusercontent.com/65465755/174309502-16605aaa-8831-4b6c-ba54-470564bea937.png)

### CSSでデザインをカスタマイズできる

- CSSがわかる人は自分で書いたCSSを設定してデザインを変えられる

### その他

- Ctrl+Delキーでマップ上の吹き出しをすべて消す

## 公式採用されて削除された機能

### 動画配信を新しいタブで開く

- 動画をダブルクリックすると新しいタブで開く
- 新しいタブのほうでダブルクリックすると全画面になる
- 新しいタブをサブモニターに移動させてダブルクリックすることで、サブモニターで全画面に出来る

### ログがたまってる状態で名前選択して赤くしても重くならない
