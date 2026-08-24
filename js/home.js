// RETRO BELLA — Home Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Welcome Loader ----------
  const overlay = document.getElementById('welcomeLoader');
  const fill = document.getElementById('welcomeFill');
  const caption = document.getElementById('welcomeCaption');
  
  if (overlay && fill && caption) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('welcome') === '1') {
      caption.textContent = 'Welcome back — preparing your home page…';
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    document.documentElement.style.overflow = 'hidden';
    overlay.style.display = 'flex';
    fill.style.width = '0%';

    setTimeout(() => { fill.style.width = '100%'; }, 50);

    setTimeout(() => {
      overlay.classList.add('hide');
      document.documentElement.style.overflow = '';
      setTimeout(() => overlay.remove(), 650);
    }, 1700);
  }

  // ---------- Spotlight Swatches & Sizes ----------
  const colorLabel = document.getElementById('colorLabel');
  document.querySelectorAll('#colorSwatches .sw').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('#colorSwatches .sw').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      if (colorLabel) colorLabel.textContent = sw.dataset.color;
    });
  });

  document.querySelectorAll('#sizeRow button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#sizeRow button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ---------- Add to Bag Demo ----------
  const addBtn = document.getElementById('addToBag');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const original = addBtn.innerHTML;
      addBtn.innerHTML = 'Added to Bag ✓';
      setTimeout(() => { addBtn.innerHTML = original; }, 1800);
    });
  }

  // ---------- Newsletter Form ----------
  const form = document.getElementById('newsletterForm');
  const note = document.getElementById('newsletterNote');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.classList.add('show');
      form.reset();
      setTimeout(() => note.classList.remove('show'), 4000);
    });
  }
});
