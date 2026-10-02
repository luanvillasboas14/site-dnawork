import { ArrowLeft } from 'lucide-react';
import { isResumeFormLocation, mainSiteHref, resumeFormHref } from '../lib/resumeSite';
import { ResumeWizard } from './resume/ResumeWizard';
// @ts-ignore
import logoFinal from '../assets/images/Logo Final (1).png';
// @ts-ignore
import lacosBg from '../assets/images/Laços (1).png';
// @ts-ignore
import theoRobot from '../assets/images/Lobo_Showing.png';
// @ts-ignore
import resumePhoto from '../assets/images/curriculo-dna.png';

const reasons = [
  {
    title: 'É a sua primeira impressão',
    text: 'Antes da entrevista, o currículo é o que a empresa lê. Um texto claro faz a pessoa querer te conhecer. Um texto confuso faz a vaga passar para outro candidato.',
  },
  {
    title: 'A empresa decide rápido',
    text: 'Recrutadores olham muitos currículos no mesmo dia. O documento precisa mostrar, em poucos segundos, o que você estuda, o que já fez e o tipo de vaga que procura.',
  },
  {
    title: 'Você organiza a própria história',
    text: 'Colocar no papel cursos, trabalhos, projetos e habilidades evita esquecer algo na hora da seleção. O que parece pequeno para você pode ser exatamente o que a vaga pede.',
  },
  {
    title: 'Pouca experiência também conta',
    text: 'Estágio e primeiro emprego não exigem uma carreira longa. Escola, curso, trabalho informal, ajuda na empresa da família e projetos da faculdade já mostram responsabilidade e interesse.',
  },
];

export function ResumeIntro({ onBackToHome }: { onBackToHome?: () => void }) { return (
  <section
    className="relative isolate overflow-hidden min-h-screen px-4 sm:px-6 lg:px-8 py-12 md:py-20"
  >
    <div
      className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url("${lacosBg}")` }}
    />
    <div className="absolute inset-0 -z-10 bg-white/65 pointer-events-none" />

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="mb-8 flex items-center justify-between text-xs font-semibold">
        {onBackToHome ? (
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-[#1D1E4C] hover:text-[#FF7A08] transition-all rounded-full"
          >
            <ArrowLeft size={14} />
            Voltar para Início
          </button>
        ) : (
          <a
            href={mainSiteHref()}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-[#1D1E4C] hover:text-[#FF7A08] transition-all rounded-full"
          >
            <ArrowLeft size={14} />
            Voltar para Início
          </a>
        )}
        <div className="text-slate-400 flex items-center gap-1">
          <span>Início</span>
          <span>/</span>
          <span className="text-slate-600 font-extrabold">Currículo</span>
        </div>
      </div>

      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-[#1D1E4C] mt-3 tracking-tight">
          Gerador de <span className="text-[#FF7A08]">Currículo</span>
        </h2>
        <p className="text-sm md:text-base text-slate-500 mt-3">
          Currículo é o documento que apresenta você para uma empresa: quem você é, o que estudou, o que já fez e o que sabe fazer. Ele não substitui a entrevista. Ele consegue a entrevista.
        </p>
        <div className="w-16 h-1.5 bg-[#FF7A08] mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-12">
        <div className="lg:col-span-7">
          <h3 className="text-2xl font-black text-[#1D1E4C] mb-4">Por que ter um currículo</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason) => (
              <article key={reason.title} className="rounded-2xl bg-white border border-slate-200/60 shadow-sm p-5">
                <h4 className="font-bold text-[#1D1E4C]">{reason.title}</h4>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{reason.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative z-20">
          <div className="absolute -top-3 -left-3 w-2/3 h-2/3 bg-orange-100 rounded-2xl -z-10 transform -rotate-3"></div>
          <div className="absolute -bottom-3 -right-3 w-2/3 h-2/3 bg-indigo-50 rounded-2xl -z-10 transform rotate-6"></div>
          <div className="relative z-20 rounded-2xl overflow-hidden shadow-xl bg-orange-50">
            <img
              src={theoRobot}
              alt="THEO, assistente da DNA Work"
              className="w-full h-auto object-contain aspect-[4/3] bg-orange-50"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 relative z-20">
          <div className="absolute -top-3 -left-3 w-2/3 h-2/3 bg-orange-100 rounded-2xl -z-10 transform -rotate-3"></div>
          <div className="relative z-20 rounded-2xl overflow-hidden shadow-xl bg-white">
            <img
              src={resumePhoto}
              alt="Jovem preparando o currículo"
              className="w-full h-auto object-cover aspect-[4/3]"
            />
          </div>
        </div>

        <div className="lg:col-span-7 relative z-20 rounded-3xl bg-white border border-slate-200/60 shadow-sm p-6 sm:p-8">
          <h3 className="text-2xl font-black text-[#1D1E4C]">O que entra num bom currículo</h3>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-slate-600 leading-relaxed">
            <li><strong className="text-[#1D1E4C]">Objetivo.</strong> O tipo de vaga ou área que você busca, em uma ou duas frases.</li>
            <li><strong className="text-[#1D1E4C]">Formação.</strong> Curso, escola ou faculdade e o período. Cursos livres também entram.</li>
            <li><strong className="text-[#1D1E4C]">Experiência.</strong> Empregos, estágios e atividades em que você teve responsabilidade.</li>
            <li><strong className="text-[#1D1E4C]">Habilidades.</strong> O que você sabe usar de verdade: informática, atendimento, idiomas, ferramentas.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            O melhor currículo é curto, verdadeiro e fácil de ler. Frases diretas valem mais do que um texto longo.
          </p>
          <a
            href={resumeFormHref()}
            className="inline-flex mt-6 px-6 py-3 rounded-full bg-[#FF7A08] text-white text-sm font-bold hover:bg-[#1D1E4C] transition-colors"
          >
            Criar meu currículo
          </a>
        </div>
      </div>
    </div>
  </section>
  );
}

export function ResumeGenerator() {
  if (isResumeFormLocation()) return <ResumeWizard />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <a href={mainSiteHref()} className="flex items-center">
            <img src={logoFinal} alt="DNA Work" className="h-10 w-auto object-contain" />
          </a>
        </div>
      </header>
      <ResumeIntro />
    </div>
  );
}
