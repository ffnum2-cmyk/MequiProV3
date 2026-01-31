
import React, { useState, useMemo, useEffect } from 'react';
import { DBService } from '../services/db';
import { Role, Question } from '../types';
import { ROLES_CONFIG, PHASES } from '../constants';
import { HelpCircle, Save, Edit2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Search } from 'lucide-react';

export const QuestionManagement: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<Role>(Role.ATENDENTE);
  const [filterPhase, setFilterPhase] = useState<number>(1);
  const [search, setSearch] = useState('');
  
  const [form, setForm] = useState<Partial<Question>>({});

  useEffect(() => {
    loadQuestions();
  }, []);

  const addNewQuestion = () => {
    const newQ: Partial<Question> = {
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      difficulty: 'Fácil',
      level: filterRole,
      phase: filterPhase,
      knowledgeId: ''
    };
    setForm(newQ);
    setEditingId('new');
  };

  const loadQuestions = async () => {
    setIsLoading(true);
    const data = await DBService.getQuestions();
    setQuestions(data);
    setIsLoading(false);
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => 
      q.level === filterRole && 
      q.phase === filterPhase &&
      (search === '' || q.text.toLowerCase().includes(search.toLowerCase()))
    );
  }, [questions, filterRole, filterPhase, search]);

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setForm(q);
  };

  const handleSave = async () => {
    if (!form.text || form.options?.some(o => !o)) {
      alert('Preencha o enunciado e todas as 4 opções!');
      return;
    }
    await DBService.saveQuestion(form as Question);
    await loadQuestions();
    setEditingId(null);
    setForm({});
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Editor de Questões</h1>
          <p className="text-slate-500 text-sm">Gerencie as 180 perguntas do sistema</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={addNewQuestion}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all"
          >
            + Nova Pergunta
          </button>
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value as Role)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.values(Role).filter(r => r !== Role.MASTER).map(r => (
              <option key={r} value={r}>{ROLES_CONFIG[r].label}</option>
            ))}
          </select>
          <select 
            value={filterPhase} 
            onChange={(e) => setFilterPhase(parseInt(e.target.value))}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {PHASES.map(p => <option key={p} value={p}>Fase {p}</option>)}
          </select>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar por texto da pergunta..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div className="space-y-4">
        {editingId === 'new' && (
          <div className="bg-white rounded-2xl border-2 border-indigo-500 shadow-xl p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Nova Pergunta</span>
                <div className="flex space-x-2">
                   <button onClick={handleSave} className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all">
                    <Save size={14} />
                    <span>Salvar</span>
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">
                    Cancelar
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Enunciado</label>
                <textarea 
                  value={form.text} 
                  onChange={e => setForm({...form, text: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Digite o enunciado da questão..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0,1,2,3].map((oIdx) => (
                  <div key={oIdx} className={`p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${form.correctOptionIndex === oIdx ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="correct-new" 
                      checked={form.correctOptionIndex === oIdx}
                      onChange={() => setForm({...form, correctOptionIndex: oIdx})}
                      className="w-5 h-5 text-green-600 focus:ring-green-500"
                    />
                    <input 
                      type="text" 
                      value={form.options?.[oIdx] || ''}
                      onChange={e => {
                        const newOpts = [...(form.options || ['', '', '', ''])];
                        newOpts[oIdx] = e.target.value;
                        setForm({...form, options: newOpts});
                      }}
                      className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700"
                      placeholder={`Opção ${String.fromCharCode(65 + oIdx)}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Dificuldade</label>
                  <select 
                    value={form.difficulty} 
                    onChange={e => setForm({...form, difficulty: e.target.value as any})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 text-center">
             <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Carregando Questões...</p>
          </div>
        ) : filteredQuestions.map((q, idx) => (
          <div key={q.id} className={`bg-white rounded-2xl border-2 transition-all ${editingId === q.id ? 'border-indigo-500 shadow-xl' : 'border-slate-100'}`}>
            <div className="p-6">
              {editingId === q.id ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Editando Pergunta {idx + 1}</span>
                    <div className="flex space-x-2">
                       <button onClick={handleSave} className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all">
                        <Save size={14} />
                        <span>Salvar</span>
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">
                        Cancelar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Enunciado</label>
                    <textarea 
                      value={form.text} 
                      onChange={e => setForm({...form, text: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {form.options?.map((opt, oIdx) => (
                      <div key={oIdx} className={`p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${form.correctOptionIndex === oIdx ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
                        <input 
                          type="radio" 
                          name={`correct-${q.id}`} 
                          checked={form.correctOptionIndex === oIdx}
                          onChange={() => setForm({...form, correctOptionIndex: oIdx})}
                          className="w-5 h-5 text-green-600 focus:ring-green-500"
                        />
                        <input 
                          type="text" 
                          value={opt}
                          onChange={e => {
                            const newOpts = [...(form.options || [])];
                            newOpts[oIdx] = e.target.value;
                            setForm({...form, options: newOpts});
                          }}
                          className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700"
                          placeholder={`Opção ${String.fromCharCode(65 + oIdx)}`}
                        />
                        {form.correctOptionIndex === oIdx && <CheckCircle2 size={18} className="text-green-600" />}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 pt-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Dificuldade</label>
                      <select 
                        value={form.difficulty} 
                        onChange={e => setForm({...form, difficulty: e.target.value as any})}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      >
                        <option value="Fácil">Fácil</option>
                        <option value="Médio">Médio</option>
                        <option value="Difícil">Difícil</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pergunta {idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        q.difficulty === 'Fácil' ? 'bg-green-100 text-green-600' : 
                        q.difficulty === 'Médio' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-4">{q.text}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`text-xs p-2 rounded-lg flex items-center space-x-2 ${q.correctOptionIndex === oIdx ? 'bg-green-50 text-green-700 font-bold border border-green-100' : 'bg-slate-50 text-slate-500'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${q.correctOptionIndex === oIdx ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                            {String.fromCharCode(65 + oIdx)}
                          </div>
                          <span className="truncate">{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => startEdit(q)}
                    className="ml-4 p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {!isLoading && filteredQuestions.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <HelpCircle size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-400 font-medium">Nenhuma pergunta encontrada para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};
