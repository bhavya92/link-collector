import { FormProvider, useForm } from "react-hook-form"
import { Button } from "../../ui/button"
import { InputField } from "../../ui/input"
import { email_validation } from "../../../utils/inputValidations"
import { sendEmail } from "../../../services/signup"
import { useState } from "react"
export const EmailModal = ({otpView, updateEmail, controllerSignal}) => {
    
    const methods = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = methods.handleSubmit(data => {
        async function handleButtonSubmit(){
            const emailSent  = await sendEmail(data.Email, controllerSignal);
            if(emailSent.success){
                updateEmail(data.Email);
                setLoading(false);
                otpView();
            } else {
                if(!emailSent.abort) {
                    alert(emailSent.message);
                    setLoading(false);
                }
            }
        }
        setLoading(true);
        handleButtonSubmit();
    })

    return <div className="h-full w-full">
        {otpView && <FormProvider {...methods}>
        <div className="h-full w-full flex flex-col p-4">
            <form
            className="w-full h-full"
            onSubmit={e => e.preventDefault()}
            noValidate
            >    
            <div className="flex flex-col w-full h-full">
                <div className="w-full basis-1/2 flex flex-col justify-end">
                    <InputField validation={email_validation} label="Email" id="email" inputType="email" size="md" hint="Email"/>
                </div>  
                <div className="w-full basis-1/2 flex flex-col justify-end">
                    <Button loading={loading} variant="primary" size="md" text="Next" onClick={onSubmit}/>
                </div>
            </div>
            </form>
        </div>
            </FormProvider>}
        </div>
}