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
  LayoutGrid,
  Eye,
  X
} from 'lucide-react';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

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

  if (loading && logs.length === 0) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Terminal className="text-primary" />
            System Audit Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time monitoring of application events and activities.</p>
        </div>

        <div className="flex bg-white rounded-2xl p-1 border border-slate-200 shadow-sm overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                category === cat.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'
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
                <th className="px-6 py-4 w-[220px]">Timestamp</th>
                <th className="px-6 py-4 w-[120px]">Level</th>
                <th className="px-6 py-4 w-[140px]">Category</th>
                <th className="px-6 py-4">Event Message</th>
                <th className="px-6 py-4 w-[100px] text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No logs found for this category.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap w-[220px]">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Clock size={12} />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-[120px]">
                      <LevelBadge level={log.level} />
                    </td>
                    <td className="px-6 py-4 w-[140px]">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-800 line-clamp-1">{log.message}</div>
                    </td>
                    <td className="px-6 py-4 text-right w-[100px]">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        title="View Metadata"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Terminal size={18} className="text-primary" />
                Log Details
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Level</div>
                  <LevelBadge level={selectedLog.level} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{selectedLog.category}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Message</div>
                <div className="text-sm font-bold text-slate-800">{selectedLog.message}</div>
              </div>

              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Metadata JSON</div>
                <pre className="bg-slate-900 text-slate-300 p-4 rounded-2xl text-xs overflow-x-auto font-mono leading-relaxed">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Clock size={14} />
                Logged on {new Date(selectedLog.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
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
