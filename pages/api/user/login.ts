import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/database";
import { UserModel } from "@/models";
import bcrypt from "bcryptjs";
import { jwt } from "@/utils";

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
			return loginUser(req, res);
		default:
			res.status(400).json({
				message: "Bad request"
			});
	}
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { email = "", password = "" } = req.body;
	
	await database.connect();
	const user = await UserModel.findOne({ email });
	await database.disconnect();
	
	if (!user) {
		return res.status(400).json({ message: "Email or password not match - EMAIL" });
	}
	
	if (!bcrypt.compareSync(password, user.password!)) {
		return res.status(400).json({ message: "Email or password not match - PASSWORD" });
	}
	
	const { role, name, _id } = user;
	const token = jwt.signToken(_id, email );
	
	return res.status(200).json({
		token,
		user: {
			email, role, name
		}
	});
};