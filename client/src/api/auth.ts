const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    profilePicture?: string;
    googleId?: string;
    githubId?: string;
}

export const loginUser = async ({ email, password }: LoginCredentials): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed.");
    }

    return data.user;
};

export const registerUser = async ({ email, password, name}: RegisterCredentials): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
    }

    return data.user;
};

export const logoutUser = async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed.");
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to check authentication status.");
    }

    const data = await response.json();
    return data.user;
};