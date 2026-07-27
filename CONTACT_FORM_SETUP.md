# 問い合わせフォーム → Googleスプレッドシート 設定手順

サイトの問い合わせを、次のスプシに1行ずつ保存します。

- スプシ: https://docs.google.com/spreadsheets/d/1VC57n9-kO1y7wOdhDeR2Q0U0KxS9Va7k7Ud-OzBVhHI/edit
- サイト側: `index.html#contact` / `js/contact-form.js`
- GAS側: `gas/inquiry-to-sheet.gs`

## 1. スプシ側

1. 上記スプシを開けるアカウントで開く
2. シート名を **`問い合わせ`** にする（別名にする場合は GAS の `SHEET_NAME` を合わせる）
3. 1行目は自動でヘッダーが入る（空のままでも可）

ヘッダー列:

| 受信日時 | お名前 | メール | 国 / 地域 | 種別 | 作品 / 件名 | メッセージ | 同意 | ページURL | 言語 |

## 2. Google Apps Script

1. スプシメニュー → **拡張機能** → **Apps Script**
2. `gas/inquiry-to-sheet.gs` の内容をすべて貼り付けて保存
3. 右上 **デプロイ** → **新しいデプロイ**
4. 種類: **ウェブアプリ**
5. 設定:
   - 説明: `yokota inquiry`
   - 次のユーザーとして実行: **自分**
   - アクセスできるユーザー: **全員**
6. デプロイ後に表示される **ウェブアプリ URL** をコピー

## 3. サイト側に URL を入れる

`js/contact-form.js` の先頭:

```js
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyc9kfnFczyooOCX_xhNnSTTUq1AnEiauu15q44dBPuY7AIc3VKmzyoZloa8CtWpqpc/exec';
```

（2026-07-27 設定済み。空に戻すと送信時に「設定前です」と表示されます。）

## 4. 動作確認

1. サイトで `#contact` を開き、テスト送信
2. スプシに行が増えることを確認
3. コードを直したあとは、必ず **デプロイ → デプロイを管理 → 編集 → 新バージョン** で再公開

## 5. メール通知

GAS 内（設定済み）:

```js
var ENABLE_EMAIL_NOTIFY = true;
var NOTIFY_TO = 'info@g-knowthyself.com';
var NOTIFY_CC = 'info@g-knowthyself.com, mituyasu100@gmail.com';
```

問い合わせ受信時に上記へ通知メールが飛びます（Reply-To は送信者のメール）。  
初回実行時にメール送信の承認ダイアログが出ます。  
**このファイルを直したあとは、Apps Script 側へ貼り直して「新バージョン」で再デプロイが必要です。**

## 導線

| 場所 | リンク |
| --- | --- |
| トップ Collect セクション | `#contact` |
| Available Works | `?type=available#contact` |
| Private Commission | `?type=commission#contact` |
| 作品ページ（蒼翠） | `../index.html?type=work&work=蒼翠#contact` |

## 注意

- スプシの編集 URL はサイトに載せない（公開するのは GAS の `/exec` URL のみ）
- 個人情報を扱うため、公開前に Privacy Policy 文言の最終確認が必要
- スパム対策として honeypot 欄あり。必要なら後から reCAPTCHA を追加可能
