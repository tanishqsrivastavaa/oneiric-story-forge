import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    email: string | null;
    login: (email: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("dreamToken");
        const storedEmail = localStorage.getItem("dreamEmail");
        if (storedToken && storedEmail) {
            setToken(storedToken);
            setEmail(storedEmail);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (email: string, token: string) => {
        setToken(token);
        setEmail(email);
        setIsAuthenticated(true);
        localStorage.setItem("dreamToken", token);
        localStorage.setItem("dreamEmail", email);
    };

    const logout = () => {
        setToken(null);
        setEmail(null);
        setIsAuthenticated(false);
        localStorage.removeItem("dreamToken");
        localStorage.removeItem("dreamEmail");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
