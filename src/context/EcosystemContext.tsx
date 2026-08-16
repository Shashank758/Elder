import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppScreen, UserRole, LanguageCode, WatchTelemetry, SmartHomeSensors, MedicineItem, SpiritualTrack, NotificationItem, AuthUser, SmsAlertItem } from '../types';
import { SPIRITUAL_PLAYLIST } from '../data/playlist';
import { watchDatabase, hubDatabase, ref, onValue } from '../services/firebase';

export const ROLE_PROFILES: Record<UserRole, AuthUser> = {
  Elder: {
    id: 'u-elder-01',
    name: 'Devendra Kumar',
    role: 'Elder',
    avatar: '👴',
    phone: '+91 98765 43210',
    email: 'devendra.kumar@elderguard.ai',
    credential: 'Smartwatch ID: #EG-8841'
  },
  Family: {
    id: 'u-family-01',
    name: 'Rahul Kumar',
    role: 'Family',
    avatar: '👨‍👩‍👦',
    phone: '+91 98100 12345',
    email: 'rahul.kumar@gmail.com',
    credential: 'Primary Guardian (Son)',
    linkedElderId: 'u-elder-01'
  },
  Doctor: {
    id: 'u-doctor-01',
    name: 'Dr. A. Sharma (MD)',
    role: 'Doctor',
    avatar: '🩺',
    phone: '+91 98110 54321',
    email: 'dr.sharma@maxhospital.in',
    credential: 'Medical License: MCI-84920-CARD',
    linkedElderId: 'u-elder-01'
  },
  Admin: {
    id: 'u-admin-01',
    name: 'Fleet Ops Admin',
    role: 'Admin',
    avatar: '🛡️',
    phone: '+91 11 4000 8888',
    email: 'admin@elderguard.ai',
    credential: 'SuperAdmin RSA Key #902'
  },
  Caregiver: {
    id: 'u-caregiver-01',
    name: 'Priya Verma',
    role: 'Caregiver',
    avatar: '👩‍⚕️',
    phone: '+91 98711 22334',
    email: 'priya.v@carenet.in',
    credential: 'Registered Nurse #RN-4412',
    linkedElderId: 'u-elder-01'
  }
};

interface EcosystemContextType {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  loginAsRole: (selectedRole: UserRole) => void;
  logout: () => void;

  // Simple Mode for Elders & Caregivers
  simpleMode: boolean;
  setSimpleMode: (val: boolean) => void;

  // Mobile Menu Drawer
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;

  // Universal Voice Control Engine
  isGlobalVoiceListening: boolean;
  setIsGlobalVoiceListening: (val: boolean) => void;
  lastVoiceCommand: string;
  lastVoiceResponse: string;
  showVoiceGuide: boolean;
  setShowVoiceGuide: (val: boolean) => void;
  speakText: (text: string) => void;
  executeVoiceCommand: (cmd: string) => string;

  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  
  // Theme & Accessibility
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  accessibilityLargeText: boolean;
  setAccessibilityLargeText: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  voiceNavigation: boolean;
  setVoiceNavigation: (val: boolean) => void;
  comfortMode: boolean;
  setComfortMode: (val: boolean) => void;

  // Telemetry & Devices
  watchData: WatchTelemetry;
  setWatchData: React.Dispatch<React.SetStateAction<WatchTelemetry>>;
  homeSensors: SmartHomeSensors;
  setHomeSensors: React.Dispatch<React.SetStateAction<SmartHomeSensors>>;
  firebaseConnected: boolean;

  // Fall Detection Modal
  fallAlertActive: boolean;
  triggerFallAlert: () => void;
  dismissFallAlert: () => void;

