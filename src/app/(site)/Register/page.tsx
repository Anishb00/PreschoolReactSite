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
      <h2 className="mb-6 text-3xl font-bold text-[#3B1FA8]">
        Join Our Waitlist
      </h2>
      <RegisterForm serverAction = {serverAction} statusCodes={state.statusCodes} values={state.values}
      />
    </>
  )

}
