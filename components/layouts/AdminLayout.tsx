import React, { ReactNode } from "react";
import Head from "next/head";
import { SideMenu } from "@/components/ui";
import { AdminNavBar } from "@/components/admin";
import { Box, Typography } from "@mui/material";

interface Props {
	children: ReactNode;
	title?: string;
	subTitle: string;
	icon?: ReactNode;
}

export const AdminLayout = ({ children, title, subTitle, icon }: Props) => {
	return (
		<>
			<Head>
				<title>{ title }</title>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<meta property="og:title" content={ title } />
			</Head>
			
			<nav>
				<AdminNavBar />
			</nav>
			
			<SideMenu />
			
			<main style={ {
				margin: "80px auto",
				maxWidth: "1920px",
				padding: "0 30px",
			} }>
				<Box display="flex" flexDirection="column">
					<Typography variant="h1" component="h1">{ icon }{ " " }{ title }</Typography>
					<Typography variant="h2" sx={{ mb: 1 }}>{ subTitle }</Typography>
				</Box>
				<Box className="fadeIn">
					{ children }
				</Box>
			</main>
		</>
	);
};