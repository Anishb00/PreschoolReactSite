import {API_ERROR_CODES, DB_ERROR_CODES} from '@/lib/errorCodes';

// API error keys
export type ApiErrorCodeKey = keyof typeof API_ERROR_CODES;

// DB error keys
export type DbErrorCodeKey = keyof typeof DB_ERROR_CODES;

// Union of all keys
export type AnyErrorCode = ApiErrorCodeKey | DbErrorCodeKey;

export type ErrorClassificationMap = {
  [K in AnyErrorCode]: "caught" | "uncaught";
};