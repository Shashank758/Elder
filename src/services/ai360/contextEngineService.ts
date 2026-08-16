import type {
  NormalizedSensorSnapshot,
  ContextObject,
  PersonalBaseline,
  ActivityState,
  DataQualityState
} from './types';
import { BehaviorModelService } from './behaviorModelService';

export class ContextEngineService {
  /**
   * Generates a context object derived strictly from sensor signals, time, and personal baselines.
   */
  public static evaluateContext(
    snapshot: NormalizedSensorSnapshot,
    baseline: PersonalBaseline,
    dataQuality: DataQualityState
  ): ContextObject {
    const date = new Date(snapshot.eventTimestamp);
    const hour = date.getHours();

    const timeOfDay = BehaviorModelService.getTimeOfDay(hour);
    const dayType = BehaviorModelService.getDayType(date);

    // Activity State Classification
    let activityState: ActivityState = 'RESTING';

    if (dataQuality.isDisconnected || snapshot.heartRate === null) {
      activityState = 'UNKNOWN';
    } else if (timeOfDay === 'night' && snapshot.activityLevel <= 0.20) {
      activityState = 'SLEEPING';
    } else if (snapshot.activityLevel > 0.65) {
      activityState = 'ACTIVE';
    } else if (snapshot.activityLevel >= 0.25) {
      activityState = 'WALKING';
    } else if (snapshot.inactivityDurationMinutes >= 35 && timeOfDay !== 'night') {
      activityState = 'INACTIVE';
    } else {
      activityState = 'RESTING';
    }

    const recentActivityLevel: ContextObject['recentActivityLevel'] =
      snapshot.activityLevel > 0.6 ? 'high' : snapshot.activityLevel > 0.25 ? 'moderate' : 'low';

    // Environmental Climate evaluation (Handles NULL explicitly!)
    let environmentalState: ContextObject['environmentalState'] = 'normal';
    if (snapshot.roomTemperature === null) {
      environmentalState = 'unavailable';
    } else if (snapshot.roomTemperature > 28) {
      environmentalState = 'elevated';
    } else if (snapshot.roomTemperature < 18) {
      environmentalState = 'cold';
    } else {
      environmentalState = 'normal';
    }

    const baselineAvailable = baseline.baselineStage !== 'INSUFFICIENT_DATA';
    const recentEmergency = snapshot.fallDetected || snapshot.sosPressed || snapshot.flameDetected;

    // Context confidence reduces if telemetry is aging/stale or disconnected
    let contextConfidence = baseline.baselineConfidence / 100;
    if (dataQuality.level === 'WARNING') contextConfidence *= 0.8;
    if (dataQuality.level === 'CRITICAL') contextConfidence *= 0.5;

    return {
      timeOfDay,
      hour,
      dayType,
      activityState,
      recentActivityLevel,
      sensorQualityLevel: dataQuality.level,
      baselineAvailable,
      recentEmergency,
      contextConfidence: Number(contextConfidence.toFixed(2)),
      environmentalState
    };
  }
}
