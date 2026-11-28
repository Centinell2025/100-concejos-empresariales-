(() => {
  const labels = {
    businessSeal: ['Gestión empresarial', 'Business management', 'Gestione aziendale'],
    aboutBeacon: ['Acerca de Beacon', 'About Beacon', 'Informazioni su Beacon'],
    coverBody: [
      'Registra cobros y gastos, sigue tus proyectos y consulta tus metas del mes. Tus datos se guardan en este dispositivo.',
      'Record income and expenses, track projects and check your monthly goals. Your data stays on this device.',
      'Registra incassi e spese, segui i progetti e controlla gli obiettivi del mese. I tuoi dati rimangono su questo dispositivo.'
    ],
    enterWorkspace: ['Abrir mi panel', 'Open my dashboard', 'Apri il mio pannello'],
    beaconLogo: ['Emblema de Beacon con águila y faro', 'Beacon eagle and lighthouse emblem', 'Emblema Beacon con aquila e faro']
  };
  for (const [key, [es, en, it]] of Object.entries(labels)) {
    messages[key] = {es, en, it};
  }

  const cover = document.createElement('dialog');
  cover.id = 'beacon-cover';
  cover.setAttribute('aria-labelledby', 'cover-title');
  cover.innerHTML = `
    <div class="cover-shell">
      <header class="cover-header">
        <span class="cover-wordmark" data-i18n="appPublisher"></span>
        <label class="cover-language">
          <span class="sr-only" data-i18n="language"></span>
          <select id="cover-language" data-i18n-label="language">
            <option value="en">English</option><option value="es">Español</option><option value="it">Italiano</option>
          </select>
        </label>
      </header>
      <div class="cover-hero">
        <div class="cover-copy">
          <div class="cover-eyebrow" data-i18n="businessSeal"></div>
          <h1 id="cover-title">Beacon Business</h1>
          <p data-i18n="coverBody"></p>
          <div class="cover-actions">
            <button type="button" id="enter-workspace" class="cover-cta">
              <span data-i18n="enterWorkspace"></span><span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div class="cover-visual">
          <img src="beacon-emblem.png" alt="" width="480" height="480">
        </div>
      </div>
      <footer class="cover-footer" data-i18n="appCopyright"></footer>
    </div>`;
  document.body.append(cover);

  const coverLanguage = $('#cover-language');
  function localize() {
    applyLocale();
    coverLanguage.value = language;
    cover.querySelector('img').alt = tr('beaconLogo');
  }
  function show() {
    localize();
    cover.showModal();
    cover.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  coverLanguage.onchange = () => {
    $('#language').value = coverLanguage.value;
    $('#language').dispatchEvent(new Event('change'));
  };
  $('#enter-workspace').onclick = () => cover.close();
  cover.addEventListener('close', () => {
    document.body.style.overflow = '';
    try { localStorage.setItem('beacon-welcome-seen', '1'); } catch {}
  });

  const about = document.createElement('button');
  about.className = 'text-button';
  about.dataset.i18n = 'aboutBeacon';
  about.id = 'about-beacon';
  about.onclick = show;
  $('.top-actions').prepend(about);
  document.addEventListener('beacon-language', localize);
  let firstVisit = true;
  try {
    firstVisit = !localStorage.getItem('beacon-welcome-seen') && !localStorage.getItem('beacon-management-v1');
  } catch {}
  if (firstVisit) show();
  else localize();
})();
