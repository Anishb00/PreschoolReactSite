import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import { DB_ERROR_CODES } from "@/lib/errorCodes";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";

export type ParentChildWaitlistRow = {
  childId: number;
  childName: string;
  dob: Date;
  pottyTrained: boolean;
};

export async function getWaitlistChildrenForParent(
  parentId: number,
  errorStatus?: EndpointErrorResponse
): Promise<ParentChildWaitlistRow[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.Child_ID, c.Child_name, c.DOB, c.Potty_trained
       FROM Child c
       JOIN Child_Parent cp ON cp.Child_ID = c.Child_ID
       WHERE cp.Parent_ID = ? AND c.Class = 'Waitlist'`,
      [parentId]
    );
    return (rows ?? []).map((row) => ({
      childId: Number(row.Child_ID),
      childName: String(row.Child_name),
      dob: new Date(row.DOB),
      pottyTrained: Boolean(row.Potty_trained),
    }));
  } catch (err) {
    errorStatus?.add(DB_ERROR_CODES.UNKNOWN_DB_ERROR);
    errorStatus?.log(JSON.stringify(err));
    return [];
  }
}
