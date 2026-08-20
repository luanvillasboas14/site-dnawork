import React, { useState } from 'react';
import { X, Building2, Send, CheckCircle2, User, Phone, Mail, FileText, Sparkles } from 'lucide-react';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacao: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const handleResetAndClose = () => {
    setFormData({ nome: '', telefone: '', email: '', observacao: '' });
    setIsSuccess(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1D1E4C] to-indigo-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF7A08] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-sm">
              <Sparkles size={13} />
              DNA Work
            </span>
            <span className="text-slate-300 text-xs font-semibold">Para Empresas</span>
          </div>

          <h3 id="modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Quero Recrutar com o THEO
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-medium">
            Preencha seus dados para receber uma demonstração e falar com nossos especialistas em recrutamento.
          </p>
        </div>

        {/* Modal Content / Form */}
        <div className="p-6 sm:p-7 bg-white">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-[#1D1E4C]">Solicitação Enviada!</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
                  Obrigado, <strong className="text-slate-900">{formData.nome || 'visitante'}</strong>! Recebemos suas informações e entraremos em contato muito em breve.
                </p>
              </div>
              <div className="pt-3">
                <button
                  onClick={handleResetAndClose}
                  className="px-8 py-3 bg-[#1D1E4C] hover:bg-indigo-950 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-left">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Ana Silva"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#FF7A08] focus:bg-white outline-none rounded-xl text-xs font-semibold text-slate-800 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-left">
                  Telefone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#FF7A08] focus:bg-white outline-none rounded-xl text-xs font-semibold text-slate-800 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-left">
                  E-mail Corporativo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seuemail@empresa.com.br"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#FF7A08] focus:bg-white outline-none rounded-xl text-xs font-semibold text-slate-800 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Observação */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-left">
                  Observação
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <textarea
                    rows={3}
                    value={formData.observacao}
                    onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                    placeholder="Conte-nos brevemente sobre sua necessidade de recrutamento ou volume de vagas..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#FF7A08] focus:bg-white outline-none rounded-xl text-xs font-semibold text-slate-800 transition-all shadow-xs resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#FF7A08] hover:bg-[#e66c00] active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <span>Enviar Solicitação</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
