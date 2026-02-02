import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { AuthProvider } from "./auth/AuthContext";
import { Login } from "./pages/Login";
import { RiderDashboard } from "./pages/rider/RiderDashboard";
import { DriverDashboard } from "./pages/driver/DriverDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { useAuth } from "./auth/AuthContext";

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      
      {/* Protected Routes - Require Authentication */}
      {user && (
        <>
          <Route path={"/rider"} component={RiderDashboard} />
          <Route path={"/driver"} component={DriverDashboard} />
          <Route path={"/admin"} component={AdminDashboard} />
        </>
      )}
      
      {/* 404 - Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;