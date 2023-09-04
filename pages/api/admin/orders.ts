import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/database";
import { OrderModel } from "@/models";
import { InterfaceOrder } from "@/interfaces";

type Data =
	| { message: String }
	| InterfaceOrder[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "GET":
			return getOrders(req, res);
	}
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await database.connect();
	const orders = await OrderModel
		.find()
		.sort({ createdAt: "desc" })
		.populate("user", "name email")
		.lean();
	await database.disconnect();
	
	return res.status(200).json(orders);
};