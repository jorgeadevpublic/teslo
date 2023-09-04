import { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/database";
import { UserModel } from "@/models";
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
		case "GET":
			return checkJWT(req, res);
		default:
			res.status(400).json({
				message: "Bad request"
			});
	}
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { token = "" } = req.cookies;
	
	let userId: string = "";
	
	try {
		userId = await jwt.isValidToken(token);
	} catch (error) {
		console.log(error);
		return res.status(401).json({ message: "Authorization token invalid" });
	}
	
	await database.connect();
	const user = await UserModel.findById(userId).lean();
	await database.disconnect();
	
	if (!user) {
		return res.status(401).json({ message: "User not found" });
	}
	
	const { _id, role, name, email } = user;
	res.status(200).json({
		token: jwt.signToken(_id, email),
		user: {
			email, role, name
		}
	});
};