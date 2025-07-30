import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import ErrorMessage from "../components/auth/ErrorMessage";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const { register, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await register(email, password, name);
            navigate("/"); 
        } catch (error) {
            setError(error instanceof Error ? error.message : "Registration failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--royal-blue)]">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-thin">Create Account</h1>
                    <p className="text-white mt-2">Join Ciela CRM today!</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <ErrorMessage error={error} />

                    <form onSubmit={handleSubmit}>
                        <AuthInput 
                            id="name"
                            label="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                        />

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

                        <AuthButton isLoading={isLoading} loadingText="Creating account...">
                            Create Account 
                        </AuthButton>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <a href="/login" className="text-[var(--royal-blue)] hover:text-[#535bf2] decoration-inherit font-medium">
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