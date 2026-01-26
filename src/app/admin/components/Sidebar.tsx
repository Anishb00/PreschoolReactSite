// components/AdminSidebar.tsx
"use client";

import React from "react";
import { SidebarLink } from "./SidebarLink";
import { LogoutButton } from "@/app/admin/(protected)/home/logout";

type AdminSidebarProps = {
  isAdmin: boolean;
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isAdmin }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={[
        "bg-gray-900 text-gray-100 flex flex-col shadow-xl h-screen",
        "transition-all duration-200 ease-in-out",
        collapsed ? "w-16" : "w-64",
      ].join(" ")}
    >
      {/* Header / Toggle */}
      <div
        className={[
          "border-b border-gray-800",
          "flex items-center",
          collapsed ? "justify-center py-6" : "justify-between px-6 py-5",
        ].join(" ")}
      >
        {!collapsed && (
          <div>
            <h1 className="text-xl font-semibold tracking-wide">Admin Portal</h1>
            <p className="text-xs text-gray-400 mt-1">Management Dashboard</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="
            inline-flex items-center justify-center
            h-12 w-12 rounded-md
            text-gray-300 hover:text-white hover:bg-gray-800
            transition-colors
          "
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <span className={collapsed ? "text-3xl" : "text-xl"}>
            {collapsed ? "»" : "«"}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={[
      "flex-1 py-4 space-y-3",
      collapsed ? "px-0 flex flex-col items-center" : "px-3",
    ].join(" ")}
  >
      <SidebarLink collapsed={collapsed} label="Home" href="/admin/home" />
      {isAdmin && (
        <>
          <SidebarLink collapsed={collapsed} label="Unverified Emails" href="/admin/Unverified" />
          <SidebarLink collapsed={collapsed} label="Full Children" href="/admin/ChildrenFull" />
          <SidebarLink collapsed={collapsed} label="Mass Email" href="/admin/MassEmail" />
          <SidebarLink collapsed={collapsed} label="Documents" href="/admin/Documents" />
        </>
      )}

    <div className="pt-4 mt-4 border-t border-gray-800 space-y-3">
      {isAdmin && (
        <>
              <SidebarLink
                collapsed={collapsed}
                label="Edit Calendar"
                href="/admin/Events"
              />
              <SidebarLink
                collapsed={collapsed}
                label="Edit Event Photos"
                href="/admin/EventPhotos"
              />
              <SidebarLink
                collapsed={collapsed}
                label="Edit Carousel"
                href="/admin/Carousel"
              />
              <SidebarLink
                collapsed={collapsed}
                label="Add Child"
                href="/admin/AddChild"
              />
              <SidebarLink collapsed={collapsed} label="Employee Signup" href="/admin/signup" />
            </>
          )}
        </div>
        <div className="pt-4 mt-4 border-t border-gray-800">
          <SidebarLink
            collapsed={collapsed}
            label="Back to site"
            href="https://steppingstoneworld.com/"
          />
          <SidebarLink
            collapsed={collapsed}
            label="Event Photos (Public)"
            href="https://steppingstoneworld.com/Events"
          />
        </div>
      </nav>

      {/* Bottom actions */}
      <div
        className={[
          "border-t border-gray-800 py-4",
          collapsed ? "px-0 flex justify-center" : "px-3",
        ].join(" ")}
      >
        <LogoutButton collapsed={collapsed} redirectTo="/admin" />
      </div>
    </aside>
  );
};
