import { CartContext } from "@/context";
import { useEffect, useReducer } from "react";
import { cartReducer } from "@/context/cart/cartReducer";
import { InterfaceCartProduct, InterfaceOrder, ShippingAddress } from "@/interfaces";
import Cookie from "js-cookie";
import Cookies from "js-cookie";
import { tesloApi } from "@/api";
import axios from "axios";

export interface CartState {
	isLoaded: boolean;
	cart: InterfaceCartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;
	shippingAddress?: ShippingAddress;
}

const initialState: CartState = {
	isLoaded: false,
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,
	shippingAddress: undefined
};

interface CartProviderProps {
	children: JSX.Element;
}

export const CartProvider = ({ children }: CartProviderProps) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);
	
	useEffect(() => {
		try {
			const cartCookie = Cookie.get("cart") ? JSON.parse(Cookie.get("cart")!) : [];
			dispatch({ type: "[Cart] - Load cart from storage", payload: cartCookie });
		} catch (error) {
			dispatch({ type: "[Cart] - Load cart from storage", payload: [] });
		}
	}, []);
	
	useEffect(() => {
		const shippingAddressCookie = {
			firstName: Cookies.get("firstName") || "",
			lastName: Cookies.get("lastName") || "",
			address: Cookies.get("address") || "",
			address2: Cookies.get("address2") || "",
			zip: Cookies.get("zip") || "",
			city: Cookies.get("city") || "",
			country: Cookies.get("country") || "",
			phone: Cookies.get("phone") || "",
		};
		dispatch({ type: "[Cart] - Load Address from Cookies", payload: shippingAddressCookie });
	}, []);
	
	useEffect(() => {
		const cartCookie = Cookie.get("cart") ? JSON.parse(Cookie.get("cart")!) : [];
		if ( cartCookie.length === 0 || state.cart.length !== 0 ) {
			Cookie.set("cart", JSON.stringify(state.cart));
		}
		// Cookie.set("cart", JSON.stringify( state.cart ));
	}, [state.cart]);
	
	useEffect(() => {
		const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
		const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0);
		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
		const orderSummary = {
			numberOfItems,
			subTotal,
			tax: subTotal * taxRate,
			total: subTotal * (1 + taxRate),
		};
		
		dispatch({ type: "[Cart] - Update Order Summary", payload: orderSummary });
	}, [state.cart]);
	
	const addProductToCart = (product: InterfaceCartProduct) => {
		//! Level 1
		// dispatch({ type: "[Cart] - Add Product", payload: product });
		
		//! Level 2
		// const productsInCart = state.cart.filter((cartProduct) => cartProduct._id !== product._id && cartProduct.size !== product.size);
		// dispatch({ type: "[Cart] - Add Product", payload: [...productsInCart, product] });
		
		//! Level 3
		// return true if it exists any product in cart with the same id in product and the cart
		const productInCart = state.cart.some((cartProduct) => cartProduct._id === product._id);
		if (!productInCart) {
			return dispatch({ type: "[Cart] - Update products in cart", payload: [...state.cart, product] });
		}
		
		// return true if exists any product in cart with the same id and size in product and the cart
		const productInCartButDifferentSizes = state.cart.some((cartProduct) => cartProduct._id === product._id && cartProduct.size === product.size);
		if (!productInCartButDifferentSizes) {
			return dispatch({ type: "[Cart] - Update products in cart", payload: [...state.cart, product] });
		}
		
		const updatedProductsInCart = state.cart.map((cartProduct) => {
			if (cartProduct._id === product._id && cartProduct.size === product.size) {
				cartProduct.quantity += product.quantity;
			}
			return cartProduct;
		});
		dispatch({ type: "[Cart] - Update products in cart", payload: updatedProductsInCart });
	};
	
	const updateCartProductQuantity = (product: InterfaceCartProduct) => {
		dispatch({ type: "[Cart] - Update cart product quantity", payload: product });
	};
	
	const removeProductFromCart = (product: InterfaceCartProduct) => {
		dispatch({ type: "[Cart] - Remove product from cart", payload: product });
	};
	
	const updateAddress = (address: ShippingAddress) => {
		Cookies.set("firstName", address.firstName);
		Cookies.set("lastName", address.lastName);
		Cookies.set("address", address.address);
		Cookies.set("address2", address.address2 || "");
		Cookies.set("zip", address.zip);
		Cookies.set("city", address.city);
		Cookies.set("country", address.country);
		Cookies.set("phone", address.phone);
		dispatch({ type: "[Cart] - Update Address", payload: address });
	};
	
	const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {
		if (!state.shippingAddress) {
			throw new Error("Shipping address is not defined");
		}
		
		const order: InterfaceOrder = {
			orderItems: state.cart.map((cartProduct) => ({
				...cartProduct,
				size: cartProduct.size!,
			})),
			shippingAddress: state.shippingAddress,
			numberOfItems: state.numberOfItems,
			subTotal: state.subTotal,
			tax: state.tax,
			total: state.total,
			isPaid: false,
		};
		
		try {
			const { data } = await tesloApi.post<InterfaceOrder>("/orders", order);
			// dispatch action
			dispatch({ type: "[Cart] - Order Complete" });
			return {
				hasError: false,
				message: data._id!,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: error.response?.data.message || error.message,
				};
			}
			return {
				hasError: true,
				message: "Error not found, contact with the administrator.",
			};
		}
	};

	return (
		<CartContext.Provider value={{
			...state,
			// Methods
			addProductToCart,
			updateAddress,
			updateCartProductQuantity,
			removeProductFromCart,
			// Orders
			createOrder,
		}}>
			{ children }
		</CartContext.Provider>
	);
};