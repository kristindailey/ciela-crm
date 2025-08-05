import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="bg-gray-50 flex">
                <Sidebar />
                <div className="flex-1">
                    <h1 className="text-[var(--royal-blue)] font-pacifico text-5xl mt-20 ml-5 mb-4">home</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--royal-blue)]">
            <div className="text-center font-thin">
                <h1 className="text-4xl mb-4">Ciela CRM</h1>
                <p className="mb-10">Welcome to your job search management system.</p>
                <div className="space-x-4">
                    <a 
                        href="/login"
                        className="border-2 border-white text-white font-medium px-5 py-[0.6em] rounded-lg bg-transparent hover:bg-[var(--soft-lavender)] hover:text-[var(--royal-blue)] transition-colors duration-250 focus:outline-4 focus:outline-auto cursor-pointer"
                    >
                        Sign In
                    </a>
                    <a 
                        href="/register"
                        className="border-2 border-[var(--soft-lavender)] text-white font-medium px-5 py-[0.6em] rounded-lg text-[var(--royal-blue)] hover:bg-white hover:text-[var(--royal-blue)] transition-colors duration-250 focus:outline-4 focus:outline-auto cursor-pointer"
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
    };

export default Home;