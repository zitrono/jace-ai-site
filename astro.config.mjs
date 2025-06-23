import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  outDir: './docs',
  base: '/jace-ai-site/',
  build: {
    assets: 'assets'
  }
});