  // Medicines
  medicines: MedicineItem[];
  toggleMedicineTaken: (id: string) => void;
  addMedicine: (med: Omit<MedicineItem, 'id' | 'taken'>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => void;
  unreadCount: number;

  // Spiritual Hub active track
  currentTrack: SpiritualTrack | null;
  setCurrentTrack: (track: SpiritualTrack | null) => void;
  isPlayingTrack: boolean;
  setIsPlayingTrack: (playing: boolean) => void;

  // Hydration
  logHydration: (amount: number) => void;

  // Live simulation & Hackathon Vitals Control
  isSimulatingFall: boolean;
  simulateFallEvent: () => void;
  simulateGasLeak: () => void;

  // Manual Vitals Entry & SMS Emergency Alert System
  latestSmsAlert: SmsAlertItem | null;
  dismissSmsAlert: () => void;
  updateVitals: (vitals: { heartRate?: number; systolicBp?: number; diastolicBp?: number; spO2?: number; temperature?: number }) => void;
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (val: boolean) => void;
}

const defaultWatchTelemetry: WatchTelemetry = {
  heartRate: 74,
  spO2: 98,
  temperature: 98.6,
  accelX: 0.12,
  accelY: 0.85,
  accelZ: 9.81,
  gyroX: 1.2,
  gyroY: -0.4,
  gyroZ: 0.8,
  pitch: 8.5,
  roll: -3.2,
  yaw: 42.1,
  tilt: 5.4,
  motionIntensity: 18,
  battery: 88,
  bluetoothConnected: true,
  wifiConnected: true,
  internetConnected: true,
  activity: 'Walking',
  activityConfidence: 96,
  ecgData: [0, 0.1, 0.2, 0.1, -0.2, 1.2, -0.6, 0.1, 0.2, 0, 0, 0.1],
  fallRiskScore: 12,
  aiHealthScore: 94,
  systolicBp: 122,
  diastolicBp: 78,
  stressLevel: 24,
  respirationRate: 16,
  steps: 4280,
  calories: 340,
  sleepHours: 7.5,
  sleepQuality: 'Optimal Restful',
  hydrationMl: 1450,
  hydrationGoal: 2000
};

const defaultHomeSensors: SmartHomeSensors = {
  gasLeak: false,
  smokeDetected: false,
  flameDetected: false,
  waterLeak: false,
  doorOpen: true,
  doorClosed: false,
  motionDetected: true,
  soundDetected: true,
  emergency: false,
  mq3Alert: false,
  mq3Analog: 533,
  mq3Digital: 0,
  ldr: 570,
  temperature: 0.0,
  humidity: 0.0,
  airQuality: 35,
  smartLightsOn: true,
  smartLightsBrightness: 80,
  smartFanOn: true,
  smartFanSpeed: 2,
  doorLocked: false,
  alarmActive: false,
  relayState: true,
  lastUpdated: '12:30:18'
};

const initialMedicines: MedicineItem[] = [
  { id: '1', name: 'Amlodipine (Blood Pressure)', dosage: '5 mg', timing: 'Morning', timeStr: '08:00 AM', taken: true, instructions: 'Take 1 tablet after breakfast with warm water', icon: 'Pill' },
  { id: '2', name: 'Metformin (Blood Sugar)', dosage: '500 mg', timing: 'Morning', timeStr: '08:30 AM', taken: true, instructions: 'Take with morning meal', icon: 'Pill' },
  { id: '3', name: 'Atorvastatin (Cholesterol)', dosage: '10 mg', timing: 'Afternoon', timeStr: '01:30 PM', taken: false, instructions: 'Take post lunch', icon: 'Tablet' },
  { id: '4', name: 'Multivitamin & Vitamin D3', dosage: '1 Capsule', timing: 'Evening', timeStr: '06:00 PM', taken: false, instructions: 'Take with evening snack', icon: 'Capsule' },
  { id: '5', name: 'Melatonin (Sleep Aid)', dosage: '3 mg', timing: 'Night', timeStr: '09:30 PM', taken: false, instructions: 'Take 30 mins before bedtime', icon: 'Moon' }
];

const initialNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Medicine Taken', message: 'Amlodipine 5mg logged successfully at 08:02 AM', timestamp: '08:02 AM', type: 'medicine', read: true },
  { id: 'n2', title: 'Heart Rate Normal', message: 'Average resting heart rate 72 BPM is stable today', timestamp: '09:30 AM', type: 'health', read: true },
  { id: 'n3', title: 'Smart Home Check', message: 'Door sensor secured. Air Quality Index is optimal (35 AQI)', timestamp: '11:15 AM', type: 'smarthome', read: false },
  { id: 'n4', title: 'Hydration Reminder', message: 'Time for a glass of warm water! (Target: 2,000 ml)', timestamp: '12:45 PM', type: 'health', read: false }
];

