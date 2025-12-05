import React, { useState } from 'react';
import { LayoutDashboard, Package, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { ViewState, User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, user, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-20">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="font-bold text-xl">I</span>
        </div>
        <h1 className="text-lg font-bold tracking-wide">Inventory Assistant</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onChangeView(ViewState.DASHBOARD)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentView === ViewState.DASHBOARD
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onChangeView(ViewState.INVENTORY)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentView === ViewState.INVENTORY
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Package size={20} />
          <span>Inventory</span>
        </button>

        <button
          onClick={() => onChangeView(ViewState.SETTINGS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentView === ViewState.SETTINGS
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400">
                <UserIcon size={16} />
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
        </div>
        
        {!showLogoutConfirm ? (
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <div className="bg-slate-800 p-3 rounded-lg border border-red-900/30 animate-fade-in">
             <p className="text-xs text-red-300 font-medium mb-2 text-center">Confirm Logout?</p>
             <div className="flex gap-2">
                <button 
                  onClick={onLogout}
                  className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-colors"
                >
                  Yes
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold rounded transition-colors"
                >
                  No
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;