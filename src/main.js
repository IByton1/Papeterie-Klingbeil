import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';
import './assets/css/main.css'

document.addEventListener("DOMContentLoaded", function () {
    // Wähle alle Elemente mit den entsprechenden Klassen aus
    const textElements = document.querySelectorAll('.text-slide-in');
    const imageElements = document.querySelectorAll('.image-slide-in');

    function handleScroll() {
        // Für alle Textelemente prüfen, ob sie im Viewport sind
        textElements.forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('show');
            }
        });

        // Für alle Bildelemente prüfen, ob sie im Viewport sind
        imageElements.forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('show');
            }
        });
    }

    // Scroll-Event zum Aktivieren der Animationen
    window.addEventListener('scroll', handleScroll);
    // Initial aufrufen, falls Elemente schon sichtbar sind
    handleScroll();
});
