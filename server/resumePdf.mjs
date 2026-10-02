import { randomUUID } from 'node:crypto';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const BUCKET = 'curriculos';
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const INK = rgb(0.06, 0.09, 0.16);
const BODY = rgb(0.2, 0.25, 0.33);
const MUTED = rgb(0.28, 0.33, 0.41);
const FAINT = rgb(0.39, 0.45, 0.55);
const CREAM = rgb(1, 0.957, 0.91);
const WHITE = rgb(1, 1, 1);

function safe(text) {
  return String(text || '')
    .replace(/\u2022/g, '\u00B7')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/[^\n\r\t\u0020-\u00ff]/g, '');
}

function hexToRgb(hex) {
  const value = String(hex || '#FF7A08').replace('#', '');
  const color = value.length === 3
    ? value.split('').map((part) => part + part).join('')
    : value.padEnd(6, '0').slice(0, 6);
  return rgb(
    Number.parseInt(color.slice(0, 2), 16) / 255,
    Number.parseInt(color.slice(2, 4), 16) / 255,
    Number.parseInt(color.slice(4, 6), 16) / 255,
  );
}

function linesOf(value) {
  return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean);
}

function contactLine(draft) {
  const place = [draft.neighborhood, draft.city, draft.state].filter(Boolean).join(', ');
  return [draft.phone, draft.email, place, draft.cep ? `CEP ${draft.cep}` : '', draft.birthDate ? `Nasc. ${draft.birthDate}` : ''].filter(Boolean).join(' · ');
}

function period(start, end, current) {
  if (!start && !end) return '';
  return `${start} - ${current ? 'Atual' : end}`;
}

function filled(item, keys) {
  return keys.some((key) => String(item?.[key] || '').trim());
}

