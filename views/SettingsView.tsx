import React, { useRef } from 'react';
import { useCRM } from '../context/CRMContext';
import { Download, Upload, Trash2, AlertTriangle, FileJson, LogOut, UserX } from 'lucide-react';

const SettingsView: React.FC = () => {
  const { leads, importData, clearData, deleteAccount, signOut, user } = useCRM();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(leads, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genixhub-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importData(json);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure? This will delete all leads stored for your account. This cannot be undone.')) {
      try {
        await clearData();
        alert("Data cleared successfully.");
      } catch (e) {
        alert("Failed to clear data.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm("Are you sure you want to delete your account?");
    if (confirm1) {
      const confirm2 = window.confirm("WARNING: This will permanently delete ALL your leads and sign you out. You cannot recover this data. Type 'DELETE' to confirm (actually, just click OK).");
      if (confirm2) {
        await deleteAccount();
      }
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your data and account preferences.</p>
      </header>

      <div className="space-y-6">
        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
             <h2 className="text-lg font-bold text-slate-800">Account</h2>
             <p className="text-sm text-slate-500">
               Signed in as <span className="font-medium text-slate-900">{user?.user_metadata?.full_name || user?.email}</span>
             </p>
          </div>
          <div className="p-6">
            <button
               onClick={signOut}
               className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <FileJson className="w-5 h-5 mr-2 text-indigo-500" />
              Data Management
            </h2>
            <p className="text-slate-500 text-sm mt-1">Download your leads to keep a backup or import data.</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-medium text-slate-800">Download Data</p>
                <p className="text-xs text-slate-500">Save all leads as a .json file</p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-medium text-slate-800">Import Data</p>
                <p className="text-xs text-slate-500">Restore leads from a backup file</p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
          <div className="p-6 border-b border-red-50 bg-red-50/50">
            <h2 className="text-lg font-bold text-red-700 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Danger Zone
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Clear Database</p>
                <p className="text-xs text-slate-500">Remove all leads from the database for this account.</p>
              </div>
              <button
                onClick={handleClear}
                className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors shadow-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-medium text-red-700">Delete Account</p>
                <p className="text-xs text-slate-500">Permanently delete your data and sign out.</p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <UserX className="w-4 h-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;