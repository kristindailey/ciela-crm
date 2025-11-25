import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { FaHouse, FaUserLarge } from "react-icons/fa6";
import { BsBuildingsFill } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { FaBell } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import logo from "../assets/ciela-logo.png"; 
import mobileLogo from "../assets/ciela-text.png";
import { useReminders } from "../context/RemindersContext";

const Sidebar = () => {
    const { logout } = useAuth();
	const location = useLocation();
	const { reminderCount } = useReminders();
    
    const handleLogout = async () => {
        try { 
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen w-20 sm:w-35 md:w-48 bg-[var(--royal-blue)] shadow-sm border-r flex flex-col font-inter">
            <div className="flex-1 flex flex-col items-start self-center justify-center px-2 sm:px-4 md:px-6 space-y-4 sm:space-y-6 md:space-y-8 pt-20 sm:pt-24 md:pt-30 text-sm sm:text-base md:text-lg">
                <Link 
					to="/" 
					className={`flex items-center ${
						location.pathname === "/"
						? "text-white hover:text-[var(--soft-lavender)]"
						: "text-[var(--soft-lavender)] hover:text-white"
					}`}
				>
                    <FaHouse className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Home</span>
                </Link>

                <Link 
					to="/contacts" 
					className={`flex items-center ${
						location.pathname === "/contacts"
							? "text-white hover:text-[var(--soft-lavender)]"
							: "text-[var(--soft-lavender)] hover:text-white"
					}`}
				>
                    <FaUserLarge className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Contacts</span>
                </Link>

                <Link 
					to="/companies" 
					className={`flex items-center ${
						location.pathname === "/companies"
							? "text-white hover:text-[var(--soft-lavender)]"
							: "text-[var(--soft-lavender)] hover:text-white"
					}`}
				>
                    <BsBuildingsFill className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Companies</span>
                </Link>

                <Link 
					to="/applications" 
					className={`flex items-center ${
						location.pathname === "/applications"
							? "text-white hover:text-[var(--soft-lavender)]"
							: "text-[var(--soft-lavender)] hover:text-white"
					}`}
				>
                    <GrDocumentText className="text-xl mr-0 sm:mr-2"/>
                    <span className="hidden sm:block md:block">Applications</span>
                </Link>

                <Link 
					to="/reminders" 
					className={`flex items-center ${
						location.pathname === "/reminders"
							? "text-white hover:text-[var(--soft-lavender)]"
							: "text-[var(--soft-lavender)] hover:text-white"
					}`}
				>
					<div className="relative">
						<FaBell className="text-xl mr-0 sm:mr-2"/>

						{reminderCount > 0 && (
							<span className="absolute -top-2 -right-0 bg-red-500 text-white text-xs font-bold rounded-lg px-1">
								{reminderCount}
							</span>
						)}
					</div>

                    <span className="hidden sm:block md:block">Reminders</span>
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