export async function renderResumePdf(draft) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const accent = hexToRgb(draft.color);
  const model = draft.model || 'moderno';
  const compact = model === 'compacto';
  const airy = model === 'minimalista';
  const sidebar = model === 'lateral' ? 'left' : model === 'barra-direita' ? 'right' : '';
  const sideWidth = sidebar ? 168 : 0;
  const margin = compact ? 28 : 36;
  const contentX = sidebar === 'left' ? sideWidth + 22 : margin;
  const contentRight = sidebar === 'right' ? PAGE_WIDTH - sideWidth - 22 : PAGE_WIDTH - margin;
  const contentWidth = contentRight - contentX;
  const bodySize = compact ? 8.5 : 10;
  const titleSize = compact ? 8 : 9;
  const blockGap = airy ? 18 : compact ? 8 : 12;
  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - margin;

  const bottom = 48;

  function newPage() {
    if (doc.getPageCount() >= 5) throw new Error('O currículo está grande demais. O limite é de 5 páginas.');
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - margin;
    if (sidebar) drawSidebar();
  }

  function ensure(height) {
    if (y - height < bottom) newPage();
  }

  function wrap(text, size, face, width) {
    const words = safe(text).split(/[ \t]+/).filter(Boolean);
    const rows = [];
    let line = '';
    for (const word of words) {
      const trial = line ? `${line} ${word}` : word;
      if (face.widthOfTextAtSize(trial, size) <= width) {
        line = trial;
        continue;
      }
      if (line) rows.push(line);
      if (face.widthOfTextAtSize(word, size) <= width) {
        line = word;
        continue;
      }
      let chunk = '';
      for (const char of word) {
        const next = chunk + char;
        if (face.widthOfTextAtSize(next, size) > width && chunk) {
          rows.push(chunk);
          chunk = char;
        } else {
          chunk = next;
        }
      }
      line = chunk;
    }
    if (line) rows.push(line);
    return rows.length ? rows : [''];
  }

  function drawWrapped(text, { x = contentX, size = bodySize, face = font, color = BODY, width = contentWidth, gap = 3 } = {}) {
    const paragraphs = String(text ?? '').replace(/\r\n/g, '\n').split('\n');
    paragraphs.forEach((paragraph, index) => {
      if (!paragraph.trim()) {
        if (index < paragraphs.length - 1) {
          ensure(size);
          y -= size;
        }
        return;
      }
      for (const line of wrap(paragraph, size, face, width)) {
        ensure(size + gap);
        page.drawText(line, { x, y, size, font: face, color });
        y -= size + gap;
      }
    });
  }

  function sectionTitle(title) {
    ensure(titleSize + 28);
    y -= 2;
    const label = safe(title);
    let cursor = contentX;
    for (const char of label) {
      page.drawText(char, { x: cursor, y, size: titleSize, font: bold, color: accent });
      cursor += bold.widthOfTextAtSize(char, titleSize) + 0.45;
    }
    y -= 5;
    page.drawLine({
      start: { x: contentX, y },
      end: { x: contentRight, y },
      thickness: 0.8,
      color: accent,
    });
    y -= 12;
  }

  function splitRow(left, right, { leftFace = bold, leftColor = INK, rightColor = FAINT, size = bodySize } = {}) {
    const rightText = safe(right);
    const rightWidth = rightText ? font.widthOfTextAtSize(rightText, size) : 0;
    const leftWidth = Math.max(40, contentWidth - rightWidth - 12);
    const leftLines = wrap(left, size, leftFace, leftWidth);
    leftLines.forEach((line, index) => {
      ensure(size + 3);
      page.drawText(line, { x: contentX, y, size, font: leftFace, color: leftColor });
      if (index === 0 && rightText) {
        page.drawText(rightText, { x: contentRight - rightWidth, y, size, font, color: rightColor });
      }
      y -= size + 3;
    });
  }

  function drawSidebar() {
    const x = sidebar === 'left' ? 0 : PAGE_WIDTH - sideWidth;
    page.drawRectangle({ x, y: 0, width: sideWidth, height: PAGE_HEIGHT, color: accent });
    let sideY = PAGE_HEIGHT - 36;
    const inner = sideWidth - 28;
    for (const line of wrap(draft.name, 11, bold, inner)) {
      page.drawText(line, { x: x + 14, y: sideY, size: 11, font: bold, color: WHITE });
      sideY -= 14;
    }
    sideY -= 6;
    for (const line of wrap(contactLine(draft), 8, font, inner)) {
      page.drawText(line, { x: x + 14, y: sideY, size: 8, font, color: WHITE });
      sideY -= 11;
    }
    if (draft.skills?.length) {
      sideY -= 12;
      page.drawText(safe('COMPETÊNCIAS'), { x: x + 14, y: sideY, size: 8, font: bold, color: WHITE });
      sideY -= 14;
      for (const skill of draft.skills) {
        for (const line of wrap(`• ${skill}`, 8, font, inner)) {
          if (sideY < 36) return;
          page.drawText(line, { x: x + 14, y: sideY, size: 8, font, color: WHITE });
          sideY -= 11;
        }
      }
    }
  }

  function drawHeader() {
    const initials = String(draft.name || '').split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'AP';
    if (model === 'executivo') {
      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 78, width: PAGE_WIDTH, height: 78, color: accent });
      page.drawText(safe(draft.name), { x: margin, y: PAGE_HEIGHT - 40, size: 20, font: bold, color: WHITE });
      const contact = wrap(contactLine(draft), 9, font, PAGE_WIDTH - margin * 2)[0] || '';
      page.drawText(contact, { x: margin, y: PAGE_HEIGHT - 58, size: 9, font, color: WHITE });
      y = PAGE_HEIGHT - 100;
      return;
    }

    if (model === 'moderno') {
      const bandLeft = sidebar === 'left' ? sideWidth : 0;
      const bandRight = sidebar === 'right' ? PAGE_WIDTH - sideWidth : PAGE_WIDTH;
      page.drawRectangle({ x: bandLeft, y: PAGE_HEIGHT - 86, width: bandRight - bandLeft, height: 86, color: CREAM });
      const box = 36;
      const boxX = contentX;
      const boxY = PAGE_HEIGHT - 28 - box;
      page.drawRectangle({ x: boxX, y: boxY, width: box, height: box, color: accent });
      const initialsWidth = bold.widthOfTextAtSize(initials, 11);
      page.drawText(initials, {
        x: boxX + (box - initialsWidth) / 2,
        y: boxY + 13,
        size: 11,
        font: bold,
        color: WHITE,
      });
      const textX = boxX + box + 12;
      page.drawText(safe(draft.name), { x: textX, y: PAGE_HEIGHT - 46, size: 16, font: bold, color: INK });
      drawContact(textX, PAGE_HEIGHT - 64, contentRight - textX);
      y = PAGE_HEIGHT - 108;
      return;
    }

    const centered = model === 'classico';
    const nameSize = compact ? 16 : 18;
    const name = safe(draft.name);
    const nameWidth = bold.widthOfTextAtSize(name, nameSize);
    const nameX = centered ? contentX + (contentWidth - nameWidth) / 2 : contentX;
    page.drawText(name, { x: nameX, y, size: nameSize, font: bold, color: INK });
    y -= 16;
    const contactRows = wrap(contactLine(draft), 9, font, contentWidth);
    for (const line of contactRows) {
      const lineWidth = font.widthOfTextAtSize(line, 9);
      const lineX = centered ? contentX + (contentWidth - lineWidth) / 2 : contentX;
      page.drawText(line, { x: lineX, y, size: 9, font, color: FAINT });
      y -= 12;
    }
    y -= 8;
  }

  function drawContact(x, baseline, width) {
    const line = wrap(contactLine(draft), 8, font, width)[0] || '';
    page.drawText(line, { x, y: baseline, size: 8, font, color: FAINT });
  }

  if (sidebar) drawSidebar();
  drawHeader();

  if (draft.objective?.trim()) {
    sectionTitle('OBJETIVO PROFISSIONAL');
    drawWrapped(draft.objective, { color: BODY });
    y -= blockGap;
  }

  const experience = (draft.experience || []).filter((item) => filled(item, ['company', 'role', 'city', 'start', 'end', 'activities']));
  if (experience.length) {
    sectionTitle('HISTÓRICO PROFISSIONAL');
    for (const item of experience) {
      if (model === 'linha-do-tempo') {
        ensure(28);
        page.drawLine({
          start: { x: contentX + 2, y: y + 8 },
          end: { x: contentX + 2, y: y - 36 },
          thickness: 1.4,
          color: accent,
        });
      }
      const indent = model === 'linha-do-tempo' ? 14 : 0;
      splitRow(item.role || item.company, period(item.start, item.end, item.current));
      const place = [item.company, item.city].filter(Boolean).join(' · ');
      if (place && item.role) drawWrapped(place, { size: bodySize, color: MUTED, gap: 2, x: contentX + indent, width: contentWidth - indent });
      for (const line of linesOf(item.activities)) {
        drawWrapped(`• ${line}`, { color: BODY, x: contentX + indent, width: contentWidth - indent });
      }
      y -= compact ? 4 : 8;
    }
    y -= 4;
  }

  const education = (draft.education || []).filter((item) => filled(item, ['course', 'institution', 'startYear', 'endYear']));
  if (education.length) {
    sectionTitle('FORMAÇÃO ACADÊMICA');
    for (const item of education) {
      splitRow(item.course || item.level, [item.startYear, item.endYear].filter(Boolean).join(' - '));
      const detail = [item.institution, item.level, item.status].filter(Boolean).join(' · ');
      if (detail) drawWrapped(detail, { color: MUTED, gap: 2 });
      y -= 4;
    }
    y -= blockGap;
  }

  if (!sidebar && draft.skills?.length) {
    sectionTitle('COMPETÊNCIAS');
    for (const skill of draft.skills) drawWrapped(`• ${skill}`, { color: BODY });
    y -= blockGap;
  }

  const languages = (draft.languages || []).filter((item) => item.name?.trim());
  if (languages.length) {
    sectionTitle('IDIOMAS');
    for (const item of languages) drawWrapped([item.name, item.level].filter(Boolean).join(' · '), { color: BODY, gap: 2 });
    y -= blockGap;
  }

  const certificates = (draft.certificates || []).filter((item) => item.name?.trim() || item.issuer?.trim() || item.year?.trim());
  if (certificates.length) {
    sectionTitle('CURSOS E CERTIFICAÇÕES');
    for (const item of certificates) {
      drawWrapped([item.name, item.issuer, item.year].filter(Boolean).join(' · '), { color: BODY, gap: 2 });
    }
    y -= blockGap;
  }

  for (const [title, value] of [
    ['AFILIAÇÕES', draft.affiliations],
    ['CONQUISTAS', draft.achievements],
    ['INFORMAÇÕES ADICIONAIS', draft.extra],
    ['SITES E LINKS', draft.links],
  ]) {
    if (!String(value || '').trim()) continue;
    sectionTitle(title);
    for (const line of linesOf(value)) drawWrapped(line, { color: BODY, gap: 2 });
    y -= blockGap;
  }

  return Buffer.from(await doc.save());
}

