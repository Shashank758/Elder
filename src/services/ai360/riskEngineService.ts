import type {
  RiskAssessment,
  RiskLevel,
  AIStatus,
  DetectedAnomaly,
  ContextObject,
  PersonalBaseline,
  DataQualityState,
  EvidenceObject,
  NormalizedSensorSnapshot,
  DynamicReason
} from './types';

export class RiskEngineService {
  /**
   * Calculates Health Risk, Data Quality Risk, AI Confidence %, and Unified Explanations.
   */
  public static calculateRisk(
    snapshot: NormalizedSensorSnapshot,
    anomalies: DetectedAnomaly[],
    evidence: EvidenceObject,
    context: ContextObject,
    baseline: PersonalBaseline,
    dataQuality: DataQualityState
  ): RiskAssessment {
    const timestamp = Date.now();
    const reasons: DynamicReason[] = [];

    // 1. DATA QUALITY & STALE TELEMETRY CHECK
    if (dataQuality.isStale || dataQuality.isDisconnected || dataQuality.level === 'CRITICAL') {
      const dataQualityStatus: AIStatus = dataQuality.isStale ? 'SENSOR_DATA_STALE' : 'SENSOR_DATA_WARNING';

      reasons.push({
        type: 'DATA_QUALITY_WARNING',
        severity: 'LOW',
        message: dataQuality.isStale
          ? `Telemetry data is stale (${snapshot.ageSeconds} seconds old). Health risk remains unchanged.`
          : 'Smartwatch connection warning. Sensor data quality degraded.'
      });

      return {
        score: 10,
        level: 'LOW',
        confidence: 45,
        healthRisk: { score: 10, level: 'LOW', healthRiskActive: false },
        dataQuality,
        aiStatus: dataQualityStatus,
        evidence,
        reasons,
        anomalies,
        timestamp,
        eventTimestamp: snapshot.eventTimestamp,
        processedAt: snapshot.processedAt,
        modelVersion: 'baseline-v3.0',
        algorithmVersion: 'risk-fusion-v3'
      };
    }

    // 2. BASELINE LEARNING STAGE CHECK
    if (baseline.baselineStage === 'INSUFFICIENT_DATA') {
      reasons.push({
        type: 'LEARNING_PHASE',
        severity: 'LOW',
        message: 'Personal behavioral baseline is in early learning phase. Readings are evaluated against population averages.'
      });

      return {
        score: 15,
        level: 'LOW',
        confidence: 35,
        healthRisk: { score: 15, level: 'LOW', healthRiskActive: false },
        dataQuality,
        aiStatus: 'LEARNING_BASELINE',
        evidence,
        reasons,
        anomalies,
        timestamp,
        eventTimestamp: snapshot.eventTimestamp,
        processedAt: snapshot.processedAt,
        modelVersion: 'baseline-v3.0',
        algorithmVersion: 'risk-fusion-v3'
      };
    }

    // 3. HEALTH RISK SCORE COMPUTATION FROM EVIDENCE & ANOMALIES
    let rawHealthScore = 0;

    if (evidence.movementEvidence?.fallDetected || evidence.movementEvidence?.sosPressed) {
      rawHealthScore += snapshot.sosPressed ? 95 : 75;
    }

    if (evidence.heartRateEvidence) {
      const hrSev = evidence.heartRateEvidence.severity;
      rawHealthScore += Math.round(hrSev * 35);
    }

    if (evidence.activityEvidence) {
      const actSev = evidence.activityEvidence.severity;
      rawHealthScore += Math.round(actSev * 25);
    }

    if (evidence.inactivityEvidence) {
      rawHealthScore += Math.round(evidence.inactivityEvidence.severity * 20);
    }

    if (evidence.spO2Evidence) {
      rawHealthScore += Math.round(evidence.spO2Evidence.severity * 30);
    }

    // Cap Health Risk Score between 0 and 100
    const healthScore = Math.min(100, Math.max(0, Math.round(rawHealthScore)));

    // Map Health Risk Level
    let level: RiskLevel = 'LOW';
    let aiStatus: AIStatus = 'NORMAL';

    if (healthScore >= 76) {
      level = 'CRITICAL';
      aiStatus = 'CRITICAL';
    } else if (healthScore >= 51) {
      level = 'HIGH';
      aiStatus = 'HIGH_RISK';
    } else if (healthScore >= 26) {
      level = 'MODERATE';
      aiStatus = 'WARNING';
    } else if (anomalies.length > 0) {
      level = 'LOW';
      aiStatus = 'MONITORING';
    } else {
      level = 'LOW';
      aiStatus = 'NORMAL';
    }

    // 4. INDEPENDENT AI CONFIDENCE COMPUTATION
    // Confidence is derived from baseline stability (0-100%) and data quality score (0-100%)
    const baselineWeight = 0.6;
    const dataQualityWeight = 0.4;
    const calculatedConfidence = Math.round(
      baseline.baselineConfidence * baselineWeight + dataQuality.score * dataQualityWeight
    );

    // 5. UNIFIED EXPLAINABLE REASONS GENERATION (USES SAME EVIDENCE AS RISK ENGINE!)
    if (anomalies.length === 0) {
      if (context.activityState === 'SLEEPING') {
        reasons.push({
          type: 'CONTEXT_EXPECTED',
          severity: 'LOW',
          message: `Current activity (${(snapshot.activityLevel * 100).toFixed(0)}%) is consistent with expected nighttime sleeping behavior.`
        });
      } else {
        reasons.push({
          type: 'ACTIVITY_NORMAL',
          severity: 'LOW',
          message: `Current activity (${(snapshot.activityLevel * 100).toFixed(0)}%) is within normal ${context.timeOfDay} baseline range.`
        });
      }

      if (snapshot.heartRate !== null) {
        reasons.push({
          type: 'HEART_RATE_NORMAL',
          severity: 'LOW',
          message: `Heart rate (${snapshot.heartRate} BPM) remains within personal baseline parameters (${baseline.heartRate.restingMean} ± ${baseline.heartRate.restingStd} BPM).`
        });
      }

      reasons.push({
        type: 'CONCLUSION',
        severity: 'LOW',
        message: 'No significant health anomalies or motion hazards detected.'
      });
    } else {
      // Prioritize top evidence reasons
      if (evidence.movementEvidence) {
        reasons.push({
          type: 'MOTION_HAZARD',
          severity: level,
          message: evidence.movementEvidence.sosPressed
            ? 'Emergency SOS button press received from smartwatch.'
            : 'Sudden acceleration impact and fall posture detected.'
        });
      }

      if (evidence.heartRateEvidence) {
        reasons.push({
          type: 'HEART_RATE_DEVIATION',
          severity: level,
          message: `Heart rate (${evidence.heartRateEvidence.current} BPM) deviates from personal baseline (${evidence.heartRateEvidence.baselineMean} ± ${evidence.heartRateEvidence.std} BPM, Z=${evidence.heartRateEvidence.zScore}σ).`
        });
      }

      if (evidence.activityEvidence) {
        reasons.push({
          type: 'ACTIVITY_DEVIATION',
          severity: level,
          message: `Activity level (${(evidence.activityEvidence.current * 100).toFixed(0)}%) is below expected ${context.timeOfDay} baseline.`
        });
      }

      if (evidence.inactivityEvidence) {
        reasons.push({
          type: 'INACTIVITY',
          severity: level,
          message: `Prolonged inactivity detected (${evidence.inactivityEvidence.minutes} mins vs typical ${evidence.inactivityEvidence.typicalMinutes} mins).`
        });
      }
    }

    return {
      score: healthScore,
      level,
      confidence: calculatedConfidence,
      healthRisk: {
        score: healthScore,
        level,
        healthRiskActive: healthScore >= 51
      },
      dataQuality,
      aiStatus,
      evidence,
      reasons,
      anomalies,
      timestamp,
      eventTimestamp: snapshot.eventTimestamp,
      processedAt: snapshot.processedAt,
      modelVersion: 'baseline-v3.0',
      algorithmVersion: 'risk-fusion-v3'
    };
  }
}
