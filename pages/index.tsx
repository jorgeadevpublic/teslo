import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";
import { FullScreenLoading } from "@/components/ui";

function HomePage(): JSX.Element {
	const { products, isError, isLoading } = useProducts("/products");
	
	return (
		<ShopLayout title="Teslo Shop | Home" pageDescription="Find better Teslo Shop products here">
			<Typography variant="h1" component="h1">Store</Typography>
			<Typography variant="h2" sx={{ mb: 1 }}>All Products</Typography>
			
			{
				isLoading
					? <FullScreenLoading />
					: <ProductList products={ products } />
			}
		</ShopLayout>
	);
}

export default HomePage;