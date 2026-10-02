export type ResumeModel =
  | 'ats'
  | 'classico'
  | 'moderno'
  | 'executivo'
  | 'lateral'
  | 'barra-direita'
  | 'linha-do-tempo'
  | 'minimalista'
  | 'compacto';

export type EducationItem = {
  id: string;
  level: string;
  course: string;
  institution: string;
  status: string;
  startYear: string;
  endYear: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  city: string;
  start: string;
  end: string;
  current: boolean;
  activities: string;
};

export type LanguageItem = {
  id: string;
  name: string;
  level: string;
};

export type CertificateItem = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type ResumeDraft = {
  model: ResumeModel;
  color: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  neighborhood: string;
  cep: string;
  birthDate: string;
  photoUrl: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  languages: LanguageItem[];
  certificates: CertificateItem[];
  affiliations: string;
  achievements: string;
  extra: string;
  links: string;
  objective: string;
};
