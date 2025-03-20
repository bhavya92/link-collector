import { FormProvider, useForm } from "react-hook-form";
import { CloseIcon } from "../../icons/close"
import { Button } from "../ui/button"
import { InputField } from "../ui/input"
import { useState } from "react";
import { email_validation, password_validation } from "../../utils/inputValidations";

export const LoginModal = ({open, onClose}) => {
    const methods = useForm();
    const [loading, setLoading] = useState(false);

    function handleClose(){
        methods.reset();
        onClose();
    }

    const onSubmit = methods.handleSubmit(data => {
        setLoading(true);
        console.log(data);
        setLoading(false);
    });

    return <div>
        {
            open && <FormProvider {...methods}>
                <form
                className="w-full h-full"
                onSubmit={e => e.preventDefault()}
                noValidate
                >
                <div className="w-screen h-screen flex items-center 
                            bg-slate-100/50 justify-center fixed top-0 left-0">
                    <div className="flex flex-col p-1 bg-slate-200 shadow-lg rounded-sm 4k:p-4 
                                    w-70 h-90 mm:w-70 mm:h-100 ml:w-80 ml:h-100 ls:w-90 ls:h-120 4k:w-130 4k:h-160">
                        <div className=" w-full h-fit flex justify-end">
                            <div className="w-fit h-fit p-1 cursor-pointer" onClick={handleClose}>
                                <CloseIcon/>
                            </div>    
                        </div>
                        <div className="p-4 w-full h-full flex flex-col">
                            <div className="flex flex-col basis-2/3 justify-evenly">
                                <InputField validation={email_validation} label="Email" id="lemail" inputType="email" hint="Email"/>
                                <InputField validation={password_validation} label="Password" id="lpassword" inputType="password" hint="Password"/>
                            </div>
                            <div className="flex flex-col justify-end basis-1/3">
                                <Button loading={loading} variant="primary" wfull={true} text="Login" onClick={onSubmit}/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            </FormProvider>
        }   
        </div>
}