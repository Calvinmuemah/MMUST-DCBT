import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  AlertCircle, 
  Settings, 
  LogOut,
  Terminal,
  BarChart3
} from 'lucide-react';
import { logout } from '../services/api';

const Sidebar = ({ currentPath, setPath }) => {
  const menuItems = [
    { id: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: '/insights', label: 'System Insights', icon: <BarChart3 size={20} /> },
    { id: '/users', label: 'Students', icon: <Users size={20} /> },
    { id: '/crisis', label: 'High Risk', icon: <AlertCircle size={20} /> },
    { id: '/logs', label: 'System Logs', icon: <Terminal size={20} /> },
    { id: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-64px)] sticky top-16">
      <div className="p-4 flex-1">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setPath(item.id);
                window.history.pushState({}, '', item.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                currentPath === item.id 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
