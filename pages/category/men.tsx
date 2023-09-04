import React from "react";
import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";
import { FullScreenLoading } from "@/components/ui";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";

const CategoryMenPage = () => {
	const { products, isError, isLoading } = useProducts("/products?gender=men");
	
	return (
		<ShopLayout title="Category Men Page" pageDescription="Category Men Page Description">
			<Typography variant="h1" component="h1">Store</Typography>
			<Typography variant="h2" sx={{ mb: 1 }}>All Men Products</Typography>
			
			{
				isLoading
					? <FullScreenLoading />
					: <ProductList products={ products } />
			}
		</ShopLayout>
	);
};

export default CategoryMenPage;
