import { ShopLayout } from "@/components/layouts";
import { Box, Typography } from "@mui/material";
import { ProductList } from "@/components/products";
import { GetServerSideProps } from "next";
import { databaseProduct } from "@/database";
import { InterfaceProduct } from "@/interfaces";

interface Props {
	products: InterfaceProduct[],
	foundProducts: boolean
	query: string
}

const SearchPage = ({ products, foundProducts, query }: Props) => {
	
	return (
		<ShopLayout title="Teslo Shop | Home" pageDescription="Find better Teslo Shop products here">
			<Typography variant="h1" component="h1">Search Product</Typography>
			
			{
				foundProducts
					? <Typography variant="h2" sx={ { mb: 1 } } textTransform="capitalize">Query: { query }</Typography>
					: (
						<Box display="flex" >
							<Typography variant="h2" sx={ { mb: 1 } }>No products found:</Typography>
							<Typography variant="h2" sx={ { ml: 1 } } color="secondary" textTransform="capitalize">{ query }</Typography>
						</Box>
					)
			}
			
			<Typography variant="h2" sx={ { mb: 1 } }>ABC - 123</Typography>
			
			<ProductList products={ products }/>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time.
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const { query = "" } = params as { query: string };
	
	if (query.length === 0 ) {
		return {
			redirect: {
				destination: "/",
				permanent: true
			}
		};
	}
	
	let products = await databaseProduct.getProductBySearch(query );
	const foundProducts = products.length > 0;
	
	if (!foundProducts) {
		products = await databaseProduct.getAllProducts();
	}
	
	return {
		props: {
			query,
			products,
			foundProducts
		}
	};
};

export default SearchPage;