import crypto from "crypto";
import pool from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";

const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const DAILY_LIMIT = 3;

type IssueResult =
  | { token: string; expiresAt: Date }
  | { error: "cooldown" | "daily_limit" };

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function now() {
  return new Date();
}

function addMs(date: Date, ms: number) {
  return new Date(date.getTime() + ms);
}

export async function issueVerificationTokenForParent(
  parentId: number
): Promise<IssueResult> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      "SELECT * FROM email_verifications WHERE Parent_ID = ? FOR UPDATE",
      [parentId]
    );
    const existing = Array.isArray(rows) ? (rows as any[])[0] : undefined;
    const current = now();
    const expiresAt = addMs(current, EXPIRY_MS);
    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = hashToken(token);

    if (!existing) {
      await connection.query(
        `INSERT INTO email_verifications
          (Parent_ID, Token_Hash, Expires_At, Last_Sent_At, Daily_Count, Daily_Window_Start)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [parentId, tokenHash, expiresAt, current, 1, current]
      );
      await connection.commit();
      return { token, expiresAt };
    }

    let dailyWindowStart = new Date(existing.Daily_Window_Start);
    let dailyCount = Number(existing.Daily_Count ?? 0);
    if (current.getTime() - dailyWindowStart.getTime() > 24 * 60 * 60 * 1000) {
      dailyCount = 0;
      dailyWindowStart = current;
    }
    if (dailyCount >= DAILY_LIMIT) {
      await connection.rollback();
      return { error: "daily_limit" };
    }

    const lastSentAt = new Date(existing.Last_Sent_At);
    if (current.getTime() - lastSentAt.getTime() < COOLDOWN_MS) {
      await connection.rollback();
      return { error: "cooldown" };
    }

    dailyCount += 1;
    await connection.query(
      `UPDATE email_verifications
       SET Token_Hash = ?, Expires_At = ?, Last_Sent_At = ?, Daily_Count = ?, Daily_Window_Start = ?
       WHERE Parent_ID = ?`,
      [tokenHash, expiresAt, current, dailyCount, dailyWindowStart, parentId]
    );
    await connection.commit();
    return { token, expiresAt };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function verifyEmailToken(token: string) {
  const hashed = hashToken(token);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      `SELECT ev.Parent_ID
       FROM email_verifications ev
       WHERE ev.Token_Hash = ? AND ev.Expires_At > NOW()
       FOR UPDATE`,
      [hashed]
    );
    const match = Array.isArray(rows) ? (rows as any[])[0] : undefined;
    if (!match) {
      await connection.rollback();
      return { status: "invalid" as const };
    }
    const parentId = Number(match.Parent_ID);

    await connection.query(`UPDATE Parent SET Email_verified = TRUE WHERE Parent_ID = ?`, [parentId]);
    await connection.query(`DELETE FROM email_verifications WHERE Parent_ID = ?`, [parentId]);

    const [childRows] = await connection.query(
      `SELECT c.Child_ID, c.Class
       FROM Child c
       JOIN Child_Parent cp ON cp.Child_ID = c.Child_ID
       WHERE cp.Parent_ID = ?`,
      [parentId]
    );
    const children = Array.isArray(childRows) ? (childRows as any[]) : [];
    for (const child of children) {
      if (child.Class === "Pre-Register") {
        const [countRows] = await connection.query(
          `SELECT COUNT(*) as verifiedCount
           FROM Child_Parent cp
           JOIN Parent p ON p.Parent_ID = cp.Parent_ID
           WHERE cp.Child_ID = ? AND p.Email_verified = TRUE`,
          [child.Child_ID]
        );
        const verifiedCount = Number((countRows as any[])?.[0]?.verifiedCount ?? 0);
        if (verifiedCount > 0) {
          await connection.query(
            `UPDATE Child SET Class = 'Waitlist' WHERE Child_ID = ?`,
            [child.Child_ID]
          );
        }
      }
    }

    await connection.commit();
    return { status: "verified" as const };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function sendVerificationForParent({
  parentId,
  parentEmail,
  childName,
}: {
  parentId: number;
  parentEmail: string | null;
  childName: string;
}) {
  if (!parentEmail) return;
  const issue = await issueVerificationTokenForParent(parentId);
  if ("error" in issue) {
    return issue; // caller can decide what to do with cooldown/daily_limit
  }
  await sendVerificationEmail({
    toEmail: parentEmail,
    childName,
    token: issue.token,
  });
  return { status: "sent" as const };
}

export async function resendVerificationByEmail(email: string, childName?: string) {
  const [rows] = await pool.query(
    `SELECT DISTINCT p.Parent_ID, p.Email_verified, c.Child_name
     FROM Parent p
     LEFT JOIN Child_Parent cp ON cp.Parent_ID = p.Parent_ID
     LEFT JOIN Child c ON c.Child_ID = cp.Child_ID
     WHERE p.Email = ?
     ${childName ? "AND c.Child_name = ?" : ""}
     LIMIT 2`,
    childName ? [email, childName] : [email]
  );
  const parents = Array.isArray(rows) ? (rows as any[]) : [];
  if (parents.length === 0) return { status: "not_found" as const };
  if (parents.length > 1) return { status: "ambiguous" as const };

  const parent = parents[0];
  if (parent.Email_verified) return { status: "already_verified" as const };

  const issue = await issueVerificationTokenForParent(Number(parent.Parent_ID));
  if ("error" in issue) return { status: issue.error };

  await sendVerificationEmail({
    toEmail: email,
    childName: childName || parent.Child_name || "your child",
    token: issue.token,
  });
  return { status: "sent" as const };
}
