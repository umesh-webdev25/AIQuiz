import { Link } from 'react-router-dom';
import { Sparkles, Brain, Trophy, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 w-full max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 font-medium text-sm mb-6 border border-orange-100">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Google Gemini API</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Master Any Subject with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-600">AI-Generated</span> Quizzes
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Challenge yourself on any topic imaginable. Our advanced AI creates custom multiple-choice questions instantly, tailored to your chosen difficulty level.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
            Login to Dashboard
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 w-full">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Any Topic You Want</h3>
            <p className="text-gray-600 leading-relaxed">From Quantum Physics to Pop Culture, just type what you want to learn and our AI builds a unique quiz in seconds.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Adjustable Difficulty</h3>
            <p className="text-gray-600 leading-relaxed">Choose between Easy, Medium, or Hard. The AI adapts the depth and complexity of the questions to match your level.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Progress</h3>
            <p className="text-gray-600 leading-relaxed">Keep a history of all your past quizzes. Review your correct and incorrect answers to continuously improve your knowledge.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
