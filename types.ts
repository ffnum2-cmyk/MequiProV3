
export enum Role {
  MASTER = 'MASTER',
  ADM = 'ADM',
  ATENDENTE = 'ATENDENTE',
  TREINADOR = 'TREINADOR',
  COORDENADOR = 'COORDENADOR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  recovery: {
    motherName: string;
    favoriteColor: string;
  };
  isActive: boolean;
  unlockedPhases: string[]; 
  stats: UserStats;
  createdAt: number;
}

export interface UserStats {
  score: number;
  totalTime: number;
  questionsAnswered: number;
  correctAnswers: number;
  completedPhases: string[];
}

export interface Knowledge {
  id: string;
  title: string;
  content: string;
  role: Role;
}

export interface Question {
  id: string;
  knowledgeId: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  level: Role;
  phase: number;
}

export interface PhaseResult {
  userId: string;
  phaseId: string;
  score: number;
  timeTaken: number;
  correctCount: number;
  totalCount: number;
}

export type View = 'HOME' | 'LOGIN' | 'REGISTER' | 'RECOVERY' | 'RANKING' | 'GLOBAL_PHASES' | 'USERS' | 'QUESTIONS' | 'STATS' | 'QUIZ' | 'BASE_VIEW' | 'PRO_VIEW' | 'ELITE_VIEW';
