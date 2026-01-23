
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
    const raw = String(date);
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const dob = match
      ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      : new Date(raw);
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
    const normalizedPhoneNumber = String(phoneNum).replace(/[^\d]/g, "");
    console.log(normalizedPhoneNumber, normalizedPhoneNumber.length > 1 && normalizedPhoneNumber.length < 11)
    if(!opts.required && normalizedPhoneNumber.length == 1){
        return null;
    }else if(!opts.required && (normalizedPhoneNumber.length > 1 && normalizedPhoneNumber.length < 11)){
        errorStatus.add(errorCode);
        return phoneNum;
    }else if (opts.required && normalizedPhoneNumber.length < 11){
        errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR)
        errorStatus.log(`recieved invalid ${key} value: ${phoneNum}`);
        return phoneNum;
    }

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

export function parseYesNoBoolean(
    fd: FormData,
    key: string,
    errorStatus: EndpointErrorResponse
): boolean {
    const raw = String(fd.get(key) ?? "").toLowerCase();
    if (raw === "yes" || raw === "true") return true;
    if (raw === "no" || raw === "false") return false;
    errorStatus.add(API_ERROR_CODES.UNKOWN_API_ERROR);
    errorStatus.log(`recieved invalid boolean value for ${key}: ${raw}`);
    return false;
}

export function waitlistRecordMatches(
    row: {
        Child_name: string;
        DOB: Date;
        Sex: string;
        Program: string;
        Class: string | null;
        Doctor_name: string | null;
        Doctor_phone: string | null;
        Parent1_Name: string | null;
        Parent1_Address: string | null;
        Parent1_Phone: string | null;
        Parent1_Email: string | null;
        Parent2_Name: string | null;
        Parent2_Address: string | null;
        Parent2_Phone: string | null;
        Parent2_Email: string | null;
    },
    data: {
        childName: string;
        dob: Date;
        sex: "female" | "male" | "";
        Program: ProgramOption;
        doctorName: string;
        doctorPhone: string;
        parentOneName: string;
        parentOnePhone: string;
        parentOneEmail: string;
        parentTwoName: string | null;
        parentTwoPhone: string | null;
        parentTwoEmail: string | null;
    }
): boolean {
    const dbDob = toDateKey(row.DOB);
    const formDob = toDateKey(data.dob);

    const parent1Match =
        row.Parent1_Name === data.parentOneName &&
        row.Parent1_Phone === data.parentOnePhone &&
        row.Parent1_Email === data.parentOneEmail;

    const hasParent2Data =
        data.parentTwoName !== null ||
        data.parentTwoPhone !== null ||
        data.parentTwoEmail !== null;

    const parent2Match = hasParent2Data
        ? row.Parent2_Name === data.parentTwoName &&
          row.Parent2_Phone === data.parentTwoPhone &&
          row.Parent2_Email === data.parentTwoEmail
        : row.Parent2_Name === null &&
          row.Parent2_Phone === null &&
          row.Parent2_Email === null;

    return (
        row.Child_name === data.childName &&
        dbDob === formDob &&
        row.Sex === data.sex &&
        row.Program === data.Program &&
        row.Class === "Pre-Register" &&
        row.Doctor_name === data.doctorName &&
        row.Doctor_phone === data.doctorPhone &&
        parent1Match &&
        parent2Match
    );
}

function toDateKey(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
