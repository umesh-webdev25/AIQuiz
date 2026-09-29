import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import CodingPractice from './pages/CodingPractice';
import CodingWorkspace from './pages/CodingWorkspace';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/coding" element={<CodingPractice />} />
            <Route path="/coding/workspace" element={<CodingWorkspace />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
      <Chatbot />
    </div>
  );
}

export default App;
