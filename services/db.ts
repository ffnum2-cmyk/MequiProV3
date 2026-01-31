
import { User, Knowledge, Question, Role, PhaseResult } from '../types';
import { supabase } from './supabase';
import { INITIAL_MASTER } from '../constants';

export class DBService {
  private static mapProfile(profile: any): User {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      passwordHash: '',
      role: profile.role as Role,
      recovery: profile.recovery_data || { motherName: '', favoriteColor: '' },
      isActive: profile.is_active ?? true,
      unlockedPhases: profile.unlocked_phases || [],
      stats: profile.stats || { score: 0, totalTime: 0, questionsAnswered: 0, correctAnswers: 0, completedPhases: [] },
      createdAt: profile.created_at ? new Date(profile.created_at).getTime() : Date.now()
    };
  }

  static async getGlobalPhases(): Promise<string[]> {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'global_phases')
        .single();
      return data?.value || [];
    } catch {
      return [];
    }
  }

  static async toggleGlobalPhase(phaseKey: string): Promise<string[]> {
    const current = await this.getGlobalPhases();
    let updated: string[];
    
    if (current.includes(phaseKey)) {
      updated = current.filter(p => p !== phaseKey);
    } else {
      updated = [...current, phaseKey];
    }

    await supabase
      .from('app_settings')
      .upsert({ key: 'global_phases', value: updated });
      
    return updated;
  }

  static async login(email: string, pass: string): Promise<User | null> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (authError || !authData.user) {
      // Fallback para MASTER se o auth falhar mas for a senha padrão (útil para primeiro acesso)
      if (email === INITIAL_MASTER.email && pass === 'master@123') {
         // Tenta criar o master se não existir
         await supabase.auth.signUp({ email, password: pass });
         return this.login(email, pass);
      }
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      if (email === INITIAL_MASTER.email) {
        const newMaster = {
          id: authData.user.id,
          name: INITIAL_MASTER.name,
          email: INITIAL_MASTER.email,
          role: Role.MASTER,
          recovery_data: INITIAL_MASTER.recovery,
          is_active: true,
          unlocked_phases: [],
          stats: INITIAL_MASTER.stats
        };
        await supabase.from('profiles').insert(newMaster);
        return this.mapProfile(newMaster);
      }
      return null;
    }

    const user = this.mapProfile(profile);
    return user.isActive ? user : null;
  }

  static async register(name: string, email: string, pass: string, recovery: any): Promise<User | null> {
    // Tenta o cadastro normal
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name }
      }
    });

    if (authError) {
      if (authError.message.includes('rate limit')) {
        throw new Error('O servidor de e-mail está temporariamente ocupado. Por favor, tente novamente em alguns minutos ou use outro e-mail.');
      }
      throw authError;
    }

    if (!authData.user) throw new Error('Falha ao criar usuário.');

    const newUserProfile = {
      id: authData.user.id,
      name,
      email,
      role: Role.ATENDENTE,
      recovery_data: recovery,
      is_active: true,
      unlocked_phases: ['ATENDENTE-1'],
      stats: { score: 0, totalTime: 0, questionsAnswered: 0, correctAnswers: 0, completedPhases: [] }
    };

    const { error: profileError } = await supabase.from('profiles').insert(newUserProfile);
    if (profileError) {
      console.error("Erro ao criar perfil, mas user auth foi criado:", profileError);
      // Tenta recuperar se o perfil falhou mas o auth existe
    }

    return this.mapProfile(newUserProfile);
  }

  static async getSession(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    return profile ? this.mapProfile(profile) : null;
  }

  static async logout() {
    await supabase.auth.signOut();
  }

  static async getUsers(): Promise<User[]> {
    const { data } = await supabase.from('profiles').select('*');
    return (data || []).map(p => this.mapProfile(p));
  }

  static async saveUser(user: User) {
    const { error } = await supabase.from('profiles').update({
      name: user.name,
      role: user.role,
      recovery_data: user.recovery,
      is_active: user.isActive,
      unlocked_phases: user.unlockedPhases,
      stats: user.stats
    }).eq('id', user.id);
    return !error;
  }

  static async deleteUser(id: string) {
    await supabase.from('profiles').delete().eq('id', id);
  }

  static async getQuestions(): Promise<Question[]> {
    const { data } = await supabase.from('questions').select('*');
    return (data || []).map(q => ({
      id: q.id,
      knowledgeId: q.knowledge_id,
      text: q.text,
      options: q.options,
      correctOptionIndex: q.correct_option_index,
      difficulty: q.difficulty,
      level: q.level as Role,
      phase: q.phase
    }));
  }

  static async saveQuestion(q: Question) {
    const payload = {
      id: q.id,
      knowledge_id: q.knowledgeId,
      text: q.text,
      options: q.options,
      correct_option_index: q.correctOptionIndex,
      difficulty: q.difficulty,
      level: q.level,
      phase: q.phase
    };
    await supabase.from('questions').upsert(payload);
  }

  static async deleteQuestion(id: string) {
    await supabase.from('questions').delete().eq('id', id);
  }

  static async getResults(): Promise<PhaseResult[]> {
    const { data } = await supabase.from('results').select('*');
    return data || [];
  }

  static async saveResult(res: PhaseResult) {
    await supabase.from('results').insert({
      user_id: res.userId,
      phase_id: res.phaseId,
      score: res.score,
      time_taken: res.timeTaken,
      correct_count: res.correctCount,
      total_count: res.totalCount
    });
  }
}
