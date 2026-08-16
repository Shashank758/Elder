import type {
  NormalizedSensorSnapshot,
  AI360State,
  HumanFeedback,
  PersonalBaseline
} from './types';
import { DataQualityService } from './dataQualityService';
import { BehaviorModelService } from './behaviorModelService';
import { ContextEngineService } from './contextEngineService';
import { AnomalyDetectionService } from './anomalyDetectionService';
import { RiskEngineService } from './riskEngineService';

export class ElderGuardAIService {
  private static feedbackStore: HumanFeedback[] = (() => {
    try {
      const saved = localStorage.getItem('elderguard_ai_feedback');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  private static historyStore: NormalizedSensorSnapshot[] = [];

  /**
   * Master Pipeline Orchestrator.
   * Executes Data Quality -> Baseline -> Context -> Anomaly -> Risk -> Explanation pipeline.
   * Emits structured development data flow logs.
   */
  public static processPipeline(
    rawWatch: any,
    rawHome: any,
    isDemoMode: boolean = false,
    demoScenario: string | null = null
  ): AI360State {

    // 1. Data Quality & Single Source Snapshot Generation
    let { snapshot, dataQuality } = DataQualityService.createNormalizedSnapshot(
      rawWatch,
      rawHome
    );

    // Apply Demo Scenario override if Demo Mode is active
    if (isDemoMode && demoScenario) {
      snapshot = this.applyDemoScenario(snapshot, demoScenario);
      // Re-run quality check on overridden snapshot
      if (demoScenario === 'invalid_sensor_data') {
        dataQuality = {
          score: 45,
          level: 'WARNING',
          isStale: false,
          isDisconnected: false,
          warnings: ['Invalid Temperature telemetry (999°C out of bounds 10-50°C)']
        };
      } else if (demoScenario === 'sensor_disconnect') {
        dataQuality = {
          score: 30,
          level: 'CRITICAL',
          isStale: true,
          isDisconnected: true,
          warnings: ['Smartwatch telemetry disconnected (OFFLINE)']
        };
      } else {
        dataQuality = {
          score: 98,
          level: 'GOOD',
          isStale: false,
          isDisconnected: false,
          warnings: []
        };
      }
    }

    // Maintain history store for statistical baseline computation
    this.historyStore.push(snapshot);
    if (this.historyStore.length > 250) {
      this.historyStore.shift();
    }

    // 2. Personal Behavior Model Evaluation
    const personalBaseline: PersonalBaseline = BehaviorModelService.getPersonalBaseline(
      this.historyStore,
      isDemoMode && demoScenario === 'learning' ? 'INSUFFICIENT_DATA' : undefined
    );

    // 3. Context Engine Evaluation
    const context = ContextEngineService.evaluateContext(snapshot, personalBaseline, dataQuality);

    // 4. Anomaly Detection & Multi-Sensor Fusion
    const { anomalies, evidence } = AnomalyDetectionService.evaluateAnomalies(
      snapshot,
      personalBaseline,
      context,
      dataQuality
    );

    // 5. Risk Engine & Explainability Output
    const riskAssessment = RiskEngineService.calculateRisk(
      snapshot,
      anomalies,
      evidence,
      context,
      personalBaseline,
      dataQuality
    );

    // 6. Structured Data Flow Logging (For Developer Validation)
    if (import.meta.env?.DEV) {
      console.groupCollapsed(`[ELDERGUARD AI 360 PIPELINE] Snapshot t=${snapshot.eventTimestamp}`);
      console.log('[SNAPSHOT]', snapshot);
      console.log('[VALIDATION]', dataQuality);
      console.log('[BASELINE]', personalBaseline.baselineStage, personalBaseline);
      console.log('[CONTEXT]', context.activityState, context);
      console.log('[ANOMALY]', anomalies);
      console.log('[FUSION & EVIDENCE]', evidence);
      console.log('[RISK & CONFIDENCE]', riskAssessment.healthRisk, `Confidence=${riskAssessment.confidence}%`);
      console.log('[EXPLANATION]', riskAssessment.reasons);
      console.groupEnd();
    }

    return {
      isDemoMode,
      demoScenario,
      snapshot,
      dataQuality,
      healthRisk: riskAssessment.healthRisk,
      context,
      personalBaseline,
      riskAssessment,
      recentAnomalies: anomalies,
      feedbackHistory: this.feedbackStore,
      learningProgressDays: Math.min(14, Math.max(1, Math.ceil(this.historyStore.length / 10)))
    };
  }

  /**
   * Records caregiver feedback into persistent local storage.
   */
  public static submitFeedback(feedback: HumanFeedback) {
    this.feedbackStore.unshift(feedback);
    try {
      localStorage.setItem('elderguard_ai_feedback', JSON.stringify(this.feedbackStore.slice(0, 50)));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Deterministic Demo Scenarios generator (Zero Math.random()).
   */
  private static applyDemoScenario(
    snapshot: NormalizedSensorSnapshot,
    scenario: string
  ): NormalizedSensorSnapshot {
    const now = Date.now();

    switch (scenario) {
      case 'normal_night':
        return {
          ...snapshot,
          eventTimestamp: now,
          processedAt: now,
          freshness: 'FRESH',
          ageSeconds: 0,
          heartRate: 68.0,
          spO2: 98.0,
          activityLevel: 0.02,
          inactivityDurationMinutes: 42,
          roomTemperature: 22.5,
          fallDetected: false,
          fallStatus: 'NORMAL',
          sosPressed: false
        };

      case 'normal_morning':
        return {
          ...snapshot,
          eventTimestamp: now,
          processedAt: now,
          freshness: 'FRESH',
          ageSeconds: 0,
          heartRate: 82.0,
          spO2: 98.0,
          activityLevel: 0.65,
          inactivityDurationMinutes: 4,
          roomTemperature: 24.0,
          fallDetected: false,
          fallStatus: 'NORMAL',
          sosPressed: false
        };

      case 'low_activity_day':
        return {
          ...snapshot,
          eventTimestamp: now,
          processedAt: now,
          freshness: 'FRESH',
          ageSeconds: 0,
          heartRate: 72.0,
          spO2: 98.0,
          activityLevel: 0.02,
          inactivityDurationMinutes: 52,
          roomTemperature: 24.5,
          fallDetected: false,
          fallStatus: 'NORMAL',
          sosPressed: false
        };

      case 'possible_fall':
        return {
          ...snapshot,
          eventTimestamp: now,
          processedAt: now,
          freshness: 'FRESH',
          ageSeconds: 0,
          heartRate: 118.0,
          spO2: 97.0,
          activityLevel: 0.02,
          accelerometer: { x: 4.8, y: 1.2, z: 18.4 },
          fallDetected: true,
          fallStatus: 'FALL_DETECTED',
          sosPressed: false
        };

      case 'prolonged_inactivity':
        return {
          ...snapshot,
          eventTimestamp: now,
          processedAt: now,
          freshness: 'FRESH',
          ageSeconds: 0,
          heartRate: 74.0,
          spO2: 98.0,
          activityLevel: 0.01,
          inactivityDurationMinutes: 75,
          roomTemperature: 24.0,
          fallDetected: false,
          fallStatus: 'NORMAL',
          sosPressed: false
        };

      case 'elevated_hr':
        return {
          ...snapshot,
          eventTimestamp: now,
          processedAt: now,
          freshness: 'FRESH',
          ageSeconds: 0,
          heartRate: 134.0, // High resting heart rate!
          spO2: 96.0,
          activityLevel: 0.08,
          inactivityDurationMinutes: 10,
          roomTemperature: 24.5,
          fallDetected: false,
          fallStatus: 'NORMAL',
          sosPressed: false
        };

      case 'multi_sensor_emergency':
        return {
          ...snapshot,
          eventTimestamp: now,
          processedAt: now,
          freshness: 'FRESH',
          ageSeconds: 0,
          heartRate: 142.0,
          spO2: 91.0,
          activityLevel: 0.04,
          inactivityDurationMinutes: 45,
          accelerometer: { x: 5.2, y: 2.1, z: 19.8 },
          fallDetected: true,
          fallStatus: 'IMPACT',
          sosPressed: true
        };

      case 'invalid_sensor_data':
        return {
          ...snapshot,
          eventTimestamp: now,
          processedAt: now,
          freshness: 'FRESH',
          ageSeconds: 0,
          heartRate: 74.0,
          spO2: 98.0,
          roomTemperature: 999.0, // Invalid temp -> Data Quality Warning, Health Risk UNCHANGED!
          activityLevel: 0.45
        };

      case 'sensor_disconnect':
        return {
          ...snapshot,
          eventTimestamp: now - 300000, // 5 minutes old stale data!
          processedAt: now,
          freshness: 'STALE',
          ageSeconds: 300,
          heartRate: null,
          spO2: null,
          roomTemperature: null
        };

      case 'learning':
        return {
          ...snapshot,
          eventTimestamp: now,
          processedAt: now,
          freshness: 'FRESH',
          ageSeconds: 0,
          heartRate: 75.0,
          spO2: 98.0,
          activityLevel: 0.50
        };

      default:
        return snapshot;
    }
  }
}
