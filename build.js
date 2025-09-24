import { remove, copy } from 'fs-extra';
import { build } from 'vite';

async function buildExtension() {
    // Clean dist folder
    await remove('dist');

    // Build with Vite (this will handle index.html and React components)
    await build();

    // Copy manifest and static files to dist
    await copy('manifest.json', 'dist/manifest.json');
    await copy('public/icons', 'dist/icons');
    await copy('public/background.js', 'dist/background.js');
    await copy('public/contentScript.js', 'dist/contentScript.js');

    console.log('Extension built successfully!');
}

buildExtension().catch(console.error);