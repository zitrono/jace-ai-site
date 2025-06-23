import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  outDir: './docs',
  base: '/ralph-web/',
  build: {
    assets: 'assets'
  }
});