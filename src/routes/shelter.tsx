import { createFileRoute, Navigate } from "@tanstack/react-router";
export const Route = createFileRoute("/shelter")({ component: () => <Navigate to="/housing-shelter" replace /> });
