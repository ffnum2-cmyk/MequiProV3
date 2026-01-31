
import React, { useState } from 'react';
import { View, Role, User } from '../types';
import { DBService } from '../services/db';
import { UserPlus, User as UserIcon, Mail, Lock, Heart, Users, ChevronLeft, Shield } from 'lucide-react';

interface RegisterProps {
  onNavigate: (v: View) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    pass: '',
    mother: '',
    color: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const recovery = {
        motherName: form.mother.toUpperCase(),
        favoriteColor: form.color.toUpperCase()
      };
      await DBService.register(form.name, form.email, form.pass, recovery);
      alert('Pronto para o combate! Conta criada com sucesso como Base de Treinamento.');
      onNavigate('LOGIN');
    } catch (err: any) {
      alert(`Erro no cadastro: ${err.message || 'Verifique seus dados.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_50%_-20%,#dc2626,transparent_50%)]"></div>

      <div className="w-full max-w-[440px] relative z-10">
        <button 
          onClick={() => onNavigate('HOME')}
          className="group flex items-center space-x-2 text-slate-400 hover:text-red-600 transition-colors mb-8 uppercase text-[9px] font-black tracking-[0.3em]"
        >
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Voltar ao início</span>
        </button>

        <div className="bg-white rounded-[40px] border border-slate-100 p-10 md:p-12 shadow-2xl shadow-slate-200">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
              MÉQUI <span className="font-pro text-[#DA291C]">PRO</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">Alistamento Operacional</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative group">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={14} />
                <input 
                  required 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-red-600/50 text-xs text-slate-900 transition-all" 
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={14} />
                <input 
                  required 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-red-600/50 text-xs text-slate-900 transition-all" 
                  placeholder="ex@mequipro.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={14} />
                <input 
                  required 
                  type="password" 
                  value={form.pass} 
                  onChange={e => setForm({...form, pass: e.target.value})} 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-red-600/50 text-xs text-slate-900 transition-all" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
              <div className="flex items-center space-x-2 text-slate-400">
                <Shield size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">Segurança de Recuperação</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  required 
                  value={form.mother} 
                  onChange={e => setForm({...form, mother: e.target.value})} 
                  placeholder="Nome da Mãe" 
                  className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg outline-none focus:border-red-600/50 text-slate-900 text-[10px]" 
                />
                <input 
                  required 
                  value={form.color} 
                  onChange={e => setForm({...form, color: e.target.value})} 
                  placeholder="Cor Favorita" 
                  className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg outline-none focus:border-red-600/50 text-slate-900 text-[10px]" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4.5 bg-[#DA291C] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#B92218] transition-all shadow-xl shadow-red-100 mt-6 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>Criar Conta Oficial</span>
            </button>
            
            <div className="text-center pt-4">
              <button 
                type="button" 
                onClick={() => onNavigate('LOGIN')} 
                className="text-[9px] font-black text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest"
              >
                Já possui acesso? <span className="text-red-600">Entrar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
