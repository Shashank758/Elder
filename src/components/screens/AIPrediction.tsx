import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { BrainCircuit, Sparkles, TrendingUp, Activity, ShieldAlert, ArrowLeft } from 'lucide-react';

export const AIPrediction: React.FC = () => {
  const { watchData, setScreen } = useEcosystem();

  const predictions = [
    {
      title: 'Cardiovascular Risk Trend (7-Day Projection)',
      status: 'Low Risk (Optimal)',
      confidence: '96% AI Neural Accuracy',
      desc: 'Resting pulse stability & heart rate variability index indicate healthy cardiac recovery.',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
    },
    {
      title: 'Fall Probability Assessment (Kinematic Gait Analysis)',
      status: 'Mild Risk (12%)',
      confidence: '91% Model Confidence',
      desc: 'Slight hesitation observed during morning walking routine. Recommended light indoor balance exercises.',
      badgeColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
    },
    {
      title: 'Hypertension Spike Warning',
      status: 'No Spike Detected',
      confidence: '98% Model Confidence',
      desc: 'Blood pressure remains within target range (122/78 mmHg) post-lunch.',
      badgeColor: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full pb-24">
      
      {/* Screen Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-blue-500" /> AI Health Analytics
            </h1>
            <p className="text-xs text-slate-500">Autonomous early warnings powered by sensor telemetry</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
          <Sparkles className="w-4 h-4 text-blue-500" /> v3.8 AI Model Active
        </div>
      </div>

      {/* AI Score Overview */}
      <div className="app-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-900">
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">COMPREHENSIVE SENIOR WELLNESS INDEX</span>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            AI Protection Score: <span className="text-blue-600 dark:text-blue-400">{watchData.aiHealthScore}/100</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated from MPU6050 Motion, MAX30102 PPG Pulse, MLX90614 Temp & Sleep Patterns.
          </p>
        </div>

        <div className="w-28 h-28 rounded-full border-4 border-blue-500/40 border-t-blue-500 flex flex-col items-center justify-center font-heading font-extrabold text-blue-600 dark:text-blue-400 text-2xl shadow-md shrink-0">
          <span>94%</span>
          <span className="text-[9px] font-mono text-slate-400">STABILITY</span>
        </div>
      </div>

      {/* Predictive Risk Cards Header */}
      <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2 mt-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        AI Predictive Health Risk Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {predictions.map((p, idx) => (
          <div key={idx} className="app-card p-6 flex flex-col justify-between app-card-hover">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${p.badgeColor}`}>{p.status}</span>
              </div>
              <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white mb-2">{p.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{p.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-500" /> Live Update
              </span>
              <span>{p.confidence}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
        <span>
          Clinical Disclaimer: ElderGuard AI predictive models are designed for continuous health assistance and early triage. Always consult Dr. A. Sharma for medical diagnoses.
        </span>
      </div>

    </div>
  );
};
