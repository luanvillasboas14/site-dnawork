import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local', quiet: true });

let pool = null;

export function getPool() {
  if (pool) return pool;
  const connectionString = (process.env.DATABASE_URL || '').trim();
  if (!connectionString) throw new Error('DATABASE_URL não está configurada.');
  pool = new pg.Pool({ connectionString, max: 5, idleTimeoutMillis: 30000 });
  pool.on('error', (error) => console.error('[db] erro no pool:', error.message));
  return pool;
}

export function query(text, params) {
  return getPool().query(text, params);
}
