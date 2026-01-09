// components/AdminSidebar.tsx
"use client";

import React from "react";
import { SidebarLink } from "./SidebarLink";
import { LogoutButton } from "@/app/admin/home/logout";

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
            rounded-md
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

        <div className="pt-4 mt-4 border-t border-gray-800 space-y-3">
          <SidebarLink
            collapsed={collapsed}
            label="Check Roles"
            href="/admin/checkroles"
          />
          {isAdmin && (
            <>
              <SidebarLink
                collapsed={collapsed}
                label="Edit Calendar"
                href="/admin/Events"
              />
              <SidebarLink
                collapsed={collapsed}
                label="Add Child"
                href="/admin/AddChild"
              />
              <SidebarLink
                collapsed={collapsed}
                label="Edit Child"
                href="/admin/EditChild"
              />
              <SidebarLink collapsed={collapsed} label="Employee Signup" href="/admin/signup" />
            </>
          )}
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
