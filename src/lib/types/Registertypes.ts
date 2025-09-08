import {EndpointErrorResponse} from "@/lib/EndpointErrorResponse";
/*
*
* REGISTRATION FORM TYPES
* 
* */
export const PROGRAM_CHOICES = [
  "2-day-full",
  "2-day-half",
  "3-day-full",
  "3-day-half",
  "5-day-full",
  "5-day-half",
  ""
] as const;

export type ProgramOption = typeof PROGRAM_CHOICES[number];

export const PROGRAM_SET: ReadonlySet<string> = new Set(PROGRAM_CHOICES);


export type RegistrationData = {
  childName: string;                 // required
  dob: Date;                       // "YYYY-MM-DD"
  sex: "female" | "male" | "";            // matches <select> values
  Program: ProgramOption;            // capital P (as in your object)
  Pin:string;

  parentOneName: string;             // required
  parentOneAddress: string;          // required
  parentOnePhone: string;            // digits-only
  parentOneEmail: string;            // required

  // Only Parent 2 data can be null:
  parentTwoName: string | null;
  parentTwoAddress: string | null;
  parentTwoPhone: string | null;     // digits-only or null
  parentTwoEmail: string | null;

  doctorName: string;                // required
  doctorPhone: string;               // digits-only
};

export type RegisterPageRenderCondition =  "REGISTER" | "SUCCESS" | "DUPLICATE"
export type RegisterFormState = {
  statusCodes: Set<string>;
  values: RegistrationData;
};

export type registerSeverAction = (formData: FormData) => void;


