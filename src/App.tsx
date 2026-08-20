import React, { useState } from 'react';
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
import { Job } from './types';

export default function App() {
  const [persona, setPersona] = useState<'candidate' | 'company'>('candidate');
  const handleSetPersona = (newPersona: 'candidate' | 'company') => {
    setPersona(newPersona);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [currentView, setView] = useState<'landing' | 'vagas'>('landing');
  
  // States for the interactive interview modal inside Jobs
  const [isInterviewOpen, setIsInterviewOpen] = useState<boolean>(false);
  const [selectedJobForInterview, setSelectedJobForInterview] = useState<Job | null>(null);

  // State for B2B Company Lead Form modal
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const openLeadModal = () => setIsLeadModalOpen(true);

  const scrollToSection = (id: string) => {
    if (id === 'jobs-page') {
      setView('vagas');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentView !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
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
          onBackToHome={() => setView('landing')}
        />
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
            <>
              {/* 2. Vagas em Destaque Section */}
              <Jobs 
                currentPersona={persona}
                isInterviewOpen={isInterviewOpen}
                setIsInterviewOpen={setIsInterviewOpen}
                selectedJobForInterview={selectedJobForInterview}
                setSelectedJobForInterview={setSelectedJobForInterview}
                onViewAllJobs={() => scrollToSection('jobs-page')}
              />

              {/* 3. Sobre Nós Section */}
              <AboutUs currentPersona={persona} openLeadModal={openLeadModal} />

              {/* 5. Depoimentos Grid Section */}
              <Testimonials currentPersona={persona} scrollToSection={scrollToSection} openLeadModal={openLeadModal} />
            </>
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
