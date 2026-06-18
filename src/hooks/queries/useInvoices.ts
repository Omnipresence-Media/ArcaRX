import { useQuery } from "@tanstack/react-query";
import { getInvoicesByPatient, getPatientBalance } from "@/lib/data";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useInvoices(patientId: string | undefined) {
  return useQuery({
    queryKey: ["invoices", patientId],
    queryFn: async () => {
      await sleep(100);
      return patientId ? getInvoicesByPatient(patientId) : [];
    },
    enabled: !!patientId,
    staleTime: 30_000,
  });
}

export function usePatientBalance(patientId: string | undefined) {
  return useQuery({
    queryKey: ["balance", patientId],
    queryFn: async () => {
      await sleep(60);
      return patientId ? getPatientBalance(patientId) : 0;
    },
    enabled: !!patientId,
    staleTime: 30_000,
  });
}
