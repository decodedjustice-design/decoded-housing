import { createFileRoute } from "@tanstack/react-router";
import { BasicNeedsPage } from "@/pages/BasicNeeds";

export const Route = createFileRoute("/basic-needs")({
  head: () => ({
    meta: [
      { title: "Basic Needs Hub — Decoded Housing" },
      {
        name: "description",
        content: "Get support in King County for food, utilities, furniture, and rent assistance in one calm, action-ready hub.",
      },
    ],
  }),
  component: BasicNeedsPage,
});
