import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { mainSiteHref } from '../../lib/resumeSite';
import { sendResumeLead } from '../../lib/resumeWebhook';
import { ResumePreview } from './ResumePreview';
// @ts-ignore
import logoFinal from '../../assets/images/Logo Final (1).png';
// @ts-ignore
import lacosBg from '../../assets/images/Laços (1).png';
import { formatCep, formatDate, formatMonthYear, formatPhone, formatYear, maskDigits } from './resumeMasks';
import { stepError } from './resumeRules';
import { BASIC_STATUS, COLORS, EDUCATION_LEVELS, HIGHER_STATUS, LANGUAGE_LEVELS, MODELS, SAMPLE_RESUME, SKILL_GROUPS, STATES, isBasicLevel } from './sampleResume';
import { CertificateItem, EducationItem, ExperienceItem, LanguageItem, ResumeDraft } from './types';

const STEPS = ['Modelo', 'Cabeçalho do currículo', 'Formação acadêmica', 'Histórico profissional', 'Competências', 'Objetivo', 'Finalizar'];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function blankEducation(): EducationItem {
  return { id: uid(), level: 'Ensino médio', course: '', institution: '', status: 'Completo', startYear: '', endYear: '' };
}

function blankExperience(): ExperienceItem {
  return { id: uid(), company: '', role: '', city: '', start: '', end: '', current: false, activities: '' };
}

const emptyDraft = (): ResumeDraft => ({
  model: 'moderno',
  color: '#FF7A08',
  name: '',
  phone: '',
  email: '',
  city: '',
  state: '',
  neighborhood: '',
  cep: '',
  birthDate: '',
  photoUrl: '',
  objective: '',
  education: [blankEducation()],
  experience: [blankExperience()],
  skills: [],
  languages: [],
  certificates: [],
  affiliations: '',
  achievements: '',
  extra: '',
  links: '',
});

