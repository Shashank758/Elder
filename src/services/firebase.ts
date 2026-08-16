import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, push, Database } from "firebase/database";

// 1. Smart Watch Firebase Credentials (smart-watch-45fb4)
export const watchFirebaseConfig = {
  apiKey: "AIzaSyC_EW8Ba4GBybI8Vf2IPM6l45VeHQDVdLY",
  authDomain: "smart-watch-45fb4.firebaseapp.com",
  databaseURL: "https://smart-watch-45fb4-default-rtdb.firebaseio.com",
  projectId: "smart-watch-45fb4",
  storageBucket: "smart-watch-45fb4.firebasestorage.app",
  messagingSenderId: "259724418983",
  appId: "1:259724418983:web:27f88b29537d43a1e8a082",
  measurementId: "G-RBLJ9GT5NL"
};

// 2. Smart Home Hub Firebase Credentials (farmer-f19d9)
export const hubFirebaseConfig = {
  apiKey: "AIzaSyAjlLFQ91uQMHIzSyY_biDkEtRWmtlFI8w",
  authDomain: "farmer-f19d9.firebaseapp.com",
  databaseURL: "https://farmer-f19d9-default-rtdb.firebaseio.com",
  projectId: "farmer-f19d9",
  storageBucket: "farmer-f19d9.firebasestorage.app",
  messagingSenderId: "71192629092",
  appId: "1:71192629092:web:d4340485ec6743be78f471",
  measurementId: "G-83SB7ZF391"
};

// Initialize multi-app Firebase instances safely for HMR
export const watchApp: FirebaseApp =
  getApps().find(app => app.name === 'watchApp') || initializeApp(watchFirebaseConfig, 'watchApp');

export const hubApp: FirebaseApp =
  getApps().find(app => app.name === 'hubApp') || initializeApp(hubFirebaseConfig, 'hubApp');

// Separate RTDB Database Connections
export const watchDatabase: Database = getDatabase(watchApp);
export const hubDatabase: Database = getDatabase(hubApp);

// Legacy single-alias database pointing to hubDatabase (or watchDatabase)
export const database: Database = hubDatabase;
export const app: FirebaseApp = hubApp;
export const analytics = typeof window !== 'undefined' ? getAnalytics(hubApp) : null;

export interface SmartWatchTelemetry {
  acceleration: number;
  date: string;
  deviceId: string;
  deviceStatus: string;
  fallDetected: boolean;
  fallStatus: string;
  firmwareVersion: string;
  gyroscope: number;
  heartRate: number;
  pulseSignal: number;
  sos: boolean;
  time: string;
  uptimeMs: number;
  wifiConnected: boolean;
  wifiStrength: number;
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
  sosActive?: boolean;
  sosAlert?: boolean;
  lastUpdated?: string;
}

export { ref, onValue, set, push };
