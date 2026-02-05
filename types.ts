export enum AppState {
  SETUP = 'SETUP',
  GENERATING = 'GENERATING',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export enum PageState {
  HOME = 'HOME',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  QUIZ = 'QUIZ'
}

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface QuizConfig {
  numQuestions: number;
  timePerQuestion: number; // in seconds
}

export interface QuizResult {
  score: number;
  total: number;
  history: {
    questionIndex: number;
    selectedOptionIndex: number | null;
    isCorrect: boolean;
    timeTaken: number;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
}

export interface QuizHistoryItem {
  id: string;
  title: string;
  score: number;
  total: number;
  date: string;
  timeSpent: number; // in seconds
  percentage: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  quizHistory: QuizHistoryItem[];
  addQuizToHistory: (quiz: QuizHistoryItem) => void;
}