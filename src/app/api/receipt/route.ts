import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";
import { authorizeUser } from "@/lib/authentication";
import { MIN_ASSET_ROLE_ACCESS } from "@/lib/protectedassets";
import { EndpointErrorResponse } from "@/lib/EndpointErrorResponse";
import { getChildWithParentsById } from "@/lib/dbOperations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReceiptBody = {
  childId?: number;
  month?: string;
  date?: string;
  preschool_fee?: string;
  hot_lunch?: string;
  late_fee?: string;
  previous_due?: string;
  past_credit?: string;
  recieved_amount?: string;
};

const TEMPLATE_PATH = path.join(process.cwd(), "documents", "reciept.pdf");
const OUTPUT_PATH = path.join(process.cwd(), "documents", "filled_reciept.pdf");

function sanitize(value: unknown): string {
  return String(value ?? "").trim();
}

function toAmount(value: unknown): number {
  const num = Number(sanitize(value));
  return Number.isFinite(num) ? num : 0;
}

function setTextField(form: ReturnType<PDFDocument["getForm"]>, name: string, value: string) {
  try {
    form.getTextField(name).setText(value);
  } catch (err) {
    throw new Error(`reciept.pdf is missing the "${name}" form field.`);
  }
}

export async function POST(req: NextRequest) {
  await authorizeUser(MIN_ASSET_ROLE_ACCESS.GENERATE_RECIEPTS);

  let body: ReceiptBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const childId = Number(body.childId);
  if (!Number.isFinite(childId)) {
    return NextResponse.json({ error: "childId is required." }, { status: 400 });
  }

  const errorStatus = new EndpointErrorResponse();
  const childRow = await getChildWithParentsById(childId, errorStatus);
  if (errorStatus.uncaughtErrors.size > 0) {
    return NextResponse.json({ error: "Unable to load child data." }, { status: 500 });
  }
  if (!childRow) {
    return NextResponse.json({ error: "Child not found." }, { status: 404 });
  }

  const parentNames = [childRow.Parent1_Name, childRow.Parent2_Name].filter(Boolean).join(" & ");
  const childName = childRow.Child_name ?? "";
  const providedFee = sanitize(body.preschool_fee);
  const dbFee = childRow.Fee != null ? Number(childRow.Fee) : 0;
  const preschoolFeeValue = providedFee !== "" ? toAmount(providedFee) : dbFee;
  const preschoolFee = String(preschoolFeeValue);
  const today = new Date().toISOString().split("T")[0];
  const providedDate = sanitize(body.date);
  const dateToUse = providedDate || today;

  const hotLunch = toAmount(body.hot_lunch);
  const lateFee = toAmount(body.late_fee);
  const previousDue = toAmount(body.previous_due);
  const pastCredit = toAmount(body.past_credit);
  const recievedAmount = toAmount(body.recieved_amount);

  const totalBalance = preschoolFeeValue + hotLunch + lateFee + previousDue;
  const net = totalBalance - pastCredit - recievedAmount;
  const balanceDue = net > 0 ? net : 0;
  const leftoverCredit = net < 0 ? Math.abs(net) : 0;

  const fields = {
    parent_names: parentNames,
    child_name: childName,
    preschool_fee: preschoolFee,
    month: sanitize(body.month),
    hot_lunch: String(hotLunch),
    late_fee: String(lateFee),
    previous_due: String(previousDue),
    total_balance: String(totalBalance),
    past_credit: String(pastCredit),
    recieved_amount: String(recievedAmount),
    balance_due: String(balanceDue),
    leftover_credit: String(leftoverCredit),
    date: dateToUse,
  };

  let templateBytes: Uint8Array;
  try {
    templateBytes = await readFile(TEMPLATE_PATH);
  } catch {
    return NextResponse.json(
      { error: "reciept.pdf could not be read from the server." },
      { status: 500 }
    );
  }

  try {
    const doc = await PDFDocument.load(templateBytes);
    const form = doc.getForm();

    Object.entries(fields).forEach(([name, value]) => {
      setTextField(form, name, value);
    });

    form.flatten();

    const pdfBytes = await doc.save();
    await writeFile(OUTPUT_PATH, pdfBytes);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="filled_reciept.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to generate receipt PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
