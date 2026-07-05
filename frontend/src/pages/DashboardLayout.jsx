import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

const titleKeyMap = {
  "/dashboard": "nav.overview",
  "/dashboard/profile": "nav.profile",
  "/dashboard/soil": "nav.soil",
  "/dashboard/crops": "nav.crops",
  "/dashboard/disease": "nav.disease",
  "/dashboard/assistant": "nav.assistant",
  "/dashboard/weather": "nav.weather",
  "/dashboard/market": "nav.market",
  "/dashboard/booking": "nav.booking",
  "/dashboard/schemes": "nav.schemes",
  "/dashboard/finance": "nav.finance",
  "/dashboard/tasks": "nav.tasks",
  "/dashboard/analytics": "nav.analytics",
};

const COLLAPSE_KEY = "khetsetu_sidebar_collapsed";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === "true");
  const location = useLocation();
  const titleKey = titleKeyMap[location.pathname];

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, String(collapsed));
  }, [collapsed]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen flex bg-gradient-hero overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
      />
      <div
        className={`flex-1 min-w-0 h-screen flex flex-col transition-[margin] duration-300 ease-out ${
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <Topbar titleKey={titleKey} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin px-5 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
