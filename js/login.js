// RETRO BELLA — Login / Sign-up with full validation (needs js/auth.js loaded first)

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');
  const authTitle = document.getElementById('authTitle');
  const authSub = document.getElementById('authSub');
  const authSwitch = document.getElementById('authSwitch');

  function setMode(mode) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === mode));
    panels.forEach(p => p.classList.toggle('active', p.dataset.panel === mode));
    if (mode === 'signin') {
      authTitle.textContent = 'Sign in to your account';
      authSub.textContent = 'Access your wishlist, past orders and early drops.';
      authSwitch.innerHTML = 'New to Retro Bella? <button type="button" id="switchToSignup">Create an account</button>';
    } else {
      authTitle.textContent = 'Create your account';
      authSub.textContent = 'Join the list for early access & city-exclusive drops.';
      authSwitch.innerHTML = 'Already have an account? <button type="button" id="switchToSignin">Sign in</button>';
    }
    bindSwitchLinks();
  }
  function bindSwitchLinks() {
    const a = document.getElementById('switchToSignup');
    const b = document.getElementById('switchToSignin');
    if (a) a.addEventListener('click', () => setMode('signup'));
    if (b) b.addEventListener('click', () => setMode('signin'));
  }
  bindSwitchLinks();
  tabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.tab)));
  if (new URLSearchParams(location.search).get('tab') === 'signup') setMode('signup');

  // ---------- helpers ----------
  const captchaOf = form => [...form.querySelectorAll('.captcha-box span')].map(s => s.textContent.trim()).join('');

  function setError(input, message) {
    const field = input.closest('.auth-field');
    const err = field.querySelector('.err');
    field.classList.toggle('invalid', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (err) err.textContent = message || '';
    return !message;
  }

  // each rule returns an error message, or '' when valid
  const rules = {
    suName(v) {
      if (!v) return 'Please enter your full name.';
      if (v.length < 2) return 'Name must be at least 2 characters.';
      if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(v)) return "Name can only contain letters, spaces, . ' and -";
      return '';
    },
    email(v) {
      if (!v) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email, e.g. name@example.com.';
      return '';
    },
    signinPassword(v) { return v ? '' : 'Please enter your password.'; },
    signupPassword(v) {
      if (!v) return 'Please create a password.';
      if (v.length < 8) return 'Password must be at least 8 characters.';
      if (/\s/.test(v)) return 'Password cannot contain spaces.';
      if (!/[a-z]/.test(v)) return 'Add at least one lowercase letter.';
      if (!/[A-Z]/.test(v)) return 'Add at least one uppercase letter.';
      if (!/\d/.test(v)) return 'Add at least one number.';
      if (!/[^A-Za-z0-9]/.test(v)) return 'Add at least one special character (e.g. ! @ # $).';
      return '';
    }
  };

  // passwords are never trimmed; everything else is
  const valueOf = (id, input) => /password|confirm/i.test(id) ? input.value : input.value.trim();

  function checkCaptcha(form, input) {
    const v = input.value.trim();
    if (!v) return setError(input, 'Please enter the code shown above.');
    if (v !== captchaOf(form)) return setError(input, 'Code does not match. Type it exactly as shown (case-sensitive).');
    return setError(input, '');
  }

  // field map per form: [input id, validator(valueOfInput, form)]
  const signinFields = {
    siEmail:    (v) => rules.email(v),
    siPassword: (v) => rules.signinPassword(v)
  };
  const signupFields = {
    suName:     (v) => rules.suName(v),
    suEmail:    (v) => rules.email(v) || (Auth.emailExists(v) ? 'This email is already registered. Please sign in.' : ''),
    suPassword: (v) => rules.signupPassword(v),
    suConfirm:  (v) => !v ? 'Please confirm your password.' : (v !== document.getElementById('suPassword').value ? 'Passwords do not match.' : '')
  };

  function wire(form, fields, captchaId) {
    Object.entries(fields).forEach(([id, fn]) => {
      const input = document.getElementById(id);
      const run = () => setError(input, fn(valueOf(id, input)));
      input.addEventListener('blur', run);
      input.addEventListener('input', () => { if (input.closest('.auth-field').classList.contains('invalid')) run(); });
    });
    const cap = document.getElementById(captchaId);
    cap.addEventListener('blur', () => { if (cap.value) checkCaptcha(form, cap); });
    cap.addEventListener('input', () => { if (cap.closest('.auth-field').classList.contains('invalid')) checkCaptcha(form, cap); });
    // re-check confirm when the password changes
    const pw = document.getElementById('suPassword');
    if (form.id === 'signupForm' && pw) pw.addEventListener('input', () => {
      const c = document.getElementById('suConfirm');
      if (c.value) setError(c, fields.suConfirm(c.value));
    });
  }

  function validateAll(form, fields, captchaId) {
    let firstBad = null;
    Object.entries(fields).forEach(([id, fn]) => {
      const input = document.getElementById(id);
      if (!setError(input, fn(valueOf(id, input))) && !firstBad) firstBad = input;
    });
    const cap = document.getElementById(captchaId);
    if (!checkCaptcha(form, cap) && !firstBad) firstBad = cap;
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // ---------- loader + redirect ----------
  const loaderOverlay = document.getElementById('loaderOverlay');
  const loaderFill = document.getElementById('loaderFill');
  const loaderCaption = document.getElementById('loaderCaption');

  function goHomeWithLoader(caption) {
    loaderCaption.textContent = caption;
    loaderOverlay.style.display = 'flex';
    loaderOverlay.style.animation = 'none';          // keep it visible until we redirect
    requestAnimationFrame(() => { loaderFill.style.animation = 'none'; loaderFill.style.transition = 'width 1.3s ease'; loaderFill.style.width = '100%'; });
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  }

  // ---------- sign in ----------
  const signinForm = document.getElementById('signinForm');
  wire(signinForm, signinFields, 'siCaptcha');
  signinForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateAll(signinForm, signinFields, 'siCaptcha')) return;
    const email = document.getElementById('siEmail');
    const pass = document.getElementById('siPassword');
    const res = Auth.login(email.value.trim(), pass.value);
    if (!res.ok) {
      const target = res.field === 'password' ? pass : email;
      setError(target, res.error);
      target.focus();
      return;
    }
    goHomeWithLoader('Signing you in…');
  });

  // ---------- sign up ----------
  const signupForm = document.getElementById('signupForm');
  wire(signupForm, signupFields, 'suCaptcha');
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateAll(signupForm, signupFields, 'suCaptcha')) return;
    const res = Auth.register({
      name: document.getElementById('suName').value,
      email: document.getElementById('suEmail').value,
      password: document.getElementById('suPassword').value
    });
    if (!res.ok) { setError(document.getElementById('suEmail'), res.error); return; }
    goHomeWithLoader('Creating your account…');
  });

  const forgotLink = document.getElementById('forgotLink');
  if (forgotLink) forgotLink.addEventListener('click', e => {
    e.preventDefault();
    alert('Password reset is not wired up in this demo.');
  });
});