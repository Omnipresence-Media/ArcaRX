import type { Patient } from "./types";

export const patients: Patient[] = [
  {
    id: "pat-1", mrn: "ARX-10293", firstName: "Eliana", lastName: "Ruiz",
    dob: "1989-08-14", sex: "F", phone: "(512) 555-0118", email: "eliana.ruiz@gmail.com",
    address: "2841 Barton Springs Rd", city: "Austin", state: "TX", zip: "78704",
    locationId: "loc-atx", providerId: "prov-1", membershipTier: "Platinum", membershipSince: "2023-01-15",
    risk: "high", balance: 312, ltv: 18420, visitCount: 24, lastVisitDate: "2026-06-16",
    treatmentTrack: "hormone",
    tags: ["Platinum Member", "HRT", "Semaglutide"],
    allergies: ["Penicillin", "Sulfa"], insuranceName: "Aetna PPO", insuranceMemberId: "AET-881029-X",
    emergencyContactName: "Carlos Ruiz", emergencyContactPhone: "(512) 555-0199", createdAt: "2023-01-15",
  },
  {
    id: "pat-2", mrn: "ARX-10288", firstName: "Owen", lastName: "Pham",
    dob: "1985-03-22", sex: "M", phone: "(512) 555-0204", email: "owen.pham@icloud.com",
    address: "1104 South Congress Ave", city: "Austin", state: "TX", zip: "78704",
    locationId: "loc-atx", providerId: "prov-3", membershipTier: "Gold", membershipSince: "2023-06-01",
    risk: "low", balance: 0, ltv: 9240, visitCount: 12, lastVisitDate: "2026-06-18",
    treatmentTrack: "aesthetics",
    tags: ["Gold Member", "Injectables"],
    allergies: ["NKDA"], insuranceName: "BCBS TX", insuranceMemberId: "BCB-774412-Y",
    emergencyContactName: "Linda Pham", emergencyContactPhone: "(512) 555-0215", createdAt: "2023-06-01",
  },
  {
    id: "pat-3", mrn: "ARX-10271", firstName: "Naomi", lastName: "Carter",
    dob: "1991-11-30", sex: "F", phone: "(214) 555-0317", email: "naomi.carter@outlook.com",
    address: "3820 McKinney Ave", city: "Dallas", state: "TX", zip: "75204",
    locationId: "loc-dal", providerId: "prov-2", membershipTier: "Gold", membershipSince: "2024-02-10",
    risk: "med", balance: 84, ltv: 12180, visitCount: 18, lastVisitDate: "2026-06-11",
    treatmentTrack: "glp1",
    tags: ["Gold Member", "Hormone Plan", "Lab Due"],
    allergies: ["Latex"], insuranceName: "UnitedHealthcare", insuranceMemberId: "UHC-992301-Z",
    emergencyContactName: "James Carter", emergencyContactPhone: "(214) 555-0328", createdAt: "2024-02-10",
  },
  {
    id: "pat-4", mrn: "ARX-10260", firstName: "Yusuf", lastName: "Aydin",
    dob: "1978-06-07", sex: "M", phone: "(512) 555-0422", email: "yusuf.aydin@gmail.com",
    address: "500 W 2nd St", city: "Austin", state: "TX", zip: "78701",
    locationId: "loc-atx", providerId: "prov-4", membershipTier: "Silver", membershipSince: "2024-09-01",
    risk: "med", balance: 0, ltv: 6890, visitCount: 9, lastVisitDate: "2026-05-28",
    treatmentTrack: "glp1",
    tags: ["Silver Member", "Post-op", "Weight Management"],
    allergies: ["Ibuprofen"], insuranceName: "Cigna", insuranceMemberId: "CIG-445512-A",
    emergencyContactName: "Fatima Aydin", emergencyContactPhone: "(512) 555-0433", createdAt: "2024-09-01",
  },
  {
    id: "pat-5", mrn: "ARX-10254", firstName: "Harper", lastName: "Nakamura",
    dob: "1997-02-18", sex: "F", phone: "(512) 555-0511", email: "harper.nakamura@gmail.com",
    address: "4200 Duval St", city: "Austin", state: "TX", zip: "78751",
    locationId: "loc-atx", providerId: "prov-3", membershipTier: "None",
    risk: "low", balance: 0, ltv: 480, visitCount: 1, lastVisitDate: "2026-06-18",
    treatmentTrack: "general",
    tags: ["New Patient", "Consult"],
    allergies: ["NKDA"], createdAt: "2026-06-18",
  },
  {
    id: "pat-6", mrn: "ARX-10241", firstName: "Imani", lastName: "Brooks",
    dob: "1983-09-25", sex: "F", phone: "(512) 555-0614", email: "imani.brooks@icloud.com",
    address: "1801 Lavaca St", city: "Austin", state: "TX", zip: "78701",
    locationId: "loc-atx", providerId: "prov-1", membershipTier: "Platinum", membershipSince: "2022-04-01",
    risk: "low", balance: 0, ltv: 22100, visitCount: 31, lastVisitDate: "2026-06-17",
    treatmentTrack: "nad",
    tags: ["Platinum Member", "HRT", "IV Therapy", "VIP"],
    allergies: ["Aspirin"], insuranceName: "Humana", insuranceMemberId: "HUM-663301-B",
    emergencyContactName: "Derek Brooks", emergencyContactPhone: "(512) 555-0625", createdAt: "2022-04-01",
  },
  {
    id: "pat-7", mrn: "ARX-10235", firstName: "Marcus", lastName: "Kim",
    dob: "1971-12-03", sex: "M", phone: "(615) 555-0718", email: "marcus.kim@gmail.com",
    address: "1200 Broadway", city: "Nashville", state: "TN", zip: "37203",
    locationId: "loc-nsh", providerId: "prov-2", membershipTier: "Gold", membershipSince: "2023-11-15",
    risk: "high", balance: 540, ltv: 8900, visitCount: 14, lastVisitDate: "2026-06-10",
    treatmentTrack: "general",
    tags: ["Gold Member", "Diabetic", "High Risk", "CGM"],
    allergies: ["Metformin sensitivity"], insuranceName: "Medicare", insuranceMemberId: "MED-1A2B3C4D",
    emergencyContactName: "Susan Kim", emergencyContactPhone: "(615) 555-0729", createdAt: "2023-11-15",
  },
  {
    id: "pat-8", mrn: "ARX-10228", firstName: "Sloane", lastName: "Vega",
    dob: "1994-05-16", sex: "F", phone: "(214) 555-0821", email: "sloane.vega@gmail.com",
    address: "2700 Fairmount St", city: "Dallas", state: "TX", zip: "75201",
    locationId: "loc-dal", providerId: "prov-3", membershipTier: "Silver", membershipSince: "2025-01-20",
    risk: "low", balance: 0, ltv: 3200, visitCount: 6, lastVisitDate: "2026-05-30",
    treatmentTrack: "skincare",
    tags: ["Silver Member", "Injectables", "Skin"],
    allergies: ["NKDA"], insuranceName: "Aetna", insuranceMemberId: "AET-772901-C", createdAt: "2025-01-20",
  },
  {
    id: "pat-9", mrn: "ARX-10219", firstName: "Theo", lastName: "Lindqvist",
    dob: "1980-07-29", sex: "M", phone: "(512) 555-0912", email: "theo.lindqvist@outlook.com",
    address: "600 E 6th St", city: "Austin", state: "TX", zip: "78701",
    locationId: "loc-atx", providerId: "prov-3", membershipTier: "Gold", membershipSince: "2024-03-15",
    risk: "low", balance: 0, ltv: 7100, visitCount: 11, lastVisitDate: "2026-06-05",
    treatmentTrack: "aesthetics",
    tags: ["Gold Member", "Injectables"],
    allergies: ["NKDA"], insuranceName: "BCBS TX", insuranceMemberId: "BCB-881234-D", createdAt: "2024-03-15",
  },
  {
    id: "pat-10", mrn: "ARX-10210", firstName: "Mira", lastName: "Hollander",
    dob: "1987-04-11", sex: "F", phone: "(512) 555-1003", email: "mira.hollander@gmail.com",
    address: "3100 Guadalupe St", city: "Austin", state: "TX", zip: "78705",
    locationId: "loc-atx", providerId: "prov-1", membershipTier: "Platinum", membershipSince: "2022-09-01",
    risk: "low", balance: 0, ltv: 19800, visitCount: 28, lastVisitDate: "2026-06-13",
    treatmentTrack: "skincare",
    tags: ["Platinum Member", "Lasers", "HRT", "VIP"],
    allergies: ["Codeine"], insuranceName: "Cigna", insuranceMemberId: "CIG-554411-E",
    emergencyContactName: "Ben Hollander", emergencyContactPhone: "(512) 555-1014", createdAt: "2022-09-01",
  },
  {
    id: "pat-11", mrn: "ARX-10204", firstName: "Riley", lastName: "Tomas",
    dob: "1993-01-08", sex: "F", phone: "(615) 555-1112", email: "riley.tomas@gmail.com",
    address: "900 Division St", city: "Nashville", state: "TN", zip: "37203",
    locationId: "loc-nsh", providerId: "prov-4", membershipTier: "None",
    risk: "low", balance: 0, ltv: 800, visitCount: 2, lastVisitDate: "2026-06-01",
    treatmentTrack: "glp1",
    tags: ["New", "Weight Management", "GLP-1 Interest"],
    allergies: ["NKDA"], createdAt: "2026-05-15",
  },
  {
    id: "pat-12", mrn: "ARX-10198", firstName: "Devon", lastName: "Park",
    dob: "1976-10-19", sex: "M", phone: "(214) 555-1205", email: "devon.park@icloud.com",
    address: "1500 Main St", city: "Dallas", state: "TX", zip: "75201",
    locationId: "loc-dal", providerId: "prov-2", membershipTier: "Platinum", membershipSince: "2021-11-01",
    risk: "med", balance: 198, ltv: 31400, visitCount: 42, lastVisitDate: "2026-06-09",
    treatmentTrack: "trt",
    tags: ["Platinum Member", "Testosterone", "Metabolic", "Long-term"],
    allergies: ["Shellfish", "Contrast dye"], insuranceName: "UnitedHealthcare", insuranceMemberId: "UHC-113301-F",
    emergencyContactName: "Kim Park", emergencyContactPhone: "(214) 555-1216", createdAt: "2021-11-01",
  },
  {
    id: "pat-13", mrn: "ARX-10191", firstName: "Aiyana", lastName: "Roth",
    dob: "1990-08-23", sex: "F", phone: "(512) 555-1308", email: "aiyana.roth@gmail.com",
    address: "2200 Manor Rd", city: "Austin", state: "TX", zip: "78722",
    locationId: "loc-atx", providerId: "prov-4", membershipTier: "Silver", membershipSince: "2025-03-01",
    risk: "low", balance: 0, ltv: 2100, visitCount: 4, lastVisitDate: "2026-05-22",
    treatmentTrack: "glp1",
    tags: ["Silver Member", "Semaglutide", "Weight Management"],
    allergies: ["NKDA"], insuranceName: "Aetna", insuranceMemberId: "AET-664401-G", createdAt: "2025-03-01",
  },
  {
    id: "pat-14", mrn: "ARX-10184", firstName: "Cameron", lastName: "Day",
    dob: "1982-03-14", sex: "M", phone: "(214) 555-1401", email: "cameron.day@outlook.com",
    address: "4100 Live Oak St", city: "Dallas", state: "TX", zip: "75204",
    locationId: "loc-dal", providerId: "prov-3", membershipTier: "Gold", membershipSince: "2024-07-01",
    risk: "low", balance: 0, ltv: 5800, visitCount: 8, lastVisitDate: "2026-06-03",
    treatmentTrack: "skincare",
    tags: ["Gold Member", "Morpheus8", "Skin"],
    allergies: ["NKDA"], insuranceName: "Cigna", insuranceMemberId: "CIG-223311-H", createdAt: "2024-07-01",
  },
  {
    id: "pat-15", mrn: "ARX-10177", firstName: "Bex", lastName: "Halloran",
    dob: "1988-12-01", sex: "F", phone: "(512) 555-1504", email: "bex.halloran@gmail.com",
    address: "1700 Rundberg Ln", city: "Austin", state: "TX", zip: "78753",
    locationId: "loc-atx", providerId: "prov-2", membershipTier: "Silver", membershipSince: "2025-02-14",
    risk: "med", balance: 120, ltv: 3900, visitCount: 5, lastVisitDate: "2026-06-07",
    treatmentTrack: "trt",
    tags: ["Silver Member", "Testosterone", "Hormone Plan"],
    allergies: ["Iodine"], insuranceName: "Humana", insuranceMemberId: "HUM-774401-I", createdAt: "2025-02-14",
  },
  {
    id: "pat-16", mrn: "ARX-10169", firstName: "James", lastName: "Osei",
    dob: "1965-04-30", sex: "M", phone: "(615) 555-1601", email: "james.osei@gmail.com",
    address: "2500 West End Ave", city: "Nashville", state: "TN", zip: "37203",
    locationId: "loc-nsh", providerId: "prov-5", membershipTier: "Gold", membershipSince: "2023-08-01",
    risk: "high", balance: 0, ltv: 10200, visitCount: 17, lastVisitDate: "2026-06-12",
    treatmentTrack: "nad",
    tags: ["Gold Member", "IV Therapy", "NAD+", "High Risk"],
    allergies: ["Morphine"], insuranceName: "Medicare", insuranceMemberId: "MED-2C3D4E5F",
    emergencyContactName: "Gloria Osei", emergencyContactPhone: "(615) 555-1612", createdAt: "2023-08-01",
  },
  {
    id: "pat-17", mrn: "ARX-10162", firstName: "Priya", lastName: "Mehta",
    dob: "1995-07-14", sex: "F", phone: "(512) 555-1705", email: "priya.mehta@gmail.com",
    address: "300 W 5th St", city: "Austin", state: "TX", zip: "78701",
    locationId: "loc-atx", providerId: "prov-1", membershipTier: "Gold", membershipSince: "2024-11-01",
    risk: "low", balance: 0, ltv: 4600, visitCount: 7, lastVisitDate: "2026-05-28",
    treatmentTrack: "aesthetics",
    tags: ["Gold Member", "Aesthetics", "HRT Interest"],
    allergies: ["NKDA"], insuranceName: "BCBS TX", insuranceMemberId: "BCB-991234-J", createdAt: "2024-11-01",
  },
  {
    id: "pat-18", mrn: "ARX-10155", firstName: "Marco", lastName: "Reyes",
    dob: "1973-09-09", sex: "M", phone: "(214) 555-1801", email: "marco.reyes@outlook.com",
    address: "5200 Greenville Ave", city: "Dallas", state: "TX", zip: "75206",
    locationId: "loc-dal", providerId: "prov-4", membershipTier: "Platinum", membershipSince: "2022-06-01",
    risk: "med", balance: 0, ltv: 26700, visitCount: 36, lastVisitDate: "2026-06-14",
    treatmentTrack: "trt",
    tags: ["Platinum Member", "Semaglutide", "Testosterone", "Metabolic"],
    allergies: ["Penicillin"], insuranceName: "Aetna", insuranceMemberId: "AET-556601-K",
    emergencyContactName: "Lucia Reyes", emergencyContactPhone: "(214) 555-1812", createdAt: "2022-06-01",
  },
  {
    id: "pat-19", mrn: "ARX-10148", firstName: "Zoe", lastName: "Harrington",
    dob: "1999-02-28", sex: "F", phone: "(512) 555-1901", email: "zoe.harrington@gmail.com",
    address: "800 E 6th St", city: "Austin", state: "TX", zip: "78702",
    locationId: "loc-atx", providerId: "prov-3", membershipTier: "None",
    risk: "low", balance: 0, ltv: 340, visitCount: 1, lastVisitDate: "2026-06-15",
    treatmentTrack: "general",
    tags: ["New Patient"],
    allergies: ["NKDA"], createdAt: "2026-06-15",
  },
  {
    id: "pat-20", mrn: "ARX-10141", firstName: "Samuel", lastName: "Torres",
    dob: "1968-11-17", sex: "M", phone: "(615) 555-2001", email: "samuel.torres@icloud.com",
    address: "1100 Charlotte Ave", city: "Nashville", state: "TN", zip: "37203",
    locationId: "loc-nsh", providerId: "prov-2", membershipTier: "Platinum", membershipSince: "2021-03-01",
    risk: "high", balance: 875, ltv: 38200, visitCount: 51, lastVisitDate: "2026-06-16",
    treatmentTrack: "trt",
    tags: ["Platinum Member", "Testosterone", "NAD+", "HRT", "VIP", "High Risk"],
    allergies: ["Sulfa", "Aspirin"], insuranceName: "Cigna", insuranceMemberId: "CIG-112201-L",
    emergencyContactName: "Maria Torres", emergencyContactPhone: "(615) 555-2012", createdAt: "2021-03-01",
  },
];

export function getPatient(id: string) {
  return patients.find((p) => p.id === id);
}

export function getPatientsByLocation(locationId: string) {
  return patients.filter((p) => p.locationId === locationId);
}

export function getPatientsByProvider(providerId: string) {
  return patients.filter((p) => p.providerId === providerId);
}

export function searchPatients(query: string) {
  const q = query.toLowerCase();
  return patients.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone.includes(q)
  );
}
