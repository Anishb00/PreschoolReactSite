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
      `CALL register_child_waitlist(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      "pottyTrained",
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
  Potty_trained?: number | null;
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

export type ChildWithParentIds = {
  childId: number;
  className: string | null;
  parent1Id: number | null;
  parent2Id: number | null;
};

export async function getChildByNameDobWithParentIds(
  data: Pick<RegistrationData, "childName" | "dob">,
  errorStatus: EndpointErrorResponse
): Promise<ChildWithParentIds | null> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT Child_ID, Class, Parent1_ID, Parent2_ID
       FROM ChildWithParents
       WHERE Child_name = ? AND DOB = ?
       LIMIT 1`,
      [data.childName, data.dob]
    );
    const row = rows?.[0];
    if (!row) return null;
    return {
      childId: Number(row.Child_ID),
      className: row.Class as string | null,
      parent1Id: row.Parent1_ID ? Number(row.Parent1_ID) : null,
      parent2Id: row.Parent2_ID ? Number(row.Parent2_ID) : null,
    };
  } catch (err) {
    errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
    errorStatus.log(JSON.stringify(err));
    return null;
  }
}

export async function setChildClass(
  childId: number,
  className: string,
  errorStatus: EndpointErrorResponse
): Promise<void> {
  try {
    await pool.query("UPDATE Child SET Class = ? WHERE Child_ID = ?", [className, childId]);
  } catch (err) {
    errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
    errorStatus.log(JSON.stringify(err));
  }
}

export type AddChildFullPayload = {
  childName: string;
  dob: Date;
  sex: string;
  program: string;
  pottyTrained: boolean;
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
    payload.pottyTrained ? 1 : 0,
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
      "CALL add_child_with_parents_full(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
  Potty_trained?: number | null;
  Doctor_name: string | null;
  Doctor_phone: string | null;
  Fee: number | null;
  Drop_date: Date | null;
  Parent1_Name: string | null;
  Parent1_Email: string | null;
  Parent2_Name: string | null;
  Parent2_Email: string | null;
};

export type ChildWithParentsFullRow = {
  Child_ID: number;
  Child_name: string;
  DOB: Date;
  Sex: string;
  Program: string;
  Class: string | null;
  Potty_trained?: number | null;
  Doctor_name: string | null;
  Doctor_phone: string | null;
  Enroll_date: Date | null;
  Drop_date: Date | null;
  Fee: number | null;
  Parent1_ID: number | null;
  Parent1_Name: string | null;
  Parent1_Address: string | null;
  Parent1_Phone: string | null;
  Parent1_Email: string | null;
  Parent2_ID: number | null;
  Parent2_Name: string | null;
  Parent2_Address: string | null;
  Parent2_Phone: string | null;
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

export async function getChildrenWithParentsFull(
  errorStatus: EndpointErrorResponse,
  opts?: { className?: string }
): Promise<ChildWithParentsFullRow[]> {
  try {
    const filterClause = opts?.className ? "WHERE Class = ?" : "";
    const [rows] = await pool.query<RowDataPacket[]>(
      `
        SELECT
          Child_ID,
          Child_name,
          DOB,
          Sex,
          Program,
          Class,
          Doctor_name,
          Doctor_phone,
          Enroll_date,
          Drop_date,
          Fee,
          Parent1_Name,
          Parent1_Address,
          Parent1_Phone,
          Parent1_Email,
          Parent2_Name,
          Parent2_Address,
          Parent2_Phone,
          Parent2_Email
        FROM ChildWithParents
        ${filterClause}
        ORDER BY Child_name
      `,
      opts?.className ? [opts.className] : []
    );
    return (rows ?? []) as ChildWithParentsFullRow[];
  } catch (err) {
    errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
    errorStatus.log(JSON.stringify(err));
    return [];
  }
}


export async function getChildWithParentsById(
  childId: number,
  errorStatus: EndpointErrorResponse
): Promise<ChildWithParentsFullRow | null> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        Child_ID,
        Child_name,
        DOB,
        Sex,
        Program,
        Potty_trained,
        Class,
        Doctor_name,
        Doctor_phone,
        Enroll_date,
        Drop_date,
        Fee,
        Potty_trained,
        Parent1_ID,
        Parent1_Name,
        Parent1_Address,
        Parent1_Phone,
        Parent1_Email,
        Parent2_ID,
        Parent2_Name,
        Parent2_Address,
        Parent2_Phone,
        Parent2_Email
      FROM ChildWithParents
      WHERE Child_ID = ?
      LIMIT 1`,
      [childId]
    );
    return (rows?.[0] ?? null) as ChildWithParentsFullRow | null;
  } catch (err) {
    errorStatus.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
    errorStatus.log(JSON.stringify(err));
    return null;
  }
}

export type UpdateChildPayload = {
  childId: number;
  childName: string;
  dob: Date;
  sex: string;
  program: string;
  pottyTrained: boolean;
  className: string | null;
  doctorName: string;
  doctorPhone: string;
  enrollDate: string | null;
  dropDate: string | null;
  fee: number | null;
  parentOneId: number;
  parentOneName: string;
  parentOneAddress: string;
  parentOnePhone: string;
  parentOneEmail: string;
  parentTwoId: number | null;
  parentTwoName: string | null;
  parentTwoAddress: string | null;
  parentTwoPhone: string | null;
  parentTwoEmail: string | null;
};

export async function updateChildAndParents(
  payload: UpdateChildPayload,
  errorStatus: EndpointErrorResponse
): Promise<void> {
  const params = [
    payload.childId,
    payload.childName,
    payload.dob,
    payload.sex,
    payload.program,
    payload.pottyTrained ? 1 : 0,
    payload.className,
    payload.doctorName,
    payload.doctorPhone,
    payload.enrollDate,
    payload.dropDate,
    payload.fee,
    payload.parentOneId,
    payload.parentOneName,
    payload.parentOneAddress,
    payload.parentOnePhone,
    payload.parentOneEmail,
    payload.parentTwoId,
    payload.parentTwoName,
    payload.parentTwoAddress,
    payload.parentTwoPhone,
    payload.parentTwoEmail,
  ];
  try {
    await pool.execute(
      "CALL update_child_and_parents(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      params
    );
  } catch (err) {
    const e = err as QueryError & { sqlMessage?: string };
    const violatedConstraint = getConstraintName(e.sqlMessage || "");
    console.log("update_child_and_parents error:", e);
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
