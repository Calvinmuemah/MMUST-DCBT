import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Database, 
  Activity, 
  Flame, 
  UserPlus, 
  Layers,
  Server,
  RefreshCw,
  Clock,
  MessageSquare,
  BookOpen,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { getMetrics } from '../services/api';

const SystemInsights = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('30d');

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await getMetrics(range);
      setMetrics(data);
    } catch (err) {
      setError("Unable to load system insights. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [range]);

  if (loading && !metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analyzing System Metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-sm">Error Loading Insights</h3>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
            <button 
              onClick={fetchMetrics} 
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { 
    systemHealth = { users_count: 0, chats_count: 0, messages_count: 0, journals_count: 0, reflections_count: 0, logins_count: 0 }, 
    activityHeatmap = [], 
    streaks = { max_streak: 0, avg_streak: 0 }, 
    referrals = { referred: 0, percentage: 0 } 
  } = metrics || {};

  const tableStats = [
    { 
      name: 'Students', 
      count: systemHealth.users_count, 
      icon: <Layers size={18} />, 
      color: 'blue', 
      desc: 'Total profiles' 
    },
    { 
      name: 'CBT Chats', 
      count: systemHealth.chats_count, 
      icon: <MessageSquare size={18} />, 
      color: 'teal', 
      desc: 'Therapy sessions' 
    },
    { 
      name: 'Messages', 
      count: systemHealth.messages_count, 
      icon: <Database size={18} />, 
      color: 'indigo', 
      desc: 'Conversation turns' 
    },
    { 
      name: 'Journals', 
      count: systemHealth.journals_count, 
      icon: <BookOpen size={18} />, 
      color: 'amber', 
      desc: 'Thought logs' 
    },
    { 
      name: 'Reflections', 
      count: systemHealth.reflections_count, 
      icon: <RefreshCw size={18} />, 
      color: 'purple', 
      desc: 'Cognitive reframes' 
    },
    { 
      name: 'Check-ins', 
      count: systemHealth.logins_count, 
      icon: <Clock size={18} />, 
      color: 'rose', 
      desc: 'Daily assessments' 
    },
  ];

  const colorStyles = {
    blue: { border: 'border-t-4 border-t-blue-500', icon: 'bg-blue-50 text-blue-600 border-blue-200/60' },
    teal: { border: 'border-t-4 border-t-teal-500', icon: 'bg-teal-50 text-teal-600 border-teal-200/60' },
    indigo: { border: 'border-t-4 border-t-indigo-500', icon: 'bg-indigo-50 text-indigo-600 border-indigo-200/60' },
    amber: { border: 'border-t-4 border-t-amber-500', icon: 'bg-amber-50 text-amber-600 border-amber-200/60' },
    purple: { border: 'border-t-4 border-t-purple-500', icon: 'bg-purple-50 text-purple-600 border-purple-200/60' },
    rose: { border: 'border-t-4 border-t-rose-500', icon: 'bg-rose-50 text-rose-600 border-rose-200/60' },
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Telemetry & Insights</h1>
          <p className="text-slate-500 text-sm mt-0.5">Database storage layer volume and hourly platform utilization.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
          {['7d', '14d', '30d', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setRange(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                range === tab 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Database Table Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {tableStats.map((stat) => {
          const style = colorStyles[stat.color] || colorStyles.blue;
          return (
            <div 
              key={stat.name} 
              className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between ${style.border}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${style.icon}`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">DB</span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{parseInt(stat.count || 0).toLocaleString()}</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{stat.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{stat.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Heatmap */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Hourly Campus Activity Curve
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Peak traffic distribution by hour of the day (East Africa Time)</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200/60">
              Peak Traffic
            </span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityHeatmap}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="hour" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(h) => `${h}:00`}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    boxShadow: '0 8px 16px -2px rgba(0, 0, 0, 0.08)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  labelFormatter={(h) => `Campus Hour: ${h}:00`}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#2563EB" 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#2563EB' }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Server Timezone: UTC+3 (Nairobi)</span>
            <span className="font-semibold text-slate-600">Real-time Check-ins</span>
          </div>
        </div>

        {/* Growth & Streak Cards */}
        <div className="flex flex-col gap-6">
          {/* Streak Metrics Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] border-t-4 border-t-amber-500 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center">
                  <Flame size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Consistency Streaks</h3>
                  <p className="text-[11px] text-slate-400">Long-term mental wellness retention</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                Engagement
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/80">
                <div className="text-[10px] text-amber-800 font-black uppercase tracking-wider">Max Record</div>
                <div className="text-3xl font-black text-amber-600 mt-1">{streaks.max_streak || 0}</div>
                <div className="text-[10px] text-amber-700/80 mt-0.5">Consecutive Days</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Campus Avg</div>
                <div className="text-3xl font-black text-slate-800 mt-1">{streaks.avg_streak || 0}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Days per User</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mt-2 pt-2 border-t border-slate-100">
              Measures daily assessment and reflection completion streaks among university students.
            </p>
          </div>

          {/* Referral Growth Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] border-t-4 border-t-emerald-500 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Peer-to-Peer Referrals</h3>
                  <p className="text-[11px] text-slate-400">Organic viral student adoption</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                Organic
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Referred Student Accounts</span>
                <span className="font-black text-slate-900 text-sm">{referrals.referred || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Peer Conversion Share</span>
                <span className="font-black text-emerald-600 text-sm">{referrals.percentage || 0}%</span>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(referrals.percentage || 0, 100)}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                Students referring roommates and classmates via unique MMUST referral codes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInsights;
