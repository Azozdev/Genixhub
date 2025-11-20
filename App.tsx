import React, { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import Sidebar from './components/Sidebar';
import PipelineView from './views/PipelineView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import AuthView from './views/AuthView';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useCRM();
  const [currentView, setCurrentView] = useState('pipeline');

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'pipeline':
        return <PipelineView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <PipelineView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-full ml-20 lg:ml-64 transition-all duration-300 w-full relative overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
};

export default App;