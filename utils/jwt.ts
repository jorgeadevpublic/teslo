import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
	if (!process.env.JWT_SECRET_SEED) {
		throw new Error("JWT_SECRET not found");
	}
	
	return jwt.sign(
		{ _id, email },
		process.env.JWT_SECRET_SEED,
		{ expiresIn: "1d" }
	);
};

export const isValidToken = (token: string): Promise<string> => {
	if (!process.env.JWT_SECRET_SEED) {
		throw new Error("JWT_SECRET not found");
	}

	if (token.length <= 10) {
		return Promise.reject("Invalid JWT");
	}
	
	return new Promise((resolve, reject) => {
		try {
			jwt.verify(token, process.env.JWT_SECRET_SEED || "", (error, decoded) => {
				if (error) return reject("Invalid token");
				const { _id } = decoded as { _id: string };
				resolve( _id );
			});
		} catch (error) {
			return reject("Invalid token");
		}
	});
};