import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { loginUser, registerUser, logoutUser, getCurrentUser, type User } from "../api/auth";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (email: string, password: string, name: string) => Promise<User>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const currentUser = await getCurrentUser();
            setUser(currentUser); 
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<User> => {
        try { 
            setIsLoading(true);
            const user = await loginUser({ email, password });
            setUser(user);
            return user;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, name: string): Promise<User> => {
        try {
            setIsLoading(true);
            const user = await registerUser({ email, password, name });
            setUser(user);
            return user;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
        user, 
        isLoading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }

    return context;
};