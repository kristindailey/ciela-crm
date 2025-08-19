import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { FaHouse, FaUserLarge } from "react-icons/fa6";
import { BsBuildingsFill } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import logo from "../assets/ciela-logo.png"; 
import mobileLogo from "../assets/ciela-text.png";

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
        <div className="min-h-screen w-20 sm:w-35 md:w-48 bg-[var(--royal-blue)] shadow-sm border-r flex flex-col">
            <div className="flex-1 flex flex-col items-start self-center justify-center px-2 sm:px-4 md:px-6 text-[var(--soft-lavender)] space-y-4 sm:space-y-6 md:space-y-8 pt-20 sm:pt-24 md:pt-30 text-sm sm:text-base md:text-lg">
                <Link to="/" className="flex items-center hover:text-white">
                    <FaHouse className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Home</span>
                </Link>
                <Link to="/contacts" className="flex items-center hover:text-white">
                    <FaUserLarge className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Contacts</span>
                </Link>
                <Link to="/companies" className="flex items-center hover:text-white">
                    <BsBuildingsFill className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Companies</span>
                </Link>
                <Link to="/applications" className="flex items-center hover:text-white">
                    <GrDocumentText className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Applications</span>
                </Link>
                <Link to="/settings" className="flex items-center hover:text-white">
                    <IoMdSettings className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Settings</span>
                </Link>
                <button 
                    onClick={handleLogout}
                    className="flex items-center pt-7 hover:text-white"
                >
                    <RiLogoutBoxLine className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Logout</span>
                </button>
            </div>

            <Link to="/">
                <img src={mobileLogo} alt="Ciela logo" className="self-end sm:hidden"></img>
                <img src={logo} alt="Ciela logo" className="self-end hidden sm:block"></img>
            </Link>
        </div>
    );
};

export default Sidebar;