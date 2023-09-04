import { useContext, useState } from "react";
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material";
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";

import { useRouter } from "next/router";

import { AuthContext, UiContext } from "@/context";

export const SideMenu = () => {
	const { isMenuOpen, toggleMenuOpen } = useContext(UiContext);
	const { user, isLoggedIn, logoutUser } = useContext(AuthContext);
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	
	const onSearchQuery = () => {
		if (searchQuery.trim().length === 0) return;
		navigateTo(`/search/${ searchQuery }`);
		setSearchQuery("");
	};
	
	const navigateTo = (path: string) => {
		toggleMenuOpen();
		router.push(path);
	};
	
	return (
		<Drawer
			open={ isMenuOpen }
			anchor="right"
			sx={ { backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" } }
			onClose={ toggleMenuOpen }
		>
			<Box sx={ { width: 250, paddingTop: 5 } }>
				<List>
					<ListItem>
						<Input
							autoFocus
							value={ searchQuery }
							onChange={ event => setSearchQuery(event.target.value) }
							onKeyUp={ event => event.key === "Enter" && onSearchQuery() }
							type="text"
							placeholder="Search product..."
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										onClick={ onSearchQuery }
									>
										<SearchOutlined/>
									</IconButton>
								</InputAdornment>
							}
						/>
					</ListItem>
					
					{
						isLoggedIn ? (
							<>
								<ListItemButton>
									<ListItemIcon>
										<AccountCircleOutlined/>
									</ListItemIcon>
									<ListItemText primary="Profile"/>
								</ListItemButton>
								
								<ListItemButton onClick={ () => navigateTo("/orders/history") }>
									<ListItemIcon>
										<ConfirmationNumberOutlined/>
									</ListItemIcon>
									<ListItemText primary="My Orders"/>
								</ListItemButton>
								<ListItemButton onClick={ logoutUser }>
									<ListItemIcon>
										<LoginOutlined />
									</ListItemIcon>
									<ListItemText primary="Log Out"/>
								</ListItemButton>
							</>
							
						) : (
							<>
								<ListItemButton
									onClick={ () => navigateTo(`/auth/login?page=${ router.asPath }`) }
								>
									<ListItemIcon>
										<VpnKeyOutlined/>
									</ListItemIcon>
									<ListItemText primary="Log In"/>
								</ListItemButton>
							</>
						)
					}
					
					<ListItemButton sx={ { display: { xs: "", sm: "none" } } } onClick={ () => navigateTo("/category/men") }>
						<ListItemIcon>
							<MaleOutlined/>
						</ListItemIcon>
						<ListItemText primary="Mens"/>
					</ListItemButton>
					
					<ListItemButton sx={ { display: { xs: "", sm: "none" } } } onClick={ () => navigateTo("/category/women") }>
						<ListItemIcon>
							<FemaleOutlined/>
						</ListItemIcon>
						<ListItemText primary="Womens"/>
					</ListItemButton>
					
					<ListItemButton sx={ { display: { xs: "", sm: "none" } } } onClick={ () => navigateTo("/category/kid") }>
						<ListItemIcon>
							<EscalatorWarningOutlined/>
						</ListItemIcon>
						<ListItemText primary="Kids"/>
					</ListItemButton>
					
					
					{ (user?.role === "admin" || user?.role === "super-admin") && (
						<>
							<Divider/>
							<ListSubheader sx={{ fontWeight: "bold", fontSize: "large" }}>Admin Panel</ListSubheader>
							
							<ListItemButton	onClick={ () => navigateTo("/admin") }>
								<ListItemIcon>
									<DashboardOutlined />
								</ListItemIcon>
								<ListItemText primary="Admin Panel"/>
							</ListItemButton>
							
							<ListItemButton onClick={ () => navigateTo("/admin/products") }>
								<ListItemIcon>
									<CategoryOutlined/>
								</ListItemIcon>
								<ListItemText primary="Products"/>
							</ListItemButton>
							
							<ListItemButton onClick={ () => navigateTo("/admin/orders") }>
								<ListItemIcon>
									<ConfirmationNumberOutlined/>
								</ListItemIcon>
								<ListItemText primary="Orders"/>
							</ListItemButton>
							
							<ListItemButton onClick={ () => navigateTo("/admin/users") }>
								<ListItemIcon>
									<AdminPanelSettings/>
								</ListItemIcon>
								<ListItemText primary="Users"/>
							</ListItemButton></>
					) }
				</List>
			</Box>
		</Drawer>
	);
};