import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/database";
import { UserModel } from "@/models";
import bcrypt from "bcryptjs";
import { jwt, validations } from "@/utils";

type Data =
	| {	message: String }
	| { token: string, user: {
		name: string,
		role: string,
		email: string
	} }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "POST":
			return registerUser(req, res);
		default:
			res.status(400).json({
				message: "Bad request"
			});
	}
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { name = "", email = "", password = "" } = req.body as {  name: string, email: string, password: string };
	
	if (password.length < 6) {
		return res.status(400).json({ message: "Password must be at least 6 characters" });
	}
	
	if (name.length < 3) {
		return res.status(400).json({ message: "Name must be at least 3 characters" });
	}
	
	if (!validations.isValidEmail(email)) {
		return res.status(400).json({ message: "Invalid email address" });
	}
	
	await database.connect();
	const user = await UserModel.findOne({ email });
	
	if (user) {
		await database.disconnect();
		return res.status(400).json({ message: "Invalid email address" });
	}
	
	const newUser = new UserModel({
		name,
		email: email.toLowerCase(),
		password: bcrypt.hashSync(password),
		role: "client"
	});
	
	try {
		await newUser.save({ validateBeforeSave: true });
	} catch (error) {
		await database.disconnect();
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
	
	const { role, _id } = newUser;
	const token = jwt.signToken(_id, email );
	
	return res.status(200).json({
		token,
		user: {
			name, email, role
		}
	});
};