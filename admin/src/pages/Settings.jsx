import React, { useState } from 'react';
import { User, Shield, Bell, Lock, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { updateProfile, updatePreferences, changePassword } from '../services/api';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  let user = {};
  try {
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser && savedUser !== 'undefined') {
      user = JSON.parse(savedUser);
    }
  } catch (e) {
    console.error("Settings: Failed to parse user", e);
  }

  // Form States
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifForm, setNotifForm] = useState({
    notificationsEnabled: user?.notificationsEnabled ?? true,
    emailUpdates: user?.emailUpdates ?? true
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await updateProfile(profileForm);
      localStorage.setItem('admin_user', JSON.stringify(res.user));
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

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
      localStorage.setItem('admin_user', JSON.stringify(res.user));
      setMessage("Preferences updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your administrative profile and security preferences.</p>
      </div>

      {(message || error) && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${message ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
          {message ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-bold">{message || error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="md:col-span-1 space-y-2">
          <SettingsTab 
            active={activeTab === 'profile'} 
            icon={<User size={18} />} 
            label="Profile Information" 
            onClick={() => setActiveTab('profile')}
          />
          <SettingsTab 
            active={activeTab === 'security'} 
            icon={<Shield size={18} />} 
            label="Security" 
            onClick={() => setActiveTab('security')}
          />
          <SettingsTab 
            active={activeTab === 'notifications'} 
            icon={<Bell size={18} />} 
            label="Notifications" 
            onClick={() => setActiveTab('notifications')}
          />
        </div>

        {/* Form Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <User className="text-primary" size={20} />
                Profile Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</div>
                  <div className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-bold">
                    {user?.name || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</div>
                  <div className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-bold">
                    {user?.email || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Administrative Role</div>
                <span className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/10">
                  {user?.role || 'Admin'}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Lock className="text-orange-500" size={20} />
                Security & Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">New Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="Min. 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="Confirm new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium max-w-[240px]">Ensuring a strong password helps protect your administrative access.</p>
                <button 
                  disabled={loading}
                  className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
                  Update Password
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleUpdateNotifs} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Bell className="text-accent" size={20} />
                Notification Preferences
              </h3>
              <div className="space-y-6">
                <Toggle 
                  label="In-App Notifications" 
                  desc="Receive alerts about system status and user crisis reports directly in the dashboard."
                  checked={notifForm.notificationsEnabled}
                  onChange={(val) => setNotifForm({...notifForm, notificationsEnabled: val})}
                />
                <Toggle 
                  label="Email Weekly Summaries" 
                  desc="Get a weekly overview of platform health and student engagement metrics via email."
                  checked={notifForm.emailUpdates}
                  onChange={(val) => setNotifForm({...notifForm, emailUpdates: val})}
                />
              </div>
              <div className="pt-4 border-t border-slate-50 text-right">
                <button 
                  disabled={loading}
                  className="bg-accent text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-accent/20 hover:bg-accent/80 transition-all flex items-center gap-2 disabled:opacity-50 ml-auto"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Preferences
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, onClick, active = false }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-primary text-white shadow-md shadow-primary/20 border border-primary' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    {icon}
    {label}
  </button>
);

const Toggle = ({ label, desc, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <div className="text-sm font-bold text-slate-800">{label}</div>
      <div className="text-xs text-slate-500 mt-1">{desc}</div>
    </div>
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${checked ? 'bg-primary' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export default SettingsPage;
