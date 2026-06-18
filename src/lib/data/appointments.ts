import type { Appointment } from "./types";

export const appointments: Appointment[] = [
  { id: "apt-1",  patientId: "pat-1",  patientName: "Eliana Ruiz",       providerId: "prov-1", locationId: "loc-atx", date: "2026-06-18", time: "08:30", duration: 30, type: "Hormone Follow-up",       status: "checked-in",  roomNumber: "2" },
  { id: "apt-2",  patientId: "pat-2",  patientName: "Owen Pham",         providerId: "prov-3", locationId: "loc-atx", date: "2026-06-18", time: "09:00", duration: 45, type: "Filler Maintenance",       status: "in-room",     roomNumber: "1" },
  { id: "apt-3",  patientId: "pat-5",  patientName: "Harper Nakamura",   providerId: "prov-1", locationId: "loc-atx", date: "2026-06-18", time: "09:45", duration: 30, type: "New Patient Consult",      status: "scheduled" },
  { id: "apt-4",  patientId: "pat-3",  patientName: "Naomi Carter",      providerId: "prov-2", locationId: "loc-atx", date: "2026-06-18", time: "10:30", duration: 30, type: "Lab Review",               status: "scheduled" },
  { id: "apt-5",  patientId: "pat-4",  patientName: "Yusuf Aydin",       providerId: "prov-4", locationId: "loc-atx", date: "2026-06-18", time: "11:15", duration: 20, type: "Semaglutide Refill",       status: "scheduled" },
  { id: "apt-6",  patientId: "pat-10", patientName: "Mira Hollander",    providerId: "prov-1", locationId: "loc-atx", date: "2026-06-18", time: "13:00", duration: 90, type: "Morpheus8 Full Face",      status: "scheduled" },
  { id: "apt-7",  patientId: "pat-6",  patientName: "Imani Brooks",      providerId: "prov-5", locationId: "loc-atx", date: "2026-06-18", time: "14:45", duration: 60, type: "NAD+ IV 500mg",            status: "scheduled" },
  { id: "apt-8",  patientId: "pat-9",  patientName: "Theo Lindqvist",    providerId: "prov-3", locationId: "loc-atx", date: "2026-06-18", time: "16:00", duration: 60, type: "Filler Cheeks 2mL",        status: "scheduled" },
  { id: "apt-9",  patientId: "pat-17", patientName: "Priya Mehta",       providerId: "prov-1", locationId: "loc-atx", date: "2026-06-19", time: "09:00", duration: 45, type: "Aesthetic Consult",        status: "scheduled" },
  { id: "apt-10", patientId: "pat-13", patientName: "Aiyana Roth",       providerId: "prov-4", locationId: "loc-atx", date: "2026-06-19", time: "10:00", duration: 20, type: "Weight Check + Refill",    status: "scheduled" },
  { id: "apt-11", patientId: "pat-20", patientName: "Samuel Torres",     providerId: "prov-2", locationId: "loc-nsh", date: "2026-06-19", time: "08:00", duration: 30, type: "TRT Injection",            status: "scheduled" },
  { id: "apt-12", patientId: "pat-16", patientName: "James Osei",        providerId: "prov-5", locationId: "loc-nsh", date: "2026-06-19", time: "09:30", duration: 90, type: "NAD+ IV 500mg",            status: "scheduled" },
  { id: "apt-13", patientId: "pat-11", patientName: "Riley Tomas",       providerId: "prov-4", locationId: "loc-nsh", date: "2026-06-19", time: "11:00", duration: 30, type: "Semaglutide Consult",      status: "scheduled" },
  { id: "apt-14", patientId: "pat-7",  patientName: "Marcus Kim",        providerId: "prov-2", locationId: "loc-nsh", date: "2026-06-19", time: "14:00", duration: 40, type: "RPM Follow-up",            status: "scheduled" },
  { id: "apt-15", patientId: "pat-8",  patientName: "Sloane Vega",       providerId: "prov-3", locationId: "loc-dal", date: "2026-06-19", time: "10:00", duration: 30, type: "Neurotoxin Treatment",     status: "scheduled" },
  { id: "apt-16", patientId: "pat-14", patientName: "Cameron Day",       providerId: "prov-3", locationId: "loc-dal", date: "2026-06-19", time: "11:00", duration: 45, type: "Skin Consult",             status: "scheduled" },
  { id: "apt-17", patientId: "pat-12", patientName: "Devon Park",        providerId: "prov-2", locationId: "loc-dal", date: "2026-06-19", time: "13:00", duration: 30, type: "Tirzepatide Follow-up",    status: "scheduled" },
  { id: "apt-18", patientId: "pat-18", patientName: "Marco Reyes",       providerId: "prov-4", locationId: "loc-dal", date: "2026-06-20", time: "09:00", duration: 30, type: "Weight + Hormone Review",  status: "scheduled" },
  { id: "apt-19", patientId: "pat-19", patientName: "Zoe Harrington",    providerId: "prov-3", locationId: "loc-atx", date: "2026-06-20", time: "10:30", duration: 30, type: "New Patient Consult",      status: "scheduled" },
  { id: "apt-20", patientId: "pat-15", patientName: "Bex Halloran",      providerId: "prov-2", locationId: "loc-atx", date: "2026-06-20", time: "11:30", duration: 30, type: "Testosterone Follow-up",   status: "scheduled" },
  { id: "apt-21", patientId: "pat-6",  patientName: "Imani Brooks",      providerId: "prov-1", locationId: "loc-atx", date: "2026-06-20", time: "13:00", duration: 30, type: "HRT Follow-up",           status: "scheduled" },
  { id: "apt-22", patientId: "pat-1",  patientName: "Eliana Ruiz",       providerId: "prov-1", locationId: "loc-atx", date: "2026-07-28", time: "10:00", duration: 30, type: "Hormone Follow-up",       status: "scheduled" },
  { id: "apt-23", patientId: "pat-2",  patientName: "Owen Pham",         providerId: "prov-3", locationId: "loc-atx", date: "2026-05-28", time: "11:00", duration: 45, type: "Filler Treatment",        status: "completed" },
  { id: "apt-24", patientId: "pat-3",  patientName: "Naomi Carter",      providerId: "prov-2", locationId: "loc-dal", date: "2026-05-14", time: "09:30", duration: 30, type: "Hormone Follow-up",       status: "completed" },
  { id: "apt-25", patientId: "pat-7",  patientName: "Marcus Kim",        providerId: "prov-2", locationId: "loc-nsh", date: "2026-06-10", time: "15:00", duration: 40, type: "Urgent: RPM Alert",       status: "completed" },
  { id: "apt-26", patientId: "pat-4",  patientName: "Yusuf Aydin",       providerId: "prov-4", locationId: "loc-atx", date: "2026-05-28", time: "13:00", duration: 25, type: "Weight Management",       status: "completed" },
  { id: "apt-27", patientId: "pat-20", patientName: "Samuel Torres",     providerId: "prov-2", locationId: "loc-nsh", date: "2026-05-28", time: "09:00", duration: 20, type: "TRT Injection",           status: "completed" },
  { id: "apt-28", patientId: "pat-10", patientName: "Mira Hollander",    providerId: "prov-1", locationId: "loc-atx", date: "2026-06-13", time: "14:00", duration: 90, type: "Morpheus8 Treatment",     status: "completed" },
  { id: "apt-29", patientId: "pat-6",  patientName: "Imani Brooks",      providerId: "prov-5", locationId: "loc-atx", date: "2026-06-17", time: "14:00", duration: 90, type: "NAD+ IV 500mg",           status: "completed" },
  { id: "apt-30", patientId: "pat-16", patientName: "James Osei",        providerId: "prov-5", locationId: "loc-nsh", date: "2026-06-12", time: "10:00", duration: 90, type: "NAD+ IV 500mg",           status: "completed" },
  { id: "apt-31", patientId: "pat-12", patientName: "Devon Park",        providerId: "prov-2", locationId: "loc-dal", date: "2026-06-09", time: "09:00", duration: 30, type: "TRT + Metabolic",         status: "completed" },
  { id: "apt-32", patientId: "pat-1",  patientName: "Eliana Ruiz",       providerId: "prov-3", locationId: "loc-atx", date: "2026-06-05", time: "10:30", duration: 45, type: "Lip Filler",              status: "completed" },
  { id: "apt-33", patientId: "pat-9",  patientName: "Theo Lindqvist",    providerId: "prov-3", locationId: "loc-atx", date: "2026-06-05", time: "13:00", duration: 45, type: "Cheek Filler",            status: "no-show" },
  { id: "apt-34", patientId: "pat-13", patientName: "Aiyana Roth",       providerId: "prov-4", locationId: "loc-atx", date: "2026-05-22", time: "11:00", duration: 20, type: "Weight Check",            status: "completed" },
  { id: "apt-35", patientId: "pat-15", patientName: "Bex Halloran",      providerId: "prov-2", locationId: "loc-atx", date: "2026-06-07", time: "10:30", duration: 30, type: "Testosterone Follow-up",  status: "completed" },
  { id: "apt-36", patientId: "pat-17", patientName: "Priya Mehta",       providerId: "prov-1", locationId: "loc-atx", date: "2026-05-28", time: "09:00", duration: 30, type: "HRT Consult",             status: "completed" },
  { id: "apt-37", patientId: "pat-8",  patientName: "Sloane Vega",       providerId: "prov-3", locationId: "loc-dal", date: "2026-05-30", time: "10:00", duration: 30, type: "Aesthetic Follow-up",     status: "completed" },
  { id: "apt-38", patientId: "pat-14", patientName: "Cameron Day",       providerId: "prov-3", locationId: "loc-dal", date: "2026-06-03", time: "11:00", duration: 30, type: "Morpheus8 Consult",       status: "completed" },
  { id: "apt-39", patientId: "pat-11", patientName: "Riley Tomas",       providerId: "prov-4", locationId: "loc-nsh", date: "2026-06-01", time: "10:00", duration: 30, type: "Initial Consult",         status: "completed" },
  { id: "apt-40", patientId: "pat-18", patientName: "Marco Reyes",       providerId: "prov-4", locationId: "loc-dal", date: "2026-06-14", time: "09:00", duration: 30, type: "GLP-1 Follow-up",        status: "completed" },
  { id: "apt-41", patientId: "pat-19", patientName: "Zoe Harrington",    providerId: "prov-3", locationId: "loc-atx", date: "2026-06-15", time: "09:00", duration: 30, type: "New Patient Consult",     status: "completed" },
  { id: "apt-42", patientId: "pat-20", patientName: "Samuel Torres",     providerId: "prov-2", locationId: "loc-nsh", date: "2026-06-16", time: "09:30", duration: 20, type: "TRT Injection + Labs",    status: "completed" },
  { id: "apt-43", patientId: "pat-1",  patientName: "Eliana Ruiz",       providerId: "prov-2", locationId: "loc-atx", date: "2026-05-22", time: "14:00", duration: 30, type: "Lab Review",              status: "completed" },
  { id: "apt-44", patientId: "pat-5",  patientName: "Harper Nakamura",   providerId: "prov-3", locationId: "loc-atx", date: "2026-06-10", time: "14:00", duration: 30, type: "Consult Cancelled",       status: "cancelled" },
  { id: "apt-45", patientId: "pat-10", patientName: "Mira Hollander",    providerId: "prov-1", locationId: "loc-atx", date: "2026-04-22", time: "14:00", duration: 90, type: "Morpheus8 Treatment #1",  status: "completed" },
  { id: "apt-46", patientId: "pat-6",  patientName: "Imani Brooks",      providerId: "prov-5", locationId: "loc-atx", date: "2026-05-19", time: "14:00", duration: 90, type: "NAD+ IV",                 status: "completed" },
  { id: "apt-47", patientId: "pat-7",  patientName: "Marcus Kim",        providerId: "prov-2", locationId: "loc-nsh", date: "2026-05-15", time: "14:00", duration: 30, type: "Diabetes + BP Review",    status: "completed" },
  { id: "apt-48", patientId: "pat-12", patientName: "Devon Park",        providerId: "prov-2", locationId: "loc-dal", date: "2026-05-12", time: "09:00", duration: 30, type: "TRT Follow-up",           status: "completed" },
  { id: "apt-49", patientId: "pat-3",  patientName: "Naomi Carter",      providerId: "prov-2", locationId: "loc-dal", date: "2026-06-11", time: "10:00", duration: 30, type: "Semaglutide Titration",   status: "completed" },
  { id: "apt-50", patientId: "pat-20", patientName: "Samuel Torres",     providerId: "prov-2", locationId: "loc-nsh", date: "2026-07-02", time: "09:30", duration: 20, type: "TRT Injection",           status: "scheduled" },
];

export function getAppointmentsByPatient(patientId: string) {
  return appointments.filter((a) => a.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
}

export function getTodayAppointments(locationId?: string) {
  const today = new Date().toISOString().split("T")[0];
  return appointments
    .filter((a) => a.date === today && (locationId ? a.locationId === locationId : true))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getUpcomingAppointments(patientId: string) {
  const today = new Date().toISOString().split("T")[0];
  return appointments
    .filter((a) => a.patientId === patientId && a.date >= today && a.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date));
}
