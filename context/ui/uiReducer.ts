import { UiState } from "@/context";

type UiActionType =
	| { type: "UI - Toggle Menu" };

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
	switch (action.type) {
		case "UI - Toggle Menu":
			return {
				...state,
				isMenuOpen: !state.isMenuOpen,
			};
		default:
			return state;
	}
};