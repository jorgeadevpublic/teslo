import React, { useContext } from "react";
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import NextLink from "next/link";
import { UiContext } from "@/context";

const buttonStyle = {
	minWidth: 70,
	mx: .5,
};

export const AdminNavBar = () => {
	const { toggleMenuOpen } = useContext(UiContext);
	
	return (
		<AppBar>
			<Toolbar>
				<Link href="/" component={ NextLink } display="flex" alignItems="center">
					<Typography variant="h6">Teslo | </Typography>
					<Typography variant="h6" sx={{ ml: 0.5 }}>Shop</Typography>
				</Link>
				
				<Box flex={ 1 } />
				
				<Button
					sx={ buttonStyle }
					onClick={ toggleMenuOpen }
				>
					Menu
				</Button>
			</Toolbar>
		</AppBar>
	);
};