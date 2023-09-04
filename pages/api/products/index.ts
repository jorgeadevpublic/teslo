import { NextApiRequest, NextApiResponse } from "next";
import { database, SHOP_CONSTANTS } from "@/database";
import { ProductModel } from "@/models";
import { InterfaceProduct } from "@/interfaces";

type Data =
	| { message: string }
	| InterfaceProduct[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "GET":
			return getProducts(req, res);
		default:
			return res.status(200).json({ message: "Bad Request" });
	}
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { gender= "all" } = req.query;
	let condition = {};
	if (gender !== "all" && SHOP_CONSTANTS.validGenders.includes(`${ gender }`)) {
		condition = { gender };
	}
	await database.connect();
	const products = await ProductModel.find(condition).select("title images price inStock slug -_id").lean();
	await database.disconnect();
	
	const updatedProducts = products.map((product: InterfaceProduct) => {
		product.images = product.images.map((image: string) => {
			return image.includes("http") ? image : `${ process.env.HOST_NAME }products/${ image }`;
		});
		return product;
	});
	
	return res.status(200).json(updatedProducts);
};