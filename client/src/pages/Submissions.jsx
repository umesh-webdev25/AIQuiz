import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2, CheckCircle2, XCircle, Code2, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ solved: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/coding/progress');
      const solved = res.data.filter(sub => sub.status === 'solved');
      setStats({ solved: solved.length, total: res.data.length });
      
      // Sort by lastSubmittedAt desc and only include solved submissions
      const sorted = solved.sort((a, b) => new Date(b.lastSubmittedAt) - new Date(a.lastSubmittedAt));
      setSubmissions(sorted);
    } catch (error) {
      toast.error('Failed to fetch submissions');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-20">
        <Code2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Submissions Yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't submitted any coding problems.</p>
        <button 
          onClick={() => navigate('/coding')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Start Practicing
        </button>
      </div>
    );
  }

  const percentage = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Submissions</h1>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Success Rate</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stats.solved} out of {stats.total} attempted</div>
          </div>
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
              <circle className="text-gray-100 dark:text-gray-700 stroke-current" strokeWidth="4" cx="25" cy="25" r="20" fill="transparent" />
              <circle 
                className="text-orange-500 stroke-current drop-shadow-md transition-all duration-1000 ease-out" 
                strokeWidth="4" 
                strokeLinecap="round" 
                cx="25" cy="25" r="20" fill="transparent" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{percentage}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-[calc(100vh-200px)] flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200">History</h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
            {submissions.map(sub => (
              <button 
                key={sub._id}
                onClick={() => setSelectedSub(sub)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedSub?._id === sub._id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white truncate pr-2">{sub.problem?.title || 'Unknown Problem'}</span>
                  {sub.status === 'solved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="capitalize">{sub.language}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(sub.lastSubmittedAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Code View */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-[calc(100vh-200px)] flex flex-col">
          {selectedSub ? (
            <>
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{selectedSub.problem?.title}</h2>
                  <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span><strong className="text-gray-700 dark:text-gray-300">Status:</strong> <span className={selectedSub.status === 'solved' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>{selectedSub.status === 'solved' ? 'Accepted' : 'Attempted'}</span></span>
                    <span><strong className="text-gray-700 dark:text-gray-300">Language:</strong> {selectedSub.language}</span>
                    <span><strong className="text-gray-700 dark:text-gray-300">Attempts:</strong> {selectedSub.attempts}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/coding/workspace?topic=${selectedSub.problem?.topic}`)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                >
                  Solve Again
                </button>
              </div>
              <div className="flex-1 p-4 bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={selectedSub.language}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-dark'}
                  value={selectedSub.code}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 }
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <Code2 className="w-12 h-12 mb-3 opacity-20" />
              <p>Select a submission to view the code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
