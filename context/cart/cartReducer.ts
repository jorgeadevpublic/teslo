import { CartState } from "@/context";
import { InterfaceCartProduct, ShippingAddress } from "@/interfaces";

type cartActionType =
	| { type: "[Cart] - Load cart from storage", payload: InterfaceCartProduct[] }
	| { type: "[Cart] - Update products in cart", payload: InterfaceCartProduct[] }
	| { type: "[Cart] - Update cart product quantity", payload: InterfaceCartProduct }
	| { type: "[Cart] - Remove product from cart", payload: InterfaceCartProduct }
	| { type: "[Cart] - Update Order Summary", payload: {
		numberOfItems: number;
		subTotal: number;
		tax: number;
		total: number;
	} }
	| { type: "[Cart] - Load Address from Cookies", payload: ShippingAddress }
	| { type: "[Cart] - Update Address", payload: ShippingAddress }
	| { type: "[Cart] - Order Complete" }

export const cartReducer = (state: CartState, action: cartActionType): CartState => {
	switch (action.type) {
		case "[Cart] - Load cart from storage":
			return {
				...state,
				isLoaded: true,
				cart: [...action.payload],
			};
			
		case "[Cart] - Update products in cart":
			return {
				...state,
				cart: [...action.payload],
			};
			
		case "[Cart] - Update cart product quantity":
			return {
				...state,
				cart: state.cart.map((product) => {
					if (product._id !== action.payload._id) return product;
					if (product.size !== action.payload.size) return product;
					return action.payload;
				})
			};
			
		case "[Cart] - Remove product from cart":
			return {
				...state,
				// cart: state.cart.filter((product) => {
				// 	if (product._id !== action.payload._id) return product;
				// 	if (product.size !== action.payload.size) return product;
				// })
				cart : state.cart.filter((product) => !(product._id === action.payload._id && product.size === action.payload.size))
			};
			
		case "[Cart] - Update Order Summary":
			return {
				...state,
				...action.payload
			};
			
		case "[Cart] - Update Address":
		case "[Cart] - Load Address from Cookies":
			return {
				...state,
				shippingAddress: action.payload
			};
			
		case "[Cart] - Order Complete":
			return {
				...state,
				cart: [],
				numberOfItems: 0,
				subTotal: 0,
				tax: 0,
				total: 0,
			};
		default:
			return state;
	}
};