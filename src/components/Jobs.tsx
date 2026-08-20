import React, { useState, useEffect } from 'react';
import { MapPin, Wallet, Briefcase, Tag, Filter, CheckCircle, Clock, Sparkles, Send, X, ArrowLeft, Search, ChevronDown } from 'lucide-react';
import { INITIAL_JOBS } from '../data';
import { Job, Message } from '../types';
import { supabase } from '../lib/supabase';
// @ts-ignore
import lacosBg from '../assets/images/Laços (1).png';

interface JobsProps {
  currentPersona: 'candidate' | 'company';
  isInterviewOpen: boolean;
  setIsInterviewOpen: (isOpen: boolean) => void;
  selectedJobForInterview: Job | null;
  setSelectedJobForInterview: (job: Job | null) => void;
  isFullPage?: boolean;
  onBackToHome?: () => void;
  onViewAllJobs?: () => void;
}

export const Jobs: React.FC<JobsProps> = ({ 
  currentPersona, 
  isInterviewOpen, 
  setIsInterviewOpen, 
  selectedJobForInterview, 
  setSelectedJobForInterview,
  isFullPage = false,
  onBackToHome,
  onViewAllJobs
}) => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [visibleJobsCount, setVisibleJobsCount] = useState<number>(isFullPage ? 50 : 6);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  
  // Advanced filters for full-page portal
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModality, setSelectedModality] = useState<string>('Todos');
  const [selectedType, setSelectedType] = useState<string>('Todos');

  // Fetch jobs from Supabase
  useEffect(() => {
    async function fetchJobsFromSupabase() {
      try {
        setIsLoadingSupabase(true);
        const { data, error } = await supabase.from('jobs').select('*');
        if (!error && data && data.length > 0) {
          const mappedJobs: Job[] = data.map((item: any) => {
            // Map benefits string to array
            let parsedBenefits: string[] = [];
            if (Array.isArray(item.benefits)) {
              parsedBenefits = item.benefits;
            } else if (typeof item.benefits === 'string' && item.benefits.trim()) {
              parsedBenefits = item.benefits.split(',').map((b: string) => b.trim());
            }

            // Map area heuristics
            let area: 'Tech' | 'Comercial' | 'Administrativo' | 'Operacional' = 'Operacional';
            const titleLower = (item.title || '').toLowerCase();
            if (titleLower.includes('dev') || titleLower.includes('tech') || titleLower.includes('ti') || titleLower.includes('front')) {
              area = 'Tech';
            } else if (titleLower.includes('venda') || titleLower.includes('comercial') || titleLower.includes('sdr')) {
              area = 'Comercial';
            } else if (titleLower.includes('admin') || titleLower.includes('gerente') || titleLower.includes('financeiro')) {
              area = 'Administrativo';
            }

            return {
              id: item.id || `sp-${Math.random()}`,
              title: item.title || 'Vaga Aberta',
              area,
              modality: item.work_mode || 'Presencial',
              salary: item.salary_range ? `R$ ${item.salary_range}` : 'A combinar',
              type: item.contract_type || 'CLT',
              benefits: parsedBenefits.length > 0 ? parsedBenefits : ['Vale Transporte', 'Seguro de Vida'],
              location: item.location || `${item.city || ''} ${item.state || ''}`.trim() || 'São Paulo - SP',
              company: item.company_name || 'DNA Work Partners'
            };
          });

          setJobs(mappedJobs);
        }
      } catch (e) {
        console.error("Failed to load jobs from Supabase:", e);
      } finally {
        setIsLoadingSupabase(false);
      }
    }

    fetchJobsFromSupabase();
  }, []);
  
  // Custom Interview states
  const [interviewMessages, setInterviewMessages] = useState<Message[]>([]);
  const [interviewStep, setInterviewStep] = useState<number>(0);
  const [interviewAnswers, setInterviewAnswers] = useState<Record<string, string>>({});
  const [isInterviewTyping, setIsInterviewTyping] = useState<boolean>(false);

  const filters = ['Todos', 'Tech', 'Comercial', 'Administrativo', 'Operacional'];
  const modalities = ['Todos', 'Presencial', 'Híbrido', 'Remoto'];
  const types = ['Todos', 'Estágio', 'Jovem Aprendiz', 'CLT'];

  const filteredJobs = jobs.filter(job => {
    const matchesArea = isFullPage 
      ? (activeFilter === 'Todos' || job.area === activeFilter)
      : true;
    const matchesModality = selectedModality === 'Todos' || job.modality === selectedModality;
    const matchesType = isFullPage
      ? (selectedType === 'Todos' || job.type === selectedType)
      : (activeFilter === 'Todos' || job.type === activeFilter);
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesModality && matchesType && matchesSearch;
  });

  // Trigger simulated WhatsApp interview modal
  const handleStartInterview = (job: Job) => {
    setSelectedJobForInterview(job);
    setIsInterviewOpen(true);
    setInterviewStep(0);
    setInterviewAnswers({});
    
    // Set initial greeting
    setIsInterviewTyping(true);
    setTimeout(() => {
      setInterviewMessages([
        {
          id: 'int-1',
          sender: 'theo',
          text: `Olá! Sou o THEO. 🚀 Vi que você tem interesse na vaga de *${job.title}* na empresa *${job.company}*. Estou super animado para te entrevistar!`,
          timestamp: 'Agora'
        },
        {
          id: 'int-2',
          sender: 'theo',
          text: `Para começarmos, me diz: qual o seu nome completo e qual a sua idade?`,
          timestamp: 'Agora'
        }
      ]);
      setIsInterviewTyping(false);
    }, 800);
  };

  const handleInterviewAnswer = (answerLabel: string, value: string, field: string) => {
    if (isInterviewTyping) return;

    // Save answer
    setInterviewAnswers(prev => ({ ...prev, [field]: value }));

    // User message
    const userMsg: Message = {
      id: `int-user-${Date.now()}`,
      sender: 'user',
      text: answerLabel,
      timestamp: 'Agora'
    };
    setInterviewMessages(prev => [...prev, userMsg]);
    setIsInterviewTyping(true);

    const nextStep = interviewStep + 1;
    setInterviewStep(nextStep);

    // THEO response logic based on steps
    setTimeout(() => {
      let theoReply = '';
      if (nextStep === 1) {
        theoReply = `Excelente, muito prazer! 🎉 Agora me conta: qual é o seu nível de experiência com as atividades dessa área?`;
      } else if (nextStep === 2) {
        theoReply = `Perfeito! E quanto à sua disponibilidade de horários? Essa vaga de *${selectedJobForInterview?.type}* é de modalidade *${selectedJobForInterview?.modality}*.`;
      } else if (nextStep === 3) {
        theoReply = `Massa! Suas respostas foram enviadas para análise automatizada. Parabéns pela conversa inteligente! Em processos reais, eu notificaria o RH da empresa e você seria agendado(a) em instantes. 🏆`;
      }

      setInterviewMessages(prev => [...prev, {
        id: `int-theo-${Date.now()}`,
        sender: 'theo',
        text: theoReply,
        timestamp: 'Agora'
      }]);
      setIsInterviewTyping(false);
    }, 1000);
  };

  const resetInterview = () => {
    if (selectedJobForInterview) {
      handleStartInterview(selectedJobForInterview);
    }
  };

  return (
    <section 
      id={isFullPage ? "jobs-page" : "jobs-section"} 
      className={`relative overflow-hidden bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8 ${
        isFullPage ? 'py-12 md:py-20 min-h-screen' : 'pt-8 pb-8 md:pt-12 md:pb-12'
      }`}
      style={{
        backgroundImage: `url("${lacosBg}")`
      }}
    >
      {/* Light subtle overlay to enhance background visibility while maintaining readability */}
      <div className="absolute inset-0 bg-white/65 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {isFullPage && onBackToHome && (
          <div className="mb-8 flex items-center justify-between text-xs font-semibold">
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-[#1D1E4C] hover:text-[#FF7A08] transition-all rounded-full"
            >
              <ArrowLeft size={14} />
              Voltar para Início
            </button>
            <div className="text-slate-400 flex items-center gap-1">
              <span>Início</span>
              <span>/</span>
              <span className="text-slate-600 font-extrabold">Portal de Vagas</span>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1D1E4C] mt-3 tracking-tight">
            {isFullPage ? (
              <>Portal de <span className="text-[#FF7A08]">Vagas</span></>
            ) : (
              <>Vagas em <span className="text-[#FF7A08]">Destaque</span></>
            )}
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-3">
            {isFullPage 
              ? 'Pesquise, filtre e encontre o seu estágio ou emprego perfeito. Faça a entrevista no WhatsApp conduzida por nossa I.A. em poucos minutos!'
              : (currentPersona === 'candidate' 
                  ? 'Encontre o seu estágio ou emprego perfeito e faça a entrevista no WhatsApp em poucos minutos!' 
                  : 'Veja exemplos de vagas triadas e preenchidas pelo THEO para nossas empresas parceiras.')
            }
          </p>
          <div className="w-16 h-1.5 bg-[#FF7A08] mx-auto mt-4 rounded-full"></div>
        </div>

        {isFullPage ? (
          /* Advanced Filters & Search for Full Page Portal */
          <div className="bg-white border border-slate-200/60 rounded-2xl md:rounded-3xl shadow-sm mb-12 text-left overflow-hidden">
            {/* Accordion header for mobile */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-[#1D1E4C] md:hidden bg-slate-50 border-b border-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-[#FF7A08]" />
                <span>Filtros de Busca</span>
                {(searchQuery || activeFilter !== 'Todos' || selectedModality !== 'Todos' || selectedType !== 'Todos') && (
                  <span className="px-2 py-0.5 text-[10px] bg-[#FF7A08] text-white rounded-full font-bold">
                    Ativo
                  </span>
                )}
              </div>
              <ChevronDown size={18} className={`text-slate-500 transform transition-transform duration-200 ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Content */}
            <div className={`p-5 md:p-8 space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-1 relative">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Buscar Vaga</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Título, empresa ou local..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#FF7A08] focus:bg-white rounded-xl text-xs font-bold text-slate-800 transition-all outline-none"
                    />
                    <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Modality Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Modalidade</label>
                  <select
                    value={selectedModality}
                    onChange={(e) => setSelectedModality(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#FF7A08] focus:bg-white rounded-xl text-xs font-bold text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                  >
                    {modalities.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tipo de Contrato</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#FF7A08] focus:bg-white rounded-xl text-xs font-bold text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                  >
                    {types.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Area Filter Tabs */}
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Filtrar Área Profissional</span>
                
                {/* Mobile Area Filter Dropdown */}
                <div className="md:hidden relative">
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-[#FF7A08] focus:ring-1 focus:ring-[#FF7A08] rounded-xl text-xs font-bold text-slate-700 transition-all outline-none appearance-none cursor-pointer"
                  >
                    {filters.map((filter) => (
                      <option key={filter} value={filter}>
                        {filter === 'Todos' ? 'Todas as Áreas' : filter}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={14} />
                  </div>
                </div>

                {/* Desktop Area Filter Tabs */}
                <div className="hidden md:flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                        activeFilter === filter
                          ? 'bg-[#1D1E4C] text-white border-[#1D1E4C] shadow-md'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Normal simple area filters for homepage (responsive: accordion dropdown for mobile, tabs for desktop) */
          <>
            {/* Mobile filter accordion */}
            <div className="md:hidden px-2 mb-10 text-left max-w-sm mx-auto">
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-extrabold text-[#1D1E4C] shadow-sm active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Filter size={15} className="text-[#FF7A08]" />
                  <span>Filtrar Vagas {activeFilter !== 'Todos' ? `(${activeFilter})` : ''}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transform transition-transform duration-200 ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileFilterOpen && (
                <div className="mt-2 p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-md space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Tipo de Contrato:
                  </label>
                  <div className="relative">
                    <select
                      value={activeFilter}
                      onChange={(e) => {
                        setActiveFilter(e.target.value);
                        setVisibleJobsCount(6);
                      }}
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#FF7A08] focus:ring-1 focus:ring-[#FF7A08] rounded-xl text-xs font-bold text-slate-700 transition-all outline-none appearance-none cursor-pointer"
                    >
                      {types.map((type) => (
                        <option key={type} value={type}>
                          {type === 'Todos' ? 'Todos os Contratos' : type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop filter tabs */}
            <div className="hidden md:flex flex-wrap items-center justify-center gap-2 mb-10">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1.5">
                <Filter size={14} /> Filtrar Tipo de Contrato:
              </span>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setActiveFilter(type);
                    setVisibleJobsCount(6);
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                    activeFilter === type
                      ? 'bg-[#1D1E4C] text-white border-[#1D1E4C] shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left">
          {filteredJobs.slice(0, visibleJobsCount).map((job) => (
            <div 
              key={job.id} 
              className="job-card p-6 flex flex-col justify-between group relative shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Top tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-1 bg-indigo-50 text-[#1D1E4C] text-[10px] font-bold rounded">
                  {job.type}
                </span>
                <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                  job.modality === 'Remoto' 
                    ? 'bg-green-100 text-green-700' 
                    : job.modality === 'Híbrido' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {job.modality}
                </span>
              </div>

              {/* Title & Company */}
              <div className="mb-4">
                <h4 className="text-base font-bold text-[#1D1E4C] group-hover:text-[#FF7A08] transition-colors leading-tight">
                  {job.title}
                </h4>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">
                  {job.company} • {job.location}
                </p>
              </div>

              {/* Info Block */}
              <div className="space-y-2.5 py-4 border-t border-b border-slate-100 mb-5 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Salário</span>
                  <span className="text-[#FF7A08] font-bold text-sm">{job.salary}</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-6 flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Benefícios inclusos:</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.benefits.map((benefit, bIdx) => (
                    <span 
                      key={bIdx} 
                      className="px-2 py-1 bg-[#F4F7FA] text-slate-600 rounded-lg text-[10px] font-semibold"
                    >
                      • {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <a
                  href="https://api.whatsapp.com/send/?phone=5511947637367&text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20as%20vagas%20de%20est%C3%A1gio%20e%20fazer%20minha%20entrevista%20com%20o%20THEO.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 bg-[#F4F7FA] hover:bg-[#FF7A08] hover:text-white text-[#1D1E4C] hover:text-white transition-colors rounded-xl text-[11px] font-bold uppercase tracking-wider cursor-pointer text-center"
                >
                  FAZER ENTREVISTA
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* No Jobs Found Fallback */}
        {filteredJobs.length === 0 && (
          <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm mt-8">
            <Briefcase className="mx-auto text-slate-300 w-12 h-12 mb-4" />
            <h4 className="text-lg font-extrabold text-[#1D1E4C]">Nenhuma vaga encontrada</h4>
            <p className="text-sm text-slate-500 mt-2">Não encontramos nenhuma vaga correspondente aos filtros selecionados. Tente ajustar os filtros ou buscar por outro termo.</p>
          </div>
        )}

        {/* See All Jobs CTA */}
        {!isFullPage && (
          <div className="text-center mt-12">
            <button
              onClick={onViewAllJobs}
              className="px-8 py-3.5 bg-[#FF7A08] hover:bg-[#e66c00] text-white text-xs font-bold rounded-full transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:translate-y-px cursor-pointer"
            >
              Ver mais vagas
            </button>
          </div>
        )}

        {/* Back to Home Button at bottom of Portal */}
        {isFullPage && onBackToHome && (
          <div className="text-center mt-16">
            <button
              onClick={onBackToHome}
              className="px-8 py-3.5 bg-white border border-slate-200 hover:border-[#FF7A08] hover:text-[#FF7A08] text-[#1D1E4C] hover:bg-slate-50 text-xs font-extrabold rounded-full transition-all shadow-sm"
            >
              ← Voltar para a Página Inicial
            </button>
          </div>
        )}

      </div>

      {/* =======================================================
          INTERACTIVE WHATSAPP INTERVIEW SIMULATOR MODAL (THEO)
          ======================================================= */}
      {isInterviewOpen && selectedJobForInterview && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[420px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            
            {/* Header: WhatsApp style */}
            <div className="bg-[#1D1E4C] text-white pt-5 pb-3.5 px-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <span className="font-black text-[#FF7A08] text-base">C</span>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-[#1D1E4C]"></div>
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-sm leading-tight">THEO Recrutador</h4>
                  <span className="text-[10px] text-green-300 font-semibold uppercase tracking-wider">online</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={resetInterview} 
                  title="Reiniciar Entrevista" 
                  className="p-1 text-slate-300 hover:text-white transition-colors"
                >
                  <Clock size={16} />
                </button>
                <button
                  onClick={() => setIsInterviewOpen(false)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Context bar about the job */}
            <div className="bg-orange-50 border-b border-orange-100 py-2.5 px-4 text-left flex items-center gap-2">
              <Sparkles size={14} className="text-[#FF7A08]" />
              <p className="text-[11px] text-slate-600">
                Você está entrevistando para: <strong className="text-[#1D1E4C]">{selectedJobForInterview.title}</strong>
              </p>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100 min-h-[300px]">
              {interviewMessages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id || index}
                    className={`flex flex-col max-w-[85%] ${
                      isUser ? 'self-end ml-auto items-end' : 'self-start mr-auto items-start'
                    } animate-slideUp`}
                  >
                    <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                      isUser 
                        ? 'bg-[#FF7A08] text-white rounded-br-none' 
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isInterviewTyping && (
                <div className="self-start mr-auto bg-white border border-slate-200 py-3 px-5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                </div>
              )}
            </div>

            {/* Interactive Options Area */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-2">
              {interviewStep === 0 && !isInterviewTyping && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleInterviewAnswer("Ana Clara, 20 anos 🎓", "Ana Clara, 20 anos", "candidate_name")}
                    className="p-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-800 transition-all active:scale-95 text-center"
                  >
                    Ana Clara, 20 anos
                  </button>
                  <button
                    onClick={() => handleInterviewAnswer("Pedro Santos, 22 anos 🚀", "Pedro Santos, 22 anos", "candidate_name")}
                    className="p-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-800 transition-all active:scale-95 text-center"
                  >
                    Pedro Santos, 22 anos
                  </button>
                </div>
              )}

              {interviewStep === 1 && !isInterviewTyping && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleInterviewAnswer("Estou buscando meu primeiro estágio 🌟", "Sem experiência", "experience")}
                    className="p-3 text-left bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-800 transition-all"
                  >
                    Buscando meu 1º estágio (Sem experiência)
                  </button>
                  <button
                    onClick={() => handleInterviewAnswer("Já fiz projetos pessoais e bootcamps 💻", "Projetos pessoais", "experience")}
                    className="p-3 text-left bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-800 transition-all"
                  >
                    Tenho projetos pessoais / Acadêmicos
                  </button>
                  <button
                    onClick={() => handleInterviewAnswer("Já tive outra experiência de trabalho 🏢", "Com experiência", "experience")}
                    className="p-3 text-left bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-800 transition-all"
                  >
                    Já trabalhei anteriormente
                  </button>
                </div>
              )}

              {interviewStep === 2 && !isInterviewTyping && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleInterviewAnswer("Disponibilidade Imediata ⚡", "Imediata", "availability")}
                    className="p-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-center"
                  >
                    Disponibilidade Imediata
                  </button>
                  <button
                    onClick={() => handleInterviewAnswer("Disponível em 15 dias 📅", "15 dias", "availability")}
                    className="p-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-center"
                  >
                    Disponível em 15 dias
                  </button>
                </div>
              )}

              {interviewStep === 3 && !isInterviewTyping && (
                <div className="text-center py-2 space-y-3">
                  <div className="inline-flex p-2 bg-green-50 text-green-600 rounded-full border border-green-200">
                    <CheckCircle size={24} />
                  </div>
                  <h5 className="text-xs font-extrabold text-[#1D1E4C]">Entrevista enviada com sucesso!</h5>
                  <button
                    onClick={() => setIsInterviewOpen(false)}
                    className="w-full py-3 bg-[#1D1E4C] hover:bg-indigo-950 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Fechar Simulador
                  </button>
                </div>
              )}
            </div>

            {/* Fake input area */}
            <div className="bg-white border-t border-slate-200 px-4 py-3 text-xs text-slate-400 text-left">
              Interação segura simulada • DNA Work
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
