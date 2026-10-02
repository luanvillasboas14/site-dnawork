import { isBasicLevel } from './sampleResume';
import { ResumeDraft } from './types';

function where(kind: 'da formação' | 'da experiência', index: number, total: number) {
  return total > 1 ? ` ${kind} ${index + 1}` : '';
}

function yearError(value: string, label: 'início' | 'fim', suffix: string) {
  if (!value.trim()) return `Preencha o ano de ${label}${suffix}.`;
  if (!/^\d{4}$/.test(value)) return `O ano de ${label}${suffix} precisa ter 4 dígitos.`;
  return null;
}

function monthYearError(value: string, label: 'início' | 'fim', suffix: string) {
  if (!value.trim()) return `Preencha o ${label}${suffix}.`;
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 2) {
    const month = Number(digits.slice(0, 2));
    if (month < 1 || month > 12) return `O ${label}${suffix} está com mês inválido. Use de 01 a 12.`;
  }
  if (!/^\d{2}\/\d{4}$/.test(value)) return `O ${label}${suffix} precisa estar no formato mm/aaaa.`;
  return null;
}

function emailError(value: string) {
  const email = value.trim();
  if (!email) return 'Preencha o e-mail.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'O e-mail está inválido.';
  return null;
}

function birthError(value: string) {
  if (!value.trim()) return 'Preencha a data de nascimento.';
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return 'A data de nascimento precisa estar no formato dd/mm/aaaa.';
  const [dayText, monthText, yearText] = value.split('/');
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  if (month < 1 || month > 12) return 'A data de nascimento está com mês inválido. Use de 01 a 12.';
  const lastDay = new Date(year, month, 0).getDate();
  if (day < 1 || day > lastDay) return 'A data de nascimento está com dia inválido.';
  const birth = new Date(year, month - 1, day);
  const today = new Date();
  if (year < 1900 || birth > today) return 'A data de nascimento está inválida.';
  return null;
}

function headerError(draft: ResumeDraft) {
  if (!draft.name.trim()) return 'Preencha o nome completo.';
  if (!draft.phone.trim()) return 'Preencha o telefone.';
  if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(draft.phone)) return 'O telefone precisa estar no formato (11) 98765-4321.';
  if (!draft.email.trim()) return 'Preencha o e-mail.';
  const email = emailError(draft.email);
  if (email) return email;
  if (!draft.city.trim()) return 'Preencha a cidade.';
  if (!draft.state.trim()) return 'Selecione a UF.';
  if (!draft.neighborhood.trim()) return 'Preencha o bairro.';
  if (!draft.cep.trim()) return 'Preencha o CEP.';
  if (!/^\d{5}-\d{3}$/.test(draft.cep)) return 'O CEP precisa estar no formato 00000-000.';
  return birthError(draft.birthDate);
}

function educationError(draft: ResumeDraft) {
  if (draft.education.length === 0) return 'Adicione pelo menos uma formação.';
  for (let index = 0; index < draft.education.length; index += 1) {
    const item = draft.education[index];
    const suffix = where('da formação', index, draft.education.length);
    if (!isBasicLevel(item.level) && !item.course.trim()) return `Preencha o curso${suffix}.`;
    if (!item.institution.trim()) return `Preencha a instituição${suffix}.`;
    const start = yearError(item.startYear, 'início', suffix);
    if (start) return start;
    if (item.status !== 'Cursando') {
      const end = yearError(item.endYear, 'fim', suffix);
      if (end) return end;
    }
  }
  return null;
}

function experienceError(draft: ResumeDraft) {
  if (draft.experience.length === 0) return 'Adicione pelo menos uma experiência.';
  for (let index = 0; index < draft.experience.length; index += 1) {
    const item = draft.experience[index];
    const suffix = where('da experiência', index, draft.experience.length);
    if (!item.company.trim()) return `Preencha a empresa${suffix}.`;
    if (!item.role.trim()) return `Preencha o cargo${suffix}.`;
    if (!item.city.trim()) return `Preencha a cidade${suffix}.`;
    const start = monthYearError(item.start, 'início', suffix);
    if (start) return start;
    if (!item.current) {
      const end = monthYearError(item.end, 'fim', suffix);
      if (end) return end;
    }
    if (!item.activities.trim()) return `Preencha as atividades${suffix}.`;
  }
  return null;
}

function optionalError(draft: ResumeDraft) {
  const languages = draft.languages;
  for (let index = 0; index < languages.length; index += 1) {
    if (!languages[index].name.trim()) {
      return languages.length > 1 ? `Preencha o idioma ${index + 1}.` : 'Preencha o idioma.';
    }
    if (!languages[index].level.trim()) {
      return languages.length > 1 ? `Selecione o nível do idioma ${index + 1}.` : 'Selecione o nível do idioma.';
    }
  }
  const filledCount = draft.certificates.length;
  for (let index = 0; index < draft.certificates.length; index += 1) {
    const item = draft.certificates[index];
    if (!item.name.trim() && !item.issuer.trim() && !item.year.trim()) continue;
    const suffix = filledCount > 1 ? ` ${index + 1}` : '';
    if (!item.name.trim()) return `Preencha o nome do certificado${suffix}.`;
    if (!item.issuer.trim()) return `Preencha o emissor do certificado${suffix}.`;
    if (!item.year.trim()) return `Preencha o ano do certificado${suffix}.`;
    if (!/^\d{4}$/.test(item.year)) return `O ano do certificado${suffix} precisa ter 4 dígitos.`;
  }
  return null;
}

export function stepError(step: number, draft: ResumeDraft) {
  if (step === 1) return headerError(draft);
  if (step === 2) return educationError(draft);
  if (step === 3) return experienceError(draft);
  if (step === 4) {
    if (draft.skills.length === 0) return 'Escolha pelo menos uma competência.';
    return optionalError(draft);
  }
  if (step === 5 && !draft.objective.trim()) return 'Preencha o objetivo profissional.';
  return null;
}
