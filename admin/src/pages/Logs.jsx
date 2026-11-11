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
  X,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getLogs(category);
      setLogs(data || []);
    } catch (err) {
      setError("Seems you're offline. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [category]);

  const categories = [
    { id: 'all', label: 'All Audits', icon: LayoutGrid, activeColor: 'bg-blue-600 text-white' },
    { id: 'auth', label: 'Auth & Login', icon: Lock, activeColor: 'bg-amber-600 text-white' },
    { id: 'system', label: 'System Kernel', icon: Terminal, activeColor: 'bg-indigo-600 text-white' },
    { id: 'database', label: 'Postgres DB', icon: Database, activeColor: 'bg-emerald-600 text-white' },
    { id: 'analytics', label: 'Clinical Analytics', icon: Info, activeColor: 'bg-purple-600 text-white' },
  ];

  const handleCopyJson = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(JSON.stringify(selectedLog.metadata, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && logs.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading System Logs...</p>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Category Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            System Security & Audit Logs
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Immutable audit trail of authentication events, crisis triggers, and API transactions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto self-start lg:self-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? `${cat.activeColor} shadow-sm` 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold">{error}</span>
          <button onClick={fetchLogs} className="btn-ghost-danger text-xs">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4 w-[20%]">Timestamp</th>
                <th className="px-6 py-4 w-[12%]">Severity</th>
                <th className="px-6 py-4 w-[15%]">Domain</th>
                <th className="px-6 py-4 w-[43%]">Event Description</th>
                <th className="px-6 py-4 w-[10%] text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-xs italic">
                    No log events recorded under the "{category}" category.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Clock size={12} className="text-slate-400" />
                        <span>{new Date(log.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <LevelBadge level={log.level} />
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{log.message}</div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="btn-ghost-primary"
                        title="Inspect Event Payload"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {logs.length} logged events</span>
          <span className="font-semibold text-slate-600">Encrypted DB Audit Trail</span>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                  <Terminal size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Audit Record Inspector</h3>
                  <p className="text-[10px] text-slate-400">Log ID #{selectedLog.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 hover:bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Severity</div>
                  <LevelBadge level={selectedLog.level} />
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Category</div>
                  <span className="text-xs font-bold text-slate-800 capitalize">{selectedLog.category}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Event Summary</div>
                <div className="text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedLog.message}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Sanitized Metadata</div>
                  <button 
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs overflow-x-auto font-mono leading-relaxed max-h-48">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Clock size={13} />
                <span>Recorded on {new Date(selectedLog.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LevelBadge = ({ level }) => {
  const norm = String(level || '').toLowerCase();
  
  if (norm === 'error') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Error
      </span>
    );
  }

  if (norm === 'warn') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Warn
      </span>
    );
  }

  if (norm === 'success') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Success
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/80">
      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> Info
    </span>
  );
};

export default LogsPage;
