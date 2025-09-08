'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  /** Optional initial 10 digits */
  defaultValueRaw?: string;
  /** Callback with raw digits whenever they change */
  onRawChange?: (raw: string) => void;
  /** Force +1 prefix to show immediately (default: true) */
  alwaysShowPrefix?: boolean;

  errorCode: string;

  label:string;

  statusCodes: Set<string>;
};

const PREFIX = "+1 ";
const MASK = "(###) ###-####";
const PLACEHOLDER_CHAR = "_";

/** Build "(###) ###-####" with underscores for unfilled slots */
function formatMask(rawDigits: string) {
  const ds = (rawDigits.match(/\d/g) || []).join("").slice(0, 10);
  let di = 0;
  let out = "";
  for (const ch of MASK) out += ch === "#" ? (ds[di++] ?? PLACEHOLDER_CHAR) : ch;
  return out;
}

/** Normalize arbitrary text to 10 US digits, allowing an optional leading '1'. */
function normalizeToTen(text: string) {
  const ds = (text.match(/\d/g) || []).join("");
  if (ds.length === 11 && ds.startsWith("1")) return ds.slice(1);
  return ds.slice(0, 10);
}

/** Find indices of '#' (editable slots) in a given full mask string */
function getSlotIndices(mask: string): number[] {
  const arr: number[] = [];
  for (let i = 0; i < mask.length; i++) if (mask[i] === "#") arr.push(i);
  return arr;
}

export default function PhoneMask({
  defaultValueRaw = "",
  onRawChange,
  className = "",
  name,
  autoComplete = "tel",
  errorCode,
  statusCodes,
  label,
  alwaysShowPrefix = true, // 👈 show +1 immediately
  ...rest
}: Props) {
  const [raw, setRaw] = useState<string>(normalizeToTen(defaultValueRaw));
  const showPrefix = true === alwaysShowPrefix; // fixed to always show +1

  const fullMask = useMemo(() => PREFIX + MASK, []);
  const slotIndexes = useMemo(() => getSlotIndices(fullMask), []);
  const display = useMemo(
    () => PREFIX + formatMask(raw),
    [raw]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onRawChange?.(raw);
  }, [raw, onRawChange]);

  /** Typing (and autofill): rebuild raw from the whole display string */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.startsWith(PREFIX)
      ? e.target.value.slice(PREFIX.length)
      : e.target.value;
    setRaw(normalizeToTen(text));
  };

  /** Backspace/Delete behavior:
   * - Backspace: remove the LAST typed digit (ignores underscores), caret jumps to that slot.
   * - Delete: remove the next typed digit at/after caret (ignores underscores).
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const hasSel = start !== end;

    // If there is a selection, delete all digits whose slots fall inside it.
    if ((e.key === "Backspace" || e.key === "Delete") && hasSel) {
      e.preventDefault();
      const toRemoveIdx: number[] = [];
      for (let i = 0; i < slotIndexes.length; i++) {
        const si = slotIndexes[i];
        if (si >= start && si < end && i < raw.length) toRemoveIdx.push(i);
      }
      if (toRemoveIdx.length) {
        const removeSet = new Set(toRemoveIdx);
        const kept = raw.split("").filter((_, idx) => !removeSet.has(idx)).join("");
        setRaw(kept);
      }
      // place caret at start of selection after delete
      requestAnimationFrame(() => el.setSelectionRange(start, start));
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (!raw.length) return;

      // Always delete the last **filled** digit (not underscores)
      const lastDigitIdx = raw.length - 1;
      const newRaw = raw.slice(0, lastDigitIdx);
      setRaw(newRaw);

      // Move caret to that digit's slot (or stay at end if none)
      const slotPos = slotIndexes[lastDigitIdx] ?? slotIndexes[0];
      requestAnimationFrame(() => el.setSelectionRange(slotPos, slotPos));
      return;
    }

    if (e.key === "Delete") {
      e.preventDefault();
      if (!raw.length) return;

      // Find first digit index whose slot is >= caret position
      let firstIdxAtOrAfter = -1;
      for (let i = 0; i < raw.length; i++) {
        if (slotIndexes[i] >= start) {
          firstIdxAtOrAfter = i;
          break;
        }
      }
      if (firstIdxAtOrAfter === -1) {
        // caret is past all filled digits; nothing to delete
        requestAnimationFrame(() => el.setSelectionRange(start, start));
        return;
      }

      const newRaw =
        raw.slice(0, firstIdxAtOrAfter) + raw.slice(firstIdxAtOrAfter + 1);
      setRaw(newRaw);

      // keep caret where it was
      requestAnimationFrame(() => el.setSelectionRange(start, start));
      return;
    }
  };

  /** Paste: accept with or without +1; append to the end (simple & robust) */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text") || "";
    setRaw((prev) => normalizeToTen(prev + pasted));
  };

  return (
    <>
    <label className="block text-sm font-semibold text-gray-700">
      <span>{label}</span>
      { statusCodes.has(errorCode) && (
        <span className="mt-1 ml-2 text-sm text-red-600">Invalid</span>
      )}
    </label>
    <input
      {...rest}
      ref={inputRef}
      type="tel"
      name={name}
      value={display}                           // e.g. "+1 (415) 55_-____"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      inputMode="numeric"
      autoComplete="tel"
      aria-label="Phone number"
      aria-invalid={statusCodes.has(errorCode)}
      className={`tracking-widest mt-1 w-full rounded-md border border-gray-300 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-[#3B1FA8]
                aria-[invalid=true]:border-red-500
                aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500
                focus:aria-[invalid=true]:ring-red-600`}
      placeholder={showPrefix ? "" : "+1 (___) ___-____"}
    />
    </>
  );
}
