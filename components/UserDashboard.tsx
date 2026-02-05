import React from 'react';
import { Trophy, Calendar, Clock, TrendingUp, BookOpen, Play, BarChart3, Award, Target, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserDashboardProps {
  onStartNewQuiz: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onStartNewQuiz }) => {
  const { user, quizHistory } = useAuth();

  if (!user) return null;

  // Calculate stats from real quiz history
  const totalQuizzes = quizHistory.length;
  const totalQuestions = quizHistory.reduce((sum, quiz) => sum + quiz.total, 0);
  const totalCorrect = quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
  const averageScore = totalQuizzes > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalTimeSpent = quizHistory.reduce((sum, quiz) => sum + quiz.timeSpent, 0);
  
  // Calculate performance metrics
  const recentQuizzes = quizHistory.slice(0, 5);
  const recentAverage = recentQuizzes.length > 0 
    ? Math.round((recentQuizzes.reduce((sum, q) => sum + q.percentage, 0) / recentQuizzes.length)) 
    : 0;
  
  // Calculate consistency (how close scores are to each other)
  const consistencyScore = quizHistory.length > 1
    ? Math.round(100 - (quizHistory.reduce((sum, quiz, idx, arr) => {
        if (idx === 0) return 0;
        return sum + Math.abs(quiz.percentage - arr[idx - 1].percentage);
      }, 0) / (quizHistory.length - 1)))
    : 0;
  
  // Calculate improvement trend
  const oldAverage = quizHistory.slice(-3).length > 0
    ? quizHistory.slice(-3).reduce((sum, q) => sum + q.percentage, 0) / quizHistory.slice(-3).length
    : 0;
  const newAverage = recentQuizzes.slice(0, 3).length > 0
    ? recentQuizzes.slice(0, 3).reduce((sum, q) => sum + q.percentage, 0) / recentQuizzes.slice(0, 3).length
    : 0;
  const improvementScore = quizHistory.length > 3
    ? Math.min(100, Math.max(0, Math.round(50 + (newAverage - oldAverage))))
    : recentAverage;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-50';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50';
    if (percentage >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/20 shadow-xl"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
                <p className="text-slate-300 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member since {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <button
              onClick={onStartNewQuiz}
              className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Create New Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Quizzes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{totalQuizzes}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Total Quizzes</h3>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{averageScore}%</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Average Score</h3>
          </div>

          {/* Questions Answered */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{totalQuestions}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Questions Answered</h3>
          </div>

          {/* Time Spent */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{Math.floor(totalTimeSpent / 60)}m</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Total Time</h3>
          </div>
        </div>

        {/* Recent Activity & Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quiz History */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-slate-400 mr-2" />
                  <h2 className="text-xl font-bold text-slate-900">Recent Quizzes</h2>
                </div>
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {quizHistory.length > 0 ? (
                quizHistory.map((quiz) => (
                  <div key={quiz.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{quiz.title}</h3>
                        <div className="flex items-center text-xs text-slate-500 space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {new Date(quiz.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {formatTime(quiz.timeSpent)}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${getScoreColor(quiz.percentage)}`}>
                        {quiz.percentage}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-emerald-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {quiz.score} Correct
                        </div>
                        <div className="flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          {quiz.total - quiz.score} Wrong
                        </div>
                      </div>
                      <button className="text-xs text-slate-500 hover:text-emerald-600 font-medium">
                        Review →
                      </button>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${quiz.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Quizzes Yet</h3>
                  <p className="text-slate-500 mb-6">Start your learning journey by creating your first quiz!</p>
                  <button
                    onClick={onStartNewQuiz}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Create First Quiz
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats & Achievements */}
          <div className="space-y-6">
            {/* Performance Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                <h3 className="font-bold text-slate-900">Performance</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Accuracy</span>
                    <span className="font-semibold text-slate-900">{averageScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${averageScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Consistency</span>
                    <span className="font-semibold text-slate-900">{Math.max(0, consistencyScore)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all" 
                      style={{ width: `${Math.max(0, consistencyScore)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Improvement</span>
                    <span className="font-semibold text-slate-900">{improvementScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all" 
                      style={{ width: `${improvementScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center mb-4">
                <Award className="w-5 h-5 mr-2" />
                <h3 className="font-bold">Achievements</h3>
              </div>
              <div className="space-y-3">
                {/* Quiz Master - Unlocked if 3+ quizzes */}
                <div className={`flex items-center bg-white/20 rounded-lg p-3 ${totalQuizzes < 3 ? 'opacity-50' : ''}`}>
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center mr-3">
                    🏆
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Quiz Master</p>
                    <p className="text-xs opacity-90">
                      {totalQuizzes >= 3 ? `Completed ${totalQuizzes} quizzes` : `${3 - totalQuizzes} more to unlock`}
                    </p>
                  </div>
                </div>
                
                {/* Accuracy Expert - Unlocked if avg score >= 80% */}
                <div className={`flex items-center bg-white/20 rounded-lg p-3 ${averageScore < 80 ? 'opacity-50' : ''}`}>
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center mr-3">
                    🎯
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Accuracy Expert</p>
                    <p className="text-xs opacity-90">
                      {averageScore >= 80 ? `${averageScore}% average score` : `Need ${80 - averageScore}% more`}
                    </p>
                  </div>
                </div>
                
                {/* First Quiz - Unlocked if at least 1 quiz */}
                <div className={`flex items-center bg-white/20 rounded-lg p-3 ${totalQuizzes < 1 ? 'opacity-50' : ''}`}>
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center mr-3">
                    ✨
                  </div>
                  <div>
                    <p className="font-semibold text-sm">First Steps</p>
                    <p className="text-xs opacity-90">
                      {totalQuizzes >= 1 ? 'Completed first quiz!' : 'Complete your first quiz'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-900 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Ready for Your Next Challenge?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Keep the momentum going! Create a new quiz and continue improving your knowledge.
          </p>
          <button
            onClick={onStartNewQuiz}
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center"
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Start New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
