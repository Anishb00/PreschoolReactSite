import Form from "next/form";
import { createChild, updateChild } from "@/app/admin/actions/childActions";
import PhoneMask from "@/app/components/ui/phonenumber";
import type { RegistrationData } from "@/lib/types/Registertypes";

type ChildFormProps = {
  values?: Partial<
    RegistrationData & {
      childClass?: string;
      fee?: number | null;
      enrollDate?: string | Date | null;
      dropDate?: string | Date | null;
      childId?: number;
      parentOneId?: number;
      parentTwoId?: number | null;
    }
  >;
  statusCodes?: Set<string>;
};

export default function ChildForm({
  values,
  statusCodes = new Set<string>(),
}: ChildFormProps) {
  const isEdit = Boolean(values);
  const dobValue = values?.dob ? values.dob.toISOString().split("T")[0] : "";
  const sexValue = values?.sex ?? "";
  const programValue = values?.Program ?? "";
  const classValue = values?.childClass ?? "";
  const pottyTrainedValue = values?.pottyTrained ?? false;
  const checkoutTimeValue = (() => {
    const v = values?.checkoutTime;
    if (typeof v === "string") return v;
    return "";
  })();
  const feeValue =
    values?.fee === null || values?.fee === undefined ? "" : values?.fee;
  const enrollDateValue =
    values?.enrollDate instanceof Date
      ? values.enrollDate.toISOString().split("T")[0]
      : values?.enrollDate ?? "";
  const dropDateValue =
    values?.dropDate instanceof Date
      ? values.dropDate.toISOString().split("T")[0]
      : values?.dropDate ?? "";

  return (
    <Form action={isEdit ? updateChild : createChild} className="space-y-10">
      {isEdit && (
        <>
          <input type="hidden" name="childId" value={values?.childId ?? ""} />
          <input
            type="hidden"
            name="parentOneId"
            value={values?.parentOneId ?? ""}
          />
          <input
            type="hidden"
            name="parentTwoId"
            value={values?.parentTwoId ?? ""}
          />
        </>
      )}
      {/* Child Info */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
          Child Information
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Child&apos;s Full Name
            </label>
            <input
              type="text"
              name="childName"
              defaultValue={values?.childName ?? ""}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              defaultValue={dobValue}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Sex
            </label>
            <select
              key={`sex-${(sexValue ?? "").toLowerCase()}`}
              name="sex"
              defaultValue={sexValue}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            >
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Checkout Time
            </label>
            <input
              type="time"
              name="checkoutTime"
              defaultValue={checkoutTimeValue}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Program
            </label>
            <select
              key={`program-${programValue ?? ""}`}
              name="Program"
              defaultValue={programValue}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            >
              <option value="">Select</option>
              <option value="Full Time 5 days">Full Time 5 days</option>
              <option value="Full Time 4 days">Full Time 4 days</option>
              <option value="Full Time 3 days">Full Time 3 days</option>
              <option value="Full Time 2 days">Full Time 2 days</option>
              <option value="Full Time 1 day">Full Time 1 day</option>
              <option value="Half Time 5 days">Half Time 5 days</option>
              <option value="Half Time 4 days">Half Time 4 days</option>
              <option value="Half Time 3 days">Half Time 3 days</option>
              <option value="Half Time 2 days">Half Time 2 days</option>
              <option value="Half Time 1 day">Half Time 1 day</option>
              <option value="TBD">TBD</option>
            </select>
          </div>
          <div>
            <span className="block text-sm font-semibold text-gray-700">
              Potty Trained
            </span>
            <div className="mt-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="pottyTrained"
                  value="yes"
                  defaultChecked={pottyTrainedValue === true}
                  required
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="pottyTrained"
                  value="no"
                  defaultChecked={pottyTrainedValue === false}
                  required
                />
                No
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Info */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
          Medical Information
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Doctor&apos;s Full Name
            </label>
            <input
              type="text"
              name="doctorName"
              defaultValue={values?.doctorName ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
          <div>
            <PhoneMask
              name="doctorPhone"
              errorCode="DOC_PHONE_INVALID"
              label="Doctor's Phone"
              statusCodes={statusCodes}
              defaultValueRaw={values?.doctorPhone ?? ""}
            />
          </div>
        </div>
      </div>

      {/* Parent 1 Info */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
          Parent 1 <span className="font-light text-red-600">(Required)</span>
          <span className="block text-base font-normal text-gray-600 mt-1">
            (This email will be used for billing)
          </span>
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="parentOneName"
              defaultValue={values?.parentOneName ?? ""}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="parentOneAddress"
              defaultValue={values?.parentOneAddress ?? ""}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
          <div>
            <PhoneMask
              name="parentOnePhone"
              errorCode="P1_PHONE_INVALID"
              label="Phone Number"
              statusCodes={statusCodes}
              defaultValueRaw={values?.parentOnePhone ?? ""}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              <span>Email Address</span>
              {statusCodes.has("P1_EMAIL_INVALID") && (
                <span className="mt-1 ml-2 text-sm text-red-600">Invalid</span>
              )}
            </label>
            <input
              type="email"
              name="parentOneEmail"
              defaultValue={values?.parentOneEmail ?? ""}
              aria-invalid={statusCodes.has("P1_EMAIL_INVALID")}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 focus:aria-[invalid=true]:ring-red-600"
            />
          </div>
        </div>
      </div>

      {/* Parent 2 Info */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
          Parent 2 <span className="font-light text-blue-600">(Optional)</span>
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="parentTwoName"
              defaultValue={values?.parentTwoName ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="parentTwoAddress"
              defaultValue={values?.parentTwoAddress ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
          <div>
            <PhoneMask
              name="parentTwoPhone"
              errorCode="P2_PHONE_INVALID"
              label="Phone Number"
              statusCodes={statusCodes}
              defaultValueRaw={values?.parentTwoPhone ?? ""}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              <span>Email Address</span>
              {statusCodes.has("P2_EMAIL_INVALID") && (
                <span className="mt-1 ml-2 text-sm text-red-600">Invalid</span>
              )}
            </label>
            <input
              type="email"
              name="parentTwoEmail"
              defaultValue={values?.parentTwoEmail ?? ""}
              aria-invalid={statusCodes.has("P2_EMAIL_INVALID")}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 focus:aria-[invalid=true]:ring-red-600"
            />
          </div>
        </div>
      </div>

      {/* Enrollment Details */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
          Enrollment Details
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Class <span className="font-light text-red-600">(Required)</span>
            </label>
            <select
              key={`class-${classValue ?? ""}`}
              name="childClass"
              defaultValue={classValue}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            >
              <option value="">Select</option>
              <option value="Waitlist">Waitlist</option>
              <option value="Pre-Register">Pre-Register</option>
              <option value="Registered">Registered</option>
              <option value="Caterpillar">Caterpillar</option>
              <option value="Chrysalis">Chrysalis</option>
              <option value="Butterfly">Butterfly</option>
              <option value="Sunshine">Sunshine</option>
              <option value="Rainbow">Rainbow</option>
              <option value="Dismissed">Dismissed</option>
              <option value="Test">Test</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Fee
            </label>
            <input
              type="number"
              name="fee"
              defaultValue={feeValue}
              min="0"
              step="1"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Enroll Date
            </label>
            <input
              type="date"
              name="enrollDate"
              defaultValue={enrollDateValue}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Drop Date
            </label>
            <input
              type="date"
              name="dropDate"
              defaultValue={dropDateValue}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="rounded-md bg-[#3B1FA8] px-6 py-3 font-semibold text-white transition hover:bg-[#2d1882]"
        >
          {isEdit ? "Save Changes" : "Submit Application"}
        </button>
        {statusCodes.size > 0 && (
          <span
            id="form-error-note"
            role="alert"
            aria-live="polite"
            className="text-sm text-red-600 ml-3"
          >
            Please correct the highlighted fields.
          </span>
        )}
      </div>
    </Form>
  );
}
