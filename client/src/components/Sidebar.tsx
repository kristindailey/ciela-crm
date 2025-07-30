import { FaHouse, FaUserLarge } from "react-icons/fa6";
import { BsBuildingsFill } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ciela-logo.png"; 

const Sidebar = () => {
    const { logout } = useAuth();
    
    const handleLogout = async () => {
        try { 
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen w-48 md:w-64 bg-[var(--royal-blue)] shadow-sm border-r flex flex-col">
            <div className="flex-1 flex flex-col items-start self-center justify-center px-4 sm:px-6 lg:px-8 text-[var(--soft-lavender)] space-y-8 pt-30 text-xl">
                <div className="flex items-center">
                    <FaHouse className="mr-2"/>
                    <a href="/">Home</a>
                </div>
                <div className="flex items-center">
                    <FaUserLarge className="mr-2"/>
                    <a href="/contacts">Contacts</a>
                </div>
                <div className="flex items-center">
                    <BsBuildingsFill className="mr-2"/>
                    <a href="/companies">Companies</a>
                </div>
                <div className="flex items-center">
                    <GrDocumentText className="mr-2"/>
                    <a href="/applications">Applications</a>
                </div>
                <div className="flex items-center">
                    <IoMdSettings className="mr-2"/>
                    <a href="/settings">Settings</a>
                </div>
                <div className="flex items-center pt-7">
                    <RiLogoutBoxLine className="mr-2"/>
                    <a onClick={handleLogout}>Logout</a>
                </div>
            </div>

            <img src={logo} alt="Ciela logo" className="self-end"></img>
        </div>
    );
};

export default Sidebar;