/* JOVE THE SCENT — Popup Display (include on main pages) */
(function() {
  'use strict';

  const DISMISSED_KEY = 'jove_dismissed_popups';

  function getDismissed() {
    try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'); } catch { return []; }
  }

  function dismiss(id) {
    const d = getDismissed();
    if (!d.includes(id)) { d.push(id); localStorage.setItem(DISMISSED_KEY, JSON.stringify(d)); }
  }

  async function loadPopups() {
    const cfg = window.JOVE_CONFIG;
    if (!cfg || cfg.SUPABASE_URL === 'YOUR_SUPABASE_URL') return;

    try {
      const res = await fetch(`${cfg.SUPABASE_URL}/rest/v1/site_popups?is_active=eq.true&select=*&order=created_at.desc`, {
        headers: { 'apikey': cfg.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${cfg.SUPABASE_ANON_KEY}` }
      });
      if (!res.ok) return;
      const popups = await res.json();
      const dismissed = getDismissed();
      const now = new Date();

      popups.forEach(p => {
        if (dismissed.includes(p.id)) return;
        if (p.start_date && new Date(p.start_date) > now) return;
        if (p.end_date && new Date(p.end_date) < now) return;
        showPopup(p);
      });
    } catch (e) { console.warn('[JOVE Popup]', e); }
  }

  function showPopup(p) {
    const isKr = window.location.pathname.includes('/kr/');

    if (p.position === 'center') {
      const overlay = document.createElement('div');
      overlay.id = 'jove-popup-' + p.id;
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn .3s;';
      overlay.innerHTML = `
        <div style="background:#0e0e0e;border:1px solid rgba(196,169,106,0.15);max-width:480px;width:90%;padding:2.5rem;position:relative;text-align:center;">
          <button onclick="this.closest('[id^=jove-popup]').remove()" style="position:absolute;top:0.8rem;right:1rem;background:none;border:none;color:rgba(232,228,223,0.4);font-size:1.2rem;cursor:pointer;">✕</button>
          ${p.image_url ? `<img src="${p.image_url}" style="max-width:100%;margin-bottom:1.5rem;border:1px solid rgba(196,169,106,0.08);" alt="">` : ''}
          <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:300;color:#e8e4df;letter-spacing:0.1em;margin-bottom:1rem;">${p.title}</h3>
          <div style="font-size:0.8rem;color:rgba(232,228,223,0.55);line-height:1.8;margin-bottom:1.5rem;">${p.body || ''}</div>
          ${p.cta_text ? `<a href="${p.cta_link || '#'}" style="display:inline-block;padding:0.7rem 2rem;border:1px solid rgba(196,169,106,0.3);color:#c4a96a;text-decoration:none;font-size:0.7rem;letter-spacing:0.15em;transition:all .3s;font-family:'Cormorant Garamond',serif;">${p.cta_text}</a>` : ''}
        </div>`;
      overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); dismiss(p.id); } });
      overlay.querySelector('button').addEventListener('click', () => dismiss(p.id));
      document.body.appendChild(overlay);

    } else {
      // Top or bottom banner
      const banner = document.createElement('div');
      banner.id = 'jove-popup-' + p.id;
      const pos = p.position === 'top' ? 'top:0;' : 'bottom:0;';
      banner.style.cssText = `position:fixed;${pos}left:0;right:0;z-index:9998;background:rgba(14,14,14,0.95);border-${p.position==='top'?'bottom':'top'}:1px solid rgba(196,169,106,0.15);padding:0.8rem 2rem;display:flex;align-items:center;justify-content:center;gap:1rem;backdrop-filter:blur(12px);animation:slideIn .3s;`;
      banner.innerHTML = `
        <span style="font-size:0.78rem;color:rgba(232,228,223,0.7);font-family:'Cormorant Garamond',serif;letter-spacing:0.05em;">
          ${p.title}${p.body ? ' — ' + p.body : ''}
        </span>
        ${p.cta_text ? `<a href="${p.cta_link || '#'}" style="padding:0.3rem 1rem;border:1px solid rgba(196,169,106,0.3);color:#c4a96a;text-decoration:none;font-size:0.6rem;letter-spacing:0.1em;white-space:nowrap;">${p.cta_text}</a>` : ''}
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(232,228,223,0.3);font-size:1rem;cursor:pointer;margin-left:0.5rem;">✕</button>`;
      banner.querySelector('button').addEventListener('click', () => dismiss(p.id));
      document.body.appendChild(banner);
    }
  }

  // Add animation CSS
  const style = document.createElement('style');
  style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideIn{from{transform:translateY(-100%)}to{transform:translateY(0)}}';
  document.head.appendChild(style);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPopups);
  } else {
    loadPopups();
  }
})();
