
import React, { useState } from 'react';
import { View, User, Role } from '../types';
import { ROLES_CONFIG } from '../constants';
import { LogOut, Trophy, Unlock, Users, HelpCircle, BarChart3, ChevronRight, Menu, X, Shield, Sword, Crown } from 'lucide-react';

interface LayoutProps {
  user: User | null;
  currentView: View;
  setView: (v: View) => void;
  logout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, currentView, setView, logout, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const isMasterOrAdm = user.role === Role.MASTER || user.role === Role.ADM;

  const handleNav = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ view, icon: Icon, label, colorClass = "" }: { view: View, icon: any, label: string, colorClass?: string }) => (
    <button
      onClick={() => handleNav(view)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
        currentView === view 
          ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' 
          : `text-slate-500 hover:bg-slate-50 ${colorClass}`
      }`}
    >
      <Icon size={16} className={currentView === view ? "text-red-600" : "text-slate-400"} />
      <span className="font-bold text-[10px] uppercase tracking-widest text-left">{label}</span>
      {currentView === view && <ChevronRight size={12} className="ml-auto text-red-400" />}
    </button>
  );

  const SidebarContent = () => (
    <>
      <div className="p-8">
        <div className="flex items-center space-x-3 text-slate-900 font-black text-2xl mb-12 tracking-tighter">
          <div className="w-10 h-10 bg-[#DA291C] rounded-xl flex items-center justify-center text-white italic font-pro shadow-lg">M</div>
          <div className="flex flex-col leading-none">
            <span>MÉQUI</span>
            <span className="text-[11px] text-[#DA291C] italic font-pro tracking-widest">PRO</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          <div className="pb-3 px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Canais de Treino</div>
          
          {(isMasterOrAdm || user.role === Role.ATENDENTE || user.role === Role.TREINADOR) && (
            <NavItem view="BASE_VIEW" icon={Shield} label="Base de Treinamento" />
          )}

          {(isMasterOrAdm || user.role === Role.TREINADOR) && (
            <NavItem view="PRO_VIEW" icon={Sword} label="Treinador Pro" />
          )}

          {(isMasterOrAdm || user.role === Role.COORDENADOR) && (
            <NavItem view="ELITE_VIEW" icon={Crown} label="Coordenador Elite" />
          )}

          <div className="pt-8 pb-3 px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Performance</div>
          <NavItem view="RANKING" icon={Trophy} label="Classificação" />
          
          {isMasterOrAdm && (
            <>
              <div className="pt-10 pb-3 px-4 text-[9px] font-black text-red-700 uppercase tracking-[0.3em]">Terminal ADM</div>
              <NavItem view="GLOBAL_PHASES" icon={Unlock} label="Controle Global" />
              <NavItem view="QUESTIONS" icon={HelpCircle} label="Questões" />
              <NavItem view="USERS" icon={Users} label="Acessos" />
              <NavItem view="STATS" icon={BarChart3} label="Dashboards" />
            </>
          )}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center space-x-3 mb-6 px-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md ${ROLES_CONFIG[user.role].color}`}>
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black text-slate-900 truncate uppercase">{user.name}</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{ROLES_CONFIG[user.role].label}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <LogOut size={16} />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-50 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3 text-slate-900 font-black tracking-tighter">
          <div className="w-8 h-8 bg-[#DA291C] rounded-lg flex items-center justify-center text-white italic font-pro">M</div>
          <span className="text-sm">MÉQUI <span className="text-[11px] text-[#DA291C] italic font-pro">PRO</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-100 flex flex-col shadow-2xl animate-slideRight">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden md:flex flex-col sticky top-0 h-screen shadow-sm">
        <SidebarContent />
      </aside>

      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto bg-slate-50/30">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
