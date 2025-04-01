import { useRef } from "react"
import { SendIcon } from "../../icons/send";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
    const searchRef = useRef<HTMLInputElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const navigation = useNavigate();
    async function handleSearch(){
        console.log(searchRef.current?.value);
        if(searchRef.current?.value === undefined || searchRef.current?.value === '' || searchRef.current?.value === null){
            console.log(divRef.current)
            divRef.current?.focus();
            return;
        }
        if(searchRef.current?.value.trim() === ''){
            divRef.current?.focus();
            searchRef.current.value='';
            return;
        }
        const keyword = searchRef.current?.value.trim();
        searchRef.current.value = '';
        divRef.current?.blur();
        navigation(`/home/search?keyword=${encodeURIComponent(keyword)}`);

    }

    return <div className="tb:w-80 w-45 h-fit flex border rounded-lg p-1.5 ls:p-2 items-center bg-slate-50 focus:border-red-700" tabIndex={0} ref={divRef}>
        <input className="w-full h-full focus:border-none focus:outline-none text-sm" ref={searchRef} placeholder="Search here..."/>
        <div className="transition-all duration-200 ease-in-out w-fit h-fit cursor-pointer hover:scale-105" onClick={handleSearch}><SendIcon/></div>
    </div>
}