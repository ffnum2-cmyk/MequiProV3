
import React from 'react';
import { Role, User, Knowledge } from './types';

export const INITIAL_MASTER: User = {
  id: 'master-id',
  name: 'Méqui Admin',
  email: 'master@admin.com',
  passwordHash: 'master@123', // Senha MASTER@123 garantida
  role: Role.MASTER,
  recovery: {
    motherName: 'ADMIN',
    favoriteColor: 'BLACK'
  },
  isActive: true,
  unlockedPhases: [],
  stats: {
    score: 0,
    totalTime: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    completedPhases: []
  },
  createdAt: Date.now()
};

export const ROLES_CONFIG = {
  [Role.ATENDENTE]: {
    label: 'Base de Treinamento',
    color: 'bg-red-700',
    icon: '🍟'
  },
  [Role.TREINADOR]: {
    label: 'Treinador Pro',
    color: 'bg-neutral-800',
    icon: '🍔'
  },
  [Role.COORDENADOR]: {
    label: 'Coordenador Elite',
    color: 'bg-amber-600',
    icon: '✨'
  },
  [Role.ADM]: {
    label: 'Administrador',
    color: 'bg-indigo-900',
    icon: '🛡️'
  },
  [Role.MASTER]: {
    label: 'Méqui Master',
    color: 'bg-black',
    icon: '⚡'
  }
};

export const PHASES = [1, 2, 3, 4];
