/**
 * =============================================================
 *  BuildSol Hardware — Main Site JavaScript
 *  Covers: Cart, Wishlist, Auth state, Search, Filters,
 *          Navigation, Slider, Toast notifications, Newsletter,
 *          Quick-view modal, Countdown timers, Price range,
 *          Pagination, View toggle, Promo strip, and more.
 * =============================================================
 */

'use strict';

/* ─────────────────────────────────────────────
   0. UTILITY HELPERS
───────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const formatPrice = (cents) => {
  const rand = cents / 100;
  return 'R' + rand.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const debounce = (fn, delay = 300) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Safely parse JSON from localStorage without throwing */
const lsGet = (key, fallback = null) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const lsSet = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};


/* ─────────────────────────────────────────────
   1. TOAST NOTIFICATION SYSTEM
───────────────────────────────────────────── */
const Toast = (() => {
  let container;

  const init = () => {
    if ($('#bs-toast-container')) return;
    container = document.createElement('div');
    container.id = 'bs-toast-container';
    Object.assign(container.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      zIndex: '9999', display: 'flex', flexDirection: 'column',
      gap: '10px', pointerEvents: 'none',
    });
    document.body.appendChild(container);
  };

  /**
   * @param {string} message
   * @param {'success'|'error'|'info'|'warning'} type
   * @param {number} duration ms
   */
  const show = (message, type = 'success', duration = 3200) => {
    init();

    const icons = { success: 'fa-check-circle', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };

    const toast = document.createElement('div');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    Object.assign(toast.style, {
      display: 'flex', alignItems: 'center', gap: '12px',
      background: '#fff', borderRadius: '10px',
      padding: '14px 18px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
      borderLeft: `4px solid ${colors[type]}`,
      fontFamily: 'var(--font-body, sans-serif)',
      fontSize: '0.9rem', color: '#1f2937',
      minWidth: '280px', maxWidth: '380px',
      pointerEvents: 'all',
      transform: 'translateX(120%)',
      transition: 'transform 0.3s cubic-bezier(.22,1,.36,1), opacity 0.3s ease',
      opacity: '0',
    });

    toast.innerHTML = `
      <i class="fas ${icons[type]}" style="color:${colors[type]};font-size:1.1rem;flex-shrink:0;"></i>
      <span style="flex:1;">${message}</span>
      <button style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1rem;padding:0;line-height:1;" aria-label="Dismiss">
        <i class="fas fa-xmark"></i>
      </button>`;

    container.appendChild(toast);
    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    const dismiss = () => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    };

    toast.querySelector('button').addEventListener('click', dismiss);
    const timer = setTimeout(dismiss, duration);
    toast.addEventListener('mouseenter', () => clearTimeout(timer));
    toast.addEventListener('mouseleave', () => setTimeout(dismiss, 1200));
  };

  return { show };
})();


