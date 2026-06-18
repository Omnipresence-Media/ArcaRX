import { useQuery } from "@tanstack/react-query";
import { encounters, getEncountersByPatient, getEncounter } from "@/lib/data";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useEncounters(patientId: string | undefined) {
  return useQuery({
    queryKey: ["encounters", patientId],
    queryFn: async () => {
      await sleep(100);
      return patientId ? getEncountersByPatient(patientId) : [];
    },
    enabled: !!patientId,
    staleTime: 30_000,
  });
}

export function useEncounter(id: string | undefined) {
  return useQuery({
    queryKey: ["encounter", id],
    queryFn: async () => {
      await sleep(80);
      return id ? (getEncounter(id) ?? null) : null;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}
