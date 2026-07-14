import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@phosphor-icons/web/regular';
import './gellery.css';

const galleryAssetUrls = import.meta.glob('../assets/gallery/*.webp', {
    eager: true,
    query: '?url',
    import: 'default',
});

function galleryAsset(fileName) {
    return galleryAssetUrls[`../assets/gallery/${fileName}`];
}

const galleryImages = [];

for (let group = 1; group <= 13; group += 1) {
    const firstPortrait = (group - 1) * 5 + 1;
    for (let offset = 0; offset < 5; offset += 1) {
        const number = firstPortrait + offset;
        galleryImages.push({
            thumb: galleryAsset(`${number}hf-600.webp`),
            full: galleryAsset(`${number}hf-1200.webp`),
            orientation: 'portrait',
        });
    }

    galleryImages.push({
        thumb: galleryAsset(`${group}qf-600.webp`),
        full: galleryAsset(`${group}qf-1200.webp`),
        orientation: 'landscape',
    });
}

galleryImages.push({
    thumb: galleryAsset('66hf-600.webp'),
    full: galleryAsset('66hf-1200.webp'),
    orientation: 'portrait',
});

const galleryGrid = document.querySelector('[data-gallery-grid]');
const loadMoreButton = document.querySelector('[data-load-more]');
const loadSentinel = document.querySelector('[data-load-sentinel]');
const visibleCount = document.querySelector('[data-visible-count]');
const totalCount = document.querySelector('[data-total-count]');
const BATCH_SIZE = 16;
let renderedCount = 0;

if (totalCount) totalCount.textContent = String(galleryImages.length);

const thumbnailObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const image = entry.target;
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
            observer.unobserve(image);
        });
    }, { rootMargin: '500px 0px' })
    : null;

function queueThumbnail(thumbnail, source) {
    thumbnail.dataset.src = source;
    if (thumbnailObserver) {
        thumbnailObserver.observe(thumbnail);
    } else {
        thumbnail.src = source;
        thumbnail.removeAttribute('data-src');
    }
}

function createGalleryCard(image, index) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'gallery-card';
    card.dataset.index = String(index);
    card.setAttribute('aria-label', `Galeriebild ${index + 1} von ${galleryImages.length} öffnen`);

    if (image.orientation === 'landscape') card.classList.add('is-landscape');
    if (image.orientation === 'portrait' && index % 17 === 0) card.classList.add('is-featured');

    const thumbnail = document.createElement('img');
    thumbnail.alt = `Einblick in die Papeterie Klingbeil – Motiv ${String(index + 1).padStart(2, '0')}`;
    thumbnail.loading = 'lazy';
    thumbnail.decoding = 'async';
    thumbnail.fetchPriority = 'low';
    thumbnail.width = 600;
    thumbnail.height = image.orientation === 'landscape' ? 400 : 800;
    thumbnail.addEventListener('load', () => thumbnail.classList.add('is-loaded'), { once: true });
    queueThumbnail(thumbnail, image.thumb);

    const indexLabel = document.createElement('span');
    indexLabel.className = 'gallery-card__index';
    indexLabel.textContent = String(index + 1).padStart(2, '0');
    indexLabel.setAttribute('aria-hidden', 'true');

    card.append(thumbnail, indexLabel);
    return card;
}

function renderNextBatch() {
    if (!galleryGrid || renderedCount >= galleryImages.length) return;

    const nextCount = Math.min(renderedCount + BATCH_SIZE, galleryImages.length);
    const fragment = document.createDocumentFragment();

    for (let index = renderedCount; index < nextCount; index += 1) {
        fragment.append(createGalleryCard(galleryImages[index], index));
    }

    galleryGrid.append(fragment);
    renderedCount = nextCount;
    if (visibleCount) visibleCount.textContent = String(renderedCount);

    const allImagesRendered = renderedCount >= galleryImages.length;
    if (loadMoreButton) loadMoreButton.hidden = allImagesRendered;
    if (loadSentinel) loadSentinel.hidden = allImagesRendered;
}

renderNextBatch();
loadMoreButton?.addEventListener('click', renderNextBatch);

if ('IntersectionObserver' in window && loadSentinel) {
    const batchObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) renderNextBatch();
    }, { rootMargin: '900px 0px' });
    batchObserver.observe(loadSentinel);
}

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
let currentIndex = 0;

function preloadAdjacentImage(index) {
    const nextIndex = (index + 1) % galleryImages.length;
    const preloadImage = new Image();
    preloadImage.decoding = 'async';
    preloadImage.src = galleryImages[nextIndex].full;
}

function showImage(index) {
    if (!lightboxImage) return;

    currentIndex = (index + galleryImages.length) % galleryImages.length;
    const image = galleryImages[currentIndex];
    lightboxImage.src = image.full;
    lightboxImage.alt = `Großansicht: Einblick in die Papeterie Klingbeil – Motiv ${String(currentIndex + 1).padStart(2, '0')}`;
    lightboxImage.onerror = () => {
        lightboxImage.onerror = null;
        lightboxImage.src = image.thumb;
    };

    if (lightboxCaption) {
        lightboxCaption.textContent = `Galerie · Bild ${currentIndex + 1} von ${galleryImages.length}`;
    }

    lightboxImage.addEventListener('load', () => preloadAdjacentImage(currentIndex), { once: true });
}

function openLightbox(index) {
    if (!lightbox) return;
    showImage(index);
    document.body.classList.add('lightbox-open');
    lightbox.showModal();
}

function closeLightbox() {
    if (!lightbox?.open) return;
    lightbox.close();
    document.body.classList.remove('lightbox-open');
    if (lightboxImage) lightboxImage.src = '';
}

galleryGrid?.addEventListener('click', (event) => {
    const card = event.target.closest('.gallery-card');
    if (!card) return;
    openLightbox(Number(card.dataset.index));
});

document.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
document.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => showImage(currentIndex - 1));
document.querySelector('[data-lightbox-next]')?.addEventListener('click', () => showImage(currentIndex + 1));

lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
});

lightbox?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
});

document.addEventListener('keydown', (event) => {
    if (!lightbox?.open) return;
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
});

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');

function setMenuState(isOpen) {
    navigation?.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle?.setAttribute('aria-expanded', String(isOpen));
    menuToggle?.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');

    const icon = menuToggle?.querySelector('i');
    if (icon) {
        icon.classList.toggle('ph-list', !isOpen);
        icon.classList.toggle('ph-x', isOpen);
    }
}

menuToggle?.addEventListener('click', () => {
    setMenuState(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenuState(false);
});

function updateHeader() {
    header?.classList.toggle('is-scrolled', window.scrollY > 36);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
