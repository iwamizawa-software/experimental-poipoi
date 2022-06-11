# experimental-poipoi

[ぽいぽい](https://gikopoipoi.net/)に実験的機能を追加するuserscript

## ライセンス

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png) ](https://creativecommons.org/publicdomain/zero/1.0/deed.ja)

## 導入方法

1. ChromeでTampermonkey ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja), [Firefox](https://addons.mozilla.org/ja/firefox/addon/tampermonkey/))をインストール
2. [experimental-poipoi-config](https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/experimental-poipoi-config.user.js)をインストール
3. [experimental-poipoi](https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/experimental-poipoi.user.js)をインストール

## 設定方法

![experimental-poipoi-configを編集する](https://user-images.githubusercontent.com/65465755/173208412-bea3d38d-2186-4e03-b319-3645ddb5c038.png) 

![通知の許可](https://user-images.githubusercontent.com/65465755/173208424-25fd394f-1a64-42d9-9d90-ccbe50d03acb.png)

## 追加される機能

### 入室時に配信を受信状態する

- 初期値はONでOFFにできる
- 公式採用される予定

![wantToTakeStream](https://user-images.githubusercontent.com/65465755/172407720-f05b7d17-7215-4d43-bb12-c53684cfbd38.png)

### 名無しにナンバリングする

- 名無しさん123のように数字をつける
- 数字は別人であることを保証するものではなく、別人でも重複することがある
- 初期値はONでOFFにできる

![numbering](https://user-images.githubusercontent.com/65465755/172407813-83352ee1-a91f-4e0c-a8b9-a7fbfcbc8214.png)

### Enter1回で吹き出しを消す

- 吹き出しを消すには2回Enterを押す必要があったが1回で消すようになる
- 逆に吹き出しを残したいときは入力欄の横にある発言ボタンを使う
- 初期値はONでOFFにできる

### 呼出通知

- ぽいぽいの設定で名前が呼ばれると呼出音がなる設定にしているときに、右下に通知も表示する
- 初期値はONでOFFにできる
- 通知をクリックすると自動で返信する　初期値は「ｎ」

![mention](https://user-images.githubusercontent.com/65465755/172417648-14007904-a41e-4dda-92cb-feca530b7dee.png)

### 入退室通知

- 入退室を通知する
- 設定は常に通知、アクティブ時のみ通知、非アクティブ時のみ通知、通知しないの4通りあり、初期値はアクティブ時のみ通知

![joined](https://user-images.githubusercontent.com/65465755/172408282-780133f3-fd0f-496a-965a-b50f76d66b47.png)

### 入退室ログ

- ログに入退室を記録する
- 初期値はOFF

### 自動あぼーん

- 設定した名前の人が入ってきたら自動であぼーんする
- 設定はexperimental-poipoi-configを編集する

![autoblock](https://user-images.githubusercontent.com/65465755/172408369-ded6854d-8e7b-4966-aeec-5f9ad2d14f41.png)

### Ctrl+Delキーでマップ上の吹き出しをすべて消す

### ~~動画配信を新しいタブで開く~~

- 動画をダブルクリックすると新しいタブで開く
- 新しいタブのほうでダブルクリックすると全画面になる
- 新しいタブをサブモニターに移動させてダブルクリックすることで、サブモニターで全画面に出来る
- 公式採用されたので削除

### 新しいメッセージボタンの表示

- ログをさかのぼると新しい発言が来ても下にスクロールされないので、それがわかるようにボタンを表示する
- 公式採用される予定

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

![log window](https://user-images.githubusercontent.com/65465755/173202134-20a23428-daf5-498f-9d1a-ccf106c504e6.png)

