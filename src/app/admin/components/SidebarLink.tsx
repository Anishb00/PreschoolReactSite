// components/SidebarLink.tsx
import Link from "next/link";
import React from "react";

interface SidebarLinkProps {
  label: string;
  href: string;
  collapsed?: boolean;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  label,
  href,
  collapsed = false,
}) => {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={[
        "group flex items-center",
        collapsed
          ? "justify-center mx-auto h-12 w-12 rounded-xl"
          : "gap-3 px-3 py-2 rounded-md w-full",
        "text-sm font-medium",
        "text-gray-300 hover:text-white hover:bg-gray-800",
        "transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-gray-600",
      ].join(" ")}
    >
      {/* Icon placeholder */}
      <span
        className={[
          "flex items-center justify-center font-semibold",
          collapsed
            ? "h-6 w-6 text-base"
            : "h-8 w-8 rounded-md bg-gray-800 group-hover:bg-gray-700 text-xs",
        ].join(" ")}
      >
        {label[0]}
      </span>

      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
};
