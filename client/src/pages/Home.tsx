const Home = () => {
    const isLoggedIn = false;
    
    if (isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <h1 className="text-2xl font-thin">Ciela CRM</h1>
                            <button className="text-gray-600 hover:text-gray-800">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-xl font-medium mb-4">Welcome back!</h2>
                        <p className="text-white">Your job search management tools will appear here.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-thin mb-8">Ciela CRM</h1>
                <p className="text-white mb-8">Welcome to your job search management system.</p>
                <div className="space-x-4">
                    <a 
                        href="/login"
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Sign In
                    </a>
                    <a 
                        href="/register"
                        className="border border-blue-500 text-white px-6 py-2 rounded hover:bg-blue-50"
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
    };

export default Home;