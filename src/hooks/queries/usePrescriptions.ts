import { useQuery } from "@tanstack/react-query";
import { getRxByPatient, getActiveRxByPatient } from "@/lib/data";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function usePrescriptions(patientId: string | undefined) {
  return useQuery({
    queryKey: ["prescriptions", patientId],
    queryFn: async () => {
      await sleep(100);
      return patientId ? getRxByPatient(patientId) : [];
    },
    enabled: !!patientId,
    staleTime: 30_000,
  });
}

export function useActivePrescriptions(patientId: string | undefined) {
  return useQuery({
    queryKey: ["prescriptions-active", patientId],
    queryFn: async () => {
      await sleep(80);
      return patientId ? getActiveRxByPatient(patientId) : [];
    },
    enabled: !!patientId,
    staleTime: 30_000,
  });
}
