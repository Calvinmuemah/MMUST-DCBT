import React, { useEffect, useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  UserCheck,
  UserMinus,
  Calendar,
  ChevronDown,
  Zap
} from 'lucide-react';
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
  Cell
} from 'recharts';
import { getMetrics } from '../services/api';

const COLORS = ['#2563EB', '#14B8A6', '#A855F7', '#F59E0B', '#EF4444'];

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('7d');

  const timeRanges = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '14d', label: 'Last 2 Weeks' },
    { id: '30d', label: 'Last Month' },
    { id: '90d', label: 'Last 3 Months' },
    { id: '1y', label: 'Last Year' },
    { id: 'all', label: 'All Time' },
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const data = await getMetrics(range);
        setMetrics(data);
      } catch (err) {
        setError("Seems you're offline. Please check your internet connection or try again later.");
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
    users = { total_users: 0, anonymous_users: 0, new_users: 0 }, 
    riskDistribution = [], 
    chats = { totalSessions: 0, topTopics: [] }, 
    assessmentTrends = [], 
    topChallenges = [], 
    systemHealth = { messages_count: 0, chats_count: 0, journals_count: 0, reflections_count: 0, logins_count: 0 }, 
    streaks = { max_streak: 0, avg_streak: 0 } 
  } = metrics || {};

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics Overview</h1>
          <p className="text-slate-500 mt-1">Viewing performance metrics for {timeRanges.find(r => r.id === range).label}</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start">
          <div className="flex items-center gap-2 px-3 text-slate-400 border-r border-slate-100">
            <Calendar size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Range</span>
          </div>
          <div className="relative flex items-center">
            <select 
              value={range} 
              onChange={(e) => setRange(e.target.value)}
              className="bg-transparent border-none outline-none pr-10 pl-3 py-1.5 text-sm font-bold text-slate-700 cursor-pointer appearance-none z-10"
            >
              {timeRanges.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Users" 
          value={users.total_users} 
          icon={<Users className="text-primary" />}
          subtitle={`${users.new_users} joined in this period`}
        />
        <MetricCard 
          title="Anonymous Users" 
          value={users.anonymous_users} 
          icon={<UserMinus className="text-secondary" />}
          subtitle={`${Math.round((users.anonymous_users / (users.total_users || 1)) * 100)}% of Total`}
        />
        <MetricCard 
          title="Max System Streak" 
          value={`${streaks.max_streak} Days`} 
          icon={<Zap className="text-orange-500" />}
          subtitle="Longest active user streak"
        />
        <MetricCard 
          title="Total Activity" 
          value={systemHealth.logins_count} 
          icon={<Activity className="text-accent" />}
          subtitle="Total platform logins"
        />
      </div>

      {/* SYSTEM PERFORMANCE QUICK VIEW */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative shadow-2xl shadow-slate-900/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div>
            <h3 className="text-xl font-bold mb-2">System Health Overview</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">A real-time snapshot of the data-layer growth and user engagement across the platform.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1">
            <div className="text-center lg:text-left border-l border-white/10 pl-6">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Messages</div>
              <div className="text-2xl font-bold">{parseInt(systemHealth.messages_count).toLocaleString()}</div>
            </div>
            <div className="text-center lg:text-left border-l border-white/10 pl-6">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">CBT Sessions</div>
              <div className="text-2xl font-bold">{parseInt(systemHealth.chats_count).toLocaleString()}</div>
            </div>
            <div className="text-center lg:text-left border-l border-white/10 pl-6">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Journals</div>
              <div className="text-2xl font-bold">{parseInt(systemHealth.journals_count).toLocaleString()}</div>
            </div>
            <div className="text-center lg:text-left border-l border-white/10 pl-6">
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Reflections</div>
              <div className="text-2xl font-bold">{parseInt(systemHealth.reflections_count).toLocaleString()}</div>
            </div>
          </div>

          <button 
            onClick={() => {
              window.history.pushState({}, '', '/insights');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="bg-white text-slate-900 hover:bg-slate-100 transition-all px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg whitespace-nowrap self-start lg:self-center"
          >
            View Full Insights
          </button>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[120px] -mr-40 -mt-40 rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 blur-[120px] -ml-40 -mb-40 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Onboarding Risk Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="level" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stress Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <TrendingUp className="w-5 h-5 text-secondary" />
            Average Stress Level Trend
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assessmentTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="assessment_date" axisLine={false} tickLine={false} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 15]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_score" 
                  stroke="#14B8A6" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#14B8A6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Chat Topics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-1">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <MessageSquare className="w-5 h-5 text-accent" />
            Popular Chat Topics
          </h3>
          <div className="space-y-4">
            {chats.topTopics.map((topic, i) => (
              <div key={topic.topic} className="flex items-center justify-between">
                <span className="capitalize text-slate-600 font-medium">{topic.topic}</span>
                <div className="flex items-center gap-3 flex-1 ml-4">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full" 
                      style={{ width: `${(topic.count / (chats.topTopics[0]?.count || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-8 text-right">{topic.count}</span>
                </div>
              </div>
            ))}
            {chats.topTopics.length === 0 && (
              <div className="text-slate-400 text-sm italic text-center py-4">No chat data yet</div>
            )}
          </div>
        </div>

        {/* Top Challenges */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Activity className="w-5 h-5 text-primary" />
            Top Reported Challenges
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topChallenges} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" hide />
                <YAxis dataKey="main_challenge" type="category" width={150} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <span className="text-slate-500 font-medium text-sm uppercase tracking-wider">{title}</span>
      <div className="p-2 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <div className="text-3xl font-bold tracking-tight text-slate-800">{value}</div>
      <div className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</div>
    </div>
  </div>
);

export default Dashboard;
