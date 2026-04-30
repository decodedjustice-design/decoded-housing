import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/basic-needs")({ component: () => <Navigate to="/bills-basics" replace /> });
