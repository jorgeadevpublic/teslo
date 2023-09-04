import { NextApiRequest, NextApiResponse } from "next";
import formidable, { IncomingForm } from "formidable";
// import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data = {
	message: String;
}

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "POST":
			return uploadFiles(req, res);
		default:
			res.status(400).json({ message: "Bad Request" });
	}
}

const uploadFiles = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const imageUrl = await parseFiles(req);
	res.status(200).json({ message: imageUrl });
};

const parseFiles = async (req: NextApiRequest): Promise<string> => {
	return new Promise((resolve, reject) => {
		const customOptions = {
			// uploadDir: "./public" ,
			// keepExtensions: true,
			// allowEmptyFiles: false,
			// maxFileSize: 5 * 1024 * 1024,
			multiples: true,
			// filter: filterFunction
		};
		const form = formidable(customOptions);
		form.parse(req, async (err, fields, files) => {
			if (err) { return reject(err); }
			const filePath = await saveFile(files.file as formidable.File[]);
			resolve(filePath);
		});
	});
};

const saveFile = async (files: formidable.File[]): Promise<string> => {
	//const data = fs.readFileSync(file.filepath);
	// const data = fs.readFileSync(file.filepath);
	// fs.writeFileSync(`./public/${ file.originalFilename }`, data);
	// fs.unlinkSync(file.filepath);
	// return;
	// console.log(files[0].filepath);
	const { secure_url } = await cloudinary.uploader.upload(files[0].filepath, {
		multiple: true,
	});
	return secure_url;
};