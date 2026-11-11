import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import UsersPage from './pages/Users';
import UserDetails from './pages/UserDetails';
import CrisisPage from './pages/Crisis';
import SystemInsights from './pages/SystemInsights';
import LogsPage from './pages/Logs';
import SettingsPage from './pages/Settings';
import EmailBroadcast from './pages/EmailBroadcast';
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

  if (!token || path === '/login') {
    return <Login />;
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
      case '/broadcast':
        return <EmailBroadcast />;
      case '/settings':
        return <SettingsPage user={user} onUpdateUser={setUser} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 h-16 flex items-center px-6 md:px-8 sticky top-0 z-30 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-black text-sm">
            M
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            MMUST<span className="text-blue-600">Care</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'Administrator'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/50">
                  {user?.role || 'admin'}
                </span>
              </div>
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
