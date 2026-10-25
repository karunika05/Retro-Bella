
  // ---------- Shop the Look: homepage deep links ----------
  const LOOKS = {
    'quiet-luxury':  { label: 'Quiet Luxury',  filter: 'women' },
    'party-wear':    { label: 'Party Girl',    filter: 'dresses' },
    'street-style':  { label: 'Street Style',  filter: 'men' },
    'retro-glam':    { label: 'Retro Glam',    filter: 'bags' },
    'everyday-chic': { label: 'Everyday Chic', filter: 'footwear' }
  };

  const slug = (
    new URLSearchParams(window.location.search).get('category') || ''
  ).toLowerCase();

  const look = LOOKS[slug];
  const lookPill = look && document.querySelector(
    '.filter-pill[data-filter="' + look.filter + '"]'
  );

  if (look && lookPill) {
    lookPill.click();

    const bar = document.createElement('div');
    bar.className = 'stl-showing';
    bar.innerHTML =
      '<span>Showing: <strong></strong></span>' +
      '<button type="button" class="stl-showing-clear">Clear filter ×</button>';

    bar.querySelector('strong').textContent = look.label;
    grid.parentNode.insertBefore(bar, grid);

    const removeBar = () => {
      if (!bar.isConnected) return;
      bar.remove();
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    };

    bar.querySelector('.stl-showing-clear').addEventListener('click', () => {
      document.querySelector('.filter-pill[data-filter="all"]').click();
    });

    pills.forEach(pill => {
      pill.addEventListener('click', removeBar, { once: true });
    });
  }
});
