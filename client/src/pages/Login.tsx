import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import ErrorMessage from "../components/auth/ErrorMessage";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Login failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-thin">Sign In</h1>
                    <p className="text-white mt-2">Welcome back to Ciela CRM!</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <ErrorMessage error={error} />

                    <form onSubmit={handleSubmit}>
                        <AuthInput 
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />

                        <AuthInput 
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />

                        <AuthButton isLoading={isLoading} loadingText="Signing in...">
                            Sign In 
                        </AuthButton>
                    </form>
                    
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