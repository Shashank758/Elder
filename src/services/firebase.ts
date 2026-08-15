import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, push, Database } from "firebase/database";

// Firebase Configuration for Smart Watch & ElderGuard RTDB
const firebaseConfig = {
  apiKey: "AIzaSyC_EW8Ba4GBybI8Vf2IPM6l45VeHQDVdLY",
  authDomain: "smart-watch-45fb4.firebaseapp.com",
  databaseURL: "https://smart-watch-45fb4-default-rtdb.firebaseio.com",
  projectId: "smart-watch-45fb4",
  storageBucket: "smart-watch-45fb4.firebasestorage.app",
  messagingSenderId: "259724418983",
  appId: "1:259724418983:web:27f88b29537d43a1e8a082",
  measurementId: "G-RBLJ9GT5NL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const database: Database = getDatabase(app);

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
  lastUpdated?: string;
}

export { app, analytics, database, ref, onValue, set, push };
