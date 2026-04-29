import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/apply")({ component: () => <Navigate to="/housing/how-to-apply" replace /> });
