import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 z-50 relative">
      <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center h-14">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img src="/logo.png" alt="AIQuizMaster Logo" className="w-12 h-12 object-contain" />
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">AIQuizMaster</span>
        </Link>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 font-medium">Dashboard</Link>
              <Link to="/coding/workspace" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 font-medium">Coding Practice</Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 font-medium">Login</Link>
              <Link to="/signup" className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
