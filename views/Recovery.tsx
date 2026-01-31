
import React, { useState } from 'react';
import { View } from '../types';
import { DBService } from '../services/db';
import { HelpCircle, Mail, Key } from 'lucide-react';

interface RecoveryProps {
  onNavigate: (v: View) => void;
}

export const Recovery: React.FC<RecoveryProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [recovery, setRecovery] = useState({ mother: '', color: '' });
  const [newPass, setNewPass] = useState('');
  const [user, setUser] = useState<any>(null);

  // Fix: handleVerifyEmail must be async to await DBService.getUsers()
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const users = await DBService.getUsers();
    const found = users.find(u => u.email === email);
    if (found) {
      setUser(found);
      setStep(2);
    } else {
      alert('Usuário não encontrado.');
    }
  };

  const handleVerifyRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.recovery.motherName === recovery.mother.toUpperCase() && 
        user.recovery.favoriteColor === recovery.color.toUpperCase()) {
      setStep(3);
    } else {
      alert('Respostas incorretas.');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, passwordHash: newPass };
    DBService.saveUser(updated);
    alert('Senha atualizada com sucesso!');
    onNavigate('LOGIN');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <HelpCircle className="mx-auto mb-4 text-indigo-600" size={48} />
          <h2 className="text-2xl font-bold">Recuperar Acesso</h2>
        </div>

        {step === 1 && (
          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600">Seu E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="exemplo@email.com" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">Continuar</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyRecovery} className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-xl text-sm text-indigo-700 mb-4">Responda às perguntas cadastradas:</div>
            <div className="space-y-4">
              <input required placeholder="Nome da sua mãe" value={recovery.mother} onChange={e => setRecovery({...recovery, mother: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
              <input required placeholder="Sua cor preferida" value={recovery.color} onChange={e => setRecovery({...recovery, color: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">Verificar Respostas</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600">Nova Senha</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold">Redefinir Senha</button>
          </form>
        )}

        <button onClick={() => onNavigate('LOGIN')} className="w-full mt-4 text-sm font-bold text-slate-400 hover:text-indigo-600">Voltar para Login</button>
      </div>
    </div>
  );
};
