import React, { useState, useEffect } from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { ElderGuardAIService } from '../../services/ai360/elderGuardAIService';
import type { AI360State, HumanFeedback } from '../../services/ai360/types';
import {
  BrainCircuit, Activity, AlertTriangle, Clock, UserCheck,
  ThumbsUp, ThumbsDown, Sparkles, CheckCircle2, Sliders,
  Terminal, Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ElderGuardAI360Screen: React.FC = () => {
  const { watchData, homeSensors } = useEcosystem();

  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [demoScenario, setDemoScenario] = useState<string | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);

  const [aiState, setAiState] = useState<AI360State>(() =>
    ElderGuardAIService.processPipeline(watchData, homeSensors, false, null)
  );

  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);

  // Continuously process single source snapshot pipeline whenever Firebase telemetry updates
  useEffect(() => {
    const updatedState = ElderGuardAIService.processPipeline(
      watchData,
      homeSensors,
      isDemoMode,
      demoScenario
    );
    setAiState(updatedState);
  }, [watchData, homeSensors, isDemoMode, demoScenario]);

  const handleFeedback = (type: HumanFeedback['feedback']) => {
    const feedback: HumanFeedback = {
      eventId: `evt_${Date.now()}`,
      userId: 'elder001',
      timestamp: Date.now(),
      feedback: type
    };
    ElderGuardAIService.submitFeedback(feedback);
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  const risk = aiState.riskAssessment;
  const context = aiState.context;
  const baseline = aiState.personalBaseline;
  const snapshot = aiState.snapshot;
  const dataQuality = aiState.dataQuality;

  const riskColor =
    risk.level === 'CRITICAL'
      ? 'bg-rose-600 text-white'
      : risk.level === 'HIGH'
      ? 'bg-amber-600 text-white'
      : risk.level === 'MODERATE'
      ? 'bg-yellow-500 text-slate-900'
      : 'bg-emerald-600 text-white';

  const riskBorder =
    risk.level === 'CRITICAL'
      ? 'border-rose-500/50'
      : risk.level === 'HIGH'
      ? 'border-amber-500/50'
      : risk.level === 'MODERATE'
      ? 'border-yellow-500/50'
      : 'border-emerald-500/30';

  const actBaselineWindow = baseline.activity[context.timeOfDay]?.[context.dayType];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full pb-28 flex flex-col gap-6">

      {/* Screen Title & Top Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <BrainCircuit className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              ElderGuard AI 360
            </h1>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${
              isDemoMode
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30'
                : 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20'
            }`}>
              {isDemoMode ? 'DEMO SIMULATOR ACTIVE' : 'PRODUCTION INTELLIGENCE'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time behavioral baseline learning, context evaluation & multi-sensor anomaly fusion for <strong>Devendra Kumar (78y)</strong>
          </p>
        </div>

        {/* Action Buttons: Debug Panel & Demo Mode */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 border transition-all ${
              showDebugPanel
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>AI Debug Panel</span>
          </button>

          <button
            onClick={() => {
              setIsDemoMode(!isDemoMode);
              if (isDemoMode) setDemoScenario(null);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
              isDemoMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isDemoMode ? 'DEMO MODE ACTIVE' : 'Enable Demo Mode'}</span>
          </button>
        </div>
      </div>

      {/* Demo Mode Scenario Selector Suite */}
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="app-card p-4 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-amber-500/40 text-slate-900 dark:text-white flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> DEMO SCENARIO TEST SUITE (REAL FIREBASE SENSORS PAUSED)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Executes same pipeline as production</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              { id: 'normal_night', label: '🌙 Normal Night (Sleep)' },
              { id: 'normal_morning', label: '☀️ Normal Morning' },
              { id: 'low_activity_day', label: '🟡 Low Activity Day' },
              { id: 'elevated_hr', label: '🟠 Elevated HR (134 BPM)' },
              { id: 'possible_fall', label: '🔴 Possible Fall' },
              { id: 'prolonged_inactivity', label: '⏳ Prolonged Inactivity' },
              { id: 'multi_sensor_emergency', label: '🚨 Fall & SOS Critical' },
              { id: 'invalid_sensor_data', label: '⚠️ Invalid Sensor (999°C)' },
              { id: 'sensor_disconnect', label: '📡 Disconnect / Stale' },
              { id: 'learning', label: '📊 Learning Stage' }
            ].map(scen => (
              <button
                key={scen.id}
                onClick={() => setDemoScenario(scen.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  demoScenario === scen.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-amber-300 dark:border-amber-900/50 hover:bg-amber-50'
                }`}
              >
                {scen.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 35. SECTION: DEVELOPER AI DEBUG PANEL */}
      {showDebugPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="app-card p-5 bg-slate-950 text-cyan-400 border border-purple-500/40 font-mono text-xs flex flex-col gap-4 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-purple-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              AI PIPELINE DEBUG INFORMATION (DETERMINISTIC DATA FLOW)
            </span>
            <span className="text-[10px] text-slate-500">Model: {risk.modelVersion} | Alg: {risk.algorithmVersion}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-slate-400 block border-b border-slate-800 pb-1">1. SNAPSHOT & FRESHNESS</strong>
              <div>Event Timestamp: {snapshot.eventTimestamp}</div>
              <div>Processed At: {snapshot.processedAt}</div>
              <div>Freshness: <span className={snapshot.freshness === 'FRESH' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{snapshot.freshness}</span> ({snapshot.ageSeconds}s)</div>
              <div>Source: {snapshot.source}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-slate-400 block border-b border-slate-800 pb-1">2. CONTEXT & CLASSIFICATION</strong>
              <div>Time Window: {context.timeOfDay} ({context.hour}:00)</div>
              <div>Day Type: {context.dayType}</div>
              <div>Activity State: <span className="text-cyan-300 font-bold">{context.activityState}</span></div>
              <div>Environment State: {context.environmentalState}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-slate-400 block border-b border-slate-800 pb-1">3. BASELINE & STATS</strong>
              <div>Baseline Stage: {baseline.baselineStage}</div>
              <div>Baseline Confidence: {baseline.baselineConfidence}%</div>
              <div>Resting HR Mean: {baseline.heartRate.restingMean} ± {baseline.heartRate.restingStd} BPM</div>
              <div>Expected Act Mean: {((actBaselineWindow?.mean || 0.48) * 100).toFixed(0)}%</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-slate-400 block border-b border-slate-800 pb-1">4. RISK vs DATA QUALITY</strong>
              <div>Health Risk Score: <span className="text-rose-400 font-bold">{risk.score} / 100</span> ({risk.level})</div>
              <div>Data Quality Score: <span className="text-amber-300 font-bold">{dataQuality.score} / 100</span> ({dataQuality.level})</div>
              <div>AI Confidence Score: <span className="text-purple-300 font-bold">{risk.confidence}%</span></div>
              <div>Warnings Count: {dataQuality.warnings.length}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 1. TOP AI SAFETY COMMAND STATUS CARD */}
      <div className={`app-card p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-[#0b0f19] text-white border ${riskBorder} shadow-2xl flex flex-col gap-6 relative overflow-hidden`}>
        
        {/* Glow Accent */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ${riskColor}`}>
              {risk.score}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">HEALTH RISK SCORE</span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${riskColor}`}>
                  {risk.level} RISK
                </span>
              </div>
              <h2 className="text-xl font-bold font-heading text-white mt-0.5 flex items-center gap-2">
                Status: <span className="text-purple-300">{risk.aiStatus}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {/* SEPARATE DATA QUALITY DIMENSION BADGE */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 block">DATA QUALITY</span>
              <span className={`font-bold text-xs uppercase ${
                dataQuality.level === 'GOOD' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {dataQuality.level} ({dataQuality.score}%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 block">AI CONFIDENCE</span>
              <span className="text-cyan-400 font-bold text-base">{risk.confidence}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 block">BASELINE STAGE</span>
              <span className="text-purple-300 font-bold text-xs uppercase">{baseline.baselineStage}</span>
            </div>
          </div>
        </div>

        {/* 4 Health Gauges Grid (Single Source of Truth) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-slate-400 text-[10px] block">CURRENT HEART RATE</span>
            <span className="text-rose-400 font-bold text-lg">
              {snapshot.heartRate !== null ? `${snapshot.heartRate} BPM` : 'Unavailable'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Baseline: {baseline.heartRate.restingMean} ± {baseline.heartRate.restingStd} BPM
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-slate-400 text-[10px] block">ACTIVITY LEVEL</span>
            <span className="text-cyan-400 font-bold text-lg">{(snapshot.activityLevel * 100).toFixed(0)}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Baseline: {((actBaselineWindow?.mean || 0.48) * 100).toFixed(0)}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-slate-400 text-[10px] block">INACTIVITY DURATION</span>
            <span className="text-amber-400 font-bold text-lg">{snapshot.inactivityDurationMinutes} Mins</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Typical: {baseline.inactivity.meanDurationMinutes} Mins
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-slate-400 text-[10px] block">ROOM TEMPERATURE</span>
            <span className={`font-bold text-lg ${snapshot.roomTemperature !== null ? 'text-amber-400' : 'text-slate-400'}`}>
              {snapshot.roomTemperature !== null ? `${snapshot.roomTemperature}°C` : 'Unavailable'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              State: {context.environmentalState}
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXPLAINABLE AI PANEL ("Why is ElderGuard showing this status?") */}
      <div className="app-card p-6 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-4">
        <h3 className="text-base font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Why is ElderGuard showing this status?
        </h3>

        <div className="space-y-2.5">
          {risk.reasons.map((reason, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{reason.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PERSONAL BEHAVIOR BASELINE MATRIX & CONTEXT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Behavior Baselines */}
        <div className="app-card p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-500" /> Personal Behavioral Baseline Matrix
          </h3>

          <div className="space-y-4 text-xs font-mono">
            {/* Activity comparison */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Activity vs {context.timeOfDay.toUpperCase()} Baseline</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(snapshot.activityLevel * 100).toFixed(0)}% / {((actBaselineWindow?.mean || 0.48) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, snapshot.activityLevel * 100)}%` }}
                />
              </div>
            </div>

            {/* Inactivity comparison */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Inactivity vs Typical Window</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {snapshot.inactivityDurationMinutes} Mins / {baseline.inactivity.meanDurationMinutes} Mins
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (snapshot.inactivityDurationMinutes / 60) * 100)}%` }}
                />
              </div>
            </div>

            {/* Resting HR comparison */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Resting Heart Rate</span>
                <span className="font-bold text-rose-500">
                  {snapshot.heartRate !== null ? `${snapshot.heartRate} BPM` : 'Unavailable'} (Baseline {baseline.heartRate.restingMean} BPM)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((snapshot.heartRate || 74) / 180) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Context Engine Output */}
        <div className="app-card p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500" /> Current Context Engine Output
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block">TIME OF DAY</span>
              <strong className="text-slate-900 dark:text-white font-bold capitalize">{context.timeOfDay} ({context.dayType})</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block">ACTIVITY STATE</span>
              <strong className="text-cyan-600 dark:text-cyan-400 font-bold uppercase">{context.activityState}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block">ROOM TEMPERATURE</span>
              <strong className="text-amber-500 font-bold">
                {snapshot.roomTemperature !== null ? `${snapshot.roomTemperature}°C` : 'Unavailable'} ({context.environmentalState})
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] block">CONTEXT CONFIDENCE</span>
              <strong className="text-purple-500 font-bold">{(context.contextConfidence * 100).toFixed(0)}%</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 4. REAL-TIME ANOMALY TIMELINE */}
      <div className="app-card p-6 flex flex-col gap-4">
        <h3 className="text-base font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          Detected Anomaly Timeline (Real-Time Events)
        </h3>

        {aiState.recentAnomalies.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> No active anomalies detected. Personal behavior matches normal baseline.
          </div>
        ) : (
          <div className="space-y-3">
            {aiState.recentAnomalies.map(anom => (
              <div
                key={anom.eventId}
                onClick={() => setSelectedAnomalyId(selectedAnomalyId === anom.eventId ? null : anom.eventId)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 cursor-pointer transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-rose-500 uppercase flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {anom.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {anom.zScore !== null ? `Z-Score: ${anom.zScore}σ` : 'Score: N/A'} • {new Date(anom.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {anom.description}
                </p>

                {selectedAnomalyId === anom.eventId && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950 text-cyan-400 font-mono text-[11px] space-y-1">
                    <strong className="block text-slate-400">Sensor Evidence & Context:</strong>
                    {anom.sensorEvidence.map((ev, i) => (
                      <div key={i}>• {ev}</div>
                    ))}
                    <div>• Context State: {anom.contextState.timeOfDay} / {anom.contextState.activityState}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. CAREGIVER HUMAN-IN-THE-LOOP FEEDBACK WIDGET */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-extrabold font-heading text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-500" /> Caregiver Feedback (Human-in-the-Loop AI Learning)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Was this AI risk assessment helpful for monitoring Devendra Kumar?
          </p>
        </div>

        {feedbackSubmitted ? (
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-pulse">
            <CheckCircle2 className="w-4 h-4" /> Feedback recorded for model training.
          </span>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleFeedback('REAL_CONCERN')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Yes — Real Concern
            </button>

            <button
              onClick={() => handleFeedback('FALSE_ALARM')}
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <ThumbsDown className="w-3.5 h-3.5" /> No — False Alarm
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ElderGuardAI360Screen;
