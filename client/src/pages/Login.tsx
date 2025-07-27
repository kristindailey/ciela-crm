const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-thin">Sign In</h1>
                <p className="text-gray-600 mt-2">Welcome back to Ciela CRM!</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <p className="text-center text-gray-500">Login form coming soon...</p>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a href="/register" className="text-blue-500 hover:text-blue-600">
                            Sign up.
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;