import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "./pages/landing";
import ProfileForm from "./pages/profile-form";
import ResumeUpload from "./pages/resume-upload";
import Assessment from "./pages/assessment";
import Results from "./pages/results";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/profile" component={ProfileForm} />
      <Route path="/resume" component={ResumeUpload} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/results" component={Results} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
