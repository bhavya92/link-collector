import { AnimatePresence, motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { ErrorIcon } from "../../icons/error";
import { findInputErrors } from "../../utils/findInputError";
import { isFormInvalid } from "../../utils/isFormValid";

interface InputFieldProps {
    inputType : "email" | "number" | "text" | "password" ;
    hint?: string;
    id: string;
    label: string;
    validation?: object;
    validate : boolean;
    onChange? : () => void
}

const defaultStyles = "text-xs ls:text-sm 4k:text-2xl px-3 py-2 w-full h-min rounded-sm border-2 border-royal-blue-400 text-slate-800 shadow-md focus:border-royal-blue-600 focus:outline-none bg-white";
export const InputField = (props : InputFieldProps) => {
   
    const { register,formState: {errors} } = useFormContext(); 
    const inputError = findInputErrors(errors,props.id);
    const isInvalid = isFormInvalid(inputError);
  
    return <>
    {props.validate ? <div className="flex gap-y-2 flex-col">
      <label htmlFor={props.id} className="text-xs ls:text-sm 4k:text-2xl font-semibold">
          {props.label + ":"}
      </label>
      <AnimatePresence mode="wait" initial={false}>
        {isInvalid && (
          <InputError
            message={inputError.error?.message || ""}
            key={inputError.error?.message || "default-key"}
          />
        )}
      </AnimatePresence>
      <input   type={`${props.inputType}`} 
      id={`${props.id}`}
      className={`${defaultStyles}`} 
      placeholder={`${props.hint ? props.hint : ''}`}
      {...register(props.id,props.validation)}
      /> 
  </div>: <input type={`${props.inputType}`} 
      id={`${props.id}`}
      className={`${defaultStyles}`} 
      placeholder={`${props.hint ? props.hint : ''}`}/>}
  </>
}

const InputError = ({message} : {message:string}) => {
    return (
        <motion.p
          className="flex items-center gap-1 p-1 text-xs ls:text-sm 4k:text-2xl font-semibold text-red-500 bg-red-100 rounded-md"
          {...framerError}
        >
            <ErrorIcon/>
          {message}
        </motion.p>
      )
}

const framerError = {
    initial: {opacity:0, y:10},
    animate: {opacity:1, y:0},
    exit: {opacity:0, y:10},
    transition:{duration:0.2},
}