export const ResumeWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ResumeDraft>(emptyDraft);
  const [skillFilter, setSkillFilter] = useState('Todas');
  const [customSkill, setCustomSkill] = useState('');
  const [error, setError] = useState('');

  const previewData = step === 0 ? { ...SAMPLE_RESUME, model: draft.model, color: draft.color } : draft;
  const suggestions = useMemo(() => {
    const groups = skillFilter === 'Todas' ? SKILL_GROUPS : SKILL_GROUPS.filter((group) => group.category === skillFilter);
    return groups.flatMap((group) => group.items).filter((item) => !draft.skills.includes(item));
  }, [skillFilter, draft.skills]);

  const patch = (partial: Partial<ResumeDraft>) => {
    setError('');
    setDraft((current) => ({ ...current, ...partial }));
  };

  const updateEducation = (id: string, partial: Partial<EducationItem>) => {
    setError('');
    setDraft((current) => ({
      ...current,
      education: current.education.map((item) => item.id === id ? { ...item, ...partial } : item),
    }));
  };

  const updateExperience = (id: string, partial: Partial<ExperienceItem>) => {
    setError('');
    setDraft((current) => ({
      ...current,
      experience: current.experience.map((item) => item.id === id ? { ...item, ...partial } : item),
    }));
  };

  const updateLanguage = (id: string, partial: Partial<LanguageItem>) => {
    setError('');
    setDraft((current) => ({
      ...current,
      languages: current.languages.map((item) => item.id === id ? { ...item, ...partial } : item),
    }));
  };

  const updateCertificate = (id: string, partial: Partial<CertificateItem>) => {
    setError('');
    setDraft((current) => ({
      ...current,
      certificates: current.certificates.map((item) => item.id === id ? { ...item, ...partial } : item),
    }));
  };

  const goTo = (target: number) => {
    if (target === step) return;
    if (target < step) {
      setError('');
      setStep(target);
      return;
    }
    for (let index = step; index < target; index += 1) {
      const message = stepError(index, draft);
      if (message) {
        setError(message);
        setStep(index);
        return;
      }
    }
    setError('');
    setStep(target);
  };

  const addSkill = (skill: string) => {
    const value = skill.trim();
    if (!value || draft.skills.includes(value)) return;
    patch({ skills: [...draft.skills, value] });
    setCustomSkill('');
  };

  return (
    <div className="relative min-h-screen text-[#1D1E4C] xl:h-screen xl:overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${lacosBg}")` }} />
      <div className="absolute inset-0 bg-white/75" />
      <div className="relative flex min-h-screen flex-col px-4 py-4 sm:px-6 lg:px-8 xl:h-full">
        <a href={mainSiteHref()} className="inline-flex">
          <img src={logoFinal} alt="DNA Work" className="h-10 w-auto object-contain" />
        </a>
        <h1 className="mt-3 text-3xl font-black tracking-tight">
          Gerador de <span className="text-[#FF7A08]">currículo</span>
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">
          Escolha o modelo, preencha as etapas e acompanhe a prévia ao lado. No final dá para trocar o modelo e a cor.
        </p>

        <div className="mt-4 grid min-h-0 flex-1 gap-6 xl:h-full xl:grid-cols-[220px_minmax(0,1fr)_minmax(460px,42%)] xl:overflow-hidden">
          <ol className="flex gap-2 overflow-x-auto xl:block xl:h-full xl:space-y-3 xl:overflow-y-auto">
            {STEPS.map((label, index) => (
              <li key={label} className="shrink-0">
                <button type="button" onClick={() => goTo(index)} className="flex items-center gap-2 text-left text-sm">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index === step ? 'bg-[#FF7A08] text-white' : 'bg-white text-[#1D1E4C] border border-slate-200'}`}>{index + 1}</span>
                  <span className={index === step ? 'font-bold' : 'text-slate-500'}>{label}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="min-h-0 min-w-0 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:h-full">
            {step === 0 && <ModelPicker draft={draft} onChange={patch} />}

            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome completo" value={draft.name} onChange={(name) => patch({ name })} />
                <MaskedField label="Telefone" value={draft.phone} onChange={(phone) => patch({ phone })} format={formatPhone} maxDigits={11} placeholder="(11) 98765-4321" />
                <Field label="E-mail" value={draft.email} onChange={(email) => patch({ email })} />
                <Field label="Cidade" value={draft.city} onChange={(city) => patch({ city })} />
                <label className="block text-sm font-semibold">
                  UF
                  <select value={draft.state} onChange={(event) => patch({ state: event.target.value })} className={inputClass}>
                    <option value="">Selecione</option>
                    {STATES.map((state) => <option key={state}>{state}</option>)}
                  </select>
                </label>
                <Field label="Bairro" value={draft.neighborhood} onChange={(neighborhood) => patch({ neighborhood })} />
                <MaskedField label="CEP" value={draft.cep} onChange={(cep) => patch({ cep })} format={formatCep} maxDigits={8} placeholder="00000-000" />
                <MaskedField label="Data de nascimento" value={draft.birthDate} onChange={(birthDate) => patch({ birthDate })} format={formatDate} maxDigits={8} placeholder="dd/mm/aaaa" />
                <label className="block text-sm font-semibold">
                  Foto (opcional)
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1.5 block w-full text-sm font-normal text-slate-600"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = '';
                      if (!file) return;
                      if (file.size > 800 * 1024) {
                        setError('A foto precisa ter no máximo 800 KB.');
                        return;
                      }
                      setError('');
                      patch({ photoUrl: URL.createObjectURL(file) });
                    }}
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {draft.education.map((item, index) => {
                  const basic = isBasicLevel(item.level);
                  const statuses = basic ? BASIC_STATUS : HIGHER_STATUS;
                  return (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="mb-3 flex items-center justify-between text-sm font-bold">
                        <span>Formação {index + 1}</span>
                        <button type="button" className="font-semibold text-slate-400" onClick={() => patch({ education: draft.education.filter((row) => row.id !== item.id) })}>Remover</button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Select
                          label="Nível"
                          value={item.level}
                          options={EDUCATION_LEVELS}
                          onChange={(level) => {
                            const nextStatuses = isBasicLevel(level) ? BASIC_STATUS : HIGHER_STATUS;
                            updateEducation(item.id, {
                              level,
                              status: nextStatuses.includes(item.status) ? item.status : 'Completo',
                              course: isBasicLevel(level) ? '' : item.course,
                            });
                          }}
                        />
                        {!basic && <Field label="Curso" value={item.course} onChange={(course) => updateEducation(item.id, { course })} />}
                        <Field label="Instituição" value={item.institution} onChange={(institution) => updateEducation(item.id, { institution })} />
                        <Select label="Situação" value={item.status} options={statuses} onChange={(status) => updateEducation(item.id, { status })} />
                        <MaskedField label="Ano de início" value={item.startYear} onChange={(startYear) => updateEducation(item.id, { startYear })} format={formatYear} maxDigits={4} placeholder="aaaa" />
                        <MaskedField label="Ano de fim" value={item.endYear} onChange={(endYear) => updateEducation(item.id, { endYear })} format={formatYear} maxDigits={4} placeholder="aaaa" />
                      </div>
                    </div>
                  );
                })}
                <button type="button" className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold" onClick={() => patch({ education: [...draft.education, blankEducation()] })}>
                  Adicionar formação
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {draft.experience.map((item, index) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between text-sm font-bold">
                      <span>Experiência {index + 1}</span>
                      <button type="button" className="font-semibold text-slate-400" onClick={() => patch({ experience: draft.experience.filter((row) => row.id !== item.id) })}>Remover</button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Empresa" value={item.company} onChange={(company) => updateExperience(item.id, { company })} />
                      <Field label="Cargo" value={item.role} onChange={(role) => updateExperience(item.id, { role })} />
                      <Field label="Cidade" value={item.city} onChange={(city) => updateExperience(item.id, { city })} />
                      <MaskedField label="Início" value={item.start} onChange={(start) => updateExperience(item.id, { start })} format={formatMonthYear} maxDigits={6} placeholder="mm/aaaa" />
                      <MaskedField label="Fim" value={item.end} onChange={(end) => updateExperience(item.id, { end })} format={formatMonthYear} maxDigits={6} placeholder="mm/aaaa" disabled={item.current} />
                      <label className="mt-7 flex items-center gap-2 text-sm font-semibold">
                        <input type="checkbox" checked={item.current} onChange={(event) => updateExperience(item.id, { current: event.target.checked, end: event.target.checked ? '' : item.end })} />
                        Trabalho atual
                      </label>
                      <label className="block text-sm font-semibold sm:col-span-2">
                        Atividades
                        <textarea value={item.activities} onChange={(event) => updateExperience(item.id, { activities: event.target.value })} rows={3} className={inputClass} />
                      </label>
                    </div>
                  </div>
                ))}
                <button type="button" className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold" onClick={() => patch({ experience: [...draft.experience, blankExperience()] })}>
                  Adicionar experiência
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input value={customSkill} onChange={(event) => setCustomSkill(event.target.value)} placeholder="Escreva uma competência" className={inputClass} />
                  <button type="button" className="rounded-xl bg-[#FF7A08] px-4 font-bold text-white" onClick={() => addSkill(customSkill)}>Incluir</button>
                </div>
                {draft.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {draft.skills.map((skill) => (
                      <button key={skill} type="button" onClick={() => patch({ skills: draft.skills.filter((item) => item !== skill) })} className="flex max-w-full items-center gap-1 rounded-full bg-[#1D1E4C] px-3 py-1 text-left text-xs font-semibold text-white">
                        <span className="max-w-[14rem] truncate">{skill}</span>
                        <span>×</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {['Todas', 'Atendimento', 'Administrativo', 'Operação', 'Comportamental'].map((category) => (
                    <button key={category} type="button" onClick={() => setSkillFilter(category)} className={`rounded-full px-3 py-1 text-xs font-bold ${skillFilter === category ? 'bg-[#FF7A08] text-white' : 'bg-slate-100 text-[#1D1E4C]'}`}>{category}</button>
                  ))}
                </div>
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {suggestions.map((skill) => (
                    <button key={skill} type="button" onClick={() => addSkill(skill)} className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-left text-sm">
                      <span className="text-[#FF7A08]">+</span> {skill}
                    </button>
                  ))}
                </div>
                <OptionalList
                  title="Idiomas"
                  hint="Opcional. Inclua só se quiser mostrar um idioma."
                  action="Adicionar idioma"
                  onAdd={() => patch({ languages: [...draft.languages, { id: uid(), name: '', level: 'Básico' }] })}
                >
                  {draft.languages.map((item, index) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-bold">Idioma {index + 1}</p>
                        <button type="button" className="text-sm font-semibold text-slate-400" onClick={() => patch({ languages: draft.languages.filter((row) => row.id !== item.id) })}>Remover</button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-xs font-bold tracking-wide text-slate-500">
                          IDIOMA
                          <input value={item.name} onChange={(event) => updateLanguage(item.id, { name: event.target.value })} placeholder="Ex.: Inglês" className={inputClass} />
                        </label>
                        <label className="block text-xs font-bold tracking-wide text-slate-500">
                          NÍVEL
                          <select value={item.level} onChange={(event) => updateLanguage(item.id, { level: event.target.value })} className={inputClass}>
                            {LANGUAGE_LEVELS.map((level) => <option key={level}>{level}</option>)}
                          </select>
                        </label>
                      </div>
                    </div>
                  ))}
                </OptionalList>
                <OptionalList
                  title="Certificados"
                  hint="Opcional. Uma linha vazia não impede de continuar."
                  action="Adicionar certificado"
                  onAdd={() => patch({ certificates: [...draft.certificates, { id: uid(), name: '', issuer: '', year: '' }] })}
                >
                  {draft.certificates.map((item) => (
                    <div key={item.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_120px_auto]">
                      <input value={item.name} onChange={(event) => updateCertificate(item.id, { name: event.target.value })} placeholder="Nome" className={inputClass} />
                      <input value={item.issuer} onChange={(event) => updateCertificate(item.id, { issuer: event.target.value })} placeholder="Emissor" className={inputClass} />
                      <YearBox value={item.year} onChange={(year) => updateCertificate(item.id, { year })} />
                      <button type="button" className="text-sm font-semibold text-slate-400" onClick={() => patch({ certificates: draft.certificates.filter((row) => row.id !== item.id) })}>Remover</button>
                    </div>
                  ))}
                </OptionalList>
                <OptionalText label="Afiliações" hint="Opcional. Associações ou grupos ligados à sua experiência." value={draft.affiliations} onChange={(affiliations) => patch({ affiliations })} />
                <OptionalText label="Conquistas e distinções" hint="Opcional. Prêmios, metas ou reconhecimentos." value={draft.achievements} onChange={(achievements) => patch({ achievements })} />
                <OptionalText label="Informações adicionais" hint="Opcional. Outros detalhes que queira compartilhar." value={draft.extra} onChange={(extra) => patch({ extra })} />
                <OptionalText label="Sites e links" hint="Opcional. Site, rede ou portfólio." value={draft.links} onChange={(links) => patch({ links })} />
              </div>
            )}

            {step === 5 && (
              <label className="block text-sm font-semibold">
                Objetivo profissional
                <textarea value={draft.objective} onChange={(event) => patch({ objective: event.target.value })} rows={6} className={inputClass} />
                <span className="mt-2 block font-normal text-slate-500">Duas a quatro linhas. Cargo, disponibilidade e bairro já bastam.</span>
              </label>
            )}

            {step === 6 && (
              <div>
                <ModelPicker draft={draft} onChange={patch} />
                <DownloadResume draft={draft} />
              </div>
            )}

            {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

            <div className="mt-6 flex items-center justify-between">
              <button type="button" disabled={step === 0} onClick={() => goTo(step - 1)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40">Voltar</button>
              {step < 6 && (
                <button type="button" onClick={() => goTo(step + 1)} className="rounded-full bg-[#FF7A08] px-6 py-2.5 font-bold text-white">Continuar</button>
              )}
            </div>
          </div>

          <div className="min-h-0 min-w-0 xl:h-full xl:overflow-y-auto">
            <PagedPreview data={previewData} watermark={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

function DownloadResume({ draft }: { draft: ResumeDraft }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const download = async () => {
    setDownloadError('');
    setSaving(true);
    try {
      await sendResumeLead({ ...draft, photoUrl: '' });
      setSaved(true);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : 'Não foi possível baixar agora.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        disabled={saving}
        onClick={download}
        className="w-full rounded-full bg-[#FF7A08] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {saving ? 'Preparando o PDF...' : 'Baixar currículo em PDF'}
      </button>
      {saved && <p className="mt-3 text-sm font-semibold text-[#1D1E4C]">Pronto. O download do seu currículo começou.</p>}
      {downloadError && <p className="mt-3 text-sm font-semibold text-red-600">{downloadError}</p>}
    </div>
  );
}

function ModelPicker({ draft, onChange }: { draft: ResumeDraft; onChange: (partial: Partial<ResumeDraft>) => void }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold tracking-wide text-slate-400">MODELO</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {MODELS.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => onChange({ model: model.id })}
            className={`rounded-2xl border p-3 text-left ${draft.model === model.id ? 'border-[#FF7A08] bg-orange-50' : 'border-slate-200 bg-white'}`}
          >
            <p className="font-bold">{model.name}</p>
            <p className="mt-1 text-xs text-slate-500">{model.description}</p>
          </button>
        ))}
      </div>
      <p className="mb-2 mt-5 text-xs font-bold tracking-wide text-slate-400">COR</p>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={color}
            onClick={() => onChange({ color })}
            className={`h-8 w-8 rounded-full ${draft.color === color ? 'ring-2 ring-[#1D1E4C] ring-offset-2' : ''}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

const PAGE_LIMIT = 5;
const PAGE_LIMIT_MESSAGE = 'O currículo está grande demais. O limite é de 5 páginas.';

function PagedPreview({ data, watermark }: { data: ResumeDraft; watermark: boolean }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    const measure = () => {
      const width = node.clientWidth;
      if (!width) return;
      setPageHeight(Math.max(1, Math.round((width * 297) / 210)));
      setContentHeight(node.scrollHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [data, watermark]);

  const pages = pageHeight > 0 ? Math.max(1, Math.ceil(contentHeight / pageHeight)) : 1;
  const tooBig = pages > PAGE_LIMIT;
  const shown = pageHeight > 0 ? Math.min(pages, PAGE_LIMIT) : 1;

  return (
    <div className="relative">
      {tooBig && (
        <p className="mb-3 rounded-2xl border border-[#1D1E4C]/15 bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#1D1E4C]">
          {PAGE_LIMIT_MESSAGE}
        </p>
      )}
      <div className="space-y-4">
        {Array.from({ length: shown }, (_, index) => (
          <section key={index}>
            <p className="mb-1 text-xs font-semibold text-slate-500">Página {index + 1} de {Math.min(pages, PAGE_LIMIT)}</p>
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl" style={pageHeight ? { height: pageHeight } : undefined}>
              <div style={pageHeight ? { marginTop: -index * pageHeight } : undefined}>
                <ResumePreview data={data} watermark={watermark} />
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 opacity-0" aria-hidden="true">
        <div ref={measureRef}>
          <ResumePreview data={data} watermark={watermark} />
        </div>
      </div>
    </div>
  );
}

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-[#FF7A08] focus:bg-white';

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={inputClass} />
    </label>
  );
}

function MaskedField({ label, value, onChange, format, maxDigits, placeholder, disabled }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  format: (digits: string) => string;
  maxDigits: number;
  placeholder?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (cursorRef.current == null || !ref.current) return;
    ref.current.setSelectionRange(cursorRef.current, cursorRef.current);
    cursorRef.current = null;
  });

  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        ref={ref}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        inputMode="numeric"
        onChange={(event) => {
          const next = maskDigits(event.target.value, event.target.selectionStart ?? event.target.value.length, format, maxDigits);
          cursorRef.current = next.cursor;
          onChange(next.value);
        }}
        className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
      />
    </label>
  );
}

function YearBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (cursorRef.current == null || !ref.current) return;
    ref.current.setSelectionRange(cursorRef.current, cursorRef.current);
    cursorRef.current = null;
  });
  return (
    <input
      ref={ref}
      value={value}
      placeholder="aaaa"
      inputMode="numeric"
      onChange={(event) => {
        const next = maskDigits(event.target.value, event.target.selectionStart ?? event.target.value.length, formatYear, 4);
        cursorRef.current = next.cursor;
        onChange(next.value);
      }}
      className={inputClass}
    />
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function OptionalList({ title, hint, action, onAdd, children }: { title: string; hint: string; action: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <details className="rounded-2xl border border-slate-200 p-3">
      <summary className="cursor-pointer font-bold">{title}</summary>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <div className="mt-3 space-y-2">{children}</div>
      <button type="button" className="mt-3 text-sm font-bold text-[#FF7A08]" onClick={onAdd}>{action}</button>
    </details>
  );
}

function OptionalText({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (value: string) => void }) {
  return (
    <details className="rounded-2xl border border-slate-200 p-3">
      <summary className="cursor-pointer font-bold">{label}</summary>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={2} className={inputClass} />
    </details>
  );
}
