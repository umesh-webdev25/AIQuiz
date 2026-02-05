import React from 'react';
import { BookOpen, Sparkles, Target, Clock, Award, Zap, ArrowRight, CheckCircle } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-6xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600 mr-2" />
            <span className="text-sm font-medium text-emerald-700">AI-Powered Learning Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Transform Any Content Into
            <span className="text-emerald-500 block mt-2">Interactive Quizzes</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload PDFs or paste text, and let AI generate engaging quizzes instantly. 
            Test your knowledge, track progress, and master any subject.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-105 flex items-center"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 transition-all hover:border-emerald-300"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="mt-16 max-w-5xl mx-auto relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-4 py-3 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="p-8 bg-gradient-to-br from-slate-50 to-white min-h-[300px] flex items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="bg-white p-6 rounded-xl border-2 border-emerald-200 shadow-lg transform hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Upload Content</h3>
                  <p className="text-sm text-slate-600">PDF, text files, or paste directly</p>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-purple-200 shadow-lg transform hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">AI Generation</h3>
                  <p className="text-sm text-slate-600">Smart questions in seconds</p>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Take Quiz</h3>
                  <p className="text-sm text-slate-600">Interactive learning experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose AIQuiz?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to accelerate your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Quiz Generation</h3>
              <p className="text-slate-600">
                AI analyzes your content and creates relevant questions in seconds, saving hours of manual work.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Adaptive Difficulty</h3>
              <p className="text-slate-600">
                Questions tailored to test real understanding, not just memorization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Timed Challenges</h3>
              <p className="text-slate-600">
                Practice under pressure with customizable time limits for each question.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Detailed Analytics</h3>
              <p className="text-slate-600">
                Track your progress with comprehensive performance insights and improvement areas.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Tutor (Master)</h3>
              <p className="text-slate-600">
                Get personalized explanations and insights from our AI mentor after each quiz.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Format Support</h3>
              <p className="text-slate-600">
                Upload PDFs, text files, or paste content directly - we handle it all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Three simple steps to smarter learning
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Your Content</h3>
                <p className="text-slate-600 text-lg">
                  Drag and drop a PDF or text file, or simply paste your study material. AIQuiz supports documents up to 20MB.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-purple-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Customize Your Quiz</h3>
                <p className="text-slate-600 text-lg">
                  Choose the number of questions (3-50) and set time limits (10-120 seconds per question) based on your preference.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Learn & Track Progress</h3>
                <p className="text-slate-600 text-lg">
                  Take your quiz, get instant feedback with explanations, and consult with Master AI for deeper understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Join thousands of learners who are accelerating their knowledge with AI-powered quizzes.
          </p>
          <button
            onClick={onGetStarted}
            className="group px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center"
          >
            Start Learning Now
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-6 text-slate-400 text-sm">
            No credit card required • Free to start • Unlimited quizzes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-slate-950 text-slate-400 text-center border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-5 h-5 text-emerald-500 mr-2" />
            <span className="font-bold text-white">AIQuiz</span>
          </div>
          <p className="text-sm">
            © 2025 AIQuiz. Powered by AI. Built for learners.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
