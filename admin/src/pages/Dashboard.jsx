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
  ChevronDown
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
  PieChart,
  Pie
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

  const { users, riskDistribution, chats, assessmentTrends, topChallenges } = metrics;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark text-slate-800">Analytics Overview</h1>
          <p className="text-text-light mt-1">Viewing performance metrics for {timeRanges.find(r => r.id === range).label}</p>
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
          title="Chat Sessions" 
          value={chats.totalSessions} 
          icon={<MessageSquare className="text-accent" />}
          subtitle="Started during this period"
        />
        <MetricCard 
          title="Assessments" 
          value={assessmentTrends.reduce((acc, curr) => acc + parseInt(curr.total_assessments), 0)} 
          icon={<Activity className="text-orange-500" />}
          subtitle="Completed during this period"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Chart */}
        <div className="card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
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
        <div className="card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
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
        <div className="card lg:col-span-1">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
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
                      style={{ width: `${(topic.count / chats.topTopics[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-8 text-right">{topic.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Challenges */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
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
  <div className="card flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <span className="text-text-light font-medium">{title}</span>
      <div className="p-2 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <div className="text-3xl font-bold tracking-tight text-text-dark">{value}</div>
      <div className="text-sm text-text-light mt-1 font-medium">{subtitle}</div>
    </div>
  </div>
);

export default Dashboard;
