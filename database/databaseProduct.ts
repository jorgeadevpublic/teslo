import { database } from "@/database";
import { ProductModel } from "@/models";
import { InterfaceProduct } from "@/interfaces";

interface ProductSlug {
	slug: string;
}

export const getProductBySlug = async (slug: string): Promise<InterfaceProduct | null> => {
	await database.connect();
	const product = await ProductModel.findOne({ slug }).lean();
	await database.disconnect();
	
	if (!product) {
		return null;
	}
	
	product.images = product.images.map((image: string) => {
		return image.includes("http") ? image : `${ process.env.HOST_NAME }products/${ image }`;
	});
	
	return JSON.parse(JSON.stringify(product));
};

export const getAllProductsSlugs = async (): Promise<ProductSlug[]> => {
	await database.connect();
	const slugs = await ProductModel.find().select("slug -_id").lean();
	await database.disconnect();
	
	return slugs;
};

export const getProductBySearch = async (query: string): Promise<InterfaceProduct[]> => {
	query = query.toString().toLowerCase();
	
	await database.connect();
	const products = await ProductModel
		.find({
			$text: { $search: query }
		})
		.select("title images price inStock slug -_id")
		.lean();
	await database.disconnect();
	
	const updatedProducts = products.map((product: InterfaceProduct) => {
		product.images = product.images.map((image: string) => {
			return image.includes("http") ? image : `${ process.env.HOST_NAME }products/${ image }`;
		});
		return product;
	});
	
	return updatedProducts;
};

export const getAllProducts = async (): Promise<InterfaceProduct[]> => {
	await database.connect();
	// const products = await ProductModel.find().select("title images price inStock slug -_id").lean();
	const products = await ProductModel.find().lean();
	await database.disconnect();
	
	const updatedProducts = products.map((product: InterfaceProduct) => {
		product.images = product.images.map((image: string) => {
			return image.includes("http") ? image : `${ process.env.HOST_NAME }products/${ image }`;
		});
		return product;
	});
	
	return JSON.parse(JSON.stringify(updatedProducts));
	// return products;
};