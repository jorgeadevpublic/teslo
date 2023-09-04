import { model, Model, models, Schema } from "mongoose";
import { InterfaceProduct } from "@/interfaces";

const productSchema = new Schema<InterfaceProduct>({
	description: { type: String, required: true, default: "" },
	images: [{ type: String }],
	inStock: { type: Number, required: true, default: 0 },
	price: { type: Number, required: true, default: 0 },
	sizes: [{
		type: String,
		enum: {
			values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
			message: "No is a valid size"
		}
	}],
	slug: { type: String, required: true, unique: true },
	tags: [{ type: String }],
	title: { type: String, required: true, default: "" },
	type: {
		type: String,
		enum: {
			values: ["shirts", "pants", "hoodies", "hats"],
			message: "{ VALUE } is not a valid type"
		},
		default: "shirts"
	},
	gender: {
		type: String,
		enum: {
			values: ["men", "women", "kid", "unisex"],
			message: "{ VALUE } is not a valid gender"
		},
		default: "unisex"
	},
}, { timestamps: true });

productSchema.index({ title: "text", tags: "text" });

const ProductModel: Model<InterfaceProduct> = models.Product || model("Product", productSchema);

export default ProductModel;