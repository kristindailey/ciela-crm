const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-thin">Create Account</h1>
                <p className="text-gray-600 mt-2">Join Ciela CRM today!</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                {/* Regsiter form will go here */}
                <p className="text-center text-gray-500">Register form coming soon...</p>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-500 hover:text-blue-600">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Register;