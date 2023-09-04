import { NextApiRequest, NextApiResponse } from "next";
import { InterfaceOrder, InterfaceUser } from "@/interfaces";
import { getServerSession } from "next-auth";
import { database } from "@/database";
import { ProductModel } from "@/models";
import OrderModel from "@/models/Order";
import { getToken } from "next-auth/jwt";

type Data =
	| { message: String }
	| InterfaceOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "POST":
			return createOrder(req, res);
		default:
			res.status(405).json({ message: "Method not allowed" });
	}
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>)=> {
	let { orderItems, total } = req.body as InterfaceOrder;
	
	const token = await getToken({ req });
	if (!token) {
		return res.status(401).json({ message: "You must be authenticated to make this." });
	}
	const user = token.user as InterfaceUser;
	
	// verify if a user exists
	const session: any = await getServerSession(req , res, {});
	if (!session) {
		return res.status(401).json({ message: "You must be authenticated to make this." });
	}
	
	// create an array of order items
	const productIds = orderItems.map((item) => item._id);
	await database.connect();
	const databaseProducts = await ProductModel.find({ _id: { $in: productIds } });
	
	try {
		const subTotal = orderItems.reduce((acc, current) => {
			const currentPrice = databaseProducts.find(prod => prod.id === current._id)?.price;
			if (!currentPrice) { throw new Error("Verify cart again, Product not found.");	}
			return(currentPrice * current.quantity) + acc;
		}, 0);
		
		const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
		let backendTotal = subTotal + (subTotal * taxRate);
		
		// console.log(backendTotal);
		// console.log(total);
		
		backendTotal = Math.round(backendTotal * 100) / 100;
		total = Math.round(total * 100) / 100;
		
		if (backendTotal !== total) {
			throw new Error("Verify cart again, totals don't match.");
		}
		
		// TODO: review this code
		// all good, create order
		const userId = user._id;
		
		const newOrder = new OrderModel({
			...req.body,
			total,
			isPaid: false,
			user: userId,
		});
		await newOrder.save();
		await database.disconnect();
		
		return res.status(201).json(newOrder);
	} catch (error: any) {
		await database.disconnect();
		// console.log({ error });
		res.status(400).json({ message: error.message || "Review server logs." });
	}
};