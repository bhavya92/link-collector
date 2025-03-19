import { useState } from "react"
import { Button } from "../ui/button"
import { SingupModal } from "../auth/signup/SignupModal";
import { LoginModal } from "../auth/LoginModal";

export const LandingPage = () => {
    const [signUpModalOpen, setSignupModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen ] = useState(false);
    const [ showOtpBox, setShowOtpBox ] = useState(false); 
    const [ showDetailForm, setShowDetailForm ] = useState(false);

    const controller = new AbortController();
    const signal = controller.signal;

    function openLoginModal() {
        setLoginModalOpen(true);
    }

    function closeLoginModal(){
        setLoginModalOpen(false);
    }

    function openSignupModal() {
        console.log("openSignupModal called");
        setSignupModalOpen(true);
    }

    function closeSignupModal() {
        console.log("Inside closeSignupModal");
        console.log(`signal ${signal.aborted}`);
        controller.abort();
        console.log(`signal ${signal.aborted}`);
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
            <div className="flex w-full h-fit justify-end p-8">
                <div className="flex w-80 h-fit gap-x-6">
                    <Button variant="primary" text="Login" size="md" onClick={openLoginModal}/>
                    <Button variant="secondary" text="Signup" size="md" onClick={openSignupModal}/>
                </div>
            </div>
            <SingupModal open={signUpModalOpen} onClose={closeSignupModal} otpModal={showOtpBox} detailModal={showDetailForm} viewOtpModal={handleOtpModalView} viewDetailFormModal={handleDetailModalView} signal={signal}/>
            <LoginModal open={loginModalOpen} onClose={closeLoginModal} />
    </div>
}