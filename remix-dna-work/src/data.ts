import { Job, Testimonial } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'vaga-1',
    title: 'Estágio em Desenvolvimento Front-End',
    area: 'Tech',
    modality: 'Híbrido',
    salary: 'R$ 1.600,00',
    type: 'Estágio',
    benefits: ['Auxílio Transporte', 'Vale Refeição (R$ 30/dia)', 'Seguro de Vida', 'Mentoria Semanal'],
    location: 'Pinheiros, São Paulo - SP',
    company: 'NextGen Solutions'
  },
  {
    id: 'vaga-2',
    title: 'Estágio em Marketing Digital e Redes Sociais',
    area: 'Comercial',
    modality: 'Remoto',
    salary: 'R$ 1.400,00',
    type: 'Estágio',
    benefits: ['Auxílio Home Office', 'Seguro de Vida', 'Gympass', 'Curso de Inglês Grátis'],
    location: 'Remoto',
    company: 'ScaleUp Ventures'
  },
  {
    id: 'vaga-3',
    title: 'Operador de Loja e Atendimento',
    area: 'Operacional',
    modality: 'Presencial',
    salary: 'R$ 1.850,00',
    type: 'Jovem Aprendiz',
    benefits: ['Auxílio Transporte', 'Refeição no Local', 'Seguro de Vida', 'Cesta Básica'],
    location: 'Jardim Tango, São Paulo - SP',
    company: 'Supermercados D`Vinci'
  },
  {
    id: 'vaga-4',
    title: 'Estágio Administrativo e Financeiro',
    area: 'Administrativo',
    modality: 'Híbrido',
    salary: 'R$ 1.500,00',
    type: 'Estágio',
    benefits: ['Auxílio Transporte', 'Vale Alimentação', 'Assistência Médica', 'Plano de Carreira'],
    location: 'Guarulhos - SP',
    company: 'Logix Logística'
  },
  {
    id: 'vaga-5',
    title: 'Auxiliar Comercial / SDR',
    area: 'Comercial',
    modality: 'Presencial',
    salary: 'R$ 2.100,00 + Comissões',
    type: 'CLT',
    benefits: ['Auxílio Transporte', 'Vale Refeição', 'Seguro de Vida', 'Plano Odontológico'],
    location: 'Jardim Pinhal, Guarulhos - SP',
    company: 'DNA Work Trade'
  },
  {
    id: 'vaga-6',
    title: 'Estágio em Suporte ao Cliente / Customer Success',
    area: 'Administrativo',
    modality: 'Remoto',
    salary: 'R$ 1.350,00',
    type: 'Estágio',
    benefits: ['Equipamento cedido', 'Auxílio Internet', 'Seguro de Vida', 'Flexibilidade de horário'],
    location: 'Remoto',
    company: 'Fintech Hub'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  // Candidates (16-25, young, lightweight)
  {
    id: 'dep-1',
    name: 'Diego Vicente',
    role: 'Design Gráfico',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    quote: 'Foi um processo muito rápido e simples, em menos de uma semana já estava contratado para a vaga que eu queria.',
    type: 'candidate'
  },
  {
    id: 'dep-2',
    name: 'Larissa',
    role: 'Candidata Contratada',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    quote: 'Durante a minha trajetória passando pela a DNA foi bem satisfatória. Os atendentes foram bem atenciosos, me explicaram como funcionava o processo e esteve comigo durante o mesmo. A oportunidade que me proporcionarem foram uma das melhores, pois priorizaram aquilo que eu realmente precisava, que eu estava estudando, e hoje graças a DNA, eu trabalho em uma ótima empresa com ótimos benefícios!',
    type: 'candidate'
  },
  {
    id: 'dep-3',
    name: 'Eduarda',
    role: 'Candidata Contratada',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    quote: 'O meu processo de contratação pela DNA foi super dinâmico e simples. A empresa funde o nosso currículo com vagas para quais estão em nosso perfil, o que facilitou na minha candidatura e em todo o processo até a admissão.',
    type: 'candidate'
  },

  // Companies (B2B, results, serious/credibility)
  {
    id: 'dep-4',
    name: 'Clarissa',
    role: 'Express Contabilidade',
    company: 'Express Contabilidade',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    quote: 'Conhecer a DNA foi um divisor de águas para a minha empresa. Eu precisava ampliar minha equipe e já tinha passado por outras agências, mas não encontrava o suporte que realmente precisava.\n\nCom a DNA, me senti segura durante todo o processo. Eles entenderam exatamente o perfil que eu procurava e fizeram uma seleção muito assertiva dos estagiários.\n\nHoje, tenho a tranquilidade de contar com uma equipe que realmente se preocupa em encontrar os profissionais certos. Recomendo pela confiança, dedicação e excelente atendimento.',
    type: 'company'
  },
  {
    id: 'dep-5',
    name: 'Vanessa Santana',
    role: 'Eduit',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    quote: 'Contratação agil, conseguiram achar um candidato com que combina com o fit da empresa.',
    type: 'company'
  }
];

