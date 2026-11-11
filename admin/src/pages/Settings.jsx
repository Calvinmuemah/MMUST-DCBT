import React, { useState } from 'react';
import { User, Shield, Bell, Lock, Save, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { updateProfile, updatePreferences, changePassword } from '../services/api';

const SettingsPage = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  // Form States
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifForm, setNotifForm] = useState({
    notificationsEnabled: user?.notificationsEnabled ?? true,
    emailUpdates: user?.emailUpdates ?? true
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setError("Passwords do not match.");
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await changePassword(passwordForm);
      setMessage("Password changed successfully!");
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotifs = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await updatePreferences(notifForm);
      if (onUpdateUser) onUpdateUser(res.user);
      localStorage.setItem('admin_user', JSON.stringify(res.user));
      setMessage("Preferences updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="pb-2 border-b border-slate-200/60">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account & Security Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage administrative credentials, institutional role, and notification channels.</p>
      </div>

      {(message || error) && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 duration-200 text-xs font-bold ${
          message 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <AlertCircle size={16} className="text-rose-600 shrink-0" />}
          <span>{message || error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="md:col-span-1 space-y-2">
          <SettingsTab 
            active={activeTab === 'profile'} 
            icon={<User size={16} />} 
            label="Profile Information" 
            color="blue"
            onClick={() => { setActiveTab('profile'); setMessage(null); setError(null); }}
          />
          <SettingsTab 
            active={activeTab === 'security'} 
            icon={<Shield size={16} />} 
            label="Password & Security" 
            color="amber"
            onClick={() => { setActiveTab('security'); setMessage(null); setError(null); }}
          />
          <SettingsTab 
            active={activeTab === 'notifications'} 
            icon={<Bell size={16} />} 
            label="Crisis Notifications" 
            color="purple"
            onClick={() => { setActiveTab('notifications'); setMessage(null); setError(null); }}
          />
        </div>

        {/* Form Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center font-black">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Administrator Profile</h3>
                  <p className="text-xs text-slate-400">Institutional account metadata</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Full Official Name</label>
                  <div className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 font-bold text-sm">
                    {user?.name || 'Administrator'}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Institutional Email</label>
                  <div className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 font-bold text-sm">
                    {user?.email || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Assigned Access Level</div>
                  <span className="badge-indigo font-bold">
                    <Shield size={12} /> {user?.role || 'admin'}
                  </span>
                </div>
                <span className="text-xs text-slate-400">Managed via Server CLI</span>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center font-black">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Security & Authentication</h3>
                  <p className="text-xs text-slate-400">Update your administrative dashboard password</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Current Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">New Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="Min. 8 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="Repeat new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-400 font-medium">Use a unique, high-entropy password to safeguard campus mental health records.</p>
                <button 
                  disabled={loading}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Shield size={14} />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleUpdateNotifs} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center font-black">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Alert & Notification Routing</h3>
                  <p className="text-xs text-slate-400">Configure crisis dispatch and system health summaries</p>
                </div>
              </div>

              <div className="space-y-5">
                <Toggle 
                  label="Campus Crisis Real-time Alerts" 
                  desc="Receive immediate dashboard badge notifications when a student scores High Risk or triggers crisis safety mode."
                  checked={notifForm.notificationsEnabled}
                  onChange={(val) => setNotifForm({...notifForm, notificationsEnabled: val})}
                />
                <Toggle 
                  label="Weekly Mental Health Telemetry Digest" 
                  desc="Receive an aggregated weekly email summarizing student assessment volume, top challenges, and peak therapy hours."
                  checked={notifForm.emailUpdates}
                  onChange={(val) => setNotifForm({...notifForm, emailUpdates: val})}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  disabled={loading}
                  className="btn-primary text-xs"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  <span>Save Preferences</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, onClick, active = false, color = 'blue' }) => {
  const activeStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80 font-bold',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80 font-bold',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80 font-bold',
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
        active 
          ? `${activeStyles[color] || activeStyles.blue} shadow-sm` 
          : 'border-transparent text-slate-600 hover:bg-white hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const Toggle = ({ label, desc, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 p-3.5 bg-slate-50/60 rounded-xl border border-slate-100">
    <div className="flex-1">
      <div className="text-xs font-bold text-slate-900">{label}</div>
      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{desc}</div>
    </div>
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-all duration-200 shrink-0 ${
        checked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${
        checked ? 'left-6' : 'left-1'
      }`} />
    </button>
  </div>
);

export default SettingsPage;
