import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, Image, Home, Plus } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="glass border-b border-white/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Code className="w-5 h-5 text-slate-200" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
              Fragment
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/')
                  ? 'bg-slate-700/50 text-slate-200 shadow-lg'
                  : 'text-slate-300 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/create"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/create')
                  ? 'bg-slate-700/50 text-slate-200 shadow-lg'
                  : 'text-slate-300 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Code</span>
            </Link>
            
            <Link
              to="/upload-image"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/upload-image')
                  ? 'bg-slate-700/50 text-slate-200 shadow-lg'
                  : 'text-slate-300 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Upload Image</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white/80 hover:text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/')
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </div>
            </Link>
            
            <Link
              to="/create"
              className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/create')
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Code</span>
              </div>
            </Link>
            
            <Link
              to="/upload-image"
              className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/upload-image')
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4" />
                <span>Upload Image</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 