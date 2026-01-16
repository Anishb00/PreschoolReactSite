import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.ping();
    return NextResponse.json(
      {
        ok: true,
        db: "up",
        latencyMs: Date.now() - started,
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        db: "down",
        error: message,
      },
      { status: 503 }
    );
  } finally {
    conn?.release();
  }
}
