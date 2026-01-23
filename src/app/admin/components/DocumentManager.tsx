"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DocFile = {
  name: string;
  size: number;
  modified: string;
};

export default function DocumentManager() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);

  const loadFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Unable to load documents.");
      }
      const data = (await res.json()) as { files: DocFile[] };
      setFiles(data.files ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load documents.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const protectedFiles = useMemo(
    () =>
      new Set([
        "emergency_roster.pdf",
        "filled_reciept.pdf",
        "reciept.pdf",
        "signin_sheet.pdf",
        "teacher_signin_sheet.pdf",
      ]),
    []
  );

  const nonDeletableFiles = useMemo(
    () =>
      new Set([
        "SSW_Enrollment_Form_TOD.pdf",
        "SSW_Enrollment_Form.pdf",
      ]),
    []
  );

  const onUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const input = fileInputRef.current;
    if (!input || !input.files || input.files.length === 0) {
      setError("Select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", input.files[0]);

    setIsUploading(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Upload failed.");
      }
      input.value = "";
      await loadFiles();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to upload file.";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const onReplace = async (file?: File | null, targetName?: string | null) => {
    const name = targetName ?? replaceTarget;
    if (!name || !file) {
      setError("Select a file to replace.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    setIsUploading(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Replace failed.");
      }
      await loadFiles();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to replace file.";
      setError(message);
    } finally {
      setIsUploading(false);
      if (replaceInputRef.current) {
        replaceInputRef.current.value = "";
      }
      setReplaceTarget(null);
    }
  };

  const onDelete = async (name: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/documents?name=${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Delete failed.");
      }
      await loadFiles();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete file.";
      setError(message);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onUpload} className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          className="block w-full max-w-xs text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-[#3B1FA8] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2d1882]"
        />
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-md bg-[#3B1FA8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d1882] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        <button
          type="button"
          onClick={loadFiles}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Refresh
        </button>
      </form>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Size (bytes)</th>
              <th className="p-3 text-left">Modified</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : files.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-600">
                  No files found.
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file.name} className="border-t border-gray-200">
                  <td className="p-3 text-gray-900">{file.name}</td>
                  <td className="p-3 text-gray-700">{file.size}</td>
                  <td className="p-3 text-gray-700">
                    {new Date(file.modified).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {protectedFiles.has(file.name) ? (
                      <span className="text-xs font-semibold text-gray-500">Protected</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplaceTarget(file.name);
                            replaceInputRef.current?.click();
                          }}
                          className="rounded-md border border-blue-600 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                        >
                          Replace
                        </button>
                        {nonDeletableFiles.has(file.name) ? (
                          <button
                            type="button"
                            disabled
                            className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-400"
                            title="This file cannot be deleted"
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onDelete(file.name)}
                            className="rounded-md border border-red-600 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <input
        ref={replaceInputRef}
        type="file"
        className="hidden"
        onChange={(e) => onReplace(e.target.files?.[0] ?? null, replaceTarget)}
      />
    </div>
  );
}
