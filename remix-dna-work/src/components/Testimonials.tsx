import React, { useState, useEffect } from 'react';
import { Quote, Star, Sparkles, UserCheck, Heart, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { TESTIMONIALS } from '../data';
import { Testimonial } from '../types';
import { DecorativeShape } from './DecorativeShapes';
// @ts-ignore
import lacosBg from '../assets/images/Laços (1).png';

interface TestimonialsProps {
  currentPersona: 'candidate' | 'company';
  scrollToSection?: (id: string) => void;
  openLeadModal?: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ currentPersona, scrollToSection, openLeadModal }) => {
  const [activeTab, setActiveTab] = useState<'candidate' | 'company'>(currentPersona);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderQuote = (testimonial: Testimonial) => {
    const isExpanded = !!expandedIds[testimonial.id];
    const MAX_LENGTH = 160;
    const isLong = testimonial.quote.length > MAX_LENGTH;

    const displayQuote = isLong && !isExpanded
      ? `${testimonial.quote.slice(0, MAX_LENGTH).trim()}...`
      : testimonial.quote;

    return (
      <div className="mb-4 relative z-10 flex-1 flex flex-col justify-between">
        <blockquote className="text-slate-600 font-medium text-xs sm:text-sm md:text-base leading-relaxed italic whitespace-pre-line">
          "{displayQuote}"
        </blockquote>
        {isLong && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(testimonial.id);
            }}
            className="mt-2 text-[#FF7A08] hover:text-[#e66c00] font-bold text-xs sm:text-sm inline-flex items-center gap-1 cursor-pointer transition-colors self-start"
          >
            {isExpanded ? (
              <>
                <span>Ler menos</span>
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                <span>Ler mais</span>
                <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  // Sync active tab with parent persona toggle
  useEffect(() => {
    setActiveTab(currentPersona);
    setMobileIndex(0);
  }, [currentPersona]);

  const filteredTestimonials = TESTIMONIALS.filter(t => t.type === activeTab);

  const handlePrev = () => {
    setMobileIndex(prev => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setMobileIndex(prev => (prev === filteredTestimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat pt-6 pb-12 md:pt-8 md:pb-16 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url("${lacosBg}")`
      }}
    >
      {/* Light subtle overlay to enhance background visibility while maintaining readability */}
      <div className="absolute inset-0 bg-white/65 pointer-events-none z-0" />

      {/* Decorative Ornaments */}
      <DecorativeShape type="star" className="absolute top-8 right-[6%] w-10 h-10 text-[#FF7A08]/15" />
      <DecorativeShape type="diamond" className="absolute bottom-8 left-[12%] w-8 h-8 text-blue-500/10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <span className="text-[#FF7A08] text-xs font-bold uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
            Depoimentos e Prova Social
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1D1E4C] mt-2 tracking-tight">
            Quem usa a DNA Work, aprova!
          </h2>
          <div className="w-12 h-1 bg-[#FF7A08] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="inline-flex p-1 bg-slate-100 rounded-full border border-slate-200">
            <button
              onClick={() => {
                setActiveTab('candidate');
                setMobileIndex(0);
              }}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'candidate'
                  ? 'bg-[#FF7A08] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart size={14} />
              Jovens Contratados
            </button>
            <button
              onClick={() => {
                setActiveTab('company');
                setMobileIndex(0);
              }}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'company'
                  ? 'bg-[#1D1E4C] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck size={14} />
              Empresas Parceiras
            </button>
          </div>
        </div>

        {/* Mobile Carousel View (block md:hidden) */}
        <div className="block md:hidden relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
            >
              {filteredTestimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full shrink-0 px-1"
                >
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm relative text-left">
                    {/* Floating Quote Icon */}
                    <div className="absolute top-5 right-5 text-slate-200">
                      <Quote size={32} className="stroke-[1.5]" />
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-3 text-[#FF7A08]">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={15} fill="currentColor" className="stroke-none" />
                      ))}
                    </div>

                    {/* Quote text */}
                    {renderQuote(testimonial)}

                    {/* Profile Details */}
                    <div className="border-t border-slate-200/60 pt-3 mt-auto">
                      <div className="text-left">
                        <h4 className="font-black text-xs sm:text-sm text-[#1D1E4C]">{testimonial.name}</h4>
                        <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-0.5">
                          {testimonial.role}
                          {testimonial.company && (
                            <span className="text-[#FF7A08] font-bold block">
                              {testimonial.company}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center justify-between mt-4 px-2">
            <button
              onClick={handlePrev}
              aria-label="Depoimento anterior"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-[#1D1E4C] flex items-center justify-center shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {filteredTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMobileIndex(idx)}
                  aria-label={`Ir para depoimento ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === mobileIndex 
                      ? 'w-6 bg-[#FF7A08]' 
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Próximo depoimento"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-[#1D1E4C] flex items-center justify-center shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Desktop Grid View (hidden md:grid) */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 text-left">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-5 md:p-6 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 group relative"
            >
              {/* Floating Quote Icon */}
              <div className="absolute top-5 right-5 text-slate-200 group-hover:text-orange-200/50 transition-colors">
                <Quote size={32} className="stroke-[1.5]" />
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3 md:mb-4 text-[#FF7A08]">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={15} fill="currentColor" className="stroke-none" />
                ))}
              </div>

              {/* Quote text */}
              {renderQuote(testimonial)}

              {/* Profile Details */}
              <div className="border-t border-slate-200/60 pt-3 mt-auto">
                <div className="text-left">
                  <h4 className="font-black text-xs sm:text-sm text-[#1D1E4C]">{testimonial.name}</h4>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-0.5">
                    {testimonial.role}
                    {testimonial.company && (
                      <span className="text-[#FF7A08] font-bold block sm:inline sm:before:content-['•'] sm:before:mx-1">
                        {testimonial.company}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats / Call to Action beneath */}
        <div className="mt-8 md:mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF7A08] shrink-0">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h4 className="font-black text-[#1D1E4C] text-sm md:text-base">Gostou das histórias de sucesso?</h4>
              <p className="text-xs text-slate-500 mt-0.5">Sua empresa ou carreira também podem atingir estes resultados em poucos dias.</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (activeTab === 'candidate') {
                if (scrollToSection) {
                  scrollToSection('jobs-page');
                } else {
                  const element = document.getElementById('jobs-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                if (openLeadModal) {
                  openLeadModal();
                } else {
                  const element = document.getElementById('simulator-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#1D1E4C] hover:bg-indigo-950 text-white font-bold text-xs rounded-full shadow-md transition-all shrink-0 cursor-pointer text-center"
          >
            {activeTab === 'candidate' ? 'Conhecer Vagas Abertas' : 'Quero Recrutar com o CADU'}
          </button>
        </div>

      </div>
    </section>
  );
};

