// RETRO BELLA — Checkout page
// Step 1: collect and validate the customer's details (only when the bag has items).
//         If the user is logged in, the form is pre-filled from their account / saved details.
// Step 2: place the order with Cart.placeOrder(customer), save the details to the user's
//         account (shown when they click their name in the header) and show the confirmation.

document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('checkoutLayout');
  const form = document.getElementById('checkoutForm');
  const box = document.getElementById('orderBox');
  const bannerTitle = document.getElementById('bannerTitle');
  const bannerSub = document.getElementById('bannerSub');
  const formError = document.getElementById('formError');

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- validation rules: each returns an error message, or '' when valid ----------
  const rules = {
    fullName(v) {
      if (!v) return 'Please enter your full name.';
      if (v.length < 2) return 'Name is too short.';
      if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(v)) return 'Name can only contain letters, spaces, . \' and -';
      return '';
    },
    email(v) {
      if (!v) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email, e.g. name@example.com.';
      return '';
    },
    phone(v) {
      if (!v) return 'Please enter your phone number.';
      if (!/^\+?[\d\s().-]+$/.test(v)) return 'Phone can only contain digits, spaces, + ( ) - .';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) return 'Phone number must have 7 to 15 digits.';
      return '';
    },
    address1(v) {
      if (!v) return 'Please enter your street address.';
      if (v.length < 5) return 'Address looks too short.';
      return '';
    },
    address2(v) { return v.length > 100 ? 'Keep this under 100 characters.' : ''; },
    city(v) {
      if (!v) return 'Please enter your city.';
      if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(v)) return 'City can only contain letters and spaces.';
      return '';
    },
    state(v) {
      if (!v) return 'Please enter your state or province.';
      if (v.length < 2) return 'State looks too short.';
      return '';
    },
    postal(v) {
      if (!v) return 'Please enter your postal / ZIP code.';
      if (!/^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(v)) return 'Enter a valid postal code (3 to 10 letters / digits).';
      return '';
    },
    country(v) { return v ? '' : 'Please select your country.'; },
    notes(v) { return v.length > 300 ? 'Keep notes under 300 characters.' : ''; }
  };

  const fieldNames = Object.keys(rules);

  function check(name) {
    const input = form.elements[name];
    const value = input.value.trim();
    const message = rules[name](value);
    const wrap = input.closest('.field');
    wrap.classList.toggle('invalid', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    input.setAttribute('aria-describedby', name + '-error');
    document.getElementById(name + '-error').textContent = message;
    return !message;
  }

  // validate when leaving a field, then live while the customer fixes it
  fieldNames.forEach(name => {
    const input = form.elements[name];
    input.addEventListener('blur', () => check(name));
    input.addEventListener('input', () => {
      if (input.closest('.field').classList.contains('invalid')) check(name);
      formError.textContent = '';
    });
    input.addEventListener('change', () => check(name));
  });

  // ---------- pre-fill for logged-in users ----------
  function prefill() {
    const me = window.Auth && Auth.current();
    if (!me) return;
    const p = me.profile || {};
    const set = (name, value) => { if (value && form.elements[name] && !form.elements[name].value) form.elements[name].value = value; };
    set('fullName', me.name);
    set('email', me.email);
    set('phone', p.phone);
    set('address1', p.address1);
    set('address2', p.address2);
    set('city', p.city);
    set('state', p.state);
    set('postal', p.postal);
    set('country', p.country);
  }

  // ---------- order summary (right-hand side) ----------
  function renderSummary() {
    document.getElementById('summaryItems').innerHTML = Cart.details().map(r => `
      <div class="summary-row-item">
        <span>${esc(r.product.name)} × ${r.qty}</span>
        <span>${Cart.money(r.product.price * r.qty)}</span>
      </div>`).join('');
    const ship = Cart.shipping();
    document.getElementById('coSubtotal').textContent = Cart.money(Cart.subtotal());
    document.getElementById('coShipping').textContent = ship === 0 ? 'Free' : Cart.money(ship);
    document.getElementById('coTotal').textContent = Cart.money(Cart.total());
  }

  // ---------- submit ----------
  form.addEventListener('submit', e => {
    e.preventDefault();
    formError.textContent = '';

    const invalid = fieldNames.filter(name => !check(name));
    if (invalid.length) {
      formError.textContent = 'Please fix the highlighted fields and try again.';
      form.elements[invalid[0]].focus();
      return;
    }
    if (!Cart.count()) {
      formError.textContent = 'Your bag is empty. Add something before checking out.';
      return;
    }

    const v = name => form.elements[name].value.trim();
    const customer = {
      name: v('fullName'), email: v('email'), phone: v('phone'),
      address1: v('address1'), address2: v('address2'), city: v('city'),
      state: v('state'), postal: v('postal'), country: v('country'), notes: v('notes')
    };

    if (Cart.placeOrder(customer)) {
      // save phone + address to the logged-in user's account (shown under their name in the header)
      if (window.Auth) Auth.saveProfile(customer);
      showConfirmation();
    }
  });

  // ---------- confirmation ----------
  function showMessage(title, text) {
    layout.hidden = true;
    box.hidden = false;
    bannerTitle.textContent = title;
    bannerSub.textContent = text;
    box.innerHTML = `
      <h2>${title}</h2>
      <p class="order-text">${text}</p>
      <div class="order-buttons"><a href="shop.html" class="btn-primary">Start Shopping</a></div>`;
  }

  function showConfirmation() {
    let order = null;
    try { order = JSON.parse(localStorage.getItem(Cart.ORDER_KEY)); } catch (e) {}
    if (!order) return showMessage('No order to show', "You haven't placed an order yet. Add something to your bag first.");

    const c = order.customer;
    layout.hidden = true;
    box.hidden = false;
    bannerTitle.textContent = 'Order Placed';
    bannerSub.textContent = 'Thank you for shopping with Retro Bella.';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const firstName = c ? esc(c.name.split(' ')[0]) : '';
    const addrLines = c ? [
      esc(c.name),
      esc(c.address1) + (c.address2 ? ', ' + esc(c.address2) : ''),
      esc(c.city) + ', ' + esc(c.state) + ' ' + esc(c.postal),
      esc(c.country)
    ].join('<br>') : '';

    box.innerHTML = `
      <div class="conf">
        <div class="conf-check">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
        </div>
        <span class="conf-eyebrow">Order confirmed</span>
        <h2 class="conf-title">Thank you${firstName ? ', ' + firstName : ''}</h2>
        <p class="conf-text">Your order has been placed and we're getting it ready${c ? '. A confirmation will be sent to <strong>' + esc(c.email) + '</strong>' : ''}.</p>

        <div class="conf-meta">
          <div><span>Order number</span><strong>${esc(order.number)}</strong></div>
          <div><span>Date</span><strong>${esc(order.date)}</strong></div>
          <div><span>Total</span><strong>${Cart.money(order.total)}</strong></div>
        </div>

        ${c ? `
        <div class="conf-grid">
          <section class="conf-block">
            <h3>Shipping to</h3>
            <address>${addrLines}</address>
            ${c.notes ? '<p class="conf-note">Note: ' + esc(c.notes) + '</p>' : ''}
          </section>
          <section class="conf-block">
            <h3>Contact</h3>
            <p>${esc(c.email)}<br>${esc(c.phone)}</p>
          </section>
        </div>` : ''}

        <section class="conf-block conf-items">
          <h3>Order summary</h3>
          ${order.items.map(i => `
            <div class="conf-row">
              <span>${esc(i.name)} <em>× ${i.qty}</em></span>
              <span>${Cart.money(i.price * i.qty)}</span>
            </div>`).join('')}
          <div class="conf-row conf-sub"><span>Subtotal</span><span>${Cart.money(order.subtotal)}</span></div>
          <div class="conf-row conf-sub"><span>Shipping</span><span>${order.shipping === 0 ? 'Free' : Cart.money(order.shipping)}</span></div>
          <div class="conf-row conf-total"><span>Total</span><span>${Cart.money(order.total)}</span></div>
        </section>

        <div class="conf-actions">
          <a href="shop.html" class="btn-primary">Continue Shopping</a>
          <a href="index.html" class="conf-home">Back to home</a>
        </div>
      </div>`;
  }

  // ---------- which step to show on load ----------
  if (Cart.count() > 0) {
    prefill();
    renderSummary();                     // bag has items: show the details form
  } else if (localStorage.getItem(Cart.ORDER_KEY)) {
    showConfirmation();                  // refreshed after ordering: show the last order again
  } else {
    showMessage('Your bag is empty', 'Add something to your bag before checking out.');
  }
});