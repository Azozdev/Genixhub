import React, { Suspense, useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Loader2, LogOut, CheckCircle } from 'lucide-react';
// @ts-ignore
import { WhopCheckout as WhopCheckoutEmbed } from '@whop/react-checkout';

const SubscriptionView: React.FC = () => {
  const { signOut, updateSubscription } = useCRM();
  const [activating, setActivating] = useState(false);

  const handleActivation = async () => {
    setActivating(true);
    await updateSubscription();
    // Adding a slight delay to allow state to propagate
    setTimeout(() => {
       setActivating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[90vh]">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
          <h1 className="font-bold text-lg text-slate-900 dark:text-white">Choose a Plan</h1>
          <button 
            onClick={signOut}
            className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto relative">
           <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>}>
              <WhopCheckoutEmbed planId="plan_aHmxjAB9Y8Oin" />
           </Suspense>
        </div>

        {/* Manual Activation / Check for demo purposes since we don't have a backend webhook */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
            After completing your purchase, click the button to access your dashboard.
          </p>
          <button
            onClick={handleActivation}
            disabled={activating}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-all flex items-center"
          >
            {activating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Complete Activation
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionView;