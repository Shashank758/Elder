import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { ShieldAlert, PhoneCall, MapPin, QrCode, ArrowLeft } from 'lucide-react';

export const EmergencyCenter: React.FC = () => {
  const { triggerFallAlert, setScreen } = useEcosystem();

  const emergencyServices = [
    { title: 'Max Super Speciality Hospital', type: 'Hospital', dist: '1.2 km', phone: '+91 11 2651 5050', action: 'Call Hospital' },
    { title: 'Emergency CATS Ambulance 108', type: 'Ambulance', dist: '0.8 km', phone: '108', action: 'Dispatch 108' },
    { title: 'Vasant Vihar Police Control', type: 'Police', dist: '1.5 km', phone: '100', action: 'Call Police' },
    { title: 'Apollo 24/7 Pharmacy', type: 'Pharmacy', dist: '0.4 km', phone: '+91 11 4110 4110', action: 'Call Pharmacy' }
  ];

  const emergencyContacts = [
    { name: 'Rahul Kumar', relation: 'Son (Primary Guardian)', phone: '+91 98765 43210' },
    { name: 'Dr. A. Sharma', relation: 'Consulting Cardiologist', phone: '+91 98110 12345' },
    { name: 'Priya Verma', relation: 'Daughter', phone: '+91 98100 55443' }
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24">
      
      {/* Top Banner & Giant SOS */}
      <div className="app-card p-6 sm:p-8 border-2 border-rose-500 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-slate-900 dark:to-slate-900">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors shrink-0 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-600 dark:text-rose-400 mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-500 animate-bounce" />
              <span>INSTANT EMERGENCY DISPATCH ENGINE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white">
              Emergency SOS Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-lg">
              One-touch emergency trigger instantly shares GPS coordinates, activates watch vibration sirens & notifies family.
            </p>
          </div>
        </div>

        {/* Giant Red SOS Trigger Button */}
        <button
          onClick={triggerFallAlert}
          className="w-36 h-36 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 text-white font-extrabold font-heading text-2xl shadow-xl shadow-rose-500/30 border-4 border-rose-200 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center shrink-0 animate-pulse"
        >
          <span>SOS</span>
          <span className="text-[10px] font-mono font-normal tracking-widest text-white/90">PUSH 3 SEC</span>
        </button>
      </div>

      {/* Grid: Paramedic Medical QR Card & Nearby Emergency Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Paramedic QR Emergency Card */}
        <div className="lg:col-span-5 app-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">Paramedic QR Profile</h3>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">VERIFIED</span>
            </div>

            {/* QR Visual */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 dark:border-slate-700 text-slate-950 shadow-inner mb-4">
              <div className="w-32 h-32 bg-slate-950 p-2 rounded-xl flex items-center justify-center text-white font-mono text-[9px] text-center">
                <QrCode className="w-28 h-28 text-white" />
              </div>
              <span className="text-[11px] font-mono font-bold mt-2 text-slate-800">Scan for Paramedic History</span>
            </div>

            {/* Medical Data Badges */}
            <div className="flex flex-col gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-500">BLOOD GROUP:</span>
                <span className="font-bold text-rose-500">O Positive (O+)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-500">ALLERGIES:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Penicillin, Sulfa Drugs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-500">DISEASES:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">Hypertension, Mild Fall Risk</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 text-center">
            HIPAA Paramedic Emergency Card Standard
          </div>
        </div>

        {/* Nearby Emergency Services Locator */}
        <div className="lg:col-span-7 app-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-rose-500" />
              Nearby Emergency Services (Auto-Located)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {emergencyServices.map((es, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-rose-500 font-bold">{es.type}</span>
                      <span className="text-slate-400">{es.dist}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{es.title}</h4>
                  </div>
                  <a
                    href={`tel:${es.phone}`}
                    className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-500/20 hover:bg-rose-100 text-rose-600 dark:text-rose-300 font-bold text-xs text-center border border-rose-200 dark:border-rose-500/30 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> {es.action}
                  </a>
                </div>
              ))}
            </div>

            {/* Emergency Contacts */}
            <h4 className="text-sm font-bold font-heading text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-blue-500" />
              Designated Emergency Contacts
            </h4>

            <div className="flex flex-col gap-2">
              {emergencyContacts.map(ec => (
                <div key={ec.name} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{ec.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{ec.relation}</span>
                  </div>
                  <a href={`tel:${ec.phone}`} className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 font-mono font-bold text-[11px]">
                    {ec.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
