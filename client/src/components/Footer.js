import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Heart, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass border-t border-white/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg">
                <Code className="w-5 h-5 text-slate-200" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
                Fragment
              </span>
            </Link>
            <p className="text-slate-300 mb-4 max-w-md">
              Share code snippets and images instantly with your team. 
              Perfect for corporate environments and collaboration.
            </p>
            <div className="flex items-center space-x-2 text-slate-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-slate-400 fill-current" />
              <span>for developers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Create Code
                </Link>
              </li>
              <li>
                <Link
                  to="/upload-image"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Upload Image
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Code Sharing</li>
              <li>• Image Upload</li>
              <li>• Syntax Highlighting</li>
              <li>• Corporate Safe</li>
              <li>• Mobile Responsive</li>
              <li>• No Registration</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            © 2024 Fragment. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Virendra-94"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 