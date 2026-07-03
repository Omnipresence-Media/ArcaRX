import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

type GoOpts = {
  description?: string;
  to?: string;
  params?: Record<string, string>;
  label?: string;
  kind?: "success" | "info";
};

// Toast helper whose notification can carry a clickable action that navigates
// the user to where the action actually lives (e.g. "Take me there ->").
export function useGoToast() {
  const navigate = useNavigate();
  return (message: string, opts: GoOpts = {}) => {
    const action = opts.to
      ? {
          label: opts.label ?? "Take me there",
          onClick: () => (navigate as (o: { to: string; params?: Record<string, string> }) => void)({ to: opts.to!, params: opts.params }),
        }
      : undefined;
    const fn = opts.kind === "info" ? toast.info : toast.success;
    fn(message, { description: opts.description, action });
  };
}
