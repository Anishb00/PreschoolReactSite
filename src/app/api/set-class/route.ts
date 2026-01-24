import { NextResponse } from "next/server";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { setChildClass } from "@/lib/dbOperations";

export async function POST(request: Request) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.VIEW_DASHBOARD);
  const { childId, className } = await request.json();

  if (!Number.isFinite(childId) || typeof className !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const errorStatus = { add() {}, log() {} } as any; // lightweight stub; setChildClass expects errorStatus
  await setChildClass(Number(childId), className, errorStatus);
  return NextResponse.json({ ok: true });
}
