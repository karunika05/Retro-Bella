// RETRO BELLA — Cart
// The cart saves only product id + quantity in localStorage. Names, prices and images
// come from products.js. The cart is a full page (cart.html); checkout.html shows the
// "order placed" message.

const MAX_QTY = 10;
const FREE_SHIPPING_ABOVE = 500;
const FLAT_SHIPPING = 25;

window.Cart = {
  KEY: 'rb_cart',
  ORDER_KEY: 'rb_last_order',

  money(n) { return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }); },

  items() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) {}
    document.dispatchEvent(new Event('cart:updated'));
  },
  add(id) {
    if (!getProductById(id)) return;
    const items = this.items();
    const found = items.find(i => i.id === id);
    if (found) found.qty = Math.min(MAX_QTY, found.qty + 1);
    else items.push({ id: id, qty: 1 });
    this.save(items);
  },
  setQty(id, qty) {
    if (qty < 1) return this.remove(id);
    this.save(this.items().map(i => i.id === id ? { id: id, qty: Math.min(MAX_QTY, qty) } : i));
  },
  remove(id) { this.save(this.items().filter(i => i.id !== id)); },
  clear() { this.save([]); },

  // cart items joined with their product details
  details() {
    return this.items()
      .map(i => ({ product: getProductById(i.id), qty: i.qty }))
      .filter(i => i.product);
  },
  count() { return this.details().reduce((n, i) => n + i.qty, 0); },
  subtotal() { return this.details().reduce((sum, i) => sum + i.product.price * i.qty, 0); },
  shipping() {
    const sub = this.subtotal();
    return sub === 0 || sub >= FREE_SHIPPING_ABOVE ? 0 : FLAT_SHIPPING;
  },
  total() { return this.subtotal() + this.shipping(); },

  // Checkout: save a copy of the order for checkout.html, then empty the cart.
  placeOrder(customer) {
    const rows = this.details();
    if (!rows.length) return false;
    const order = {
      customer: customer || null,
      number: 'RB-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: rows.map(r => ({ name: r.product.name, qty: r.qty, price: r.product.price })),
      subtotal: this.subtotal(),
      shipping: this.shipping(),
      total: this.total()
    };
    try { localStorage.setItem(this.ORDER_KEY, JSON.stringify(order)); } catch (e) {}
    this.clear();
    return true;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // ---------- header cart icon: count badge (every page) ----------
  const cartLink = document.querySelector('.header-icons a[aria-label="Cart"]');
  const badge = document.createElement('span');
  badge.className = 'cart-badge';
  if (cartLink) cartLink.appendChild(badge);

  function updateBadge() {
    const n = Cart.count();
    badge.textContent = n > 99 ? '99+' : n;
    badge.classList.toggle('show', n > 0);
  }
  document.addEventListener('cart:updated', updateBadge);
  updateBadge();

  // ---------- cart page (only runs where #cartItems exists) ----------
  const list = document.getElementById('cartItems');
  if (!list) return;

  const layout = document.getElementById('cartLayout');
  const empty = document.getElementById('cartEmpty');

  function render() {
    const rows = Cart.details();
    layout.style.display = rows.length ? '' : 'none';
    empty.style.display = rows.length ? 'none' : 'block';

    list.innerHTML = rows.map(r => {
      const p = r.product;
      return `
        <article class="cart-item" data-id="${p.id}">
          <div class="cart-thumb${p.contain ? ' is-contain' : ''}" style="--c1:${p.c1}; --c2:${p.c2}">
            <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
          </div>
          <div class="cart-info">
            <span class="cart-cat">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</span>
            <h3>${p.name}</h3>
            <span class="cart-unit">${Cart.money(p.price)} each</span>
            <button type="button" class="cart-remove" data-action="remove">Remove item</button>
          </div>
          <div class="cart-qty">
            <button type="button" data-action="dec" aria-label="Decrease quantity">−</button>
            <span>${r.qty}</span>
            <button type="button" data-action="inc" aria-label="Increase quantity"${r.qty >= MAX_QTY ? ' disabled' : ''}>+</button>
          </div>
          <div class="cart-line">${Cart.money(p.price * r.qty)}</div>
        </article>`;
    }).join('');

    const sub = Cart.subtotal();
    const ship = Cart.shipping();
    document.getElementById('sumCount').textContent = Cart.count();
    document.getElementById('sumSubtotal').textContent = Cart.money(sub);
    document.getElementById('sumShipping').textContent = rows.length ? (ship === 0 ? 'Free' : Cart.money(ship)) : '—';
    document.getElementById('sumTotal').textContent = Cart.money(Cart.total());
    document.getElementById('shipNote').textContent = !rows.length ? ''
      : ship > 0 ? 'Add ' + Cart.money(FREE_SHIPPING_ABOVE - sub) + ' more for free shipping.'
      : "You've unlocked free shipping.";
  }

  // + / − / remove buttons
  list.addEventListener('click', e => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;
    const id = button.closest('.cart-item').dataset.id;
    const current = Cart.items().find(i => i.id === id);
    if (!current) return;
    if (button.dataset.action === 'inc') Cart.setQty(id, current.qty + 1);
    if (button.dataset.action === 'dec') Cart.setQty(id, current.qty - 1);
    if (button.dataset.action === 'remove') Cart.remove(id);
  });

  document.getElementById('clearCart').addEventListener('click', () => Cart.clear());

  // Checkout: go to the checkout page to collect customer details first
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (Cart.count() > 0) window.location.href = 'checkout.html';
  });

  document.addEventListener('cart:updated', render);
  render();
});
