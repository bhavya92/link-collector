import { OtpGetter } from "./otp";
import { UserDetails } from "./UserDetail";
import { EmailModal } from "./emailModal";
import { CloseIcon } from "../../../icons/close";
import { useState } from "react";


export const SingupModal = ({open, onClose, otpModal, detailModal,viewOtpModal, viewDetailFormModal, signal}) => {
    const [email, setEmail] = useState('');
    return <div>
        {open && <div className="w-screen h-screen flex items-center bg-slate-100/50 justify-center fixed top-0 left-0 ">
            <div className="w-fit h-fit z-10 opacity-100">
                <div className="flex flex-col p-1 4k:p-4 bg-slate-200 shadow-lg rounded-sm w-60 h-100 mm:w-70 mm:h-100 ml:w-80 ml:h-100 ls:w-90 ls:h-120 4k:w-130 4k:h-160">
                    <div className=" w-full h-fit flex justify-end">
                        <div className="w-fit h-fit p-1 cursor-pointer" onClick={onClose}>
                            <CloseIcon/>
                        </div>    
                    </div>
                    <div className="h-full items-center justify-center">
                    { otpModal ?  <OtpGetter detailFormView={viewDetailFormModal} email = {email} controllerSignal={signal}/>
                    : detailModal ? <UserDetails email={email} controlSignal={signal}/> : <EmailModal otpView={viewOtpModal} updateEmail={setEmail} controllerSignal={signal}/>}    
                    </div>
                </div>
            </div>
        </div>}
    </div>
}