"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function toAmount(value: string): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

type ReceiptFormProps = {
  childId: number;
  childName: string;
  parentNames: string;
  preschoolFee: string;
};

type ReceiptFields = {
  month: string;
  year: string;
  end_month: string;
  end_year: string;
  date: string;
  preschool_fee: string;
  hot_lunch: string;
  late_fee: string;
  previous_due: string;
  past_credit: string;
  recieved_amount: string;
};

export default function ReceiptForm({
  childId,
  childName,
  parentNames,
  preschoolFee,
}: ReceiptFormProps) {
  const router = useRouter();
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const yearOptions = Array.from({ length: 6 }).map((_, idx) =>
    String(new Date().getFullYear() - idx)
  );

  const [fields, setFields] = useState<ReceiptFields>(() => {
    const now = new Date();
    const defaultMonth = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(now); // e.g., "March"
    const defaultDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const defaultYear = String(now.getFullYear());
    const defaultFee = toAmount(preschoolFee);

    return {
      month: defaultMonth,
      year: defaultYear,
      end_month: "",
      end_year: "",
      date: defaultDate,
      preschool_fee: preschoolFee,
      hot_lunch: "",
      late_fee: "",
      previous_due: "",
      past_credit: "",
      recieved_amount: defaultFee ? String(defaultFee) : "",
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preschoolFeeAmount = toAmount(fields.preschool_fee);
  const hotLunchAmount = toAmount(fields.hot_lunch);
  const lateFeeAmount = toAmount(fields.late_fee);
  const previousDueAmount = toAmount(fields.previous_due);
  const pastCreditAmount = toAmount(fields.past_credit);
  const recievedAmount = toAmount(fields.recieved_amount);

  const totalBalance =
    preschoolFeeAmount + hotLunchAmount + lateFeeAmount + previousDueAmount;
  const net = totalBalance - pastCreditAmount - recievedAmount;
  const balanceDue = net > 0 ? net : 0;
  const leftoverCredit = net < 0 ? Math.abs(net) : 0;

  const handleChange = (name: keyof ReceiptFields, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const startPeriod = `${fields.month} / ${fields.year}`;
      const endMonth = fields.end_month.trim();
      const endYear = fields.end_year.trim();
      const period = endMonth && endYear ? `${startPeriod} - ${endMonth} / ${endYear}` : startPeriod;

      const response = await fetch("/api/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          ...fields,
          month: period,
        }),
      });

      if (!response.ok) {
        let message = "Unable to generate receipt.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) {
            message = data.error;
          }
        } catch {
          // ignore JSON parse failures
        }
        throw new Error(message);
      }

      const cacheBust = Date.now();
      const encodedPeriod = encodeURIComponent(period);
      router.push(`/admin/Receipt/${childId}/view?ts=${cacheBust}&period=${encodedPeriod}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to generate receipt.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Parent Names</label>
          <input
            type="text"
            value={parentNames}
            readOnly
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Child Name</label>
          <input
            type="text"
            value={childName}
            readOnly
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preschool Fee</label>
          <input
            type="text"
            value={fields.preschool_fee}
            onChange={(e) => handleChange("preschool_fee", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Month / Year</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <select
              value={fields.month}
              onChange={(e) => handleChange("month", e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={fields.year}
              onChange={(e) => handleChange("year", e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Month / Year (Optional)</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <select
              value={fields.end_month}
              onChange={(e) => handleChange("end_month", e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={fields.end_year}
              onChange={(e) => handleChange("end_year", e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="text"
            value={fields.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hot Lunch</label>
          <input
            type="text"
            value={fields.hot_lunch}
            onChange={(e) => handleChange("hot_lunch", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Late Fee</label>
          <input
            type="text"
            value={fields.late_fee}
            onChange={(e) => handleChange("late_fee", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Previous Due</label>
          <input
            type="text"
            value={fields.previous_due}
            onChange={(e) => handleChange("previous_due", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Past Credit</label>
          <input
            type="text"
            value={fields.past_credit}
            onChange={(e) => handleChange("past_credit", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Received Amount</label>
          <input
            type="text"
            value={fields.recieved_amount}
            onChange={(e) => handleChange("recieved_amount", e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Generating..." : "Generate Receipt"}
        </button>
        <button
          type="button"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Email
        </button>
      </div>
    </form>
  );
}
