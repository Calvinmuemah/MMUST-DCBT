import React, { useEffect, useState } from 'react';
import { getUserDetails, getChatMessages } from '../services/api';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Shield, 
  Activity, 
  MessageSquare, 
  BookOpen, 
  Brain,
  Flame,
  Clock,
  User as UserIcon,
  Eye,
  X,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

const UserDetails = ({ userId, onBack }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chat conversation modal states
  const [activeChatSession, setActiveChatSession] = useState(null);
  const [chatMessages, setChatMessages] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  const handleViewChat = async (chatSession) => {
    setActiveChatSession(chatSession);
    setChatLoading(true);
    setChatError(null);
    setChatMessages([]);
    try {
      const data = await getChatMessages(chatSession.public_id || chatSession.id);
      setChatMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      setChatError("Failed to load chat conversation messages.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleCloseChatModal = () => {
    setActiveChatSession(null);
    setChatMessages(null);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getUserDetails(userId);
        setUserData(data);
      } catch (err) {
        setError("Failed to load student record details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [userId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading Student Profile...</p>
    </div>
  );

  if (error || !userData) return (
    <div className="p-8 max-w-xl mx-auto text-center space-y-4">
      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl">
        <h3 className="font-bold text-sm">{error || "Student Record Not Found"}</h3>
      </div>
      <button onClick={onBack} className="btn-secondary text-xs">
        <ArrowLeft size={14} /> Back to User Directory
      </button>
    </div>
  );

  const { stats = {}, assessments = [], journals = [], chats = [], reflections = [] } = userData;

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <button 
          onClick={onBack}
          className="btn-secondary text-xs self-start"
        >
          <ArrowLeft size={14} />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          {userData.role === 'admin' ? (
            <span className="badge-indigo">
              <Shield size={12} /> Administrator
            </span>
          ) : (
            <span className="badge-blue">
              <GraduationCap size={12} /> University Student
            </span>
          )}

          {userData.is_anonymous ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Guest Session
            </span>
          ) : (
            <span className="badge-emerald">
              Verified Profile
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity & Initial Clinical Intake */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-center">
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md mb-4 ${userData.is_anonymous ? 'bg-slate-500' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'}`}>
              {userData.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{userData.name}</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
              <Mail size={13} />
              <span>{userData.email || 'Anonymous Guest Student'}</span>
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                <span>Joined {new Date(userData.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* 4 Quick Stat Counters */}
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Assessments" value={stats.total_assessments || 0} icon={<Activity size={18} />} color="blue" />
            <StatTile label="Max Streak" value={`${stats.max_streak || 0} d`} icon={<Flame size={18} />} color="amber" />
            <StatTile label="Journals" value={stats.total_journals || 0} icon={<BookOpen size={18} />} color="emerald" />
            <StatTile label="Reflections" value={stats.total_reflections || 0} icon={<Brain size={18} />} color="purple" />
          </div>

          {/* Onboarding Intake Score Summary */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white border border-slate-700/60 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Clinical Intake Score</h3>
              <RiskBadge level={userData.onboarding_risk_level} />
            </div>

            <div className="mb-4">
              <div className="text-3xl font-black text-white">{userData.onboarding_total_score || 0}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Initial Severity Index</div>
            </div>
            
            {userData.onboarding_answers && (
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                {JSON.parse(JSON.stringify(userData.onboarding_answers)).slice(0, 3).map((ans, i) => (
                  <div key={i} className="text-xs">
                    <div className="text-slate-400 text-[11px] mb-0.5">{ans.question}</div>
                    <div className="font-bold text-slate-100 bg-white/5 p-2 rounded-lg border border-white/10">{ans.answer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Clinical Check-ins & Conversation History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Well-being Assessments Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Activity className="text-blue-600" size={17} />
                  Daily Well-being Check-in Records
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Self-reported check-in history across campus</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                {assessments.length} Records
              </span>
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-50/90 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Stress Score</th>
                    <th className="px-5 py-3">Distress Challenge</th>
                    <th className="px-5 py-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessments.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-700 whitespace-nowrap">
                        {new Date(item.assessment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-bold ${getStressColor(item.stress_level)}`}>
                          {item.stress_level}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 truncate max-w-[200px]">
                        {item.main_challenge || 'General Stress'}
                      </td>
                      <td className="px-5 py-3 text-right font-black text-slate-700">
                        {item.total_score}
                      </td>
                    </tr>
                  ))}
                  {assessments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-5 py-8 text-center text-slate-400 text-xs italic">
                        No daily check-ins recorded for this student yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Journals & Chats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Journals */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
                  <BookOpen className="text-emerald-600" size={17} />
                  Therapeutic Thought Journals
                </h3>
                <div className="space-y-3">
                  {journals.slice(0, 4).map((j, i) => (
                    <div key={i} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                      <div className="font-bold text-slate-800 text-xs truncate">{j.title || 'Untitled Thought Log'}</div>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                        <span>{new Date(j.created_at).toLocaleDateString()}</span>
                        <span className="px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {j.mood || 'Reflective'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {journals.length === 0 && (
                    <p className="text-center py-8 text-slate-400 text-xs italic">No journal entries written.</p>
                  )}
                </div>
              </div>
            </div>

            {/* AI CBT Chat Sessions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
                  <MessageSquare className="text-blue-600" size={17} />
                  CBT Chat History
                </h3>
                <div className="space-y-3">
                  {chats.slice(0, 4).map((c, i) => (
                    <div 
                      key={c.id || i} 
                      onClick={() => handleViewChat(c)}
                      className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-blue-50/40 hover:border-blue-200 cursor-pointer transition-all group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-slate-800 text-xs capitalize truncate group-hover:text-blue-600 transition-colors">
                          {c.topic || 'General Session'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewChat(c);
                        }}
                        className="btn-ghost-primary shrink-0"
                      >
                        <Eye size={12} />
                        <span>Chat</span>
                      </button>
                    </div>
                  ))}
                  {chats.length === 0 && (
                    <p className="text-center py-8 text-slate-400 text-xs italic">No conversation sessions found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Conversation Modal */}
      {activeChatSession && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <MessageSquare size={17} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm capitalize">
                    {activeChatSession.topic} • CBT Therapy Session
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Session started on {new Date(activeChatSession.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleCloseChatModal}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/50 min-h-[300px] max-h-[55vh]">
              {chatLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Decrypting conversation...</p>
                </div>
              ) : chatError ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center text-xs font-bold">
                  {chatError}
                </div>
              ) : chatMessages && chatMessages.length > 0 ? (
                <div className="space-y-3">
                  {chatMessages.map((msg, index) => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <div 
                        key={index} 
                        className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                      >
                        {isAi && (
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px] shadow-sm">
                            AI
                          </div>
                        )}
                        <div className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} max-w-[82%]`}>
                          <div className={`p-3.5 rounded-2xl shadow-sm text-xs font-medium leading-relaxed ${
                            isAi 
                              ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-sm' 
                              : 'bg-blue-600 text-white rounded-tr-sm'
                          }`}>
                            {msg.message}
                          </div>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-1 px-1">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!isAi && (
                          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-[10px] shadow-sm">
                            U
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 text-xs italic">
                  No conversation logs recorded in this session.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button 
                onClick={handleCloseChatModal}
                className="btn-secondary text-xs"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Reusable Stat Tile */
const StatTile = ({ label, value, icon, color = 'blue' }) => {
  const styles = {
    blue: 'border-t-2 border-t-blue-500 text-blue-600 bg-blue-50',
    amber: 'border-t-2 border-t-amber-500 text-amber-600 bg-amber-50',
    emerald: 'border-t-2 border-t-emerald-500 text-emerald-600 bg-emerald-50',
    purple: 'border-t-2 border-t-purple-500 text-purple-600 bg-purple-50',
  };
  const activeStyle = styles[color] || styles.blue;

  return (
    <div className={`bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between ${activeStyle}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span>
        {icon}
      </div>
      <div className="text-lg font-black text-slate-900">{value}</div>
    </div>
  );
};

const RiskBadge = ({ level }) => {
  const norm = String(level || '').toLowerCase();
  if (norm.includes('high') || norm.includes('crisis')) {
    return <span className="badge-rose"><span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>High Risk</span>;
  }
  if (norm.includes('mod')) {
    return <span className="badge-amber"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Moderate</span>;
  }
  if (norm.includes('mild')) {
    return <span className="badge-blue"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Mild</span>;
  }
  return <span className="badge-emerald"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Low Risk</span>;
};

const getStressColor = (level) => {
  const l = String(level || '').toLowerCase();
  if (l.includes('high') || l.includes('very')) return 'text-rose-600 font-bold';
  if (l.includes('moderate')) return 'text-amber-600 font-semibold';
  return 'text-emerald-600 font-semibold';
};

export default UserDetails;
