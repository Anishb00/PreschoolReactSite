"use client";

import { useEffect } from "react";

type Props = {
  fieldNames: string[];
  label?: string;
};

export default function RosterLogger({ fieldNames, label = "Document" }: Props) {
  useEffect(() => {
    const prefix = `[${label}]`;
    if (fieldNames.length === 0) {
      console.log(`${prefix} No form fields found in the PDF.`);
      return;
    }
    console.log(`${prefix} Field names in the PDF:`, fieldNames);
  }, [fieldNames, label]);

  return null;
}
