const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');

const setMenuState = (isOpen) => {
    navigation?.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle?.setAttribute('aria-expanded', String(isOpen));
    menuToggle?.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');

    const icon = menuToggle?.querySelector('i');
    icon?.classList.toggle('ph-list', !isOpen);
    icon?.classList.toggle('ph-x', isOpen);
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

document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
});
