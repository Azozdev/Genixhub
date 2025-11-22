import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">GenixHub</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={onLogin}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors hidden sm:block"
              >
                Sign In
              </button>
              <button 
                onClick={onLogin}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden relative min-h-screen flex flex-col justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-400/20 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0 Now Available
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Supercharge Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Freelance Business</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Manage leads, track projects, and analyze revenue with a powerful, local-first CRM designed specifically for solo entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start for Free <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="rounded-2xl bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-900/10">
               <div className="rounded-xl overflow-hidden bg-slate-800 aspect-[16/9] relative group">
                 {/* Abstract UI Representation */}
                 <div className="absolute inset-0 bg-slate-900 flex">
                    <div className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 space-y-4 hidden md:block">
                        <div className="h-8 w-32 bg-slate-800 rounded-lg mb-8"></div>
                        <div className="h-4 w-full bg-slate-800/50 rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-slate-800/50 rounded mb-2"></div>
                        <div className="h-4 w-5/6 bg-slate-800/50 rounded"></div>
                    </div>
                    <div className="flex-1 p-6 bg-slate-950">
                        <div className="flex gap-6 h-full">
                           <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-4">
                              <div className="w-full h-32 bg-indigo-500/10 rounded-lg mb-4 border border-indigo-500/20"></div>
                              <div className="w-full h-24 bg-slate-800 rounded-lg"></div>
                           </div>
                           <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-4 mt-12">
                               <div className="w-full h-24 bg-slate-800 rounded-lg mb-4"></div>
                               <div className="w-full h-24 bg-slate-800 rounded-lg"></div>
                           </div>
                           <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-4">
                               <div className="w-full h-40 bg-emerald-500/10 rounded-lg mb-4 border border-emerald-500/20"></div>
                           </div>
                        </div>
                    </div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onLogin} className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Launch Demo
                    </button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl text-slate-900">GenixHub</span>
          </div>
          <p className="text-slate-500 mb-8">© 2024 GenixHub CRM. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;