const EcosystemContext = createContext<EcosystemContextType | undefined>(undefined);

export const EcosystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreenState] = useState<AppScreen>(() => {
    const saved = localStorage.getItem('elderguide_active_screen');
    return (saved as AppScreen) || 'dashboard';
  });

  const setScreen = (newScreen: AppScreen) => {
    setScreenState(newScreen);
    localStorage.setItem('elderguide_active_screen', newScreen);
  };

  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('elderguide_user_role');
    return (saved as UserRole) || 'Elder';
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const savedRole = (localStorage.getItem('elderguide_user_role') as UserRole) || 'Elder';
    return ROLE_PROFILES[savedRole] || ROLE_PROFILES['Elder'];
  });

  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('elderguide_auth');
    return savedAuth !== null ? savedAuth === 'true' : true;
  });

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    localStorage.setItem('elderguide_auth', auth ? 'true' : 'false');
  };

  // Simple Mode (Defaults to true for ultimate ease of use & adaptability)
  const [simpleMode, setSimpleMode] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Voice Engine State
  const [isGlobalVoiceListening, setIsGlobalVoiceListening] = useState<boolean>(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string>('');
  const [lastVoiceResponse, setLastVoiceResponse] = useState<string>('');
  const [showVoiceGuide, setShowVoiceGuide] = useState<boolean>(false);

  const [language, setLanguage] = useState<LanguageCode>('en');
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('elderguide_theme');
    return saved !== null ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('elderguide_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const [accessibilityLargeText, setAccessibilityLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceNavigation, setVoiceNavigation] = useState(true);
  const [comfortMode, setComfortMode] = useState(false);

  const [watchData, setWatchData] = useState<WatchTelemetry>(defaultWatchTelemetry);
  const [homeSensors, setHomeSensors] = useState<SmartHomeSensors>(defaultHomeSensors);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);
  
  const [fallAlertActive, setFallAlertActive] = useState(false);
  const [isSimulatingFall, setIsSimulatingFall] = useState(false);
  
  // Hackathon Manual Vital Entry & SMS Alert State
  const [latestSmsAlert, setLatestSmsAlert] = useState<SmsAlertItem | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  
  const [medicines, setMedicines] = useState<MedicineItem[]>(initialMedicines);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  
  const [currentTrack, setCurrentTrack] = useState<SpiritualTrack | null>(null);
  const [isPlayingTrack, setIsPlayingTrack] = useState(false);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setCurrentUser(ROLE_PROFILES[newRole] || ROLE_PROFILES['Elder']);
    localStorage.setItem('elderguide_user_role', newRole);
  };

  const loginAsRole = (selectedRole: UserRole) => {
    setRoleState(selectedRole);
    setCurrentUser(ROLE_PROFILES[selectedRole] || ROLE_PROFILES['Elder']);
    setIsAuthenticated(true);

    // Dynamic Default Screen by Role:
    switch (selectedRole) {
      case 'Doctor':
        setScreen('doctor');
        break;
      case 'Family':
        setScreen('family');
        break;
      case 'Admin':
        setScreen('admin');
        break;
      case 'Elder':
      default:
        setScreen('dashboard');
        break;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setScreen('login');
  };

  // Firebase Realtime Database Listeners for Smart Watch (smart-watch-45fb4) & Home Hub (farmer-f19d9)
  useEffect(() => {
    try {
      // 1. SMART WATCH FIREBASE LISTENER (smart-watch-45fb4)
      const watchRef = ref(watchDatabase, 'elderguard/watches/EG-WATCH-001/current');
      const unsubscribeWatchDirect = onValue(watchRef, (snapshot) => {
        if (snapshot.exists()) {
          const watchDataVal = snapshot.val();
          setFirebaseConnected(true);
          if (watchDataVal && typeof watchDataVal === 'object') {
            const parsedHr = typeof watchDataVal.heartRate === 'number' && watchDataVal.heartRate > 0
              ? Number(watchDataVal.heartRate.toFixed(1))
              : null;

            const isWifi = typeof watchDataVal.wifiConnected === 'boolean'
              ? watchDataVal.wifiConnected
              : true;

            const isOnline = watchDataVal.deviceStatus === 'ONLINE' || isWifi;
            const isFall = watchDataVal.fallDetected === true || watchDataVal.fallStatus === 'IMPACT' || watchDataVal.fallStatus === 'FALL_DETECTED';
            const isSos = watchDataVal.sos === true;

            if (isFall || isSos) {
              setFallAlertActive(true);
            }

            setWatchData(prev => ({
              ...prev,
              heartRate: parsedHr ?? prev.heartRate,
              wifiConnected: isWifi,
              bluetoothConnected: isOnline,
              deviceId: watchDataVal.deviceId || 'EG-WATCH-001',
              deviceStatus: watchDataVal.deviceStatus || (isOnline ? 'ONLINE' : 'OFFLINE'),
              fallDetected: watchDataVal.fallDetected ?? false,
              fallStatus: watchDataVal.fallStatus || (isFall ? 'FALL_DETECTED' : 'NORMAL'),
              pulseSignal: watchDataVal.pulseSignal ?? prev.pulseSignal,
              sos: isSos,
              uptimeMs: watchDataVal.uptimeMs ?? prev.uptimeMs,
              wifiStrength: watchDataVal.wifiStrength ?? prev.wifiStrength,
              firmwareVersion: watchDataVal.firmwareVersion || '2.0.0',
              watchDate: watchDataVal.date || prev.watchDate,
              watchTime: watchDataVal.time || prev.watchTime,
              accelX: typeof watchDataVal.acceleration === 'number' ? watchDataVal.acceleration : prev.accelX,
              gyroX: typeof watchDataVal.gyroscope === 'number' ? watchDataVal.gyroscope : prev.gyroX,
              motionIntensity: typeof watchDataVal.acceleration === 'number' ? Math.max(12, Math.round(watchDataVal.acceleration * 10)) : prev.motionIntensity
            }));
          }
        }
      });

      // Fallback root listener for Smart Watch
      const watchRootRef = ref(watchDatabase, '/');
      const unsubscribeWatchRoot = onValue(watchRootRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const watchDataVal =
            val.elderguard?.watches?.['EG-WATCH-001']?.current ||
            val.elderguard?.watches?.current ||
            val.watches?.['EG-WATCH-001']?.current ||
            val.watchCurrent ||
            val.watch;

          if (watchDataVal && typeof watchDataVal === 'object') {
            setFirebaseConnected(true);
            const isFall = watchDataVal.fallDetected === true || watchDataVal.fallStatus === 'IMPACT';
            const isSos = watchDataVal.sos === true;
            if (isFall || isSos) {
              setFallAlertActive(true);
            }
            setWatchData(prev => ({
              ...prev,
              heartRate: typeof watchDataVal.heartRate === 'number' ? Number(watchDataVal.heartRate.toFixed(1)) : prev.heartRate,
              fallDetected: watchDataVal.fallDetected ?? prev.fallDetected,
              sos: watchDataVal.sos ?? prev.sos
            }));
          }
        }
      });

      // 2. SMART HOME HUB FIREBASE LISTENER (farmer-f19d9)
      // Actual data path: /ElderGuard/sensor_data/latest
      const hubLatestRef = ref(hubDatabase, 'ElderGuard/sensor_data/latest');
      const unsubscribeHubLatest = onValue(hubLatestRef, (snapshot) => {
        if (snapshot.exists()) {
          const homeData = snapshot.val();
          setFirebaseConnected(true);
          console.log('[HUB FIREBASE] Live sensor update:', homeData);

          if (homeData && typeof homeData === 'object') {
            // SOS Check from Smart Hub telemetry stream
            const isSos = homeData.sosActive === true || homeData.sos === true || homeData.sosAlert === true || homeData.emergency === true;

            // Trigger full-screen Emergency Alert modal on web app screen whenever SOS is true!
            if (isSos) {
              setFallAlertActive(true);
            }

            setHomeSensors(prev => ({
              ...prev,
              temperature: typeof homeData.temperature === 'number' ? homeData.temperature : prev.temperature,
              humidity: typeof homeData.humidity === 'number' ? homeData.humidity : prev.humidity,
              mq3Analog: typeof homeData.mq3Analog === 'number' ? homeData.mq3Analog : prev.mq3Analog,
              mq3Digital: typeof homeData.mq3Digital === 'number' ? homeData.mq3Digital : prev.mq3Digital,
              ldr: typeof homeData.ldr === 'number' ? homeData.ldr : prev.ldr,
              doorClosed: typeof homeData.doorClosed === 'boolean' ? homeData.doorClosed : prev.doorClosed,
              doorOpen: typeof homeData.doorClosed === 'boolean' ? !homeData.doorClosed : prev.doorOpen,
              soundDetected: typeof homeData.soundDetected === 'boolean' ? homeData.soundDetected : prev.soundDetected,
              flameDetected: typeof homeData.flameDetected === 'boolean' ? homeData.flameDetected : prev.flameDetected,
              mq3Alert: typeof homeData.mq3Alert === 'boolean' ? homeData.mq3Alert : prev.mq3Alert,
              gasLeak: typeof homeData.mq3Alert === 'boolean' ? homeData.mq3Alert : prev.gasLeak,
              emergency: isSos,
              sosActive: homeData.sosActive ?? isSos,
              sosAlert: homeData.sosAlert ?? isSos,
              lastUpdated: new Date().toLocaleTimeString()
            }));
          }
        }
      }, (err) => {
        console.warn("Hub Firebase listener notice:", err);
      });

      return () => {
        unsubscribeWatchDirect();
        unsubscribeWatchRoot();
        unsubscribeHubLatest();
      };
    } catch (e) {
      console.warn("Firebase init error:", e);
    }
  }, []);

  // Live simulation of MPU6050 & Heartbeat telemetry (only when Firebase is NOT connected)
  useEffect(() => {
    const interval = setInterval(() => {
      if (firebaseConnected) return; // Prioritize real-time Firebase data when live
      setWatchData(prev => {
        const hrJitter = Math.floor(Math.random() * 5) - 2;
        const accelJitterX = Number((prev.accelX + (Math.random() * 0.1 - 0.05)).toFixed(2));
        const accelJitterY = Number((prev.accelY + (Math.random() * 0.1 - 0.05)).toFixed(2));
        const pitchJitter = Number((prev.pitch + (Math.random() * 1.5 - 0.75)).toFixed(1));
        const rollJitter = Number((prev.roll + (Math.random() * 1.5 - 0.75)).toFixed(1));
        const yawJitter = Number((prev.yaw + (Math.random() * 0.5 - 0.25)).toFixed(1));

        return {
          ...prev,
          heartRate: Math.max(62, Math.min(105, prev.heartRate + hrJitter)),
          accelX: accelJitterX,
          accelY: accelJitterY,
          pitch: pitchJitter,
          roll: rollJitter,
          yaw: yawJitter
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [firebaseConnected]);

  // Update HTML body accessibility classes
  useEffect(() => {
    if (accessibilityLargeText) {
      document.body.classList.add('accessibility-large-text');
    } else {
      document.body.classList.remove('accessibility-large-text');
    }

    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }

    if (!darkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [accessibilityLargeText, highContrast, darkMode]);

  // Speech Synthesis helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      const langMap: Record<LanguageCode, string> = {
        en: 'en-US', hi: 'hi-IN', gu: 'gu-IN', ta: 'ta-IN', mr: 'mr-IN', pa: 'pa-IN', bn: 'bn-IN'
      };
      utterance.lang = langMap[language] || 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  };

  const triggerFallAlert = () => {
    setFallAlertActive(true);
    addNotification({
      title: '🚨 FALL DETECTED',
      message: 'Smartwatch detected high-G impact & horizontal posture',
      type: 'emergency'
    });
  };

  const toggleMedicineTaken = (id: string) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  // Universal Voice Command Classifier & Execution Engine
  const executeVoiceCommand = (rawText: string): string => {
    const text = rawText.trim();
    if (!text) return '';
    setLastVoiceCommand(text);

    const lower = text.toLowerCase();
    let reply = '';

    // 1. Emergency / SOS
    if (lower.includes('emergency') || lower.includes('sos') || lower.includes('help') || lower.includes('fall')) {
      triggerFallAlert();
      reply = "Emergency SOS Alert triggered! Alerting family and contacts immediately!";
    }
    // 2. Main Navigation
    else if (lower.includes('home') || lower.includes('dashboard') || lower.includes('main')) {
      setScreen('dashboard');
      reply = "Opening Home Dashboard.";
    } else if (lower.includes('medicine') || lower.includes('pill') || lower.includes('med')) {
      setScreen('medicine');
      reply = "Opening Medicine Schedule.";
    } else if (lower.includes('spiritual') || lower.includes('bhajan') || lower.includes('mantra') || lower.includes('prayer') || lower.includes('sanctuary')) {
      setScreen('spiritual');
      reply = "Opening Devotional Sanctuary.";
    } else if (lower.includes('smart home') || lower.includes('lights') || lower.includes('fan') || lower.includes('home hub')) {
      setScreen('smarthome');
      reply = "Opening Smart Home Controls.";
    } else if (lower.includes('companion') || lower.includes('assistant') || lower.includes('talk')) {
      setScreen('companion');
      reply = "Opening AI Voice Companion.";
    } else if (lower.includes('doctor') || lower.includes('clinic')) {
      setScreen('doctor');
      reply = "Opening Doctor Portal.";
    } else if (lower.includes('family') || lower.includes('guardian') || lower.includes('son')) {
      setScreen('family');
      reply = "Opening Family Guardian Portal.";
    } else if (lower.includes('settings') || lower.includes('preference')) {
      setScreen('settings');
      reply = "Opening App Settings.";
    }
    // 3. Simple Mode Control
    else if (lower.includes('simple mode') || lower.includes('easy mode') || lower.includes('simplify')) {
      setSimpleMode(true);
      reply = "Easy Simple Mode enabled for clean viewing.";
    } else if (lower.includes('normal mode') || lower.includes('advanced mode') || lower.includes('full view')) {
      setSimpleMode(false);
      reply = "Advanced View enabled.";
    }
    // 4. Voice In-App Actions
    else if (lower.includes('take medicine') || lower.includes('took medicine') || lower.includes('mark taken')) {
      const untakenMed = medicines.find(m => !m.taken);
      if (untakenMed) {
        toggleMedicineTaken(untakenMed.id);
        reply = `Marked ${untakenMed.name} as taken!`;
      } else {
        reply = "All scheduled medicines for today are already taken!";
      }
    } else if (lower.includes('play hanuman') || lower.includes('hanuman chalisa')) {
      const track = SPIRITUAL_PLAYLIST.find(t => t.id === 'sp1') || SPIRITUAL_PLAYLIST[0];
      setCurrentTrack(track);
      setIsPlayingTrack(true);
      reply = "Playing Shree Hanuman Chalisa now.";
    } else if (lower.includes('play gayatri')) {
      const track = SPIRITUAL_PLAYLIST.find(t => t.id === 'sp2') || SPIRITUAL_PLAYLIST[1];
      setCurrentTrack(track);
      setIsPlayingTrack(true);
      reply = "Playing Gayatri Mantra now.";
    } else if (lower.includes('play achyutam') || lower.includes('krishna')) {
      const track = SPIRITUAL_PLAYLIST.find(t => t.id === 'sp6') || SPIRITUAL_PLAYLIST[5];
      setCurrentTrack(track);
      setIsPlayingTrack(true);
      reply = "Playing Achyutam Keshavam Krishna Damodaram.";
    } else if (lower.includes('play gita') || lower.includes('bhagavad')) {
      const track = SPIRITUAL_PLAYLIST.find(t => t.id === 'sp4') || SPIRITUAL_PLAYLIST[3];
      setCurrentTrack(track);
      setIsPlayingTrack(true);
      reply = "Playing Bhagavad Gita Chapter 2.";
    } else if (lower.includes('play music') || lower.includes('play audio') || lower.includes('play bhajan') || lower.includes('play song')) {
      const track = SPIRITUAL_PLAYLIST[0];
      setCurrentTrack(track);
      setIsPlayingTrack(true);
      reply = `Playing ${track.title}.`;
    } else if (lower.includes('stop music') || lower.includes('pause music') || lower.includes('stop audio') || lower.includes('pause audio')) {
      setIsPlayingTrack(false);
      reply = "Devotional audio paused.";
    } else if (lower.includes('turn on light') || lower.includes('lights on')) {
      setHomeSensors(prev => ({ ...prev, smartLightsOn: true }));
      reply = "Smart lights turned ON.";
    } else if (lower.includes('turn off light') || lower.includes('lights off')) {
      setHomeSensors(prev => ({ ...prev, smartLightsOn: false }));
      reply = "Smart lights turned OFF.";
    } else if (lower.includes('turn on fan') || lower.includes('fan on')) {
      setHomeSensors(prev => ({ ...prev, smartFanOn: true }));
      reply = "Smart fan turned ON.";
    } else if (lower.includes('turn off fan') || lower.includes('fan off')) {
      setHomeSensors(prev => ({ ...prev, smartFanOn: false }));
      reply = "Smart fan turned OFF.";
    } else if (lower.includes('heart') || lower.includes('pulse') || lower.includes('vitals') || lower.includes('health status')) {
      reply = `Heart rate is ${watchData.heartRate} BPM, Blood oxygen is ${watchData.spO2} percent. Vitals are stable.`;
    } else if (lower.includes('read screen') || lower.includes('speak screen') || lower.includes('what page')) {
      reply = `You are on the ${screen} screen.`;
    } else {
      reply = `Recognized command "${text}". Try saying "Medicine", "Play Hanuman Chalisa", "Smart Home", "SOS", or "Simple Mode".`;
    }

    setLastVoiceResponse(reply);
    speakText(reply);
    return reply;
  };

  const dismissFallAlert = () => {
    setFallAlertActive(false);
    setIsSimulatingFall(false);
  };

  const simulateFallEvent = () => {
    setIsSimulatingFall(true);
    triggerFallAlert();
  };

  const simulateGasLeak = () => {
    setHomeSensors(prev => ({ ...prev, gasLeak: true, alarmActive: true }));
    addNotification({
      title: '⚠️ GAS LEAK DETECTED',
      message: 'ESP32 Smart Home Sensor detected elevated combustible gas levels in kitchen!',
      type: 'smarthome'
    });
  };

  const addMedicine = (med: Omit<MedicineItem, 'id' | 'taken'>) => {
    const newMed: MedicineItem = {
      ...med,
      id: Date.now().toString(),
      taken: false
    };
    setMedicines(prev => [...prev, newMed]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif: NotificationItem = {
      ...notif,
      id: Date.now().toString(),
      read: false,
      timestamp: timeNow
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const logHydration = (amount: number) => {
    setWatchData(prev => ({
      ...prev,
      hydrationMl: Math.min(prev.hydrationGoal + 500, prev.hydrationMl + amount)
    }));
    addNotification({
      title: 'Hydration Logged',
      message: `Added ${amount}ml of hydration. Keep up the healthy habit!`,
      type: 'health'
    });
  };

  const dismissSmsAlert = () => setLatestSmsAlert(null);

  const updateVitals = (vitals: {
    heartRate?: number;
    systolicBp?: number;
    diastolicBp?: number;
    spO2?: number;
    temperature?: number;
  }) => {
    setWatchData(prev => {
      const updated = {
        ...prev,
        heartRate: typeof vitals.heartRate === 'number' ? vitals.heartRate : prev.heartRate,
        systolicBp: typeof vitals.systolicBp === 'number' ? vitals.systolicBp : prev.systolicBp,
        diastolicBp: typeof vitals.diastolicBp === 'number' ? vitals.diastolicBp : prev.diastolicBp,
        spO2: typeof vitals.spO2 === 'number' ? vitals.spO2 : prev.spO2,
        temperature: typeof vitals.temperature === 'number' ? vitals.temperature : prev.temperature
      };

      const hr = updated.heartRate;
      const sys = updated.systolicBp;
      const dia = updated.diastolicBp;
      const spo2 = updated.spO2;
      const temp = updated.temperature;

      let alertMessage = '';
      let alertType = '';
      let vitalName = '';
      let vitalValue = '';
      let normalRange = '';
      let severity: 'CRITICAL' | 'WARNING' = 'CRITICAL';

      if (hr > 120) {
        alertType = 'HIGH_HR';
        vitalName = 'Heart Rate (Tachycardia)';
        vitalValue = `${hr} BPM`;
        normalRange = '60 - 100 BPM';
        alertMessage = `CRITICAL ALERT: Devendra's Heart Rate reached ${hr} BPM (Tachycardia threshold > 120 BPM). Immediate caregiver attention required!`;
      } else if (sys > 140 || dia > 90) {
        alertType = 'HIGH_BP';
        vitalName = 'Blood Pressure Surge';
        vitalValue = `${sys}/${dia} mmHg`;
        normalRange = '90/60 - 120/80 mmHg';
        alertMessage = `CRITICAL ALERT: Devendra's Blood Pressure elevated to ${sys}/${dia} mmHg (Hypertensive Stage 2 > 140/90). Emergency notification dispatched to guardians!`;
      } else if (spo2 < 92) {
        alertType = 'LOW_SPO2';
        vitalName = 'Blood Oxygen (Hypoxia)';
        vitalValue = `${spo2}% SpO₂`;
        normalRange = '95% - 100%';
        alertMessage = `WARNING ALERT: Devendra's SpO₂ Oxygen level dropped to ${spo2}% (Hypoxia threshold < 92%). Supplemental oxygen recommended.`;
      } else if (temp > 38.0 || temp > 100.4) {
        alertType = 'HIGH_TEMP';
        vitalName = 'Body Temperature (Fever)';
        vitalValue = `${temp}°C`;
        normalRange = '36.5°C - 37.5°C';
        alertMessage = `HIGH FEVER ALERT: Devendra's body temperature reached ${temp}°C. Fever protocol initiated.`;
      }

      if (alertMessage) {
        const smsItem: SmsAlertItem = {
          id: 'sms-' + Date.now(),
          recipient: 'Son (Amit +91 98100 12345) & Daughter (Neha)',
          message: alertMessage,
          timestamp: new Date().toLocaleTimeString(),
          type: alertType,
          vitalName,
          vitalValue,
          normalRange,
          severity
        };

        setLatestSmsAlert(smsItem);
        speakText(`Warning! ${vitalName} reading is high at ${vitalValue}. SMS emergency notification sent to family members.`);
        
        addNotification({
          title: `📲 SMS SENT: ${vitalName}`,
          message: alertMessage,
          type: 'emergency'
        });
      }

      return updated;
    });
  };

  return (
    <EcosystemContext.Provider
      value={{
        screen, setScreen,
        role, setRole,
        currentUser, isAuthenticated,
        loginAsRole, logout,
        simpleMode, setSimpleMode,
        mobileMenuOpen, setMobileMenuOpen,
        isGlobalVoiceListening, setIsGlobalVoiceListening,
        lastVoiceCommand, lastVoiceResponse,
        showVoiceGuide, setShowVoiceGuide,
        speakText, executeVoiceCommand,
        language, setLanguage,
        darkMode, setDarkMode,
        accessibilityLargeText, setAccessibilityLargeText,
        highContrast, setHighContrast,
        voiceNavigation, setVoiceNavigation,
        comfortMode, setComfortMode,
        watchData, setWatchData,
        homeSensors, setHomeSensors,
        firebaseConnected,
        fallAlertActive, triggerFallAlert, dismissFallAlert,
        medicines, toggleMedicineTaken, addMedicine,
        notifications, markNotificationRead, addNotification, unreadCount,
        currentTrack, setCurrentTrack, isPlayingTrack, setIsPlayingTrack,
        logHydration,
        isSimulatingFall, simulateFallEvent, simulateGasLeak,
        latestSmsAlert, dismissSmsAlert, updateVitals,
        isSimulatorOpen, setIsSimulatorOpen
      }}
    >
      {children}
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = () => {
  const context = useContext(EcosystemContext);
  if (!context) {
    throw new Error('useEcosystem must be used within an EcosystemProvider');
  }
  return context;
};
