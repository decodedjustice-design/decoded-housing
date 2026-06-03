import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/home-v2")({
  component: () => <Navigate to="/" replace />,
});
