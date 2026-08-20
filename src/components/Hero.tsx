import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageSquare, ArrowRight, Sparkles, Send, ShieldCheck, Zap, Users } from 'lucide-react';
import { DecorativeShape } from './DecorativeShapes';
import { CHAT_FLOWS } from '../data';
import { Message } from '../types';
// @ts-ignore
import candidateBannerBg from '../assets/images/Banner_candidato 2.png';
// @ts-ignore
import candidateBannerMobileBg from '../assets/images/Banner_candidato mobile.png';
// @ts-ignore
import companyBannerBg from '../assets/images/Banner_empresa.png';
// @ts-ignore
import companyBannerMobileBg from '../assets/images/Banner_empressas mobile.png';

interface HeroProps {
  persona: 'candidate' | 'company';
  setPersona: (persona: 'candidate' | 'company') => void;
  openInterviewModal: () => void;
  scrollToSection?: (id: string) => void;
  openLeadModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ persona, setPersona, openInterviewModal, scrollToSection, openLeadModal }) => {
  // Chat Simulator State
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'theo',
      text: persona === 'candidate' 
        ? CHAT_FLOWS.candidate.start.text 
        : CHAT_FLOWS.company.start.text,
      timestamp: '09:30'
    }
  ]);
  const [currentStep, setCurrentStep] = useState<string>('start');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Sync chat when persona changes
  useEffect(() => {
    setCurrentStep('start');
    setIsTyping(true);
    const timer = setTimeout(() => {
      setChatHistory([
        {
          id: `sync-${Date.now()}`,
          sender: 'theo',
          text: persona === 'candidate' 
            ? CHAT_FLOWS.candidate.start.text 
            : CHAT_FLOWS.company.start.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 4000/10); // rapid scale for interactive preview

    return () => clearTimeout(timer);
  }, [persona]);

  // Handle clicking options inside simulator
  const handleOptionClick = (optionText: string, nextStep: string) => {
    if (isTyping) return;

    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: optionText,
      timestamp: userMsgTime
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulated typing response delay
    setTimeout(() => {
      const flow = CHAT_FLOWS[persona];
      const nextData = (flow as any)[nextStep];
      
      if (nextData) {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const theoMessage: Message = {
          id: `theo-${Date.now()}`,
          sender: 'theo',
          text: nextData.text,
          timestamp: replyTime
        };
        setChatHistory(prev => [...prev, theoMessage]);
        setCurrentStep(nextStep);
      }
      setIsTyping(false);
    }, 6000/10);
  };

  // Get current active choices
  const currentOptions = (CHAT_FLOWS[persona] as any)[currentStep]?.options || [];

  // Content values based on Persona
  const heroContent = {
    candidate: {
      eyebrow: 'Para candidatos (16 a 25 anos) 🚀',
      headline: 'Praticidade e velocidade nas suas ',
      headlineAccent: 'entrevistas',
      subtext: 'Realize entrevistas em até 10 minutos via WhatsApp, sem formulários demorados ou burocracia. Nós te conectamos com dezenas de vagas!',
      bullets: [
        { text: 'Entrevista disponível 24h, rápida e objetiva', icon: Zap, color: 'text-orange-500 bg-orange-100' },
        { text: '1 conversa rápida = Conexão com centenas de vagas', icon: Users, color: 'text-blue-500 bg-blue-100' },
        { text: '100% GRATUITO via WhatsApp', icon: MessageSquare, color: 'text-green-500 bg-green-100' },
      ],
      socialCount: '+17.000 contratados',
      socialSubtitle: 'jovens que decolaram a carreira',
      ctaPrimary: 'Fazer Entrevista Grátis',
      ctaSecondary: 'Conhecer Vagas Abertas'
    },
    company: {
      eyebrow: 'Para empresas e RHs modernos 🏢',
      headline: 'Triagem de jovens talentos em minutos com ',
      headlineAccent: 'Inteligência Artificial',
      subtext: 'Transforme seu recrutamento com inteligência artificial e suporte humano dedicado.',
      bullets: [
        { text: 'Redução de até 80% do tempo de triagem', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
        { text: 'Atendimento escalável no canal preferido do jovem', icon: MessageSquare, color: 'text-[#FF7A08] bg-orange-50' },
        { text: 'Candidatos hiper-alinhados e relatórios analíticos', icon: Sparkles, color: 'text-teal-600 bg-teal-50' },
      ],
      socialCount: '+300 empresas parceiras',
      socialSubtitle: 'marcas de destaque contratando',
      ctaPrimary: 'Quero Recrutar com o THEO',
      ctaSecondary: 'Simular Economia / ROI'
    }
  };

  const currentContent = heroContent[persona];

  return (
    <>
      <style>{`
        .hero-banner-responsive {
          background-image: var(--bg-mobile);
        }
        @media (min-width: 768px) {
          .hero-banner-responsive {
            background-image: var(--bg-desktop);
          }
        }
      `}</style>
      <section 
        id="hero" 
        className="hero-banner-responsive relative overflow-hidden transition-all duration-300 bg-cover bg-center bg-no-repeat min-h-[350px] sm:min-h-[420px] lg:min-h-[calc(100vh-104px)] lg:max-h-[540px] pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14 flex items-center px-4 sm:px-6 lg:px-8"
        style={{
          '--bg-desktop': `url("${persona === 'candidate' ? candidateBannerBg : companyBannerBg}")`,
          '--bg-mobile': `url("${persona === 'candidate' ? candidateBannerMobileBg : companyBannerMobileBg}")`
        } as React.CSSProperties}
      >
      {/* Reduced overlay gradient to highlight the background banner image */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        persona === 'company' 
          ? 'bg-gradient-to-r from-white/10 via-white/5 to-transparent' 
          : 'bg-gradient-to-r from-white/20 via-white/5 to-transparent'
      }`} />

      {/* Decorative Background Shapes (Matchbox-style) */}
      <DecorativeShape type="star" className="absolute top-12 left-[10%] w-16 h-16 text-[#FF7A08]/15 z-0" />
      <DecorativeShape type="diamond" className="absolute bottom-24 left-[5%] w-12 h-12 text-[#1D1E4C]/10 z-0" />
      <DecorativeShape type="triangle" className="absolute top-1/3 right-[45%] w-14 h-14 text-teal-500/10 z-0" />
      <DecorativeShape type="plus" className="absolute bottom-12 right-[50%] w-10 h-10 text-orange-400/20 z-0" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center text-left">
          
          {/* Content Column */}
          <div className="lg:col-span-12 max-w-2xl flex flex-col space-y-3 md:space-y-4 relative z-10 text-left items-start">
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-[1.1] tracking-tight text-left">
              <span className={persona === 'company' ? 'text-[#FFEBDA]' : 'text-[#1D1E4C]'}>
                {currentContent.headline}
              </span>
              <span className={`relative inline-block ml-2 ${persona === 'company' ? 'text-[#FF7A08]' : 'text-white'}`}>
                {currentContent.headlineAccent}
                <svg className={`absolute left-0 -bottom-1.5 w-full h-2.5 ${persona === 'company' ? 'text-[#FF7A08]/30' : 'text-white'}`} viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 C30,10 70,0 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-semibold text-left text-white drop-shadow-sm">
              {currentContent.subtext}
            </p>



            {/* Interactive Double CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              {persona === 'candidate' ? (
                <a
                  href="https://api.whatsapp.com/send/?phone=5511947637367&text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20as%20vagas%20de%20est%C3%A1gio%20e%20fazer%20minha%20entrevista%20com%20o%20THEO.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-bold text-white rounded-full transition-all duration-300 shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 justify-center bg-[#1D1E4C] hover:bg-[#121333] hover:shadow-xl inline-flex items-center gap-2"
                >
                  {currentContent.ctaPrimary}
                  <ArrowRight size={18} />
                </a>
              ) : (
                <button
                  onClick={() => {
                    if (openLeadModal) {
                      openLeadModal();
                    } else {
                      const element = document.getElementById('simulator-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="pill-btn px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-bold text-white rounded-full transition-all duration-300 shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 justify-center bg-[#FF7A08] hover:bg-[#e66c00] hover:shadow-xl inline-flex items-center gap-2"
                >
                  {currentContent.ctaPrimary}
                  <ArrowRight size={18} />
                </button>
              )}

              <button
                onClick={() => {
                  if (persona === 'candidate') {
                    if (scrollToSection) {
                      scrollToSection('jobs-page');
                    } else {
                      const element = document.getElementById('jobs-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    const element = document.getElementById('simulator-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="pill-btn px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-bold text-[#1D1E4C] bg-white border-2 border-[#1D1E4C] rounded-full transition-all duration-200 hover:bg-slate-50 cursor-pointer justify-center"
              >
                {currentContent.ctaSecondary}
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
    </>
  );
};
