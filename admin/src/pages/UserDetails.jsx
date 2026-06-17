import React, { useEffect, useState } from 'react';
import { getUserDetails } from '../services/api';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Shield, 
  Activity, 
  MessageSquare, 
  Book, 
  Brain,
  Zap,
  Clock,
  User as UserIcon
} from 'lucide-react';

const UserDetails = ({ userId, onBack }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getUserDetails(userId);
        setUserData(data);
      } catch (err) {
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );

  if (error || !userData) return (
    <div className="p-8 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-xl inline-block">
        {error || "User not found"}
      </div>
      <button onClick={onBack} className="block mx-auto mt-4 text-primary font-bold">Go Back</button>
    </div>
  );

  const { stats, assessments, journals, chats, reflections } = userData;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold"
        >
          <ArrowLeft size={20} />
          Back to User Management
        </button>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${userData.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
            {userData.role}
          </span>
          {userData.is_anonymous && (
            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-black uppercase tracking-widest border border-slate-200">
              Guest Account
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
            <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-6 ${userData.is_anonymous ? 'bg-slate-400' : 'bg-primary'}`}>
              {userData.name[0].toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{userData.name}</h2>
            <p className="text-slate-500 mt-1 flex items-center justify-center gap-2">
              <Mail size={14} /> {userData.email || 'Anonymous Guest'}
            </p>
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-center gap-6 text-xs font-bold text-slate-400">
              <div className="flex flex-col items-center gap-1">
                <Calendar size={16} />
                <span>Joined {new Date(userData.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Assessments" value={stats.total_assessments} icon={<Activity className="text-blue-500" />} />
            <StatCard label="Max Streak" value={`${stats.max_streak} Days`} icon={<Zap className="text-orange-500" />} />
            <StatCard label="Journals" value={stats.total_journals} icon={<Book className="text-emerald-500" />} />
            <StatCard label="Reflections" value={stats.total_reflections} icon={<Brain className="text-purple-500" />} />
          </div>

          {/* Onboarding Summary */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Initial Assessment</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold">{userData.onboarding_total_score || 0}</div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mt-1">Global Severity Score</div>
                </div>
                <RiskBadge level={userData.onboarding_risk_level} />
              </div>
              
              {userData.onboarding_answers && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  {JSON.parse(JSON.stringify(userData.onboarding_answers)).slice(0, 3).map((ans, i) => (
                    <div key={i} className="text-xs">
                      <div className="text-slate-500 mb-1">{ans.question}</div>
                      <div className="font-bold text-slate-200">{ans.answer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Daily Check-ins */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Activity className="text-blue-500" size={20} />
                Daily Well-being Check-ins
              </h3>
              <span className="text-xs font-bold text-slate-400">{assessments.length} Records</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Stress</th>
                    <th className="px-6 py-4">Main Challenge</th>
                    <th className="px-6 py-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {assessments.map((item, i) => (
                    <tr key={i} className="text-sm hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {new Date(item.assessment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${getStressColor(item.stress_level)}`}>
                          {item.stress_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">
                        {item.main_challenge}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-400">
                        {item.total_score}
                      </td>
                    </tr>
                  ))}
                  {assessments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">No check-ins yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Journals & Chats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Book className="text-emerald-500" size={20} />
                Recent Journals
              </h3>
              <div className="space-y-4">
                {journals.slice(0, 5).map((j, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="font-bold text-slate-800 text-sm">{j.title || 'Untitled Entry'}</div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>{new Date(j.created_at).toLocaleDateString()}</span>
                      <span className="text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-50">{j.mood}</span>
                    </div>
                  </div>
                ))}
                {journals.length === 0 && <p className="text-center py-8 text-slate-400 italic text-sm">No journals written</p>}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                <MessageSquare className="text-primary" size={20} />
                Chat History
              </h3>
              <div className="space-y-4">
                {chats.slice(0, 5).map((c, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 text-sm capitalize">{c.topic}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                        {new Date(c.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <ArrowLeft className="text-slate-200 rotate-180" size={16} />
                  </div>
                ))}
                {chats.length === 0 && <p className="text-center py-8 text-slate-400 italic text-sm">No chat sessions</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-slate-50 rounded-lg">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <div className="text-lg font-bold text-slate-800">{value}</div>
    </div>
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
  </div>
);

const RiskBadge = ({ level }) => {
  const configs = {
    'High': 'bg-red-500 text-white',
    'Moderate': 'bg-orange-500 text-white',
    'Mild': 'bg-amber-500 text-white',
    'Low': 'bg-green-500 text-white',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${configs[level] || 'bg-slate-700 text-slate-300'}`}>
      {level || 'None'}
    </span>
  );
};

const getStressColor = (level) => {
  const l = String(level).toLowerCase();
  if (l.includes('high') || l.includes('very')) return 'text-red-500';
  if (l.includes('moderate')) return 'text-orange-500';
  return 'text-green-500';
};

export default UserDetails;
