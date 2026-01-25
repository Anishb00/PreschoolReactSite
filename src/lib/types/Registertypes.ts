import {EndpointErrorResponse} from "@/lib/EndpointErrorResponse";
/*
*
* REGISTRATION FORM TYPES
* 
* */
export const PROGRAM_CHOICES = [
  "Full Time 5 days",
  "Full Time 4 days",
  "Full Time 3 days",
  "Full Time 2 days",
  "Full Time 1 day",
  "Half Time 5 days",
  "Half Time 4 days",
  "Half Time 3 days",
  "Half Time 2 days",
  "Half Time 1 day",
  "TBD",
  ""
] as const;

export type ProgramOption = typeof PROGRAM_CHOICES[number];

export const PROGRAM_SET: ReadonlySet<string> = new Set(PROGRAM_CHOICES);


export type RegistrationData = {
  childName: string;                 // required
  dob: Date;                       // "YYYY-MM-DD"
  sex: "female" | "male" | "";            // matches <select> values
  Program: ProgramOption;            // capital P (as in your object)
  checkoutTime?: string | null;

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
  pottyTrained: boolean;
};

export type RegisterPageRenderCondition =  "REGISTER" | "SUCCESS" | "DUPLICATE"
export type RegisterFormState = {
  statusCodes: Set<string>;
  values: RegistrationData;
};

export type registerSeverAction = (formData: FormData) => void;
