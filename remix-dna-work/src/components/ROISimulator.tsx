import React, { useState } from 'react';
import { Calculator, Clock, CircleDollarSign, TrendingUp, Sparkles, Building2, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { DecorativeShape } from './DecorativeShapes';

interface ROISimulatorProps {
  openLeadModal?: () => void;
}

export const ROISimulator: React.FC<ROISimulatorProps> = ({ openLeadModal }) => {
  // Inputs
  const [hiresCount, setHiresCount] = useState<number>(12);
  const [traditionalDays, setTraditionalDays] = useState<number>(28);
  const [traditionalCost, setTraditionalCost] = useState<number>(3000);

  // Business Email State
  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Constants
  const CADU_DAYS = 4; // average days to fill a vacancy using CADU
  const CADU_COST_REDUCTION_FACTOR = 0.72; // saving 72% compared to traditional

  // Calculations
  const timeSavedPerHire = Math.max(1, traditionalDays - CADU_DAYS);
  const totalTimeSaved = timeSavedPerHire * hiresCount;
  
  const financialSavings = Math.round(traditionalCost * CADU_COST_REDUCTION_FACTOR * hiresCount);
  const hrHoursSaved = hiresCount * 16; // Average 16 HR hours saved per vacancy

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <section id="simulator-section" className="relative overflow-hidden bg-[#1D1E4C] text-white py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <DecorativeShape type="star" className="absolute top-8 left-[4%] w-14 h-14 text-white/5" />
      <DecorativeShape type="plus" className="absolute bottom-10 right-[6%] w-10 h-10 text-[#FF7A08]/10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <span className="text-[#FF7A08] text-xs font-bold uppercase tracking-widest bg-orange-500/10 border border-[#FF7A08]/20 px-3 py-1 rounded-full">
            Calculadora de Retorno B2B
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-2 tracking-tight">
            Simule a Economia do seu Processo
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
            Descubra quanto tempo, esforço e orçamento sua empresa poupará ao migrar sua triagem e recrutamento de estágio para a DNA Work.
          </p>
          <div className="w-12 h-1 bg-[#FF7A08] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Sliders & Controls */}
          <div className="lg:col-span-6 bg-white/5 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white/10 flex flex-col justify-between text-left">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Calculator className="text-[#FF7A08]" size={20} /> Dados do seu RH Atual
            </h3>

            <div className="space-y-4">
              {/* Slider 1: Hires per Year */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <label className="font-bold text-slate-300">Contratações por Ano</label>
                  <span className="font-extrabold text-[#FF7A08] text-base bg-[#FF7A08]/10 px-2.5 py-0.5 rounded-lg border border-[#FF7A08]/20">
                    {hiresCount} vagas
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="150"
                  value={hiresCount}
                  onChange={(e) => {
                    setHiresCount(Number(e.target.value));
                    setIsSubmitted(false);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF7A08]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>2 vagas</span>
                  <span>75 vagas</span>
                  <span>150 vagas</span>
                </div>
              </div>

              {/* Slider 2: Traditional days */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <label className="font-bold text-slate-300">Dias para fechar uma vaga (Média)</label>
                  <span className="font-extrabold text-white text-base bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                    {traditionalDays} dias
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={traditionalDays}
                  onChange={(e) => {
                    setTraditionalDays(Number(e.target.value));
                    setIsSubmitted(false);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>10 dias</span>
                  <span>35 dias</span>
                  <span>60 dias</span>
                </div>
              </div>

              {/* Slider 3: Cost per Hire */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <label className="font-bold text-slate-300">Custo médio por contratação (R$)</label>
                  <span className="font-extrabold text-emerald-400 text-base bg-emerald-400/10 px-2.5 py-0.5 rounded-lg border border-emerald-400/20">
                    {formatCurrency(traditionalCost)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={traditionalCost}
                  onChange={(e) => {
                    setTraditionalCost(Number(e.target.value));
                    setIsSubmitted(false);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>R$ 500</span>
                  <span>R$ 5.000</span>
                  <span>R$ 10.000</span>
                </div>
              </div>
            </div>

            {/* Explanatory Note */}
            <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed">
              *Os cálculos baseiam-se na automação do CADU IA via WhatsApp, que atinge taxas de resposta superiores a 90% e qualificação em menos de 10 minutos.
            </div>
          </div>

          {/* Right Column: Dynamic Results Dashboard */}
          <div className="lg:col-span-6 bg-white text-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col justify-between shadow-2xl relative border-2 border-orange-500/30 text-left">
            {/* Visual Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FF7A08] text-white flex items-center justify-center">
                  <TrendingUp size={15} />
                </div>
                <h4 className="font-extrabold text-[#1D1E4C] text-base">Seu Impacto Estimado</h4>
              </div>
              <span className="bg-orange-50 text-[#FF7A08] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                DNA Work IA
              </span>
            </div>

            {/* Big Results Indicators */}
            <div className="space-y-3">
              {/* Indicator 1: Financial Savings */}
              <div className="bg-emerald-50/80 border border-emerald-100 p-3 rounded-xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CircleDollarSign size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Economia Financeira Anual</p>
                  <h3 className="text-xl md:text-2xl font-black text-emerald-700">{formatCurrency(financialSavings)}</h3>
                </div>
              </div>

              {/* Grid 2 indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Indicator 2: Days Saved */}
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Tempo Reduzido</p>
                    <h4 className="text-lg font-black text-[#1D1E4C]">{totalTimeSaved} dias</h4>
                  </div>
                </div>

                {/* Indicator 3: HR hours */}
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FF7A08] text-white flex items-center justify-center shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-[#FF7A08] uppercase tracking-widest">Horas de Operação</p>
                    <h4 className="text-lg font-black text-orange-800">{hrHoursSaved}h salvas</h4>
                  </div>
                </div>
              </div>

              {/* Comparative Timeline visual bar */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-1 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Diferença de Tempo de Contratação:</p>
                
                <div className="space-y-1.5 text-xs">
                  {/* Traditional */}
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 mb-0.5 text-[11px]">
                      <span>Recrutamento Tradicional</span>
                      <span>{traditionalDays} dias</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-400 h-full rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  {/* DNA Work */}
                  <div>
                    <div className="flex justify-between font-bold text-[#1D1E4C] mb-0.5 text-[11px]">
                      <span className="flex items-center gap-1 font-extrabold"><Sparkles size={11} className="text-[#FF7A08]" /> DNA Work (CADU)</span>
                      <span className="text-[#FF7A08] font-extrabold">{CADU_DAYS} dias 🔥</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#FF7A08] to-orange-400 h-full rounded-full" style={{ width: `${(CADU_DAYS / traditionalDays) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* B2B Commercial Proposal Lead Gen form */}
            <div className="border-t border-slate-100 pt-4 mt-4">
              {!isSubmitted ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (openLeadModal) {
                    openLeadModal();
                  } else {
                    handleSubmitProposal(e);
                  }
                }} className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 text-left">Receba a análise detalhada de ROI no seu e-mail corporativo:</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seuemail@empresa.com.br"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#1D1E4C] outline-none rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (openLeadModal) openLeadModal();
                      }}
                      className="bg-[#1D1E4C] hover:bg-indigo-950 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-98 shrink-0 cursor-pointer"
                    >
                      Enviar Proposta
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center space-y-1.5 animate-fadeIn">
                  <div className="inline-flex p-1 bg-emerald-500 text-white rounded-full">
                    <CheckCircle2 size={14} />
                  </div>
                  <h5 className="text-xs font-extrabold text-emerald-800">Proposta gerada com sucesso para {email}!</h5>
                  <p className="text-[10px] text-emerald-600 leading-relaxed">
                    Nossa equipe preparou uma apresentação executiva detalhando a economia de <strong>{formatCurrency(financialSavings)}</strong> anual na sua operação de estágios. Verifique seu e-mail!
                  </p>
                  <button
                    onClick={() => {
                      setEmail('');
                      setIsSubmitted(false);
                    }}
                    className="text-[10px] font-bold text-[#1D1E4C] underline hover:text-[#FF7A08]"
                  >
                    Calcular novamente com outro e-mail
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* CTA at end of ROISimulator Section */}
        <div className="mt-10 flex justify-center animate-fadeIn">
          <button
            onClick={() => {
              if (openLeadModal) openLeadModal();
            }}
            className="pill-btn px-8 py-4 bg-[#FF7A08] hover:bg-[#e66c00] text-white font-extrabold text-sm sm:text-base rounded-full shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Quero Recrutar com o CADU</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};
