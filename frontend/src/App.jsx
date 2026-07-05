import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Overview from "./pages/Overview.jsx";
import ProfileFarm from "./pages/ProfileFarm.jsx";
import SoilIntelligence from "./pages/SoilIntelligence.jsx";
import CropPlanner from "./pages/CropPlanner.jsx";
import DiseaseDetection from "./pages/DiseaseDetection.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import WeatherIntelligence from "./pages/WeatherIntelligence.jsx";
import MarketInsights from "./pages/MarketInsights.jsx";
import SoilBooking from "./pages/SoilBooking.jsx";
import SchemesDashboard from "./pages/SchemesDashboard.jsx";
import FarmFinance from "./pages/FarmFinance.jsx";
import TaskManager from "./pages/TaskManager.jsx";
import Analytics from "./pages/Analytics.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="profile" element={<ProfileFarm />} />
        <Route path="soil" element={<SoilIntelligence />} />
        <Route path="crops" element={<CropPlanner />} />
        <Route path="disease" element={<DiseaseDetection />} />
        <Route path="assistant" element={<AIAssistant />} />
        <Route path="weather" element={<WeatherIntelligence />} />
        <Route path="market" element={<MarketInsights />} />
        <Route path="booking" element={<SoilBooking />} />
        <Route path="schemes" element={<SchemesDashboard />} />
        <Route path="finance" element={<FarmFinance />} />
        <Route path="tasks" element={<TaskManager />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}

export default App;
