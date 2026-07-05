import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  UserCircle,
  Sprout,
  ListTree,
  Bug,
  MessageCircleHeart,
  CloudSun,
  LineChart,
  CalendarCheck2,
  Landmark,
  Wallet,
  ClipboardList,
  BarChart3,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_GROUPS = [
  {
    key: "core",
    items: [{ to: "/dashboard", key: "overview", icon: LayoutDashboard, end: true }],
  },
  {
    key: "intelligence",
    items: [
      { to: "/dashboard/profile", key: "profile", icon: UserCircle },
      { to: "/dashboard/soil", key: "soil", icon: Sprout },
      { to: "/dashboard/crops", key: "crops", icon: ListTree },
      { to: "/dashboard/disease", key: "disease", icon: Bug },
      { to: "/dashboard/assistant", key: "assistant", icon: MessageCircleHeart },
      { to: "/dashboard/weather", key: "weather", icon: CloudSun },
    ],
  },
  {
    key: "operations",
    items: [
      { to: "/dashboard/market", key: "market", icon: LineChart },
      { to: "/dashboard/booking", key: "booking", icon: CalendarCheck2 },
      { to: "/dashboard/schemes", key: "schemes", icon: Landmark },
      { to: "/dashboard/finance", key: "finance", icon: Wallet },
      { to: "/dashboard/tasks", key: "tasks", icon: ClipboardList },
    ],
  },
  {
    key: "growth",
    items: [{ to: "/dashboard/analytics", key: "analytics", icon: BarChart3 }],
  },
];

const Sidebar = ({ open, onClose, collapsed, onToggleCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.name || "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-forest-900/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed z-40 top-0 left-0 h-screen bg-gradient-to-b from-forest-800 to-forest-900 text-forest-50 flex flex-col transition-[width,transform] duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${collapsed ? "w-20" : "w-72"}`}
      >
        <div
          className={`flex items-center border-b border-forest-700/50 ${
            collapsed ? "justify-center px-3 py-6" : "justify-between px-6 py-7"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-accent flex items-center justify-center font-display font-bold text-forest-950 shrink-0 shadow-glow-gold">
              K
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-display text-xl font-bold leading-tight truncate">{t("app.name")}</p>
                <p className="text-xs uppercase tracking-wider text-forest-100/60 truncate">
                  {t("app.tagline")}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={onToggleCollapsed}
              className="hidden lg:flex w-9 h-9 rounded-xl items-center justify-center text-forest-100/70 hover:text-white hover:bg-forest-700/50 shrink-0 transition-all"
              title={t("common.collapse")}
            >
              <ChevronsLeft size={18} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={onToggleCollapsed}
            className="hidden lg:flex mx-auto mt-4 w-9 h-9 rounded-xl items-center justify-center text-forest-100/70 hover:text-white hover:bg-forest-700/50 transition-all"
            title={t("common.expand")}
          >
            <ChevronsRight size={18} />
          </button>
        )}

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.key}>
              {!collapsed && (
                <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-forest-100/50">
                  {t(`navGroups.${group.key}`)}
                </p>
              )}
              <div className="space-y-2">
                {group.items.map(({ to, key, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onClose}
                    title={collapsed ? t(`nav.${key}`) : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl text-sm transition-all duration-200 ${
                        collapsed ? "justify-center px-0 py-3" : "px-4 py-3"
                      } ${
                        isActive
                          ? "bg-gradient-accent text-forest-950 font-bold shadow-glow-gold"
                          : "text-forest-100/80 hover:text-white hover:bg-forest-700/40"
                      }`
                    }
                  >
                    <Icon size={20} strokeWidth={2} className="shrink-0" />
                    {!collapsed && <span className="truncate font-medium">{t(`nav.${key}`)}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className={`border-t border-forest-700/50 ${collapsed ? "px-2 py-5" : "px-5 py-5"}`}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-primary text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-soft">
                  {initials || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{user?.name}</p>
                  <p className="text-xs text-forest-100/60 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-sm text-forest-100/80 hover:text-white px-4 py-3 rounded-xl hover:bg-forest-700/40 transition-all"
              >
                <LogOut size={18} /> {t("common.logout")}
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              title={t("common.logout")}
              className="w-full flex items-center justify-center text-forest-100/80 hover:text-white py-3 rounded-xl hover:bg-forest-700/40 transition-all"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
