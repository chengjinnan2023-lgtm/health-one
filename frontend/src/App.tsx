// Health One — Store Workbench Application.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import BaseLayout from "./layouts/BaseLayout";
import LoginScreen from "./screens/LoginScreen";
import CustomerSearchScreen from "./screens/CustomerSearchScreen";
import CustomerSummaryScreen from "./screens/CustomerSummaryScreen";
import ConcernIntakeScreen from "./screens/ConcernIntakeScreen";
import FeedbackRecordScreen from "./screens/FeedbackRecordScreen";
import FollowUpScreen from "./screens/FollowUpScreen";
import ServiceRecordScreen from "./screens/ServiceRecordScreen";
import FollowUpQueueScreen from "./screens/FollowUpQueueScreen";
import ManagerDashboard from "./screens/ManagerDashboard";
import ManagerStatsScreen from "./screens/ManagerStatsScreen";
import HealthAdvisorDashboard from "./screens/HealthAdvisorDashboard";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function HomeScreen() {
  const { staff } = useAuth();
  if (staff?.role === "店长") return <ManagerDashboard />;
  return <HealthAdvisorDashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route
        element={
          <ProtectedRoute>
            <BaseLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomeScreen />} />
        <Route path="/follow-up-queue" element={<FollowUpQueueScreen />} />
        <Route path="/manager/stats" element={<ManagerStatsScreen />} />
        <Route path="/customers" element={<CustomerSearchScreen />} />
        <Route path="/customers/:id" element={<CustomerSummaryScreen />} />
        <Route
          path="/customers/:id/concern"
          element={<ConcernIntakeScreen />}
        />
        <Route
          path="/customers/:id/service"
          element={<ServiceRecordScreen />}
        />
        <Route
          path="/customers/:id/feedback"
          element={<FeedbackRecordScreen />}
        />
        <Route
          path="/customers/:id/follow-up"
          element={<FollowUpScreen />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
