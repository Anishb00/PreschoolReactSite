import ChildForm from "@/app/admin/components/ChildForm";

export default async function AddChildPage() {
  const createChild = async (formData: FormData) => {
    "use server";
    void formData;
  };

  const updateChild = async (formData: FormData) => {
    "use server";
    void formData;
  };

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Add Child</h2>
        <p className="text-gray-600">Create a new child record.</p>
      </header>
      <ChildForm createAction={createChild} updateAction={updateChild} />
    </>
  );
}
