import { QuizHistoryItem, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ServerService {
    private getToken() {
        return localStorage.getItem('token');
    }

    private getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }

    async login(email: string, password: string): Promise<{ token: string; user: User }> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    }

    async signup(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }

        return response.json();
    }

    async saveQuiz(quizResult: Omit<QuizHistoryItem, 'id' | 'date'>): Promise<QuizHistoryItem> {
        const response = await fetch(`${API_URL}/quizzes`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(quizResult)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save quiz');
        }

        return response.json();
    }

    async getQuizHistory(): Promise<QuizHistoryItem[]> {
        const response = await fetch(`${API_URL}/quizzes/history`, {
            method: 'GET',
            headers: this.getHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch history');
        }

        const data = await response.json();
        // Convert string dates to Date objects or keep as strings as per types
        return data.map((item: any) => ({
            ...item,
            id: item._id, // Map MongoDB _id to id
            date: item.date.split('T')[0] // Format date for UI
        }));
    }
}

export const serverService = new ServerService();
