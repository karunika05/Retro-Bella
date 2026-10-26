// RETRO BELLA — Shop page
// Product cards are built from PRODUCTS (js/products.js). The category pills, search,
// price / size / colour filters and sort all work on that one list:
// change `state`, then call render().

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('productGrid');
  const emptyNote = document.getElementById('emptyNote');
  const pills = document.querySelectorAll('.filter-pill');
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('filterPanel');
  const filterBadge = document.getElementById('filterBadge');
  const filterClear = document.getElementById('filterClear');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const resultCount = document.getElementById('resultCount');
  const colorGrid = document.getElementById('colorGrid');

  if (typeof PRODUCTS === 'undefined') {
    grid.textContent = 'Products could not be loaded. Please check js/products.js.';
    return;
  }

  const emptyDefault = emptyNote.textContent;
  const state = { cat: 'all', prices: [], sizes: [], colors: [], q: '' };
  const money = n => '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  // ---------- one product card ----------
  function cardHTML(p) {
    const saved = Wishlist.has(p.id);
    return `
      <article class="product-card" data-id="${p.id}" style="--c1:${p.c1}; --c2:${p.c2}">
        <div class="product-media">
          <img class="${p.contain ? 'fit-contain' : ''}" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
        </div>
        <div class="product-info">
          <div><h3>${p.name}</h3><span class="cat-label">${cap(p.category)}</span></div>
          <span class="product-price">${money(p.price)}</span>
        </div>
        <div class="product-sizes"><em>Sizes</em>${p.sizes.map(s => '<span>' + s + '</span>').join('')}</div>
        <div class="card-actions">
          <button type="button" class="add-cart-btn">Add to Cart</button>
          <button type="button" class="wishlist-btn${saved ? ' is-wishlisted' : ''}" aria-pressed="${saved}"
                  aria-label="${saved ? 'Remove ' + p.name + ' from wishlist' : 'Add ' + p.name + ' to wishlist'}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
          </button>
        </div>
      </article>`;
  }

  // ---------- which products match the current filters, in the chosen order ----------
  function getList() {
    const list = PRODUCTS.filter(p => {
      if (state.cat !== 'all' && p.category !== state.cat) return false;
      if (state.prices.length && !state.prices.some(r => {
        const [lo, hi] = r.split('-').map(Number);
        return p.price >= lo && p.price < hi;
      })) return false;
      if (state.sizes.length && !state.sizes.some(s => p.sizes.includes(s))) return false;
      if (state.colors.length && !state.colors.includes(p.color)) return false;
      if (state.q && !(p.name + ' ' + p.category + ' ' + p.color).toLowerCase().includes(state.q)) return false;
      return true;
    });

    const sort = sortSelect.value;
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;                                   // "featured" keeps products.js order
  }

  function render() {
    const list = getList();
    grid.innerHTML = list.map(cardHTML).join('');
    resultCount.textContent = list.length + (list.length === 1 ? ' piece' : ' pieces');

    const extra = state.prices.length + state.sizes.length + state.colors.length;
    filterBadge.textContent = extra;
    filterBadge.hidden = extra === 0;

    emptyNote.textContent = (extra || state.q) ? 'No pieces match these filters — try clearing some.' : emptyDefault;
    emptyNote.classList.toggle('show', list.length === 0);
  }

  // ---------- Promise feedback toast (appears beside the clicked heart) ----------
  let wishlistToastTimer;

  // Add toast styles here so this feature does not require changing shop.css.
  if (!document.getElementById('wishlist-promise-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'wishlist-promise-toast-styles';
    style.textContent = `
      .wishlist-heart-toast {
        position: fixed; z-index: 99999; transform: translate(-50%, 0);
        max-width: min(290px, calc(100vw - 24px)); padding: 10px 14px;
        border-radius: 8px; color: #fff; font-family: inherit; font-size: 13px; font-weight: 600; line-height: 1.35;
        text-align: center; box-shadow: 0 5px 18px rgba(0,0,0,.2);
        opacity: 1; pointer-events: none; transition: opacity .2s ease, transform .2s ease;
      }
      .wishlist-heart-toast.is-success { background: #176b45; }
      .wishlist-heart-toast.is-error { background: #b42318; }
    `;
    document.head.appendChild(style);
  }

  function showWishlistToast(heart, message, type) {
    document.querySelectorAll('.wishlist-heart-toast').forEach(toast => toast.remove());
    const toast = document.createElement('div');
    toast.className = 'wishlist-heart-toast ' + type;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;

    const rect = heart.getBoundingClientRect();
    const left = Math.max(145, Math.min(window.innerWidth - 145, rect.left + rect.width / 2));
    const top = Math.max(12, rect.top - 48);
    toast.style.left = left + 'px';
    toast.style.top = top + 'px';
    document.body.appendChild(toast);

    clearTimeout(wishlistToastTimer);
    wishlistToastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 6px)';
      setTimeout(() => toast.remove(), 220);
    }, 2000);
  }

  // ---------- add to cart + Promise-based wishlist hearts ----------
  grid.addEventListener('click', async e => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    // Keep the original Add to Cart behaviour unchanged.
    const addButton = e.target.closest('.add-cart-btn');
    if (addButton) {
      const product = getProductById(card.dataset.id);
      if (!product) return;
      Cart.add(product.id);
      addButton.textContent = 'Added ✓';
      setTimeout(() => { addButton.textContent = 'Add to Cart'; }, 1400);
      return;
    }

    const heart = e.target.closest('.wishlist-btn');
    if (!heart) return;

    // Prevent rapid repeated clicks while the Promise is being checked.
    if (heart.dataset.promisePending === 'true') return;
    heart.dataset.promisePending = 'true';
    heart.disabled = true;

    try {
      const product = await Wishlist.getProductByIdAsync(card.dataset.id);
      Wishlist.toggle(product.id);
      // wishlist:updated keeps the heart, header badge and drawer in sync.
      showWishlistToast(heart, 'Promise succeeded: product found! ♥', 'is-success');
    } catch (error) {
      console.error('Wishlist Promise failed:', error);
      showWishlistToast(heart, 'Promise failed: product not found.', 'is-error');
    } finally {
      delete heart.dataset.promisePending;
      heart.disabled = false;
    }
  });

  // keep every heart in step with the wishlist (also when it changes in the side drawer)
  function syncHearts() {
    grid.querySelectorAll('.product-card').forEach(card => {
      const product = getProductById(card.dataset.id);
      const saved = Wishlist.has(product.id);
      const heart = card.querySelector('.wishlist-btn');
      heart.classList.toggle('is-wishlisted', saved);
      heart.setAttribute('aria-pressed', String(saved));
      heart.setAttribute('aria-label', (saved ? 'Remove ' : 'Add ') + product.name + (saved ? ' from wishlist' : ' to wishlist'));
    });
  }
  document.addEventListener('wishlist:updated', syncHearts);

  // ---------- category pills ----------
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.cat = pill.dataset.filter;
      render();
    });
  });

  // ---------- filter panel ----------
  // colour chips are built from the colours that exist in products.js
  const DOT = {
    Black: '#1a1a1a', White: '#ffffff', Red: '#9b1c2c', Blue: '#3b6ea5', Brown: '#7a4a2b',
    Green: '#4f7a4a', Pink: '#e8a3b5', Purple: '#6b4a8a', Yellow: '#e5c14d', Neutral: '#d8c6b2',
    Multi: 'conic-gradient(#9b1c2c, #e5c14d, #4f7a4a, #3b6ea5, #9b1c2c)'
  };
  [...new Set(PRODUCTS.map(p => p.color))].sort().forEach(name => {
    colorGrid.insertAdjacentHTML('beforeend',
      `<button type="button" class="color-chip" data-value="${name}" aria-pressed="false">
         <span class="color-dot" style="background:${DOT[name] || '#ccc'}"></span>${name}
       </button>`);
  });
  filterPanel.querySelectorAll('.size-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));

  filterToggle.addEventListener('click', () => {
    const opening = filterPanel.hidden;
    filterPanel.hidden = !opening;
    filterToggle.setAttribute('aria-expanded', String(opening));
  });

  // read the panel's ticked boxes / pressed chips into `state`
  function readPanel() {
    const values = sel => Array.from(filterPanel.querySelectorAll(sel)).map(el => el.dataset.value || el.value);
    state.prices = values('[data-group="price"] input:checked');
    state.sizes = values('.size-chip.active');
    state.colors = values('.color-chip.active');
    render();
  }
  filterPanel.addEventListener('change', readPanel);                 // price checkboxes
  filterPanel.addEventListener('click', e => {                       // size + colour chips
    const chip = e.target.closest('.size-chip, .color-chip');
    if (!chip) return;
    chip.classList.toggle('active');
    chip.setAttribute('aria-pressed', String(chip.classList.contains('active')));
    readPanel();
  });

  searchInput.addEventListener('input', () => { state.q = searchInput.value.trim().toLowerCase(); render(); });
  sortSelect.addEventListener('change', render);

  // "Clear filters": price / size / colour / search (the category pill stays as it is)
  filterClear.addEventListener('click', () => {
    filterPanel.querySelectorAll('input:checked').forEach(box => { box.checked = false; });
    filterPanel.querySelectorAll('.active').forEach(chip => {
      chip.classList.remove('active');
      chip.setAttribute('aria-pressed', 'false');
    });
    searchInput.value = '';
    state.q = '';
    readPanel();
  });

  render();

  // ---------- deep links: shop.html#bags  and  shop.html?category=party-wear ----------
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const match = document.querySelector('.filter-pill[data-filter="' + CSS.escape(hash) + '"]');
    if (match) match.click();
  }

  // "Shop the Look" cards on the homepage link here. Each look uses an existing category pill.
  const LOOKS = {
    'quiet-luxury':  { label: 'Quiet Luxury',  filter: 'women' },
    'party-wear':    { label: 'Party Girl',    filter: 'dresses' },
    'street-style':  { label: 'Street Style',  filter: 'men' },
    'retro-glam':    { label: 'Retro Glam',    filter: 'bags' },
    'everyday-chic': { label: 'Everyday Chic', filter: 'footwear' }
  };
  const look = LOOKS[(new URLSearchParams(window.location.search).get('category') || '').toLowerCase()];
  const lookPill = look && document.querySelector('.filter-pill[data-filter="' + look.filter + '"]');
  if (lookPill) {
    lookPill.click();

    // "Showing: Party Girl · Clear filter ×"
    const bar = document.createElement('div');
    bar.className = 'stl-showing';
    bar.innerHTML = '<span>Showing: <strong>' + look.label + '</strong></span>' +
                    '<button type="button" class="stl-showing-clear">Clear filter ×</button>';
    grid.parentNode.insertBefore(bar, grid);

    const removeBar = () => {
      bar.remove();
      window.history.replaceState({}, document.title, window.location.pathname);
    };
    bar.querySelector('button').addEventListener('click', () => {
      document.querySelector('.filter-pill[data-filter="all"]').click();   // this also runs removeBar
    });
    pills.forEach(p => p.addEventListener('click', removeBar, { once: true }));
  }
});