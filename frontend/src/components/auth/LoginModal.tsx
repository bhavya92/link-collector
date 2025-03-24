import { FormProvider, useForm } from "react-hook-form";
import { CloseIcon } from "../../icons/close"
import { Button } from "../ui/button"
import { InputField } from "../ui/input"
import { useState } from "react";
import { email_validation, password_validation, userId_validation } from "../../utils/inputValidations";
import { loginUser } from "../../services/login";

export const LoginModal = ({open, onClose, signal}) => {
    const methods = useForm();
    const [loading, setLoading] = useState(false);

    function handleClose(){
        methods.reset();
        onClose();
    }

    const onSubmit = methods.handleSubmit(data => {
        console.log({data})
        async function handleLoginButton(){
            const res = await loginUser(data.luniqueId, data.lpassword, signal);
            setLoading(false);
            if(res.success) {
                methods.reset();
                alert(res.message);
            } else {
                if(!res.abort) {
                    alert(res.message);
                }
            }
        }
        setLoading(true);
        handleLoginButton();
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
                                <InputField validate={true} validation={userId_validation} label="Username/Email" id="luniqueId" inputType="text" hint="Username or Email"/>
                                <InputField validate={true} validation={password_validation} label="Password" id="lpassword" inputType="password" hint="Password"/>
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