import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@phosphor-icons/web/regular';
import './styles.css';

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');

const setMenuState = (isOpen) => {
    navigation?.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle?.setAttribute('aria-expanded', String(isOpen));
    menuToggle?.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');

    const icon = menuToggle?.querySelector('i');
    if (icon) {
        icon.classList.toggle('ph-list', !isOpen);
        icon.classList.toggle('ph-x', isOpen);
    }
};

menuToggle?.addEventListener('click', () => {
    setMenuState(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 960) setMenuState(false);
});

const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 36);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
        observer.observe(element);
    });
} else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
}

const faqItems = document.querySelectorAll('.faq details');
faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
        if (!item.open) return;
        faqItems.forEach((otherItem) => {
            if (otherItem !== item) otherItem.removeAttribute('open');
        });
    });
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
