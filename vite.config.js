import { defineConfig } from 'vite';
import path from 'path';
import compression from 'vite-plugin-compression';

export default defineConfig({
  base: './',
  root: 'src',
  build: {
    outDir: '../dist',
    minify: 'terser',  // Nutzt Terser für bessere Komprimierung
    terserOptions: {
      compress: {
        drop_console: true,  // Entfernt alle console.log() Aufrufe
        drop_debugger: true, // Entfernt debugger-Anweisungen
        unused: true,        // Entfernt ungenutzte Funktionen & Variablen
        dead_code: true,     // Entfernt toten Code
        passes: 3,
      },
      format: {
        comments: false, // Entfernt Kommentare für kleinere Dateien
      },
    },
    rollupOptions: {
      treeshake: 'recommended', // Entfernt noch mehr ungenutzten Code
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        gallery: path.resolve(__dirname, 'src/gallery/gallery.html'),
      },
    },
  },
  plugins: [
    compression({
      algorithm: 'gzip',  // oder 'brotliCompress'
      threshold: 10240,   // Mindestens 10KB vor der Komprimierung
      deleteOriginFile: false, // Ursprüngliche Datei behalten
    })
  ],
});
