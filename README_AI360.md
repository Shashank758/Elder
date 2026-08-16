# 🧠 ElderGuard AI 360 — Production AI Logic Specification & Architecture

Welcome to the comprehensive technical documentation for the **ElderGuard AI 360** production upgrade. This specification details the underlying deterministic AI pipeline, mathematical Z-score formulas, multi-sensor evidence fusion, data quality separation, and context-aware behavior modeling for senior **Devendra Kumar (78y)**.

---

## 📌 1. Single Source of Truth & Timestamp Consistency

Every component in the ElderGuard AI 360 architecture reads from a single, unified `NormalizedSensorSnapshot` generated at `eventTimestamp` and processed at `processedAt`.

```typescript
export interface NormalizedSensorSnapshot {
  eventTimestamp: number;
  processedAt: number;
  freshness: 'FRESH' | 'AGING' | 'STALE';
  ageSeconds: number;
  heartRate: number | null;        // NULL if invalid or missing! Never default to 0!
  spO2: number | null;
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  activityLevel: number;           // 0.0 to 1.0
  inactivityDurationMinutes: number;
  roomTemperature: number | null;  // NULL if unavailable! Never default to 0°C!
  humidity: number | null;
  fallDetected: boolean;
  fallStatus: string;
  sosPressed: boolean;
  source: 'wearable' | 'homehub' | 'composite';
}
```

---

## 🛡️ 2. Separation of Data Quality & Health Risk

Data Quality and Elderly Health Risk are evaluated as **two completely independent dimensions**:

- **Health Risk (`healthRisk`)**: Evaluates physical health, movement hazards, cardiac spikes, and fall impacts (Score: 0–100, Level: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- **Data Quality (`dataQuality`)**: Evaluates telemetry freshness, device online status, and sensor out-of-bounds anomalies (Score: 0–100, Level: `GOOD`, `WARNING`, `CRITICAL`).

> **Critical Rule**: An invalid temperature telemetry reading (e.g. `999°C` or missing sensor) triggers a **Data Quality Warning**, while keeping the **Elderly Health Risk Score UNCHANGED**.

---

## 📊 3. Statistical Baseline Modeling & Z-Score Anomaly Engine

Standardized Z-Score deviation is calculated as:

$$Z = \frac{X_{\text{current}} - \mu_{\text{baseline}}}{\sigma_{\text{baseline}}}$$

### Robust Statistics
- **Mean ($\mu$) & Standard Deviation ($\sigma$)**
- **Median & Median Absolute Deviation (MAD)**
- **Percentiles ($p_{25}, p_{75}$)**
- **Time Window Segmentation**: `morning`, `afternoon`, `evening`, `night`
- **Day Type Segmentation**: `weekday`, `weekend`

---

## 🧭 4. Context-Aware Activity Engine

The Context Engine derives `ActivityState` from time of day, movement intensity, and inactivity duration:

| Activity State | Trigger Condition | Anomaly Evaluation |
| :--- | :--- | :--- |
| `SLEEPING` | Night window (22:00–06:30) & Activity $\le 20\%$ | **Normal/Expected** (Low activity is NOT flagged as anomaly) |
| `RESTING` | Non-sleep hours & Activity $< 25\%$ | Baseline comparison |
| `WALKING` | Activity between $25\%$ and $65\%$ | Normal active state |
| `ACTIVE` | Activity $> 65\%$ | Active movement baseline comparison |
| `INACTIVE` | Daytime inactivity $\ge 35$ minutes | Flagged as `UNUSUAL_INACTIVITY` if persistent |
| `UNKNOWN` | Telemetry disconnected or invalid HR | Baseline confidence reduced |

---

## 🧪 5. Validation Tests Matrix

| Test Scenario | Input Data | Expected Health Risk | Expected Data Quality | Anomaly Decision |
| :--- | :--- | :--- | :--- | :--- |
| **TEST 1: Night Sleeping** | Time=Night, Act=2%, HR=68 | **LOW (10/100)** | **GOOD (98%)** | NO Activity Anomaly (`SLEEPING` expected) |
| **TEST 2: Daytime Low Activity** | Time=11:30 AM, Act=2%, Inactivity=52m | **MODERATE (42/100)** | **GOOD (98%)** | `ACTIVITY_DEVIATION` & `UNUSUAL_INACTIVITY` |
| **TEST 3: Slight HR Rise** | HR=109 BPM vs $97 \pm 17$ BPM ($Z=0.71\sigma$) | **LOW (10/100)** | **GOOD (98%)** | NO HR Anomaly ($|Z| \le 2.2\sigma$ threshold) |
| **TEST 4: Invalid Sensor (999°C)** | HR=74, Temp=999°C (Out of bounds) | **LOW (10/100)** | **WARNING (45%)** | Data Quality Warning (`Health Risk UNCHANGED`) |
| **TEST 5: Disconnect / Stale** | Age=300s (>120s limit), Device=OFFLINE | **LOW (10/100)** | **CRITICAL (30%)** | `SENSOR_DATA_STALE` badge |
| **TEST 6: Critical Fall & SOS** | Accel=19.8 m/s², Fall=true, SOS=true | **CRITICAL (95/100)** | **GOOD (98%)** | `POSSIBLE_FALL` & `MULTI_SENSOR_ANOMALY` |

---

## 👨‍👩‍👦 6. Caregiver Human-in-the-Loop Feedback

Caregivers can submit feedback (`REAL_CONCERN` or `FALSE_ALARM`) directly from the command center. Submissions are saved persistently in `localStorage` (`elderguard_ai_feedback`) to evaluate and retrain baseline tolerances over time.

---

## 🛠️ 7. Developer AI Debug Panel

Clicking **`>_ AI Debug Panel`** in the header expands a real-time terminal displaying:
1. **Snapshot & Freshness**: Event Timestamp, ProcessedAt, Freshness status, Age in seconds.
2. **Context & Classification**: Time window, Day type, Activity State, Environment status.
3. **Baseline & Robust Stats**: Stage, Confidence %, Resting HR mean/std, Expected activity mean.
4. **Risk vs Data Quality**: Health Risk score (0–100), Data Quality score (0–100), AI Confidence %, Warnings list.

---

*ElderGuard AI 360 — Deterministic, Context-Aware & Explainable AI for Elderly Safety.*
