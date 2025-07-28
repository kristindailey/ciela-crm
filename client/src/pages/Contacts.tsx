import { useAuth } from "../context/AuthContext";

const Contacts = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try { 
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border- p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <h1 className="text-2xl font-thin">Ciela CRM</h1>
                        <nav className="flex space-x-4">
                            <a href="/" className="text-gray-600 hover:text-gray-800">Home</a>
                            <a href="/contacts" className="text-blue-600 font-medium">Contacts</a>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Welcome, {user?.name}!</span>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded border"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="p-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-xl font-medium mb-4">Your Contacts</h2>
                    <p className="text-gray-600 mb-4">Manage your professional contacts and networking connections.</p>
                    <div className="bg-gray-50 p-6 rounded text-center">
                        <p className="text-gray-500">No contacts yet. Contact management features coming soon!</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contacts;