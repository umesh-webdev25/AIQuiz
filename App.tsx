import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import UserDashboard from './components/UserDashboard';
import SetupScreen from './components/SetupScreen';
import QuizPlayer from './components/QuizPlayer';
import { AppState, PageState, QuizConfig, QuizData } from './types';
import { generateQuizFromFile, generateQuizFromText } from './services/geminiService';
import { useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, addQuizToHistory, isLoading } = useAuth();
  const [pageState, setPageState] = useState<PageState>(PageState.HOME);
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [config, setConfig] = useState<QuizConfig>({
    numQuestions: 5,
    timePerQuestion: 30
  });
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleGenerateQuiz = async () => {
    if (inputMode === 'file' && !selectedFile) return;
    if (inputMode === 'text' && textInput.length < 50) return;

    setAppState(AppState.GENERATING);
    setError(null);

    try {
      let data: QuizData;

      if (inputMode === 'file' && selectedFile) {
        data = await generateQuizFromFile(selectedFile, config.numQuestions);
      } else {
        data = await generateQuizFromText(textInput, config.numQuestions);
      }

      setQuizData(data);
      setAppState(AppState.PLAYING);
      setQuizStartTime(Date.now());
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz. Please ensure you have a valid input and API key.");
      setAppState(AppState.SETUP);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (quizData && isAuthenticated) {
      const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
      const percentage = Math.round((score / total) * 100);

      const quizHistoryItem = {
        id: Date.now().toString(),
        title: quizData.title,
        score: score,
        total: total,
        date: new Date().toISOString().split('T')[0],
        timeSpent: timeSpent,
        percentage: percentage
      };

      addQuizToHistory(quizHistoryItem);
    }
  };

  const handleExit = () => {
    setQuizData(null);
    setAppState(AppState.SETUP);
    setSelectedFile(null);
    setTextInput("");
    setError(null);
    if (isAuthenticated) {
      setPageState(PageState.DASHBOARD);
    } else {
      setPageState(PageState.HOME);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setPageState(PageState.QUIZ);
      setAppState(AppState.SETUP);
    } else {
      setPageState(PageState.AUTH);
    }
  };

  const handleAuthSuccess = () => {
    setPageState(PageState.DASHBOARD);
  };

  const handleStartNewQuiz = () => {
    setPageState(PageState.QUIZ);
    setAppState(AppState.SETUP);
  };

  const handleNavigateHome = () => {
    setPageState(PageState.HOME);
  };

  const handleNavigateDashboard = () => {
    if (isAuthenticated) {
      setPageState(PageState.DASHBOARD);
    }
  };

  const handleLogin = () => {
    setPageState(PageState.AUTH);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Conditionally render header based on page state */}
      {pageState !== PageState.HOME && pageState !== PageState.AUTH && (
        <Header
          onNavigateHome={handleNavigateHome}
          onNavigateDashboard={handleNavigateDashboard}
          onStartNewQuiz={handleStartNewQuiz}
        />
      )}

      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Error Toast */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down flex items-center">
            <span className="font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-4 opacity-80 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* Home Page */}
        {pageState === PageState.HOME && (
          <HomePage
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
          />
        )}

        {/* Auth Page */}
        {pageState === PageState.AUTH && (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
            onBackToHome={handleNavigateHome}
          />
        )}

        {/* Dashboard */}
        {pageState === PageState.DASHBOARD && (
          isAuthenticated ? (
            <UserDashboard onStartNewQuiz={handleStartNewQuiz} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-600 mb-4">Please log in to access your dashboard</p>
                <button
                  onClick={() => setPageState(PageState.AUTH)}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )
        )}

        {/* Quiz Flow */}
        {pageState === PageState.QUIZ && (
          <>
            {appState === AppState.SETUP || appState === AppState.GENERATING ? (
              <SetupScreen
                config={config}
                setConfig={setConfig}
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
                textInput={textInput}
                setTextInput={setTextInput}
                inputMode={inputMode}
                setInputMode={setInputMode}
                onGenerate={handleGenerateQuiz}
                isGenerating={appState === AppState.GENERATING}
              />
            ) : null}

            {appState === AppState.PLAYING && quizData ? (
              <QuizPlayer
                quizData={quizData}
                timePerQuestion={config.timePerQuestion}
                onExit={handleExit}
                onQuizComplete={handleQuizComplete}
              />
            ) : null}
          </>
        )}

        {/* Fallback for any undefined state */}
        {pageState !== PageState.HOME &&
          pageState !== PageState.AUTH &&
          pageState !== PageState.DASHBOARD &&
          pageState !== PageState.QUIZ && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-600 mb-4">Something went wrong. Let's get you back on track.</p>
                <button
                  onClick={() => setPageState(isAuthenticated ? PageState.DASHBOARD : PageState.HOME)}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Go to Home'}
                </button>
              </div>
            </div>
          )}
      </main>

      {/* CSS for generic animations used in components */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;