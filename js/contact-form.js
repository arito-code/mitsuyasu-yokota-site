/**
 * Inquiry form → Google Apps Script → Spreadsheet
 *
 * After deploying GAS (see CONTACT_FORM_SETUP.md), paste the Web App URL below.
 * Leave empty to show a setup message instead of sending.
 */
(function () {
  const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyzWkEP9Z6bMG-NT1_k_fC7PyueWCpXSVSjD_9vQiR_uICyn7ynBiJJQ9xqbSlwjZWy/exec';

  const TYPE_ALIASES = {
    available: 'available',
    commission: 'commission',
    work: 'work',
    press: 'press',
    gallery: 'gallery',
    interior: 'interior',
    general: 'general',
    purchase: 'available',
    inquire: 'work',
    kyoto: 'general', // legacy link
  };

  function lang() {
    return document.documentElement.lang === 'en' ? 'en' : 'ja';
  }

  function t(ja, en) {
    return lang() === 'en' ? en : ja;
  }

  function applyQueryDefaults(form) {
    const params = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.includes('?') ? location.hash.split('?')[1] : '');
    const type = params.get('type') || hashParams.get('type');
    const work = params.get('work') || hashParams.get('work');
    const typeEl = form.elements.namedItem('type');
    const workEl = form.elements.namedItem('work');
    if (type && typeEl) {
      const normalized = TYPE_ALIASES[String(type).toLowerCase()] || 'general';
      if ([...typeEl.options].some((o) => o.value === normalized)) typeEl.value = normalized;
    }
    if (work && workEl) workEl.value = work;
  }

  function setStatus(el, kind, message) {
    if (!el) return;
    el.hidden = !message;
    el.dataset.kind = kind || '';
    el.textContent = message || '';
  }

  function payloadFromForm(form) {
    const fd = new FormData(form);
    return {
      timestamp: new Date().toISOString(),
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      country: String(fd.get('country') || '').trim(),
      type: String(fd.get('type') || '').trim(),
      work: String(fd.get('work') || '').trim(),
      message: String(fd.get('message') || '').trim(),
      privacy: fd.get('privacy') === 'on' || fd.get('privacy') === 'true',
      honeypot: String(fd.get('website') || '').trim(),
      page: location.href,
      language: lang(),
    };
  }

  function validate(data) {
    if (data.honeypot) return t('送信できませんでした。', 'Unable to send.');
    if (!data.name) return t('お名前を入力してください。', 'Please enter your name.');
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return t('有効なメールアドレスを入力してください。', 'Please enter a valid email address.');
    }
    if (!data.type) return t('お問い合わせ種別を選択してください。', 'Please select an inquiry type.');
    if (!data.message || data.message.length < 5) {
      return t('メッセージを入力してください。', 'Please enter a message.');
    }
    if (!data.privacy) {
      return t('プライバシーへの同意が必要です。', 'Privacy consent is required.');
    }
    return '';
  }

  async function send(data) {
    if (!GAS_WEB_APP_URL) {
      throw new Error('NOT_CONFIGURED');
    }
    const res = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('HTTP_' + res.status);
    let json = null;
    try {
      json = await res.json();
    } catch (_) {
      /* GAS may return plain text on some redirects */
    }
    if (json && json.ok === false) throw new Error(json.error || 'REJECTED');
    return json;
  }

  function initForm(form) {
    const status = document.getElementById('inquiryStatus');
    const submitBtn = form.querySelector('[type="submit"]');
    applyQueryDefaults(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = payloadFromForm(form);
      const err = validate(data);
      if (err) {
        setStatus(status, 'error', err);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = t('送信中…', 'Sending…');
      }
      setStatus(status, 'pending', t('送信しています…', 'Sending…'));

      try {
        await send(data);
        form.reset();
        applyQueryDefaults(form);
        setStatus(
          status,
          'ok',
          t(
            '送信しました。内容を確認のうえ、ご連絡いたします。',
            'Thank you. We have received your inquiry and will respond shortly.'
          )
        );
      } catch (ex) {
        if (ex && ex.message === 'NOT_CONFIGURED') {
          setStatus(
            status,
            'error',
            t(
              'フォーム接続の設定前です。CONTACT_FORM_SETUP.md の手順で GAS URL を設定してください。',
              'Form endpoint is not configured yet. Set the GAS URL per CONTACT_FORM_SETUP.md.'
            )
          );
        } else {
          setStatus(
            status,
            'error',
            t(
              '送信に失敗しました。時間をおいて再度お試しください。',
              'Something went wrong. Please try again in a moment.'
            )
          );
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtn.dataset.label) submitBtn.textContent = submitBtn.dataset.label;
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inquiryForm');
    if (form) initForm(form);
  });
})();
