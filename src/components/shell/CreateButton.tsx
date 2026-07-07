import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { X } from "lucide-react";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "textarea" | "select";
  options?: string[];
};

const inputStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  padding: "10px 12px",
  borderRadius: 9,
  border: "1px solid var(--border, #E2E8F0)",
  outline: "none",
  background: "var(--background, #fff)",
  color: "inherit",
  width: "100%",
};

const btnBase: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  fontWeight: 600,
  padding: "9px 18px",
  borderRadius: 9,
  cursor: "pointer",
};

// Controlled create/edit form modal. Renders through a portal so glass /
// backdrop-filter shells can't clip it. On submit it confirms and closes so
// the task actually completes in place instead of firing a dead-end toast.
export function CreateModal({
  open,
  onClose,
  title,
  description,
  fields,
  submitLabel = "Create",
  successMessage,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: Field[];
  submitLabel?: string;
  successMessage?: string;
  onSubmit?: (values: Record<string, string>) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  if (!open || typeof document === "undefined") return null;

  // Driven by the button's onClick (and Enter via onSubmit). We read values off
  // the form ref rather than relying on the native submit event, which does not
  // reach React handlers when the form is rendered inside a portal.
  function doSubmit() {
    const form = formRef.current;
    const values: Record<string, string> = {};
    if (form) {
      for (const f of fields) {
        const el = form.elements.namedItem(f.name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        if (el) values[f.name] = el.value;
      }
    }
    onClose();
    onSubmit?.(values);
    toast.success(successMessage ?? `${title} saved`, { description: "Saved successfully." });
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(8,12,20,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 440, background: "var(--background, #fff)", color: "var(--foreground, #0F1F3D)", borderRadius: 16, border: "1px solid var(--border, #E2E8F0)", boxShadow: "0 24px 70px rgba(15,31,61,0.28)", overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "18px 20px 0" }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 18, margin: 0 }}>{title}</h2>
            {description && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "var(--muted-foreground, #64748B)", marginTop: 4, lineHeight: 1.5 }}>{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground, #64748B)", padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <form ref={formRef} onSubmit={(e) => { e.preventDefault(); doSubmit(); }} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map((f) => (
            <label key={f.name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600 }}>{f.label}</span>
              {f.type === "textarea" ? (
                <textarea name={f.name} placeholder={f.placeholder} rows={3} style={inputStyle} />
              ) : f.type === "select" ? (
                <select name={f.name} style={inputStyle} defaultValue={f.options?.[0] ?? ""}>
                  {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input name={f.name} type={f.type ?? "text"} placeholder={f.placeholder} style={inputStyle} />
              )}
            </label>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ ...btnBase, background: "transparent", color: "var(--muted-foreground, #64748B)", border: "1px solid var(--border, #E2E8F0)" }}>Cancel</button>
            <button type="button" onClick={doSubmit} style={{ ...btnBase, background: "#00B5A4", color: "white", border: "none" }}>{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

// Self-contained trigger + modal, for raw-button contexts (e.g. coaching pages).
export function CreateButton({
  label,
  className,
  style,
  children,
  ...modal
}: {
  label?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  title: string;
  description?: string;
  fields: Field[];
  submitLabel?: string;
  successMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} style={style}>
        {children ?? label}
      </button>
      <CreateModal open={open} onClose={() => setOpen(false)} {...modal} />
    </>
  );
}
