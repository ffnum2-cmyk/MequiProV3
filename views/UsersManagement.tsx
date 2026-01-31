
import React, { useState, useEffect } from 'react';
import { DBService } from '../services/db';
import { Role, User } from '../types';
import { ROLES_CONFIG } from '../constants';
import { Trash2, UserCheck, UserX, UserCog, ShieldAlert, Users } from 'lucide-react';

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await DBService.getUsers();
    setUsers(data);
    setIsLoading(false);
  };

  const toggleStatus = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    const updatedUser = { ...user, isActive: !user.isActive };
    const success = await DBService.saveUser(updatedUser);
    if (success) {
      setUsers(users.map(u => u.id === id ? updatedUser : u));
    }
  };

  const changeRole = async (id: string, role: Role) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const updatedUser = { ...user, role };
    const success = await DBService.saveUser(updatedUser);
    if (success) {
      setUsers(users.map(u => u.id === id ? updatedUser : u));
    }
  };

  const deleteUser = async (id: string) => {
    if (confirm('Deseja realmente remover este usuário permanentemente?')) {
      await DBService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-900 rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-slate-200">
             <UserCog size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Controle de Acessos</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Gestão de Equipe e Permissões Administrativas</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-[24px] text-amber-700 text-[11px] font-bold uppercase tracking-widest flex items-center space-x-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <ShieldAlert size={20} className="text-amber-600" />
        </div>
        <p>Cargos de Administrador possuem acesso total ao painel de controle e edição de questões. O Ranking (Hall da Fama) é exclusivo para usuários no nível Base de Treinamento.</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-10 py-6">Identificação</th>
                <th className="px-10 py-6 text-center">Cargo Operacional</th>
                <th className="px-10 py-6 text-center">Estado</th>
                <th className="px-10 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carregando Colaboradores...</span>
                  </td>
                </tr>
              ) : users.filter(u => u.role !== Role.MASTER).map(u => (
                <tr key={u.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-black shadow-md ${ROLES_CONFIG[u.role].color}`}>
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm uppercase tracking-tight">{u.name}</span>
                        <span className="text-[10px] font-bold text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-center">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value as Role)}
                        className="text-[10px] font-black bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-red-600 transition-all cursor-pointer uppercase tracking-widest shadow-sm"
                      >
                        <option value={Role.ATENDENTE}>Base de Treinamento</option>
                        <option value={Role.TREINADOR}>Treinador Pro</option>
                        <option value={Role.COORDENADOR}>Coordenador Elite</option>
                        <option value={Role.ADM}>Administrador</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`flex items-center space-x-2 text-[10px] font-black px-4 py-2 rounded-xl transition-all border ${
                          u.isActive 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-red-50 text-red-600 border-red-100'
                        }`}
                      >
                        {u.isActive ? <UserCheck size={14} /> : <UserX size={14} />}
                        <span>{u.isActive ? 'ATIVO' : 'BLOQUEADO'}</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Excluir Usuário"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && users.filter(u => u.role !== Role.MASTER).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="text-slate-100 mb-4" size={64} />
                      <p className="text-slate-300 text-[11px] font-black uppercase tracking-[0.4em]">Nenhum colaborador registrado no banco de dados.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
