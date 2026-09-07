// Cookie/tracking consent gate for getcharlie.app — shared across all pages
// (this is a plain static site, no build step/shared layout, so every page
// includes this one file instead of loading Google Analytics/Travelpayouts
// Drive directly). Neither script is present as a raw <script> tag in any
// page anymore — both are only ever injected here, and only after consent,
// so the legal basis for both can honestly be "Einwilligung" (Art. 6 Abs. 1
// lit. a DSGVO) instead of "berechtigtes Interesse".
(function () {
  var CONSENT_KEY = 'charlie_cookie_consent';
  var GA_IDS = ['G-WZNDFTVF12', 'G-BG0G0GVDLV'];

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_IDS[0];
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    for (var i = 0; i < GA_IDS.length; i++) gtag('config', GA_IDS[i]);
  }

  function loadDrive() {
    if (window.__driveLoaded) return;
    window.__driveLoaded = true;
    var s = document.createElement('script');
    s.async = 1;
    s.setAttribute('data-cmp-ab', '2');
    s.src = 'https://emrld.ltd/NTcxMDcw.js?t=571070';
    document.head.appendChild(s);
  }

  function loadAll() {
    loadGA();
    loadDrive();
  }

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  var LANG = (location.pathname.match(/^\/(en|es|fr)\//) || [null, 'de'])[1];
  var TEXT = {
    de: {
      body: 'Wir verwenden Cookies für Analyse (Google Analytics) und für Buchungslinks zu Reisepartnern (Travelpayouts Drive). Details in unserer <a href="/datenschutz" style="color:inherit;text-decoration:underline;">Datenschutzerklärung</a>.',
      accept: 'Akzeptieren',
      decline: 'Ablehnen',
    },
    en: {
      body: 'We use cookies for analytics (Google Analytics) and for booking links to travel partners (Travelpayouts Drive). Details in our <a href="/en/privacy/" style="color:inherit;text-decoration:underline;">Privacy Policy</a>.',
      accept: 'Accept',
      decline: 'Decline',
    },
    es: {
      body: 'Usamos cookies para análisis (Google Analytics) y para enlaces de reserva a socios de viaje (Travelpayouts Drive). Más información en nuestra <a href="/es/privacy/" style="color:inherit;text-decoration:underline;">Política de privacidad</a>.',
      accept: 'Aceptar',
      decline: 'Rechazar',
    },
    fr: {
      body: "Nous utilisons des cookies pour l'analyse (Google Analytics) et pour des liens de réservation vers des partenaires de voyage (Travelpayouts Drive). Détails dans notre <a href=\"/fr/privacy/\" style=\"color:inherit;text-decoration:underline;\">politique de confidentialité</a>.",
      accept: 'Accepter',
      decline: 'Refuser',
    },
  };
  var t = TEXT[LANG] || TEXT.de;

  var bannerEl = null;

  function removeBanner() {
    if (bannerEl && bannerEl.parentNode) bannerEl.parentNode.removeChild(bannerEl);
    bannerEl = null;
  }

  function showBanner() {
    removeBanner();
    bannerEl = document.createElement('div');
    bannerEl.setAttribute('role', 'dialog');
    bannerEl.setAttribute('aria-label', 'Cookie consent');
    bannerEl.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#10172A;color:#fff;padding:16px 5vw;display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;font-family:Inter,system-ui,sans-serif;font-size:14px;box-shadow:0 -2px 16px rgba(0,0,0,0.25);';

    var textEl = document.createElement('span');
    textEl.style.cssText = 'flex:1;min-width:240px;line-height:1.5;';
    textEl.innerHTML = t.body;

    var btnRow = document.createElement('span');
    btnRow.style.cssText = 'display:flex;gap:8px;flex-shrink:0;';

    // Equal visual weight for both buttons — no dark pattern steering
    // toward "accept" (same reasoning as the app's AffiliateConsentSheet).
    var declineBtn = document.createElement('button');
    declineBtn.textContent = t.decline;
    declineBtn.style.cssText = 'background:transparent;border:1.5px solid #fff;color:#fff;padding:10px 18px;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
    declineBtn.onclick = function () {
      setConsent('declined');
      removeBanner();
    };

    var acceptBtn = document.createElement('button');
    acceptBtn.textContent = t.accept;
    acceptBtn.style.cssText = 'background:#C62828;border:1.5px solid #C62828;color:#fff;padding:10px 18px;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
    acceptBtn.onclick = function () {
      setConsent('granted');
      loadAll();
      removeBanner();
    };

    btnRow.appendChild(declineBtn);
    btnRow.appendChild(acceptBtn);
    bannerEl.appendChild(textEl);
    bannerEl.appendChild(btnRow);
    document.body.appendChild(bannerEl);
  }

  // Exposed for the footer "Cookie-Einstellungen" link — lets a visitor
  // change a previous decision, not just decide once forever.
  window.reopenCookieConsent = function () {
    showBanner();
  };

  function init() {
    var consent = getConsent();
    if (consent === 'granted') {
      loadAll();
    } else if (consent !== 'declined') {
      showBanner();
    }
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
