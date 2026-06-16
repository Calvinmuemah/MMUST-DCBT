import React from 'react';
import { User, Shield, Bell, Lock } from 'lucide-react';

const SettingsPage = () => {
  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-dark">Account Settings</h1>
        <p className="text-text-light mt-1">Manage your administrative profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <SettingsTab active icon={<User size={18} />} label="Profile Information" />
          <SettingsTab icon={<Shield size={18} />} label="Security" />
          <SettingsTab icon={<Bell size={18} />} label="Notifications" />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-6">Profile Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-light mb-1.5">Full Name</label>
                <div className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-text-dark font-medium">
                  {user.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-1.5">Email Address</label>
                <div className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-text-dark font-medium">
                  {user.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light mb-1.5">Role</label>
                <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                  {user.role}
                </div>
              </div>
            </div>
          </div>

          <div className="card border-red-100 bg-red-50/30">
            <h3 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600/70 mb-6">Irreversible actions for your administrator account.</p>
            <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
              Deactivate Admin Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-white shadow-sm border border-slate-100 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon}
    {label}
  </button>
);

export default SettingsPage;
