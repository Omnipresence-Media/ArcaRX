import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByPatient, getTodayAppointments, getUpcomingAppointments } from "@/lib/data";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useAppointments(patientId: string | undefined) {
  return useQuery({
    queryKey: ["appointments", patientId],
    queryFn: async () => {
      await sleep(100);
      return patientId ? getAppointmentsByPatient(patientId) : [];
    },
    enabled: !!patientId,
    staleTime: 30_000,
  });
}

export function useTodaySchedule(locationId?: string) {
  return useQuery({
    queryKey: ["today-schedule", locationId],
    queryFn: async () => {
      await sleep(100);
      return getTodayAppointments(locationId);
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function useUpcomingAppointments(patientId: string | undefined) {
  return useQuery({
    queryKey: ["upcoming-appointments", patientId],
    queryFn: async () => {
      await sleep(80);
      return patientId ? getUpcomingAppointments(patientId) : [];
    },
    enabled: !!patientId,
    staleTime: 30_000,
  });
}
