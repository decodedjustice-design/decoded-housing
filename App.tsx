import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Search from "./pages/Search";
import PropertyDetail from "./pages/PropertyDetail";
import HowItWorks from "./pages/HowItWorks";
import Scripts from "./pages/Scripts";
import ShelterFinder from "./pages/ShelterFinder";
import ShelterMap from './pages/ShelterMap';
import EmergencyTest from './pages/EmergencyTest';
import Eligibility from "./pages/Eligibility";
import HowToApply from "./pages/HowToApply";
import RentalAssistance from "./pages/RentalAssistance";
import TenantRights from "./pages/TenantRights";
import SupportiveServices from "./pages/SupportiveServices";
import ApplicantPortal from "./pages/ApplicantPortal";
import TenantPortal from "./pages/TenantPortal";
import OwnerHub from "./pages/OwnerHub";
import DataImpact from "./pages/DataImpact";
import HelpCenter from "./pages/HelpCenter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/scripts" component={Scripts} />
      <Route path="/shelter-finder" component={ShelterFinder} />
      <Route path="/shelter-map" component={ShelterMap} />
      <Route path="/emergency-test" component={EmergencyTest} />

      {/* Hub pages */}
      <Route path="/eligibility" component={Eligibility} />
      <Route path="/how-to-apply" component={HowToApply} />
      <Route path="/rental-assistance" component={RentalAssistance} />
      <Route path="/tenant-rights" component={TenantRights} />
      <Route path="/supportive-services" component={SupportiveServices} />
      <Route path="/applicant-portal" component={ApplicantPortal} />
      <Route path="/tenant-portal" component={TenantPortal} />
      <Route path="/owner-hub" component={OwnerHub} />
      <Route path="/data-impact" component={DataImpact} />
      <Route path="/help-center" component={HelpCenter} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
