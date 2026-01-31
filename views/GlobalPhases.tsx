
import React, { useState, useEffect } from 'react';
import { DBService } from '../services/db';
import { Role } from '../types';
import { ROLES_CONFIG, PHASES } from '../constants';
import { Unlock, Lock, Shield, Sword, Crown } from 'lucide-react';

export const GlobalPhases: React.FC = () => {
  const [globalPhases, setGlobalPhases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Role>(Role.ATENDENTE);

  useEffect(() => {
    loadGlobalPhases();
  }, []);

  const loadGlobalPhases = async () => {
    setIsLoading(true);
    const phases = await DBService.getGlobalPhases();
    setGlobalPhases(phases);
    setIsLoading(false);
  };

  const handleToggle = async (phaseKey: string) => {
    try {
      setIsUpdating(phaseKey);
      const updated = await DBService.toggleGlobalPhase(phaseKey);
      setGlobalPhases(updated);
    } catch (error) {
      console.error("Erro ao alternar fase:", error);
      alert("Erro ao salvar alteração no banco de dados.");
    } finally {
      setIsUpdating(null);
    }
  };

  const tabs = [
    { role: Role.ATENDENTE, icon: Shield, color: 'text-blue-600' },
    { role: Role.TREINADOR, icon: Sword, color: 'text-purple-600' },
    { role: Role.COORDENADOR, icon: Crown, color: 'text-amber-600' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center space-x-3">
        <Unlock className="text-indigo-600" size={32} />
        <h1 className="text-3xl font-bold text-slate-800">Liberação Global de Fases</h1>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-indigo-700 text-sm font-medium">
        💡 Use esta aba para ativar ou desativar os módulos para todos os usuários do sistema simultaneamente.
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.role}
            onClick={() => setActiveTab(tab.role)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === tab.role 
              ? 'bg-white text-slate-900 shadow-md' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon size={18} className={activeTab === tab.role ? tab.color : 'text-slate-400'} />
            <span>{ROLES_CONFIG[tab.role].label}</span>
          </button>
        ))}
      </div>

      {/* Grid de Botoes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">
             <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Acessando Central de Comandos...</p>
          </div>
        ) : PHASES.map(p => {
          const key = `${activeTab}-${p}`;
          const isActive = globalPhases.includes(key);
          const loadingThis = isUpdating === key;
          
          return (
            <div 
              key={p} 
              className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center text-center ${
                isActive 
                ? 'bg-white border-green-200 shadow-lg shadow-green-50' 
                : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                isActive ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'
              }`}>
                {loadingThis ? (
                  <div className="animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full"></div>
                ) : (
                  isActive ? <Unlock size={32} /> : <Lock size={32} />
                )}
              </div>
              
              <h3 className="font-bold text-slate-800 text-xl mb-1">Fase 0{p}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                Módulo {isActive ? 'Ativo' : 'Inativo'}
              </p>

              <button
                disabled={!!isUpdating}
                onClick={() => handleToggle(key)}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all transform active:scale-95 ${
                  isActive 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100'
                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loadingThis ? 'PROCESSANDO...' : (isActive ? 'DESATIVAR AGORA' : 'ATIVAR AGORA')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
