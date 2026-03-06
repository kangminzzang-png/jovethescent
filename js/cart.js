/* JOVE THE SCENT — Cart System */
(function() {
  'use strict';

  const PRODUCTS = {
    'genesis-i': { id: 'genesis-i', name: 'Genesis I', nameEn: 'Genesis I', subtitle: 'Fiat Lux', price: 340000, priceUsd: 260, image: '../assets/lovable/product-genesis.jpg' },
    'hawa': { id: 'hawa', name: 'HAWA', nameEn: 'HAWA', subtitle: 'Primam Femina', price: 340000, priceUsd: 260, image: '../assets/lovable/product-hawa-box.png' },
    'breath-of-eden': { id: 'breath-of-eden', name: 'Breath of Eden', nameEn: 'Breath of Eden', subtitle: 'Ortus Paradisi', price: 340000, priceUsd: 260, image: '../assets/lovable/product-eden.jpg' },
    'the-scrolls': { id: 'the-scrolls', name: 'The Scrolls', nameEn: 'The Scrolls', subtitle: 'Discovery Set', price: 27000, priceUsd: 22, image: '../assets/scrolls-hero.jpg' }
  };

  const AMBASSADOR_CODES = {
    'JOVE10': { discount: 10, type: 'percent', msgKr: '✦ 엠배서더 10% 혜택이 적용되었습니다.', msgEn: '✦ Ambassador 10% benefit applied.' },
    'WELCOME': { discount: 15, type: 'percent', msgKr: '✦ 15% 초대 혜택이 적용되었습니다.', msgEn: '✦ 15% welcome benefit applied.' },
    'CREATION': { discount: 20, type: 'percent', msgKr: '✦ Creation Series 20% 혜택이 적용되었습니다.', msgEn: '✦ Creation Series 20% benefit applied.' }
  };

  const STORAGE_KEY = 'jove_cart';
  const PROMO_KEY = 'jove_promo';

  /* ── Core Cart Functions ── */
  function getCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }));
  }

  function addToCart(productId, qty) {
    qty = qty || 1;
    const product = PRODUCTS[productId];
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    saveCart(cart);
    showMiniCart();
    showAddedFeedback(product);
  }

  function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
  }

  function updateQuantity(productId, qty) {
    if (qty < 1) return removeFromCart(productId);
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) item.quantity = qty;
    saveCart(cart);
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    updateCartUI();
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartSubtotal(currency) {
    const cart = getCart();
    const key = currency === 'usd' ? 'priceUsd' : 'price';
    return cart.reduce((sum, item) => sum + (item[key] * item.quantity), 0);
  }

  function getAppliedPromo() {
    try { return JSON.parse(localStorage.getItem(PROMO_KEY)); }
    catch { return null; }
  }

  function applyPromo(code) {
    const upper = code.toUpperCase().trim();
    const promo = AMBASSADOR_CODES[upper];
    if (!promo) return null;
    const data = { code: upper, ...promo };
    localStorage.setItem(PROMO_KEY, JSON.stringify(data));
    return data;
  }

  function removePromo() {
    localStorage.removeItem(PROMO_KEY);
  }

  function getCartTotal(currency) {
    let subtotal = getCartSubtotal(currency);
    const promo = getAppliedPromo();
    if (promo) {
      if (promo.type === 'percent') subtotal = Math.round(subtotal * (1 - promo.discount / 100));
      else if (promo.type === 'fixed') subtotal = Math.max(0, subtotal - promo.discount);
    }
    return subtotal;
  }

  function formatKRW(n) { return '₩' + n.toLocaleString('ko-KR'); }
  function formatUSD(n) { return '$' + n.toLocaleString('en-US'); }

  /* ── UI Updates ── */
  function updateCartUI() {
    // Update all cart count badges
    document.querySelectorAll('.cart-count').forEach(el => {
      const count = getCartCount();
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    // Update nav cart text
    document.querySelectorAll('.nav-cart-text').forEach(el => {
      el.textContent = el.dataset.label ? el.dataset.label + ' (' + getCartCount() + ')' : '(' + getCartCount() + ')';
    });
  }

  /* ── Mini Cart Sidebar ── */
  function createMiniCart() {
    if (document.getElementById('jove-minicart')) return;

    const isKr = window.location.pathname.includes('/kr/') || window.location.pathname.endsWith('/kr');
    const t = {
      title: isKr ? '장바구니' : 'Shopping Cart',
      empty: isKr ? '장바구니가 비어있습니다.' : 'Your cart is empty.',
      subtotal: isKr ? '소계' : 'Subtotal',
      checkout: isKr ? '결제하기' : 'Checkout',
      continueShopping: isKr ? '계속 쇼핑하기' : 'Continue Shopping',
      remove: isKr ? '삭제' : 'Remove'
    };

    const overlay = document.createElement('div');
    overlay.id = 'jove-minicart-overlay';
    overlay.innerHTML = '';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.6)', zIndex: '9998',
      opacity: '0', visibility: 'hidden', transition: 'opacity 0.4s, visibility 0.4s',
      backdropFilter: 'blur(4px)'
    });
    overlay.addEventListener('click', hideMiniCart);

    const sidebar = document.createElement('div');
    sidebar.id = 'jove-minicart';
    Object.assign(sidebar.style, {
      position: 'fixed', top: '0', right: '0', bottom: '0', width: '400px', maxWidth: '90vw',
      background: 'hsl(0,0%,5%)', zIndex: '9999', transform: 'translateX(100%)',
      transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      display: 'flex', flexDirection: 'column',
      borderLeft: '1px solid hsl(0,0%,15%)', fontFamily: 'var(--sans, -apple-system, sans-serif)'
    });

    sidebar.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:1.5rem;border-bottom:1px solid hsl(0,0%,15%)">
        <span style="font-family:var(--serif,'Cormorant Garamond',serif);font-size:1.2rem;color:hsl(40,10%,85%)">${t.title}</span>
        <button id="minicart-close" style="background:none;border:none;color:hsl(40,5%,55%);cursor:pointer;font-size:1.2rem;padding:0.5rem">✕</button>
      </div>
      <div id="minicart-items" style="flex:1;overflow-y:auto;padding:1rem 1.5rem"></div>
      <div id="minicart-footer" style="border-top:1px solid hsl(0,0%,15%);padding:1.5rem">
        <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem">
          <span style="font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:hsl(40,5%,55%)">${t.subtotal}</span>
          <span id="minicart-total" style="font-family:var(--serif,'Cormorant Garamond',serif);font-size:1.3rem;color:hsl(40,10%,85%)"></span>
        </div>
        <a id="minicart-checkout" href="${isKr ? 'checkout.html' : 'checkout.html'}" style="display:block;text-align:center;padding:0.9rem;background:hsl(40,10%,85%);color:hsl(0,0%,5%);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;transition:background 0.3s;margin-bottom:0.8rem">${t.checkout}</a>
        <button id="minicart-continue" style="width:100%;padding:0.7rem;background:transparent;border:1px solid hsl(0,0%,15%);color:hsl(40,5%,55%);font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.3s">${t.continueShopping}</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    document.getElementById('minicart-close').addEventListener('click', hideMiniCart);
    document.getElementById('minicart-continue').addEventListener('click', hideMiniCart);

    // Hover effects
    const checkoutBtn = document.getElementById('minicart-checkout');
    checkoutBtn.addEventListener('mouseenter', () => checkoutBtn.style.background = 'hsl(43,35%,50%)');
    checkoutBtn.addEventListener('mouseleave', () => checkoutBtn.style.background = 'hsl(40,10%,85%)');
  }

  function renderMiniCartItems() {
    const container = document.getElementById('minicart-items');
    const totalEl = document.getElementById('minicart-total');
    if (!container) return;

    const cart = getCart();
    const isKr = window.location.pathname.includes('/kr/');
    const fmt = isKr ? formatKRW : formatUSD;
    const priceKey = isKr ? 'price' : 'priceUsd';

    if (cart.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:3rem 0;color:hsl(40,5%,55%);font-size:0.85rem">${isKr ? '장바구니가 비어있습니다.' : 'Your cart is empty.'}</div>`;
      if (totalEl) totalEl.textContent = fmt(0);
      return;
    }

    container.innerHTML = cart.map(item => `
      <div class="minicart-item" data-id="${item.id}" style="display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid hsl(0,0%,12%)">
        <div style="width:70px;height:90px;flex-shrink:0;overflow:hidden;background:hsl(0,0%,8%)">
          <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover">
        </div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="font-family:var(--serif,'Cormorant Garamond',serif);font-size:1rem;color:hsl(40,10%,85%);margin-bottom:0.15rem">${item.name}</div>
            <div style="font-size:0.6rem;color:hsl(40,5%,55%);letter-spacing:0.1em">${item.subtitle}</div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:0.5rem">
              <button onclick="JoveCart.updateQuantity('${item.id}',${item.quantity - 1}); JoveCart.renderMiniCartItems()" style="background:none;border:1px solid hsl(0,0%,15%);color:hsl(40,5%,55%);width:24px;height:24px;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;justify-content:center">−</button>
              <span style="font-size:0.8rem;color:hsl(40,10%,85%);min-width:20px;text-align:center">${item.quantity}</span>
              <button onclick="JoveCart.updateQuantity('${item.id}',${item.quantity + 1}); JoveCart.renderMiniCartItems()" style="background:none;border:1px solid hsl(0,0%,15%);color:hsl(40,5%,55%);width:24px;height:24px;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;justify-content:center">+</button>
            </div>
            <span style="font-size:0.85rem;color:hsl(40,10%,85%)">${fmt(item[priceKey] * item.quantity)}</span>
          </div>
        </div>
      </div>
    `).join('');

    if (totalEl) {
      const subtotal = getCartSubtotal(isKr ? 'krw' : 'usd');
      totalEl.textContent = fmt(subtotal);
    }
  }

  function showMiniCart() {
    createMiniCart();
    renderMiniCartItems();
    requestAnimationFrame(() => {
      const overlay = document.getElementById('jove-minicart-overlay');
      const sidebar = document.getElementById('jove-minicart');
      if (overlay) { overlay.style.opacity = '1'; overlay.style.visibility = 'visible'; }
      if (sidebar) sidebar.style.transform = 'translateX(0)';
      document.body.style.overflow = 'hidden';
    });
  }

  function hideMiniCart() {
    const overlay = document.getElementById('jove-minicart-overlay');
    const sidebar = document.getElementById('jove-minicart');
    if (overlay) { overlay.style.opacity = '0'; overlay.style.visibility = 'hidden'; }
    if (sidebar) sidebar.style.transform = 'translateX(100%)';
    document.body.style.overflow = '';
  }

  /* ── Added to Cart Feedback ── */
  function showAddedFeedback(product) {
    const isKr = window.location.pathname.includes('/kr/');
    const msg = isKr ? `✦ ${product.name} — 장바구니에 담았습니다` : `✦ ${product.nameEn} — Added to cart`;
    
    let toast = document.getElementById('jove-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'jove-toast';
      Object.assign(toast.style, {
        position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%) translateY(-100%)',
        background: 'hsl(0,0%,8%)', border: '1px solid hsl(43,35%,50%)',
        color: 'hsl(40,10%,85%)', padding: '0.8rem 2rem',
        fontSize: '0.75rem', letterSpacing: '0.1em', zIndex: '10000',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s',
        opacity: '0', whiteSpace: 'nowrap'
      });
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(-100%)';
      toast.style.opacity = '0';
    }, 2500);
  }

  /* ── Wire Up Buttons on Page Load ── */
  function init() {
    createMiniCart();
    updateCartUI();

    // Wire up all add-to-cart buttons
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(btn.dataset.addToCart);
      });
    });

    // Wire up cart toggle buttons
    document.querySelectorAll('[data-toggle-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showMiniCart();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Public API ── */
  window.JoveCart = {
    add: addToCart,
    remove: removeFromCart,
    updateQuantity,
    getCart,
    getCartCount,
    getCartSubtotal,
    getCartTotal,
    getAppliedPromo,
    applyPromo,
    removePromo,
    clearCart,
    formatKRW,
    formatUSD,
    showMiniCart,
    hideMiniCart,
    renderMiniCartItems,
    PRODUCTS,
    AMBASSADOR_CODES
  };

})();
