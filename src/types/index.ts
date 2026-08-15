export type AppScreen = 
  | 'splash'
  | 'login'
  | 'dashboard'
  | 'motion'
  | 'prediction'
  | 'companion'
  | 'spiritual'
  | 'medicine'
  | 'smarthome'
  | 'family'
  | 'doctor'
  | 'emergency'
  | 'mental'
  | 'analytics'
  | 'settings'
  | 'admin';

export type UserRole = 'Elder' | 'Family' | 'Doctor' | 'Admin' | 'Caregiver';

export type LanguageCode = 'en' | 'hi' | 'gu' | 'ta' | 'mr' | 'pa' | 'bn';

export interface WatchTelemetry {
  heartRate: number;
  spO2: number;
  temperature: number; // in Fahrenheit
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  pitch: number;
  roll: number;
  yaw: number;
  tilt: number;
  motionIntensity: number;
  battery: number;
  bluetoothConnected: boolean;
  wifiConnected: boolean;
  internetConnected: boolean;
  activity: string;
  activityConfidence: number;
  ecgData: number[];
  fallRiskScore: number; // 0 - 100
  aiHealthScore: number; // 0 - 100
  systolicBp: number;
  diastolicBp: number;
  stressLevel: number;
  respirationRate: number;
  steps: number;
  calories: number;
  sleepHours: number;
  sleepQuality: string;
  hydrationMl: number;
  hydrationGoal: number;
  // Real-time Smartwatch EG-WATCH-001 Firebase Telemetry Fields
  deviceId?: string;
  deviceStatus?: string;
  fallDetected?: boolean;
  fallStatus?: string;
  pulseSignal?: number;
  sos?: boolean;
  uptimeMs?: number;
  wifiStrength?: number;
  firmwareVersion?: string;
  watchDate?: string;
  watchTime?: string;
}

export interface SmartHomeSensors {
  gasLeak: boolean;
  smokeDetected: boolean;
  flameDetected: boolean;
  waterLeak: boolean;
  doorOpen: boolean;
  doorClosed: boolean;
  motionDetected: boolean;
  soundDetected: boolean;
  emergency: boolean;
  mq3Alert: boolean;
  mq3Analog: number;
  mq3Digital: number;
  ldr: number;
  temperature: number; // Celsius
  humidity: number;
  airQuality: number;
  smartLightsOn: boolean;
  smartLightsBrightness: number;
  smartFanOn: boolean;
  smartFanSpeed: number;
  doorLocked: boolean;
  alarmActive: boolean;
  relayState: boolean;
  lastUpdated?: string;
}

export interface ArduinoHubTelemetry {
  temperature: number;
  humidity: number;
  mq3Analog: number;
  mq3Digital: number;
  ldr: number;
  doorClosed: boolean;
  soundDetected: boolean;
  flameDetected: boolean;
  mq3Alert: boolean;
  emergency: boolean;
  lastUpdated?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  timing: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  timeStr: string;
  taken: boolean;
  instructions: string;
  icon: string;
}

export interface SpiritualTrack {
  id: string;
  title: string;
  artist: string;
  category: 'Mantra' | 'Gita' | 'Bhajan' | 'Prayer' | 'Meditation';
  duration: string;
  lyrics: string;
  audioUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'health' | 'emergency' | 'medicine' | 'smarthome';
  read: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  phone: string;
  email: string;
  credential: string; // e.g. Medical License No, Employee ID, etc.
  linkedElderId?: string; // Which elder this user is associated with
}
