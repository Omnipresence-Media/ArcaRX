import { useQuery } from "@tanstack/react-query";
import { getAuditByPatient } from "@/lib/data";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useAuditLog(patientId: string | undefined) {
  return useQuery({
    queryKey: ["audit", patientId],
    queryFn: async () => {
      await sleep(80);
      return patientId ? getAuditByPatient(patientId) : [];
    },
    enabled: !!patientId,
    staleTime: 30_000,
  });
}
