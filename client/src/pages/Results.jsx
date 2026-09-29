import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export default function Results() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await api.get(`/quiz/${id}`);
        setQuiz(data);
      } catch (err) {
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your results...</p>
      </div>
    );
  }

  if (!quiz) return null;

  const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-orange-600 font-medium hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{quiz.topic} Quiz Results</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Difficulty: {quiz.difficulty}</p>
        
        <div className="inline-flex flex-col items-center justify-center w-48 h-48 rounded-full border-8 border-orange-50 mb-6 relative">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle 
              cx="96" cy="96" r="88" 
              className="text-gray-100" 
              strokeWidth="16" fill="transparent" stroke="currentColor" 
            />
            <circle 
              cx="96" cy="96" r="88" 
              className={`transition-all duration-1000 ease-out ${
                percentage >= 80 ? 'text-green-500' : 
                percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
              }`}
              strokeWidth="16" fill="transparent" stroke="currentColor"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
            />
          </svg>
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl font-black text-gray-900 dark:text-white">{percentage}%</span>
            <span className="text-gray-500 dark:text-gray-400 font-medium mt-1">{quiz.score} / {quiz.totalQuestions}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {percentage >= 80 ? 'Outstanding!' : 
           percentage >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
        </h3>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Detailed Review</h3>
        {quiz.questions.map((q, idx) => {
          const isCorrect = q.userAnswer === q.correctAnswer;
          return (
            <div key={idx} className={`p-6 rounded-2xl border-2 ${
              isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="mt-1 shrink-0">
                  {isCorrect ? <CheckCircle2 className="text-green-600 w-6 h-6" /> : <XCircle className="text-red-600 w-6 h-6" />}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">{q.questionText}</h4>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 ml-10">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Answer</span>
                  <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {q.userAnswer || 'No Answer'}
                  </span>
                </div>
                {!isCorrect && (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200">
                    <span className="block text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Correct Answer</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {q.correctAnswer}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
