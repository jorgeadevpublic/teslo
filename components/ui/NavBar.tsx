import React, { useContext, useState } from "react";
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material";
import NextLink from "next/link";
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { UiContext, CartContext } from "@/context";

const buttonStyle = {
	minWidth: 70,
	mx: .5,
};

export const NavBar = () => {
	const { route, push } = useRouter();
	const { toggleMenuOpen } = useContext(UiContext);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchVisisble, setIsSearchVisible] = useState(false);
	const { numberOfItems } = useContext(CartContext);
	
	const onSearchQuery = () => {
		if (searchQuery.trim().length === 0) return;
		push(`/search/${ searchQuery }`);
		setSearchQuery("");
	};
	
	return (
		<AppBar>
			<Toolbar>
				<Link href="/" component={ NextLink } display="flex" alignItems="center">
					<Typography variant="h6">Teslo | </Typography>
					<Typography variant="h6" sx={{ ml: 0.5 }}>Shop</Typography>
				</Link>
				
				<Box flex={ 1 } />
				
				<Box sx={{ display: isSearchVisisble ? "none" : { xs: "none", sm: "block" } }} className="fadeIn">
					<Link href="/category/men" component={ NextLink }>
						<Button color={ route === "/category/men" ? "primary" : "info" } sx={ buttonStyle }>Men</Button>
					</Link>
					<Link href="/category/women" component={ NextLink }>
						<Button color={ route === "/category/women" ? "primary" : "info" } sx={ buttonStyle }>Women</Button>
					</Link>
					<Link href="/category/kid" component={ NextLink }>
						<Button color={ route === "/category/kid" ? "primary" : "info" } sx={ buttonStyle }>Kid</Button>
					</Link>
				</Box>
				
				<Box flex={ 1 } />
				
				{
					isSearchVisisble ? (
						<Input
							sx={{ display: { xs: "none", sm: "flex" } }}
							className="fadeIn"
							autoFocus
							value={ searchQuery }
							onChange={ event => setSearchQuery(event.target.value) }
							onKeyUp={ event => event.key === "Enter" && onSearchQuery()}
							type='text'
							placeholder="Search..."
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										onClick={ () => setIsSearchVisible(false) }
									>
										<ClearOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					) : (
						<IconButton
							onClick={ () => setIsSearchVisible(true) }
							className="fadeIn"
							sx={{ display: { xs: "none", sm: "flex" } }}
						>
							<SearchOutlined />
						</IconButton>
					)
				}
				
				
				
				<IconButton
					sx={{ display: { xs: "flex", sm: "none" } }}
					onClick={ toggleMenuOpen }
					className="fadeIn"
				>
					<SearchOutlined />
				</IconButton>
				
				<Link href="/cart" component={ NextLink }>
					<IconButton>
						<Badge badgeContent={ numberOfItems > 9 ? "9+" : numberOfItems } color="secondary">
							<ShoppingCartOutlined />
						</Badge>
					</IconButton>
				</Link>
				
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