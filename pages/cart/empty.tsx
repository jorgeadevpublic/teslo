import React from "react";
import { ShopLayout } from "@/components/layouts";
import { Box, Link, Typography } from "@mui/material";
import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import NextLink from "next/link";

const EmptyPage = () => {
	return (
		<ShopLayout title="Empty Cart" pageDescription="You don't have items in your cart">
			<Box
				display="flex"
				sx={{ flexDirection: { xs: "column", sm: "row" } } }
				justifyContent="center"
				alignItems="center"
				height="calc(100vh - 200px)"
			>
				<RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
				<Box display="flex" flexDirection="column" alignItems="center">
					<Typography>Empty Cart</Typography>
					<Link href="/" typography="h4" underline="none" color="secondary" component={ NextLink }>Go Back</Link>
				</Box>
			</Box>
		</ShopLayout>
	);
};

export default EmptyPage;
