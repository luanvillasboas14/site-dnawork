import { listJobs } from './jobs.mjs';
import { readResumeFile } from './resumePdf.mjs';

// Handlers use only Node's req/res API so both Express (production) and the
// Vite dev middleware can call them.

function sendJson(res, status, body, cacheControl = 'no-store') {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cacheControl);
  res.end(JSON.stringify(body));
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end('Não encontrado');
}

export async function handleJobs(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end();
    return;
  }
  try {
    sendJson(res, 200, await listJobs(), 'public, max-age=300');
  } catch (error) {
    console.error('[api/vagas] falha ao listar vagas:', error);
    sendJson(res, 500, { message: 'Não foi possível carregar as vagas.' });
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// fileName is the last path segment, e.g. "<uuid>.pdf".
export async function handleResumeFile(req, res, fileName) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.end();
    return;
  }
  const match = /^([^/]+)\.pdf$/i.exec(String(fileName || ''));
  if (!match || !UUID.test(match[1])) return notFound(res);
  try {
    const file = await readResumeFile(match[1]);
    if (!file) return notFound(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.setHeader('Content-Length', String(file.bytes.length));
    res.end(req.method === 'HEAD' ? undefined : file.bytes);
  } catch (error) {
    console.error('[api/curriculos] falha ao ler currículo:', error);
    res.statusCode = 500;
    res.setHeader('Cache-Control', 'no-store');
    res.end();
  }
}
