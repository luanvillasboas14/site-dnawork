import { query } from './db.mjs';

const JOBS_SQL = `
SELECT DISTINCT ON (v.vaga_id)
  v.vaga_id::text AS id,
  v.cargo         AS title,
  CASE WHEN de.nome_confidencial = 1 THEN 'Confidencial'
       ELSE COALESCE(NULLIF(e.nome_fantasia, ''), e.razao_social) END AS company_name,
  e.local,
  v.tipo_vaga,
  v.salario,
  v.beneficios,
  v.tipo_trabalho,
  COALESCE(NULLIF(v.descricao, ''), v.atividades) AS description,
  v.requisitos    AS requirements,
  v.criado_em     AS created_at
FROM public.vaga v
JOIN public.empresa e         ON e.id = v.empresa_id
LEFT JOIN dna_work.vaga dv    ON dv.id_vaga = v.id::text
LEFT JOIN dna_work.empresa de ON de.id_empresa = dv.id_empresa
WHERE COALESCE(dv.publicar, 1) = 1
ORDER BY v.vaga_id, v.criado_em DESC`;

const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// "Bairro - Cidade / SP" -> { location: "Bairro, Cidade SP", city: "Cidade", state: "SP" }
function splitLocal(local) {
  const text = String(local || '').trim();
  const slash = text.lastIndexOf(' / ');
  const state = slash >= 0 ? text.slice(slash + 3).trim() : '';
  const beforeState = slash >= 0 ? text.slice(0, slash) : text;
  const dash = beforeState.indexOf(' - ');
  const district = dash >= 0 ? beforeState.slice(0, dash).trim() : '';
  const city = (dash >= 0 ? beforeState.slice(dash + 3) : beforeState).trim();
  const place = [district, city].filter(Boolean).join(', ');
  return { location: [place, state].filter(Boolean).join(' '), city, state };
}

function salaryRange(value) {
  const amount = Number(value);
  if (value === null || value === undefined || !Number.isFinite(amount) || amount === 0) return '';
  return BRL.format(amount);
}

// Returned as an array (not a ", " string) because values like "VR R$33,00 o dia"
// contain commas and Jobs.tsx would split them apart.
function benefitList(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((line) => line.split(' — ')[0])
    .flatMap((line) => line.split(' + '))
    .map((item) => item.trim())
    .filter(Boolean);
}

function workMode(value) {
  const text = String(value || '').trim();
  if (!text) return 'Presencial';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toJob(row) {
  const { location, city, state } = splitLocal(row.local);
  return {
    id: row.id,
    title: row.title,
    company_name: row.company_name,
    description: row.description,
    requirements: row.requirements,
    location,
    city,
    state,
    contract_type: Number(row.tipo_vaga) === 1 ? 'Estágio' : 'CLT',
    salary_range: salaryRange(row.salario),
    benefits: benefitList(row.beneficios),
    work_mode: workMode(row.tipo_trabalho),
    created_at: row.created_at,
    is_active: true,
    is_featured: true,
  };
}

export async function listJobs() {
  const { rows } = await query(JOBS_SQL);
  return rows.map(toJob);
}
