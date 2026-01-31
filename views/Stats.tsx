
import React, { useState, useEffect } from 'react';
import { DBService } from '../services/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, CheckCircle2, Award, Clock } from 'lucide-react';
import { Role, User, Question, PhaseResult } from '../types';

export const Stats: React.FC = () => {
  // Fix: Handling async data fetching with state and effect
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<PhaseResult[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [u, q, r] = await Promise.all([
        DBService.getUsers(),
        DBService.getQuestions(),
        DBService.getResults()
      ]);
      setUsers(u.filter(user => user.role !== Role.MASTER));
      setQuestions(q);
      setResults(r);
    };
    fetchData();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const avgScore = totalUsers > 0 ? users.reduce((acc, u) => acc + u.stats.score, 0) / totalUsers : 0;
  
  // Fix: Mapping invalid role properties to correct enum values
  const roleDistribution = [
    { name: 'Base', value: users.filter(u => u.role === Role.ATENDENTE).length },
    { name: 'Pro', value: users.filter(u => u.role === Role.TREINADOR).length },
    { name: 'Elite', value: users.filter(u => u.role === Role.COORDENADOR).length },
  ];

  const COLORS = ['#3b82f6', '#a855f7', '#f59e0b'];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Estatísticas Gerais</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total de Alunos" value={totalUsers} icon={Users} color="bg-blue-500" />
        <StatCard title="Ativos" value={activeUsers} icon={CheckCircle2} color="bg-green-500" />
        <StatCard title="Pontuação Média" value={avgScore.toFixed(0)} icon={Award} color="bg-yellow-500" />
        <StatCard title="Quizes Realizados" value={results.length} icon={Clock} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Distribuição por Cargo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 text-sm">
            {roleDistribution.map((r, i) => (
              <div key={r.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-slate-600">{r.name}: {r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Desempenho por Cargo (Pontuação Total)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
