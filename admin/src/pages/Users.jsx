import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/api';
import { User, UserMinus, ShieldCheck, Mail, Calendar } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, normal, anonymous

  useEffect(() => {
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
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    if (filter === 'anonymous') return u.is_anonymous;
    if (filter === 'normal') return !u.is_anonymous;
    return true;
  });

  if (loading) return <div className="p-8">Loading users...</div>;

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
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-dark">User Management</h1>
        <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
          <FilterBtn active={filter === 'all'} label="All" onClick={() => setFilter('all')} />
          <FilterBtn active={filter === 'normal'} label="Registered" onClick={() => setFilter('normal')} />
          <FilterBtn active={filter === 'anonymous'} label="Anonymous" onClick={() => setFilter('anonymous')} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-sm">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Risk Level</th>
              <th className="px-6 py-4">Onboarding</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${user.is_anonymous ? 'bg-slate-400' : 'bg-primary'}`}>
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-text-dark">{user.name}</div>
                      <div className="text-xs text-text-light flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email || 'No email (Guest)'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.is_anonymous ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      <UserMinus className="w-3 h-3" /> Anonymous
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                      <ShieldCheck className="w-3 h-3" /> Registered
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <RiskBadge level={user.onboarding_risk_level} />
                </td>
                <td className="px-6 py-4">
                  {user.onboarding_completed ? (
                    <span className="text-xs font-bold text-green-600">Completed</span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-text-light flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FilterBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    {label}
  </button>
);

const RiskBadge = ({ level }) => {
  const colors = {
    'High': 'bg-red-50 text-red-600 border-red-100',
    'Moderate': 'bg-orange-50 text-orange-600 border-orange-100',
    'Mild': 'bg-yellow-50 text-yellow-600 border-yellow-100',
    'Low': 'bg-green-50 text-green-600 border-green-100',
  };
  const colorClass = colors[level] || 'bg-slate-50 text-slate-600 border-slate-100';
  
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorClass}`}>
      {level || 'Unknown'}
    </span>
  );
};

export default UsersPage;
