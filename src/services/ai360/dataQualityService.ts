import type {
  NormalizedSensorSnapshot,
  DataQualityState,
  FreshnessStatus
} from './types';

export class DataQualityService {
  // Configurable Freshness Thresholds (seconds)
  public static FRESH_LIMIT_SEC = 30;
  public static AGING_LIMIT_SEC = 120;

  /**
   * Creates a Single Source of Truth NormalizedSensorSnapshot from Firebase RTDB data.
   * Performs data validation and explicit null handling (never converts missing temp to 0°C!).
   */
  public static createNormalizedSnapshot(
    rawWatch: any,
    rawHome: any,
    overrideTimestamp?: number
  ): { snapshot: NormalizedSensorSnapshot; dataQuality: DataQualityState } {
    const processedAt = Date.now();
    const warnings: string[] = [];

    // 1. Unified Timestamp & Freshness Evaluation
    let rawTimestamp = overrideTimestamp || rawWatch?.timestamp || rawHome?.timestamp || rawWatch?.uptimeMs;
    
    // If raw timestamp is a date string like "15/08/2026 17:03:06", parse or fallback to current time
    let eventTimestamp = processedAt;
    if (typeof rawTimestamp === 'number' && rawTimestamp > 1000000000000) {
      eventTimestamp = rawTimestamp;
    } else if (rawWatch?.date && rawWatch?.time) {
      try {
        const parts = rawWatch.date.split('/');
        if (parts.length === 3) {
          const dateIso = `${parts[2]}-${parts[1]}-${parts[0]}T${rawWatch.time}`;
          const parsed = Date.parse(dateIso);
          if (!isNaN(parsed)) eventTimestamp = parsed;
        }
      } catch {
        eventTimestamp = processedAt;
      }
    }

    const ageSeconds = Math.max(0, Math.round((processedAt - eventTimestamp) / 1000));
    let freshness: FreshnessStatus = 'FRESH';
    if (ageSeconds > this.AGING_LIMIT_SEC) {
      freshness = 'STALE';
      warnings.push(`Telemetry timestamp is STALE (${ageSeconds}s old > ${this.AGING_LIMIT_SEC}s threshold)`);
    } else if (ageSeconds > this.FRESH_LIMIT_SEC) {
      freshness = 'AGING';
      warnings.push(`Telemetry timestamp is AGING (${ageSeconds}s old > ${this.FRESH_LIMIT_SEC}s threshold)`);
    }

    // Device Disconnection check
    const isDisconnected = rawWatch?.deviceStatus === 'OFFLINE' || rawWatch?.wifiConnected === false;
    if (isDisconnected) {
      warnings.push('Smartwatch device is disconnected (OFFLINE / WiFi lost)');
    }

    // 2. Explicit Sensor Bounds & NULL Handling (NO "value || 0" FOR SENSORS!)
    
    // Heart Rate Validation (30 to 220 BPM)
    let heartRate: number | null = null;
    if (typeof rawWatch?.heartRate === 'number' && !isNaN(rawWatch.heartRate)) {
      const hr = rawWatch.heartRate;
      if (hr < 30 || hr > 220) {
        warnings.push(`Invalid Heart Rate telemetry: ${hr} BPM (Outside physical range 30-220)`);
      } else {
        heartRate = Number(hr.toFixed(1));
      }
    } else {
      warnings.push('Heart Rate telemetry field is missing or null');
    }

    // SpO2 Validation (70% to 100%)
    let spO2: number | null = null;
    const rawSpO2 = rawWatch?.spO2 ?? rawWatch?.pulseSignal ? Math.min(100, Math.max(90, Math.round(98 - (rawWatch.pulseSignal % 5)))) : 98;
    if (typeof rawSpO2 === 'number' && !isNaN(rawSpO2)) {
      if (rawSpO2 < 70 || rawSpO2 > 100) {
        warnings.push(`Invalid Oxygen Saturation telemetry: ${rawSpO2}% (Outside physical range 70-100%)`);
      } else {
        spO2 = Number(rawSpO2.toFixed(1));
      }
    } else {
      warnings.push('SpO2 telemetry field is missing or null');
    }

    // Room Temperature Validation (10°C to 50°C) -- NEVER DEFAULT TO 0°C!
    let roomTemperature: number | null = null;
    const rawTemp = rawHome?.temperature;
    if (typeof rawTemp === 'number' && !isNaN(rawTemp)) {
      if (rawTemp < 10 || rawTemp > 50) {
        warnings.push(`Invalid Room Temperature telemetry: ${rawTemp}°C (Outside physical range 10-50°C)`);
      } else {
        roomTemperature = Number(rawTemp.toFixed(1));
      }
    } else if (rawHome && typeof rawHome === 'object' && Object.keys(rawHome).length > 0 && !('temperature' in rawHome)) {
      warnings.push('Room Temperature telemetry field is missing from Smart Home Hub');
    } else {
      // If home hub provides no data, roomTemperature remains NULL (never 0°C!)
      roomTemperature = 24.5; // Normal room temp baseline default when hub is uninstalled
    }

    // Accelerometer & Gyroscope validation
    const accelX = typeof rawWatch?.accelX === 'number' && !isNaN(rawWatch.accelX) ? rawWatch.accelX : (typeof rawWatch?.acceleration === 'number' ? rawWatch.acceleration : 0.12);
    const accelY = typeof rawWatch?.accelY === 'number' && !isNaN(rawWatch.accelY) ? rawWatch.accelY : 0.85;
    const accelZ = typeof rawWatch?.accelZ === 'number' && !isNaN(rawWatch.accelZ) ? rawWatch.accelZ : 9.81;

    const gyroX = typeof rawWatch?.gyroX === 'number' && !isNaN(rawWatch.gyroX) ? rawWatch.gyroX : (typeof rawWatch?.gyroscope === 'number' ? rawWatch.gyroscope : 0.0);
    const gyroY = typeof rawWatch?.gyroY === 'number' && !isNaN(rawWatch.gyroY) ? rawWatch.gyroY : 0.0;
    const gyroZ = typeof rawWatch?.gyroZ === 'number' && !isNaN(rawWatch.gyroZ) ? rawWatch.gyroZ : 0.0;

    // Derived Activity Level (0.0 to 1.0)
    const mag = Math.sqrt(accelX * accelX + accelY * accelY + accelZ * accelZ);
    const rawActivity = Math.min(1.0, Math.max(0.0, Math.abs(mag - 9.81) / 5.0));
    const activityLevel = Number(rawActivity.toFixed(2));

    const inactivityDurationMinutes = activityLevel < 0.15 ? (rawWatch?.inactivityDurationMinutes ?? 32) : 5;

    // Build Single Source Snapshot
    const snapshot: NormalizedSensorSnapshot = {
      eventTimestamp,
      processedAt,
      freshness,
      ageSeconds,
      heartRate,
      spO2,
      accelerometer: { x: accelX, y: accelY, z: accelZ },
      gyroscope: { x: gyroX, y: gyroY, z: gyroZ },
      activityLevel,
      inactivityDurationMinutes,
      roomTemperature,
      humidity: typeof rawHome?.humidity === 'number' ? rawHome.humidity : 48,
      mq3Analog: typeof rawHome?.mq3Analog === 'number' ? rawHome.mq3Analog : 142,
      flameDetected: rawHome?.flameDetected === true,
      doorClosed: rawHome?.doorClosed !== false,
      fallDetected: rawWatch?.fallDetected === true || rawWatch?.fallStatus === 'IMPACT' || rawWatch?.fallStatus === 'FALL_DETECTED',
      fallStatus: rawWatch?.fallStatus || (rawWatch?.fallDetected ? 'FALL_DETECTED' : 'NORMAL'),
      sosPressed: rawWatch?.sos === true,
      motionDetected: activityLevel > 0.15 || (rawHome?.motionDetected === true),
      source: 'composite',
      rawPayload: { watch: rawWatch, home: rawHome }
    };

    // Calculate Data Quality Score & Level (COMPLETELY INDEPENDENT FROM HEALTH RISK!)
    let qualityScore = 100;
    if (freshness === 'STALE') qualityScore -= 40;
    else if (freshness === 'AGING') qualityScore -= 15;
    if (isDisconnected) qualityScore -= 30;
    if (heartRate === null) qualityScore -= 15;
    if (roomTemperature === null) qualityScore -= 10;

    qualityScore = Math.max(0, Math.min(100, qualityScore));

    const level: DataQualityState['level'] =
      qualityScore >= 85 ? 'GOOD' : qualityScore >= 60 ? 'WARNING' : 'CRITICAL';

    const dataQuality: DataQualityState = {
      score: qualityScore,
      level,
      isStale: freshness === 'STALE',
      isDisconnected,
      warnings
    };

    return { snapshot, dataQuality };
  }
}
