import dotenv from 'dotenv';
import fs from 'node:fs';

dotenv.config({ path: '.env.local', quiet: true });

async function publishResumePdf(input) {
  const file = new URL('./resumePdf.mjs', import.meta.url);
  const version = fs.statSync(file).mtimeMs;
  const loaded = await import(`${file.href}?v=${version}`);
  return loaded.publishResumePdf(input);
}

const CAMPAIGN = 'gerador de curriculo';
const PIPELINE_PRINCIPAL = 'cmodk1kqc0002qp013eranfa2';
const STAGE_ATIVACAO = 'cmstdsc2v04pjk101qb2s0a6q';
const STAGE_PERDIDO = 'cf133884ea761486f9855d93ffa4862a9';
const TAG_CURRICULO = 'Curriculo_novo';
const ORIGIN_WEBHOOK = 'https://dnaworkia-candidaturas.vkfaze.easypanel.host/api/webhooks/lead-criado';

const LEVEL_RANK = [
  'Ensino fundamental',
  'Ensino médio',
  'Técnico',
  'Superior',
  'Pós-graduação',
  'Mestrado',
  'Doutorado',
];

function isBasicLevel(level) {
  return level === 'Ensino fundamental' || level === 'Ensino médio';
}

function lines(value) {
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function phoneParts(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length > 11) digits = digits.slice(2);
  return { e164: `+55${digits}`, local: digits };
}

function ageFromBirth(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value || '').trim());
  if (!match) return '';
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const birth = new Date(year, month - 1, day);
  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day) return '';
  const today = new Date();
  let age = today.getFullYear() - year;
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  if (age < 0 || age > 120) return '';
  return String(age);
}

function principalEducation(education) {
  const filled = (education || []).filter((item) => item.level || item.institution || item.course);
  if (!filled.length) return null;
  return filled.reduce((best, item) =>
    LEVEL_RANK.indexOf(item.level) > LEVEL_RANK.indexOf(best.level) ? item : best
  );
}

function formatEducation(item) {
  const parts = [item.level];
  if (!isBasicLevel(item.level) && item.course?.trim()) parts.push(item.course.trim());
  if (item.institution?.trim()) parts.push(item.institution.trim());
  if (item.status?.trim()) parts.push(item.status.trim());
  const years = [item.startYear, item.status === 'Cursando' ? '' : item.endYear].filter(Boolean).join('–');
  if (years) parts.push(years);
  return parts.filter(Boolean).join(' — ');
}

function formatExperience(item) {
  const period = item.current ? item.start : [item.start, item.end].filter(Boolean).join('–');
  const header = [item.company, item.role, item.city, period].filter((part) => part && part.trim()).join(' — ');
  const activities = lines(item.activities).map((line) => `- ${line}`);
  return [header, ...activities].filter(Boolean).join('\n');
}

export function buildResumeText(draft) {
  const blocks = [];
  if (draft.objective?.trim()) blocks.push(`Objetivo\n${draft.objective.trim()}`);

  const education = (draft.education || []).map(formatEducation).filter(Boolean);
  if (education.length) blocks.push(`Formação\n${education.join('\n')}`);

  const experience = (draft.experience || []).map(formatExperience).filter(Boolean);
  if (experience.length) blocks.push(`Experiência\n${experience.join('\n\n')}`);

  const skills = (draft.skills || []).map((skill) => skill.trim()).filter(Boolean);
  if (skills.length) blocks.push(`Competências\n${skills.map((skill) => `- ${skill}`).join('\n')}`);

  const languages = (draft.languages || [])
    .filter((item) => item.name?.trim())
    .map((item) => [item.name.trim(), item.level?.trim()].filter(Boolean).join(' · '));
  if (languages.length) blocks.push(`Idiomas\n${languages.join('\n')}`);

  const certificates = (draft.certificates || [])
    .filter((item) => item.name?.trim() || item.issuer?.trim() || item.year?.trim())
    .map((item) => [item.name, item.issuer, item.year].filter((part) => part && part.trim()).join(' — '));
  if (certificates.length) blocks.push(`Certificados\n${certificates.join('\n')}`);

  if (draft.affiliations?.trim()) blocks.push(`Afiliações\n${draft.affiliations.trim()}`);
  if (draft.achievements?.trim()) blocks.push(`Conquistas\n${draft.achievements.trim()}`);
  if (draft.extra?.trim()) blocks.push(`Informações\n${draft.extra.trim()}`);
  if (draft.links?.trim()) blocks.push(`Sites\n${draft.links.trim()}`);

  return blocks.join('\n\n');
}

