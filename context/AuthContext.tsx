import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, AuthContextType, QuizHistoryItem } from '../types';
import { serverService } from '../services/serverService';

interface AuthContextExtended extends AuthContextType {
  quizHistory: QuizHistoryItem[];
  addQuizToHistory: (quiz: QuizHistoryItem) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextExtended | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        loadHistory();
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const loadHistory = async () => {
    try {
      const history = await serverService.getQuizHistory();
      setQuizHistory(history);
    } catch (error) {
      console.error('Failed to load quiz history:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await serverService.login(email, password);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    await loadHistory();
  };

  const signup = async (name: string, email: string, password: string) => {
    await serverService.signup(name, email, password);
    // signup finished, but we don't call login() here anymore to allow for manual login
  };

  const logout = () => {
    setUser(null);
    setQuizHistory([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const addQuizToHistory = async (quiz: Omit<QuizHistoryItem, 'id' | 'date'>) => {
    try {
      const savedQuiz = await serverService.saveQuiz(quiz);
      setQuizHistory(prev => [savedQuiz, ...prev]);
    } catch (error) {
      console.error('Failed to save quiz to DB:', error);
      // Fallback: add to local state if server fails (optional)
    }
  };

  const value: AuthContextExtended = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    quizHistory,
    addQuizToHistory: addQuizToHistory as any, // Cast because of slight type difference in current types
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
