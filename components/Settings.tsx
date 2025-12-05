
import React, { useState } from 'react';
import { Moon, Sun, Trash, AlertTriangle, Database, X, Check } from 'lucide-react';

interface SettingsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, toggleDarkMode, onReset }) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleResetClick = () => {
    if (confirmReset) {
      onReset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
    }
  };

  return (
    <div className="p-8 animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your application preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              Appearance
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark themes.</p>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  darkMode ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                } flex items-center justify-center`}>
                    {darkMode ? <Moon size={14} className="text-indigo-600" /> : <Sun size={14} className="text-yellow-500" />}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Database size={20} className="text-indigo-500" />
              Data Management
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Reset Inventory & Sales</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete all products and sales history. This cannot be undone.</p>
              </div>
              
              {!confirmReset ? (
                <button 
                  onClick={() => setConfirmReset(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-800 dark:text-red-400 transition-colors"
                >
                  <Trash size={18} />
                  <span>Reset Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400 animate-pulse">
                    Are you sure?
                  </span>
                  <button 
                    onClick={handleResetClick}
                    className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                  >
                    <Check size={16} />
                    <span>Confirm</span>
                  </button>
                  <button 
                    onClick={() => setConfirmReset(false)}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
