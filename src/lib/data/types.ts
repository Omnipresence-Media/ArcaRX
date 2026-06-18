export type Trend = "up" | "down" | "flat";
export type RiskLevel = "high" | "med" | "low";
export type AppointmentStatus = "scheduled" | "checked-in" | "in-room" | "completed" | "no-show" | "cancelled";
export type EncounterStatus = "draft" | "signed" | "locked";
export type LabFlag = "high" | "low" | "critical" | "ok";
export type MembershipTier = "Platinum" | "Gold" | "Silver" | "None";
export type ProviderRole = "MD" | "NP" | "PA-C" | "RN" | "LE";
export type InvoiceStatus = "paid" | "pending" | "overdue" | "void";
export type PrescriptionStatus = "active" | "expired" | "discontinued" | "pending";

export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  members: number;
  mrr: number;
  address: string;
  phone: string;
}

export interface Provider {
  id: string;
  name: string;
  credentials: string;
  role: ProviderRole;
  specialty: string;
  locationId: string;
  utilization: number;
  revenue: number;
  patientCount: number;
  status: "active" | "leave" | "inactive";
  npi: string;
  deaNumber?: string;
  avatar?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  sex: "M" | "F" | "Other";
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  locationId: string;
  providerId: string;
  membershipTier: MembershipTier;
  membershipSince?: string;
  risk: RiskLevel;
  balance: number;
  ltv: number;
  visitCount: number;
  lastVisitDate: string;
  tags: string[];
  allergies: string[];
  insuranceName?: string;
  insuranceMemberId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
}

export interface Encounter {
  id: string;
  patientId: string;
  providerId: string;
  locationId: string;
  date: string;
  type: string;
  status: EncounterStatus;
  chiefComplaint: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icdCodes: { code: string; description: string }[];
  cptCodes: { code: string; description: string; fee: number }[];
  totalCharge: number;
  duration: number;
  signedAt?: string;
  signedBy?: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  providerId: string;
  orderedDate: string;
  resultDate: string;
  panelName: string;
  results: LabValue[];
  status: "ordered" | "resulted" | "reviewed";
  notes?: string;
}

export interface LabValue {
  name: string;
  value: number;
  unit: string;
  refLow: number;
  refHigh: number;
  flag: LabFlag;
  trend: number[];
}

export interface Prescription {
  id: string;
  patientId: string;
  providerId: string;
  medicationName: string;
  genericName: string;
  strength: string;
  form: string;
  sig: string;
  quantity: number;
  refills: number;
  refillsRemaining: number;
  daysSupply: number;
  isCompound: boolean;
  compoundPharmacy?: string;
  controlled: boolean;
  scheduleClass?: "II" | "III" | "IV" | "V";
  status: PrescriptionStatus;
  prescribedDate: string;
  expirationDate: string;
  lastFilledDate?: string;
  icd10: string;
  ndcCode?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  locationId: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: AppointmentStatus;
  notes?: string;
  roomNumber?: string;
  confirmedAt?: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  encounterId?: string;
  date: string;
  dueDate: string;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  paidAt?: string;
}

export interface AuditEvent {
  id: string;
  patientId: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
}
