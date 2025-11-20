import React from 'react';
import { LayoutDashboard, BarChart3, Settings, Briefcase } from 'lucide-react';
import { useCRM } from '../context/CRMContext';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const { user } = useCRM();
  const navItems = [
    { id: 'pipeline', label: 'Pipeline', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Extract name from metadata or use email prefix
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col h-full fixed left-0 top-0 z-30 transition-all duration-300">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
        <div className="bg-indigo-600 p-1.5 rounded-lg mr-0 lg:mr-3">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl text-slate-800 hidden lg:block">GenixHub</span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-2 lg:px-4">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon
                className={`w-6 h-6 lg:w-5 lg:h-5 lg:mr-3 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <span className={`font-medium hidden lg:block ${isActive ? 'text-indigo-700' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 hidden lg:block">
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Signed in as</p>
          <p className="text-sm font-bold text-slate-800 truncate" title={user?.user_metadata?.full_name}>
            {displayName}
          </p>
          <p className="text-xs text-slate-500 truncate" title={user?.email}>
            {user?.email}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;