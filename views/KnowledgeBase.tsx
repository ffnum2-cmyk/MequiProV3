
import React, { useState, useEffect } from 'react';
import { DBService } from '../services/db';
import { Role, Knowledge } from '../types';
import { Plus, BookOpen, Trash2, Edit2, Save, X } from 'lucide-react';
import { ROLES_CONFIG } from '../constants';

export const KnowledgeBase: React.FC = () => {
  const [data, setData] = useState<Knowledge[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState<Partial<Knowledge>>({ role: Role.ATENDENTE });

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async () => {
    setIsLoading(true);
    const knowledge = await DBService.getKnowledge();
    setData(knowledge);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!current.title || !current.content || !current.role) return;
    const newKnowledge: Knowledge = {
      id: current.id || Math.random().toString(36).substr(2, 9),
      title: current.title,
      content: current.content,
      role: current.role as Role
    };
    await DBService.saveKnowledge(newKnowledge);
    await loadKnowledge();
    setIsAdding(false);
    setCurrent({ role: Role.ATENDENTE });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este conteúdo permanentemente?')) {
      await DBService.deleteKnowledge(id);
      await loadKnowledge();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BookOpen className="text-indigo-600" size={32} />
          <h1 className="text-3xl font-bold text-slate-800">Banco de Saberes</h1>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:scale-105"
        >
          <Plus size={20} />
          <span>Novo Conteúdo</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">{current.id ? 'Editar Conteúdo' : 'Adicionar Novo Conteúdo'}</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600">Título</label>
              <input
                type="text"
                value={current.title || ''}
                onChange={e => setCurrent({...current, title: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Missão da Empresa"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600">Associação (Nível)</label>
              <select
                value={current.role}
                onChange={e => setCurrent({...current, role: e.target.value as Role})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(Role).filter(r => r !== Role.MASTER).map(r => (
                  <option key={r} value={r}>{ROLES_CONFIG[r].label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1 mb-6">
            <label className="text-sm font-bold text-slate-600">Conteúdo Base (Conceitos e Regras)</label>
            <textarea
              value={current.content || ''}
              onChange={e => setCurrent({...current, content: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Descreva o conteúdo detalhadamente..."
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
          >
            <Save size={20} />
            <span>Salvar no Banco</span>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Consultando Arquivos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full text-white ${ROLES_CONFIG[item.role].color}`}>
                  {ROLES_CONFIG[item.role].label}
                </span>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setCurrent(item); setIsAdding(true); }} className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-3">{item.content}</p>
            </div>
          ))}
          {data.length === 0 && !isAdding && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">Nenhum conteúdo cadastrado ainda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
