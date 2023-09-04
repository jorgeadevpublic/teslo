import { InterfaceSize, InterfaceUser } from "@/interfaces";

export interface InterfaceOrder {
	_id?: string;
	user?: InterfaceUser | string;
	orderItems: InterfaceOrderItem[];
	shippingAddress: ShippingAddress;
	paymentResult?: string;
	numberOfItems: number,
	subTotal: number,
	tax: number,
	total: number,
	isPaid: boolean;
	paidAt?: Date;
	transactionId?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface InterfaceOrderItem {
	_id: string;
	title: string;
	size: InterfaceSize;
	quantity: number;
	slug: string;
	image: string;
	price: number;
	gender: string;
}

export interface ShippingAddress {
	firstName: string,
	lastName: string,
	address: string,
	address2?: string,
	zip: string,
	city: string,
	country: string,
	phone: string
}