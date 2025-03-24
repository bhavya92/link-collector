import { FormProvider, useForm } from "react-hook-form"
import { CloseIcon } from "../../icons/close"
import { PlusIcon } from "../../icons/plus"
import { Button } from "../ui/button"
import { InputField } from "../ui/input"
import { Tag } from "../ui/tag"
import { useRef, useState } from "react"

export const ContentModal = ( {showModal} ) => {
    const methods = useForm();
    const [tags, setTags] = useState<string[]>([]);
    const tagInputRef = useRef<HTMLInputElement>(null);
    const [ loading, setLoading ] = useState(false);
    

    function handleAddTags() {
        if(tagInputRef.current?.value === null || tagInputRef.current?.value === undefined) {
            return;
        }
        if(tagInputRef.current?.value.trim() !== '') {
            setTags( [...tags, tagInputRef.current.value]);
            tagInputRef.current.value='';
        } else {
            return;
        }
    }

    function removeTag(tagName: string){
        setTags(tags.filter(tag => tag !== tagName));
    }
    
    const onSubmit = methods.handleSubmit(data => {
        console.log({data})
        async function handleSaveButton(){
            
            setLoading(false);
            
        }
        setLoading(true);
        handleSaveButton();
    });

    return  <FormProvider {...methods}>
        <form
        className="w-fit h-fit"
        onSubmit={e => e.preventDefault()}
        noValidate
        >
            <div className="w-70 mm:w-70 ml:w-80 ls:w-90 4k:w-130 h-fit flex flex-col p-4 rounded-sm bg-slate-50 border-slate-200 border-2 shadow-sm">
                <div className="w-full h-fit flex justify-end">
                    <div className="w-fit h-fit cursor-pointer" onClick={() => showModal(false)}><CloseIcon/></div>
                </div>
                <div className="flex flex-col w-full h-fit gap-y-2 mt-3">
                    <InputField validate={false} label="Title" id="title" inputType="text" hint="Title" />
                    <InputField validate={false} label="Link" id="link" inputType="text" hint="Link" />
                </div>
                <div className="flex items-baseline w-fit h-fit mt-3">
                        <div className="flex w-fit items-baseline">
                        <label htmlFor="link_type" className="block mb-2 text-sm font-medium text-gray-900 w-32">Link Type</label>
                        <select id="link_type" className="col-start-1 row-start-1 bg-gray-50 border border-gray-300  
                                                        text-gray-900 text-xs rounded-lg focus:ring-blue-500 
                                                        focus:border-blue-500 block w-full p-1 ml:text-sm">
                            <option defaultValue={"VD"} value="VD">Video</option>
                            <option value="AD">Audio</option>
                            <option value="AR">Article</option>
                            <option value="IM">Image</option>
                            <option value="OT">Other</option>
                        </select>
                        </div>
                </div>
                <div className="flex flex-col w-full h-fit mt-4">
                    <div className="flex w-full items-center">
                        <div className="flex justify-between items-center w-28 border border-slate-200 p-1 rounded-lg hover:border-slate-400 focus-within:border-slate-400">
                            <input ref={tagInputRef} placeholder="tag" className="mr-1 w-12 flex-1 border-none focus:border-none focus:outline-none text-xs p-1"></input>
                            <div className="w-fit h-fit hover:scale-110 cursor-pointer rounded-full bg-slate-200 p-0.5" onClick={handleAddTags}><PlusIcon size="xs"/></div>
                        </div>
                    </div>
                    <div className="flex flex-wrap w-full gap-x-2 gap-y-1 overflow-hidden h-fit mt-3 mb-3">
                        { tags.length > 0 ? 
                            tags.map((item,index) => <Tag deleteTag={removeTag} key={index} tagName={item} />) : null
                        }
                    </div>
                </div>
                <div className="flex flex-col w-full h-full items-center justify-end">
                    <Button text="Save" loading={loading} wfull={true} variant="primary" onClick={onSubmit}/>
                </div>
            </div>
        </form>
        </FormProvider>

}