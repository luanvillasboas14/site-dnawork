import React, { useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsCounter } from './components/StatsCounter';
import { AboutUs } from './components/AboutUs';
import { Jobs } from './components/Jobs';
import { ROISimulator } from './components/ROISimulator';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingButtons';
import { LeadFormModal } from './components/LeadFormModal';
import { ResumeGenerator, ResumeIntro } from './components/ResumeGenerator';
import { isResumeGeneratorLocation } from './lib/resumeSite';
import { Job } from './types';
// @ts-ignore
import lacosBg from './assets/images/Laços (1).png';

export default function App() {
  const [persona, setPersona] = useState<'candidate' | 'company'>('candidate');
  const [currentView, setView] = useState<'landing' | 'vagas' | 'curriculo'>('landing');
  const [isInterviewOpen, setIsInterviewOpen] = useState<boolean>(false);
  const [selectedJobForInterview, setSelectedJobForInterview] = useState<Job | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const openLeadModal = () => setIsLeadModalOpen(true);
  const pendingScroll = useRef<'top' | string | null>(null);

  useLayoutEffect(() => {
    const target = pendingScroll.current;
    if (!target) return;
    pendingScroll.current = null;
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [currentView]);

  const handleSetPersona = (newPersona: 'candidate' | 'company') => {
    setPersona(newPersona);
    if (newPersona === 'company' && currentView === 'curriculo') {
      setView('landing');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const jumpToTop = () => {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      root.scrollTop = 0;
      document.body.scrollTop = 0;
      root.style.scrollBehavior = previous;
    };

    if (id === 'jobs-page') {
      jumpToTop();
      if (currentView !== 'vagas') {
        flushSync(() => setView('vagas'));
        jumpToTop();
      }
      return;
    }

    if (id === 'resume-page') {
      if (currentView !== 'curriculo') {
        pendingScroll.current = 'top';
        setView('curriculo');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (currentView !== 'landing') {
      pendingScroll.current = id;
      setView('landing');
      return;
    }

    // If opening interview modal
    if (id === 'dina-section') {
      const element = document.getElementById('dina-section');
      element?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openInterviewModalForHero = () => {
    // Select first job by default for the simulation
    const defaultJob = {
      id: 'vaga-1',
      title: 'Estágio em Desenvolvimento Front-End',
      area: 'Tech' as const,
      modality: 'Híbrido' as const,
      salary: 'R$ 1.600,00',
      type: 'Estágio',
      benefits: ['Auxílio Transporte', 'Vale Refeição (R$ 30/dia)', 'Seguro de Vida', 'Mentoria Semanal'],
      location: 'Pinheiros, São Paulo - SP',
      company: 'NextGen Solutions'
    };
    setSelectedJobForInterview(defaultJob);
    setIsInterviewOpen(true);
  };

  if (isResumeGeneratorLocation()) {
    return <ResumeGenerator />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Sticky Header */}
      <Header currentPersona={persona} setPersona={handleSetPersona} scrollToSection={scrollToSection} />

      {currentView === 'vagas' ? (
        <Jobs 
          currentPersona={persona}
          isInterviewOpen={isInterviewOpen}
          setIsInterviewOpen={setIsInterviewOpen}
          selectedJobForInterview={selectedJobForInterview}
          setSelectedJobForInterview={setSelectedJobForInterview}
          isFullPage={true}
          onBackToHome={() => {
            pendingScroll.current = 'top';
            setView('landing');
          }}
        />
      ) : currentView === 'curriculo' ? (
        <ResumeIntro onBackToHome={() => {
          pendingScroll.current = 'top';
          setView('landing');
        }} />
      ) : (
        <>
          {/* 1. Hero Block */}
          <Hero 
            persona={persona} 
            setPersona={handleSetPersona} 
            openInterviewModal={openInterviewModalForHero}
            scrollToSection={scrollToSection} 
            openLeadModal={openLeadModal}
          />

          {/* Stats Counter Banner */}
          <StatsCounter currentPersona={persona} />

          {persona === 'candidate' ? (
            <div className="relative">
              <div
                className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover bg-center"
                style={{ backgroundImage: `url("${lacosBg}")` }}
              />
              <div className="absolute inset-0 bg-white/65 pointer-events-none" />
              <div className="relative">
                <Jobs
                  currentPersona={persona}
                  isInterviewOpen={isInterviewOpen}
                  setIsInterviewOpen={setIsInterviewOpen}
                  selectedJobForInterview={selectedJobForInterview}
                  setSelectedJobForInterview={setSelectedJobForInterview}
                  onViewAllJobs={() => scrollToSection('jobs-page')}
                  hideBackground
                />
                <AboutUs currentPersona={persona} openLeadModal={openLeadModal} />
                <Testimonials currentPersona={persona} scrollToSection={scrollToSection} openLeadModal={openLeadModal} hideBackground />
              </div>
            </div>
          ) : (
            <>
              {/* 3. Sobre Nós Section */}
              <AboutUs currentPersona={persona} openLeadModal={openLeadModal} />

              {/* 4. Simular Economia (B2B Return / ROI Calculator) */}
              <ROISimulator openLeadModal={openLeadModal} />

              {/* 5. Depoimentos Grid Section */}
              <Testimonials currentPersona={persona} scrollToSection={scrollToSection} openLeadModal={openLeadModal} />
            </>
          )}
        </>
      )}

      {/* 6. Polished Footer */}
      <Footer scrollToSection={scrollToSection} currentPersona={persona} />

      {/* Floating Actions: WhatsApp & Scroll to Top */}
      <FloatingButtons currentPersona={persona} />

      {/* B2B Company Lead Form Modal */}
      <LeadFormModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />

    </div>
  );
}
