import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
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
  Clock
} from 'lucide-react';
import { getMetrics } from '../services/api';

const COLORS = ['#2563EB', '#14B8A6', '#A855F7', '#F59E0B', '#EF4444', '#6366F1'];

const SystemInsights = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const data = await getMetrics(range);
        setMetrics(data);
      } catch (err) {
        setError("Unable to load detailed system insights. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [range]);

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
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
    { name: 'Users', count: systemHealth.users_count, icon: <Layers className="text-blue-500" /> },
    { name: 'Chats', count: systemHealth.chats_count, icon: <Activity className="text-teal-500" /> },
    { name: 'Messages', count: systemHealth.messages_count, icon: <Database className="text-indigo-500" /> },
    { name: 'Journals', count: systemHealth.journals_count, icon: <Server className="text-purple-500" /> },
    { name: 'Reflections', count: systemHealth.reflections_count, icon: <RefreshCw className="text-orange-500" /> },
    { name: 'Logins', count: systemHealth.logins_count, icon: <Clock className="text-pink-500" /> },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Insights</h1>
        <p className="text-slate-500 mt-1">Detailed technical and engagement analytics across the platform.</p>
      </div>

      {/* Database Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {tableStats.map((stat) => (
          <div key={stat.name} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="p-2 bg-slate-50 rounded-lg self-start">
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{parseInt(stat.count).toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.name}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Heatmap */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Activity className="w-5 h-5 text-primary" />
              Activity Heatmap (Hourly)
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
              Last {range}
            </span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityHeatmap}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="hour" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(h) => `${h}:00`}
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(h) => `Time: ${h}:00`}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#2563EB" 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth & Streak Cards */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Flame className="text-orange-500" size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Streak Metrics</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Max System Streak</div>
                <div className="text-3xl font-black text-orange-600">{streaks.max_streak} Days</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Average Daily Streak</div>
                <div className="text-3xl font-black text-slate-800">{streaks.avg_streak} Days</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <UserPlus className="text-green-600" size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Growth Strategy</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Referral Users</span>
                <span className="font-bold text-slate-800">{referrals.referred}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Conversion Rate</span>
                <span className="font-bold text-green-600">{referrals.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-green-500 h-full" 
                  style={{ width: `${referrals.percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-2 italic">
                Percentage of users who joined via a referral code compared to direct signups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInsights;
