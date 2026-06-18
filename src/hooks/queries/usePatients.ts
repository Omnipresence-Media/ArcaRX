import { useQuery } from "@tanstack/react-query";
import { patients, searchPatients, getPatientsByLocation, getPatientsByProvider } from "@/lib/data";

const DELAY = 120;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function usePatients(filters?: { locationId?: string; providerId?: string; search?: string }) {
  return useQuery({
    queryKey: ["patients", filters],
    queryFn: async () => {
      await sleep(DELAY);
      let result = [...patients];
      if (filters?.search && filters.search.trim()) {
        result = searchPatients(filters.search);
      }
      if (filters?.locationId) {
        result = result.filter((p) => p.locationId === filters.locationId);
      }
      if (filters?.providerId) {
        result = result.filter((p) => p.providerId === filters.providerId);
      }
      return result;
    },
    staleTime: 30_000,
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      await sleep(DELAY);
      return patients.find((p) => p.id === id) ?? null;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function usePatientStats() {
  return useQuery({
    queryKey: ["patient-stats"],
    queryFn: async () => {
      await sleep(DELAY);
      const total = patients.length;
      const members = patients.filter((p) => p.membershipTier !== "None").length;
      const avgLtv = Math.round(patients.reduce((s, p) => s + p.ltv, 0) / total);
      const thisMonth = patients.filter((p) => p.createdAt >= "2026-06-01").length;
      const highRisk = patients.filter((p) => p.risk === "high").length;
      return { total, members, avgLtv, thisMonth, highRisk };
    },
    staleTime: 60_000,
  });
}
