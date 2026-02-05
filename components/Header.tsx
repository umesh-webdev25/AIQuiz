import React, { useState } from 'react';
import { BookOpen, User, LogOut, LayoutDashboard, Plus, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onStartNewQuiz: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigateDashboard, onStartNewQuiz }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    onNavigateHome();
  };

  return (
    <header className="w-full py-4 px-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <button 
        onClick={onNavigateHome}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <div className="bg-emerald-500 p-1.5 rounded-lg">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">AIQuiz</span>
      </button>

      {/* Desktop Navigation */}
      {isAuthenticated && (
        <nav className="hidden md:flex items-center space-x-2">
          <button
            onClick={onNavigateDashboard}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={onStartNewQuiz}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Quiz
          </button>
        </nav>
      )}

      {/* User Menu (Desktop) */}
      {isAuthenticated && user ? (
        <div className="hidden md:block relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-emerald-500"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-fade-in">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button
                onClick={onNavigateDashboard}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 mr-3 text-slate-400" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  // Profile functionality can be added later
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
              >
                <User className="w-4 h-4 mr-3 text-slate-400" />
                Profile Settings
              </button>
              <div className="border-t border-slate-100 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <a 
          href="#"
          className="hidden md:block text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          Documentation
        </a>
      )}

      {/* Mobile Menu Button */}
      {isAuthenticated && (
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && isAuthenticated && user && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg animate-fade-in">
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-emerald-500"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
          <nav className="py-2">
            <button
              onClick={() => {
                onNavigateDashboard();
                setShowMobileMenu(false);
              }}
              className="w-full px-6 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
            >
              <LayoutDashboard className="w-5 h-5 mr-3 text-slate-400" />
              Dashboard
            </button>
            <button
              onClick={() => {
                onStartNewQuiz();
                setShowMobileMenu(false);
              }}
              className="w-full px-6 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
            >
              <Plus className="w-5 h-5 mr-3 text-slate-400" />
              New Quiz
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                // Profile functionality
              }}
              className="w-full px-6 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
            >
              <User className="w-5 h-5 mr-3 text-slate-400" />
              Profile Settings
            </button>
            <div className="border-t border-slate-100 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;