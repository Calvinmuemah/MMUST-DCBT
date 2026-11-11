import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  Settings, 
  LogOut,
  Terminal,
  BarChart3,
  ShieldAlert,
  Mail
} from 'lucide-react';
import { logout } from '../services/api';

const Sidebar = ({ currentPath, setPath }) => {
  const menuItems = [
    { 
      id: '/', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      color: 'text-blue-600',
      activeBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
      activeIconBg: 'bg-blue-600 text-white'
    },
    { 
      id: '/insights', 
      label: 'System Insights', 
      icon: BarChart3,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      activeIconBg: 'bg-emerald-600 text-white'
    },
    { 
      id: '/users', 
      label: 'Students & Users', 
      icon: Users,
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      activeIconBg: 'bg-indigo-600 text-white'
    },
    { 
      id: '/crisis', 
      label: 'High-Risk Alert', 
      icon: AlertTriangle,
      color: 'text-rose-600',
      activeBg: 'bg-rose-50 text-rose-800 border-rose-200/80',
      activeIconBg: 'bg-rose-600 text-white',
      badge: 'URGENT'
    },
    { 
      id: '/logs', 
      label: 'System Logs', 
      icon: Terminal,
      color: 'text-violet-600',
      activeBg: 'bg-violet-50 text-violet-800 border-violet-200/80',
      activeIconBg: 'bg-violet-600 text-white'
    },
    { 
      id: '/broadcast', 
      label: 'Email Broadcast', 
      icon: Mail,
      color: 'text-blue-600',
      activeBg: 'bg-blue-50 text-blue-800 border-blue-200/80',
      activeIconBg: 'bg-blue-600 text-white'
    },
    { 
      id: '/settings', 
      label: 'Settings', 
      icon: Settings,
      color: 'text-slate-600',
      activeBg: 'bg-slate-100 text-slate-800 border-slate-300/80',
      activeIconBg: 'bg-slate-700 text-white'
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-[calc(100vh-64px)] sticky top-16 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Navigation Label */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Navigation</span>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPath(item.id);
                  window.history.pushState({}, '', item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border ${
                  isActive 
                    ? `${item.activeBg} shadow-sm font-bold` 
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive 
                      ? `${item.activeIconBg} shadow-sm` 
                      : `bg-slate-100/80 ${item.color} group-hover:bg-white`
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase bg-rose-100 text-rose-700 animate-pulse border border-rose-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>


      {/* Logout Action */}
      <div className="p-3 border-t border-slate-100">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-transparent hover:border-rose-200"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <LogOut size={16} />
          </div>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
