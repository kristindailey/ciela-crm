import { FaHouse, FaUserLarge } from "react-icons/fa6";
import { BsBuildingsFill } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ciela-logo.png"; 
import { Link } from 'react-router';

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
                <Link to="/" className="flex items-center hover:text-white">
                    <FaHouse className="mr-2"/>
                    <span>Home</span>
                </Link>
                <Link to="/contacts" className="flex items-center hover:text-white">
                    <FaUserLarge className="mr-2"/>
                    <span>Contacts</span>
                </Link>
                <Link to="/companies" className="flex items-center hover:text-white">
                    <BsBuildingsFill className="mr-2"/>
                    <span>Companies</span>
                </Link>
                <Link to="/applications" className="flex items-center hover:text-white">
                    <GrDocumentText className="mr-2"/>
                    <span>Applications</span>
                </Link>
                <Link to="/settings" className="flex items-center hover:text-white">
                    <IoMdSettings className="mr-2"/>
                    <span>Settings</span>
                </Link>
                <button 
                    onClick={handleLogout}
                    className="flex items-center pt-7 hover:text-white"
                >
                    <RiLogoutBoxLine className="mr-2"/>
                    <span>Logout</span>
                </button>
            </div>

            <Link to="/">
                <img src={logo} alt="Ciela logo" className="self-end"></img>
            </Link>
        </div>
    );
};

export default Sidebar;