import pool from '@/lib/db';
import type {RegistrationData} from '@/lib/types/Registertypes';
import {EndpointErrorResponse} from "@/lib/EndpointErrorResponse";
import type { QueryError, RowDataPacket } from "mysql2"; // (mysql2 reuses mysql typings)
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
      await pool.execute(
      `CALL register_child_waitlist(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );
    } catch(err){
      const e = err as QueryError & { sqlMessage?: string };
      const violatedConstraint = getConstraintName(e.sqlMessage || "");
      console.log(violatedConstraint);
      if (violatedConstraint === null) {
        errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
        errorStatus.log(JSON.stringify(e));
        return;
      }
      if (!isAnyErrorCode(violatedConstraint)) {
        errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
        errorStatus.log(JSON.stringify(e));
        return;
      }
      errorStatus.add(violatedConstraint);
    }
  },
  {
    objParamOrder :[
      "childName",
      "dob",
      "sex",
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

export type WaitlistChildWithParentsRow = {
  Child_ID: number;
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
};

export async function getWaitlistChildWithParents(
  data: Pick<RegistrationData, "childName" | "dob">,
  errorStatus: EndpointErrorResponse
): Promise<WaitlistChildWithParentsRow | null> {
  try {
    const [rows] = await pool.query<RowDataPacket[][]>(
      "CALL get_waitlist_child_with_parents(?, ?)",
      [data.childName, data.dob]
    );
    const dataRows = Array.isArray(rows) ? rows[0] : [];
    return (dataRows?.[0] ?? null) as WaitlistChildWithParentsRow | null;
  } catch (err) {
    errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
    errorStatus.log(JSON.stringify(err));
    return null;
  }
}

export type AddChildFullPayload = {
  childName: string;
  dob: Date;
  sex: string;
  program: string;
  className: string | null;
  doctorName: string;
  doctorPhone: string;
  enrollDate: string | null;
  dropDate: string | null;
  fee: number | null;
  parentOneName: string;
  parentOneAddress: string;
  parentOnePhone: string;
  parentOneEmail: string;
  parentTwoName: string | null;
  parentTwoAddress: string | null;
  parentTwoPhone: string | null;
  parentTwoEmail: string | null;
};

export async function addChildWithParentsFull(
  payload: AddChildFullPayload,
  errorStatus: EndpointErrorResponse
): Promise<void> {
  const params = [
    payload.childName,
    payload.dob,
    payload.sex,
    payload.program,
    payload.className,
    payload.doctorName,
    payload.doctorPhone,
    payload.enrollDate,
    payload.dropDate,
    payload.fee,
    payload.parentOneName,
    payload.parentOneAddress,
    payload.parentOnePhone,
    payload.parentOneEmail,
    payload.parentTwoName,
    payload.parentTwoAddress,
    payload.parentTwoPhone,
    payload.parentTwoEmail,
  ];
  try {
    await pool.execute(
      "CALL add_child_with_parents_full(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      params
    );
  } catch (err) {
    const e = err as QueryError & { sqlMessage?: string };
    const violatedConstraint = getConstraintName(e.sqlMessage || "");
    if (violatedConstraint !== null) {
      if (!isAnyErrorCode(violatedConstraint)) {
        errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
        errorStatus.log(JSON.stringify(e));
      } else {
        errorStatus.add(violatedConstraint);
      }
    }
  }
}

export async function generateUniqueChildPin(
  errorStatus: EndpointErrorResponse
): Promise<string | null> {
  let connection;
  try {
    connection = await establishConnection();
    await connection.execute("CALL generate_unique_child_pin(@new_pin)");
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT @new_pin as new_pin"
    );
    const value = rows?.[0]?.new_pin;
    if (value == null) {
      errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
      return null;
    }
    return String(value);
  } catch (err) {
    errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
    errorStatus.log(JSON.stringify(err));
    return null;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export type ChildWithParentsRow = {
  Child_ID: number;
  Child_name: string;
  Sex: string;
  Program: string;
  Class: string | null;
  Doctor_name: string | null;
  Doctor_phone: string | null;
  Fee: number | null;
  Drop_date: Date | null;
  Parent1_Name: string | null;
  Parent1_Email: string | null;
  Parent2_Name: string | null;
  Parent2_Email: string | null;
};

export async function getChildrenWithParents(
  errorStatus: EndpointErrorResponse
): Promise<ChildWithParentsRow[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[][]>(
      "CALL get_children_with_parents()"
    );
    const data = Array.isArray(rows) ? rows[0] : [];
    return (data ?? []) as ChildWithParentsRow[];
  } catch (err) {
    errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
    errorStatus.log(JSON.stringify(err));
    return [];
  }
}

export async function deleteChildById(
  childId: number,
  errorStatus: EndpointErrorResponse
): Promise<void> {
  try {
    await pool.execute("CALL delete_child_by_id(?)", [childId]);
  } catch (err) {
    errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
    errorStatus.log(JSON.stringify(err));
  }
}


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
