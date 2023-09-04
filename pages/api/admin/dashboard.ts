import { NextApiRequest, NextApiResponse } from "next";
import { OrderModel, ProductModel, UserModel } from "@/models";
import { database } from "@/database";

type Data = {
	numberOfOrders: number;
	paidOrders: number;
	notPaidOrders: number;
	numberOfClients: number;
	numberOfProducts: number;
	productsWithNoInventory: number;
	lowInventory: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	await database.connect();
	// const numberOfOrders = await OrderModel.count();
	// const paidOrders = await OrderModel.count({ isPaid: true });
	// const numberOfClients = await UserModel.find({ role: "client" }).count();
	// const numberOfProducts = await ProductModel.count();
	// const productsWithNoInventory = await ProductModel.count({ inStock: 0 });
	// const lowInventory = await ProductModel.count({ inStock: { $lte: 10 } });
	const [
		numberOfOrders,
		paidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
	] = await Promise.all([
		OrderModel.count(),
		OrderModel.count({ isPaid: true }),
		UserModel.find({ role: "client" }).count(),
		ProductModel.count(),
		ProductModel.count({ inStock: 0 }),
		ProductModel.count({ inStock: { $lte: 10 } }),
	]);
	await database.disconnect();
	
	const newData = {
		numberOfOrders,
		paidOrders,
		notPaidOrders: numberOfOrders - paidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
	};
	res.status(200).json(newData);
}