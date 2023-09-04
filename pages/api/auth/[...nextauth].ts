import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { databaseUsers } from "@/database";

export const AuthOptions = {
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID ?? "",
			clientSecret: process.env.GITHUB_SECRET ?? "",
		}),
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email:", type: "email", placeholder: "johndoe@gmail.com" },
				password: { label: "Password:", type: "password", placeholder: "********" },
			},
			// @ts-ignore
			async authorize(credentials) {
				return await databaseUsers.checkUserEmailAndPassword(credentials!.email, credentials!.password);
			},
		}),
	],
	
	// Custom Pages
	pages: {
		signIn: "/auth/login",
		newUser: "/auth/register",
	},
	
	session: {
		maxAge: 30 * 24 * 60 * 60, // 30 days
		strategy: "jwt",
		updateAge: 24 * 60 * 60, // 24 hours
	},
	
	// Callbacks
	callbacks: {
		// @ts-ignore
		// async signIn({ user, account, profile, email, credentials }) {
		// 	console.log({ user, account, profile, email, credentials });
		// 	return true;
		// },
		// @ts-ignore
		// async redirect({ url, baseUrl }) {
		// 	return baseUrl;
		// },
		// @ts-ignore
		async jwt({ token, user, account, profile, isNewUser }) {
			// console.log({ account });
			if (account) {
				token.accessToken = account.access_token;
				switch (account.type) {
					case "oauth":
						token.user = await databaseUsers.checkUserOAuth(user?.email || "", user?.name || "");
						break;
					case "credentials":
						token.user = user;
						break;
				}
			}
			return token;
		},
		// @ts-ignore
		async session({ session, token, user }) {
			session.accessToken = token.accessToken;
			session.user = token.user;
			return session;
		}
	},
};
// @ts-ignore
export default NextAuth(AuthOptions);