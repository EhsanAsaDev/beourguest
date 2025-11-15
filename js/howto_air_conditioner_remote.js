async function loadHowtoTranslations(lang) {
  try {
    const response = await fetch(`../js/little_gme_locales/air_conditioner_remote_${lang}.json`);
    if (!response.ok) throw new Error('Not found');
    return await response.json();
  } catch {
    // fallback to English
    const response = await fetch(`../js/little_gme_locales/air_conditioner_remote_en.json`);
    return await response.json();
  }
}

async function updateHowtoContent(lang) {
  const t = await loadHowtoTranslations(lang);
  document.getElementById('howto-title').textContent = t.title;
  document.getElementById('howto-content').innerHTML = t.content;
  document.getElementById('howto-help').textContent = t.help;
}

// Language switcher for this page
const howtoFlagBtns = document.querySelectorAll('.flag-btn');
howtoFlagBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    const lang = btn.dataset.lang;
    howtoFlagBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    await updateHowtoContent(lang);
    document.body.setAttribute('lang', lang);
    document.body.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    if (lang === 'fa') {
      document.querySelector('header').setAttribute('dir', 'ltr');
      document.querySelector('header').classList.add('force-ltr');
    } else {
      document.querySelector('header').removeAttribute('dir');
      document.querySelector('header').classList.remove('force-ltr');
    }
  });
});

// Set default language on load
window.addEventListener('DOMContentLoaded', async () => {
  await updateHowtoContent('en');
});
