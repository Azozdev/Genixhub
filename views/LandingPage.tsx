
import React, { useState } from 'react';
import { Briefcase, Check, ArrowRight, LayoutDashboard, BarChart3, Shield, Zap, Sun, Moon } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const toggleBilling = () => {
    setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly');
  };

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
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Pricing</a>
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
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden relative">
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
            <a 
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300"
            >
              View Pricing
            </a>
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

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">Key Features</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Everything you need to scale</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <LayoutDashboard className="w-6 h-6 text-white" />,
                color: "bg-blue-500",
                title: "Kanban Pipeline",
                desc: "Visualize your sales process. Drag and drop leads from 'Contacted' to 'Won' with zero friction."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-white" />,
                color: "bg-emerald-500",
                title: "Smart Analytics",
                desc: "Real-time insights into your revenue, conversion rates, and pipeline value."
              },
              {
                icon: <Shield className="w-6 h-6 text-white" />,
                color: "bg-violet-500",
                title: "Secure Cloud Sync",
                desc: "Your data is encrypted and synced instantly via Supabase. Access it from any device."
              },
              {
                icon: <Sun className="w-6 h-6 text-white" />,
                color: "bg-amber-500",
                title: "Light & Dark Mode",
                desc: "Work comfortably in any lighting condition with our fully supported themes."
              },
              {
                icon: <Zap className="w-6 h-6 text-white" />,
                color: "bg-rose-500",
                title: "Instant Setup",
                desc: "No complex onboarding. Sign up and start managing leads in less than 30 seconds."
              },
              {
                icon: <Check className="w-6 h-6 text-white" />,
                color: "bg-indigo-500",
                title: "Data Export",
                desc: "Your data belongs to you. Export your entire lead database to JSON anytime."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-300 group">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-600">Choose the plan that fits your business stage.</p>
            
            {/* Billing Toggle */}
            <div className="mt-8 flex justify-center items-center gap-4">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                <button 
                    onClick={toggleBilling}
                    className="w-16 h-8 bg-slate-200 rounded-full p-1 relative transition-colors duration-300 focus:outline-none"
                >
                    <div className={`w-6 h-6 bg-indigo-600 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'annual' ? 'translate-x-8' : ''}`} />
                </button>
                <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
                    Annually <span className="text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-0.5 rounded-full ml-1">SAVE BIG</span>
                </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative hover:-translate-y-2 transition-transform duration-300">
              {billingCycle === 'annual' && (
                   <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                       LIMITED DISCOUNT
                   </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                <p className="text-slate-500 mb-6">Perfect for freelancers just starting out.</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-extrabold text-slate-900">
                    ${billingCycle === 'monthly' ? '19' : '50'}
                  </span>
                  <span className="text-slate-500 ml-2">/{billingCycle === 'monthly' ? 'mo' : 'year'}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited Leads', 'Kanban Board', 'Basic Analytics', 'Email Support'].map((item, i) => (
                    <li key={i} className="flex items-center text-slate-600">
                      <Check className="w-5 h-5 text-indigo-500 mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                    onClick={onLogin}
                    className="w-full py-3 px-6 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-colors"
                >
                    Get Started
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-2">
                   <h3 className="text-2xl font-bold text-white">Pro</h3>
                   <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Popular</span>
                </div>
                <p className="text-slate-400 mb-6">For serious freelancers scaling up.</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-extrabold text-white">
                    ${billingCycle === 'monthly' ? '35' : '90'}
                  </span>
                  <span className="text-slate-400 ml-2">/{billingCycle === 'monthly' ? 'mo' : 'year'}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Everything in Starter', 'Advanced Analytics', 'Priority Support', 'Data Export', 'Custom Tags'].map((item, i) => (
                    <li key={i} className="flex items-center text-slate-300">
                      <div className="bg-indigo-500/20 p-1 rounded-full mr-3">
                        <Check className="w-4 h-4 text-indigo-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                    onClick={onLogin}
                    className="w-full py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20"
                >
                    Start Free Trial
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 text-slate-500 text-sm">
            No credit card required for the 14-day trial.
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
