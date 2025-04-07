// @ts-check
import { defineConfig } from 'astro/config';

import alpinejs from '@astrojs/alpinejs';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs(), sitemap(), icon()],

  vite: {
    plugins: [tailwindcss()]
  }
});