/* ─────────────────────────────────────────────
   2. CART ENGINE
   Persists to localStorage. Cart items keyed by product id.
   Each item: { id, name, brand, price (cents), qty, image, badge }
───────────────────────────────────────────── */
const Cart = (() => {
  const STORAGE_KEY = 'bs_cart';
  let items = lsGet(STORAGE_KEY, []);
  let isOpen = false;

  /* ── Internal helpers ── */
  const save = () => lsSet(STORAGE_KEY, items);

  const find = (id) => items.find(i => i.id === id);

  const totalQty = () => items.reduce((s, i) => s + i.qty, 0);

  const totalCents = () => items.reduce((s, i) => s + i.price * i.qty, 0);

  const updateBadge = () => {
    $$('.cart-count').forEach(el => {
      const q = totalQty();
      el.textContent = q;
      el.style.display = q === 0 ? 'none' : '';
    });
  };

  /* ── Drawer DOM ── */
  const buildDrawer = () => {
    if ($('#bs-cart-drawer')) return;

    const overlay = document.createElement('div');
    overlay.id = 'bs-cart-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.5)',
      zIndex: '3000', opacity: '0', visibility: 'hidden',
      transition: 'all 0.3s ease',
    });
    overlay.addEventListener('click', close);

    const drawer = document.createElement('aside');
    drawer.id = 'bs-cart-drawer';
    drawer.setAttribute('aria-label', 'Shopping cart');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    Object.assign(drawer.style, {
      position: 'fixed', top: '0', right: '0', height: '100vh',
      width: 'min(420px, 100vw)', background: '#fff',
      zIndex: '3001', display: 'flex', flexDirection: 'column',
      boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
      transform: 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)',
      fontFamily: 'var(--font-body, sans-serif)',
    });

    drawer.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:2px solid #e5e7eb;background:var(--navy-900,#0a1628);">
        <h2 style="font-family:var(--font-heading);font-size:1.1rem;color:#fff;font-weight:700;display:flex;align-items:center;gap:8px;">
          <i class="fas fa-cart-shopping" style="color:var(--gold-400,#ffc629);"></i> Your Cart
          <span id="bs-cart-header-count" style="background:var(--gold-500,#e6a800);color:var(--navy-900,#0a1628);font-size:0.75rem;font-weight:800;padding:2px 8px;border-radius:99px;"></span>
        </h2>
        <button id="bs-cart-close" aria-label="Close cart" style="background:rgba(255,255,255,0.1);border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">
          <i class="fas fa-xmark"></i>
        </button>
      </div>
      <div id="bs-cart-items" style="flex:1;overflow-y:auto;padding:16px 24px;"></div>
      <div id="bs-cart-footer" style="border-top:2px solid #e5e7eb;padding:20px 24px;background:#f9fafb;"></div>`;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    $('#bs-cart-close').addEventListener('click', close);
    overlay.addEventListener('click', close);
  };

  const renderDrawer = () => {
    const itemsEl = $('#bs-cart-items');
    const footerEl = $('#bs-cart-footer');
    const headerCount = $('#bs-cart-header-count');
    if (!itemsEl) return;

    const q = totalQty();
    if (headerCount) headerCount.textContent = q > 0 ? q : '';

    if (items.length === 0) {
      itemsEl.innerHTML = `
        <div style="text-align:center;padding:48px 24px;color:#6b7280;">
          <i class="fas fa-cart-shopping" style="font-size:3rem;color:#d1d5db;margin-bottom:16px;display:block;"></i>
          <p style="font-family:var(--font-heading);font-weight:700;color:#374151;margin-bottom:8px;">Your cart is empty</p>
          <p style="font-size:0.875rem;">Add items to get started.</p>
          <button id="bs-cart-continue" style="margin-top:20px;padding:10px 24px;background:var(--navy-700,#152d50);color:#fff;border:none;border-radius:8px;font-family:var(--font-heading);font-weight:600;cursor:pointer;font-size:0.875rem;">Continue Shopping</button>
        </div>`;
      footerEl.innerHTML = '';
      $('#bs-cart-continue')?.addEventListener('click', close);
      return;
    }

    itemsEl.innerHTML = items.map(item => `
      <div class="bs-cart-item" data-id="${item.id}" style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #e5e7eb;">
        <div style="width:72px;height:72px;border-radius:8px;overflow:hidden;background:#f3f4f6;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">` : `<i class="${item.icon || 'fas fa-box'}" style="font-size:1.75rem;color:#9ca3af;"></i>`}
        </div>
        <div style="flex:1;min-width:0;">
          <p style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;font-family:var(--font-heading);font-weight:600;">${item.brand}</p>
          <p style="font-size:0.875rem;font-weight:600;color:#0f2240;line-height:1.3;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</p>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <div style="display:flex;align-items:center;border:2px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <button class="bs-qty-btn" data-id="${item.id}" data-delta="-1" style="width:28px;height:28px;background:none;border:none;cursor:pointer;color:#374151;font-size:0.9rem;display:flex;align-items:center;justify-content:center;">−</button>
              <span style="width:28px;text-align:center;font-family:var(--font-heading);font-size:0.875rem;font-weight:700;">${item.qty}</span>
              <button class="bs-qty-btn" data-id="${item.id}" data-delta="1" style="width:28px;height:28px;background:none;border:none;cursor:pointer;color:#374151;font-size:0.9rem;display:flex;align-items:center;justify-content:center;">+</button>
            </div>
            <span style="font-family:var(--font-heading);font-size:0.9375rem;font-weight:700;color:#0f2240;">${formatPrice(item.price * item.qty)}</span>
            <button class="bs-remove-btn" data-id="${item.id}" aria-label="Remove item" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:0.875rem;transition:color 0.15s;" title="Remove">
              <i class="fas fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>`).join('');

    // Shipping threshold
    const freeShippingThreshold = 150000; // R1500 in cents
    const remaining = freeShippingThreshold - totalCents();
    const shippingBar = remaining > 0
      ? `<div style="margin-bottom:16px;">
           <p style="font-size:0.8rem;color:#6b7280;margin-bottom:6px;">
             Add <strong style="color:#0f2240;">${formatPrice(remaining)}</strong> more for free delivery!
           </p>
           <div style="height:6px;background:#e5e7eb;border-radius:99px;overflow:hidden;">
             <div style="height:100%;width:${clamp((totalCents()/freeShippingThreshold)*100,0,100)}%;background:linear-gradient(90deg,#e6a800,#ffc629);border-radius:99px;transition:width 0.4s;"></div>
           </div>
         </div>`
      : `<div style="background:#d1fae5;border-radius:8px;padding:8px 12px;margin-bottom:16px;font-size:0.8rem;color:#065f46;display:flex;align-items:center;gap:8px;">
           <i class="fas fa-truck-fast"></i> You qualify for free delivery!
         </div>`;

    footerEl.innerHTML = `
      ${shippingBar}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:0.875rem;color:#6b7280;">Subtotal (${totalQty()} item${totalQty()!==1?'s':''})</span>
        <span style="font-family:var(--font-heading);font-size:1rem;font-weight:700;color:#0f2240;">${formatPrice(totalCents())}</span>
      </div>
      <p style="font-size:0.75rem;color:#9ca3af;margin-bottom:16px;">Delivery calculated at checkout.</p>
      <button id="bs-checkout-btn" style="width:100%;padding:14px;background:linear-gradient(135deg,var(--gold-500,#e6a800),var(--gold-600,#cc9500));color:var(--navy-900,#0a1628);border:none;border-radius:10px;font-family:var(--font-heading);font-size:1rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px;transition:opacity 0.2s;">
        <i class="fas fa-lock"></i> Proceed to Checkout
      </button>
      <button id="bs-view-cart-btn" style="width:100%;padding:11px;background:transparent;color:var(--navy-700,#152d50);border:2px solid var(--navy-300,#4a7fb8);border-radius:10px;font-family:var(--font-heading);font-size:0.875rem;font-weight:600;cursor:pointer;transition:all 0.2s;">
        View Full Cart
      </button>`;

    // Event delegation for qty and remove buttons
    $$('.bs-qty-btn', itemsEl).forEach(btn => {
      btn.addEventListener('click', () => updateQty(btn.dataset.id, parseInt(btn.dataset.delta)));
    });
    $$('.bs-remove-btn', itemsEl).forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
    $('#bs-checkout-btn')?.addEventListener('click', handleCheckout);
    $('#bs-view-cart-btn')?.addEventListener('click', close);
  };

  /* ── Public API ── */
  const add = (product) => {
    const existing = find(product.id);
    if (existing) {
      existing.qty = clamp(existing.qty + (product.qty || 1), 1, 99);
    } else {
      items.push({ qty: 1, ...product });
    }
    save();
    updateBadge();
    renderDrawer();
    Toast.show(`<strong>${product.name}</strong> added to cart`, 'success');
  };

  const updateQty = (id, delta) => {
    const item = find(id);
    if (!item) return;
    item.qty = clamp(item.qty + delta, 1, 99);
    save();
    updateBadge();
    renderDrawer();
  };

  const removeItem = (id) => {
    const item = find(id);
    if (!item) return;
    items = items.filter(i => i.id !== id);
    save();
    updateBadge();
    renderDrawer();
    Toast.show(`<strong>${item.name}</strong> removed from cart`, 'info', 2500);
  };

  const open = () => {
    buildDrawer();
    renderDrawer();
    const overlay = $('#bs-cart-overlay');
    const drawer  = $('#bs-cart-drawer');
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    drawer.style.transform = 'translateX(0)';
    document.body.style.overflow = 'hidden';
    isOpen = true;
    drawer.focus();
  };

  const close = () => {
    const overlay = $('#bs-cart-overlay');
    const drawer  = $('#bs-cart-drawer');
    if (!overlay || !drawer) return;
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    drawer.style.transform = 'translateX(100%)';
    document.body.style.overflow = '';
    isOpen = false;
  };

  const handleCheckout = () => {
    if (items.length === 0) { Toast.show('Your cart is empty!', 'warning'); return; }
    // In a real integration, redirect to /checkout or open payment gateway
    Toast.show('Redirecting to secure checkout…', 'info', 2000);
    setTimeout(() => { window.location.href = '#checkout'; }, 2000);
  };

  const init = () => {
    updateBadge();
    // Any .cart-link or [data-action="open-cart"] triggers open
    $$(`.cart-link, [data-action="open-cart"]`).forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); open(); });
    });
    // Keyboard: Escape closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });
  };

  return { init, add, open, close, removeItem, updateQty, total: totalCents, qty: totalQty };
})();


