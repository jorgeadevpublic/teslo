import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/database";
import { ProductModel } from "@/models";
import { InterfaceProduct } from "@/interfaces";

type Data =
	| { message: String }
	| InterfaceProduct[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "GET":
			return getSearchProducts(req, res);
		default:
			return res.status(200).json({ message: "Bad Request" });
	}
}

const getSearchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	let { query = "" } = req.query;
	
	if (query.length === 0) {
		return res.status(400).json({ message: "No query" });
	}
	
	query = query.toString().toLowerCase();
	
	await database.connect();
	const products = await ProductModel.find({
		$text: { $search: query }
	}).select("title images price inStock slug -_id").lean();
	await database.disconnect();
	
	return res.status(200).json(products);
};