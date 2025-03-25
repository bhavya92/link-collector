import { useState } from "react"
import { Button } from "../ui/button"
import { SingupModal } from "../auth/signup/SignupModal";
import { LoginModal } from "../auth/LoginModal";

export const LandingPage = () => {
    const [ signUpModalOpen, setSignupModalOpen ] = useState(false);
    const [ loginModalOpen, setLoginModalOpen ] = useState(false);
    const [ showOtpBox, setShowOtpBox ] = useState(false); 
    const [ showDetailForm, setShowDetailForm ] = useState(false);

    const controller = new AbortController();
    const signal = controller.signal;

    function openLoginModal() {
        setLoginModalOpen(true);
    }

    function closeLoginModal(){
        controller.abort();
        setLoginModalOpen(false);
    }

    function openSignupModal() {
        setSignupModalOpen(true);
    }

    function closeSignupModal() {
        controller.abort();
        setSignupModalOpen(false);
        setShowOtpBox(false);
        setShowDetailForm(false);
    }

    function handleOtpModalView(){
        setShowOtpBox(true);
    }

    function handleDetailModalView(){
        setShowOtpBox(false);
        setShowDetailForm(true);
    }

    return <div className="w-screen h-screen bg-slate-50">
            <div className="flex w-full h-fit p-4 tb:p-6 ls:p-8 ll:p-10 4k:p-16 justify-between ml:justify-end ml:gap-x-2">
                    <Button variant="primary" text="Login" onClick={openLoginModal}/>
                    <Button variant="secondary" text="Signup" onClick={openSignupModal}/>
            </div>
            <SingupModal open={signUpModalOpen} onClose={closeSignupModal} otpModal={showOtpBox} detailModal={showDetailForm} viewOtpModal={handleOtpModalView} viewDetailFormModal={handleDetailModalView} signal={signal}/>
            <LoginModal open={loginModalOpen} onClose={closeLoginModal} signal={signal} />
    </div>
}