import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Users, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Search, 
  Eye, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck,
  Check,
  X,
  FileText
} from 'lucide-react';
import { 
  getNewsletterSubscribers, 
  deleteNewsletterSubscriber, 
  getBroadcastHistory, 
  sendNewsletterBroadcast 
} from '../services/api';

const EmailBroadcast = () => {
  const [activeTab, setActiveTab] = useState('compose'); // 'compose' | 'subscribers' | 'history'
  
  // Data states
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Compose form states
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Preview modal for history
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [subData, histData] = await Promise.all([
        getNewsletterSubscribers().catch(() => ({ subscribers: [], stats: { total: 0, active: 0, unsubscribed: 0 } })),
        getBroadcastHistory().catch(() => [])
      ]);

      if (subData) {
        setSubscribers(subData.subscribers || []);
        setStats(subData.stats || { total: 0, active: 0, unsubscribed: 0 });
      }
      if (histData) {
        setHistory(histData || []);
      }
    } catch (err) {
      console.error('Error fetching broadcast data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter an email subject first.' });
      return;
    }
    if (!body.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter the email message body first.' });
      return;
    }

    try {
      setTestSending(true);
      setStatusMessage(null);
      const res = await sendNewsletterBroadcast({
        subject,
        body,
        isTest: true,
        testEmail: testEmail.trim() || undefined
      });
      if (res.delivered === false) {
        setStatusMessage({ type: 'warning', text: res.message });
      } else {
        setStatusMessage({ type: 'success', text: res.message || 'Test preview email sent successfully!' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to send test email.' });
    } finally {
      setTestSending(false);
    }
  };

  const handleSendBroadcast = async () => {
    setShowConfirmModal(false);
    if (!subject.trim() || !body.trim()) {
      setStatusMessage({ type: 'error', text: 'Both subject and message body are required.' });
      return;
    }

    try {
      setSending(true);
      setStatusMessage(null);
      const res = await sendNewsletterBroadcast({
        subject,
        body,
        isTest: false
      });
      if (res.delivered === false) {
        setStatusMessage({ type: 'warning', text: res.message });
      } else {
        setStatusMessage({ type: 'success', text: res.message || 'Broadcast dispatched successfully to subscribers!' });
        setSubject('');
        setBody('');
      }
      fetchData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to dispatch broadcast.' });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSubscriber = async (id, email) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from the subscribers list?`)) return;
    try {
      await deleteNewsletterSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1), active: Math.max(0, prev.active - 1) }));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete subscriber');
    }
  };

  // Filtered subscribers list
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Mail className="text-blue-600" size={24} />
            <span>Email Broadcast & Newsletter</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch announcements, mental health workshops, and CBT resources to subscribed university students.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={refreshing}
          className="btn-secondary self-start sm:self-auto text-xs py-2 px-3.5 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-stat">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Subscribers</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.active}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Ready to receive broadcasts</p>
        </div>

        <div className="card-stat">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Subscriptions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Lifetime web & app signups</p>
        </div>

        <div className="card-stat">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Broadcasts Sent</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Send size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{history.length}</p>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">Total mass emails dispatched</p>
        </div>

        <div className="card-stat">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Status</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-sm font-bold text-slate-800">SMTP Active</p>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">MMUSTCare Delivery Pipeline</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'compose'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Send size={14} />
          <span>Compose Broadcast</span>
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'subscribers'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users size={14} />
          <span>Subscribers Directory</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold ml-1">
            {stats.active}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Clock size={14} />
          <span>Broadcast Archive</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold ml-1">
            {history.length}
          </span>
        </button>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : statusMessage.type === 'warning'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ========================================================
          TAB 1: COMPOSE BROADCAST
         ======================================================== */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7 card space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">New Email Announcement</h2>
              <p className="text-xs text-slate-500">
                This message will be dispatched to all <strong className="text-blue-600">{stats.active} active subscribers</strong>.
              </p>
            </div>

            {/* Quick Templates Buttons */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Quick Subject Ideas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Upcoming Exam Stress De-escalation Workshop',
                  'New Digital CBT Module: Grounding & Sleep Hygiene',
                  'MMUST Mental Health Awareness Week • Schedule of Events',
                  'Free & Confidential Peer Counseling Hours This Month'
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setSubject(sample)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-medium transition-colors cursor-pointer text-left"
                  >
                    + {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Upcoming Exam Stress De-escalation Workshop"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm font-semibold"
              />
            </div>

            {/* Body Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Announcement Message
                </label>
                <span className="text-[11px] text-slate-400">Separate paragraphs with double enters</span>
              </div>
              <textarea
                rows={9}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Dear MMUST Community,&#10;&#10;As we approach end-of-semester examinations, the Directorate of Student Affairs and MMUST DCBT are hosting a live stress de-escalation session.&#10;&#10;Join our certified clinical counselors this Thursday at 4:00 PM for practical cognitive reframing techniques and breathing exercises."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm leading-relaxed"
              />
            </div>

            {/* Test Email Row */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-700 block">Send Test Preview</span>
                <span className="text-[11px] text-slate-400">Send a sample to your inbox first to verify appearance.</span>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="admin@mmust.ac.ke (optional)"
                  className="w-full mt-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSendTest}
                disabled={testSending || !subject.trim() || !body.trim()}
                className="btn-secondary text-xs py-2 px-3 self-end sm:self-center disabled:opacity-50"
              >
                {testSending ? 'Sending...' : 'Send Test Preview'}
              </button>
            </div>

            {/* Dispatch Action */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Recipients: <strong className="text-slate-800">{stats.active} subscribers</strong>
              </span>

              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={sending || !subject.trim() || !body.trim() || stats.active === 0}
                className="btn-primary py-3 px-6 text-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send size={15} />
                <span>Send to All Subscribers</span>
              </button>
            </div>

          </div>

          {/* Right Column: Live Email Preview Card */}
          <div className="lg:col-span-5 sticky top-24 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye size={14} />
              <span>Live Subscriber Email Preview</span>
            </span>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden text-slate-800">
              {/* University Header */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-5 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-2">
                  MMUST Mental Health
                </span>
                <h3 className="text-lg font-black tracking-tight">MMUSTCare Updates</h3>
                <p className="text-xs text-blue-200 mt-0.5">Masinde Muliro University of Science & Technology</p>
              </div>

              {/* Email Content Preview */}
              <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto">
                <h4 className="text-sm font-bold text-slate-900">
                  {subject || 'Email Subject Line Preview'}
                </h4>
                
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed whitespace-pre-line">
                  {body || 'Your message will appear here formatted with university headers, clinical contact information, and automatic unsubscribe links.'}
                </div>
              </div>

              {/* Email Footer Preview */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 text-[10px] text-slate-400 text-center space-y-1">
                <p>Directorate of Student Affairs • MMUST Kakamega Main Campus</p>
                <p className="text-blue-600 underline">Unsubscribe from mental wellness updates</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 2: SUBSCRIBERS DIRECTORY
         ======================================================== */}
      {activeTab === 'subscribers' && (
        <div className="card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Subscribers Directory</h2>
              <p className="text-xs text-slate-500">Students and staff who signed up via website footer or app.</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="all">All Statuses ({subscribers.length})</option>
                <option value="active">Active Only ({stats.active})</option>
                <option value="unsubscribed">Unsubscribed ({stats.unsubscribed})</option>
              </select>

              {/* Search input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search email..."
                  className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 w-44 sm:w-56"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Email Address</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Source</th>
                  <th className="py-3 px-4 font-bold">Subscribed Date</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      {searchQuery ? 'No subscribers match your search filter.' : 'No subscribers in database yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        <span>{sub.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        {sub.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Unsubscribed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 capitalize">
                        {sub.source ? sub.source.replace('_', ' ') : 'Website'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(sub.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove subscriber"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: BROADCAST ARCHIVE / HISTORY
         ======================================================== */}
      {activeTab === 'history' && (
        <div className="card space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Broadcast Archive</h2>
            <p className="text-xs text-slate-500">Log of all previously dispatched mass email newsletters.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Subject</th>
                  <th className="py-3 px-4 font-bold">Recipients</th>
                  <th className="py-3 px-4 font-bold">Sender</th>
                  <th className="py-3 px-4 font-bold">Date Sent</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      No email broadcasts have been sent yet.
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 max-w-sm truncate">{item.subject}</div>
                        <div className="text-[11px] text-slate-400 max-w-sm truncate mt-0.5">{item.body}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {item.recipient_count} Students
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.sender_name || item.sender_email || 'Administrator'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(item.sent_at).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedBroadcast(item)}
                          className="btn-ghost-primary"
                        >
                          <Eye size={12} />
                          <span>View Message</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal before Live Send */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Send size={24} />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Confirm Broadcast Dispatch</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                You are about to blast this email to <strong>{stats.active} active subscribers</strong>. This action cannot be undone once dispatched.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Subject</span>
              <span className="font-bold text-slate-800">{subject}</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 btn-secondary py-2.5 text-xs justify-center cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBroadcast}
                className="w-1/2 btn-primary py-2.5 text-xs justify-center cursor-pointer"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Broadcast Modal */}
      {selectedBroadcast && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Broadcast Archive Details</h3>
              <button onClick={() => setSelectedBroadcast(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject</span>
              <p className="text-sm font-bold text-slate-900">{selectedBroadcast.subject}</p>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span>Recipients: <strong className="text-slate-800">{selectedBroadcast.recipient_count}</strong></span>
              <span>Sent: <strong className="text-slate-800">{new Date(selectedBroadcast.sent_at).toLocaleString()}</strong></span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Message Content</span>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                {selectedBroadcast.body}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBroadcast(null)}
                className="btn-secondary text-xs py-2 px-4 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmailBroadcast;
