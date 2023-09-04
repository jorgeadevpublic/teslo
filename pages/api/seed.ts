import { NextApiRequest, NextApiResponse } from "next";
import { database, seedDataBase } from "@/database";
import { ProductModel, UserModel } from "@/models";

type Data = {
	message: String;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (process.env.NODE_ENV === "production") {
		return res.status(403).json({ message: "You don't have access to this service" });
	}
	await database.connect();
	await UserModel.deleteMany();
	await UserModel.insertMany(seedDataBase.initialData.users);
	await ProductModel.deleteMany();
	await ProductModel.insertMany(seedDataBase.initialData.products);
	await database.disconnect();
	res.status(200).json({ message: "Process finished successfully" });
}