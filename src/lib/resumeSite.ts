export const RESUME_HOST = 'curriculo.dnawork.ai';
export const RESUME_PATH = '/gerador-de-curriculo';

function normalizedPath(): string {
  return window.location.pathname.replace(/\/$/, '') || '/';
}

export function isResumeGeneratorLocation(): boolean {
  const host = window.location.hostname;
  if (host === RESUME_HOST) return true;
  const path = normalizedPath();
  return path === RESUME_PATH || path.startsWith(`${RESUME_PATH}/`);
}

export function isResumeFormLocation(): boolean {
  const path = normalizedPath();
  if (window.location.hostname === RESUME_HOST) return path === '/criar';
  return path === `${RESUME_PATH}/criar`;
}

export function resumeFormHref(): string {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === RESUME_HOST) {
    return host === RESUME_HOST ? '/criar' : `${RESUME_PATH}/criar`;
  }
  return `https://${RESUME_HOST}/criar`;
}

export function resumeGeneratorHref(): string {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return RESUME_PATH;
  return `https://${RESUME_HOST}`;
}

export function mainSiteHref(): string {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return '/';
  return 'https://dnawork.ai';
}
