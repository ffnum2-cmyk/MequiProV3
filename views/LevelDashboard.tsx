
import React, { useState, useEffect } from 'react';
import { User, Role, Question } from '../types';
import { ROLES_CONFIG, PHASES } from '../constants';
import { DBService } from '../services/db';
import { Lock, Play, CheckCircle2, AlertTriangle, PowerOff, ShieldCheck } from 'lucide-react';

interface LevelDashboardProps {
  user: User;
  level: Role;
  onStartQuiz: (lvl: Role, ph: number) => void;
}

export const LevelDashboard: React.FC<LevelDashboardProps> = ({ user, level, onStartQuiz }) => {
  // Fix: Handling async data fetching with state and effect
  const [questions, setQuestions] = useState<Question[]>([]);
  const [globalUnlocked, setGlobalUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [q, g] = await Promise.all([
        DBService.getQuestions(),
        DBService.getGlobalPhases()
      ]);
      setQuestions(q);
      setGlobalUnlocked(g);
    };
    fetchData();
  }, []);

  const config = ROLES_CONFIG[level];

  const getPhaseStatus = (ph: number) => {
    const key = `${level}-${ph}`;
    const isGlobalActive = globalUnlocked.includes(key);
    const isCompleted = user.stats.completedPhases.includes(key);
    const hasQuestions = questions.filter(q => q.level === level && q.phase === ph).length >= 15;
    const canStart = isGlobalActive && hasQuestions;

    return { isGlobalActive, isCompleted, hasQuestions, canStart };
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Banner Principal */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
        
        <div className="flex items-center space-x-6 relative z-10">
          <div className={`w-16 h-16 ${config.color} rounded-[24px] flex items-center justify-center text-3xl shadow-lg shadow-red-100`}>
            {config.icon}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{config.label}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <ShieldCheck size={14} className="text-green-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível Operacional Ativo</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 relative z-10">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status da Trilha</p>
            <div className="flex gap-2">
              {PHASES.map(p => {
                 const { isCompleted } = getPhaseStatus(p);
                 return <div key={p} className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-slate-100'}`} />
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cards Menores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PHASES.map(p => {
          const { isGlobalActive, isCompleted, hasQuestions, canStart } = getPhaseStatus(p);

          return (
            <div 
              key={p} 
              className={`relative p-8 rounded-[32px] border transition-all ${
                canStart
                ? 'bg-white border-slate-100 hover:border-red-200 hover:shadow-xl hover:shadow-red-50 group' 
                : 'bg-slate-50 border-transparent opacity-60 pointer-events-none'
              }`}
            >
              <div className="flex justify-between items-start mb-10">
                <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">Módulo 0{p}</span>
                {isCompleted && <div className="p-1.5 bg-green-50 rounded-lg"><CheckCircle2 className="text-green-500" size={18} /></div>}
                {!isGlobalActive && <PowerOff className="text-slate-300" size={18} />}
              </div>

              <div className="mb-10">
                <h3 className="font-black text-slate-900 text-lg mb-2 uppercase tracking-tight">Treinamento Operacional</h3>
                <div className="flex items-center space-x-2">
                   <div className={`w-2 h-2 rounded-full ${hasQuestions ? 'bg-amber-400' : 'bg-slate-200'}`}></div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocolo Padrão Ouro</p>
                </div>
              </div>

              {!isGlobalActive ? (
                <div className="w-full flex items-center justify-center space-x-2 text-slate-400 font-black text-[10px] bg-slate-100 py-4 rounded-2xl uppercase tracking-widest">
                  <Lock size={12} />
                  <span>Aguardando</span>
                </div>
              ) : !hasQuestions ? (
                <div className="text-[10px] text-amber-600 font-black bg-amber-50 py-4 rounded-2xl text-center border border-amber-100 flex items-center justify-center space-x-2 uppercase tracking-widest">
                  <AlertTriangle size={12} />
                  <span>Construindo</span>
                </div>
              ) : (
                <button
                  onClick={() => onStartQuiz(level, p)}
                  className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center space-x-3 shadow-lg hover:bg-[#DA291C] transition-all active:scale-95 group-hover:shadow-red-100"
                >
                  <Play size={14} fill="currentColor" />
                  <span>{isCompleted ? 'Reciclar' : 'Executar'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
