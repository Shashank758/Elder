import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Activity, Flame, Navigation, Clock, Calendar, ArrowLeft, Footprints } from 'lucide-react';

export const MotionAnalysis: React.FC = () => {
  const { setScreen } = useEcosystem();
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');

  const activityList = [
    { time: '10:30 AM', title: 'Walking', duration: '30 min', detail: '2.1 km', icon: <Footprints className="w-4 h-4 text-blue-500" /> },
    { time: '08:15 AM', title: 'Light Exercise', duration: '15 min', detail: '120 kcal', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
    { time: '07:30 AM', title: 'Morning Walk', duration: '20 min', detail: '1.1 km', icon: <Footprints className="w-4 h-4 text-indigo-500" /> },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-24 flex flex-col gap-6">

      {/* Screen Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" /> Activity Monitor
          </h1>
        </div>

        <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {/* Time Selector Tabs: Day / Week / Month */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800 w-fit mx-auto sm:mx-0">
        {(['day', 'week', 'month'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Steps Circular Goal Gauge Card */}
      <div className="app-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <span className="text-xs font-semibold text-slate-400 block mb-1">TOTAL STEPS TODAY</span>
          <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            4,256
          </div>
          <span className="text-xs text-slate-500 font-medium">Goal: 7,000 steps</span>
        </div>

        {/* Big Ring Progress */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-slate-100 dark:text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-emerald-500" strokeDasharray="61, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute text-center">
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">61%</span>
          </div>
        </div>
      </div>

      {/* 3 Metrics Cards Row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="app-card p-4 text-center">
          <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-base font-extrabold text-slate-900 dark:text-white">1,245</div>
          <span className="text-[10px] text-slate-400 font-medium">Calories (kcal)</span>
        </div>

        <div className="app-card p-4 text-center">
          <Navigation className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="text-base font-extrabold text-slate-900 dark:text-white">3.2</div>
          <span className="text-[10px] text-slate-400 font-medium">Distance (km)</span>
        </div>

        <div className="app-card p-4 text-center">
          <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <div className="text-base font-extrabold text-slate-900 dark:text-white">48</div>
          <span className="text-[10px] text-slate-400 font-medium">Active Time (min)</span>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="app-card p-6">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-4">
          Activity Timeline
        </h3>

        <div className="flex flex-col gap-3">
          {activityList.map((act, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-2xs">
                  {act.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{act.title}</h4>
                  <span className="text-[10px] text-slate-400">{act.time}</span>
                </div>
              </div>

              <div className="text-right text-xs font-semibold text-slate-500">
                <span>{act.duration}</span>
                <span className="text-[10px] text-slate-400 block">{act.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
