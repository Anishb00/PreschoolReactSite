import pool from '@/lib/db';
import type {RegistrationData} from '@/lib/types/Registertypes';
import {EndpointErrorResponse} from "@/lib/EndpointErrorResponse";
import type { QueryError } from "mysql2"; // (mysql2 reuses mysql typings)
import {DB_ERROR_CODES} from "@/lib/errorCodes";
import type {AnyErrorCode} from "@/lib/types/Errortypes";


async function establishConnection() {
    const connection = await pool.getConnection();
    connection.addListener('error', (err) => {
    if (err instanceof Error) {
        console.log(`createConnection error:`, err);
    }
    });
    return connection;
}

type RegisterWaitlistFn = ((data:RegistrationData,errorStatus:EndpointErrorResponse)=>Promise<void>) & {
  objParamOrder: ReadonlyArray<keyof RegistrationData>;
};

export const registerWaitlist:RegisterWaitlistFn = Object.assign(
  async function func(formData:RegistrationData,errorStatus:EndpointErrorResponse) {
    const params = registerWaitlist.objParamOrder.map((val,index)=> {return formData[registerWaitlist.objParamOrder[index]]})
    try{
      const rows = await pool.execute(
        `CALL register_child_waitlist(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );
    } catch(err){
      const e = err as QueryError & { sqlMessage?: string };
      const violatedConstraint = getConstraintName(e.sqlMessage || "");
      console.log(violatedConstraint);
      if (violatedConstraint !== null) {
        if (!isAnyErrorCode(violatedConstraint)) {
          errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
          errorStatus.log(JSON.stringify(e));
        } else {
          errorStatus.add(violatedConstraint);
        }
      }
    }
  },
  {
    objParamOrder :[
      "childName",
      "dob",
      "sex",
      "Pin",          
      "doctorName",
      "doctorPhone",
      "Program",
      "parentOneName",
      "parentOneAddress",
      "parentOnePhone",
      "parentOneEmail",
      "parentTwoName",
      "parentTwoAddress",
      "parentTwoPhone",
      "parentTwoEmail"
    ] as const satisfies ReadonlyArray<keyof RegistrationData>
  }
);


export function getConstraintName(errMsg: string): string | null {
  if (!errMsg) return null;

  let match: RegExpMatchArray | null;

  // UNIQUE / DUPLICATE KEY ERRORS
  match = errMsg.match(/for key '([^']+)'/);
  if (match) return match[1].includes(".") ? match[1].split(".").pop()! : match[1];

  // CHECK CONSTRAINT ERRORS
  match = errMsg.match(/CHECK constraint '([^']+)'/);
  if (match) return match[1].includes(".") ? match[1].split(".").pop()! : match[1];

  // FOREIGN KEY ERRORS
  match = errMsg.match(/CONSTRAINT `([^`]+)` FOREIGN KEY/);
  if (match) return match[1].includes(".") ? match[1].split(".").pop()! : match[1];

  return null;
}

function isAnyErrorCode(value: string): value is AnyErrorCode {
  return value in DB_ERROR_CODES;
}