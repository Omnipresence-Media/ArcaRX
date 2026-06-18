import type { LabResult, LabFlag } from "./types";

function flag(v: number, low: number, high: number): LabFlag {
  if (v < low * 0.8 || v > high * 1.3) return "critical";
  if (v < low) return "low";
  if (v > high) return "high";
  return "ok";
}

export const labResults: LabResult[] = [
  {
    id: "lab-1",
    patientId: "pat-1",
    providerId: "prov-1",
    orderedDate: "2026-06-09",
    resultDate: "2026-06-12",
    panelName: "Comprehensive Hormone + Metabolic Panel",
    status: "reviewed",
    notes: "TSH trending upward over 3 consecutive draws. Vitamin D critically low. Initiating supplementation.",
    results: [
      { name: "TSH", value: 3.8, unit: "mIU/L", refLow: 0.4, refHigh: 4.0, flag: "high", trend: [2.1, 2.4, 2.8, 3.1, 3.5, 3.8] },
      { name: "Free T4", value: 1.1, unit: "ng/dL", refLow: 0.8, refHigh: 1.8, flag: "ok", trend: [1.3, 1.2, 1.1, 1.2, 1.1, 1.1] },
      { name: "Estradiol", value: 64, unit: "pg/mL", refLow: 30, refHigh: 200, flag: "ok", trend: [18, 42, 55, 60, 62, 64] },
      { name: "LDL-C", value: 142, unit: "mg/dL", refLow: 0, refHigh: 100, flag: "high", trend: [128, 134, 130, 138, 140, 142] },
      { name: "HDL-C", value: 58, unit: "mg/dL", refLow: 40, refHigh: 100, flag: "ok", trend: [54, 55, 56, 57, 58, 58] },
      { name: "Triglycerides", value: 112, unit: "mg/dL", refLow: 0, refHigh: 150, flag: "ok", trend: [130, 125, 118, 115, 114, 112] },
      { name: "HbA1c", value: 5.6, unit: "%", refLow: 0, refHigh: 5.7, flag: "ok", trend: [5.4, 5.5, 5.4, 5.5, 5.6, 5.6] },
      { name: "Fasting Glucose", value: 88, unit: "mg/dL", refLow: 70, refHigh: 100, flag: "ok", trend: [92, 90, 88, 91, 89, 88] },
      { name: "Vitamin D, 25-OH", value: 22, unit: "ng/mL", refLow: 30, refHigh: 80, flag: "low", trend: [28, 26, 25, 24, 22, 22] },
      { name: "Ferritin", value: 28, unit: "ng/mL", refLow: 30, refHigh: 200, flag: "low", trend: [42, 38, 36, 32, 30, 28] },
      { name: "CRP hs", value: 1.2, unit: "mg/L", refLow: 0, refHigh: 3.0, flag: "ok", trend: [2.1, 1.8, 1.5, 1.4, 1.3, 1.2] },
    ],
  },
  {
    id: "lab-2",
    patientId: "pat-2",
    providerId: "prov-3",
    orderedDate: "2026-05-20",
    resultDate: "2026-05-23",
    panelName: "Pre-treatment Safety Panel",
    status: "reviewed",
    results: [
      { name: "CBC WBC", value: 6.8, unit: "K/uL", refLow: 4.5, refHigh: 11.0, flag: "ok", trend: [7.1, 6.9, 6.8] },
      { name: "Hemoglobin", value: 14.2, unit: "g/dL", refLow: 13.5, refHigh: 17.5, flag: "ok", trend: [14.0, 14.1, 14.2] },
      { name: "Platelets", value: 224, unit: "K/uL", refLow: 150, refHigh: 400, flag: "ok", trend: [218, 221, 224] },
      { name: "INR", value: 1.0, unit: "", refLow: 0.9, refHigh: 1.1, flag: "ok", trend: [1.0, 1.0, 1.0] },
      { name: "AST", value: 28, unit: "U/L", refLow: 10, refHigh: 40, flag: "ok", trend: [30, 29, 28] },
      { name: "ALT", value: 32, unit: "U/L", refLow: 7, refHigh: 56, flag: "ok", trend: [35, 33, 32] },
    ],
  },
  {
    id: "lab-3",
    patientId: "pat-3",
    providerId: "prov-2",
    orderedDate: "2026-06-04",
    resultDate: "2026-06-07",
    panelName: "Quarterly Hormone + Metabolic",
    status: "reviewed",
    results: [
      { name: "Estradiol", value: 72, unit: "pg/mL", refLow: 30, refHigh: 200, flag: "ok", trend: [45, 58, 65, 70, 72] },
      { name: "FSH", value: 4.2, unit: "mIU/mL", refLow: 0, refHigh: 10, flag: "ok", trend: [18, 8, 5, 4.5, 4.2] },
      { name: "TSH", value: 2.1, unit: "mIU/L", refLow: 0.4, refHigh: 4.0, flag: "ok", trend: [2.4, 2.2, 2.1] },
      { name: "LDL-C", value: 118, unit: "mg/dL", refLow: 0, refHigh: 100, flag: "high", trend: [132, 124, 118] },
      { name: "HbA1c", value: 5.6, unit: "%", refLow: 0, refHigh: 5.7, flag: "ok", trend: [5.4, 5.5, 5.6] },
      { name: "Fasting Glucose", value: 94, unit: "mg/dL", refLow: 70, refHigh: 100, flag: "ok", trend: [98, 96, 94] },
      { name: "Vitamin D, 25-OH", value: 48, unit: "ng/mL", refLow: 30, refHigh: 80, flag: "ok", trend: [32, 40, 48] },
    ],
  },
  {
    id: "lab-4",
    patientId: "pat-7",
    providerId: "prov-2",
    orderedDate: "2026-06-03",
    resultDate: "2026-06-06",
    panelName: "Urgent Metabolic + Cardiac Panel",
    status: "reviewed",
    notes: "Critical glucose and BP readings from CGM device triggered urgent draw. Patient contacted same day.",
    results: [
      { name: "HbA1c", value: 8.4, unit: "%", refLow: 0, refHigh: 5.7, flag: "critical", trend: [7.1, 7.4, 7.8, 8.1, 8.4] },
      { name: "Fasting Glucose", value: 148, unit: "mg/dL", refLow: 70, refHigh: 100, flag: "high", trend: [112, 118, 126, 138, 148] },
      { name: "LDL-C", value: 162, unit: "mg/dL", refLow: 0, refHigh: 100, flag: "high", trend: [144, 150, 158, 162] },
      { name: "Creatinine", value: 1.18, unit: "mg/dL", refLow: 0.7, refHigh: 1.2, flag: "ok", trend: [1.05, 1.10, 1.15, 1.18] },
      { name: "eGFR", value: 74, unit: "mL/min", refLow: 60, refHigh: 120, flag: "ok", trend: [82, 79, 76, 74] },
      { name: "Microalbumin", value: 48, unit: "mg/g", refLow: 0, refHigh: 30, flag: "high", trend: [22, 30, 40, 48] },
      { name: "BNP", value: 88, unit: "pg/mL", refLow: 0, refHigh: 100, flag: "ok", trend: [72, 78, 84, 88] },
    ],
  },
  {
    id: "lab-5",
    patientId: "pat-6",
    providerId: "prov-1",
    orderedDate: "2026-06-10",
    resultDate: "2026-06-13",
    panelName: "Annual Comprehensive + Hormone Panel",
    status: "resulted",
    results: [
      { name: "Estradiol", value: 88, unit: "pg/mL", refLow: 30, refHigh: 200, flag: "ok", trend: [62, 70, 78, 84, 88] },
      { name: "Progesterone", value: 4.2, unit: "ng/mL", refLow: 1.7, refHigh: 27.0, flag: "ok", trend: [3.8, 4.0, 4.2] },
      { name: "TSH", value: 1.8, unit: "mIU/L", refLow: 0.4, refHigh: 4.0, flag: "ok", trend: [2.2, 2.0, 1.9, 1.8] },
      { name: "LDL-C", value: 92, unit: "mg/dL", refLow: 0, refHigh: 100, flag: "ok", trend: [108, 102, 98, 92] },
      { name: "HDL-C", value: 72, unit: "mg/dL", refLow: 40, refHigh: 100, flag: "ok", trend: [68, 70, 71, 72] },
      { name: "HbA1c", value: 5.2, unit: "%", refLow: 0, refHigh: 5.7, flag: "ok", trend: [5.3, 5.2, 5.2] },
      { name: "Vitamin D, 25-OH", value: 62, unit: "ng/mL", refLow: 30, refHigh: 80, flag: "ok", trend: [44, 52, 58, 62] },
      { name: "DHEA-S", value: 182, unit: "mcg/dL", refLow: 35, refHigh: 430, flag: "ok", trend: [210, 195, 182] },
    ],
  },
  {
    id: "lab-6",
    patientId: "pat-20",
    providerId: "prov-2",
    orderedDate: "2026-06-09",
    resultDate: "2026-06-12",
    panelName: "TRT Monitoring Panel",
    status: "reviewed",
    results: [
      { name: "Total Testosterone", value: 820, unit: "ng/dL", refLow: 300, refHigh: 1000, flag: "ok", trend: [480, 620, 720, 780, 820] },
      { name: "Free Testosterone", value: 22.4, unit: "pg/mL", refLow: 9, refHigh: 30, flag: "ok", trend: [14, 18, 20, 21, 22.4] },
      { name: "Estradiol (sensitive)", value: 28, unit: "pg/mL", refLow: 8, refHigh: 35, flag: "ok", trend: [32, 30, 28] },
      { name: "Hematocrit", value: 48.2, unit: "%", refLow: 38.5, refHigh: 50.0, flag: "ok", trend: [44, 45.8, 47.1, 48.2] },
      { name: "PSA", value: 1.1, unit: "ng/mL", refLow: 0, refHigh: 4.0, flag: "ok", trend: [0.9, 1.0, 1.0, 1.1] },
      { name: "LH", value: 0.4, unit: "mIU/mL", refLow: 1.7, refHigh: 8.6, flag: "low", trend: [5.2, 1.8, 0.6, 0.4] },
      { name: "SHBG", value: 24, unit: "nmol/L", refLow: 10, refHigh: 57, flag: "ok", trend: [32, 28, 25, 24] },
    ],
  },
  {
    id: "lab-7",
    patientId: "pat-4",
    providerId: "prov-4",
    orderedDate: "2026-05-21",
    resultDate: "2026-05-24",
    panelName: "Weight Management Metabolic Panel",
    status: "reviewed",
    results: [
      { name: "Fasting Glucose", value: 96, unit: "mg/dL", refLow: 70, refHigh: 100, flag: "ok", trend: [114, 108, 102, 96] },
      { name: "HbA1c", value: 5.5, unit: "%", refLow: 0, refHigh: 5.7, flag: "ok", trend: [5.9, 5.7, 5.5] },
      { name: "Insulin, fasting", value: 8.2, unit: "uIU/mL", refLow: 2.6, refHigh: 24.9, flag: "ok", trend: [18.4, 13.2, 10.1, 8.2] },
      { name: "Triglycerides", value: 142, unit: "mg/dL", refLow: 0, refHigh: 150, flag: "ok", trend: [210, 188, 162, 142] },
      { name: "LDL-C", value: 108, unit: "mg/dL", refLow: 0, refHigh: 100, flag: "high", trend: [128, 118, 112, 108] },
      { name: "Uric acid", value: 6.8, unit: "mg/dL", refLow: 3.5, refHigh: 7.2, flag: "ok", trend: [7.8, 7.2, 6.8] },
    ],
  },
];

export function getLabsByPatient(patientId: string) {
  return labResults.filter((l) => l.patientId === patientId).sort((a, b) => b.resultDate.localeCompare(a.resultDate));
}

export function getLabResult(id: string) {
  return labResults.find((l) => l.id === id);
}

export { flag as calcFlag };
