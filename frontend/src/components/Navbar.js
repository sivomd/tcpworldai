import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                TCPWorld
              </div>
              <span className="text-sm text-gray-400">.ai</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link to="/events" className="hover:text-blue-400 transition-colors">
              Events
            </Link>
            <Link to="/awards" className="hover:text-blue-400 transition-colors">
              Awards
            </Link>
            <Link to="/speakers" className="hover:text-blue-400 transition-colors">
              Speakers
            </Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <Shield size={18} />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md hover:bg-slate-700"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/events"
              className="block px-3 py-2 rounded-md hover:bg-slate-700"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/awards"
              className="block px-3 py-2 rounded-md hover:bg-slate-700"
              onClick={() => setIsOpen(false)}
            >
              Awards
            </Link>
            <Link
              to="/speakers"
              className="block px-3 py-2 rounded-md hover:bg-slate-700"
              onClick={() => setIsOpen(false)}
            >
              Speakers
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md hover:bg-slate-700"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md hover:bg-slate-700"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md hover:bg-slate-700 text-yellow-400"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-slate-700 text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md hover:bg-slate-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;