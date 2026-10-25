// RETRO BELLA — Wishlist (opens as a side drawer)
// Saves product ids in localStorage. The drawer HTML is added to the page from here,
// so any page just needs: css/wishlist.css, js/products.js, js/cart.js, js/wishlist.js.

window.Wishlist = {
  KEY: 'retroBellaWishlist',

  ids() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.KEY)) || [];
      // older versions saved whole product objects, so accept those too
      return saved.map(x => typeof x === 'string' ? x : x && x.id).filter(Boolean);
    } catch (e) { return []; }
  },
  has(id) { return this.ids().includes(id); },

  // add or remove; returns true if the product is now saved
  toggle(id) {
    const ids = this.ids();
    const next = ids.includes(id) ? ids.filter(x => x !== id) : ids.concat(id);
    try { localStorage.setItem(this.KEY, JSON.stringify(next)); } catch (e) {}
    document.dispatchEvent(new Event('wishlist:updated'));
    return next.includes(id);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // ---------- build the drawer ----------
  document.body.insertAdjacentHTML('beforeend', `
    <div class="wl-overlay" id="wlOverlay"></div>
    <aside class="wl-drawer" id="wlDrawer" role="dialog" aria-modal="true" aria-label="Your wishlist" aria-hidden="true">
      <div class="wl-head">
        <h2>Wishlist <span id="wlCount"></span></h2>
        <button type="button" class="wl-close" id="wlClose" aria-label="Close wishlist">&times;</button>
      </div>
      <div class="wl-body" id="wlItems"></div>
      <div class="wl-foot"><a href="cart.html" class="btn-primary">Go to bag</a></div>
    </aside>`);

  const drawer = document.getElementById('wlDrawer');
  const overlay = document.getElementById('wlOverlay');
  const list = document.getElementById('wlItems');
  const closeBtn = document.getElementById('wlClose');
  const money = n => '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
  let opener = null;

  // ---------- open / close ----------
  function open() {
    render();                                      // always show the latest list
    opener = document.activeElement;
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }
  Wishlist.open = open;
  Wishlist.close = close;

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });

  // ---------- draw the saved pieces ----------
  function render() {
    const products = Wishlist.ids().map(getProductById).filter(Boolean);
    document.getElementById('wlCount').textContent = products.length ? '(' + products.length + ')' : '';

    list.innerHTML = products.length ? products.map(p => `
      <article class="wl-row" data-id="${p.id}">
        <div class="wl-thumb${p.contain ? ' is-contain' : ''}" style="--c1:${p.c1}; --c2:${p.c2}">
          <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
        </div>
        <div class="wl-info">
          <h3>${p.name}</h3>
          <span class="wl-price">${money(p.price)}</span>
          <div class="wl-buttons">
            <button type="button" class="wl-add" data-action="add">Add to Cart</button>
            <button type="button" class="wl-remove" data-action="remove">Remove</button>
          </div>
        </div>
      </article>`).join('')
      : '<p class="wl-empty">Nothing saved yet.<br>Tap the heart on any piece to save it here.</p>';
  }

  list.addEventListener('click', e => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;
    const id = button.closest('.wl-row').dataset.id;

    if (button.dataset.action === 'remove') {
      Wishlist.toggle(id);                         // already saved, so this removes it
    } else {
      Cart.add(id);                                // stays in the wishlist too
      button.textContent = 'Added ✓';
      setTimeout(() => { button.textContent = 'Add to Cart'; }, 1400);
    }
  });

  // ---------- header heart: count badge + opens the drawer ----------
  const link = document.querySelector('.header-icons a[aria-label="Wishlist"]');
  const badge = document.createElement('span');
  badge.className = 'wishlist-badge';
  if (link) {
    link.appendChild(badge);
    link.addEventListener('click', e => { e.preventDefault(); open(); });
  }
  function updateBadge() {
    const n = Wishlist.ids().length;
    badge.textContent = n > 99 ? '99+' : n;
    badge.classList.toggle('show', n > 0);
  }

  document.addEventListener('wishlist:updated', () => { render(); updateBadge(); });
  render();
  updateBadge();
});
