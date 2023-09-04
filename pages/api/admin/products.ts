import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/database";
import { ProductModel } from "@/models";
import { InterfaceProduct } from "@/interfaces";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data =
	| {	message: String }
	| InterfaceProduct[]
	| InterfaceProduct;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "GET":
			return getProducts(req, res);
		case "POST":
			return createProduct(req, res);
		case "PUT":
			return updateProduct(req, res);
		default:
			res.status(400).json({ message: "Bad Request" });
	}
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
	await database.connect();
	const products = await ProductModel.find()
		.sort({ title: "asc" })
		.lean();
	await database.disconnect();
	
	const updatedProducts = products.map((product: InterfaceProduct) => {
		product.images = product.images.map((image: string) => {
			return image.includes("http") ? image : `${ process.env.HOST_NAME }products/${ image }`;
		});
		return product;
	});
	
	res.status(200).json(updatedProducts );
}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { _id = "", images = [] } = req.body as InterfaceProduct;
	
	if (!isValidObjectId(_id)) {
		return res.status(400).json({ message: "Bad Request, Not valid product id." });
	}
	if (images.length < 2) {
		return res.status(400).json({ message: "Bad Request, Minimum number of images not provided." });
	}
	try {
		await database.connect();
		const product = await ProductModel.findById(_id);
		if (!product) {
			return res.status(400).json({ message: "Bad Request, Product not found." });
		}
		
		// TODO: Delete old images from cloudinary
		// https://res.cloudinary.com/vitodev/image/upload/v1693800027/hzxgjgw23fmthtrogods.webp
		for (const image of product.images) {
			if (!images.includes(image)) {
				// Delete image from cloudinary
				const publicId = image.split("/").pop()?.split(".")[0];
				console.log(publicId);
				await cloudinary.uploader.destroy(publicId as string);
			}
		}
		
		await product.updateOne(req.body);
		await database.disconnect();
		return res.status(200).json(product);
	} catch (error) {
		console.log(error);
		await database.disconnect();
		return res.status(400).json({ message: "Bad Request, Review server console." });
	}
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { images = [] } = req.body as InterfaceProduct;
	
	if (images.length < 2) {
		return res.status(400).json({ message: "Bad Request, Minimum number of images not provided." });
	}
	
	// TODO: probably we have a localhost:3000/products/image.jpg
	
	try {
		await database.connect();
		const productInDatabase =await ProductModel.findOne({ slug: req.body.slug });
		if (productInDatabase) {
			return res.status(400).json({ message: "Bad Request, Product already exists with these slug." });
		}
		const product = new ProductModel(req.body);
		await product.save();
		await database.disconnect();
		return res.status(201).json(product);
	} catch (error) {
		console.log(error);
		await database.disconnect();
		return res.status(400).json({ message: "Bad Request, Review server console." });
	}
};