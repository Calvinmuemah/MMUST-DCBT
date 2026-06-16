import React, { useEffect, useState } from 'react';
import { getCrisisReports } from '../services/api';
import { AlertTriangle, Mail, Calendar, Activity, ChevronRight, ShieldCheck } from 'lucide-react';

const CrisisPage = () => {
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

  if (loading) return <div className="p-8">Loading high-risk reports...</div>;

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
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          High-Risk Student Monitoring
        </h1>
        <p className="text-text-light">
          Automatically flagged students based on High-Risk onboarding assessments and critical daily checks.
        </p>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-text-dark">No high-risk students flagged</h2>
            <p className="text-text-light mt-2">All students currently fall within Low to Moderate risk levels.</p>
          </div>
        ) : (
          reports.map((report, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {report.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-dark group-hover:text-primary transition-colors">
                      {report.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="text-sm text-text-light flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {report.email || 'Anonymous'}
                      </div>
                      <div className="text-sm text-text-light flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(report.assessment_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                    High Risk
                  </span>
                  <div className="text-xs font-bold text-text-light">
                    Stress Score: <span className="text-red-600">{report.stress_level}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Main Challenge
                  </div>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{report.main_challenge}"
                  </p>
                </div>
                <div className="flex items-end justify-end">
                  <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                    View Full AI Conversation <ChevronRight className="w-5 h-5" />
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
