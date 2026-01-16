import ChildForm from "@/app/admin/components/ChildForm";

type AddChildPageProps = {
  searchParams?: Promise<{ status?: string }>;
};

export default async function AddChildPage({ searchParams }: AddChildPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const status = resolvedSearchParams?.status ?? "";

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Add Child</h2>
        <p className="text-gray-600">Create a new child record.</p>
      </header>
      {status && (
        <div
          className={[
            "mb-6 rounded-md border px-4 py-3 text-sm font-semibold",
            status === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : status === "invalid"
                ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                : status === "duplicate"
                  ? "border-orange-200 bg-orange-50 text-orange-700"
                  : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {status === "success" && "Child record created successfully."}
          {status === "invalid" &&
            "Some fields were invalid. Please review and submit again."}
          {status === "duplicate" &&
            "That child already exists in the database."}
          {status === "error" &&
            "Something went wrong while saving. Please try again."}
        </div>
      )}
      <ChildForm />
    </>
  );
}