export const CHAT_FLOWS = {
  candidate: {
    start: {
      text: "Olá! Sou o CADU, assistente de IA da DNA Work. 🚀 Pronto(a) para encontrar seu estágio ou primeiro emprego de forma rápida pelo WhatsApp?",
      options: [
        { label: "Quero me candidatar", next: "candidate_area" },
        { label: "Como funciona?", next: "candidate_how" },
        { label: "Ver vagas abertas", next: "candidate_jobs" }
      ]
    },
    candidate_area: {
      text: "Excelente! Para qual área você gostaria de se candidatar hoje? Tenho vagas abertas em várias frentes maravilhosas.",
      options: [
        { label: "Tecnologia / Dev 💻", next: "candidate_finish_tech" },
        { label: "Administrativo ou CS 📊", next: "candidate_finish_admin" },
        { label: "Comercial ou Vendas 🤝", next: "candidate_finish_sales" },
        { label: "Operacional ou Atendimento 🛒", next: "candidate_finish_ops" }
      ]
    },
    candidate_how: {
      text: "É muito simples! 📲\n1. Você entra em contato comigo pelo WhatsApp.\n2. Fazemos uma conversa rápida de 10 minutos.\n3. Eu analiso seu perfil e te apresento para várias empresas parceiras!\nQuer começar sua entrevista simulada agora?",
      options: [
        { label: "Sim, começar agora!", next: "candidate_area" },
        { label: "Quero ver as vagas primeiro", next: "candidate_jobs" }
      ]
    },
    candidate_jobs: {
      text: "Temos mais de 300 vagas de estágio e jovem aprendiz abertas esta semana! Áreas como Tech, CS, Comercial e Varejo. Vamos iniciar seu cadastro?",
      options: [
        { label: "Fazer meu cadastro rápido", next: "candidate_area" },
        { label: "Falar com suporte humano", next: "candidate_support" }
      ]
    },
    candidate_finish_tech: {
      text: "Massa! 🚀 Suas preferências de Tecnologia foram salvas. Em condições reais, eu iniciaria sua entrevista técnica leve de 10 minutos pelo WhatsApp agora mesmo. Vamos decolar!",
      options: [
        { label: "Recomeçar simulação 🔄", next: "start" }
      ]
    },
    candidate_finish_admin: {
      text: "Perfeito! 📊 Área Administrativa é excelente para crescer rápido. Eu coletaria suas experiências e preferências de jornada pelo WhatsApp agora. Parabéns pelo foco!",
      options: [
        { label: "Recomeçar simulação 🔄", next: "start" }
      ]
    },
    candidate_finish_sales: {
      text: "Incrível! 🤝 A área Comercial tem excelente remuneração e vagas em crescimento. Vamos simular sua desenvoltura de comunicação em 10 minutos. Pronto(a) para brilhar!",
      options: [
        { label: "Recomeçar simulação 🔄", next: "start" }
      ]
    },
    candidate_finish_ops: {
      text: "Excelente escolha! 🛒 Temos vagas ágeis em empresas fantásticas perto de você. Vamos validar sua disponibilidade e agendar seu início rápido!",
      options: [
        { label: "Recomeçar simulação 🔄", next: "start" }
      ]
    },
    candidate_support: {
      text: "Fácil! Um de nossos mentores da DNA Work entrará em contato com você via WhatsApp para te guiar individualmente. Conte conosco!",
      options: [
        { label: "Voltar para o início 🔄", next: "start" }
      ]
    }
  },
  company: {
    start: {
      text: "Olá! Seja muito bem-vindo(a) à DNA Work. Sou o CADU. 🏢 Como posso ajudar sua empresa a contratar jovens talentos de forma 10x mais rápida?",
      options: [
        { label: "Como o CADU IA funciona?", next: "company_how" },
        { label: "Simular Economia / ROI 💰", next: "company_roi" },
        { label: "Quero cadastrar uma vaga", next: "company_register" }
      ]
    },
    company_how: {
      text: "Nossa IA conversa com milhares de candidatos simultaneamente via WhatsApp, aplicando testes comportamentais e avaliações iniciais em 10 minutos. Você recebe apenas os candidatos qualificados no seu painel. Reduz em até 80% o tempo operacional de RH!",
      options: [
        { label: "Ver simulação de economia", next: "company_roi" },
        { label: "Agendar Demo com Especialista", next: "company_demo" }
      ]
    },
    company_roi: {
      text: "Excelente! Para empresas parceiras, reduzimos o Custo por Contratação (CAC) e diminuímos o tempo de triagem de semanas para poucas horas. Deseja usar nosso Simulador Interativo abaixo nesta página para ver seus números exatos?",
      options: [
        { label: "Sim, rolar até o Simulador", next: "company_scroll_roi" },
        { label: "Quero que me liguem", next: "company_demo" }
      ]
    },
    company_register: {
      text: "Fantástico! Vamos estruturar o seu Programa de Estágio ou Vaga Eficiente. Nossa inteligência desenha a vaga perfeita em minutos para atrair o público jovem certo.",
      options: [
        { label: "Falar com Consultor B2B", next: "company_demo" },
        { label: "Voltar ao início 🔄", next: "start" }
      ]
    },
    company_scroll_roi: {
      text: "Perfeito! Role um pouco a tela para baixo até encontrar a seção 'Simulador de Economia B2B'. Insira sua média de contratações para ver o impacto financeiro real na sua empresa! 📈",
      options: [
        { label: "Falar com Consultor B2B 🤝", next: "company_demo" },
        { label: "Recomeçar 🔄", next: "start" }
      ]
    },
    company_demo: {
      text: "Excelente escolha! Um especialista corporativo da DNA Work entrará em contato para agendar uma demonstração exclusiva com apresentação de cases reais e proposta de onboarding de IA. Até breve!",
      options: [
        { label: "Recomeçar simulação 🔄", next: "start" }
      ]
    }
  }
};
