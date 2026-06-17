import React, { useEffect, useState } from 'react';
import { getCrisisReports } from '../services/api';
import { AlertTriangle, Mail, Calendar, Activity, ChevronRight, ShieldCheck } from 'lucide-react';

const CrisisPage = ({ onViewUser }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getCrisisReports();
        setReports(data);
      } catch (err) {
        setError("Seems you're offline. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading high-risk reports...</div>;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          High-Risk Student Monitoring
        </h1>
        <p className="text-slate-500 text-sm">
          Automatically flagged students based on High-Risk onboarding assessments and critical daily checks.
        </p>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No high-risk students flagged</h2>
            <p className="text-slate-500 mt-2 font-medium">All students currently fall within Low to Moderate risk levels.</p>
          </div>
        ) : (
          reports.map((report, i) => (
            <div 
              key={i} 
              onClick={() => onViewUser && onViewUser(report.user_public_id)}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm border border-red-100">
                    {report.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">
                      {report.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                      <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Mail className="w-3 h-3" /> {report.email || 'Anonymous'}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" /> {new Date(report.assessment_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2">
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    High Risk
                  </span>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Score: <span className="text-red-600">{report.stress_level}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Main Challenge Reported
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                    "{report.main_challenge}"
                  </p>
                </div>
                <div className="flex items-end justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewUser && onViewUser(report.user_public_id);
                    }}
                    className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm group/btn bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10"
                  >
                    View Full AI Conversation <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
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
