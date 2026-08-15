import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, push, Database } from "firebase/database";

// Firebase Configuration from user
const firebaseConfig = {
  apiKey: "AIzaSyAjlLFQ91uQMHIzSyY_biDkEtRWmtlFI8w",
  authDomain: "farmer-f19d9.firebaseapp.com",
  databaseURL: "https://farmer-f19d9-default-rtdb.firebaseio.com",
  projectId: "farmer-f19d9",
  storageBucket: "farmer-f19d9.firebasestorage.app",
  messagingSenderId: "71192629092",
  appId: "1:71192629092:web:d4340485ec6743be78f471",
  measurementId: "G-83SB7ZF391"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const database: Database = getDatabase(app);

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
