import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Pill, CheckCircle2, Clock, Calendar, ArrowLeft } from 'lucide-react';

export const MedicineSystem: React.FC = () => {
  const { medicines, toggleMedicineTaken, speakText, setScreen } = useEcosystem();
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-24 flex flex-col gap-6">

      {/* Screen Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-6 h-6 text-emerald-500" /> Medicine Schedule
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">Track daily doses and prescription reminders</p>
          </div>
        </div>

        <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Selector: Today / Upcoming */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'today'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Upcoming
        </button>
      </div>

      {/* Medication Timeline List */}
      <div className="flex flex-col gap-3">
        {medicines.map((med) => (
          <div
            key={med.id}
            className="app-card p-4 sm:p-5 flex items-center justify-between gap-4 app-card-hover"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 shrink-0 min-w-[70px]">
                <Clock className="w-3.5 h-3.5" />
                <span>{med.timeStr}</span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {med.name}
                </h3>
                <p className="text-xs text-slate-500">{med.dosage} • {med.instructions}</p>
              </div>
            </div>

            <button
              onClick={() => {
                toggleMedicineTaken(med.id);
                speakText(med.taken ? `Unmarked ${med.name}` : `Marked ${med.name} taken`);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                med.taken
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100'
              }`}
            >
              {med.taken ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Taken
                </>
              ) : (
                'Upcoming'
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Medicine Adherence Bar Chart */}
      <div className="app-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Medicine Adherence
            </h3>
            <p className="text-xs text-slate-500">Weekly dose compliance analysis</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
              92%
            </span>
            <span className="text-[10px] text-slate-400 block">This Week</span>
          </div>
        </div>

        {/* Weekly Bar Graph */}
        <div className="flex items-end justify-between gap-3 h-32 pt-6 px-2">
          {[
            { day: 'M', height: '80%', active: true },
            { day: 'T', height: '100%', active: true },
            { day: 'W', height: '60%', active: true },
            { day: 'T', height: '90%', active: true },
            { day: 'F', height: '100%', active: true },
            { day: 'S', height: '100%', active: true },
            { day: 'S', height: '75%', active: false },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                  bar.active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
                style={{ height: bar.height }}
              />
              <span className="text-[11px] font-bold text-slate-400">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
