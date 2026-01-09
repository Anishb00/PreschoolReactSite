// components/LogoutButton.tsx
"use client";

import React from "react";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface LogoutButtonProps {
  collapsed?: boolean;
  redirectTo?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  collapsed = false,
  redirectTo = "/admin",
}) => {
  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    redirect(redirectTo);
  };

  return (
    <button
      type="button"
      onClick={logout}
      title={collapsed ? "Logout" : undefined}
      className={[
        "group flex items-center",
        collapsed
          ? "justify-center mx-auto h-12 w-12 rounded-xl"
          : "gap-3 px-3 py-2 rounded-md w-full",
        "text-sm font-medium",
        "text-red-300 hover:text-red-200",
        "bg-red-950/30 hover:bg-red-900/40",
        "transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-red-500",
      ].join(" ")}
    >
      {/* Icon / marker */}
      <span
        className={[
          "flex items-center justify-center font-semibold",
          collapsed
            ? "h-6 w-6 text-base"
            : "h-8 w-8 rounded-md bg-red-900/40 group-hover:bg-red-800/50 text-xs",
        ].join(" ")}
      >
        ⎋
      </span>

      {!collapsed && <span className="truncate">Logout</span>}
    </button>
  );
};
