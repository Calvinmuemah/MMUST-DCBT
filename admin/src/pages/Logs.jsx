import React, { useEffect, useState } from 'react';
import { getLogs } from '../services/api';
import { 
  Terminal, 
  Search, 
  Filter, 
  Database, 
  Lock, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Clock,
  LayoutGrid
} from 'lucide-react';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await getLogs(category);
        setLogs(data);
      } catch (err) {
        setError("Seems you're offline. Check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [category]);

  const categories = [
    { id: 'all', label: 'All Logs', icon: <LayoutGrid size={16} /> },
    { id: 'auth', label: 'Auth', icon: <Lock size={16} /> },
    { id: 'system', label: 'System', icon: <Terminal size={16} /> },
    { id: 'database', label: 'Database', icon: <Database size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <Info size={16} /> },
  ];

  if (loading && logs.length === 0) return <div className="p-8">Loading system logs...</div>;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <Terminal className="text-primary" />
            System Audit Logs
          </h1>
          <p className="text-text-light mt-1">Real-time monitoring of application events and activities.</p>
        </div>

        <div className="flex bg-white rounded-2xl p-1 border border-slate-200 shadow-sm overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                category === cat.id ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No logs found for this category.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Clock size={12} />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <LevelBadge level={log.level} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded">
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-text-dark">{log.message}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-xs text-text-light font-medium italic">
                        {log.metadata ? JSON.stringify(log.metadata) : '-'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LevelBadge = ({ level }) => {
  const styles = {
    info: 'bg-blue-50 text-blue-600 border-blue-100',
    warn: 'bg-orange-50 text-orange-600 border-orange-100',
    error: 'bg-red-50 text-red-600 border-red-100',
    success: 'bg-green-50 text-green-600 border-green-100',
  };

  const icons = {
    info: <Info size={12} />,
    warn: <AlertCircle size={12} />,
    error: <AlertCircle size={12} />,
    success: <CheckCircle size={12} />,
  };

  const style = styles[level] || styles.info;
  const icon = icons[level] || icons.info;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${style}`}>
      {icon}
      {level}
    </span>
  );
};

export default LogsPage;
