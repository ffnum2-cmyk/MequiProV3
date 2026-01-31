
import React, { useState, useEffect } from 'react';
import { Question, Role, User, PhaseResult } from '../types';
import { Clock, Target, ArrowRight, CheckCircle2, XCircle, Award, Zap } from 'lucide-react';

interface QuizViewProps {
  user: User;
  level: Role;
  phase: number;
  questions: Question[];
  onComplete: (res: PhaseResult) => void;
  onExit: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ user, level, phase, questions, onComplete, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

  useEffect(() => {
    const t = setInterval(() => setTimer(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startTime]);

  const handleAnswer = (idx: number) => {
    if (feedback) return;
    const isCorrect = idx === questions[currentIdx].correctOptionIndex;
    setFeedback(isCorrect ? 'CORRECT' : 'WRONG');
    
    setTimeout(() => {
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);
      setFeedback(null);
      if (currentIdx + 1 < questions.length) setCurrentIdx(currentIdx + 1);
      else finishQuiz(newAnswers);
    }, 800);
  };

  const finishQuiz = (finalAnswers: number[]) => {
    const correctCount = finalAnswers.reduce((acc, ans, i) => 
      ans === questions[i].correctOptionIndex ? acc + 1 : acc, 0
    );
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const score = correctCount * 100 - Math.floor(timeTaken / 5);
    const result: PhaseResult = {
      userId: user.id,
      phaseId: `${level}-${phase}`,
      score: Math.max(0, score),
      timeTaken,
      correctCount,
      totalCount: questions.length
    };
    setIsFinished(true);
    onComplete(result);
  };

  if (isFinished) {
    const correct = answers.reduce((acc, ans, i) => ans === questions[i].correctOptionIndex ? acc + 1 : acc, 0);
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fadeIn">
        <div className="bg-white p-12 rounded-[48px] border border-slate-100 max-w-md w-full shadow-2xl shadow-slate-200">
          <div className="w-20 h-20 bg-green-500 rounded-[28px] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-green-100 animate-bounce">
            <Award size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Missão Concluída</h2>
          <p className="text-slate-400 text-[11px] mb-10 uppercase tracking-widest font-bold">Relatório Operacional Gerado</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="block text-[10px] font-black text-slate-400 uppercase mb-2">Precisão</span>
              <span className="text-2xl font-black text-[#DA291C]">{Math.round((correct/questions.length)*100)}%</span>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="block text-[10px] font-black text-slate-400 uppercase mb-2">Tempo</span>
              <span className="text-2xl font-black text-slate-900">{Math.floor(timer / 60)}m {timer % 60}s</span>
            </div>
          </div>
          
          <button
            onClick={onExit}
            className="w-full py-5 bg-[#DA291C] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-[#B92218] transition-all flex items-center justify-center space-x-3 shadow-xl shadow-red-100"
          >
            <span>Voltar ao Painel</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex justify-between items-center mb-8 px-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <Clock size={16} className="text-red-600" />
            <span className="text-slate-900">{Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center space-x-2 text-[11px] font-black text-slate-900 uppercase tracking-widest">
            <Target size={16} className="text-red-600" />
            <span>Progresso {currentIdx + 1}/{questions.length}</span>
          </div>
        </div>
        <button onClick={onExit} className="text-[10px] font-black text-slate-300 hover:text-red-600 uppercase tracking-widest transition-colors">Abortar Missão</button>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full mb-12 overflow-hidden">
        <div className="h-full bg-red-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-white rounded-[40px] p-10 md:p-14 border border-slate-100 relative overflow-hidden shadow-2xl shadow-slate-100">
        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center z-20 backdrop-blur-md animate-fadeIn transition-all ${feedback === 'CORRECT' ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
            <div className={`p-8 rounded-[32px] shadow-2xl animate-scaleUp text-white ${feedback === 'CORRECT' ? 'bg-green-500' : 'bg-red-600'}`}>
              {feedback === 'CORRECT' ? <CheckCircle2 size={64} /> : <XCircle size={64} />}
            </div>
          </div>
        )}

        <div className="mb-14 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
            <Zap size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">{q.difficulty}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
            {q.text}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={!!feedback}
              className={`p-6 text-left rounded-[24px] border transition-all flex items-center space-x-5 group ${
                feedback === 'CORRECT' && i === q.correctOptionIndex ? 'bg-green-50 border-green-200' : 
                feedback === 'WRONG' && i === q.correctOptionIndex ? 'bg-green-50/50 border-green-100' :
                'bg-slate-50 border-slate-50 hover:bg-white hover:border-red-200 hover:shadow-lg hover:shadow-red-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${
                feedback === 'CORRECT' && i === q.correctOptionIndex ? 'bg-green-500 text-white' : 'bg-white text-slate-400 border border-slate-200 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600'
              }`}>
                {String.fromCharCode(65 + i)}
              </div>
              <span className={`flex-1 font-bold text-sm transition-colors ${
                feedback === 'CORRECT' && i === q.correctOptionIndex ? 'text-green-700' : 'text-slate-600 group-hover:text-slate-900'
              }`}>
                {opt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
