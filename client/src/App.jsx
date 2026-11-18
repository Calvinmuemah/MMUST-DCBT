import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/ChatSupport";
import Crisis from "./pages/CrisisSupport";
import CBTExercise from "./pages/CBTModule";
import Onboarding from "./pages/Assessment";

import ProtectedLayout from "./components/ProtectedLayout";
import { AuthProvider } from "./utils/AuthContext";

// Forward requests outside student SPA to the real Nginx location
function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ONBOARDING (after login) */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/assessment" element={<Onboarding />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/crisis" element={<Crisis />} />
            <Route path="/cbt" element={<CBTExercise />} />
          </Route>

          {/* EXTERNAL SERVER & ADMIN ROUTES */}
          <Route path="/admin" element={<ExternalRedirect to="/admin/" />} />
          <Route path="/admin/*" element={<ExternalRedirect to="/admin/" />} />
          <Route path="/api" element={<ExternalRedirect to="/api" />} />
          <Route path="/api/*" element={<ExternalRedirect to="/api" />} />

          {/* CATCH-ALL UNKNOWN ROUTES */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}