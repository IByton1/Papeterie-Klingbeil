const fs = require('fs');
const path = require('path');

// Liste von Dateien und Ordnern, die NICHT nach `dist/` kopiert werden sollen
const excludeFiles = [
    'package.json', 'package-lock.json', 'prepare-dist.js',
    '.gitignore', 'node_modules', 'dist1', '.git', 'original_Bilder', 'rename.py', 'heic_to_webp.py', 'compress.py'
];

// Funktion zum rekursiven Kopieren von Dateien & Ordnern mit Ausschlussregeln
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
        if (excludeFiles.includes(entry.name)) {
            return; // Überspringe ausgeschlossene Dateien/Ordner
        }

        const sourcePath = path.join(source, entry.name);
        const targetPath = path.join(target, entry.name);

        if (entry.isDirectory()) {
            copyFolderSync(sourcePath, targetPath);
        } else {
            // Korrektur: Entferne den fehlerhaften dritten Parameter
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

// Funktion zum Ersetzen von `node_modules/bootstrap` durch `bootstrap` in allen `dist/`-Dateien
function replaceInFiles(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === '.git') return; // Verhindere Zugriff auf `.git`
            replaceInFiles(entryPath);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            let content = fs.readFileSync(entryPath, 'utf8');

            // Ersetze nur `node_modules/bootstrap`, ohne andere `node_modules`-Verweise zu ändern
            content = content.replace(/node_modules\/bootstrap/g, 'bootstrap');

            fs.writeFileSync(entryPath, content, 'utf8');
            console.log(`✔ Ersetzt in: ${entryPath}`);
        }
    });
}


// Definiere Quell- und Zielpfade
const projectRoot = __dirname; // Root-Verzeichnis des Projekts
const distPath = path.join(projectRoot, 'dist1'); // Zielverzeichnis für Deployment
const bootstrapSrc = path.join(projectRoot, 'node_modules/bootstrap'); // Original Bootstrap-Ordner
const bootstrapDest = path.join(distPath, 'bootstrap'); // Zielordner für Bootstrap in dist/

// 1️⃣ Lösche `dist/`, falls es existiert (aber NICHT `.git`)
if (fs.existsSync(distPath)) {
    fs.readdirSync(distPath).forEach((file) => {
        if (file !== '.git') {
            fs.rmSync(path.join(distPath, file), { recursive: true, force: true });
        }
    });
}
fs.mkdirSync(distPath, { recursive: true });

// 2️⃣ Kopiere alle Dateien außer die ausgeschlossenen nach `dist/`
console.log('📂 Kopiere Projektdateien nach dist/ ...');
copyFolderSync(projectRoot, distPath);
console.log('✅ Projektdateien kopiert.');

// 3️⃣ Kopiere den gesamten Bootstrap-Ordner nach `dist/bootstrap/`
console.log('📂 Kopiere Bootstrap nach dist/bootstrap/ ...');
copyFolderSync(bootstrapSrc, bootstrapDest);
console.log('✅ Bootstrap-Ordner kopiert.');

// 4️⃣ Ersetze `/node_modules/bootstrap` durch `bootstrap` in allen Dateien in `dist/`
console.log('🔍 Ersetze absolute Bootstrap-Pfade in dist/ ...');
replaceInFiles(distPath);
console.log('✅ Pfadersetzung abgeschlossen.');

console.log('🎉 Deployment-Ordner ist bereit! Führe `npm run deploy` aus.');
