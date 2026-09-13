import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/AppRoutes';

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/ngo/login' || location.pathname === '/ngo-portal';
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin');

  if (isAuthPage || isAdminPage) {
    return <AppRoutes />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm border-t border-slate-800">
        &copy; {new Date().getFullYear()} ShareMeal Food Donation Platform. All rights reserved.
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
};

export default App;
