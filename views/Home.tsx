
import React from 'react';
import { View } from '../types';
import { Zap, Target, Utensils, ChevronRight, Star, GraduationCap } from 'lucide-react';

interface HomeProps {
  onNavigate: (v: View) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-mesh-light flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Elementos Decorativos de Fast Food */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-20 left-20 -rotate-12"><Utensils size={180} /></div>
        <div className="absolute bottom-20 right-20 rotate-12"><GraduationCap size={180} /></div>
      </div>

      <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 shadow-sm">
            <Star size={12} className="text-red-600 fill-red-600" />
            <span className="text-red-700 font-bold text-[10px] uppercase tracking-widest">Academia de Excelência Operacional</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-none select-none">
            MÉQUI <span className="font-pro text-[#DA291C]">PRO</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Aprimore suas habilidades, desenvolva sua <span className="text-red-600 font-bold">liderança</span> e domine cada processo com o padrão de excelência que impulsiona sua carreira.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('LOGIN')}
            className="group relative w-full sm:w-60 overflow-hidden rounded-2xl bg-[#DA291C] p-[1px] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-200"
          >
            <div className="relative flex items-center justify-center gap-3 rounded-[15px] bg-white px-8 py-4 transition-all group-hover:bg-transparent">
              <span className="text-xs font-black text-[#DA291C] group-hover:text-white uppercase tracking-widest">Acessar</span>
              <ChevronRight className="w-4 h-4 text-[#DA291C] group-hover:text-white transition-colors" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('REGISTER')}
            className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
          >
            Cadastrar-se
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { title: "CONHECIMENTO", desc: "Base sólida para uma operação impecável", icon: GraduationCap, color: "text-amber-500" },
            { title: "EXCELÊNCIA", desc: "Qualidade absoluta em cada detalhe", icon: Star, color: "text-red-500" },
            { title: "LIDERANÇA", desc: "Desenvolva o potencial da sua equipe", icon: Target, color: "text-blue-500" }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group">
              <div className={`mb-4 p-3 rounded-2xl w-fit ${item.color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
                <item.icon size={24} />
              </div>
              <h3 className="font-black text-slate-800 text-xs mb-2 uppercase tracking-widest">{item.title}</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 text-slate-400 text-[9px] font-black uppercase tracking-[0.5em] z-10">
        © 2025 MÉQUI PRO | OPERATIONAL ACADEMY
      </div>
    </div>
  );
};