export function buildLeadPayload(draft) {
  const name = String(draft.name || '').trim();
  const email = String(draft.email || '').trim();
  const { e164, local } = phoneParts(draft.phone);
  const address = [draft.neighborhood, draft.city, draft.state].filter((part) => part && String(part).trim()).join(', ');
  const birth = String(draft.birthDate || '').trim();
  const cep = String(draft.cep || '').trim();
  const age = ageFromBirth(birth);
  const mainEducation = principalEducation(draft.education);
  const fields = [
    { name: 'campanha', value: CAMPAIGN },
    { name: 'curriculo', value: buildResumeText(draft) },
    { name: 'nome_completo', value: name },
    { name: 'endereco', value: address },
    { name: 'cep', value: cep },
    { name: 'data_de_nascimento', value: birth },
    age ? { name: 'idade', value: age } : null,
    { name: 'telefone', value: local },
    mainEducation?.level ? { name: 'escolaridade', value: mainEducation.level } : null,
    mainEducation && !isBasicLevel(mainEducation.level) && mainEducation.course?.trim()
      ? { name: 'curso', value: mainEducation.course.trim() }
      : null,
  ].filter(Boolean);

  return {
    contact: {
      name,
      phone: e164,
      email,
      source: CAMPAIGN,
    },
    deal: {
      title: name,
      stageId: STAGE_ATIVACAO,
      customFields: fields,
    },
  };
}

function readId(record, key) {
  if (!record || typeof record !== 'object') return '';
  const direct = record[key];
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  const nestedKey = key === 'contactId' ? 'contact' : key === 'dealId' ? 'deal' : '';
  const nested = nestedKey ? record[nestedKey] : null;
  if (nested && typeof nested === 'object' && typeof nested.id === 'string') return nested.id.trim();
  return '';
}

function firstName(name) {
  return String(name || '').trim().split(/\s+/).filter(Boolean)[0] || '';
}

