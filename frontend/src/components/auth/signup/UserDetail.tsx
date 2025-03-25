import { FormProvider, useForm } from "react-hook-form"
import { Button } from "../../ui/button"
import { InputField } from "../../ui/input"
import { name_validation, password_repeat_validation, password_validation } from "../../../utils/inputValidations"
import { sendUserInfo } from "../../../services/signup"
import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth"

export const UserDetails = ({email, controlSignal} : {email:string, controlSignal : AbortSignal}) => {

    const auth = useContext(AuthContext);

    if (!auth) {
        throw new Error("check is authprovider provided");
    }
    
    const { setUser } = auth;

    const methods = useForm();
    const [loading, setLoading] = useState(false);
    const onSubmit = methods.handleSubmit(data => {
    
    async function handleButtonSubmit() {
        const res = await sendUserInfo(data.username, email, data.password, controlSignal);
        setLoading(false);
        if(res.success) {
            setUser({
                "email":res.email,
                "userName":res.userName,
            });
        } else {
            if(!res.abort) {
                alert(res.message);
            } 
        } 
    }
    setLoading(true);
    handleButtonSubmit();
    });

    return <div className="w-full h-full p-4">
        <FormProvider {...methods}>
        <form
        className="w-full h-full"
        onSubmit={e => e.preventDefault()}
        noValidate
        >
        <div className="flex flex-col w-full h-full gap-y-2">
            <InputField validate={true} label="Username" id="username" inputType="text" validation={name_validation} hint="username"/>
            <InputField validate={true} label="Password" id="password" validation={password_validation} inputType="password"  hint="password"/>
            <InputField validate={true} label="Confirm Password" id="cpassword" validation={password_repeat_validation(methods.getValues)} inputType="password" hint="Confirm Password"/>
            <div className="w-full h-full flex flex-col justify-end">
                <Button loading={loading} variant="primary" wfull={true} text="Signup" onClick={onSubmit}/>
            </div>
        </div>
        </form>
        
        </FormProvider>
        </div>
}