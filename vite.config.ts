import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {pathToFileURL} from 'node:url';
import {defineConfig} from 'vite';

function resumeLeadApi() {
  return {
    name: 'resume-lead-api',
    configureServer(server) {
      server.middlewares.use('/api/curriculo-lead', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', async () => {
          try {
            const leadFile = path.resolve(__dirname, 'server/createResumeLead.mjs');
            const pdfFile = path.resolve(__dirname, 'server/resumePdf.mjs');
            const version = Math.max(fs.statSync(leadFile).mtimeMs, fs.statSync(pdfFile).mtimeMs);
            const loaded = await import(`${pathToFileURL(leadFile).href}?v=${version}`);
            const result = await loaded.createResumeLead(JSON.parse(raw || '{}'));
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (error) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({message: error instanceof Error ? error.message : 'Não foi possível enviar agora.'}));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), resumeLeadApi()],
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
