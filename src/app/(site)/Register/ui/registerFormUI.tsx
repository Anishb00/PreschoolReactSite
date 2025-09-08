
import  Form  from "next/form";
import PhoneMask from "@/app/components/ui/phonenumber";
import type { RegistrationData, RegisterFormState, registerSeverAction } from "@/lib/types/Registertypes";
import APIRes from "@/lib/EndpointErrorResponse";



export default function RegisterForm({serverAction,statusCodes,values}: {serverAction: registerSeverAction, statusCodes:Set<string>,values:RegistrationData}){
  return (
    <Form action={serverAction} className="space-y-10">
      {/* Child Info */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
          Child Information
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Child's Full Name
            </label>
            <input
              type="text"
              name="childName"
              defaultValue={values.childName}
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
              defaultValue={values.dob.toISOString().split("T")[0]}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Sex
            </label>
            <select
              key={`sex-${(values.sex ?? '').toLowerCase()}`}  // forces remount when values.sex changes
              name="sex"
              defaultValue={(values.sex ?? '').toLowerCase()}
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
              Program
            </label>
            <select
              key={`program-${values.Program ?? ''}`}              // ← force remount when it changes
              name="Program"
              defaultValue={values.Program ?? ''}                  // must exactly match an option value
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            >
              <option value="">Select</option>
              <option value="2-day-full">2-Day — Full Day</option>
              <option value="2-day-half">2-Day — Half Day</option>
              <option value="3-day-full">3-Day — Full Day</option>
              <option value="3-day-half">3-Day — Half Day</option>
              <option value="5-day-full">5-Day — Full Day</option>
              <option value="5-day-half">5-Day — Half Day</option>
            </select>
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
              Doctor's Full Name
            </label>
            <input
              type="text"
              name="doctorName"
              defaultValue={values.doctorName}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
          <div>
            <PhoneMask
              name="doctorPhone"
              errorCode = "DOC_PHONE_INVALID"
              label = "Doctor's Phone"
              statusCodes = {statusCodes}
            />

          </div>
        </div>
      </div>

      {/* Parent 1 Info */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#3B1FA8]">
          Parent 1 <span className="font-light text-red-600">(Required)</span>
          <span className="block text-base font-normal text-gray-600 mt-1">
            (This email will be used for billing and registration forms)
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
                defaultValue={values.parentOneName}
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
                defaultValue={values.parentOneAddress}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
              />
            </div>
            <div>
              <PhoneMask
                name="parentOnePhone"
                errorCode = "P1_PHONE_INVALID"
                label = "Phone Number"
                statusCodes = {statusCodes}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                <span>Email Address</span>
                { statusCodes.has("P1_EMAIL_INVALID") && (
                  <span className="mt-1 ml-2 text-sm text-red-600">Invalid</span>
                )}
              </label>
              <input
                type="email"
                name="parentOneEmail"
                defaultValue={values.parentOneEmail}
                aria-invalid={statusCodes.has("P1_EMAIL_INVALID")}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] 
                focus:outline-none aria-[invalid=true]:border-red-500 
                aria-[invalid=true]:ring-1 
                aria-[invalid=true]:ring-red-500 
                focus:aria-[invalid=true]:ring-red-600"
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
              defaultValue={values.parentTwoName ?? ""}
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
              defaultValue = {values.parentTwoAddress ?? ""}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#3B1FA8] focus:outline-none"
            />
          </div>
          <div>
              <PhoneMask
                name="parentTwoPhone"
                errorCode = "P2_PHONE_INVALID"
                label = "Phone Number"
                statusCodes = {statusCodes}
              />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              <span>Email Address</span>
              { statusCodes.has("P2_EMAIL_INVALID") && (
                <span className="mt-1 ml-2 text-sm text-red-600">Invalid</span>
              )}
            </label>
            <input
              type="email"
              name="parentTwoEmail"
              defaultValue={values.parentTwoEmail ?? ""}
              aria-invalid={statusCodes.has("P2_EMAIL_INVALID")}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 
              focus:ring-[#3B1FA8] focus:outline-none
              aria-[invalid=true]:border-red-500 
              aria-[invalid=true]:ring-1 
              aria-[invalid=true]:ring-red-500 
              focus:aria-[invalid=true]:ring-red-600"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="rounded-md bg-[#3B1FA8] px-6 py-3 font-semibold text-white transition hover:bg-[#2d1882]"
        >
          Submit Application
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
  )


}