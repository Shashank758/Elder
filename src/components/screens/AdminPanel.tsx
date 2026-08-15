import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { ShieldCheck, Users, Cpu, ShieldAlert, Server, ArrowLeft } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { watchData, setScreen } = useEcosystem();

  const userAccounts = [
    { id: 'u1', name: 'Devendra Kumar', role: 'Elder', device: 'ESP32 Watch #EG-8841', status: 'Active' },
    { id: 'u2', name: 'Rahul Kumar', role: 'Family', device: 'Android PWA WebView', status: 'Active' },
    { id: 'u3', name: 'Dr. A. Sharma', role: 'Doctor', device: 'Web Portal', status: 'Active' },
    { id: 'u4', name: 'Priya Verma', role: 'Caregiver', device: 'iOS PWA WebView', status: 'Active' }
  ];

  const emergencyLogs = [
    { id: 'l1', time: '14:22 PM', event: 'Fall Detection Test Triggered', result: '30s Countdown Cancelled by Senior' },
    { id: 'l2', time: '11:15 AM', event: 'Smart Home Hub MQ-2 Sensor Diagnostics', result: 'Passed 0.0ppm' },
    { id: 'l3', time: '08:02 AM', event: 'Firebase Cloud Messaging Medication Push', result: 'Delivered' }
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-rose-500" /> Admin Fleet Management
            </h1>
            <p className="text-xs text-slate-500">Manage user roles, device telemetry & system logs</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <Server className="w-4 h-4 text-emerald-500" /> Realtime Cloud Operational
        </div>
      </div>

      {/* Grid: User Accounts Table & Device Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User Management Table */}
        <div className="lg:col-span-8 app-card p-6">
          <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-rose-500" />
            Registered User Accounts & Access Control
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">User Name</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Paired Device</th>
                  <th className="p-3 rounded-r-xl text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userAccounts.map(u => (
                  <tr key={u.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-[10px] font-bold">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{u.device}</td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ESP32 Hardware Status */}
        <div className="lg:col-span-4 app-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-cyan-500" />
              Hardware Telemetry Diagnostics
            </h3>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">SMARTWATCH BATTERY</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">{watchData.battery}% (LiPo 420mAh)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">BLE SIGNAL (RSSI)</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold text-base">-58 dBm (Strong)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">SMART HOME SENSORS</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">MQ-2, PIR, MLX90614 Active</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* System Emergency Logs */}
      <div className="app-card p-6">
        <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          System-Wide Emergency & Security Audit Logs
        </h3>

        <div className="flex flex-col gap-2 font-mono text-xs">
          {emergencyLogs.map(l => (
            <div key={l.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">{l.time}</span>
                <span className="text-slate-900 dark:text-white font-semibold">{l.event}</span>
              </div>
              <span className="text-slate-500">{l.result}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
