import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/api';
import { User, UserMinus, ShieldCheck, Mail, Calendar, Search, Eye, UserCog, GraduationCap } from 'lucide-react';

const UsersPage = ({ onView }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, normal, anonymous
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
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
    } else {
      console.log("Viewing user:", user);
      alert(`Viewing details for ${user.name}. Detailed profile view is being implemented.`);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesFilter = filter === 'anonymous' ? u.is_anonymous : filter === 'normal' ? !u.is_anonymous : true;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || (u.email && u.email.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
    </div>
  );

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm">Manage user accounts and view their mental health profiles.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
            />
          </div>

          <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
            <FilterBtn active={filter === 'all'} label="All" onClick={() => setFilter('all')} />
            <FilterBtn active={filter === 'normal'} label="Registered" onClick={() => setFilter('normal')} />
            <FilterBtn active={filter === 'anonymous'} label="Anonymous" onClick={() => setFilter('anonymous')} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Session Type</th>
                <th className="px-6 py-4">Risk Profile</th>
                <th className="px-6 py-4">Onboarding</th>
                <th className="px-6 py-4">Registration Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${user.is_anonymous ? 'bg-slate-400' : 'bg-primary'}`}>
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email || 'Guest User'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
                        <UserCog className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-100">
                        <GraduationCap className="w-3 h-3" /> Student
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_anonymous ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        <UserMinus className="w-3 h-3" /> Guest
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                        <ShieldCheck className="w-3 h-3" /> Registered
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge level={user.onboarding_risk_level} />
                  </td>
                  <td className="px-6 py-4">
                    {user.onboarding_completed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-300">Not Started</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleView(user)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 italic">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FilterBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    {label}
  </button>
);

const RiskBadge = ({ level }) => {
  const configs = {
    'High': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    'Moderate': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
    'Mild': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    'Low': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
  };
  const config = configs[level] || { bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-100' };
  
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
      {level || 'None'}
    </span>
  );
};

export default UsersPage;
