import { useEffect, useRef, useState } from "react"
import { Button } from "../../ui/button";
import { sendEmail, verifyOtp } from "../../../services/signup";

export const OtpGetter = ({detailFormView, email, controllerSignal}) => {
    
    const [otp, setOtp ] = useState<string[]>(Array(6).fill(''));
    const inputRef = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(30);

    useEffect(()=>{
        const timer = setInterval(()=>{
            setTime((time) => time - 1);
        },1000)
        
        if(time === 0 ) {
            clearInterval(timer);
        }

        return () => clearInterval(timer)
    })

    async function resendOtp() {
        const emailSent  = await sendEmail(email, controllerSignal);
            if(emailSent.success){
                alert("Otp sent")        
            } else {
                alert(emailSent.message);
            }        
    }

    const handleChange = (input : string, index:number) => {
        if(input.match(/^\d$/)) {
        const newOtp = [...otp]
        newOtp[index] = input;
        setOtp(newOtp);
        console.log(` index is ${index}`);
        if(index < 5) {
            inputRef.current[index + 1]?.focus();
        }
        }
    }

    const handleKey = (e : React.KeyboardEvent<HTMLInputElement>,index:number) => {
        console.log("han dlekeyDown");
        if (e.key === 'Backspace') {
            if (otp[index] !== '') {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                inputRef.current[index - 1]?.focus();
            }
        }
    }
    const handleOtpSubmit = () => {
        console.log(otp);
        console.log(email)
        const len = otp.filter((item) => item!=='').length;
        if(len<6){
            alert("Invalid OTP")
        } else {
            async function handleOtpVerification(){
                setLoading(true);
                const otpToSend = otp.join("");
                const res = await verifyOtp(email, otpToSend, controllerSignal);
                if(res.success) {
                    detailFormView();
                    setLoading(false);
                } else {
                    if(!res.abort)
                        alert(res.message);
                    setLoading(false);
                }
            }
            handleOtpVerification()
        }
    }

    useEffect(()=>{
        console.log(email);
    },[email]);

    return <div className="flex flex-col w-full h-full gap-y-4 justify-center p-4 items-center">
        <div className="flex flex-col basis-2/3 w-full justify-center">
        <span className="ml-1 text-xs ls:text-sm 4k:text-2xl font-semibold">Enter OTP Below : </span>
        <div className="mt-3 flex justify-around w-full h-fit">
            {otp.map( (_,index) => (
                <div className="w-6 h-8 mm:w-8 mm:h-10 4k:w-12 4k:h-14">
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKey(e,index)}
                    ref={(el) => {inputRef.current[index] = el as HTMLInputElement}}
                    className="text-xs ml:text-sm 4k:text-xl w-full h-full rounded-lg focus:outline-none text-center text-royal-blue-800  bg-slate-100 overflow-hidden focus:border-royal-blue-800 border-2"
                />
                </div>
            ))}
        </div>
        { time > 0 ? 
        <div className="ml-1 mt-4 text-xs ls:text-sm 4k:text-2xl ">
            {time}
            <div className="pointer-events-none text-royal-blue-200">Generate New OTP</div>
        </div>
            : <div className="text-royal-blue-700 text-xs ls:text-sm 4k:text-2xl  cursor-pointer ml-1 mt-4" onClick={resendOtp}>Generate New OTP</div>}
        </div>
        <div className="basis-1/3 w-full flex flex-col justify-end">
        <Button loading={loading} variant="primary" text="Verify OTP" wfull={true} onClick={handleOtpSubmit}/>
        </div>
    </div>
}