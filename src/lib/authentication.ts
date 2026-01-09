import {auth} from "@/lib/auth";
import { headers } from 'next/headers';
import { redirect } from "next/navigation";

type role = "user" | "admin"

const authorizeUser = async function(requiredrole:role){
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session){redirect("/admin")}; // not signed in

  if (requiredrole === "admin" && session.user.role !== "admin") {
    redirect("/admin"); // signed in but not admin
  }
}

const isAdmin = async function(){
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.role === "admin";

}

const getUserID = async function():Promise<string>{
  const session = await auth.api.getSession({ headers: await headers() });
  if(session){
    return session.user.id
  }else{
    return ""
  }
}

export {authorizeUser,getUserID,isAdmin};