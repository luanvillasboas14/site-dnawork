import { ResumeDraft } from './types';

export const SAMPLE_RESUME: ResumeDraft = {
  model: 'moderno',
  color: '#FF7A08',
  name: 'Ana Paula Ferreira',
  phone: '(11) 98765-4321',
  email: 'ana.ferreira@email.com',
  city: 'São Paulo',
  state: 'SP',
  neighborhood: 'Vila Medeiros',
  cep: '02208-000',
  birthDate: '14/03/1994',
  photoUrl: '',
  objective:
    'Busco uma vaga de Auxiliar de Padaria na Vila Medeiros, com disponibilidade para turnos e experiência em produção, organização de vitrines e atendimento.',
  experience: [
    {
      id: 'sample-exp-1',
      role: 'Auxiliar de Padaria',
      company: 'Padaria Central',
      city: 'São Paulo',
      start: '03/2022',
      end: '',
      current: true,
      activities: 'Produção de pães, bolos e salgados\nOrganização de vitrines e controle de validade\nApoio no atendimento do balcão nos horários de pico',
    },
    {
      id: 'sample-exp-2',
      role: 'Operador de caixa',
      company: 'Mercado Bom Preço',
      city: 'São Paulo',
      start: '06/2019',
      end: '02/2022',
      current: false,
      activities: 'Operação de caixa e fechamento de turno\nReposição de mercadorias\nAtendimento ao cliente e troca de produtos',
    },
  ],
  education: [
    {
      id: 'sample-edu-1',
      level: 'Técnico',
      course: 'Técnico em Panificação',
      institution: 'SENAI São Paulo',
      status: 'Completo',
      startYear: '2018',
      endYear: '2020',
    },
    {
      id: 'sample-edu-2',
      level: 'Ensino médio',
      course: '',
      institution: 'E.E. Perdizes Dias',
      status: 'Completo',
      startYear: '2012',
      endYear: '2015',
    },
  ],
  skills: [
    'Prática com atendimento e suporte aos clientes',
    'Perfil colaborativo no dia a dia do trabalho',
    'Agilidade para cumprir rotina e entregar no prazo',
    'Pontualidade, responsabilidade e cuidado com o que foi combinado',
  ],
  languages: [
    { id: 'sample-lang-1', name: 'Português', level: 'Nativo' },
    { id: 'sample-lang-2', name: 'Espanhol', level: 'Básico' },
  ],
  certificates: [
    { id: 'sample-cert-1', name: 'Boas Práticas de Fabricação', issuer: 'SENAI', year: '2023' },
    { id: 'sample-cert-2', name: 'Atendimento ao Cliente', issuer: 'Senac', year: '2021' },
  ],
  affiliations: '',
  achievements: '',
  extra: '',
  links: '',
};

export const MODELS: { id: ResumeDraft['model']; name: string; description: string }[] = [
  { id: 'ats', name: 'ATS', description: 'Coluna única, o mais seguro para Gupy e portais.' },
  { id: 'classico', name: 'Clássico', description: 'Centralizado, formal, bom para loja e operação.' },
  { id: 'moderno', name: 'Moderno', description: 'Faixa colorida e seções limpas.' },
  { id: 'executivo', name: 'Executivo', description: 'Faixa no topo com o nome em destaque.' },
  { id: 'lateral', name: 'Lateral', description: 'Barra à esquerda com contato e competências.' },
  { id: 'barra-direita', name: 'Barra direita', description: 'Contato e competências à direita.' },
  { id: 'linha-do-tempo', name: 'Linha do tempo', description: 'Histórico profissional com marcações.' },
  { id: 'minimalista', name: 'Minimalista', description: 'Espaçado, tipografia leve, visual limpo.' },
  { id: 'compacto', name: 'Compacto', description: 'Cabe mais conteúdo em uma página.' },
];

export const LANGUAGE_LEVELS = ['Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo'];

export const COLORS = [
  '#FF7A08', '#14B8A6', '#22C55E', '#EF4444', '#64748B', '#7C3AED',
  '#2563EB', '#06B6D4', '#EC4899', '#E11D48', '#84CC16', '#F59E0B', '#1D1E4C',
];

export const EDUCATION_LEVELS = [
  'Ensino fundamental', 'Ensino médio', 'Técnico', 'Superior', 'Pós-graduação', 'Mestrado', 'Doutorado',
];

export const BASIC_STATUS = ['Completo', 'Incompleto', 'Cursando'];
export const HIGHER_STATUS = ['Completo', 'Cursando', 'Trancado'];

export function isBasicLevel(level: string) {
  return level === 'Ensino fundamental' || level === 'Ensino médio';
}

export const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export const SKILL_GROUPS: { category: string; items: string[] }[] = [
  {
    category: 'Atendimento',
    items: [
      'Prática com atendimento e suporte aos clientes',
      'Facilidade para orientar o cliente e resolver dúvidas',
    ],
  },
  {
    category: 'Administrativo',
    items: [
      'Eficiência na organização de documentos e arquivos',
      'Familiaridade com rotinas administrativas',
      'Prática com planilhas, lançamentos e conferência de informações',
      'Organização de agenda, recados e acompanhamento de prazos',
    ],
  },
  {
    category: 'Operação',
    items: [
      'Reposição de mercadorias e organização do estoque',
      'Agilidade para cumprir rotina e entregar no prazo',
      'Cuidado com limpeza, segurança e padrão do local de trabalho',
    ],
  },
  {
    category: 'Comportamental',
    items: [
      'Perfil colaborativo no dia a dia do trabalho',
      'Boa comunicação com a equipe e com a liderança',
      'Disposição para aprender rotinas novas e seguir o padrão do trabalho',
      'Pontualidade, responsabilidade e cuidado com o que foi combinado',
    ],
  },
];
