import React, { useState } from 'react';
import { Menu, X, Sparkles, Briefcase, User, ChevronRight, ChevronDown } from 'lucide-react';
// @ts-ignore
import logoFinal from '../assets/images/Logo Final (1).png';

interface HeaderProps {
  currentPersona: 'candidate' | 'company';
  setPersona: (persona: 'candidate' | 'company') => void;
  scrollToSection: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPersona, setPersona, scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: 'Início', id: 'hero' },
    { label: 'CADU IA', id: 'dina-section' },
    { label: 'Sobre Nós', id: 'about-section' },
    { label: 'Vagas', id: 'jobs-page' },
    ...(currentPersona === 'company' ? [{ label: 'Simular Economia', id: 'simulator-section' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo */}
          <div 
            onClick={() => scrollToSection('hero')} 
            className="flex items-center cursor-pointer group"
            id="logo-container"
          >
            <img 
              src={logoFinal} 
              alt="DNA Work" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#1D1E4C] rounded-lg hover:bg-slate-50 transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Area & Persona Toggle (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Persona Switcher Switch */}
            <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                onClick={() => setPersona('candidate')}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  currentPersona === 'candidate'
                    ? 'bg-[#FF7A08] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={{ whiteSpace: 'nowrap' }}
              >
                <User size={12} />
                Sou Candidato
              </button>
              <button
                onClick={() => setPersona('company')}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  currentPersona === 'company'
                    ? 'bg-[#1D1E4C] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={{ whiteSpace: 'nowrap' }}
              >
                <Briefcase size={12} />
                Sou Empresa
              </button>
            </div>

            {/* CTAs */}
            <div 
              className="relative" 
              id="login-dropdown-container"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#1D1E4C] hover:bg-[#FF7A08] transition-all duration-300 rounded-full shadow-md shadow-blue-950/10 hover:shadow-orange-500/15"
              >
                <span>Login</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn"
                >
                  <button
                    onClick={() => {
                      setPersona('company');
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1D1E4C] transition-colors"
                  >
                    <Briefcase size={14} className="text-[#1D1E4C]" />
                    Área da Empresa
                  </button>
                  <button
                    onClick={() => {
                      setPersona('candidate');
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#FF7A08] transition-colors border-t border-slate-50"
                  >
                    <User size={14} className="text-[#FF7A08]" />
                    Área do Candidato
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Switch for Mobile */}
            <button
              onClick={() => setPersona(currentPersona === 'candidate' ? 'company' : 'candidate')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                currentPersona === 'candidate'
                  ? 'bg-orange-50 border-orange-200 text-[#FF7A08]'
                  : 'bg-indigo-50 border-indigo-100 text-[#1D1E4C]'
              }`}
            >
              <Sparkles size={12} />
              {currentPersona === 'candidate' ? 'Ver Empresas' : 'Ver Candidatos'}
            </button>

            <button
              onClick={toggleMenu}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-600 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center border border-slate-100"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 animate-fadeIn shadow-inner">
          <div className="px-4 pt-2 pb-6 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2">
              Navegação
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1D1E4C] transition-colors"
              >
                {item.label}
              </button>
            ))}

            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pb-2">
                Foco do Site
              </div>
              <div className="flex p-1 bg-slate-100 rounded-full border border-slate-200 mb-4">
                <button
                  onClick={() => {
                    setPersona('candidate');
                    setIsOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-xs font-bold transition-all ${
                    currentPersona === 'candidate' ? 'bg-[#FF7A08] text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <User size={12} />
                  Sou Candidato
                </button>
                <button
                  onClick={() => {
                    setPersona('company');
                    setIsOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-xs font-bold transition-all ${
                    currentPersona === 'company' ? 'bg-[#1D1E4C] text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <Briefcase size={12} />
                  Sou Empresa
                </button>
              </div>

              <div className="space-y-2 px-1">
                <button
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className="flex items-center justify-between w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#1D1E4C] hover:bg-[#FF7A08] transition-all"
                >
                  <span>Login</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMobileDropdownOpen && (
                  <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-100 space-y-1 animate-fadeIn">
                    <button
                      onClick={() => {
                        setPersona('company');
                        setIsOpen(false);
                        setIsMobileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full py-2.5 px-3 text-left text-xs font-bold text-slate-700 hover:bg-white rounded-lg transition-all"
                    >
                      <Briefcase size={12} className="text-[#1D1E4C]" />
                      Área da Empresa
                    </button>
                    <button
                      onClick={() => {
                        setPersona('candidate');
                        setIsOpen(false);
                        setIsMobileDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full py-2.5 px-3 text-left text-xs font-bold text-slate-700 hover:bg-white rounded-lg transition-all border-t border-slate-100"
                    >
                      <User size={12} className="text-[#FF7A08]" />
                      Área do Candidato
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
