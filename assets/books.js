// Remplit le fond de la page d'accueil avec des rangées de livres (formes colorées, sans vrai titre)
// qui glissent lentement, une rangée sur deux dans l'autre sens.
(function () {
  const wall = document.querySelector('.books');
  if (!wall) return;

  // Couleurs de couvertures : celles de piqMind et des teintes de livres classiques.
  const covers = ['#FAD302', '#FFF7BA', '#8B7BC8', '#B9473F', '#2ECC71', '#3E2F26', '#231117', '#E8E2D0',
    '#1F4E79', '#D9822B', '#5B8C85', '#C7B8EA', '#F2A7A0', '#2A2533', '#9C2F2F', '#F5F1E6', '#3D5A80', '#E0C068'];
  const accents = ['rgba(255,255,255,.85)', 'rgba(13,11,24,.75)', '#FAD302', '#FFF7BA', 'rgba(255,255,255,.6)'];

  // Petit générateur pseudo-aléatoire pour avoir toujours le même mur.
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = (list) => list[Math.floor(rnd() * list.length)];

  function makeBook() {
    const b = document.createElement('span');
    b.className = 'book';
    b.style.setProperty('--c', pick(covers));
    b.style.setProperty('--a', pick(accents));
    b.style.setProperty('--t', (12 + rnd() * 30).toFixed(0) + '%');
    b.style.setProperty('--b', (6 + rnd() * 18).toFixed(0) + '%');
    b.style.setProperty('--h', (10 + rnd() * 22).toFixed(0) + '%');
    return b;
  }

  function build() {
    wall.textContent = '';
    const style = getComputedStyle(wall);
    const perRow = innerWidth <= 760 ? 5 : 10;
    const gap = parseFloat(style.rowGap) || 12;
    const bookW = (innerWidth - (perRow - 1) * gap) / perRow;
    const bookH = bookW * 1.5;
    const rows = Math.ceil((wall.clientHeight + gap) / (bookH + gap)) + 1;
    const count = perRow + 6; // un peu plus large que l'écran (le mur déborde)

    for (let r = 0; r < rows; r++) {
      const row = document.createElement('div');
      row.className = 'book-row' + (r % 2 ? ' rev' : '');
      row.style.setProperty('--dur', (300 + rnd() * 120).toFixed(0) + 's');
      row.style.marginLeft = (-rnd() * bookW).toFixed(0) + 'px';
      const set = [];
      for (let i = 0; i < count; i++) set.push(makeBook());
      // Deux fois la même série : le glissement de -50 % boucle sans à-coup.
      set.forEach((b) => row.appendChild(b));
      set.forEach((b) => row.appendChild(b.cloneNode(true)));
      wall.appendChild(row);
    }
  }

  build();
  let lastW = innerWidth;
  addEventListener('resize', () => {
    // On ne reconstruit que si la largeur change (pas quand la barre d'adresse de l'iPhone bouge).
    if (Math.abs(innerWidth - lastW) < 40) return;
    lastW = innerWidth;
    seed = 7;
    build();
  });
})();
