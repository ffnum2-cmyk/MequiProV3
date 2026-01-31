import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

// Credenciais Reais fornecidas pelo usuário
const REAL_URL = "https://ywillntxpjfatnnhpwbc.supabase.co";
const REAL_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3aWxsbnR4cGpmYXRubmhwd2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MzA1NjQsImV4cCI6MjA4NTQwNjU2NH0.IjFtHAGnEXLifJx8s2bTXJjAR57wJuWtMw7oXJydgvw";

// Tenta pegar das variáveis de ambiente do Vite, senão usa as reais fixas para garantir funcionamento no deploy manual
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || REAL_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || REAL_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO CRÍTICO: Credenciais do Supabase não encontradas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
