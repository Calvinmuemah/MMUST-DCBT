import React, { useEffect, useState } from 'react';
import { getCrisisReports } from '../services/api';
import { 
  AlertTriangle, 
  Mail, 
  Calendar, 
  Activity, 
  ChevronRight, 
  ShieldCheck, 
  PhoneCall,
  Clock,
  ArrowRight,
  RefreshCw,
  HeartPulse
} from 'lucide-react';

const CrisisPage = ({ onViewUser }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getCrisisReports();
      setReports(data || []);
    } catch (err) {
      setError("Seems you're offline. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-600"></div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Checking High-Risk Records...</p>
    </div>
  );

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-sm">Connection Alert</h3>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
            <button 
              onClick={fetchReports} 
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Alert Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-rose-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-l-8 border-l-rose-600">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-sm">
            <HeartPulse size={26} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">High-Risk Student Monitoring</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                Priority 1
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1 max-w-xl leading-relaxed">
              Students automatically flagged for counselor attention based on severe distress indicators, crisis keywords in AI chat, or high-risk daily assessment scores.
            </p>
          </div>
        </div>

        {/* Campus Emergency Hotline Box */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex items-center gap-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
            <PhoneCall size={18} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-800">MMUST Counseling Hotline</div>
            <div className="text-sm font-black text-rose-950">Ext. 2200 / +254 700 000 000</div>
            <div className="text-[10px] text-rose-600 mt-0.5">Campus Health & Counseling Center</div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center shadow-sm max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-800">All Student Assessments Clear</h2>
            <p className="text-slate-500 text-xs mt-1.5 font-medium max-w-md mx-auto leading-relaxed">
              No students are currently flagged in High-Risk or Crisis status. All submitted check-ins are within Low to Moderate thresholds.
            </p>
          </div>
        ) : (
          reports.map((report, i) => (
            <div 
              key={report.user_public_id || i} 
              onClick={() => onViewUser && onViewUser(report.user_public_id)}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 cursor-pointer group border-l-4 border-l-rose-500 hover:border-l-rose-600"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                    {report.name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                        {report.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                        High Risk
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-400" />
                        <span>{report.email || 'Anonymous Student'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{new Date(report.assessment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-center">
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Stress Score</div>
                    <div className="text-xl font-black text-rose-600">{report.stress_level} / 15</div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewUser && onViewUser(report.user_public_id);
                    }}
                    className="btn-danger text-xs font-bold px-4 py-2"
                  >
                    <span>Open Case File</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Challenge Details Callout */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity size={13} className="text-rose-500" /> Primary Distress Challenge
                </div>
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 text-xs text-slate-700 font-medium leading-relaxed">
                  "{report.main_challenge || 'Severe academic pressure and difficulty coping with daily responsibilities'}"
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CrisisPage;
