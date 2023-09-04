import { createContext } from "react";

export interface UiContextProps {
	isMenuOpen: boolean;
	toggleMenuOpen: () => void;
}

export const UiContext = createContext({} as UiContextProps);