/**
 * Bild-Optimierung für die Papeterie-Klingbeil-Seite.
 *
 * Liest die Original-Bilder aus `original_Bilder/` (wird beim ersten Lauf
 * automatisch aus `src/assets/` angelegt) und erzeugt kleine, web-optimierte
 * WebP-Varianten in `src/assets/`.
 *
 * - Galerie: pro Bild zwei Breiten (600px + 1200px) für responsives `srcset`.
 * - Sonstige Bilder (Hero, Produkte, ...): auf sinnvolle Maximalbreite verkleinert.
 *
 * Benötigt `cwebp` (Teil von libwebp, z.B. `brew install webp`).
 * Aufruf: `node optimize-images.js`
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const ORIG = path.join(ROOT, 'original_Bilder');
const SRC = path.join(ROOT, 'src', 'assets');

const QUALITY = 80;
const GALLERY_WIDTHS = [600, 1200];

// Zielbreiten für die Bilder im img-Ordner (Dateiname -> max. Breite in px).
// Nicht aufgeführte Bilder werden 1:1 kopiert.
const IMG_WIDTHS = {
    'hero.webp': 1920,
    'logo.webp': 160,
    'klingbeil.webp': 600,
    'unique.webp': 900,
    'high-quality-brands.webp': 900,
    'diversity.webp': 900,
    'writing-instrument.webp': 800,
    'gift-items.webp': 800,
    'gift-wrapping.webp': 800,
    'art-supplies.webp': 800,
    'stationery.webp': 800,
    'books.webp': 800,
    'office-supplies.webp': 800,
};

function ensureCwebp() {
    try {
        execFileSync('cwebp', ['-version'], { stdio: 'ignore' });
    } catch {
        console.error('❌ `cwebp` nicht gefunden. Installiere es mit: brew install webp');
        process.exit(1);
    }
}

// Legt beim ersten Lauf die Originalsicherung an, falls sie fehlt.
function ensureBackup() {
    for (const sub of ['gallery', 'img']) {
        const dst = path.join(ORIG, sub);
        if (fs.existsSync(dst) && fs.readdirSync(dst).length) continue;
        fs.mkdirSync(dst, { recursive: true });
        const from = path.join(SRC, sub);
        for (const f of fs.readdirSync(from)) {
            const p = path.join(from, f);
            if (fs.statSync(p).isFile()) fs.copyFileSync(p, path.join(dst, f));
        }
        console.log(`💾 Backup angelegt: original_Bilder/${sub}`);
    }
}

function webp(input, output, width) {
    const args = ['-q', String(QUALITY), '-mt'];
    if (width) args.push('-resize', String(width), '0');
    args.push(input, '-o', output);
    execFileSync('cwebp', args, { stdio: 'ignore' });
}

function kb(file) {
    return (fs.statSync(file).size / 1024).toFixed(0);
}

function run() {
    ensureCwebp();
    ensureBackup();

    // --- Galerie ---
    const galleryOut = path.join(SRC, 'gallery');
    fs.mkdirSync(galleryOut, { recursive: true });
    const galleryFiles = fs.readdirSync(path.join(ORIG, 'gallery')).filter((f) => f.endsWith('.webp'));
    let saved = 0;
    for (const file of galleryFiles) {
        const base = file.replace(/\.webp$/, '');
        const input = path.join(ORIG, 'gallery', file);
        for (const w of GALLERY_WIDTHS) {
            const out = path.join(galleryOut, `${base}-${w}.webp`);
            webp(input, out, w);
        }
    }
    console.log(`🖼  Galerie: ${galleryFiles.length} Bilder → ${galleryFiles.length * GALLERY_WIDTHS.length} Varianten (${GALLERY_WIDTHS.join('/')}px)`);

    // --- img-Ordner ---
    const imgOut = path.join(SRC, 'img');
    fs.mkdirSync(imgOut, { recursive: true });
    for (const [file, width] of Object.entries(IMG_WIDTHS)) {
        const input = path.join(ORIG, 'img', file);
        if (!fs.existsSync(input)) {
            console.warn(`⚠️  übersprungen (fehlt): ${file}`);
            continue;
        }
        const out = path.join(imgOut, file);
        webp(input, out, width);
        console.log(`   ${file}: ${kb(input)}KB → ${kb(out)}KB (max ${width}px)`);
    }

    console.log('✅ Bildoptimierung fertig.');
}

run();
