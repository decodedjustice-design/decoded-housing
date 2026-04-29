import { Outlet } from "@tanstack/react-router";
import { Header } from "../navigation/Header";
import { QuickAssistSidebar } from "../QuickAssistSidebar";

export function SiteLayout() {
  return <div className="min-h-screen bg-background"><Header /><Outlet /><QuickAssistSidebar /></div>;
}
