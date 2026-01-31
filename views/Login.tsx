
import React, { useState } from 'react';
import { View, User } from '../types';
import { DBService } from '../services/db';
import { AtSign, KeyRound, AlertCircle, ChevronLeft, LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (u: User) => void;
  onNavigate: (v: View) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const user = await DBService.login(email, pass);
      if (user) onLogin(user);
      else setError('Credenciais inválidas ou conta desativada.');
    } catch (err) {
      setError('Ocorreu um erro na autenticação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[360px] relative">
        <button 
          onClick={() => onNavigate('HOME')}
          className="group flex items-center space-x-2 text-slate-400 hover:text-red-600 transition-colors mb-8 uppercase text-[10px] font-black tracking-widest"
        >
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Voltar ao Menu</span>
        </button>

        <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-2xl shadow-slate-200">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">
              MÉQUI <span className="font-pro text-[#DA291C]">PRO</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Acesso ao Sistema</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-2xl text-[10px] font-bold border border-red-100">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Seu E-mail</label>
              <div className="relative group">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-50 text-xs text-slate-900 transition-all placeholder:text-slate-300"
                  placeholder="ex@mequipro.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Sua Senha</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={16} />
                <input
                  type="password"
                  required
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-50 text-xs text-slate-900 transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4.5 bg-[#DA291C] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-[#B92218] transition-all active:scale-95 mt-4 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn size={16} />}
              <span>Autenticar Acesso</span>
            </button>

            <div className="text-center pt-6">
              <button 
                type="button" 
                onClick={() => onNavigate('REGISTER')} 
                className="text-[10px] font-black text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest"
              >
                Novo Recruta? <span className="text-red-600">Criar Conta</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
