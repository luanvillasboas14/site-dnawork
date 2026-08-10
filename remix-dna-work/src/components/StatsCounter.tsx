import React from 'react';
import { Building2, Users, CheckCircle2 } from 'lucide-react';

interface StatsCounterProps {
  currentPersona?: 'candidate' | 'company';
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ currentPersona = 'candidate' }) => {
  const isCompany = currentPersona === 'company';

  const stats = [
    {
      id: 'empresas',
      value: '+300',
      label: 'Empresas',
      sublabel: 'Parceiras conectadas e contratando',
      icon: Building2,
      color: isCompany ? 'text-[#1D1E4C]' : 'text-[#FF7A08]',
      bgColor: isCompany ? 'bg-[#1D1E4C]/10' : 'bg-orange-500/15',
      borderColor: 'border-orange-500/20',
    },
    {
      id: 'candidatos',
      value: '+100.000',
      label: 'Candidatos',
      sublabel: 'Jovens qualificados na plataforma',
      icon: Users,
      color: isCompany ? 'text-[#1D1E4C]' : 'text-indigo-400',
      bgColor: isCompany ? 'bg-[#1D1E4C]/10' : 'bg-indigo-500/15',
      borderColor: 'border-indigo-500/20',
    },
    {
      id: 'vagas',
      value: '+2.000',
      label: 'Vagas Preenchidas',
      sublabel: 'Contratações ágeis via WhatsApp',
      icon: CheckCircle2,
      color: isCompany ? 'text-[#1D1E4C]' : 'text-emerald-400',
      bgColor: isCompany ? 'bg-[#1D1E4C]/10' : 'bg-emerald-500/15',
      borderColor: 'border-emerald-500/20',
    },
  ];

  return (
    <section className={`hidden sm:block relative z-20 py-2.5 sm:py-4 border-y shadow-md transition-colors duration-300 ${
      isCompany 
        ? 'bg-[#FFEBDA] border-orange-200/80' 
        : 'bg-[#1D1E4C] border-slate-800'
    }`}>
      {/* Glow effect */}
      <div className={`absolute inset-0 pointer-events-none ${
        isCompany
          ? 'bg-gradient-to-r from-orange-500/5 via-white/20 to-orange-500/5'
          : 'bg-gradient-to-r from-orange-500/5 via-indigo-500/5 to-emerald-500/5'
      }`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 items-center">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 group ${
                  isCompany
                    ? 'bg-white/80 border border-orange-200/70 hover:bg-white shadow-sm'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${stat.bgColor} ${stat.color} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                  <Icon size={22} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${
                      isCompany ? 'text-[#1D1E4C]' : 'text-white'
                    }`}>
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-extrabold text-[#FF7A08] uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </span>
                  <span className={`text-[11px] font-medium leading-tight mt-0.5 ${
                    isCompany ? 'text-slate-600 font-medium' : 'text-slate-300'
                  }`}>
                    {stat.sublabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

