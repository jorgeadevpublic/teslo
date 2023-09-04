import { createContext } from "react";
import { InterfaceUser } from "@/interfaces";

export interface AuthContextProps {
	isLoggedIn: boolean;
	user?: InterfaceUser;
	loginUser: (email: string, password: string) => Promise<boolean>;
	registerUser: (name: string, email: string, password: string, repeatPassword: string) => Promise<{ hasError: boolean; message?: string }>;
	logoutUser: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);