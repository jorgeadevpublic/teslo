import { UiContext, uiReducer } from "@/context/ui";
import { useReducer } from "react";

export interface UiState {
	isMenuOpen: boolean;
}

const initialState: UiState = {
	isMenuOpen: false,
};

interface UiProviderProps {
	children: JSX.Element;
}

export const UiProvider = ({ children }: UiProviderProps) => {
	const [state, dispatch] = useReducer(uiReducer, initialState);
	
	const toggleMenuOpen = () => {
		dispatch({ type: "UI - Toggle Menu" });
	};

	return (
		<UiContext.Provider value={{
			...state,
			toggleMenuOpen,
		}}>
			{ children }
		</UiContext.Provider>
	);
};