/* eslint-disable react-refresh/only-export-components */
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { User, AuthContextType, Message } from "../types";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [isOpenSidebar, setIsOpenSidebar] = useState(true);
	const [agentType, setAgentType] = useState<string>("");
	const [allChats, setAllChats] = useState<Message[]>([]);
	const [selectedAgent, setSelectedAgent] = useState<string>("");
	useEffect(() => {
		// Check for existing token and validate session
		const token = localStorage.getItem("authToken");
		if (token) {
			// TODO: Replace with actual API call to validate token
			validateToken(token);
		} else {
			setLoading(false);
		}
	}, []);

	const validateToken = async (token: string) => {
		try {
			// TODO: Replace with actual API endpoint
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/v1/api/validate-token`,
				{
					method: "POST",
					body: null,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				const userData = await response.json();
				setUser(userData.user);
			} else {
				localStorage.removeItem("authToken");
			}
		} catch (error) {
			console.error("Token validation failed:", error);
			localStorage.removeItem("authToken");
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			// TODO: Replace with actual API endpoint
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/v1/api/signin`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("authToken", data.accessToken);
				setUser(data.data);
			} else {
				throw new Error("Login failed");
			}
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const signup = async (
		email: string,
		password: string,
		firstName: string,
		lastName: string
	) => {
		setLoading(true);
		try {
			// TODO: Replace with actual API endpoint
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/v1/api/signup`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password, firstName, lastName }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("authToken", data.token);
				setUser(data.user);
				toast.success("Signup successful! Please login to continue.");
			} else {
				throw new Error("Signup failed");
			}
		} catch (error) {
			console.error("Signup error:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const loginWithGoogle = async (idToken: string) => {
		setLoading(true);
		try {
			// TODO: Replace with actual API endpoint
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/v1/api/social-signin`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ idToken }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("authToken", data.accessToken);
				setUser(data.data);
			} else {
				throw new Error("Login failed");
			}
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem("authToken");
		setUser(null);
	};

	const value: AuthContextType = {
		user,
		login,
		signup,
		loginWithGoogle,
		logout,
		loading,
		activeChatId,
		setActiveChatId,
		setUser,
		setLoading,
		isOpenSidebar,
		setIsOpenSidebar,
		agentType,
		setAgentType,
		allChats,
		setAllChats,
		selectedAgent,
		setSelectedAgent,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
