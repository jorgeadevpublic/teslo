import { database } from "@/database";
import { UserModel } from "@/models";
import bcrypt from "bcryptjs";

export const checkUserEmailAndPassword = async (email: string, password: string) => {
	await database.connect();
	const user = await UserModel.findOne({ email });
	await database.disconnect();
	
	if (!user) {
		return null;
	}
	
	if (!bcrypt.compareSync(password, user.password!)) {
		return null;
	}
	
	const { role, name, _id } = user;
	
	return {
		_id,
		email: email.toLowerCase(),
		role,
		name,
	};
};

// Create or verify oAuth user
export const checkUserOAuth = async (oAuthEmail: string, oAuthName: string) => {
	await database.connect();
	const user = await UserModel.findOne({ email: oAuthEmail });
	
	if (user) {
		await database.disconnect();
		const { role, name, _id, email } = user;
		return { _id, email, role, name };
	}
	
	const newUser = new UserModel({
		email: oAuthEmail,
		name: oAuthName,
		password: "@",
		role: "client",
	});
	
	await newUser.save();
	await database.disconnect();
	
	const { role, name, _id, email } = newUser;
	return { _id, email, role, name };
};