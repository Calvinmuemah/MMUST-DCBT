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
import { logout } from './services/api';

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const token = localStorage.getItem('admin_token');
  const user = JSON.parse(localStorage.getItem('admin_user') || 'null');
  
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
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 sticky top-0 z-20 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            M
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-dark">MMUSTCare <span className="text-primary">Admin</span></h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-sm font-bold text-text-dark">{user?.name}</p>
              <p className="text-xs text-text-light capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold uppercase">
              {user?.name?.[0]}
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
