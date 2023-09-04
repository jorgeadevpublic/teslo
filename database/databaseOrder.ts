import { isValidObjectId } from "mongoose";
import { database } from "@/database";
import { InterfaceOrder } from "@/interfaces";
import OrderModel from "@/models/Order";

export const getOrderById = async (id: string): Promise<InterfaceOrder | null> => {
	if (!isValidObjectId(id)) return null;
	await database.connect();
	const order = await OrderModel.findById(id).lean();
	await database.disconnect();
	if (!order) return null;
	return JSON.parse(JSON.stringify(order));
};

export const getOrderByUserId = async (userId: string): Promise<InterfaceOrder[]> => {
	if (!isValidObjectId(userId)) return [];
	await database.connect();
	const orders = await OrderModel.find({ user: userId }).lean();
	await database.disconnect();
	if (!orders) return [];
	return JSON.parse(JSON.stringify(orders));
};