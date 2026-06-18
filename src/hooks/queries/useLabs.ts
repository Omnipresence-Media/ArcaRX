import { useQuery } from "@tanstack/react-query";
import { getLabsByPatient, getLabResult } from "@/lib/data";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useLabs(patientId: string | undefined) {
  return useQuery({
    queryKey: ["labs", patientId],
    queryFn: async () => {
      await sleep(100);
      return patientId ? getLabsByPatient(patientId) : [];
    },
    enabled: !!patientId,
    staleTime: 30_000,
  });
}

export function useLabResult(id: string | undefined) {
  return useQuery({
    queryKey: ["lab", id],
    queryFn: async () => {
      await sleep(80);
      return id ? (getLabResult(id) ?? null) : null;
    },
    enabled: !!id,
  });
}