/* ─────────────────────────────────────────────
   3. WISHLIST ENGINE
   Persists to localStorage. Keyed by product id.
───────────────────────────────────────────── */
const Wishlist = (() => {
  const STORAGE_KEY = 'bs_wishlist';
  let ids = new Set(lsGet(STORAGE_KEY, []));

  const save = () => lsSet(STORAGE_KEY, [...ids]);

  const syncButtons = () => {
    $$('.wishlist-btn[data-id]').forEach(btn => {
      const active = ids.has(btn.dataset.id);
      btn.classList.toggle('active', active);
      const icon = btn.querySelector('i');
      if (icon) { icon.className = active ? 'fas fa-heart' : 'far fa-heart'; }
    });
    // Update wishlist count badge if present
    $$('.wishlist-count').forEach(el => { el.textContent = ids.size; el.style.display = ids.size ? '' : 'none'; });
  };

  const toggle = (id, name) => {
    if (ids.has(id)) {
      ids.delete(id);
      Toast.show(`Removed <strong>${name || 'item'}</strong> from wishlist`, 'info', 2400);
    } else {
      ids.add(id);
      Toast.show(`Added <strong>${name || 'item'}</strong> to wishlist`, 'success', 2400);
    }
    save();
    syncButtons();
  };

  const init = () => {
    syncButtons();
    // Delegate on document to catch dynamically injected cards too
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.wishlist-btn[data-id]');
      if (!btn) return;
      e.preventDefault();
      const name = btn.dataset.name || btn.closest('.product-card')?.querySelector('.product-name')?.textContent?.trim();
      toggle(btn.dataset.id, name);
    });
  };

  return { init, toggle, has: (id) => ids.has(id) };
})();


