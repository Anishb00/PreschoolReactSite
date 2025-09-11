
import {type ProgramOption, PROGRAM_SET} from '@/lib/types/Registertypes';
import {API_ERROR_CODES} from "@/lib/errorCodes";
import {EndpointErrorResponse} from "@/lib/EndpointErrorResponse";
import type {AnyErrorCode} from "@/lib/types/Errortypes";


export const mustString = (fd: FormData, key: string,errorStatus:EndpointErrorResponse) => {
    const v = fd.get(key);
    if (typeof v !== "string" || v.trim() === "") {
        errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR)
        errorStatus.log(`recieved invalid ${key} value: ${v}`)
        return ""
    }
    return v.trim();
};

export const mustDOB =(date:FormDataEntryValue,errorStatus:EndpointErrorResponse): Date => {
    const dob = new Date(String(date));
    if (isNaN(dob.getTime())) {
        errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR)
        errorStatus.log(`recieved invalid dob value: ${dob}`);
    }
    return dob
}

export const optionalString = (fd: FormData, key: string) => {
    const v = fd.get(key);
    if (v == null) return null;
    const s = typeof v === "string" ? v.trim() : "";
    return s === "" ? null : s;
};

export function normalizeAndValidatePhone(fd: FormData, key: string, errorStatus:EndpointErrorResponse,errorCode: AnyErrorCode, opts: { required: true }): string;
export function normalizeAndValidatePhone(fd: FormData, key: string, errorStatus:EndpointErrorResponse,errorCode: AnyErrorCode, opts: { required: false }): string | null;

export function normalizeAndValidatePhone(fd: FormData, key: string, errorStatus:EndpointErrorResponse,errorCode: AnyErrorCode, opts: {required:boolean}): string | null {
    const phoneNum = String(fd.get(key)) || "";
    if(!opts.required && phoneNum.length === 0){
        return null;
    }else if (opts.required && phoneNum.length == 0){
        errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR)
        errorStatus.log(`recieved invalid ${key} value: ${phoneNum}`);
        return phoneNum;
    }
    const normalizedPhoneNumber = String(phoneNum).replace(/[^\d]/g, "");
    if (normalizedPhoneNumber.length===11){
        return normalizedPhoneNumber;
    } else{
        errorStatus.add(errorCode);
        return normalizedPhoneNumber
    }
}

export function validateEmailAddress(fd: FormData, key: string, errorStatus:EndpointErrorResponse,errorCode: AnyErrorCode, opts: { required: true }): string;
export function validateEmailAddress(fd: FormData, key: string, errorStatus:EndpointErrorResponse,errorCode: AnyErrorCode, opts: { required: false }): string | null;

export function validateEmailAddress(fd: FormData, key: string,errorStatus:EndpointErrorResponse,errorCode: AnyErrorCode, opts: {required:boolean}): string | null{
    const email = String(fd.get(key)) || "";
    if(!opts.required && email.length === 0){
        return null;
    }else if (opts.required && email.length == 0){
        errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR)
        errorStatus.log(`recieved invalid ${key} value: ${email}`);
        return email;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!emailRegex.test(email)){
        errorStatus.add(errorCode);
    }
    return email;
}

export function validateSex(option:string,errorStatus:EndpointErrorResponse):  "female" | "male" | "" {
    if (option == "male" || option == "female"){
        return option;
    }else{
        errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR)
        errorStatus.log(`recieved invalid sex value: ${option}`);
        return "";
    }
}

function isProgramOption(v: string): v is ProgramOption {
  return PROGRAM_SET.has(v);
}
export function validateProgram(option:string,errorStatus:EndpointErrorResponse):  ProgramOption {
    if (option === "" || !isProgramOption(option)) {
        errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR)
        errorStatus.log(`recieved invalid Program value: ${option}`);
        return "";
    }
    return option; 
}




