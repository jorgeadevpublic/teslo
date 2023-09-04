import { createContext } from "react";
import { InterfaceCartProduct, ShippingAddress } from "@/interfaces";

export interface CartContextProps {
	isLoaded: boolean;
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
	cart: InterfaceCartProduct[];
	shippingAddress?: ShippingAddress;
	// methods
	addProductToCart: (product: InterfaceCartProduct) => void;
	updateCartProductQuantity: (product: InterfaceCartProduct) => void;
	removeProductFromCart: (product: InterfaceCartProduct) => void;
	updateAddress: (address: ShippingAddress) => void;
	// orders
	createOrder: () => Promise<{ hasError: boolean; message: string; }>;
}

export const CartContext = createContext({} as CartContextProps);