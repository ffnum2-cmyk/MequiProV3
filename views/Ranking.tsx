
import React, { useMemo, useState, useEffect } from 'react';
import { DBService } from '../services/db';
import { Role, User } from '../types';
import { Trophy, Clock, Target, Medal, Star, Crown } from 'lucide-react';

export const Ranking: React.FC = () => {
  // Fix: Initialize users as state to handle async fetch
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    DBService.getUsers().then(setUsers);
  }, []);
  
  const topAtendentes = useMemo(() => {
    return [...users]
      .filter(u => u.role === Role.ATENDENTE)
      .sort((a, b) => {
        // Fix: accessing score from stats property
        if (b.stats.score !== a.stats.score) return b.stats.score - a.stats.score;
        return a.stats.totalTime - b.stats.totalTime;
      });
  }, [users]);

  const podium = topAtendentes.slice(0, 3);
  const others = topAtendentes.slice(3, 10);

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-full">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-[11px] font-black text-amber-700 uppercase tracking-widest">Base de Treinamento em Destaque</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Hall da Fama</h1>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em]">Os Maiores Talentos do Padrão Ouro</p>
      </div>

      {/* Podium Clean */}
      {podium.length > 0 && (
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-16 pb-12">
          {/* Silver - 2nd */}
          {podium[1] && (
            <div className="order-2 md:order-1 flex flex-col items-center group">
              <div className="mb-6 relative">
                <div className="w-20 h-20 rounded-[28px] bg-slate-100 border-4 border-slate-200 flex items-center justify-center text-2xl font-black text-slate-400 shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                   {podium[1].name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-300 p-2 rounded-xl shadow-lg">
                  <Medal size={16} className="text-white" />
                </div>
              </div>
              <div className="bg-white w-36 h-40 rounded-t-[32px] shadow-xl shadow-slate-100 flex flex-col items-center justify-center p-6 border-x border-t border-slate-100">
                <span className="text-4xl font-black text-slate-200 mb-2 italic">2º</span>
                <span className="text-[11px] font-black text-slate-800 truncate w-full text-center uppercase tracking-wider">{podium[1].name}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-1">{podium[1].stats.score} PTS</span>
              </div>
            </div>
          )}

          {/* Gold - 1st */}
          {podium[0] && (
            <div className="order-1 md:order-2 flex flex-col items-center group z-10 -translate-y-6">
              <div className="mb-6 relative">
                <div className="w-24 h-24 rounded-[32px] bg-[#DA291C] border-4 border-amber-400 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-red-100 animate-float overflow-hidden">
                  {podium[0].name.charAt(0)}
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-amber-500 drop-shadow-md">
                   <Crown size={32} fill="currentColor" className="animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-400 p-2.5 rounded-xl shadow-lg">
                  <Trophy size={20} className="text-white" />
                </div>
              </div>
              <div className="bg-white w-48 h-56 rounded-t-[48px] shadow-2xl shadow-red-50 flex flex-col items-center justify-center p-8 border-x border-t border-red-50">
                <span className="text-6xl font-black text-amber-400 mb-2 italic">1º</span>
                <span className="text-xs font-black text-slate-900 truncate w-full text-center uppercase tracking-widest">{podium[0].name}</span>
                <span className="text-[11px] font-bold text-red-500 mt-2">{podium[0].stats.score} PTS</span>
              </div>
            </div>
          )}

          {/* Bronze - 3rd */}
          {podium[2] && (
            <div className="order-3 flex flex-col items-center group">
              <div className="mb-6 relative">
                <div className="w-20 h-20 rounded-[28px] bg-amber-50 border-4 border-amber-100 flex items-center justify-center text-2xl font-black text-amber-700 shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                  {podium[2].name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-700 p-2 rounded-xl shadow-lg">
                  <Medal size={16} className="text-white" />
                </div>
              </div>
              <div className="bg-white w-36 h-32 rounded-t-[32px] shadow-xl shadow-slate-100 flex flex-col items-center justify-center p-6 border-x border-t border-slate-100">
                <span className="text-4xl font-black text-amber-100 mb-2 italic">3º</span>
                <span className="text-[11px] font-black text-slate-800 truncate w-full text-center uppercase tracking-wider">{podium[2].name}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-1">{podium[2].stats.score} PTS</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard List Clean */}
      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-100">
        <div className="px-10 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
           <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Colaboradores em Evolução</span>
           <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">TOP 10 BASE DE TREINAMENTO</span>
        </div>
        
        <div className="divide-y divide-slate-50">
          {others.map((u, idx) => (
            <div key={u.id} className="group px-10 py-6 flex items-center justify-between hover:bg-slate-50 transition-all">
              <div className="flex items-center space-x-8">
                <span className="w-8 text-base font-black text-slate-200 tracking-tighter italic">#{idx + 4}</span>
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 rounded-[18px] bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-[#DA291C] group-hover:text-white transition-all">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide group-hover:text-[#DA291C] transition-colors">{u.name}</h4>
                    <div className="flex items-center space-x-4 mt-1.5">
                      <div className="flex items-center space-x-1.5">
                        <Target size={12} className="text-red-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.stats.score} PTS</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{Math.floor(u.stats.totalTime / 60)}M</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                 <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: `${Math.min(100, (u.stats.score/1000)*100)}%` }} />
                 </div>
              </div>
            </div>
          ))}
          {topAtendentes.length === 0 && (
            <div className="px-10 py-24 text-center text-slate-300 text-[11px] font-black uppercase tracking-[0.4em]">
              Aguardando resultados do turno...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
