import express from 'express';
import zlib from 'node:zlib';
import path from 'path';
import { fileURLToPath } from 'url';
import { createResumeLead } from './createResumeLead.mjs';
import { handleJobs, handleResumeFile } from './api.mjs';

const app = express();
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 3000);

function gzipResponses(req, res, next) {
  const accept = req.headers['accept-encoding'];
  if (!accept || !/\bgzip\b/.test(String(accept))) return next();

  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);
  const chunks = [];

  res.write = (chunk, encoding, cb) => {
    if (chunk && typeof chunk !== 'function') {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8'));
    }
    const callback = typeof encoding === 'function' ? encoding : cb;
    if (typeof callback === 'function') callback();
    return true;
  };

  res.end = (chunk, encoding, cb) => {
    if (typeof chunk === 'function') {
      cb = chunk;
      chunk = undefined;
    } else if (typeof encoding === 'function') {
      cb = encoding;
      encoding = undefined;
    }
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8'));
    }
    const body = Buffer.concat(chunks);
    const type = String(res.getHeader('Content-Type') || '');
    const compressible = /text|javascript|json|xml|svg|css/.test(type);
    res.write = originalWrite;
    res.end = originalEnd;
    if (!compressible || body.length < 1024 || res.getHeader('Content-Encoding')) {
      return originalEnd(body, cb);
    }
    zlib.gzip(body, (err, zipped) => {
      if (err || zipped.length >= body.length) return originalEnd(body, cb);
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Length', zipped.length);
      const vary = res.getHeader('Vary');
      res.setHeader('Vary', vary ? `${vary}, Accept-Encoding` : 'Accept-Encoding');
      return originalEnd(zipped, cb);
    });
  };

  next();
}

app.use(gzipResponses);
app.use(express.json({ limit: '1mb' }));

app.post('/api/curriculo-lead', async (req, res) => {
  try {
    res.json(await createResumeLead(req.body));
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Não foi possível enviar agora.' });
  }
});

app.get('/api/vagas', handleJobs);
app.get('/api/curriculos/:file', (req, res) => handleResumeFile(req, res, req.params.file));

app.get('/.well-known/ard.json', (_req, res) => {
  res.type('application/json');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(dist, '.well-known', 'ard.json'));
});

app.use(express.static(dist, {
  setHeaders(res, filePath) {
    const normalized = filePath.split(path.sep).join('/');
    if (normalized.endsWith('/index.html')) {
      res.setHeader('Cache-Control', 'no-cache');
      return;
    }
    if (normalized.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return;
    }
    res.setHeader('Cache-Control', 'public, max-age=2592000');
  },
}));

app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port);
