import type {ErrorClassificationMap, AnyErrorCode} from "@/lib/types/Errortypes";
// errors.ts

//
// Endpoint-specific error codes
//
export const API_ERROR_CODES = {
  DOC_PHONE_INVALID: "DOC_PHONE_INVALID",
  P1_PHONE_INVALID:  "P1_PHONE_INVALID",
  P2_PHONE_INVALID:  "P2_PHONE_INVALID",
  P1_EMAIL_INVALID:  "P1_EMAIL_INVALID",
  P2_EMAIL_INVALID:  "P2_EMAIL_INVALID",
  INVALID_CHILD_AGE: "INVALID_CHILD_AGE",
  
  UNKOWN_API_ERROR: "UNKOWN_API_ERROR"
} as const;



//
// Database-level error codes (mapped in model layer from SQL errors)
//
export const DB_ERROR_CODES = {
  DUPLICATE_CHILD:  "DUPLICATE_CHILD",
  UNIQUE_PIN: "UNIQUE_PIN",
  DOCTOR_PHONE_FORMAT: "DOCTOR_PHONE_FORMAT",
  UQ_PARENT_IDENTITY: "UQ_PARENT_IDENTITY",
  PARENT_PHONE_FORMAT: "PARENT_PHONE_FORMAT",

  UNKNOWN_DB_ERROR: "UNKNOWN_DB_ERROR",
} as const;


export const ERROR_CLASSIFICATION: ErrorClassificationMap = {
  // RegisterChild errors
  DOC_PHONE_INVALID: "caught",
  P1_PHONE_INVALID:  "caught",
  P2_PHONE_INVALID:  "caught",
  P1_EMAIL_INVALID:  "caught",
  P2_EMAIL_INVALID:  "caught",
  INVALID_CHILD_AGE: "caught",

  UNKOWN_API_ERROR: "uncaught",

  // DB errors
  DUPLICATE_CHILD:   "caught",
  UNIQUE_PIN: "uncaught",
  DOCTOR_PHONE_FORMAT: "uncaught",
  UQ_PARENT_IDENTITY: "uncaught",
  PARENT_PHONE_FORMAT: "uncaught",

  UNKNOWN_DB_ERROR:  "uncaught",


};