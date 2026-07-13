import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import { Modal } from 'bootstrap';
import '../assets/css/main.css'
import './gellery.css'

document.addEventListener('DOMContentLoaded', () => {
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

    // Lightbox für die Galerie-Bilder
    const thumbnails = Array.from(document.querySelectorAll('.grid-item img'));
    const lightboxEl = document.getElementById('galleryLightbox');
    if (!thumbnails.length || !lightboxEl) return;

    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxModal = new Modal(lightboxEl);
    let currentIndex = 0;

    function largeSrc(img) {
        return img.src.replace('-600.webp', '-1200.webp');
    }

    function showImage(index) {
        currentIndex = (index + thumbnails.length) % thumbnails.length;
        const img = thumbnails[currentIndex];
        lightboxImage.src = largeSrc(img);
        lightboxImage.alt = img.alt;
    }

    thumbnails.forEach((img, index) => {
        img.addEventListener('click', () => {
            showImage(index);
            lightboxModal.show();
        });
    });

    lightboxEl.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
    lightboxEl.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));

    lightboxEl.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    });
});
