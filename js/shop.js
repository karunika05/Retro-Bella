  // ---------- filtering ----------
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.product-card');
  const emptyNote = document.getElementById('emptyNote');

  function applyFilter(cat){
    let visible = 0;
    cards.forEach(card => {
      const show = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('is-hidden', !show);
      if(show) visible++;
    });
    emptyNote.classList.toggle('show', visible === 0);
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilter(pill.dataset.filter);
    });
  });

  // deep-link via hash, e.g. shop.html#bags
  const hash = window.location.hash.replace('#', '');
  if(hash){
    const match = document.querySelector(`.filter-pill[data-filter="${hash}"]`);
    if(match) match.click();
  }

    // ---------- Shop the Look: deep-link via ?category=slug ----------
  // Reuses the existing filter by clicking the matching .filter-pill,
  // so the active pill highlight and applyFilter() work exactly as before.
  (function () {
    const LOOKS = {
      'quiet-luxury':  { label: 'Quiet Luxury',  filter: 'women'    },
      'party-wear':    { label: 'Party Girl',    filter: 'dresses'  },
      'street-style':  { label: 'Street Style',  filter: 'men'      },
      'retro-glam':    { label: 'Retro Glam',    filter: 'bags'     },
      'everyday-chic': { label: 'Everyday Chic', filter: 'footwear' }
    };
    const slug = (new URLSearchParams(window.location.search).get('category') || '').toLowerCase();
    const look = LOOKS[slug];
    if (!look) return;                                   // no/unknown param → show all, as today

    const pill = document.querySelector('.filter-pill[data-filter="' + look.filter + '"]');
    const grid = document.getElementById('productGrid');
    if (!pill || !grid) return;
    pill.click();

    // "Showing: Party Girl  ·  Clear filter ×"
    const bar = document.createElement('div');
    bar.className = 'stl-showing';
    bar.innerHTML = '<span>Showing: <strong></strong></span>' +
                    '<button type="button" class="stl-showing-clear">Clear filter ×</button>';
    bar.querySelector('strong').textContent = look.label;
    grid.parentNode.insertBefore(bar, grid);

    const removeBar = () => {
      bar.remove();
      window.history.replaceState({}, document.title, window.location.pathname);
    };
    bar.querySelector('.stl-showing-clear').addEventListener('click', () => {
      document.querySelector('.filter-pill[data-filter="all"]').click();   // triggers removeBar below
    });
    // choosing any filter pill manually also retires the "Showing" bar
    document.querySelectorAll('.filter-pill').forEach(p => p.addEventListener('click', removeBar, { once: true }));
  })();

  // ---------- add to cart ----------
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  });

  // ---------- custom cursor ----------
  const cursorDot = document.getElementById('cursorDot');
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('.btn-primary, .add-cart-btn, .filter-pill, nav.links a, .icon-btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('active'));
    });
  }