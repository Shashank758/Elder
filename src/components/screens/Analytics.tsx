import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { FileText, Download, ArrowLeft, Settings, Heart, Moon, Pill, Sparkles, Activity } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { setScreen } = useEcosystem();
  const [tab, setTab] = useState<'health' | 'activity' | 'medicine'>('health');
  const [range, setRange] = useState<'7' | '30' | '90' | 'custom'>('7');

  const reports = [
    { title: 'Health Summary Report', dates: 'May 18 – May 24, 2024', icon: <Activity className="w-5 h-5 text-blue-500" /> },
    { title: 'Heart Health Report', dates: 'May 18 – May 24, 2024', icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { title: 'Sleep Quality Report', dates: 'May 18 – May 24, 2024', icon: <Moon className="w-5 h-5 text-indigo-500" /> },
    { title: 'Medicine Adherence Report', dates: 'May 18 – May 24, 2024', icon: <Pill className="w-5 h-5 text-emerald-500" /> },
    { title: 'AI Health Insights Report', dates: 'May 18 – May 24, 2024', icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-24 flex flex-col gap-6">

      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" /> Medical Reports
          </h1>
        </div>

        <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Selector: Health Report / Activity / Medicine */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800 w-fit">
        {(['health', 'activity', 'medicine'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              tab === t
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t} Report
          </button>
        ))}
      </div>

      {/* Range Pills: 7 Days / 30 Days / 90 Days / Custom */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: '7', label: '7 Days' },
          { id: '30', label: '30 Days' },
          { id: '90', label: '90 Days' },
          { id: 'custom', label: 'Custom' },
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setRange(r.id as any)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              range === r.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Reports PDF Download List */}
      <div className="flex flex-col gap-3">
        {reports.map((rep, idx) => (
          <div
            key={idx}
            className="app-card p-4 sm:p-5 flex items-center justify-between gap-4 app-card-hover"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                {rep.icon}
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {rep.title}
                </h3>
                <span className="text-[11px] text-slate-400 block mt-0.5">{rep.dates}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading PDF: ${rep.title}`)}
              className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
