// RETRO BELLA — shared auth module (include on EVERY page, before main.js)
// Stores users + session in localStorage (demo only — a real shop needs a backend).
// Header (left -> right):  [ Name ▾ ]  [ Logout ]  [ wishlist ]  [ cart ]
// When logged out:         [ Sign In ] [ Sign Up ]  [ wishlist ]  [ cart ]

(function () {
  const USERS_KEY = 'rb_users';
  const SESSION_KEY = 'rb_session';

  const read = (k, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // simple string hash so the plain password is not stored (demo-level only)
  function hash(s) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0, ch; i < s.length; i++) {
      ch = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }

  const users = () => read(USERS_KEY, []);
  const findUser = email => users().find(u => u.email === String(email).trim().toLowerCase());

  const Auth = {
    emailExists(email) { return !!findUser(email); },

    register({ name, email, password }) {
      email = String(email).trim().toLowerCase();
      if (findUser(email)) return { ok: false, error: 'An account with this email already exists. Please sign in.' };
      const list = users();
      list.push({ name: String(name).trim(), email, passHash: hash(password), profile: null, createdAt: Date.now() });
      write(USERS_KEY, list);
      localStorage.setItem(SESSION_KEY, email);
      return { ok: true };
    },

    login(email, password) {
      const u = findUser(email);
      if (!u) return { ok: false, field: 'email', error: 'No account found with this email. Please create an account first.' };
      if (u.passHash !== hash(password)) return { ok: false, field: 'password', error: 'Incorrect password. Please try again.' };
      localStorage.setItem(SESSION_KEY, u.email);
      return { ok: true };
    },

    current() {
      const email = localStorage.getItem(SESSION_KEY);
      return email ? (findUser(email) || null) : null;
    },

    logout() {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'index.html';
    },

    // called from checkout after an order: saves contact + shipping details to the logged-in user
    saveProfile(customer) {
      const me = Auth.current();
      if (!me) return false;
      const list = users();
      const u = list.find(x => x.email === me.email);
      u.profile = {
        phone: customer.phone, address1: customer.address1, address2: customer.address2 || '',
        city: customer.city, state: customer.state, postal: customer.postal, country: customer.country
      };
      write(USERS_KEY, list);
      return true;
    }
  };
  window.Auth = Auth;

  // ---------- styles (injected so no extra CSS file is needed) ----------
  const css = `
  .user-menu{ position:relative; display:flex; align-items:center; }
  .user-name-btn{ background:none; border:0; cursor:pointer; color:inherit; max-width:150px; overflow:hidden; text-overflow:ellipsis; }
  .user-name-btn::after{ content:" ▾"; font-size:0.7em; }
  .user-dropdown{
    position:absolute; right:0; top:calc(100% + 10px); z-index:400; width:280px; max-width:calc(100vw - 32px);
    padding:20px 22px; background:#FFFCF6; color:#4D0909; text-align:left;
    border:1px solid rgba(77,9,9,0.16); box-shadow:0 18px 40px rgba(77,9,9,0.18);
  }
  .user-dropdown[hidden]{ display:none; }
  .user-dropdown h4{ margin:0 0 14px; font-family:'Bodoni Moda', serif; font-style:italic; font-weight:500; font-size:1.2rem; overflow-wrap:anywhere; }
  .user-dropdown dl{ margin:0; display:grid; gap:10px; }
  .user-dropdown dt{ font-family:'Archivo Expanded', sans-serif; font-size:0.58rem; letter-spacing:0.14em; text-transform:uppercase; opacity:0.55; }
  .user-dropdown dd{ margin:2px 0 0; font-size:0.88rem; line-height:1.5; overflow-wrap:anywhere; }
  .user-dropdown .ud-empty{ font-size:0.82rem; opacity:0.7; line-height:1.5; }
  .rb-cart-badge{
    position:absolute; top:6px; right:2px; min-width:18px; height:18px; padding:0 5px;
    display:flex; align-items:center; justify-content:center; border-radius:999px;
    background:#4D0909; color:#FFFCF6; font:600 10px/1 'Inter', sans-serif; pointer-events:none;
  }
  .rb-cart-badge[hidden]{ display:none; }
  header.on-video:not(.scrolled) .rb-cart-badge{ background:#F0DCC0; color:#4D0909; }
  .auth-field.invalid input{ border-bottom-color:#b3261e !important; }
  .auth-field .err{ color:#b3261e !important; }
  .auth-field .hint{ display:block; margin-top:6px; font-size:0.7rem; opacity:0.6; line-height:1.4; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- cart link + item-count badge (shown for logged-in users) ----------
  function cartCount() {
    try { if (window.Cart && typeof Cart.count === 'function') return Cart.count() || 0; } catch (e) {}
    // fallback when cart.js is not loaded on this page: read the saved cart straight from localStorage
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!/cart|bag/i.test(key) || /order/i.test(key)) continue;
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(data)) data.forEach(it => { total += Number(it && (it.qty || it.quantity)) || 1; });
        else if (data && typeof data === 'object') Object.values(data).forEach(v => { total += Number(v && v.qty != null ? v.qty : v) || 0; });
      } catch (e) {}
    }
    return total;
  }

  function setupCart(box) {
    const link = box.querySelector('a[aria-label="Cart"]');
    if (!link) return;
    link.href = 'cart.html';
    link.style.position = 'relative';
    // if cart.js already draws its own badge, do not add a second one
    if (link.querySelector('.cart-count, .cart-badge, [data-cart-count]')) return;
    let badge = link.querySelector('.rb-cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'rb-cart-badge';
      link.appendChild(badge);
    }
    const update = () => {
      const n = cartCount();
      badge.textContent = n > 99 ? '99+' : String(n);
      badge.hidden = n < 1;
    };
    update();
    window.addEventListener('storage', update);
    setInterval(update, 600);   // same-tab changes (add to bag) don't fire "storage"
  }

  // ---------- header ----------
  function renderHeader() {
    const box = document.querySelector('header .header-icons');
    if (!box) return;
    box.querySelectorAll('.nav-text-btn, .user-menu').forEach(el => el.remove());

    const me = Auth.current();
    const frag = document.createDocumentFragment();

    if (!me) {
      const signIn = document.createElement('a');
      signIn.href = 'login.html';
      signIn.className = 'icon-btn nav-text-btn';
      signIn.textContent = 'Sign In';
      const signUp = document.createElement('a');
      signUp.href = 'login.html?tab=signup';
      signUp.className = 'icon-btn nav-text-btn';
      signUp.textContent = 'Sign Up';
      box.prepend(signIn, signUp);
      return;
    }

    const p = me.profile;
    const details = p ? `
      <dl>
        <div><dt>Email</dt><dd>${esc(me.email)}</dd></div>
        <div><dt>Phone</dt><dd>${esc(p.phone)}</dd></div>
        <div><dt>Address</dt><dd>${esc(p.address1)}${p.address2 ? ', ' + esc(p.address2) : ''}<br>${esc(p.city)}, ${esc(p.state)} ${esc(p.postal)}<br>${esc(p.country)}</dd></div>
      </dl>` : `
      <dl><div><dt>Email</dt><dd>${esc(me.email)}</dd></div></dl>
      <p class="ud-empty" style="margin-top:12px;">Phone and address will appear here after your first checkout.</p>`;

    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
      <button type="button" class="icon-btn nav-text-btn user-name-btn" id="userNameBtn" aria-haspopup="true" aria-expanded="false" title="${esc(me.name)}">${esc(me.name)}</button>
      <div class="user-dropdown" id="userDropdown" hidden>
        <h4>${esc(me.name)}</h4>
        ${details}
      </div>`;

    const logout = document.createElement('button');
    logout.type = 'button';
    logout.className = 'icon-btn nav-text-btn';
    logout.id = 'logoutBtn';
    logout.textContent = 'Logout';

    frag.append(menu, logout);
    box.prepend(frag);
    setupCart(box);

    const btn = menu.querySelector('#userNameBtn');
    const dd = menu.querySelector('#userDropdown');
    const toggle = open => { dd.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', e => { e.stopPropagation(); toggle(dd.hidden); });
    document.addEventListener('click', e => { if (!menu.contains(e.target)) toggle(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
    logout.addEventListener('click', () => Auth.logout());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderHeader);
  else renderHeader();
})();