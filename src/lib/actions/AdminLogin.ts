'use server';
import {auth} from "@/lib/auth";
import {EndpointErrorResponse} from "@/lib/EndpointErrorResponse";
import {API_ERROR_CODES,DB_ERROR_CODES} from "@/lib/errorCodes";
import { redirect } from "next/navigation";

const  AdminSigninServerAction = async function(formData: FormData)  {

  const username = String(formData.get("username"));
  const password = String(formData.get("password"));

  let errorState = new EndpointErrorResponse();

  try{
    const data = await auth.api.signInUsername({
      body: {
        username,
        password,
      },
    });

  } catch(err:any){
    if (err.status == "UNAUTHORIZED"){
      errorState.add(API_ERROR_CODES.INVALID_LOGIN_CREDENTIALS);
    } else {
      errorState.add(API_ERROR_CODES.UNKOWN_API_ERROR);
      errorState.log(err);
    }
  }
  console.log(errorState);
  if (errorState.checkUncaughtErrors()){
    return
  }else if (errorState.checkErrors() > 0){
    return
  }else{
    redirect("/admin/home");
  }




}

export {AdminSigninServerAction};