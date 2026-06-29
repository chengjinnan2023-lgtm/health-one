// Health One — Store Workbench Application.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import BaseLayout from "./layouts/BaseLayout";
import LoginScreen from "./screens/LoginScreen";
import {
  CustomerSearchScreen,
  CustomerSummaryScreen,
  ConcernIntakeScreen,
} from "./screens/PlaceholderScreens";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
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
        <Route path="/" element={<Navigate to="/customers" replace />} />
        <Route path="/customers" element={<CustomerSearchScreen />} />
        <Route path="/customers/:id" element={<CustomerSummaryScreen />} />
        <Route
          path="/customers/:id/concern"
          element={<ConcernIntakeScreen />}
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
