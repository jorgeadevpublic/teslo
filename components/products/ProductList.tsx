import React from "react";
import { Grid } from "@mui/material";
import { InterfaceProduct } from "@/interfaces";
import { ProductCard } from "@/components/products/ProductCard";

interface ProductListProps {
	products: InterfaceProduct[];
}

export const ProductList = ({ products }: ProductListProps) => {
	return (
		<Grid container spacing={ 4 }>
			{
				products.map((product) => (
					<ProductCard product={ product } key={ product.slug } />
				))
			}
		</Grid>
	);
};