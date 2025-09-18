// components/LogoutButton.tsx
"use client";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LogoutButton({ redirectTo = "/admin" }: { redirectTo?: string }) {

  const logout = async function () {
    try{
      await authClient.signOut();
      console.log("Completed");
    }catch(err){
      console.log("ERROR____________________________")
      console.log(err);
    }
    redirect("/admin")
  }
  return <button type="button" onClick={logout}>Logout</button>;
}
