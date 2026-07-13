import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';
import './assets/css/main.css'

document.addEventListener("DOMContentLoaded", function () {
    // Sanftes Einblenden von Text- und Bildelementen, sobald sie sichtbar werden
    const revealElements = document.querySelectorAll('.text-slide-in, .image-slide-in');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => revealObserver.observe(el));

    // Navbar wechselt von transparent (über dem Hero) zu solidem Hintergrund
    const navbar = document.querySelector('.navbar');
    const hero = document.getElementById('hero');

    if (navbar && hero) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                navbar.classList.toggle('scrolled', !entry.isIntersecting);
            });
        }, { rootMargin: `-${navbar.offsetHeight}px 0px 0px 0px` });

        navObserver.observe(hero);
    }
});
