import { Schema, model, Model, models } from "mongoose";
import { InterfaceUser } from "@/interfaces";

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: {
		type: String,
		enum: {
			values: ["client", "admin", "seo", "super-admin"],
			message: "{VALUE} is not supported",
			default: "client",
			required: true,
		},
	},
}, { timestamps: true });

const UserModel: Model<InterfaceUser> = models.User || model("User", userSchema);

export default UserModel;