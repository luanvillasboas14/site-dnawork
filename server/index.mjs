import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createResumeLead } from './createResumeLead.mjs';

const app = express();
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '1mb' }));

app.post('/api/curriculo-lead', async (req, res) => {
  try {
    res.json(await createResumeLead(req.body));
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Não foi possível enviar agora.' });
  }
});

app.use(express.static(dist, {
  setHeaders(res, filePath) {
    if (filePath.endsWith('favicon.ico') || filePath.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  },
}));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port);
