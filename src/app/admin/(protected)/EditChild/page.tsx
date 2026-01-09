import ChildForm from "@/app/admin/components/ChildForm";
import type { RegistrationData } from "@/lib/types/Registertypes";

export default async function EditChildPage() {
  const createChild = async (formData: FormData) => {
    "use server";
    void formData;
  };

  const updateChild = async (formData: FormData) => {
    "use server";
    void formData;
  };

  const values: Partial<RegistrationData> = {};

  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Edit Child</h2>
        <p className="text-gray-600">Update an existing child record.</p>
      </header>
      <ChildForm
        values={values}
        createAction={createChild}
        updateAction={updateChild}
      />
    </>
  );
}
