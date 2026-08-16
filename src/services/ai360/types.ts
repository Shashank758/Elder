export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DataQualityLevel = 'GOOD' | 'WARNING' | 'CRITICAL';

export type AIStatus =
  | 'NORMAL'
  | 'MONITORING'
  | 'WARNING'
  | 'HIGH_RISK'
  | 'CRITICAL'
  | 'LEARNING_BASELINE'
  | 'SENSOR_DATA_STALE'
  | 'SENSOR_DATA_WARNING';

export type AnomalyType =
  | 'ACTIVITY_DEVIATION'
  | 'HEART_RATE_DEVIATION'
  | 'SPO2_DEVIATION'
  | 'UNUSUAL_INACTIVITY'
  | 'UNUSUAL_MOVEMENT'
  | 'POSSIBLE_FALL'
  | 'SLEEP_PATTERN_DEVIATION'
  | 'MULTI_SENSOR_ANOMALY'
  | 'SENSOR_DATA_QUALITY_ISSUE';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type DayType = 'weekday' | 'weekend';

export type ActivityState =
  | 'SLEEPING'
  | 'RESTING'
  | 'WALKING'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'UNKNOWN';

export type FreshnessStatus = 'FRESH' | 'AGING' | 'STALE';

/**
 * Single Source of Truth: Normalized current sensor snapshot.
 * All AI pipeline components consume this exact object.
 */
export interface NormalizedSensorSnapshot {
  eventTimestamp: number;
  processedAt: number;
  freshness: FreshnessStatus;
  ageSeconds: number;
  heartRate: number | null; // NULL if invalid or missing! Never 0!
  spO2: number | null;
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  activityLevel: number; // 0.0 to 1.0
  inactivityDurationMinutes: number;
  roomTemperature: number | null; // NULL if unavailable! Never 0!
  humidity: number | null;
  mq3Analog: number | null;
  flameDetected: boolean;
  doorClosed: boolean;
  fallDetected: boolean;
  fallStatus: string;
  sosPressed: boolean;
  motionDetected: boolean;
  source: 'wearable' | 'homehub' | 'composite';
  rawPayload?: Record<string, any>;
}

export interface DataQualityState {
  score: number; // 0 to 100
  level: DataQualityLevel;
  isStale: boolean;
  isDisconnected: boolean;
  warnings: string[];
}

export interface HealthRiskState {
  score: number; // 0 to 100
  level: RiskLevel;
  healthRiskActive: boolean;
}

export interface RobustStatWindow {
  mean: number;
  std: number;
  median: number;
  mad: number; // Median Absolute Deviation
  p25: number;
  p75: number;
  sampleCount: number;
}

export interface PersonalBaseline {
  userId: string;
  baselineVersion: number;
  dataWindowDays: number;
  baselineStage: 'INSUFFICIENT_DATA' | 'INITIALIZING' | 'DEVELOPING' | 'STABILIZING' | 'STABLE';
  baselineConfidence: number; // 0 to 100%
  activity: Record<TimeOfDay, Record<DayType, RobustStatWindow>>;
  heartRate: {
    restingMean: number;
    restingStd: number;
    restingMedian: number;
    restingMad: number;
    activeMean: number;
    activeStd: number;
  };
  spO2: {
    mean: number;
    std: number;
    median: number;
  };
  inactivity: {
    meanDurationMinutes: number;
    stdDurationMinutes: number;
    medianDurationMinutes: number;
  };
  sleep: {
    typicalStart: string;
    typicalEnd: string;
    typicalNightActivityMean: number;
    typicalNightActivityStd: number;
  };
  lastUpdated: number;
}

export interface ContextObject {
  timeOfDay: TimeOfDay;
  hour: number;
  dayType: DayType;
  activityState: ActivityState;
  recentActivityLevel: 'low' | 'moderate' | 'high';
  sensorQualityLevel: DataQualityLevel;
  baselineAvailable: boolean;
  recentEmergency: boolean;
  contextConfidence: number; // 0.0 to 1.0
  environmentalState: 'normal' | 'elevated' | 'cold' | 'unavailable';
}

export interface EvidenceObject {
  activityEvidence?: {
    zScore: number;
    current: number;
    baselineMean: number;
    std: number;
    severity: number;
    expected: boolean;
  };
  heartRateEvidence?: {
    zScore: number;
    current: number;
    baselineMean: number;
    std: number;
    isResting: boolean;
    severity: number;
  };
  spO2Evidence?: {
    zScore: number;
    current: number;
    baselineMean: number;
    severity: number;
  };
  movementEvidence?: {
    accelMagnitude: number;
    fallDetected: boolean;
    fallStatus: string;
    sosPressed: boolean;
    severity: number;
  };
  inactivityEvidence?: {
    minutes: number;
    typicalMinutes: number;
    severity: number;
  };
  contextEvidence?: {
    timeOfDay: TimeOfDay;
    activityState: ActivityState;
    expectedBehavior: boolean;
  };
  environmentEvidence?: {
    temperature: number | null;
    status: 'normal' | 'elevated' | 'cold' | 'unavailable';
  };
}

export interface DetectedAnomaly {
  eventId: string;
  type: AnomalyType;
  timestamp: number;
  severity: number; // 0 to 1
  zScore: number | null; // NULL if z-score is not applicable (e.g. SOS or sensor glitch)
  description: string;
  sensorEvidence: string[];
  persistentDurationMinutes: number;
  confidence: number;
  contextState: {
    timeOfDay: TimeOfDay;
    activityState: ActivityState;
  };
}

export interface DynamicReason {
  type: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  message: string;
}

export interface RiskAssessment {
  score: number; // 0 to 100 Health Risk
  level: RiskLevel;
  confidence: number; // 0 to 100% AI Confidence
  healthRisk: HealthRiskState;
  dataQuality: DataQualityState;
  aiStatus: AIStatus;
  evidence: EvidenceObject;
  reasons: DynamicReason[];
  anomalies: DetectedAnomaly[];
  timestamp: number;
  eventTimestamp: number;
  processedAt: number;
  modelVersion: string;
  algorithmVersion: string;
}

export interface HumanFeedback {
  eventId: string;
  userId: string;
  timestamp: number;
  feedback: 'REAL_CONCERN' | 'FALSE_ALARM' | 'NORMAL_ACTIVITY';
  notes?: string;
}

export interface AI360State {
  isDemoMode: boolean;
  demoScenario: string | null;
  snapshot: NormalizedSensorSnapshot;
  dataQuality: DataQualityState;
  healthRisk: HealthRiskState;
  context: ContextObject;
  personalBaseline: PersonalBaseline;
  riskAssessment: RiskAssessment;
  recentAnomalies: DetectedAnomaly[];
  feedbackHistory: HumanFeedback[];
  learningProgressDays: number;
}
