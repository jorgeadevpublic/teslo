import React from "react";
import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";
import { FullScreenLoading } from "@/components/ui";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";

const CategoryWomenPage = () => {
	const { products, isError, isLoading } = useProducts("/products?gender=women");
	
	return (
		<ShopLayout title="Category Women Page" pageDescription="Category Women Page Description">
			<Typography variant="h1" component="h1">Store</Typography>
			<Typography variant="h2" sx={ { mb: 1 } }>All Women Products</Typography>
			
			{
				isLoading
					? <FullScreenLoading/>
					: <ProductList products={ products }/>
			}
		</ShopLayout>
	);
};

export default CategoryWomenPage;
