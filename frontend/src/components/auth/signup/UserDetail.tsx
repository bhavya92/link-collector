import { FormProvider, useForm } from "react-hook-form"
import { Button } from "../../ui/button"
import { InputField } from "../../ui/input"
import { name_validation, password_repeat_validation, password_validation } from "../../../utils/inputValidations"
import { sendUserInfo } from "../../../services/signup"
import { useState } from "react"

export const UserDetails = ({email, controlSignal} : {email:string, controlSignal : AbortSignal}) => {

    const methods = useForm();
    const [loading, setLoading] = useState(false);
    const onSubmit = methods.handleSubmit(data => {
    
        async function handleButtonSubmit() {
            const res = await sendUserInfo(data.Username, email, data.Password, controlSignal);
            setLoading(false);
            if(res.success) {
                alert("User Created succesfully")
            } else {
                if(!res.abort) {
                    alert(res.message);
                } 
            } 
        }
        setLoading(true);
        handleButtonSubmit();
    })
    return <div className="w-full h-full p-4">
        <FormProvider {...methods}>
        <form
        className="w-full h-full"
        onSubmit={e => e.preventDefault()}
        noValidate
        >
        <div className="flex flex-col w-full h-full gap-y-2">
            <InputField label="Username" id="username" inputType="text" validation={name_validation} hint="username"/>
            <InputField label="Password" id="password" validation={password_validation} inputType="password"  hint="Password"/>
            <InputField label="Confirm Password" id="cpassword" validation={password_repeat_validation(methods.getValues)} inputType="password" hint="Confirm Password"/>
            <div className="w-full h-full flex flex-col justify-end">
                <Button loading={loading} variant="primary" wfull={true} text="Signup" onClick={onSubmit}/>
            </div>
        </div>
        </form>
        
        </FormProvider>
        </div>
}