/* ─────────────────────────────────────────────
   4. MOBILE NAVIGATION
───────────────────────────────────────────── */
const MobileNav = (() => {
  const init = () => {
    const toggle  = $('#mobileToggle');
    const nav     = $('#mobileNav');
    const overlay = $('#mobileOverlay');
    const close   = $('#mobileClose');
    if (!toggle || !nav) return;

    const open  = () => { nav.classList.add('active'); overlay?.classList.add('active'); document.body.style.overflow = 'hidden'; toggle.setAttribute('aria-expanded', 'true'); };
    const closeNav = () => { nav.classList.remove('active'); overlay?.classList.remove('active'); document.body.style.overflow = ''; toggle.setAttribute('aria-expanded', 'false'); };

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'mobileNav');

    toggle.addEventListener('click', open);
    close?.addEventListener('click', closeNav);
    overlay?.addEventListener('click', closeNav);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

    // Accordion submenu in mobile
    $$('.mobile-nav-list a[data-submenu]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = $(link.dataset.submenu);
        target?.classList.toggle('open');
      });
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   5. HERO SLIDER (Homepage)
───────────────────────────────────────────── */
const HeroSlider = (() => {
  let current = 0, total = 0, timer = null, paused = false;
  const INTERVAL = 5000;

  const goTo = (index, slides, dots) => {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + total) % total;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  };

  const init = () => {
    const hero = $('.hero-section');
    if (!hero) return;

    const slides = $$('.slide', hero);
    const dots   = $$('.dot',   hero);
    const prev   = $('.slider-arrow[data-dir="prev"]', hero);
    const next   = $('.slider-arrow[data-dir="next"]', hero);
    total = slides.length;
    if (total < 2) return;

    const start = () => { timer = setInterval(() => { if (!paused) goTo(current + 1, slides, dots); }, INTERVAL); };
    const stop  = () => clearInterval(timer);

    prev?.addEventListener('click', () => { goTo(current - 1, slides, dots); stop(); start(); });
    next?.addEventListener('click', () => { goTo(current + 1, slides, dots); stop(); start(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i, slides, dots); stop(); start(); }));

    // Pause on hover
    hero.addEventListener('mouseenter', () => { paused = true; });
    hero.addEventListener('mouseleave', () => { paused = false; });

    // Touch / swipe
    let startX = 0;
    hero.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1), slides, dots); stop(); start(); }
    });

    // Keyboard
    hero.setAttribute('tabindex', '0');
    hero.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { goTo(current - 1, slides, dots); stop(); start(); }
      if (e.key === 'ArrowRight') { goTo(current + 1, slides, dots); stop(); start(); }
    });

    start();
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   6. SEARCH BAR
───────────────────────────────────────────── */
const Search = (() => {
  // Sample product data — replace with API call in production
  const SAMPLE_PRODUCTS = [
    { id: 'p001', name: 'uPVC Pressure Pipe 20mm × 6m', category: 'Plumbing', price: 8999 },
    { id: 'p002', name: 'Single Lever Basin Mixer Tap Chrome', category: 'Plumbing', price: 54900 },
    { id: 'p003', name: 'Kwikot 150L Solar Geyser Complete Kit', category: 'Plumbing', price: 899900 },
    { id: 'p004', name: 'DeWalt 18V Cordless Drill Driver', category: 'Power Tools', price: 289900 },
    { id: 'p005', name: 'Bosch 125mm Angle Grinder', category: 'Power Tools', price: 189900 },
    { id: 'p006', name: 'Dulux Weathershield 20L White', category: 'Paint', price: 129900 },
    { id: 'p007', name: 'Plascon 5L Interior Emulsion', category: 'Paint', price: 34900 },
    { id: 'p008', name: '16mm Twin & Earth Cable 10m', category: 'Electrical', price: 18900 },
    { id: 'p009', name: 'Square D 4-way DB Board', category: 'Electrical', price: 44900 },
    { id: 'p010', name: 'Yale Deadbolt Lock Chrome', category: 'Hardware', price: 22900 },
    { id: 'p011', name: 'PPC Cement 50kg Bag', category: 'Building Materials', price: 14900 },
    { id: 'p012', name: 'SA Pine 38×114 Timber 4.8m', category: 'Building Materials', price: 8900 },
  ];

  let dropdown = null;

  const buildDropdown = (input) => {
    dropdown = document.createElement('div');
    dropdown.id = 'bs-search-dropdown';
    Object.assign(dropdown.style, {
      position: 'absolute', top: 'calc(100% + 6px)', left: '0', right: '0',
      background: '#fff', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
      zIndex: '500', overflow: 'hidden', border: '1px solid #e5e7eb',
      maxHeight: '360px', overflowY: 'auto',
    });
    const bar = input.closest('.search-bar');
    bar.style.position = 'relative';
    bar.appendChild(dropdown);
  };

  const render = (results, query) => {
    if (!dropdown) return;
    if (!results.length) {
      dropdown.innerHTML = `<p style="padding:16px 20px;font-size:0.875rem;color:#6b7280;">No results for "<strong>${query}</strong>". Try a different search.</p>`;
      return;
    }
    dropdown.innerHTML = results.slice(0, 8).map(p => `
      <a href="#product-${p.id}" class="bs-search-result" style="display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid #f3f4f6;text-decoration:none;transition:background 0.15s;cursor:pointer;">
        <div>
          <span style="font-size:0.6875rem;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;font-family:var(--font-heading);font-weight:600;">${p.category}</span>
          <p style="font-size:0.9rem;color:#1f2937;font-weight:500;margin-top:2px;">${p.name}</p>
        </div>
        <span style="font-family:var(--font-heading);font-weight:700;color:#0f2240;white-space:nowrap;margin-left:12px;">${formatPrice(p.price)}</span>
      </a>`).join('') +
      `<a href="#search-${encodeURIComponent(query)}" style="display:block;padding:12px 20px;font-size:0.875rem;font-family:var(--font-heading);font-weight:600;color:var(--navy-600,#1a3a66);background:#f9fafb;text-align:center;text-decoration:none;">
        View all results for "<strong>${query}</strong>" <i class="fas fa-arrow-right" style="font-size:0.75rem;"></i>
      </a>`;

    $$('.bs-search-result', dropdown).forEach(el => {
      el.addEventListener('mouseenter', () => { el.style.background = '#f9fafb'; });
      el.addEventListener('mouseleave', () => { el.style.background = ''; });
    });
  };

  const hide = () => { if (dropdown) { dropdown.remove(); dropdown = null; } };

  const doSearch = debounce((query, input) => {
    if (query.length < 2) { hide(); return; }
    if (!dropdown) buildDropdown(input);
    const q = query.toLowerCase();
    const results = SAMPLE_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    render(results, query);
  }, 250);

  const init = () => {
    $$('.search-bar').forEach(bar => {
      const input = $('input', bar);
      const btn   = $('button', bar);
      if (!input) return;

      input.addEventListener('input', () => doSearch(input.value.trim(), input));
      input.addEventListener('focus', () => { if (input.value.trim().length >= 2) doSearch(input.value.trim(), input); });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { hide(); input.blur(); }
        if (e.key === 'Enter') {
          e.preventDefault();
          hide();
          if (input.value.trim()) Toast.show(`Searching for "<strong>${input.value.trim()}</strong>"…`, 'info', 2000);
        }
      });

      btn?.addEventListener('click', () => {
        if (input.value.trim()) Toast.show(`Searching for "<strong>${input.value.trim()}</strong>"…`, 'info', 2000);
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar')) hide();
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   7. FILTER & PRODUCT GRID (Category pages)
───────────────────────────────────────────── */
const Filters = (() => {
  const init = () => {
    // ── Chip bar (quick filter tabs above product grid) ──
    $$('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const group = chip.closest('.filter-chips') || chip.closest('.product-tabs');
        if (group) $$('.chip', group).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        filterProducts(chip.textContent.trim());
      });
    });

    // ── Tab buttons ──
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.product-tabs');
        if (group) $$('.tab-btn', group).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // ── Sidebar checkboxes → rebuild active filter tags ──
    $$('.filter-check-item input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => rebuildActiveTags());
    });

    // ── In-stock / On-sale toggles ──
    $$('.toggle-switch input').forEach(toggle => {
      toggle.addEventListener('change', () => rebuildActiveTags());
    });

    // ── Price range slider ──
    $$('.price-slider').forEach(slider => {
      const labels = slider.closest('.filter-group')?.querySelector('.price-range-labels');
      slider.addEventListener('input', () => {
        if (labels) {
          const max = parseInt(slider.max);
          const val = parseInt(slider.value);
          const maxLabel = labels.querySelector('span:last-child');
          if (maxLabel) maxLabel.textContent = formatPrice(val * 100);
        }
      });
    });

    // ── Clear all filters ──
    $$('.sidebar-clear-btn, .clear-all-filters').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-check-item input[type="checkbox"]').forEach(cb => { cb.checked = false; });
        $$('.toggle-switch input').forEach(t => { t.checked = false; });
        $$('.price-slider').forEach(s => { s.value = s.max; });
        $$('.active-filter-tag').forEach(tag => tag.remove());
        $$('.chip').forEach((chip, i) => chip.classList.toggle('active', i === 0));
        filterProducts('All');
      });
    });

    // ── Active filter tag removal ──
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.active-filter-tag button');
      if (btn) btn.closest('.active-filter-tag').remove();
    });

    // ── Sort select ──
    $$('.sort-select').forEach(sel => {
      sel.addEventListener('change', () => {
        Toast.show(`Sorted by <strong>${sel.options[sel.selectedIndex].text}</strong>`, 'info', 1800);
      });
    });

    // ── Apply filters button ──
    $$('[data-action="apply-filters"]').forEach(btn => {
      btn.addEventListener('click', () => {
        rebuildActiveTags();
        Toast.show('Filters applied', 'success', 2000);
      });
    });
  };

  const rebuildActiveTags = () => {
    const container = $('.active-filters');
    if (!container) return;
    // Remove old dynamic tags (preserve label and clear-all)
    $$('.active-filter-tag', container).forEach(t => t.remove());

    const insertBefore = $('.clear-all-filters', container);

    $$('.filter-check-item input[type="checkbox"]:checked').forEach(cb => {
      const labelEl = cb.closest('.filter-check-item')?.querySelector('label');
      const labelText = labelEl?.textContent?.trim() || cb.value;
      addTag(labelText, container, insertBefore);
    });

    $$('.toggle-switch input:checked').forEach(toggle => {
      const label = toggle.closest('.toggle-wrap')?.querySelector('.toggle-label')?.textContent?.trim();
      if (label) addTag(label, container, insertBefore);
    });

    const slider = $('.price-slider');
    if (slider && parseInt(slider.value) < parseInt(slider.max)) {
      addTag(`Under ${formatPrice(parseInt(slider.value) * 100)}`, container, insertBefore);
    }
  };

  const addTag = (text, container, insertBefore) => {
    const tag = document.createElement('span');
    tag.className = 'active-filter-tag';
    tag.innerHTML = `${text} <button aria-label="Remove ${text} filter">×</button>`;
    container.insertBefore(tag, insertBefore);
  };

  const filterProducts = (category) => {
    // In a real implementation this would hit an API.
    // Here we just show/hide cards by data-category attribute, or show all.
    const cards = $$('.product-card');
    cards.forEach(card => {
      const cat = card.dataset.category || '';
      const match = category === 'All' || cat === '' || cat.toLowerCase() === category.toLowerCase();
      card.style.display = match ? '' : 'none';
    });
    const count = cards.filter(c => c.style.display !== 'none').length;
    const countEl = $('.cat-results-count strong');
    if (countEl) countEl.textContent = count;
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   8. VIEW TOGGLE (Grid / List)
───────────────────────────────────────────── */
const ViewToggle = (() => {
  const init = () => {
    $$('.view-toggle').forEach(group => {
      const grid = $('.products-grid, #productsGrid');
      $$('.view-toggle-btn', group).forEach(btn => {
        btn.addEventListener('click', () => {
          $$('.view-toggle-btn', group).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const isGrid = btn.getAttribute('aria-label')?.toLowerCase().includes('grid');
          if (grid) {
            if (isGrid) {
              grid.style.gridTemplateColumns = '';
              $$('.product-card', grid).forEach(c => { c.style.flexDirection = ''; c.style.maxWidth = ''; });
            } else {
              // List view
              grid.style.gridTemplateColumns = '1fr';
              $$('.product-card', grid).forEach(c => {
                c.style.display = 'flex';
                c.style.flexDirection = 'row';
              });
            }
          }
        });
      });
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   9. QUICK-VIEW MODAL
───────────────────────────────────────────── */
const QuickView = (() => {
  let modal = null;

  const build = () => {
    if ($('#bs-quickview-modal')) return;
    const overlay = document.createElement('div');
    overlay.id = 'bs-quickview-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.55)',
      zIndex: '4000', display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: '0', visibility: 'hidden', transition: 'all 0.25s ease',
      padding: '16px',
    });

    modal = document.createElement('div');
    modal.id = 'bs-quickview-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Quick product view');
    Object.assign(modal.style, {
      background: '#fff', borderRadius: '16px',
      width: 'min(740px, 100%)', maxHeight: '90vh',
      overflow: 'auto', position: 'relative',
      transform: 'scale(0.92)', transition: 'transform 0.28s cubic-bezier(.22,1,.36,1)',
      fontFamily: 'var(--font-body)',
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  };

  const open = (card) => {
    build();
    const overlay = $('#bs-quickview-overlay');

    // Extract product data from card DOM
    const name    = card.querySelector('.product-name')?.textContent?.trim() || 'Product';
    const brand   = card.querySelector('.product-brand')?.textContent?.trim() || '';
    const price   = card.querySelector('.current-price')?.textContent?.trim() || '';
    const orig    = card.querySelector('.original-price')?.textContent?.trim() || '';
    const rating  = card.querySelector('.stars')?.textContent?.trim() || '★★★★☆';
    const count   = card.querySelector('.rating-count')?.textContent?.trim() || '';
    const badge   = card.querySelector('.badge')?.textContent?.trim() || '';
    const badgeCls = card.querySelector('.badge')?.className || '';
    const iconEl  = card.querySelector('.product-image i');
    const iconClass = iconEl?.className || 'fas fa-box';
    const iconColor = iconEl?.style?.color || '#9ca3af';
    const bgStyle   = card.querySelector('.product-image > div')?.style?.background || '#f3f4f6';
    const productId = card.dataset.id || 'p-' + Math.random().toString(36).substr(2,6);

    modal.innerHTML = `
      <button id="bs-qv-close" aria-label="Close" style="position:absolute;top:16px;right:16px;background:#f3f4f6;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem;color:#374151;display:flex;align-items:center;justify-content:center;z-index:1;">
        <i class="fas fa-xmark"></i>
      </button>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;">
        <div style="height:340px;background:${bgStyle};display:flex;align-items:center;justify-content:center;border-radius:16px 0 0 16px;">
          <i class="${iconClass}" style="font-size:5rem;color:${iconColor};"></i>
        </div>
        <div style="padding:32px 28px;display:flex;flex-direction:column;justify-content:center;">
          ${badge ? `<span class="${badgeCls}" style="width:fit-content;margin-bottom:12px;">${badge}</span>` : ''}
          <p style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;font-family:var(--font-heading);font-weight:600;margin-bottom:4px;">${brand}</p>
          <h2 style="font-family:var(--font-heading);font-size:1.25rem;color:#0f2240;margin-bottom:12px;line-height:1.3;">${name}</h2>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
            <span style="color:var(--gold-500,#e6a800);font-size:1rem;">${rating}</span>
            <span style="font-size:0.8125rem;color:#6b7280;">${count}</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:20px;">
            <span style="font-family:var(--font-heading);font-size:1.75rem;font-weight:800;color:#0f2240;">${price}</span>
            ${orig ? `<span style="font-size:1rem;color:#9ca3af;text-decoration:line-through;">${orig}</span>` : ''}
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <div style="display:flex;align-items:center;border:2px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <button id="bs-qv-minus" style="width:36px;height:36px;background:none;border:none;cursor:pointer;font-size:1.1rem;color:#374151;">−</button>
              <span id="bs-qv-qty" style="width:36px;text-align:center;font-family:var(--font-heading);font-weight:700;">1</span>
              <button id="bs-qv-plus" style="width:36px;height:36px;background:none;border:none;cursor:pointer;font-size:1.1rem;color:#374151;">+</button>
            </div>
          </div>
          <button id="bs-qv-add" data-id="${productId}" data-name="${name}" data-brand="${brand}" style="padding:13px 20px;background:linear-gradient(135deg,#e6a800,#cc9500);color:#0a1628;border:none;border-radius:10px;font-family:var(--font-heading);font-weight:700;font-size:0.9375rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px;">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <button id="bs-qv-wishlist" data-id="${productId}" data-name="${name}" style="padding:11px 20px;background:transparent;color:#152d50;border:2px solid #4a7fb8;border-radius:10px;font-family:var(--font-heading);font-weight:600;font-size:0.875rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
            <i class="far fa-heart"></i> Save to Wishlist
          </button>
        </div>
      </div>`;

    // Wire up qty buttons
    let qty = 1;
    const qtyEl = $('#bs-qv-qty');
    $('#bs-qv-minus').addEventListener('click', () => { qty = clamp(qty - 1, 1, 99); qtyEl.textContent = qty; });
    $('#bs-qv-plus').addEventListener('click', () => { qty = clamp(qty + 1, 1, 99); qtyEl.textContent = qty; });

    $('#bs-qv-add').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const priceRaw = price.replace(/[^0-9,.]/g, '').replace(',', '');
      Cart.add({ id: btn.dataset.id, name: btn.dataset.name, brand, price: Math.round(parseFloat(priceRaw) * 100), qty, icon: iconClass });
      close();
    });

    $('#bs-qv-wishlist').addEventListener('click', (e) => {
      Wishlist.toggle(e.currentTarget.dataset.id, e.currentTarget.dataset.name);
    });

    $('#bs-qv-close').addEventListener('click', close);

    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    modal.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
    modal.focus();
  };

  const close = () => {
    const overlay = $('#bs-quickview-overlay');
    if (!overlay) return;
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    if (modal) modal.style.transform = 'scale(0.92)';
    document.body.style.overflow = '';
  };

  const init = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-view');
      if (!btn) return;
      const card = btn.closest('.product-card');
      if (card) open(card);
    });
  };

  return { init, open, close };
})();


