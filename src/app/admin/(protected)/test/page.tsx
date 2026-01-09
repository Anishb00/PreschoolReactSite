// Dashboard.jsx
import React from "react";
import { authClient } from "@/lib/auth-client";
import {type ProjectPermission, PROJECT_PERMISSION_CODES} from "@/lib/permissions";


export default function Dashboard() {
  // Hardcoded data
    const project: ProjectPermission[] = [PROJECT_PERMISSION_CODES.VIEW_DASHBOARD];
    const checkpriv = async function (){
      console.log('here');
        const testPermission = await authClient.admin.hasPermission({
            permissions: {
                project
            },
        });
        console.log(testPermission);
    }

    checkpriv();

  return (
    <div></div>
  );
}
