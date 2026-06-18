import { createFileRoute } from "@tanstack/react-router";
import { AscendApp } from "@/features/ascend/AscendApp";

export const Route = createFileRoute("/ascend")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Ascend — Self-Optimization OS" },
      { name: "description", content: "Mobile-first prototype of the Ascend OS." },
    ],
  }),
  component: AscendApp,
});