/* ─────────────────────────────────────────────
   10. ADD TO CART — wire up all product cards
───────────────────────────────────────────── */
const ProductCards = (() => {
  const attachAddToCart = (card) => {
    const btn = card.querySelector('.add-to-cart');
    if (!btn || btn.dataset.wired) return;
    btn.dataset.wired = '1';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name    = card.querySelector('.product-name')?.textContent?.trim() || 'Product';
      const brand   = card.querySelector('.product-brand')?.textContent?.trim() || '';
      const priceEl = card.querySelector('.current-price');
      const priceStr = priceEl?.textContent?.replace(/[^0-9,.]/g, '').replace(/,(\d{2})$/, '.$1').replace(/,/g,'') || '0';
      const price   = Math.round(parseFloat(priceStr) * 100);
      const id      = card.dataset.id || 'p-' + name.substring(0, 8).replace(/\s/g,'-').toLowerCase();
      const iconEl  = card.querySelector('.product-image i');
      const icon    = iconEl?.className || 'fas fa-box';

      Cart.add({ id, name, brand, price, qty: 1, icon });

      // Button feedback
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      btn.classList.add('added');
      setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('added'); }, 1800);
    });
  };

  const init = () => {
    $$('.product-card').forEach(attachAddToCart);

    // Re-wire any dynamically injected cards via MutationObserver
    const grid = $('#productsGrid, .products-grid');
    if (grid) {
      new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.classList.contains('product-card')) attachAddToCart(node);
            node.querySelectorAll?.('.product-card').forEach(attachAddToCart);
          }
        }));
      }).observe(grid, { childList: true, subtree: true });
    }
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   11. CATEGORY QUICK-NAV PILLS
───────────────────────────────────────────── */
const CatNav = (() => {
  const init = () => {
    $$('.cat-nav-pill').forEach(pill => {
      pill.addEventListener('click', e => {
        e.preventDefault();
        const container = pill.closest('.cat-quick-nav-inner');
        if (container) $$('.cat-nav-pill', container).forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   12. NEWSLETTER FORM
───────────────────────────────────────────── */
const Newsletter = (() => {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const SUBSCRIBED_KEY = 'bs_subscribed';

  const init = () => {
    $$('.newsletter-form').forEach(form => {
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button');
      if (!input || !btn) return;

      // Already subscribed?
      if (lsGet(SUBSCRIBED_KEY)) {
        input.value = lsGet(SUBSCRIBED_KEY);
        input.disabled = true;
        btn.textContent = '✓ Subscribed';
        btn.disabled = true;
        btn.style.opacity = '0.7';
      }

      btn.addEventListener('click', () => submit(input, btn));
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(input, btn); });
    });
  };

  const submit = (input, btn) => {
    const email = input.value.trim();
    if (!EMAIL_RE.test(email)) {
      Toast.show('Please enter a valid email address.', 'error');
      input.focus();
      input.style.borderColor = 'var(--error)';
      setTimeout(() => { input.style.borderColor = ''; }, 2500);
      return;
    }
    // Simulate API
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    setTimeout(() => {
      lsSet(SUBSCRIBED_KEY, email);
      btn.textContent = '✓ Subscribed!';
      input.disabled = true;
      Toast.show(`You're subscribed! Look out for deals at <strong>${email}</strong>`, 'success', 4000);
    }, 900);
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   13. COUNTDOWN TIMER (Promo deals)
───────────────────────────────────────────── */
const Countdown = (() => {
  const pad = n => String(n).padStart(2, '0');

  const tick = (el, endTime) => {
    const diff = endTime - Date.now();
    if (diff <= 0) { el.textContent = 'Deal expired'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = d > 0
      ? `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`
      : `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const init = () => {
    $$('[data-countdown]').forEach(el => {
      // Attribute format: data-countdown="2025-12-31T23:59:59" or ms from now
      const raw = el.dataset.countdown;
      const endTime = isNaN(raw) ? new Date(raw).getTime() : Date.now() + parseInt(raw);
      tick(el, endTime);
      setInterval(() => tick(el, endTime), 1000);
    });

    // Promo stat "5d" counters get real countdown if they have data-days attribute
    $$('.cat-promo-stat-number[data-days]').forEach(el => {
      const days = parseInt(el.dataset.days);
      const endTime = Date.now() + days * 86400000;
      el.dataset.countdown = endTime;
      tick(el, endTime);
      setInterval(() => tick(el, endTime), 1000);
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   14. PAGINATION
───────────────────────────────────────────── */
const Pagination = (() => {
  const init = () => {
    $$('.cat-pagination').forEach(nav => {
      nav.addEventListener('click', (e) => {
        const btn = e.target.closest('.page-btn:not(.arrow)');
        if (!btn) return;
        $$('.page-btn', nav).forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); });
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');

        // Update prev/next arrow states
        const all  = $$('.page-btn:not(.arrow)', nav);
        const idx  = all.indexOf(btn);
        const prev = nav.querySelector('.page-btn.arrow:first-child');
        const next = nav.querySelector('.page-btn.arrow:last-child');
        if (prev) prev.disabled = idx === 0;
        if (next) next.disabled = idx === all.length - 1;

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // Arrow buttons
      $$('.page-btn.arrow', nav).forEach(arrow => {
        arrow.addEventListener('click', () => {
          const active = nav.querySelector('.page-btn.active:not(.arrow)');
          if (!active) return;
          const all = $$('.page-btn:not(.arrow)', nav);
          const idx = all.indexOf(active);
          const isNext = arrow === nav.querySelector('.page-btn.arrow:last-child');
          const target = all[isNext ? idx + 1 : idx - 1];
          target?.click();
        });
      });
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   15. STICKY HEADER SHADOW
───────────────────────────────────────────── */
const StickyHeader = (() => {
  const init = () => {
    const header = $('.main-header');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   16. SCROLL-TO-TOP BUTTON
───────────────────────────────────────────── */
const ScrollTop = (() => {
  const init = () => {
    const btn = document.createElement('button');
    btn.id = 'bs-scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '80px', right: '24px',
      width: '44px', height: '44px', borderRadius: '50%',
      background: 'var(--navy-700,#152d50)', color: '#fff',
      border: 'none', cursor: 'pointer', zIndex: '999',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1rem', boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
      opacity: '0', visibility: 'hidden',
      transition: 'all 0.3s ease',
    });
    document.body.appendChild(btn);

    window.addEventListener('scroll', debounce(() => {
      const show = window.scrollY > 400;
      btn.style.opacity = show ? '1' : '0';
      btn.style.visibility = show ? 'visible' : 'hidden';
    }, 100), { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   17. INTERSECTION OBSERVER — Animate on scroll
───────────────────────────────────────────── */
const AnimateOnScroll = (() => {
  const init = () => {
    if (!('IntersectionObserver' in window)) return;

    const targets = $$(`.product-card, .category-card, .subcat-card,
      .store-info-card, .offer-card, .promo-card, .cat-promo-stat`);

    targets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${(i % 6) * 60}ms, transform 0.5s ease ${(i % 6) * 60}ms`;
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => obs.observe(el));
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   18. COOKIE CONSENT BANNER
───────────────────────────────────────────── */
const CookieConsent = (() => {
  const STORAGE_KEY = 'bs_cookies_accepted';

  const init = () => {
    if (lsGet(STORAGE_KEY)) return;

    const banner = document.createElement('div');
    banner.id = 'bs-cookie-banner';
    Object.assign(banner.style, {
      position: 'fixed', bottom: '0', left: '0', right: '0',
      background: 'var(--navy-900,#0a1628)',
      borderTop: '3px solid var(--gold-500,#e6a800)',
      padding: '16px 24px', zIndex: '8000',
      display: 'flex', alignItems: 'center', gap: '20px',
      flexWrap: 'wrap', fontFamily: 'var(--font-body)',
      transform: 'translateY(100%)', transition: 'transform 0.4s ease',
    });

    banner.innerHTML = `
      <i class="fas fa-cookie-bite" style="color:var(--gold-400);font-size:1.5rem;flex-shrink:0;"></i>
      <p style="flex:1;font-size:0.875rem;color:#d1d5db;min-width:200px;">
        We use cookies to improve your shopping experience and remember your cart. 
        <a href="#" style="color:var(--gold-400);text-decoration:underline;">Learn more</a>
      </p>
      <button id="bs-cookie-accept" style="padding:9px 20px;background:var(--gold-500,#e6a800);color:#0a1628;border:none;border-radius:8px;font-family:var(--font-heading);font-weight:700;cursor:pointer;white-space:nowrap;">Accept All</button>
      <button id="bs-cookie-decline" style="padding:9px 20px;background:transparent;color:#9ca3af;border:2px solid #374151;border-radius:8px;font-family:var(--font-heading);font-weight:600;cursor:pointer;white-space:nowrap;">Essential Only</button>`;

    document.body.appendChild(banner);
    setTimeout(() => { banner.style.transform = 'translateY(0)'; }, 800);

    const dismiss = () => { banner.style.transform = 'translateY(100%)'; setTimeout(() => banner.remove(), 450); };
    $('#bs-cookie-accept').addEventListener('click', () => { lsSet(STORAGE_KEY, { all: true, date: new Date().toISOString() }); dismiss(); Toast.show('Preferences saved. Thank you!', 'success', 2000); });
    $('#bs-cookie-decline').addEventListener('click', () => { lsSet(STORAGE_KEY, { all: false, date: new Date().toISOString() }); dismiss(); });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   19. PROMO STRIP — Pause on hover
───────────────────────────────────────────── */
const PromoStrip = (() => {
  const init = () => {
    const strip = $('.promo-strip-inner');
    if (!strip) return;
    strip.addEventListener('mouseenter', () => { strip.style.animationPlayState = 'paused'; });
    strip.addEventListener('mouseleave', () => { strip.style.animationPlayState = 'running'; });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   20. BRAND FILTER (Category brand strip)
───────────────────────────────────────────── */
const BrandFilter = (() => {
  const init = () => {
    $$('.cat-brand-item').forEach(item => {
      item.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        $$('.cat-brand-item').forEach(b => {
          b.classList.remove('active');
          b.style.color = '';
          b.style.fontWeight = '';
        });
        if (!wasActive) {
          item.classList.add('active');
          item.style.color = 'var(--navy-700)';
          item.style.fontWeight = '900';
          Toast.show(`Filtering by <strong>${item.textContent}</strong>`, 'info', 1800);
        }
      });
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   21. FLOATING PRODUCT ANIMATION (Homepage banner)
───────────────────────────────────────────── */
const FloatingProducts = (() => {
  const init = () => {
    $$('.floating-product').forEach((el, i) => {
      el.style.setProperty('--delay', `${i * 0.8}s`);
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   22. HEADER SCROLL BEHAVIOUR
    Hides announcement bar on scroll down, restores on scroll up
───────────────────────────────────────────── */
const HeaderBehaviour = (() => {
  let lastY = 0;
  const init = () => {
    const bar = $('.announcement-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > lastY && y > 60) {
        bar.style.maxHeight = '0';
        bar.style.overflow = 'hidden';
        bar.style.transition = 'max-height 0.3s ease';
      } else if (y < lastY) {
        bar.style.maxHeight = '200px';
      }
      lastY = y;
    }, { passive: true });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   23. WISHLIST PAGE (if element exists)
───────────────────────────────────────────── */
const WishlistPage = (() => {
  const init = () => {
    const container = $('#bs-wishlist-page');
    if (!container) return;
    // Would render wishlist items from Wishlist module here
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   24. ACCESSIBILITY — Focus trap for modals
───────────────────────────────────────────── */
const FocusTrap = (() => {
  const FOCUSABLE = 'a,button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

  const trap = (container) => {
    const els = $$$(FOCUSABLE, container).filter(el => !el.offsetParent === false);
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    container.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
    });
  };

  // Extend $$ to support container
  const $$$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  return { trap };
})();


/* ─────────────────────────────────────────────
   25. GLOBAL KEYBOARD SHORTCUTS
───────────────────────────────────────────── */
const KeyboardShortcuts = (() => {
  const init = () => {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K  → focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = $('.search-bar input');
        input?.focus();
        input?.select();
      }
      // C → open/close cart (when not in an input)
      if (e.key === 'c' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
        Cart.open();
      }
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   26. WHATSAPP FLOAT BUTTON (common in ZA retail)
───────────────────────────────────────────── */
const WhatsAppFloat = (() => {
  const init = () => {
    const btn = document.createElement('a');
    btn.id = 'bs-whatsapp-float';
    btn.href = 'https://wa.me/270800BUILDS?text=Hi%2C%20I%20need%20help%20with%20a%20product';
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', 'Chat with us on WhatsApp');
    Object.assign(btn.style, {
      position: 'fixed', bottom: '24px', left: '24px',
      width: '52px', height: '52px', borderRadius: '50%',
      background: '#25D366', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.5rem', zIndex: '998',
      boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      textDecoration: 'none',
    });
    btn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.1)'; btn.style.boxShadow = '0 6px 20px rgba(37,211,102,0.5)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; btn.style.boxShadow = '0 4px 16px rgba(37,211,102,0.4)'; });
    document.body.appendChild(btn);
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   27. QUICK BUY — "Buy Now" shortcut
───────────────────────────────────────────── */
const QuickBuy = (() => {
  const init = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="buy-now"]');
      if (!btn) return;
      const card = btn.closest('.product-card');
      const addBtn = card?.querySelector('.add-to-cart');
      if (addBtn) { addBtn.click(); setTimeout(() => Cart.open(), 300); }
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────
   BOOT — Initialise all modules when DOM ready
───────────────────────────────────────────── */
const BuildSol = {
  init() {
    // Core UI
    MobileNav.init();
    StickyHeader.init();
    HeaderBehaviour.init();
    PromoStrip.init();
    ScrollTop.init();
    FloatingProducts.init();

    // Commerce
    Cart.init();
    Wishlist.init();
    ProductCards.init();
    QuickView.init();
    QuickBuy.init();

    // Search & Filters
    Search.init();
    Filters.init();
    CatNav.init();
    BrandFilter.init();
    ViewToggle.init();
    Pagination.init();

    // Slider
    HeroSlider.init();

    // Forms
    Newsletter.init();
    CookieConsent.init();

    // Enhancements
    Countdown.init();
    AnimateOnScroll.init();
    KeyboardShortcuts.init();
    WhatsAppFloat.init();
    WishlistPage.init();

    console.info('✅ BuildSol Hardware JS — all modules loaded.');
  },
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BuildSol.init());
} else {
  BuildSol.init();
}

/* ACCOUNT POPUP */

const accountBtn =
document.getElementById("accountBtn");

const accountModal =
document.getElementById("accountModal");

const closeAccount =
document.getElementById("closeAccount");

accountBtn.addEventListener("click", function(e){

    e.preventDefault();

    accountModal.classList.add("show");

});

closeAccount.addEventListener("click", function(){

    accountModal.classList.remove("show");

});

window.addEventListener("click", function(e){

    if(e.target === accountModal){

        accountModal.classList.remove("show");

    }

});

/* TABS */

const tabs =
document.querySelectorAll(".tab-btn");

const contents =
document.querySelectorAll(".tab-content");

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(btn =>
            btn.classList.remove("active")
        );

        contents.forEach(content =>
            content.classList.remove("active")
        );

        tab.classList.add("active");

        document
            .getElementById(tab.dataset.tab)
            .classList.add("active");

    });

});
