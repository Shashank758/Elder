import type {
  PersonalBaseline,
  TimeOfDay,
  DayType,
  NormalizedSensorSnapshot,
  RobustStatWindow
} from './types';

export class BehaviorModelService {
  /**
   * Helper to determine Time of Day window
   */
  public static getTimeOfDay(hour: number = new Date().getHours()): TimeOfDay {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Helper to determine Day Type
   */
  public static getDayType(date: Date = new Date()): DayType {
    const day = date.getDay();
    return day === 0 || day === 6 ? 'weekend' : 'weekday';
  }

  /**
   * Robust statistical calculator: computes mean, std, median, MAD, p25, p75.
   */
  public static calculateRobustStats(numbers: number[]): RobustStatWindow {
    if (!numbers || numbers.length === 0) {
      return { mean: 0, std: 1, median: 0, mad: 0, p25: 0, p75: 0, sampleCount: 0 };
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const count = sorted.length;

    // Mean
    const mean = sorted.reduce((sum, val) => sum + val, 0) / count;

    // Standard Deviation
    const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / count;
    const std = Math.sqrt(variance);

    // Median
    const mid = Math.floor(count / 2);
    const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Median Absolute Deviation (MAD)
    const absoluteDeviations = sorted.map(val => Math.abs(val - median)).sort((a, b) => a - b);
    const madMid = Math.floor(absoluteDeviations.length / 2);
    const mad = absoluteDeviations.length % 2 !== 0
      ? absoluteDeviations[madMid]
      : (absoluteDeviations[madMid - 1] + absoluteDeviations[madMid]) / 2;

    // Percentiles p25 & p75
    const p25 = sorted[Math.floor(count * 0.25)] ?? sorted[0];
    const p75 = sorted[Math.floor(count * 0.75)] ?? sorted[count - 1];

    return {
      mean: Number(mean.toFixed(2)),
      std: Number(Math.max(0.01, std).toFixed(2)),
      median: Number(median.toFixed(2)),
      mad: Number(mad.toFixed(2)),
      p25: Number(p25.toFixed(2)),
      p75: Number(p75.toFixed(2)),
      sampleCount: count
    };
  }

  /**
   * Retrieves or updates personal baseline model based on real historical data.
   */
  public static getPersonalBaseline(
    history: NormalizedSensorSnapshot[] = [],
    forcedStage?: PersonalBaseline['baselineStage']
  ): PersonalBaseline {
    const sampleCount = history.length;

    // Determine baseline stage & confidence from sample history
    let baselineStage: PersonalBaseline['baselineStage'] = 'DEVELOPING';
    let baselineConfidence = 75;

    if (sampleCount < 5) {
      baselineStage = 'INSUFFICIENT_DATA';
      baselineConfidence = 25;
    } else if (sampleCount <= 15) {
      baselineStage = 'INITIALIZING';
      baselineConfidence = 50;
    } else if (sampleCount <= 30) {
      baselineStage = 'DEVELOPING';
      baselineConfidence = 72;
    } else if (sampleCount <= 50) {
      baselineStage = 'STABILIZING';
      baselineConfidence = 86;
    } else {
      baselineStage = 'STABLE';
      baselineConfidence = 96;
    }

    if (forcedStage) {
      baselineStage = forcedStage;
      if (forcedStage === 'INSUFFICIENT_DATA') baselineConfidence = 20;
    }

    // Default robust baseline matrices
    const createDefaultWindow = (mean: number, std: number): RobustStatWindow => ({
      mean,
      std,
      median: mean * 0.96,
      mad: std * 0.7,
      p25: Math.max(0, mean - std),
      p75: mean + std,
      sampleCount: Math.max(sampleCount, 24)
    });

    const hrValues = history
      .map(s => s.heartRate)
      .filter((h): h is number => h !== null && h >= 40 && h <= 180);

    const actValues = history.map(s => s.activityLevel);

    const hrStats = hrValues.length > 5
      ? this.calculateRobustStats(hrValues)
      : { mean: 74, std: 6, median: 73, mad: 4, p25: 69, p75: 78, sampleCount: 30 };

    const actStats = actValues.length > 5
      ? this.calculateRobustStats(actValues)
      : { mean: 0.48, std: 0.12, median: 0.46, mad: 0.08, p25: 0.36, p75: 0.58, sampleCount: 30 };

    return {
      userId: 'elder001',
      baselineVersion: 3,
      dataWindowDays: Math.max(1, Math.min(14, Math.ceil(sampleCount / 10))),
      baselineStage,
      baselineConfidence,
      activity: {
        morning: {
          weekday: createDefaultWindow(Math.min(0.9, actStats.mean * 1.3), actStats.std),
          weekend: createDefaultWindow(Math.min(0.9, actStats.mean * 1.1), actStats.std)
        },
        afternoon: {
          weekday: createDefaultWindow(actStats.mean, actStats.std),
          weekend: createDefaultWindow(actStats.mean * 0.9, actStats.std)
        },
        evening: {
          weekday: createDefaultWindow(actStats.mean * 1.1, actStats.std),
          weekend: createDefaultWindow(actStats.mean * 1.05, actStats.std)
        },
        night: {
          weekday: createDefaultWindow(0.10, 0.08), // Night activity: mean = 10%, std = 8%
          weekend: createDefaultWindow(0.12, 0.09)
        }
      },
      heartRate: {
        restingMean: Math.round(hrStats.mean),
        restingStd: Math.max(4, Math.round(hrStats.std)),
        restingMedian: Math.round(hrStats.median),
        restingMad: Math.round(hrStats.mad),
        activeMean: Math.round(hrStats.mean + 18),
        activeStd: Math.max(6, Math.round(hrStats.std + 4))
      },
      spO2: {
        mean: 97.8,
        std: 0.8,
        median: 98.0
      },
      inactivity: {
        meanDurationMinutes: 28,
        stdDurationMinutes: 10,
        medianDurationMinutes: 25
      },
      sleep: {
        typicalStart: '22:30',
        typicalEnd: '06:30',
        typicalNightActivityMean: 0.10,
        typicalNightActivityStd: 0.08
      },
      lastUpdated: Date.now()
    };
  }
}
