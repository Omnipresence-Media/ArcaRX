import type { AuditEvent } from "./types";

export const auditEvents: AuditEvent[] = [
  { id: "aud-1",  patientId: "pat-1",  userId: "prov-1", userName: "Dr. Amelia Chen",  action: "Viewed chart",          resource: "Patient Record",   timestamp: "2026-06-18T08:28:00", ipAddress: "10.0.1.42" },
  { id: "aud-2",  patientId: "pat-1",  userId: "prov-1", userName: "Dr. Amelia Chen",  action: "Viewed labs",           resource: "Lab Results",      timestamp: "2026-06-18T08:30:00", ipAddress: "10.0.1.42" },
  { id: "aud-3",  patientId: "pat-1",  userId: "prov-1", userName: "Dr. Amelia Chen",  action: "Signed encounter",      resource: "Encounter enc-1",  timestamp: "2026-06-16T16:22:00", ipAddress: "10.0.1.42" },
  { id: "aud-4",  patientId: "pat-1",  userId: "prov-2", userName: "Dr. Marcus Patel", action: "Viewed chart",          resource: "Patient Record",   timestamp: "2026-06-16T09:10:00", ipAddress: "10.0.1.55" },
  { id: "aud-5",  patientId: "pat-1",  userId: "prov-3", userName: "Sara Whitfield",   action: "Signed encounter",      resource: "Encounter enc-2",  timestamp: "2026-06-05T11:30:00", ipAddress: "10.0.1.61" },
  { id: "aud-6",  patientId: "pat-1",  userId: "staff-1",userName: "Front Desk",       action: "Checked in patient",    resource: "Appointment",      timestamp: "2026-06-18T08:25:00", ipAddress: "10.0.1.10" },
  { id: "aud-7",  patientId: "pat-2",  userId: "prov-3", userName: "Sara Whitfield",   action: "Viewed chart",          resource: "Patient Record",   timestamp: "2026-06-18T08:55:00", ipAddress: "10.0.1.61" },
  { id: "aud-8",  patientId: "pat-2",  userId: "prov-3", userName: "Sara Whitfield",   action: "Created encounter",     resource: "Encounter enc-4",  timestamp: "2026-06-18T09:12:00", ipAddress: "10.0.1.61" },
  { id: "aud-9",  patientId: "pat-7",  userId: "prov-2", userName: "Dr. Marcus Patel", action: "Signed encounter",      resource: "Encounter enc-6",  timestamp: "2026-06-10T15:30:00", ipAddress: "10.0.1.55" },
  { id: "aud-10", patientId: "pat-7",  userId: "prov-2", userName: "Dr. Marcus Patel", action: "Viewed RPM data",       resource: "RPM Device Data",  timestamp: "2026-06-10T14:55:00", ipAddress: "10.0.1.55" },
  { id: "aud-11", patientId: "pat-6",  userId: "prov-5", userName: "Maya Okonkwo",     action: "Signed encounter",      resource: "Encounter enc-7",  timestamp: "2026-06-17T15:00:00", ipAddress: "10.0.1.78" },
  { id: "aud-12", patientId: "pat-20", userId: "prov-2", userName: "Dr. Marcus Patel", action: "Prescribed controlled", resource: "Rx rx-11",         timestamp: "2026-06-16T09:35:00", ipAddress: "10.0.1.55" },
  { id: "aud-13", patientId: "pat-1",  userId: "prov-1", userName: "Dr. Amelia Chen",  action: "Prescribed medication", resource: "Rx rx-4",          timestamp: "2026-06-16T16:25:00", ipAddress: "10.0.1.42" },
  { id: "aud-14", patientId: "pat-10", userId: "prov-1", userName: "Dr. Amelia Chen",  action: "Signed encounter",      resource: "Encounter enc-10", timestamp: "2026-06-13T14:00:00", ipAddress: "10.0.1.42" },
  { id: "aud-15", patientId: "pat-3",  userId: "prov-2", userName: "Dr. Marcus Patel", action: "Signed encounter",      resource: "Encounter enc-5",  timestamp: "2026-06-11T10:45:00", ipAddress: "10.0.1.55" },
];

export function getAuditByPatient(patientId: string) {
  return auditEvents
    .filter((e) => e.patientId === patientId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
