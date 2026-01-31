
import React, { useState, useEffect } from 'react';
import { User, Role, Question } from '../types';
import { ROLES_CONFIG, PHASES } from '../constants';
import { DBService } from '../services/db';
import { Lock, Play, Trophy, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  user: User;
  onStartQuiz: (lvl: Role, ph: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartQuiz }) => {
  // Fix: Handling async data fetching with state and effect
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    DBService.getQuestions().then(setQuestions);
  }, []);

  const getPhaseStatus = (lvl: Role, ph: number) => {
    const key = `${lvl}-${ph}`;
    const isUnlocked = user.role === Role.MASTER || user.unlockedPhases.includes(key);
    const isCompleted = user.stats.completedPhases.includes(key);
    const hasQuestions = questions.filter(q => q.level === lvl && q.phase === ph).length >= 15;
    
    // Visibility rules
    let isVisible = false;
    if (user.role === Role.MASTER) isVisible = true;
    // Fix: Using correct Role enum values
    if (user.role === Role.ATENDENTE && lvl === Role.ATENDENTE) isVisible = true;
    if (user.role === Role.TREINADOR && (lvl === Role.ATENDENTE || lvl === Role.TREINADOR)) isVisible = true;
    if (user.role === Role.COORDENADOR && lvl === Role.COORDENADOR) isVisible = true;

    return { isUnlocked, isCompleted, hasQuestions, isVisible };
  };

  const LevelSection = ({ lvl }: { lvl: Role }) => {
    const config = ROLES_CONFIG[lvl];
    const visiblePhases = PHASES.map(p => ({ p, status: getPhaseStatus(lvl, p) })).filter(x => x.status.isVisible);

    if (visiblePhases.length === 0) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl text-white ${config.color} shadow-lg shadow-${config.color.split('-')[1]}-200`}>
            {config.icon}
          </div>
          <h2 className="text-xl font-bold text-slate-800">{config.label}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map(p => {
            const { isUnlocked, isCompleted, hasQuestions, isVisible } = getPhaseStatus(lvl, p);
            if (!isVisible) return null;

            return (
              <div 
                key={p} 
                className={`relative p-6 rounded-3xl border-2 transition-all ${
                  isUnlocked && hasQuestions 
                  ? 'bg-white border-slate-100 hover:border-indigo-300 hover:shadow-xl group' 
                  : 'bg-slate-100 border-transparent opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-sm font-black text-slate-300">FASE 0{p}</span>
                  {isCompleted && <CheckCircle2 className="text-green-500" size={24} />}
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-slate-800 text-lg">Módulo de Treinamento {p}</h3>
                  <p className="text-xs text-slate-500 mt-1">15 Questões • Tempo livre</p>
                </div>

                {!isUnlocked ? (
                  <div className="flex items-center space-x-2 text-slate-400 font-bold text-sm">
                    <Lock size={16} />
                    <span>BLOQUEADO</span>
                  </div>
                ) : !hasQuestions ? (
                  <div className="text-xs text-amber-600 font-bold">EM CONSTRUÇÃO</div>
                ) : (
                  <button
                    onClick={() => onStartQuiz(lvl, p)}
                    className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100 group-hover:scale-105 transition-all"
                  >
                    <Play size={16} fill="currentColor" />
                    <span>{isCompleted ? 'REFAZER' : 'INICIAR'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black mb-2">Bem-vindo, {user.name}! 👋</h1>
            <p className="text-indigo-100 max-w-md">Pronto para elevar seu conhecimento? Complete as fases e suba no ranking geral.</p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[100px]">
              <span className="block text-xs font-bold text-indigo-200">MEUS PONTOS</span>
              <span className="text-2xl font-black">{user.stats.score}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[100px]">
              <span className="block text-xs font-bold text-indigo-200">ACERTOS</span>
              <span className="text-2xl font-black">{user.stats.correctAnswers}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
      </div>

      <div className="space-y-10">
        {/* Fix: Using correct Role enum values */}
        <LevelSection lvl={Role.ATENDENTE} />
        <LevelSection lvl={Role.TREINADOR} />
        <LevelSection lvl={Role.COORDENADOR} />
      </div>
    </div>
  );
};
