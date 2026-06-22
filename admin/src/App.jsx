import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UsersPage from './pages/Users';
import UserDetails from './pages/UserDetails';
import CrisisPage from './pages/Crisis';
import SystemInsights from './pages/SystemInsights';
import LogsPage from './pages/Logs';
import SettingsPage from './pages/Settings';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { logout, getProfile } from './services/api';

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);
  
  const token = localStorage.getItem('admin_token');
  
  useEffect(() => {
    const initUser = async () => {
      if (!token) {
        setFetchingUser(false);
        return;
      }

      // Try local storage first
      try {
        const savedUser = localStorage.getItem('admin_user');
        if (savedUser && savedUser !== 'undefined') {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Failed to parse user from storage", e);
      }

      // Always fetch fresh from server to be safe
      try {
        const freshUser = await getProfile();
        setUser(freshUser);
        localStorage.setItem('admin_user', JSON.stringify(freshUser));
      } catch (e) {
        if (e.response?.status === 401) {
          logout();
        }
      } finally {
        setFetchingUser(false);
      }
    };

    initUser();
  }, [token]);
  
  // Update state when URL changes (for browser back/forward)
  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (!token && path !== '/register') {
    return <Login />;
  }

  if (path === '/login') {
    return <Login />;
  }

  if (path === '/register') {
    return <Register />;
  }

  if (fetchingUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navigate = (newPath) => {
    setPath(newPath);
    window.history.pushState({}, '', newPath);
  };

  const renderContent = () => {
    if (path.startsWith('/users/')) {
      const userId = path.split('/')[2];
      return <UserDetails userId={userId} onBack={() => navigate('/users')} />;
    }

    switch (path) {
      case '/':
        return <Dashboard />;
      case '/users':
        return <UsersPage onView={(id) => navigate(`/users/${id}`)} />;
      case '/crisis':
        return <CrisisPage onViewUser={(id) => navigate(`/users/${id}`)} />;
      case '/insights':
        return <SystemInsights />;
      case '/logs':
        return <LogsPage />;
      case '/settings':
        return <SettingsPage user={user} onUpdateUser={setUser} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 sticky top-0 z-20 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">MMUSTCare</span> 
            <span className="text-slate-300 font-light">|</span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200/60 shadow-sm">Admin</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-left">
            <div className="relative">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary font-black uppercase shadow-sm">
                {user?.name?.[0]}
              </div>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-400 font-medium capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar currentPath={path} setPath={setPath} />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            {renderContent()}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
