import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), {
      name: 'wedding-public-link-preview',
      transformIndexHtml(html) {
        // WhatsApp/iMessage read the initial HTML rather than running React.
        // Their image URLs should be absolute HTTPS URLs on the public domain.
        // Vercel provides production URL variables automatically; a custom domain
        // can be set explicitly using WEDDING_PUBLIC_URL.
        const raw = (
          process.env.WEDDING_PUBLIC_URL ||
          process.env.VERCEL_PROJECT_PRODUCTION_URL ||
          process.env.VERCEL_URL ||
          ''
        ).trim().replace(/\/+$/, '');
        const origin = raw ? (/^https?:\/\//i.test(raw) ? raw : `https://${raw}`) : '';
        // Relative URLs allow local browsing; public deployments MUST have an absolute origin.
        const imageUrl = (origin || '') + '/invitacion-preview.jpg';
        const pageUrl = (origin || '') + '/';
        return html
          .replaceAll('__WEDDING_OG_IMAGE_URL__', imageUrl)
          .replaceAll('__WEDDING_OG_PAGE_URL__', pageUrl);
      },
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
