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
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  BookOpen,
  Heart
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
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { getMetrics } from '../services/api';

const getRiskColor = (level) => {
  const norm = String(level || '').toLowerCase();
  if (norm.includes('high') || norm.includes('crisis') || norm.includes('severe')) return '#EF4444';
  if (norm.includes('mod')) return '#F59E0B';
  if (norm.includes('mild')) return '#0EA5E9';
  if (norm.includes('low')) return '#10B981';
  return '#6366F1';
};

const TOPIC_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#14B8A6', // Teal
];

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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading Platform Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-sm">Connection Alert</h3>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
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

  const anonPercent = Math.round((users.anonymous_users / (users.total_users || 1)) * 100);

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
              Live
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Mental health utilization and CBT assessment trends across MMUST student body.
          </p>
        </div>

        {/* Time Filter Pills & Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden sm:inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {['24h', '7d', '30d', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setRange(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  range === tab 
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Calendar size={15} className="text-slate-400" />
            <select 
              value={range} 
              onChange={(e) => setRange(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 cursor-pointer pr-4"
            >
              {timeRanges.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards with Distinct Accent Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Total Students" 
          value={parseInt(users.total_users || 0).toLocaleString()} 
          icon={<Users size={20} />}
          badgeText={`+${users.new_users || 0} this period`}
          badgeType="blue"
          accent="blue"
          subtitle="Registered & guest profiles"
        />
        <MetricCard 
          title="Anonymous Sessions" 
          value={parseInt(users.anonymous_users || 0).toLocaleString()} 
          icon={<UserMinus size={20} />}
          badgeText={`${anonPercent}% of total`}
          badgeType="teal"
          accent="teal"
          subtitle="Privacy-first student sessions"
        />
        <MetricCard 
          title="Max Campus Streak" 
          value={`${streaks.max_streak || 0} Days`} 
          icon={<Flame size={20} />}
          badgeText={`Avg ${streaks.avg_streak || 0} days`}
          badgeType="amber"
          accent="amber"
          subtitle="Consecutive daily check-ins"
        />
        <MetricCard 
          title="Daily Assessments" 
          value={parseInt(systemHealth.logins_count || 0).toLocaleString()} 
          icon={<Activity size={20} />}
          badgeText="Active Check-ins"
          badgeType="purple"
          accent="purple"
          subtitle="Total platform interactions"
        />
      </div>

      {/* System Health Command Overview Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-7 md:p-8 text-white relative shadow-xl shadow-slate-900/15 overflow-hidden border border-slate-700/60">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">System Activity Snapshot</span>
            </div>
            <h3 className="text-xl font-black text-white">Platform Growth & Counseling Reach</h3>
            <p className="text-slate-300 text-xs mt-1 max-w-md leading-relaxed">
              Real-time telemetry showing student engagement across AI chat, therapeutic journals, and daily reflections.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 flex-1">
            <div className="border-l border-white/10 pl-5">
              <div className="text-sky-300 text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MessageSquare size={13} /> Messages
              </div>
              <div className="text-2xl font-black text-white">{parseInt(systemHealth.messages_count || 0).toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Exchanged</div>
            </div>

            <div className="border-l border-white/10 pl-5">
              <div className="text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Heart size={13} /> CBT Chats
              </div>
              <div className="text-2xl font-black text-white">{parseInt(systemHealth.chats_count || 0).toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Completed</div>
            </div>

            <div className="border-l border-white/10 pl-5">
              <div className="text-amber-300 text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen size={13} /> Journals
              </div>
              <div className="text-2xl font-black text-white">{parseInt(systemHealth.journals_count || 0).toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Entries</div>
            </div>

            <div className="border-l border-white/10 pl-5">
              <div className="text-purple-300 text-[11px] font-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Activity size={13} /> Reflections
              </div>
              <div className="text-2xl font-black text-white">{parseInt(systemHealth.reflections_count || 0).toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Logged</div>
            </div>
          </div>

          <button 
            onClick={() => {
              window.history.pushState({}, '', '/insights');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all active:scale-95 inline-flex items-center gap-2 shrink-0 self-start lg:self-center"
          >
            <span>Deep System Insights</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>

      {/* Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Onboarding Risk Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Students stratified by clinically validated intake score</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
              Clinical Intake
            </span>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="level" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    boxShadow: '0 8px 16px -2px rgba(0, 0, 0, 0.08)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={42}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.level)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span> Mild
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> High Risk
            </span>
          </div>
        </div>

        {/* Stress Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                Daily Stress Index Trend
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Average aggregated daily assessment score over time</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-teal-50 text-teal-700 rounded-md border border-teal-200/50">
              Score (0 - 15)
            </span>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={assessmentTrends}>
                <defs>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="assessment_date" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(str) => {
                    const d = new Date(str);
                    return isNaN(d) ? str : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  }}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  domain={[0, 15]}
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
                />
                <Area 
                  type="monotone" 
                  dataKey="avg_score" 
                  stroke="#14B8A6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#stressGrad)" 
                  dot={{ r: 4, fill: '#14B8A6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Score Interpretation:</span>
            <span className="text-emerald-600 font-semibold">0-4 Low Stress</span>
            <span className="text-amber-600 font-semibold">5-9 Moderate</span>
            <span className="text-rose-600 font-semibold">10-15 Severe Attention</span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Chat Topics & Challenges Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Chat Topics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Popular CBT Topics
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">By Frequency</span>
            </div>
            <p className="text-xs text-slate-400 mb-5">Most frequently initiated therapy discussions</p>

            <div className="space-y-4">
              {chats.topTopics.map((topic, i) => {
                const maxCount = chats.topTopics[0]?.count || 1;
                const pct = Math.round((topic.count / maxCount) * 100);
                const color = TOPIC_COLORS[i % TOPIC_COLORS.length];

                return (
                  <div key={topic.topic || i} className="group">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded text-[10px] font-black flex items-center justify-center bg-slate-100 text-slate-600">
                          #{i + 1}
                        </span>
                        <span className="capitalize font-bold text-slate-800">{topic.topic}</span>
                      </div>
                      <span className="font-extrabold text-slate-700">{topic.count} sessions</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}

              {chats.topTopics.length === 0 && (
                <div className="text-slate-400 text-xs italic text-center py-8">
                  No conversation sessions recorded in this time range.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Automated AI Topic Classifier</span>
            <span className="font-semibold text-blue-600">Active</span>
          </div>
        </div>

        {/* Top Reported Challenges */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Primary Student Challenges
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Reported via daily check-in assessments across campus</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200/60">
              Aggregated Reports
            </span>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topChallenges} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="main_challenge" 
                  type="category" 
                  width={150} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    boxShadow: '0 8px 16px -2px rgba(0, 0, 0, 0.08)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="count" fill="#4F46E5" radius={[0, 8, 8, 0]} barSize={22}>
                  {topChallenges.map((entry, index) => (
                    <Cell key={`challenge-${index}`} fill={TOPIC_COLORS[index % TOPIC_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Includes academic stress, social anxiety, sleep disturbance, financial strain</span>
            <span className="font-semibold text-slate-700">Campus Counseling Focus Area</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Polished Metric Card with Purposeful Color Accents */
const MetricCard = ({ title, value, icon, badgeText, badgeType = 'blue', accent = 'blue', subtitle }) => {
  const accents = {
    blue: {
      border: 'border-t-4 border-t-blue-500',
      iconBox: 'bg-blue-50 text-blue-600 border border-blue-200/60',
      badge: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    },
    teal: {
      border: 'border-t-4 border-t-teal-500',
      iconBox: 'bg-teal-50 text-teal-600 border border-teal-200/60',
      badge: 'bg-teal-50 text-teal-700 border border-teal-200/60',
    },
    amber: {
      border: 'border-t-4 border-t-amber-500',
      iconBox: 'bg-amber-50 text-amber-600 border border-amber-200/60',
      badge: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    },
    purple: {
      border: 'border-t-4 border-t-purple-500',
      iconBox: 'bg-purple-50 text-purple-600 border border-purple-200/60',
      badge: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    },
  };

  const scheme = accents[accent] || accents.blue;

  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between ${scheme.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${scheme.iconBox}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-black tracking-tight text-slate-900">{value}</div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="text-xs text-slate-400 font-medium truncate">{subtitle}</span>
          {badgeText && (
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${scheme.badge}`}>
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
