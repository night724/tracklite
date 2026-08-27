import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import api from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(
        null
    );
    const [loading, setLoading] = useState(
        true
    );

    useEffect(() => {
        const savedUser =
            localStorage.getItem("user");
        const token =
            localStorage.getItem("token");

        if (token && savedUser) {
            setUser(
                JSON.parse(savedUser)
            );
        }
        setLoading(false);
    }, []);

    async function login(
        email,
        password
    ) {
        const response =
            await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );
        const {
            token,
            user
        } = response.data;
        localStorage.setItem(
            "token",
            token
        );
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );
        setUser(user);
        return user;
    }

    function logout() {
        localStorage.removeItem(
            "token"
        );
        localStorage.removeItem(
            "user"
        );
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    return useContext(
        AuthContext
    );
}