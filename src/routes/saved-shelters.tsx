import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/saved-shelters")({ component: () => <Navigate to="/saved" replace /> });
