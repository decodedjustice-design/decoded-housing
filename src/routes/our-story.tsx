import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/our-story")({ component: () => <Navigate to="/about" replace /> });
