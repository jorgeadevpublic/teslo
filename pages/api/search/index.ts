import { NextApiRequest, NextApiResponse } from "next";

type Data = {
	message: String;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	res.status(404).json({ message: "Not Found" });
}