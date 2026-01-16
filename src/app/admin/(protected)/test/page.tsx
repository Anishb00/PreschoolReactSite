"use client";

import React, { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { type ProjectPermission, PROJECT_PERMISSION_CODES } from "@/lib/permissions";

export default function Dashboard() {
  // Hardcoded data
  const project: ProjectPermission[] = [PROJECT_PERMISSION_CODES.VIEW_DASHBOARD];

  useEffect(() => {
    const checkpriv = async () => {
      try {
        console.log("checking permissions");
        const testPermission = await authClient.admin.hasPermission({
          permissions: { project },
        });
        console.log(testPermission);
      } catch (err) {
        console.error("Permission check failed", err);
      }
    };

    void checkpriv();
  }, [project]);

  return <div></div>;
}
