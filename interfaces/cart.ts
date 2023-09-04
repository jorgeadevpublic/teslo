import { InterfaceSize } from "@/interfaces/products";

export interface InterfaceCartProduct {
	_id: string;
	image: string;
	price: number;
	size?: InterfaceSize;
	slug: string;
	title: string;
	gender: "men" | "women" | "kid" | "unisex";
	quantity: number;
}