import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/database";
import { ProductModel } from "@/models";
import { InterfaceProduct } from "@/interfaces";

type Data =
	| {	message: string }
	| InterfaceProduct

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "GET":
			return getProductBySlug(req, res);
		default:
			return res.status(400).json({ message: "Bad Request" });
	}
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { slug } = req.query;
	
	await database.connect();
	const product = await ProductModel.findOne({ slug }).lean();
	await database.disconnect();
	
	if (!product) return res.status(404).json({ message: "Product not found" });
	
	product.images = product.images.map((image: string) => {
		return image.includes("http") ? image : `${ process.env.HOST_NAME }products/${ image }`;
	});
	
	res.status(200).json(product);
};