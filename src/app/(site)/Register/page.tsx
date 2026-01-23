'use client'
import { useActionState } from 'react';
import registerChild from '@/lib/actions/registerChild';
import type { RegisterFormState, RegistrationData, RegisterPageRenderCondition} from '@/lib/types/Registertypes'
import RegisterForm from '@/app/(site)/Register/ui/registerFormUI';


export default function RegisterPage() {
  const EMPTY_REGISTRATION_DRAFT: RegistrationData = {
    childName: '',
    dob: new Date(),
    sex: '',
    Program: "",

    parentOneName: '',
    parentOneAddress: '',
    parentOnePhone: '',
    parentOneEmail: '',

    parentTwoName: null,
    parentTwoAddress: null,
    parentTwoPhone: null,
    parentTwoEmail: null,

    doctorName: '',
    doctorPhone: '',
    pottyTrained: false,
  };
  const initialPage: RegisterPageRenderCondition = "SUCCESS";
  const initialstate: RegisterFormState = {  statusCodes: new Set(),values: EMPTY_REGISTRATION_DRAFT}
  const [state, serverAction, pending] = useActionState(registerChild, initialstate);



  return(
    <>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold text-[#3B1FA8]">Join Our Waitlist</h2>
        <a
          href="/verify-email/resend"
          className="inline-flex items-center gap-2 rounded-md border border-[#3B1FA8] px-4 py-2 text-sm font-semibold text-[#3B1FA8] transition hover:bg-[#3B1FA8] hover:text-white"
        >
          Need another verification email?
        </a>
      </div>
      <RegisterForm serverAction = {serverAction} statusCodes={state.statusCodes} values={state.values}
      />
    </>
  )

}