function supabaseConfig() {
  const url = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !key) throw new Error('O armazenamento do currículo ainda não está configurado.');
  return { url, key };
}

async function ensureBucket(url, key) {
  const response = await fetch(`${url}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });
  if (response.ok || response.status === 409) return;
  const text = await response.text();
  if (/already exists/i.test(text)) return;
  throw new Error('Não foi possível publicar o PDF do currículo.');
}

export async function publishResumePdf({ name, phone, draft }) {
  const { url, key } = supabaseConfig();
  const id = randomUUID();
  const bytes = await renderResumePdf(draft);
  await ensureBucket(url, key);

  const upload = await fetch(`${url}/storage/v1/object/${BUCKET}/${id}.pdf`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': 'application/pdf',
      'x-upsert': 'true',
    },
    body: bytes,
  });
  if (!upload.ok) throw new Error('Não foi possível publicar o PDF do currículo.');

  const pdfUrl = `${url}/storage/v1/object/public/${BUCKET}/${id}.pdf`;
  const saved = await fetch(`${url}/rest/v1/curriculos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      id,
      nome: name,
      telefone: phone,
      curriculo: pdfUrl,
    }),
  });
  if (!saved.ok) throw new Error('Não foi possível salvar o currículo no banco.');

  return pdfUrl;
}
