/* JOVE THE SCENT — Custom SVG Icons (Gold Line Art) */
(function() {
  'use strict';

  const G = 'hsl(43,35%,50%)'; // gold

  const ICONS = {
    // Packaging icons
    '🦁': `<svg viewBox="0 0 36 36" fill="none"><path d="M18 4C18 4 8 10 8 18c0 5 3 8 6 9.5M18 4c0 0 10 6 10 14 0 5-3 8-6 9.5M18 4v5M14 28.5c1.2.5 2.5.8 4 .8s2.8-.3 4-.8" stroke="${G}" stroke-width="1" stroke-linecap="round"/><circle cx="18" cy="15" r="2.5" stroke="${G}" stroke-width="1"/><path d="M15.5 18.5c0 0 1 2.5 2.5 2.5s2.5-2.5 2.5-2.5" stroke="${G}" stroke-width="1" stroke-linecap="round"/></svg>`,

    '🪨': `<svg viewBox="0 0 36 36" fill="none"><path d="M8 24l5-6 3 2 4-5 4 3 4-4" stroke="${G}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 26c2-1 5-2 8-2 4 0 6 1.5 8 1.5s4-.5 8-2" stroke="${G}" stroke-width="1" stroke-linecap="round"/><circle cx="14" cy="14" r="1.5" stroke="${G}" stroke-width="0.8"/><circle cx="22" cy="11" r="1" stroke="${G}" stroke-width="0.8"/></svg>`,

    '📜': `<svg viewBox="0 0 36 36" fill="none"><rect x="8" y="10" width="20" height="16" rx="1" stroke="${G}" stroke-width="1"/><rect x="10" y="10" width="8" height="16" stroke="${G}" stroke-width="0.8" stroke-dasharray="3 2"/><path d="M5 14h3M5 18h3M5 22h3" stroke="${G}" stroke-width="0.8" stroke-linecap="round"/></svg>`,

    // Fragrance note icons
    '🌿': `<svg viewBox="0 0 36 36" fill="none"><path d="M18 30V14" stroke="${G}" stroke-width="1" stroke-linecap="round"/><path d="M18 14c-4-4-10-3-12-1 2 6 7 8 12 5" stroke="${G}" stroke-width="1" stroke-linecap="round"/><path d="M18 18c4-4 9-2 11 0-2 5-6 7-11 4" stroke="${G}" stroke-width="1" stroke-linecap="round"/></svg>`,

    '🌺': `<svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="3" stroke="${G}" stroke-width="1"/><path d="M18 8v4M18 24v4M8 18h4M24 18h4M11 11l3 3M22 22l3 3M25 11l-3 3M14 22l-3 3" stroke="${G}" stroke-width="1" stroke-linecap="round"/></svg>`,

    '🤍': `<svg viewBox="0 0 36 36" fill="none"><path d="M18 28c-7-5-12-10-12-15a6 6 0 0 1 12 0 6 6 0 0 1 12 0c0 5-5 10-12 15z" stroke="${G}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    '🪵': `<svg viewBox="0 0 36 36" fill="none"><ellipse cx="18" cy="18" rx="10" ry="6" stroke="${G}" stroke-width="1"/><path d="M12 16c1-1 3-1.5 6-1.5s5 .5 6 1.5" stroke="${G}" stroke-width="0.7" stroke-linecap="round"/><circle cx="16" cy="18" r="2" stroke="${G}" stroke-width="0.7"/><circle cx="21" cy="17" r="1.2" stroke="${G}" stroke-width="0.7"/></svg>`,

    '🍂': `<svg viewBox="0 0 36 36" fill="none"><path d="M10 8c8 2 14 8 16 16" stroke="${G}" stroke-width="1" stroke-linecap="round"/><path d="M10 8c-2 8 2 16 16 16" stroke="${G}" stroke-width="1" stroke-linecap="round"/><path d="M14 14l4 4M12 20l6-2" stroke="${G}" stroke-width="0.7" stroke-linecap="round"/></svg>`,

    '🌶️': `<svg viewBox="0 0 36 36" fill="none"><path d="M20 8c0 0-2 2-2 4s2 14 2 16c0 0 6-8 6-14 0-4-3-6-6-6z" stroke="${G}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 10c-2-2-4-2-5 0" stroke="${G}" stroke-width="1" stroke-linecap="round"/></svg>`,

    '🌹': `<svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="16" r="4" stroke="${G}" stroke-width="1"/><path d="M16 14c1-2 3-2 4 0" stroke="${G}" stroke-width="0.8" stroke-linecap="round"/><path d="M14 16c0-3 3-6 4-6s4 3 4 6" stroke="${G}" stroke-width="0.8" stroke-linecap="round"/><path d="M18 20v8M14 26l4-3 4 3" stroke="${G}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    '💜': `<svg viewBox="0 0 36 36" fill="none"><path d="M12 10c-2 0-4 2-4 5 0 6 10 13 10 13s10-7 10-13c0-3-2-5-4-5-2 0-4 1-6 4-2-3-4-4-6-4z" stroke="${G}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 18v6" stroke="${G}" stroke-width="0.7" stroke-linecap="round" stroke-dasharray="2 2"/></svg>`,

    '🥥': `<svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="9" stroke="${G}" stroke-width="1"/><path d="M13 15a6 6 0 0 1 10 0" stroke="${G}" stroke-width="0.8" stroke-linecap="round"/><circle cx="15" cy="13" r="1" stroke="${G}" stroke-width="0.7"/><circle cx="21" cy="13" r="1" stroke="${G}" stroke-width="0.7"/><circle cx="18" cy="16" r="0.8" stroke="${G}" stroke-width="0.7"/></svg>`,

    '🍋': `<svg viewBox="0 0 36 36" fill="none"><ellipse cx="18" cy="18" rx="8" ry="6" transform="rotate(-20 18 18)" stroke="${G}" stroke-width="1"/><path d="M24 12c2-2 3-1 3 1" stroke="${G}" stroke-width="1" stroke-linecap="round"/><path d="M15 16l6 4M18 15v6" stroke="${G}" stroke-width="0.6" stroke-linecap="round"/></svg>`,

    '🫐': `<svg viewBox="0 0 36 36" fill="none"><circle cx="15" cy="20" r="4" stroke="${G}" stroke-width="1"/><circle cx="22" cy="18" r="4" stroke="${G}" stroke-width="1"/><circle cx="18" cy="14" r="3.5" stroke="${G}" stroke-width="1"/><path d="M17 10l1-3M19 10l-1-3" stroke="${G}" stroke-width="0.8" stroke-linecap="round"/></svg>`,

    '🍊': `<svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="19" r="8" stroke="${G}" stroke-width="1"/><path d="M16 11c1-1 3-1 4 0" stroke="${G}" stroke-width="1" stroke-linecap="round"/><path d="M18 11v4M14 19l4-4 4 4M14 23l4-4 4 4" stroke="${G}" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    '📦': `<svg viewBox="0 0 36 36" fill="none"><rect x="6" y="12" width="24" height="16" rx="1" stroke="${G}" stroke-width="1"/><path d="M6 17h24M15 12v5M21 12v5" stroke="${G}" stroke-width="1" stroke-linecap="round"/></svg>`
  };

  function replaceEmojis() {
    document.querySelectorAll('.pkg-icon, .note-icon').forEach(el => {
      const text = el.textContent.trim();
      if (ICONS[text]) {
        el.innerHTML = ICONS[text];
        el.style.fontSize = 'inherit';
        el.style.filter = 'none';
        if (!el.querySelector('svg').style.width) {
          const svg = el.querySelector('svg');
          svg.style.width = '36px';
          svg.style.height = '36px';
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceEmojis);
  } else {
    replaceEmojis();
  }

  window.JoveIcons = { ICONS, replaceEmojis };
})();
