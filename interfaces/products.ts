export interface InterfaceProduct {
	_id: string;
	description: string;
	images: string[];
	inStock: number;
	price: number;
	sizes: InterfaceSize[];
	slug: string;
	tags: string[];
	title: string;
	type: InterfaceValidType;
	gender: InterfaceValidGenders;
	createdAt: string;
	updatedAt: string;
}

export type InterfaceSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type InterfaceValidType = "shirts" | "pants" | "hoodies" | "hats";
export type InterfaceValidGenders = "men" | "women" | "kid" | "unisex";