function fold(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

function listItems(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

function isBlank(value) {
  return value == null || String(value).trim() === '';
}

async function crm(url, token, path, init = {}) {
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    const message = data && typeof data === 'object' && typeof data.message === 'string'
      ? data.message
      : 'Não foi possível consultar o CRM.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}

async function crmOptional(url, token, path) {
  try {
    return await crm(url, token, path);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

function pipelineId(deal) {
  const stageId = deal.stageId || deal.stage?.id || '';
  if (stageId === STAGE_PERDIDO || stageId === STAGE_ATIVACAO) return PIPELINE_PRINCIPAL;
  return deal.stage?.pipelineId || deal.stage?.pipeline?.id || deal.pipelineId || '';
}

function isLost(deal) {
  const stageId = deal.stageId || deal.stage?.id || '';
  if (stageId === STAGE_PERDIDO) return true;
  if (fold(deal.stage?.name) === 'perdido') return true;
  return deal.status === 'LOST';
}

async function findDeals(url, token, phone) {
  const { e164, local } = phoneParts(phone);
  let contactId = '';
  for (const value of [e164, local, `55${local}`]) {
    const data = await crmOptional(url, token, `/api/contacts?phone=${encodeURIComponent(value)}&perPage=5`);
    contactId = listItems(data).find((item) => item.id)?.id || '';
    if (contactId) break;
  }

  const paths = [
    contactId ? `/api/deals?contactId=${encodeURIComponent(contactId)}&perPage=50` : '',
    contactId ? `/api/deals?contactId=${encodeURIComponent(contactId)}&status=LOST&perPage=50` : '',
    `/api/deals?contactPhone=${encodeURIComponent(e164)}&perPage=50`,
    `/api/deals?search=${encodeURIComponent(local)}&perPage=20`,
    `/api/deals?stageId=${encodeURIComponent(STAGE_PERDIDO)}&search=${encodeURIComponent(local)}&perPage=20`,
  ].filter(Boolean);

  const seen = new Map();
  for (const path of paths) {
    const data = await crmOptional(url, token, path);
    for (const deal of listItems(data)) {
      if (deal.id) seen.set(deal.id, deal);
    }
  }

  const deals = [];
  for (const deal of seen.values()) {
    const full = await crmOptional(url, token, `/api/deals/${deal.id}`);
    const merged = full?.id ? { ...deal, ...full, contactId: full.contactId || deal.contactId || contactId } : deal;
    const ownerId = merged.contactId || '';
    const phone = String(merged.contact?.phone || '').replace(/\D/g, '');
    const belongs = (contactId && ownerId === contactId) || phone.endsWith(local);
    if (belongs) deals.push(merged);
  }
  return { contactId, deals };
}

function pickDeal(deals) {
  const newest = (list) => [...list].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0] || null;
  const principal = deals.filter((deal) => pipelineId(deal) === PIPELINE_PRINCIPAL);
  const open = principal.filter((deal) => !isLost(deal));
  if (open.length) return { deal: newest(open), lostInPrincipal: false };
  const lost = newest(principal.filter(isLost));
  if (lost) return { deal: lost, lostInPrincipal: true };
  return { deal: newest(deals), lostInPrincipal: false };
}

let fieldIds = null;

async function dealFieldIds(url, token) {
  if (fieldIds) return fieldIds;
  const data = await crm(url, token, '/api/custom-fields?entity=deal');
  const map = new Map();
  for (const field of listItems(data).length ? listItems(data) : (Array.isArray(data) ? data : [])) {
    if (field.id && field.name) map.set(fold(field.name), field.id);
  }
  if (!map.size && Array.isArray(data)) {
    for (const field of data) {
      if (field.id && field.name) map.set(fold(field.name), field.id);
    }
  }
  fieldIds = map;
  return map;
}

async function currentDealFields(url, token, dealId) {
  const data = await crm(url, token, `/api/deals/${dealId}/custom-fields`);
  const list = Array.isArray(data) ? data : listItems(data);
  return list
    .map((field) => ({
      fieldId: field.fieldId || field.customFieldId || '',
      value: field.value,
    }))
    .filter((field) => field.fieldId);
}

async function fillEmptyDealFields(url, token, deal, fields) {
  const ids = await dealFieldIds(url, token);
  const currentList = await currentDealFields(url, token, deal.id);
  const current = new Map(currentList.map((field) => [field.fieldId, field.value]));
  const updates = new Map();
  for (const field of fields) {
    const fieldId = ids.get(fold(field.name));
    const always = fold(field.name) === 'curriculo';
    if (!fieldId || isBlank(field.value)) continue;
    if (!always && !isBlank(current.get(fieldId))) continue;
    updates.set(fieldId, field.value);
  }

  const values = [...updates.entries()]
    .filter(([, value]) => !isBlank(value))
    .map(([fieldId, value]) => ({ fieldId, value: String(value) }));
  if (!values.length) return;
  await crm(url, token, `/api/deals/${deal.id}/custom-fields`, {
    method: 'PUT',
    body: JSON.stringify({ values }),
  });
}

async function fillEmptyContact(url, token, contactId, payload, rename) {
  if (!contactId) return;
  const contact = await crmOptional(url, token, `/api/contacts/${contactId}`);
  const body = {};
  if (rename) body.name = firstName(payload.contact.name);
  if (contact && isBlank(contact.email) && payload.contact.email) body.email = payload.contact.email;
  if (!Object.keys(body).length) return;
  await crm(url, token, `/api/contacts/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

async function addTag(url, token, dealId) {
  const tag = await fetch(`${url}/api/deals/${dealId}/tags`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tagName: TAG_CURRICULO }),
  });
  if (!tag.ok) throw new Error('O lead foi atualizado, mas a tag não foi adicionada.');
}

export async function createResumeLead(draft) {
  const url = (process.env.CRM_DNA_API_URL || '').trim().replace(/\/+$/, '');
  const token = (process.env.CRM_DNA_API_TOKEN || '').trim();
  if (!url || !token) {
    throw new Error('O envio do currículo ainda não está configurado.');
  }

  const payload = buildLeadPayload(draft);
  if (!payload.contact.name) throw new Error('Preencha o nome.');
  if (!/^\+55\d{10,11}$/.test(payload.contact.phone)) throw new Error('O telefone precisa estar no formato (11) 98765-4321.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.contact.email)) throw new Error('O e-mail está inválido.');
  if (!/^\d{5}-\d{3}$/.test(String(draft.cep || '').trim())) throw new Error('O CEP precisa estar no formato 00000-000.');

  const pdfUrl = await publishResumePdf({
    name: payload.contact.name,
    phone: payload.contact.phone,
    draft,
  });
  if (!pdfUrl.startsWith('https://')) throw new Error('Não foi possível publicar o PDF do currículo.');
  payload.deal.customFields = [
    { name: 'curriculo', value: pdfUrl },
    ...payload.deal.customFields.filter((field) => field.name !== 'curriculo'),
  ];

  const found = await findDeals(url, token, payload.contact.phone);
  const chosen = pickDeal(found.deals);
  if (chosen.deal) {
    await fillEmptyDealFields(url, token, chosen.deal, payload.deal.customFields);
    const contactId = chosen.deal.contactId || found.contactId;
    if (chosen.lostInPrincipal) {
      await fillEmptyContact(url, token, contactId, payload, true);
      await crm(url, token, `/api/deals/${chosen.deal.id}`, {
        method: 'PUT',
        body: JSON.stringify({ stageId: STAGE_ATIVACAO, status: 'OPEN' }),
      });
      await addTag(url, token, chosen.deal.id);
    }
    return { ok: true, pdfUrl };
  }

  const response = await fetch(`${url}/api/leads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && typeof data.message === 'string'
        ? data.message
        : 'Não foi possível criar o lead.';
    throw new Error(message);
  }

  const contactId = readId(data, 'contactId');
  const dealId = readId(data, 'dealId');
  if (!contactId || !dealId) throw new Error('O CRM não devolveu o contato e o negócio.');

  const tag = await fetch(`${url}/api/deals/${dealId}/tags`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tagName: TAG_CURRICULO }),
  });
  if (!tag.ok) throw new Error('O lead foi criado, mas a tag não foi adicionada.');

  const origin = await fetch(ORIGIN_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'deal_created',
      contactId,
      dealId,
      telefone: payload.contact.phone,
      origem: CAMPAIGN,
      campanha: CAMPAIGN,
    }),
  });
  if (!origin.ok) throw new Error('O lead foi criado, mas a origem não foi registrada.');

  return { ok: true, pdfUrl };
}
