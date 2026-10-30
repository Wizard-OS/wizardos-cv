import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import astrowind from './vendor/integration';
const root = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400', '500', '600'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Space Grotesk',
      cssVariable: '--font-space',
      weights: ['400', '500', '600', '700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404'),
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
    }),
    mdx(),
    icon({ iconDir: 'src/assets/icons', include: { tabler: ['*'] } }),
    astrowind({ config: './src/config.yaml' }),
  ],
  markdown: { shikiConfig: { theme: 'github-dark' } },
  vite: { plugins: [tailwindcss()], resolve: { alias: { '~': path.resolve(root, 'src') } } },
});
