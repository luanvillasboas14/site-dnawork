import React from 'react';
import { Instagram, Facebook, Linkedin, Phone, MessageSquare, Shield, HelpCircle, ArrowUp } from 'lucide-react';
// @ts-ignore
import logoBranco from '../assets/images/Logo_Branco.png';

interface FooterProps {
  scrollToSection: (id: string) => void;
  currentPersona?: 'candidate' | 'company';
}

export const Footer: React.FC<FooterProps> = ({ scrollToSection, currentPersona }) => {
  return (
    <footer className="bg-[#1D1E4C] text-slate-300 border-t border-slate-800 pt-5 pb-4 px-4 sm:px-6 lg:px-8 text-left relative z-10">
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 pb-4 border-b border-slate-800">
          
          {/* Column 1: Brand & Socials */}
          <div className="lg:col-span-4 flex flex-col space-y-2">
            <div className="flex items-center cursor-pointer group" onClick={() => scrollToSection('hero')}>
              <img 
                src={logoBranco} 
                alt="DNA Work" 
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="https://www.instagram.com/dnawork.brasil/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-[#FF7A08] hover:text-white flex items-center justify-center text-slate-400 transition-colors border border-slate-700/50"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://www.facebook.com/dnaworkai" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors border border-slate-700/50"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://www.linkedin.com/company/dna-work/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-[#0A66C2] hover:text-white flex items-center justify-center text-slate-400 transition-colors border border-slate-700/50"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 flex flex-col space-y-2">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-l-2 border-[#FF7A08] pl-2.5">
              Navegação
            </h4>
            <div className="flex flex-col space-y-1 text-xs font-semibold">
              <button 
                onClick={() => scrollToSection('hero')} 
                className="hover:text-[#FF7A08] text-slate-400 transition-colors text-left"
              >
                Página Inicial / CADU IA
              </button>
              <button 
                onClick={() => scrollToSection('about-section')} 
                className="hover:text-[#FF7A08] text-slate-400 transition-colors text-left"
              >
                Sobre Nós & Propósito
              </button>
              <button 
                onClick={() => scrollToSection('jobs-page')} 
                className="hover:text-[#FF7A08] text-slate-400 transition-colors text-left"
              >
                Vagas
              </button>
              {currentPersona === 'company' && (
                <button 
                  onClick={() => scrollToSection('simulator-section')} 
                  className="hover:text-[#FF7A08] text-slate-400 transition-colors text-left"
                >
                  Simular Economia (B2B)
                </button>
              )}
            </div>
          </div>

          {/* Column 3: Contacts separated for candidate and company */}
          <div className="lg:col-span-5 flex flex-col space-y-2">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-l-2 border-[#FF7A08] pl-2.5">
              Canais de Contato
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Candidates contact */}
              <div className="bg-slate-800/40 border border-slate-800 p-2.5 rounded-xl space-y-1">
                <p className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  Sou Candidato
                </p>
                <div className="flex flex-col space-y-1 text-xs text-slate-400 font-semibold">
                  <a 
                    href="https://api.whatsapp.com/send/?phone=5511947637367&text=Ol%C3%A1!%20Quero%20iniciar%20minha%20entrevista%20com%20o%20CADU.&type=phone_number&app_absent=0" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 hover:text-[#FF7A08] transition-colors"
                  >
                    <MessageSquare size={13} className="text-green-400" />
                    Iniciar Entrevista (WhatsApp)
                  </a>
                  <span className="text-[10px] text-slate-500 block">Disponível 24h para entrevistas</span>
                </div>
              </div>

              {/* Company contact */}
              <div className="bg-slate-800/40 border border-slate-800 p-2.5 rounded-xl space-y-1">
                <p className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Sou Empresa (B2B)
                </p>
                <div className="flex flex-col space-y-1 text-xs text-slate-400 font-semibold">
                  <a 
                    href="https://api.whatsapp.com/send/?phone=5511987023902&text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20da%20DNA%20Work%20para%20empresas.&type=phone_number&app_absent=0" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 hover:text-[#FF7A08] transition-colors"
                  >
                    <MessageSquare size={13} className="text-green-400" />
                    Suporte Comercial
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom info */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 text-xs text-slate-500 font-semibold">
          <p>© 2026 DNA Work. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6 mt-1.5 sm:mt-0">
            <a href="#politica" className="hover:text-white transition-colors flex items-center gap-1">
              <Shield size={12} /> Política de Privacidade
            </a>
            <a href="#termos" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
