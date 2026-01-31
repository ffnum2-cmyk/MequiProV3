
import React, { useState, useEffect } from 'react';
import { View, User, Role, PhaseResult, Question } from './types';
import { DBService } from './services/db';
import { Home } from './views/Home';
import { Login } from './views/Login';
import { Register } from './views/Register';
import { Recovery } from './views/Recovery';
import { Ranking } from './views/Ranking';
import { GlobalPhases } from './views/GlobalPhases';
import { UsersManagement } from './views/UsersManagement';
import { QuestionManagement } from './views/QuestionManagement';
import { Stats } from './views/Stats';
import { QuizView } from './views/QuizView';
import { Layout } from './components/Layout';
import { LevelDashboard } from './views/LevelDashboard';
import { KnowledgeBase } from './views/KnowledgeBase';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>('HOME');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [quizContext, setQuizContext] = useState<{ lvl: Role, ph: number } | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    const questions = await DBService.getQuestions();
    setAllQuestions(questions);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const session = await DBService.getSession();
      if (session) {
        setCurrentUser(session);
        navigateUser(session);
      }
      await loadData();
      setIsLoading(false);
    };
    init();
  }, []);

  const navigateUser = (user: User) => {
    if (user.role === Role.MASTER || user.role === Role.ADM) setView('STATS');
    else if (user.role === Role.COORDENADOR) setView('ELITE_VIEW');
    else if (user.role === Role.TREINADOR) setView('PRO_VIEW');
    else setView('BASE_VIEW');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    navigateUser(user);
  };

  const handleLogout = async () => {
    await DBService.logout();
    setCurrentUser(null);
    setView('HOME');
  };

  const handleQuizComplete = async (res: PhaseResult) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser };
    updatedUser.stats.score += res.score;
    updatedUser.stats.correctAnswers += res.correctCount;
    updatedUser.stats.questionsAnswered += res.totalCount;
    updatedUser.stats.totalTime += res.timeTaken;
    
    if (!updatedUser.stats.completedPhases.includes(res.phaseId)) {
      updatedUser.stats.completedPhases.push(res.phaseId);
    }

    await DBService.saveUser(updatedUser);
    await DBService.saveResult(res);
    setCurrentUser(updatedUser);
  };

  const startQuiz = (lvl: Role, ph: number) => {
    setQuizContext({ lvl, ph });
    setView('QUIZ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Conectando à Rede Méqui...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'HOME': return <Home onNavigate={setView} />;
      case 'LOGIN': return <Login onLogin={handleLogin} onNavigate={setView} />;
      case 'REGISTER': return <Register onNavigate={setView} />;
      case 'RECOVERY': return <Recovery onNavigate={setView} />;
      
      case 'QUIZ':
        if (!currentUser || !quizContext) return null;
        const questions = allQuestions.filter(q => q.level === quizContext.lvl && q.phase === quizContext.ph);
        return (
          <QuizView
            user={currentUser}
            level={quizContext.lvl}
            phase={quizContext.ph}
            questions={questions}
            onComplete={handleQuizComplete}
            onExit={() => {
              if (quizContext.lvl === Role.ATENDENTE) setView('BASE_VIEW');
              else if (quizContext.lvl === Role.TREINADOR) setView('PRO_VIEW');
              else setView('ELITE_VIEW');
            }}
          />
        );

      case 'BASE_VIEW': return currentUser ? <LevelDashboard user={currentUser} level={Role.ATENDENTE} onStartQuiz={startQuiz} /> : null;
      case 'PRO_VIEW': return currentUser ? <LevelDashboard user={currentUser} level={Role.TREINADOR} onStartQuiz={startQuiz} /> : null;
      case 'ELITE_VIEW': return currentUser ? <LevelDashboard user={currentUser} level={Role.COORDENADOR} onStartQuiz={startQuiz} /> : null;
      
      case 'RANKING': return <Ranking />;
      case 'GLOBAL_PHASES': return <GlobalPhases />;
      case 'USERS': return <UsersManagement />;
      case 'QUESTIONS': return <QuestionManagement onUpdate={loadData} />;
      case 'STATS': return <Stats />;
      case 'KNOWLEDGE': return <KnowledgeBase />;
      default: return null;
    }
  };

  return (
    <Layout
      user={currentUser}
      currentView={currentView}
      setView={setView}
      logout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
