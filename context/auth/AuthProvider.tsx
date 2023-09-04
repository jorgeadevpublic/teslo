import { ReactNode, useEffect, useReducer, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import { useRouter } from "next/router";

import { AuthContext, authReducer } from "@/context";
import { InterfaceUser } from "@/interfaces";
import { tesloApi } from "@/api";
import { signOut, useSession } from "next-auth/react";

export interface AuthState {
	isLoggedIn: boolean;
	user?: InterfaceUser;
}

interface AuthStateProviderProps {
	children: JSX.Element | ReactNode;
}

const initialState: AuthState = {
	isLoggedIn: false,
	user: undefined
};

export const AuthProvider = ({ children }: AuthStateProviderProps) => {
	const { data, status } = useSession();
	const [state, dispatch] = useReducer(authReducer, initialState);
	const router = useRouter();
	
	// useEffect(() => {
	// 	checkToken();
	// }, []);
	
	useEffect(() => {
		if (status === "authenticated") {
			dispatch({ type: "[Auth] - Login", payload: data?.user as InterfaceUser });
		}
	}, [status, data]);
	
	const checkToken = async () => {
		if (!Cookies.get("token")) return;
		try {
			const { data } = await tesloApi.get("/user/validate");
			const { token, user } = data;
			Cookies.set("token", token);
			dispatch({ type: "[Auth] - Login", payload: user });
		} catch (error) {
			Cookies.remove("token");
			dispatch({ type: "[Auth] - Logout" });
		}
	};
	
	const loginUser = async (email: string, password: string): Promise<boolean> => {
		try {
			const { data } = await tesloApi.post("/user/login", { email, password });
			const { user, token } = data;
			Cookies.set("token", token);
			dispatch({ type: "[Auth] - Login", payload: user });
			return true;
		} catch (error) {
			return false;
		}
	};
	
	const registerUser = async (name: string, email: string, password: string, repeatPassword: string): Promise<{ hasError: boolean, message?: string }> => {
		try {
			const { data } = await tesloApi.post("/user/register", { name, email, password });
			const { token, user } = data;
			Cookies.set("token", token);
			dispatch({ type: "[Auth] - Login", payload: user });
			return {
				hasError: false,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data?.message
				};
			}
			return {
				hasError: true,
				message: "Error to trying to create user"
			};
		}
	};
	
	const logoutUser = () => {
		// Cookies.remove("token");
		Cookies.remove("cart");
		Cookies.remove("firstName");
		Cookies.remove("lastName");
		Cookies.remove("address");
		Cookies.remove("address2");
		Cookies.remove("zip");
		Cookies.remove("city");
		Cookies.remove("country");
		Cookies.remove("phone");
		// router.reload();
		signOut();
	};
	
	return (
		<AuthContext.Provider value={{
			...state,
			loginUser,
			registerUser,
			logoutUser,
		}}>
			{ children }
		</AuthContext.Provider>
	);
};