import { createFileRoute, Navigate } from "@tanstack/react-router";
export const Route = createFileRoute("/search-v2")({ component: () => <Navigate to="/housing-shelter" replace /> });
