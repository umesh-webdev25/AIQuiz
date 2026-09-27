import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Loader2, Plus, Clock, Target } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/quiz/history');
      setHistory(data);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return toast.error('Please enter a topic');
    
    setGenerating(true);
    const loadingToast = toast.loading('AI is crafting your quiz...');
    
    try {
      const { data } = await api.post('/quiz/generate', { topic, difficulty, count });
      toast.success('Quiz generated!', { id: loadingToast });
      navigate(`/quiz/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate quiz', { id: loadingToast });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Quiz Generator */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="text-orange-600" />
            New Quiz
          </h2>
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <input 
                type="text" 
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. World War II, React Hooks"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions ({count})</label>
              <input 
                type="range" 
                min="3" max="15" 
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full accent-orange-600"
              />
            </div>
            <button 
              type="submit" 
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Quiz'}
            </button>
          </form>
        </div>
      </div>

      {/* History */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="text-orange-600" />
          Your Quiz History
        </h2>
        
        {loadingHistory ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No quizzes yet</h3>
            <p className="text-gray-500">Generate your first quiz using the panel on the left!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {history.map(quiz => (
              <Link 
                key={quiz._id} 
                to={quiz.score !== undefined && quiz.userAnswer ? `/results/${quiz._id}` : `/quiz/${quiz._id}`}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900 truncate pr-4">{quiz.topic}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                    ${quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                      quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{quiz.totalQuestions} Questions</span>
                  {quiz.score !== undefined && (
                    <span className="font-bold text-orange-600 group-hover:text-orange-700">
                      Score: {quiz.score}/{quiz.totalQuestions}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
