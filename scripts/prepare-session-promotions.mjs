import { copyFile } from 'node:fs/promises';
// Vite forbids browser imports from public/. Keep the verified public registry
// as the single source, and generate its browser module before dev/build.
await copyFile(new URL('../public/workshop-promotions.json', import.meta.url), new URL('../lib/workshop-promotions.generated.json', import.meta.url));
