import { useContext, useState } from "react";
import { Sidebar } from "./Sidebar";
import { VideoIcon } from "../../icons/video";
import { SidebarItem } from "./sidebarItem";
import { AudioIcon } from "../../icons/audio";
import { ArticleIcon } from "../../icons/article";
import { ImageIcon } from "../../icons/image";
import { TagIcon } from "../../icons/tag";
import { ProfileIcon } from "../../icons/profile";
import { Button } from "../ui/button";
import { UserDropDown } from "./userdropdown";
import { AuthContext } from "../../context/auth";
import { ContentModal } from "./NewContentModal";
import { MegaphoneIcon } from "../../icons/megaphone";
import { HomeIcon } from "../../icons/home";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { DisplayContent } from "./displaycontent";
import { TagsContent } from "./tagscontent";
import { OthersIcon } from "../../icons/other";
import { Alert } from "../ui/alert";
import { AlertContext } from "../../context/alert";
import { SearchBar } from "./search";
import { PlusIcon } from "../../icons/plus";
import { SearhResult } from "./searchresult";
export const HomePage = () => {
    
    const auth = useContext(AuthContext);
    const alert = useContext(AlertContext);
    if (!auth) {
        throw new Error("check is authprovider provided");
    }
    const { user, setUser } = auth;
    const navigate = useNavigate();
    const [expanded, setExpanded ] = useState(false);
    const  [showUser, setShowUser ] = useState(false);
    const [ newModal ,setNewModa ] = useState(false);

    function toggleSidebar() {
        setExpanded( prev => !prev);
    }

    function closeSideBar() {
        setExpanded(false);
    }

    function toggleuserDropDown() {
        setShowUser(prev => !prev);
    }

    return<div className="w-screen h-screen overflow-hidden relative">
        {alert?.showAlert ? <Alert variant={alert.variant} message={alert.message}/> : null}
        {expanded ? <div className="bg-slate-100/50 z-50 absolute inset-0" onClick={toggleSidebar}></div> 
                    : null}
        <div className="fixed inset-y-0 left-0 z-50">
            <Sidebar expanded={expanded} setExpanded={toggleSidebar}>
                <SidebarItem expanded={expanded} icon={<HomeIcon/>} title={"Home"} onClick={() => {navigate("/home"); closeSideBar()}}/>
                <SidebarItem expanded={expanded} icon={<VideoIcon/>} title={"Video"} onClick={() =>{ navigate("/home/video"); closeSideBar()}}/>
                <SidebarItem expanded={expanded} icon={<AudioIcon/>} title={"Audio"} onClick={() =>{ navigate("/home/audio"); closeSideBar();}}/>
                <SidebarItem expanded={expanded} icon={<MegaphoneIcon/>} title={"Social"} onClick={() =>{ navigate("/home/social"); closeSideBar();}}/>
                <SidebarItem expanded={expanded} icon={<ArticleIcon/>} title={"Article"} onClick={() =>{ navigate("/home/article"); closeSideBar();}}/>
                <SidebarItem expanded={expanded} icon={<ImageIcon/>} title={"Image"} onClick={() =>{ navigate("/home/image"); closeSideBar();}}/> 
                <SidebarItem expanded={expanded} icon={<OthersIcon/>} title={"Others"} onClick={() =>{ navigate("/home/other"); closeSideBar();}}/> 
                <SidebarItem expanded={expanded} icon={<TagIcon/>} title={"Tags"} onClick={() =>{ navigate("/home/tags"); closeSideBar();}}/>
            </Sidebar>
        </div>
        <div className="w-full h-full flex flex-col z-10">
            <div className="w-full h-fit flex justify-end gap-x-2 px-4 pt-4 mb-4 items-center">
                <SearchBar/>
                <button className="bg-slate-300 flex justify-center items-center ml:rounded-sm rounded-full h-min cursor-pointer select-none
                                    w-fit tb:w-26 ls:w-32 ll:w-36 4k:w-44 text-xs px-1 py-1 ml:text-xs ml:px-1 ml:py-1 
                                    tb:py-2 ls:text-sm ls:py-2 ll:text-md ll:px-4 ll:py-2 4k:text-2xl" 
                
                        onClick={() => setNewModa(true)}>
                            <span className="hidden ml:block">Add Content</span>
                            <span className="block ml:hidden"><PlusIcon size="xl"/></span>
                            </button>
                <div className="rounded-full w-fit h-fit bg-royal-blue-300 p-2 cursor-pointer" onClick={toggleuserDropDown}>
                    <ProfileIcon/>
                </div>
            </div>
            <div className="relative max-w-screen flex-1 max-h-screen ">
                <div className="absolute top-2 right-4">
                    <UserDropDown isShown={showUser} email={user?.email} username={user?.userName} setUser={setUser}/>
                </div>
                {newModal ? <div className="absolute top-0 right-0 pl-8 h-full w-full flex items-center justify-center z-40">
                    <ContentModal showModal={setNewModa}/>
                </div> : null}
                <div className="pl-16 pr-4 pt-2 w-full h-full">
                <Routes>
                    <Route path="/" element={<DisplayContent type="all" />} />
                    <Route path="video" element={<DisplayContent type="video" />} />
                    <Route path="audio" element={<DisplayContent type="audio" />} />
                    <Route path="article" element={<DisplayContent type="article" />} />
                    <Route path="image" element={<DisplayContent type="image" />} />
                    <Route path="social" element={<DisplayContent type="social" />} />
                    <Route path="other" element={<DisplayContent type="other" />} />
                    <Route path="tags" element={<TagsContent/>} />
                    <Route path="search" element={<SearhResult/>}/>
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
                </div>
            </div>
        </div>
    </div> 
    
        
}