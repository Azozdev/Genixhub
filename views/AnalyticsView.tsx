import React from 'react';
import { useCRM } from '../context/CRMContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, TrendingUp, Award } from 'lucide-react';

const AnalyticsView: React.FC = () => {
  const { leads } = useCRM();

  const totalPipelineValue = leads.reduce((sum, lead) => lead.status !== 'WON' ? sum + lead.value : sum, 0);
  const wonRevenue = leads.filter(l => l.status === 'WON').reduce((sum, l) => sum + l.value, 0);
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === 'WON').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

  const data = [
    { name: 'Leads', value: leads.filter(l => l.status === 'LEADS').reduce((s, l) => s + l.value, 0), color: '#94a3b8' },
    { name: 'Contacted', value: leads.filter(l => l.status === 'CONTACTED').reduce((s, l) => s + l.value, 0), color: '#60a5fa' },
    { name: 'Negotiation', value: leads.filter(l => l.status === 'NEGOTIATION').reduce((s, l) => s + l.value, 0), color: '#f97316' },
    { name: 'Won', value: wonRevenue, color: '#22c55e' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Track your performance and revenue.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Pipeline</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalPipelineValue)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Revenue Won</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(wonRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
            <p className="text-2xl font-bold text-slate-800">{conversionRate}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue by Stage</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => [formatCurrency(val), 'Value']}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;