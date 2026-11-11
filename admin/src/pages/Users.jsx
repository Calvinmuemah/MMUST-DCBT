import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/api';
import { 
  User, 
  UserMinus, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  Search, 
  Eye, 
  UserCog, 
  GraduationCap,
  AlertTriangle,
  RefreshCw,
  Filter
} from 'lucide-react';

const AVATAR_PALETTES = [
  'bg-blue-600 text-white',
  'bg-indigo-600 text-white',
  'bg-emerald-600 text-white',
  'bg-purple-600 text-white',
  'bg-teal-600 text-white',
  'bg-amber-600 text-white',
];

const getAvatarColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
};

const UsersPage = ({ onView }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, normal, anonymous, high-risk
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      setError("Seems you're offline. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (user) => {
    if (onView) {
      onView(user.id);
    }
  };

  const registeredCount = users.filter(u => !u.is_anonymous).length;
  const anonCount = users.filter(u => u.is_anonymous).length;
  const highRiskCount = users.filter(u => String(u.onboarding_risk_level || '').toLowerCase().includes('high')).length;

  const filteredUsers = users.filter(u => {
    let matchesFilter = true;
    if (filter === 'anonymous') matchesFilter = u.is_anonymous;
    if (filter === 'normal') matchesFilter = !u.is_anonymous;
    if (filter === 'high-risk') matchesFilter = String(u.onboarding_risk_level || '').toLowerCase().includes('high');

    const term = search.toLowerCase();
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(term)) || 
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term));

    return matchesFilter && matchesSearch;
  });

  if (loading && users.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading Student Records...</p>
    </div>
  );

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-sm">Error Loading Users</h3>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
            <button 
              onClick={fetchUsers} 
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              <RefreshCw size={13} /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Title & Stats Ribbon */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Student & User Management
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Directory of all registered university students, counselors, and guest counseling sessions.
          </p>
        </div>

        {/* Quick summary stats pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            {users.length} Total Accounts
          </span>
          {highRiskCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/70 text-xs font-bold flex items-center gap-1.5 shadow-sm animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              {highRiskCount} High-Risk
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none text-xs font-medium transition-all"
          />
        </div>

        {/* Filter Pills with Counts */}
        <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl self-stretch md:self-auto overflow-x-auto">
          <FilterTab active={filter === 'all'} label="All Students" count={users.length} onClick={() => setFilter('all')} />
          <FilterTab active={filter === 'normal'} label="Registered" count={registeredCount} onClick={() => setFilter('normal')} />
          <FilterTab active={filter === 'anonymous'} label="Anonymous" count={anonCount} onClick={() => setFilter('anonymous')} />
          {highRiskCount > 0 && (
            <FilterTab active={filter === 'high-risk'} label="High Risk" count={highRiskCount} isDanger onClick={() => setFilter('high-risk')} />
          )}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Student Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Session Type</th>
                <th className="px-6 py-4">Clinical Risk</th>
                <th className="px-6 py-4">Intake Status</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/25 transition-colors group">
                  {/* Identity */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm shrink-0 ${getAvatarColor(user.name)}`}>
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate">{user.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                          <Mail size={12} className="shrink-0 text-slate-400" />
                          <span className="truncate">{user.email || 'Anonymous Guest'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-sm">
                        <UserCog size={13} /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/60">
                        <GraduationCap size={13} /> Student
                      </span>
                    )}
                  </td>

                  {/* Session Type */}
                  <td className="px-6 py-4">
                    {user.is_anonymous ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60">
                        <UserMinus size={13} /> Guest
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <ShieldCheck size={13} /> Verified
                      </span>
                    )}
                  </td>

                  {/* Clinical Risk */}
                  <td className="px-6 py-4">
                    <RiskBadge level={user.onboarding_risk_level} />
                  </td>

                  {/* Intake Status */}
                  <td className="px-6 py-4">
                    {user.onboarding_completed ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Completed
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Join Date */}
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar size={13} className="text-slate-400 shrink-0" />
                      <span>{new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleView(user)}
                      className="btn-ghost-primary"
                      title="Inspect Student Record"
                    >
                      <Eye size={13} />
                      <span>View Profile</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs italic">
                    No student records found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredUsers.length} of {users.length} accounts</span>
          <span className="font-semibold text-slate-600">MMUST Counseling Data Layer</span>
        </div>
      </div>
    </div>
  );
};

/* Filter Pill Component */
const FilterTab = ({ active, label, count, isDanger, onClick }) => {
  let activeStyle = 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-bold';
  if (isDanger && active) {
    activeStyle = 'bg-rose-600 text-white shadow-sm shadow-rose-500/20 font-bold';
  }

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
        active 
          ? activeStyle 
          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 font-semibold'
      }`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
          active 
            ? 'bg-white/20 text-white' 
            : 'bg-slate-200/70 text-slate-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

/* Risk Badge with Clear Clinical Contrast */
const RiskBadge = ({ level }) => {
  const norm = String(level || '').toLowerCase();
  
  if (norm.includes('high') || norm.includes('crisis')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/80 shadow-sm animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
        High Risk
      </span>
    );
  }

  if (norm.includes('mod')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Moderate
      </span>
    );
  }

  if (norm.includes('mild')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
        Mild
      </span>
    );
  }

  if (norm.includes('low')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Low Risk
      </span>
    );
  }

  return (
    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
      Unassessed
    </span>
  );
};

export default UsersPage;
