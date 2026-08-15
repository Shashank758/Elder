import React, { useState } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { Stethoscope, Download, Plus, UserCheck, ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const DoctorDashboard: React.FC = () => {
  const { watchData, medicines, addMedicine, setScreen } = useEcosystem();

  const [selectedPatient, setSelectedPatient] = useState('Devendra Kumar');
  const [showRxModal, setShowRxModal] = useState(false);
  const [newRxName, setNewRxName] = useState('');
  const [newRxDose, setNewRxDose] = useState('');

  const ecgHistoryData = [
    { time: '08:00', hr: 72, spO2: 98, bp: 120 },
    { time: '10:00', hr: 75, spO2: 98, bp: 122 },
    { time: '12:00', hr: 78, spO2: 97, bp: 124 },
    { time: '14:00', hr: 73, spO2: 99, bp: 121 },
    { time: '16:00', hr: 74, spO2: 98, bp: 122 }
  ];

  const patientsList = [
    { name: 'Devendra Kumar', age: 82, condition: 'Hypertension, Mild Fall Risk', status: 'Stable' },
    { name: 'Savitri Devi', age: 78, condition: 'Type 2 Diabetes', status: 'Review Due' },
    { name: 'Ramesh Sharma', age: 85, condition: 'Post-Stroke Recovery', status: 'Stable' }
  ];

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleAddRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRxName) return;
    addMedicine({
      name: newRxName,
      dosage: newRxDose || '1 Tablet',
      timing: 'Morning',
      timeStr: '09:00 AM',
      instructions: 'Prescribed by Dr. A. Sharma (Cardiologist)',
      icon: 'Pill'
    });
    setNewRxName('');
    setNewRxDose('');
    setShowRxModal(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 print:bg-white print:text-black">
      
      {/* Header */}
      <div className="app-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-900 print:hidden">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors shrink-0 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-600 dark:text-purple-400 mb-1">
              <Stethoscope className="w-4 h-4 text-purple-500" />
              <span>Cardiology & Geriatric Clinical Portal • Dr. A. Sharma (MD)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              Doctor Clinical Telemetry & Prescription Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Continuous ECG Lead telemetry, remote clinical trends & AI diagnostic synthesis.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" /> Download Medical PDF
        </button>
      </div>

      {/* Patient Selector & Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Roster list */}
        <div className="lg:col-span-4 app-card p-5 print:hidden">
          <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-500" />
            Geriatric Patient Roster
          </h3>

          <div className="flex flex-col gap-2.5">
            {patientsList.map(p => (
              <div
                key={p.name}
                onClick={() => setSelectedPatient(p.name)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedPatient === p.name
                    ? 'bg-purple-50 dark:bg-purple-500/20 border-purple-400 text-purple-900 dark:text-purple-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                  <span>{p.name} ({p.age} yrs)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">{p.status}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">{p.condition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Summary & ECG Chart */}
        <div className="lg:col-span-8 app-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">{selectedPatient} — Clinical Summary</h3>
                <p className="text-xs font-mono text-purple-600 dark:text-purple-300">ESP32 MAX30102 Stream • AI Diagnosis: Sinus Rhythm Normal</p>
              </div>
              <button
                onClick={() => setShowRxModal(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-400 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 print:hidden"
              >
                <Plus className="w-4 h-4" /> Add Rx Prescription
              </button>
            </div>

            {/* Vitals Cards */}
            <div className="grid grid-cols-4 gap-3 my-4">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">HEART RATE</span>
                <span className="text-lg font-bold text-rose-500">{watchData.heartRate} BPM</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">SpO2</span>
                <span className="text-lg font-bold text-cyan-500">{watchData.spO2}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">BP</span>
                <span className="text-lg font-bold text-purple-500">{watchData.systolicBp}/{watchData.diastolicBp}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">TEMP</span>
                <span className="text-lg font-bold text-amber-500">{watchData.temperature}°F</span>
              </div>
            </div>

            {/* ECG Recharts Trend */}
            <div className="my-4">
              <h4 className="text-xs font-mono text-slate-400 mb-2">24-HOUR CLINICAL HEART RATE TREND</h4>
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ecgHistoryData}>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis domain={[50, 110]} stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                    <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Current Prescriptions List */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 font-mono">ACTIVE RX MEDICINES</h4>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {medicines.map(m => (
                <span key={m.id} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {m.name} ({m.dosage})
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Add Rx Prescription Modal */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddRx} className="app-card w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Prescribe New Medication</h3>
            
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Medication Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Losartan 25mg"
                value={newRxName}
                onChange={e => setNewRxName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Dosage & Instructions</label>
              <input
                type="text"
                placeholder="e.g. 1 Tablet once daily"
                value={newRxDose}
                onChange={e => setNewRxDose(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowRxModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Prescribe
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
