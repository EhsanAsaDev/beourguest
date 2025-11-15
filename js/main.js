// Remove the inline translations object and use dynamic loading from JSON files

async function loadTranslations(lang) {
    const response = await fetch(`js/locales/${lang}.json`);
    return await response.json();
}

let currentTranslations = {};

async function updateContent(lang) {
    currentTranslations = await loadTranslations(lang);

    document.getElementById('hero-subtitle').textContent = currentTranslations.heroSubtitle;
    document.getElementById('service1-title').textContent = currentTranslations.service1Title;
    document.getElementById('service2-title').textContent = currentTranslations.service2Title;
    document.getElementById('service3-title').textContent = currentTranslations.service3Title;
    document.getElementById('service4-title').textContent = currentTranslations.service4Title;
    document.getElementById('about-title').textContent = currentTranslations.aboutTitle;
    // Use innerHTML and replace \n with <br> for about-text
    document.getElementById('about-text').innerHTML = currentTranslations.aboutText.replace(/\n/g, '<br>');
    document.getElementById('footer-text').innerHTML = currentTranslations.footerText;

    document.querySelectorAll('[data-i18n="comingSoon"]').forEach(el => {
        el.textContent = currentTranslations.comingSoon;
    });
    // Update social icon tooltips
    const socialTitles = {
        instagram: currentTranslations.instagramTitle || 'Instagram',
        message: currentTranslations.messageTitle || 'Message us on WhatsApp',
        email: currentTranslations.emailTitle || 'Email'
    };
    document.querySelectorAll('.social-icon[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (socialTitles[key]) el.title = socialTitles[key];
    });
}

const flagBtns = document.querySelectorAll('.flag-btn');
const body = document.body;

flagBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;

        flagBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (lang === 'fa') {
            body.classList.add('rtl');
            body.setAttribute('dir', 'rtl');
            body.setAttribute('lang', 'fa');
            // Set header to always LTR
            document.querySelector('header').setAttribute('dir', 'ltr');
            document.querySelector('header').classList.add('force-ltr');
        } else {
            body.classList.remove('rtl');
            body.setAttribute('dir', 'ltr');
            body.setAttribute('lang', lang);
            document.querySelector('header').removeAttribute('dir');
            document.querySelector('header').classList.remove('force-ltr');
        }

        await updateContent(lang);
        localStorage.setItem('preferredLanguage', lang);
    });
});

window.addEventListener('DOMContentLoaded', async () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    const langBtn = document.querySelector(`[data-lang="${savedLang}"]`);
    if (langBtn && savedLang !== 'en') {
        langBtn.click();
    } else {
        await updateContent('en');
    }
});