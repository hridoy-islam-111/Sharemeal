import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Top Navigation Bar Component
 */
export const Navbar = () => {
  const { user, logout } = useAuth();

  // TODO: Add mobile navigation drawer and active link styling
  return (
    <nav className="bg-emerald-600 text-white shadow-lg py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold tracking-tight">
        ShareMeal
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/donate" className="hover:underline">Donate Food</Link>
        <Link to="/find-food" className="hover:underline">Find Food</Link>
        <Link to="/how-it-works" className="hover:underline">How It Works</Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <Link to={`/${user.role}/dashboard`} className="font-semibold underline">
              Dashboard ({user.role})
            </Link>
            <button onClick={logout} className="bg-emerald-700 px-3 py-1.5 rounded text-sm hover:bg-emerald-800">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800">
              Login
            </Link>
            <Link to="/signup" className="px-3 py-1.5 rounded bg-white text-emerald-700 font-semibold">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
