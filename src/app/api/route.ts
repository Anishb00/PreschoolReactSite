
import { NextResponse } from "next/server";

// Basic health endpoint for /api. Extend or replace as needed.
export async function GET() {
  return NextResponse.json({ ok: true });
}
