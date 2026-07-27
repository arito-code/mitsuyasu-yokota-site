/**
 * Mitsuyasu Yokota — Inquiry → Google Spreadsheet
 *
 * Setup: see CONTACT_FORM_SETUP.md
 * Spreadsheet ID (from the sheet URL):
 *   https://docs.google.com/spreadsheets/d/1VC57n9-kO1y7wOdhDeR2Q0U0KxS9Va7k7Ud-OzBVhHI/edit
 */

var SPREADSHEET_ID = '1VC57n9-kO1y7wOdhDeR2Q0U0KxS9Va7k7Ud-OzBVhHI';
var SHEET_NAME = '問い合わせ'; // change if your tab name differs
var ENABLE_EMAIL_NOTIFY = false; // set true + NOTIFY_TO to receive mail
var NOTIFY_TO = ''; // e.g. 'you@example.com'

var HEADERS = [
  '受信日時',
  'お名前',
  'メール',
  '国 / 地域',
  '種別',
  '作品 / 件名',
  'メッセージ',
  '同意',
  'ページURL',
  '言語',
];

function doGet() {
  return json_({ ok: true, service: 'yokota-inquiry' });
}

function doPost(e) {
  try {
    var data = parseBody_(e);
    if (data.honeypot) {
      return json_({ ok: true, skipped: true });
    }
    if (!data.name || !data.email || !data.message) {
      return json_({ ok: false, error: 'missing_fields' });
    }

    var sheet = getSheet_();
    ensureHeaders_(sheet);

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      String(data.name || ''),
      String(data.email || ''),
      String(data.country || ''),
      String(data.type || ''),
      String(data.work || ''),
      String(data.message || ''),
      data.privacy ? 'yes' : 'no',
      String(data.page || ''),
      String(data.language || ''),
    ]);

    if (ENABLE_EMAIL_NOTIFY && NOTIFY_TO) {
      MailApp.sendEmail({
        to: NOTIFY_TO,
        subject: '[Yokota Site] Inquiry: ' + (data.type || 'general') + ' / ' + (data.name || ''),
        body:
          'Name: ' +
          data.name +
          '\nEmail: ' +
          data.email +
          '\nCountry: ' +
          (data.country || '') +
          '\nType: ' +
          (data.type || '') +
          '\nWork: ' +
          (data.work || '') +
          '\n\n' +
          (data.message || '') +
          '\n\nPage: ' +
          (data.page || ''),
      });
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  var raw = e.postData.contents;
  try {
    return JSON.parse(raw);
  } catch (err1) {
    // fallback: form-urlencoded
    var out = {};
    String(raw)
      .split('&')
      .forEach(function (pair) {
        var parts = pair.split('=');
        var k = decodeURIComponent((parts[0] || '').replace(/\+/g, ' '));
        var v = decodeURIComponent((parts.slice(1).join('=') || '').replace(/\+/g, ' '));
        out[k] = v;
      });
    return out;
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
