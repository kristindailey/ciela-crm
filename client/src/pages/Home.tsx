import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user, isLoading, logout } = useAuth();
    
    const handleLogout = async () => {
        try { 
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

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
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <h1 className="text-2xl font-thin">Ciela CRM</h1>
                            <button 
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-xl font-medium mb-4">Welcome back!</h2>
                        <p>Your job search management tools will appear here.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center font-thin">
                <h1 className="text-4xl mb-8">Ciela CRM</h1>
                <p className="mb-8">Welcome to your job search management system.</p>
                <div className="space-x-4">
                    <a 
                        href="/login"
                        className="border-2 border-[var(--soft-lavender)] text-white font-extralight px-6 py-2 rounded hover:bg-[var(--soft-lavender)] hover:text-black"
                    >
                        Sign In
                    </a>
                    <a 
                        href="/register"
                        className="border-2 border-white text-white font-extralight px-6 py-2 rounded hover:bg-white hover:text-black"
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
    };

export default Home;