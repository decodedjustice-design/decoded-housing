import { createFileRoute, Navigate } from "@tanstack/react-router";
export const Route = createFileRoute("/housing")({ component: () => <Navigate to="/housing-shelter" replace /> });
