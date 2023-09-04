import React, { ReactNode } from "react";
import Head from "next/head";
import { NavBar, SideMenu } from "@/components/ui";

interface Props {
	children: ReactNode;
	title?: string;
	pageDescription: string;
	imageFullUrl?: string;
}

export const ShopLayout = ({ children, title, pageDescription, imageFullUrl }: Props) => {
	return (
		<>
			<Head>
				<title>{ title }</title>
				<meta name="description" content={ pageDescription } />
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<meta property="og:title" content={ title } />
				<meta property="og:description" content={ pageDescription } />
				{ imageFullUrl && <meta property="og:image" content={ imageFullUrl } /> }
			</Head>
			
			<nav>
				<NavBar />
			</nav>
			
			<SideMenu />
			
			<main style={ {
				margin: "80px auto",
				maxWidth: "1920px",
				padding: "0 30px",
			} }>
				{ children }
			</main>
			
			<footer>
				{/*<Footer />*/ }
			</footer>
		</>
	);
};