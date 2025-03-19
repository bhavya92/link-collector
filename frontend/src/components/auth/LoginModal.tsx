import { CloseIcon } from "../../icons/close"
import { Button } from "../ui/button"
import { InputField } from "../ui/input"

export const LoginModal = ({open, onClose}) => {
    return <div>
        {
            open && <div className="w-screen h-screen flex items-center 
                                bg-slate-100/50 justify-center fixed top-0 left-0">
                <div className="flex flex-col p-1 bg-slate-200 shadow-lg rounded-sm w-96 h-76">
            <div className=" w-full h-fit flex justify-end">
                <div className="w-fit h-fit p-1 cursor-pointer" onClick={onClose}>
                    <CloseIcon/>
                </div>    
            </div>
            <div className="p-8 w-full h-full flex flex-col">
                <div className="flex flex-col basis-2/3 justify-evenly">
                    <InputField id="email" inputType="email" hint="Email" size="md"/>
                    <InputField id="password" inputType="password" hint="Password" size="md"/>
                </div>
                <div className="flex flex-col justify-end basis-1/3">
                    <Button variant="primary" size="md" text="Login"/>
                </div>
            </div>
            </div>
            </div>
        }   
        </div>
}