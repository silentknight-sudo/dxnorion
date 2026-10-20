import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

// Injects search-engine site verification tags at build time when configured
// (GSC_VERIFICATION / BING_VERIFICATION env vars, value = the token only).
function siteVerification(env: Record<string, string>): Plugin {
  const clean = (v?: string) => (v || '').replace(/^.*content=["']?|["'].*$/g, '').replace(/^google-site-verification=/, '').trim();
  const tags = [
    clean(env.GSC_VERIFICATION) && `<meta name="google-site-verification" content="${clean(env.GSC_VERIFICATION)}" />`,
    clean(env.BING_VERIFICATION) && `<meta name="msvalidate.01" content="${clean(env.BING_VERIFICATION)}" />`,
  ].filter(Boolean).join('\n    ');
  return {
    name: 'site-verification',
    transformIndexHtml: (html) => html.replace('<!--site-verification-->', tags),
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env } as Record<string, string>;
  return {
    plugins: [react(), tailwindcss(), siteVerification(env)],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
