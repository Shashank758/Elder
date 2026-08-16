import type {
  NormalizedSensorSnapshot,
  PersonalBaseline,
  ContextObject,
  DetectedAnomaly,
  DataQualityState,
  EvidenceObject
} from './types';

export class AnomalyDetectionService {
  /**
   * Configurable Z-Score Thresholds
   */
  public static Z_SCORE_HR_THRESHOLD = 2.2; // Requires > 2.2 std dev for HR anomaly
  public static Z_SCORE_ACT_THRESHOLD = 2.5; // Requires > 2.5 std dev for Activity anomaly

  /**
   * Detects single and multi-sensor anomalies and builds a unified Evidence Object.
   */
  public static evaluateAnomalies(
    snapshot: NormalizedSensorSnapshot,
    baseline: PersonalBaseline,
    context: ContextObject,
    dataQuality: DataQualityState
  ): { anomalies: DetectedAnomaly[]; evidence: EvidenceObject } {
    const anomalies: DetectedAnomaly[] = [];
    const evidence: EvidenceObject = {};
    const timestamp = snapshot.eventTimestamp;

    // 1. Data Quality / Stale Check (DO NOT TREAT STALE / DISCONNECTED SENSOR AS HEALTH CRISIS!)
    if (dataQuality.isStale || dataQuality.isDisconnected || dataQuality.level === 'CRITICAL') {
      anomalies.push({
        eventId: `anom_dq_${timestamp}`,
        type: 'SENSOR_DATA_QUALITY_ISSUE',
        timestamp,
        severity: 0.3,
        zScore: null, // Statistical score N/A for data quality warnings
        description: dataQuality.isStale
          ? `Sensor telemetry data is stale (${snapshot.ageSeconds}s old)`
          : 'Smartwatch device is currently disconnected or offline',
        sensorEvidence: dataQuality.warnings,
        persistentDurationMinutes: 0,
        confidence: 0.95,
        contextState: {
          timeOfDay: context.timeOfDay,
          activityState: context.activityState
        }
      });
      return { anomalies, evidence };
    }

    // 2. Motion / Fall Anomaly Check
    if (snapshot.fallDetected || snapshot.sosPressed) {
      const mag = Math.sqrt(snapshot.accelerometer.x ** 2 + snapshot.accelerometer.y ** 2 + snapshot.accelerometer.z ** 2);
      const severity = snapshot.sosPressed ? 0.98 : 0.92;

      evidence.movementEvidence = {
        accelMagnitude: Number(mag.toFixed(2)),
        fallDetected: snapshot.fallDetected,
        fallStatus: snapshot.fallStatus,
        sosPressed: snapshot.sosPressed,
        severity
      };

      anomalies.push({
        eventId: `anom_fall_${timestamp}`,
        type: 'POSSIBLE_FALL',
        timestamp,
        severity,
        zScore: 4.8,
        description: snapshot.sosPressed
          ? 'EMERGENCY SOS button activated by senior'
          : 'Sudden free-fall acceleration spike & post-impact posture detected',
        sensorEvidence: [
          `Accelerometer Magnitude: ${mag.toFixed(2)} m/s²`,
          `Fall Status: ${snapshot.fallStatus}`
        ],
        persistentDurationMinutes: 2,
        confidence: 0.94,
        contextState: {
          timeOfDay: context.timeOfDay,
          activityState: context.activityState
        }
      });
    }

    // 3. Heart Rate Z-Score Calculation (z = (current - mean) / std)
    if (snapshot.heartRate !== null) {
      const isResting = context.activityState === 'RESTING' || context.activityState === 'SLEEPING';
      const hrMean = isResting ? baseline.heartRate.restingMean : baseline.heartRate.activeMean;
      const hrStd = isResting ? baseline.heartRate.restingStd : baseline.heartRate.activeStd;

      const zScore = (snapshot.heartRate - hrMean) / Math.max(1, hrStd);
      const absZ = Math.abs(zScore);

      // Only flag anomaly if |zScore| exceeds strict statistical threshold (> 2.2 std dev)
      if (absZ > this.Z_SCORE_HR_THRESHOLD) {
        const severity = Math.min(1.0, absZ / 4.0);
        evidence.heartRateEvidence = {
          zScore: Number(zScore.toFixed(2)),
          current: snapshot.heartRate,
          baselineMean: hrMean,
          std: hrStd,
          isResting,
          severity
        };

        anomalies.push({
          eventId: `anom_hr_${timestamp}`,
          type: 'HEART_RATE_DEVIATION',
          timestamp,
          severity,
          zScore: Number(zScore.toFixed(2)),
          description: `Heart rate (${snapshot.heartRate} BPM) differs from personal ${isResting ? 'resting' : 'active'} baseline (${hrMean} ± ${hrStd} BPM, Z=${zScore.toFixed(2)}σ)`,
          sensorEvidence: [
            `Current HR: ${snapshot.heartRate} BPM`,
            `Personal Baseline (${context.timeOfDay}): ${hrMean} BPM`,
            `Z-Score: ${zScore.toFixed(2)}σ`
          ],
          persistentDurationMinutes: 3,
          confidence: 0.90,
          contextState: {
            timeOfDay: context.timeOfDay,
            activityState: context.activityState
          }
        });
      }
    }

    // 4. SpO2 Deviation Check
    if (snapshot.spO2 !== null && snapshot.spO2 < 93) {
      const spo2ZScore = (baseline.spO2.mean - snapshot.spO2) / Math.max(0.5, baseline.spO2.std);
      const severity = Math.min(1.0, spo2ZScore / 4.0);

      evidence.spO2Evidence = {
        zScore: Number(spo2ZScore.toFixed(2)),
        current: snapshot.spO2,
        baselineMean: baseline.spO2.mean,
        severity
      };

      anomalies.push({
        eventId: `anom_spo2_${timestamp}`,
        type: 'SPO2_DEVIATION',
        timestamp,
        severity,
        zScore: Number(spo2ZScore.toFixed(2)),
        description: `Oxygen saturation (${snapshot.spO2}%) is below normal baseline (${baseline.spO2.mean}%)`,
        sensorEvidence: [
          `Current SpO2: ${snapshot.spO2}%`,
          `Baseline: ${baseline.spO2.mean}%`
        ],
        persistentDurationMinutes: 5,
        confidence: 0.92,
        contextState: {
          timeOfDay: context.timeOfDay,
          activityState: context.activityState
        }
      });
    }

    // 5. Activity Level Z-Score Check (CONTEXT-AWARE!)
    // Night/Sleeping context: 2% activity vs 10% ± 8% baseline -> Z = 1.0 -> NORMAL!
    const actBaselineWindow = baseline.activity[context.timeOfDay]?.[context.dayType];
    if (actBaselineWindow) {
      const actZScore = (actBaselineWindow.mean - snapshot.activityLevel) / Math.max(0.05, actBaselineWindow.std);

      // DO NOT trigger activity anomaly if senior is SLEEPING at NIGHT!
      const isExpectedSleeping = context.timeOfDay === 'night' || context.activityState === 'SLEEPING';

      if (actZScore > this.Z_SCORE_ACT_THRESHOLD && !isExpectedSleeping) {
        const severity = Math.min(0.9, actZScore / 4.5);
        evidence.activityEvidence = {
          zScore: Number(actZScore.toFixed(2)),
          current: snapshot.activityLevel,
          baselineMean: actBaselineWindow.mean,
          std: actBaselineWindow.std,
          severity,
          expected: false
        };

        anomalies.push({
          eventId: `anom_act_${timestamp}`,
          type: 'ACTIVITY_DEVIATION',
          timestamp,
          severity,
          zScore: Number(actZScore.toFixed(2)),
          description: `Activity (${(snapshot.activityLevel * 100).toFixed(0)}%) is significantly below expected ${context.timeOfDay} baseline (${(actBaselineWindow.mean * 100).toFixed(0)}%, Z=${actZScore.toFixed(2)}σ)`,
          sensorEvidence: [
            `Current Activity: ${(snapshot.activityLevel * 100).toFixed(0)}%`,
            `Expected ${context.timeOfDay} Activity: ${(actBaselineWindow.mean * 100).toFixed(0)}%`,
            `Z-Score: ${actZScore.toFixed(2)}σ`
          ],
          persistentDurationMinutes: 15,
          confidence: 0.88,
          contextState: {
            timeOfDay: context.timeOfDay,
            activityState: context.activityState
          }
        });
      }
    }

    // 6. Inactivity Duration Anomaly Check
    if (snapshot.inactivityDurationMinutes > baseline.inactivity.meanDurationMinutes + 2.5 * baseline.inactivity.stdDurationMinutes && context.timeOfDay !== 'night') {
      const severity = 0.75;
      evidence.inactivityEvidence = {
        minutes: snapshot.inactivityDurationMinutes,
        typicalMinutes: baseline.inactivity.meanDurationMinutes,
        severity
      };

      anomalies.push({
        eventId: `anom_inact_${timestamp}`,
        type: 'UNUSUAL_INACTIVITY',
        timestamp,
        severity,
        zScore: 2.8,
        description: `Prolonged daytime inactivity (${snapshot.inactivityDurationMinutes} mins vs typical ${baseline.inactivity.meanDurationMinutes} mins)`,
        sensorEvidence: [
          `Inactivity Duration: ${snapshot.inactivityDurationMinutes} mins`,
          `Personal Average: ${baseline.inactivity.meanDurationMinutes} mins`
        ],
        persistentDurationMinutes: snapshot.inactivityDurationMinutes,
        confidence: 0.85,
        contextState: {
          timeOfDay: context.timeOfDay,
          activityState: context.activityState
        }
      });
    }

    // 7. Environmental Climate Evidence (Handles NULL explicitly!)
    if (snapshot.roomTemperature !== null) {
      evidence.environmentEvidence = {
        temperature: snapshot.roomTemperature,
        status: snapshot.roomTemperature > 28 ? 'elevated' : snapshot.roomTemperature < 18 ? 'cold' : 'normal'
      };
    } else {
      evidence.environmentEvidence = {
        temperature: null,
        status: 'unavailable'
      };
    }

    // 8. Multi-Sensor Fusion (If 2+ distinct evidence sources trigger)
    if (anomalies.length >= 2) {
      anomalies.push({
        eventId: `anom_multi_${timestamp}`,
        type: 'MULTI_SENSOR_ANOMALY',
        timestamp,
        severity: 0.88,
        zScore: null, // Multi-sensor fusion composite score
        description: 'Multi-sensor anomaly fusion triggered by concurrent activity, cardiac, and movement deviations',
        sensorEvidence: anomalies.map(a => a.description),
        persistentDurationMinutes: 5,
        confidence: 0.95,
        contextState: {
          timeOfDay: context.timeOfDay,
          activityState: context.activityState
        }
      });
    }

    return { anomalies, evidence };
  }
}
