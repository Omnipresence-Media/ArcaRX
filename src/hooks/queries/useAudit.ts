import { useQuery } from "@tanstack/react-query";
import { getAuditByPatient, auditEvents } from "@/lib/data";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useAuditLog(patientId?: string) {
  return useQuery({
    queryKey: ["audit", patientId ?? "all"],
    queryFn: async () => {
      await sleep(80);
      if (patientId) return getAuditByPatient(patientId);
      return [...auditEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    staleTime: 30_000,
  });
}
