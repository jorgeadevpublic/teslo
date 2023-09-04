import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { InterfacePaypal } from "@/interfaces";
import { database } from "@/database";
import { OrderModel } from "@/models";

type Data = {
	message: String;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case "POST":
			return await payOrder(req, res);
		default:
			res.status(405).json({ message: "Method not allowed" });
	}
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	// TODO: Validate user session
	const paypalBearerToken = await getPaypalBearerToken();
	
	if (!paypalBearerToken) {
		return res.status(401).json({ message: "Paypal token not found." });
	}
	
	// TODO: Validate mongoId
	const { transactionId = "", orderId = "" } = req.body;
	
	const { data } = await axios.get<InterfacePaypal.PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`, {
		headers: {
			"Authorization": `Bearer ${ paypalBearerToken }`,
		}
	});
	
	if (data.status !== "COMPLETED") {
		return res.status(401).json({ message: "Paypal payment not completed." });
	}
	
	await database.connect();
	const databaseOrder = await OrderModel.findById(orderId);
	if (!databaseOrder) {
		await database.disconnect();
		return res.status(401).json({ message: "Order not found." });
	}
	
	if (databaseOrder.total !== Number(data.purchase_units[0].amount.value)) {
		await database.disconnect();
		return res.status(401).json({ message: "Order total does not match." });
	}
	
	databaseOrder.transactionId = transactionId;
	databaseOrder.isPaid = true;
	await databaseOrder.save();
	await database.disconnect();
	
	return res.status(200).json({ message: "Order payed successfully!" });
};

const getPaypalBearerToken = async (): Promise<string | null> => {
	const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
	const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
	
	const base64Token = Buffer.from(`${ PAYPAL_CLIENT_ID }:${ PAYPAL_SECRET }`, "utf-8").toString("base64");
	const body = new URLSearchParams("grant_type=client_credentials");
	
	try {
		const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || "", body, {
			headers: {
				"Authorization": `Basic ${ base64Token }`,
				"Content-Type": "application/x-www-form-urlencoded",
			}
		});
		
		return data.access_token;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log(error.response?.data);
		} else {
			console.log(error);
		}
		return null;
	}
};