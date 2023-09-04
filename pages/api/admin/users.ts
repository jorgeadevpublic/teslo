import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/database";
import { UserModel } from "@/models";
import { InterfaceUser } from "@/interfaces";
import { isValidObjectId } from "mongoose";

type Data =
	| { message: String }
	| InterfaceUser[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "GET":
			return getUsers(req, res);
		case "PUT":
			return updateUser(req, res);
		default:
			return res.status(405).end(`Method ${ req.method } Not Allowed`);
	}
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await database.connect();
	const users = await UserModel.find().select("-password").lean();
	await database.disconnect();
	
	return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { userId = "", role = "" } = req.body;
	
	if (!isValidObjectId(userId)) {
		res.status(400).json({ message: "Invalid user id" });
	}
	
	const validRoles = ["client", "admin", "seo", "super-admin"];
	if (!validRoles.includes(role)) {
		res.status(400).json({ message: "Invalid role" });
	}
	
	await database.connect();
	const user = await UserModel.findById(userId);
	
	if (!user) {
		await database.disconnect();
		return res.status(404).json({ message: "User not found" });
	}
	
	user.role = role;
	await user.save();
	await database.disconnect();
	
	return res.status(200).json({ message: "User updated successfully" });
};