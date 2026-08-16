# 🛡️ ElderGuard AI 360 — Senior Care & Monitoring Platform

**ElderGuard AI 360** is a production-grade elderly safety platform that synthesizes real-time Firebase IoT telemetry (from smartwatch wearables and smart home hubs) into an intelligent, explainable health and behavioral model for senior **Devendra Kumar (78y)**, monitored by family guardian **Rahul Kumar**.

---

## 🌟 Key Highlights of the AI 360 Production Upgrade

- 📌 **Single Source of Truth Snapshot**: All AI components (Data Quality, Behavior Model, Context Engine, Anomaly Engine, Risk Engine, Explanations) consume the exact same `NormalizedSensorSnapshot` at a unified `eventTimestamp` and `processedAt`.
- 🛡️ **Independent Data Quality & Health Risk**: Data Quality Score (0–100) and Health Risk Score (0–100) are evaluated as separate dimensions. An invalid temperature reading (e.g. `999°C` or missing sensor) triggers a **Data Quality Warning** while keeping the **Health Risk UNCHANGED**.
- 📊 **Robust Z-Score Anomaly Engine**: Calculates statistical deviations ($Z = \frac{\text{current} - \mu}{\sigma}$) using robust statistics (Mean, Std, Median, MAD, p25, p75). An HR of 109 BPM vs $97 \pm 17$ BPM ($Z = 0.71\sigma$) is correctly recognized as normal ($|Z| \le 2.2\sigma$).
- 🌙 **Context-Aware Sleeping Protection**: Low activity ($2\%$) during Night hours is classified as `SLEEPING` and recognized as normal/expected behavior (NO false activity anomaly).
- 🛠️ **Developer AI Debug Panel**: Expandable terminal (`>_ AI Debug Panel`) displaying live snapshot timestamps, freshness, context state, baseline Z-scores, and evidence objects.
- 👨‍👩‍👦 **Caregiver Feedback Storage**: Persistent recording of caregiver feedback (`REAL_CONCERN` / `FALSE_ALARM`) for model evaluation.
- 🎮 **9 Deterministic Demo Scenarios**: Comprehensive scenario testing suite (Normal Night, Normal Morning, Low Activity Day, Elevated HR, Possible Fall, Prolonged Inactivity, Fall & SOS Critical, Invalid Sensor Data, Telemetry Disconnect).

---

## 🏗️ Architecture Pipeline

```text
REAL IoT TELEMETRY (Smartwatch EG-WATCH-001 + Living Room Hub)
                        │
                        ▼
         1. Single Source Sensor Snapshot
   (Explicit null checks & timestamp freshness)
                        │
                        ▼
           2. Data Quality Service
  (Independent Data Quality score 0-100 & warnings)
                        │
                        ▼
        3. Personal Behavior Baseline Model
 (Segmented time/day robust stats: Mean, Std, Median, MAD)
                        │
                        ▼
             4. Context-Aware Engine
   (Activity state: SLEEPING, RESTING, WALKING, ACTIVE)
                        │
                        ▼
     5. Anomaly Detection & Multi-Sensor Fusion
   (Z-score calculation & multi-sensor evidence)
                        │
                        ▼
      6. Risk Engine & Dynamic Explainability
  (Separate Health Risk score 0-100 & AI Confidence %)
                        │
                        ▼
       7. Caregiver Command Dashboard UI
  (Live metrics, anomaly log, debug panel & demo suite)
```

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Development Server**:
   ```bash
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```

---

*ElderGuard AI 360 — Real-Time Senior Safety & Explainable AI.*
