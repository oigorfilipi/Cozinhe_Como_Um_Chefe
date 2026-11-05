import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const editorRoot = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(editorRoot, '../..');
const buildDir = resolve(projectRoot, 'tmp/catalog-editor-build');
const outputFile = resolve(projectRoot, 'Editor de Receitas.html');

await build({
  configFile: false,
  root: editorRoot,
  base: './',
  plugins: [react()],
  build: {
    outDir: buildDir,
    emptyOutDir: true,
    assetsInlineLimit: 1_000_000,
    cssCodeSplit: false,
    rollupOptions: { output: { codeSplitting: false } },
  },
});

let html = await readFile(resolve(buildDir, 'index.html'), 'utf8');
const scriptTag = html.match(/<script\s+type="module"[^>]*\bsrc="([^"]+)"[^>]*><\/script>/);
const styleTag = html.match(/<link\s+rel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/);
if (!scriptTag || !styleTag) throw new Error('A compilação do editor não gerou um script e um CSS únicos.');

const assetPath = (name) => resolve(buildDir, name.replace(/^\.\//, ''));
const script = (await readFile(assetPath(scriptTag[1]), 'utf8')).replace(/<\/script/gi, '<\\/script');
const style = (await readFile(assetPath(styleTag[1]), 'utf8')).replace(/<\/style/gi, '<\\/style');
html = html.replace(scriptTag[0], () => `<script type="module">\n${script}\n</script>`);
html = html.replace(styleTag[0], () => `<style>\n${style}\n</style>`);
await writeFile(outputFile, html, 'utf8');
console.log(`Editor independente criado em ${outputFile}`);
