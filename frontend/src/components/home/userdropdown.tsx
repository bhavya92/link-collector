import { signoutUser } from "../../services/signout"

export const UserDropDown = ({isShown,username,email,setUser}) => {

    async function handleSignout(){
        const res = await signoutUser();
        if(res.success) {
            setUser(false);
        } else {
            alert("something went wrong");
        }
    }

    return <div className={`transition-all  duration-200 ease-in-out ${isShown ? 'visible opacity-100' : 'hidden opacity-0'} overflow-hidden w-fit bg-slate-200 flex flex-col rounded-lg divide-slate-100 divide-y  pt-4 shadow-sm z-10`}>
        <div className="flex flex-col gap-y-1 pb-2 px-2 bg-slate-200">
            <span className="text-xs tb:text-sm ll:text-base select-none">{username}</span>
            <span className="text-xs select-none hidden mm:block">{email}</span>
        </div>
        <div className="text-xs tb:text-sm ll:text-lg w-full py-2 px-2 flex items-center justify-center text-red-800 bg-slate-300 cursor-pointer rounded-b-lg select-none" onClick={handleSignout}>Signout</div>
    </div>
}