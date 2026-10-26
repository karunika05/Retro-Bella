// RETRO BELLA — Dark mode toggle
// The saved choice is applied before the page paints by a tiny script in each <head>;
// this file wires up the button, saves the choice and keeps the button label in sync.
(function () {
  var KEY = 'rb_theme';
  var root = document.documentElement;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function sync(btn) {
    var dark = current() === 'dark';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    var label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }
  function apply(theme, btns) {
    root.classList.add('theme-anim');
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    btns.forEach(sync);
    setTimeout(function () { root.classList.remove('theme-anim'); }, 450);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btns = Array.prototype.slice.call(document.querySelectorAll('.theme-toggle'));
    btns.forEach(function (btn) {
      sync(btn);
      btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(KEY, next); } catch (e) {}
        apply(next, btns);
      });
    });

    // follow the computer's setting until the visitor picks a theme themselves
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (e) { if (!saved()) apply(e.matches ? 'dark' : 'light', btns); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
    // keep other open tabs in step
    window.addEventListener('storage', function (e) {
      if (e.key === KEY && e.newValue) apply(e.newValue === 'dark' ? 'dark' : 'light', btns);
    });
  });
})();
