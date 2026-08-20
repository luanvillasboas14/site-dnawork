import React, { useState } from 'react';
import { Sparkles, CheckCircle, Zap, Shield, HelpCircle, MessageSquare, ChevronLeft, ChevronRight, ArrowRight, ChevronDown } from 'lucide-react';
import { DecorativeShape } from './DecorativeShapes';
// @ts-ignore
import dnaWorkTeam from '../assets/images/tes quem somos.png';
// @ts-ignore
import theoRobot from '../assets/images/Lobo_Showing.png';

interface AboutUsProps {
  currentPersona?: 'candidate' | 'company';
  openLeadModal?: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ currentPersona, openLeadModal }) => {
  const [theoMobileIndex, setTheoMobileIndex] = useState(0);
  const [showMoreMobile, setShowMoreMobile] = useState(false);

  const theoFeatures = [
    {
      icon: <Zap size={18} />,
      colorBg: 'bg-orange-500/20 text-[#FF7A08]',
      title: 'Processo seletivo mais rápido',
      desc: 'A tecnologia acelera a triagem e a análise das entrevistas, permitindo que o candidato receba um retorno em menos tempo.'
    },
    {
      icon: <CheckCircle size={18} />,
      colorBg: 'bg-indigo-500/20 text-indigo-700',
      title: 'Análise mais justa e imparcial',
      desc: 'A IA avalia competências e respostas com critérios padronizados, reduzindo vieses e tornando o processo seletivo mais justo para todos os candidatos.'
    },
    {
      icon: <MessageSquare size={18} />,
      colorBg: 'bg-green-500/20 text-green-700',
      title: 'Identificação de talentos',
      desc: 'A IA analisa aspectos como comunicação, raciocínio, perfil comportamental e compatibilidade com a vaga, ajudando a encontrar candidatos com alto potencial.'
    },
    {
      icon: <Shield size={18} />,
      colorBg: 'bg-teal-500/20 text-teal-700',
      title: 'Resultados Seguros',
      desc: 'LGPD compliant e integração com as principais ferramentas de ATS de RH do mercado.'
    },
  ];
  return (
    <section id="about-section" className="relative overflow-hidden bg-white pt-6 pb-6 md:pt-8 md:pb-8 px-4 sm:px-6 lg:px-8">
      {/* Decorative Floating Shapes */}
      <DecorativeShape type="diamond" className="absolute top-6 right-[8%] w-8 h-8 text-orange-500/10" />
      <DecorativeShape type="star" className="absolute bottom-10 left-[6%] w-10 h-10 text-[#1D1E4C]/15" />
      <DecorativeShape type="plus" className="absolute top-[40%] left-[45%] w-6 h-6 text-teal-400/20" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <span className="text-[#FF7A08] text-xs font-bold uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
            Conheça a DNA Work
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1D1E4C] mt-2 tracking-tight">
            Nós aproximamos jovens de grandes oportunidades
          </h2>
          <div className="w-12 h-1 bg-[#FF7A08] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Side: Creative Framed Team Image */}
          <div className="lg:col-span-5 relative">
            {/* Background solid blocks (Matchbox-style) */}
            <div className="absolute -top-3 -left-3 w-2/3 h-2/3 bg-orange-100 rounded-2xl -z-10 transform -rotate-3"></div>
            <div className="absolute -bottom-3 -right-3 w-2/3 h-2/3 bg-indigo-50 rounded-2xl -z-10 transform rotate-6"></div>
            
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src={dnaWorkTeam}
                alt="DNA Work Team collaborating in a modern colorful office"
                className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              {/* Highlight glass overlay */}
              <div className="absolute inset-0 bg-[#1D1E4C]/10 mix-blend-multiply opacity-10 group-hover:opacity-0 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Right Side: Text & Context */}
          <div className="lg:col-span-7 flex flex-col space-y-3.5 text-left">
            <h3 className="text-xl sm:text-2xl font-black text-[#1D1E4C] flex items-center gap-2">
              Quem somos nós e o que nos move?
            </h3>
            
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              A DNA Work nasceu da convicção de que o verdadeiro crescimento corporativo acontece quando conectamos talentos promissores às melhores oportunidades do mercado. Com o propósito de aproximar estudantes e empresas, estruturamos programas de estágio inteligentes e acessíveis, unindo estratégia, inovação e conexões autênticas.
            </p>

            <p className={`text-sm md:text-base text-slate-600 leading-relaxed ${showMoreMobile ? 'block' : 'hidden md:block'}`}>
              Com uma vasta experiência em recrutamento, seleção e administração de estagiários, ajudamos as organizações a superarem o desafio de encontrar profissionais qualificados de forma rápida. Entendemos a fundo o ecossistema de negócios e utilizamos essa expertise para entregar soluções de alta performance, transformando a busca por talentos em um processo exato e focado em resultados.
            </p>

            <button
              onClick={() => setShowMoreMobile(!showMoreMobile)}
              className="md:hidden text-[#FF7A08] hover:text-[#e66c00] font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer self-start focus:outline-none transition-colors mt-1"
            >
              <span>{showMoreMobile ? 'Ler menos' : 'Ler mais'}</span>
              <ChevronDown size={14} className={`transform transition-transform duration-200 ${showMoreMobile ? 'rotate-180' : ''}`} />
            </button>
          </div>

        </div>

        {/* Presenting THEO: Highlight Interactive Block */}
        <div id="dina-section" className="mt-8 md:mt-10 bg-[#FFEBDA] text-[#1D1E4C] rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 relative overflow-hidden shadow-lg text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Side: Title and Feature Grid */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#FF7A08] text-white">
                  Inteligência Artificial Integrada
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#1D1E4C]">
                  Como o THEO revoluciona o recrutamento de estágios?
                </h3>
              </div>

              {/* Mobile Carousel View (block sm:hidden) */}
              <div className="block sm:hidden relative">
                <div className="overflow-hidden rounded-xl">
                  <div 
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${theoMobileIndex * 100}%)` }}
                  >
                    {theoFeatures.map((feature, idx) => (
                      <div key={idx} className="w-full shrink-0 px-0.5">
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#1D1E4C]/10 shadow-sm text-left">
                          <div className={`w-8 h-8 rounded-lg ${feature.colorBg} flex items-center justify-center mb-2`}>
                            {feature.icon}
                          </div>
                          <h5 className="font-bold text-sm text-[#1D1E4C]">{feature.title}</h5>
                          <p className="text-[11px] text-slate-700 mt-1 leading-relaxed font-semibold">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <button
                    onClick={() => setTheoMobileIndex(prev => (prev === 0 ? theoFeatures.length - 1 : prev - 1))}
                    aria-label="Anterior"
                    className="w-7 h-7 rounded-full bg-white/80 border border-[#1D1E4C]/10 text-[#1D1E4C] flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {theoFeatures.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTheoMobileIndex(idx)}
                        aria-label={`Ir para item ${idx + 1}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === theoMobileIndex 
                            ? 'w-5 bg-[#FF7A08]' 
                            : 'w-2 bg-[#1D1E4C]/20'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setTheoMobileIndex(prev => (prev === theoFeatures.length - 1 ? 0 : prev + 1))}
                    aria-label="Próximo"
                    className="w-7 h-7 rounded-full bg-white/80 border border-[#1D1E4C]/10 text-[#1D1E4C] flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Desktop Grid View (hidden sm:grid) */}
              <div className="hidden sm:grid grid-cols-2 gap-3">
                {theoFeatures.map((feature, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[#1D1E4C]/10 hover:border-[#1D1E4C]/20 transition-all shadow-sm">
                    <div className={`w-8 h-8 rounded-lg ${feature.colorBg} flex items-center justify-center mb-2`}>
                      {feature.icon}
                    </div>
                    <h5 className="font-bold text-sm text-[#1D1E4C]">{feature.title}</h5>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed font-semibold">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: THEO Mascot Image */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end items-center">
              <img 
                src={theoRobot} 
                alt="Mascote THEO" 
                className="w-full max-w-[220px] sm:max-w-[250px] lg:max-w-[280px] h-auto object-contain transform hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* B2B Company CTA Button at bottom of Sobre Nós */}
        {currentPersona === 'company' && (
          <div className="mt-8 flex justify-center animate-fadeIn">
            <button
              onClick={openLeadModal}
              className="pill-btn px-8 py-4 bg-[#FF7A08] hover:bg-[#e66c00] text-white font-extrabold text-sm sm:text-base rounded-full shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Quero Recrutar com o THEO</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
