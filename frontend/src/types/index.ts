export interface User {
  id: number;
  email: string;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  status: 'in_progress' | 'completed';
  target_date?: string;
  category?: string;
  recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reflection {
  id: number;
  audio_file?: string;
  transcription: string;
  ai_summary: string;
  keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {}