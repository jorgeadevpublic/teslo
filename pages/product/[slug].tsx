import React, { useContext, useState } from "react";
import { ShopLayout } from "@/components/layouts";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { ProductSizeSelector, ProductSlideShow } from "@/components/products";
import "react-slideshow-image/dist/styles.css";
import { ItemsCounter } from "@/components/ui";
import { InterfaceCartProduct, InterfaceProduct, InterfaceSize } from "@/interfaces";
import { GetStaticPaths, GetStaticProps } from "next";
import { databaseProduct } from "@/database";
import { useRouter } from "next/router";
import { CartContext } from "@/context";
// import { GetServerSideProps } from "next";
// import { databaseProduct } from "@/database";

interface Props {
	product: InterfaceProduct;
}

const ProductSlugPage = ({ product }: Props) => {
	const router = useRouter();
	// const { products: product, isError, isLoading } = useProducts(`/products/${ router.query.slug }`);
	const [tempCartProduct, setTempCartProduct] = useState<InterfaceCartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});
	const { addProductToCart } = useContext(CartContext);
	
	const selectedSize = (size: InterfaceSize) => {
		setTempCartProduct({ ...tempCartProduct, size });
	};
	
	const onAddProductToCart = () => {
		if (!tempCartProduct.size) return;
		addProductToCart(tempCartProduct);
		router.push("/cart");
	};
	
	const onUpdateQuantity = (quantity: number) => {
		setTempCartProduct({ ...tempCartProduct, quantity });
	};
	
	return (
		<ShopLayout title={ product.title } pageDescription={ product.description }>
			<Grid container spacing={ 3 }>
				<Grid item xs={ 12 } sm={ 7 }>
					<ProductSlideShow images={ product.images } />
				</Grid>
				<Grid item xs={ 12 } sm={ 5 }>
					<Box display="flex" flexDirection="column">
						<Typography variant="h1" component="h1">{ product.title }</Typography>
						<Typography variant="subtitle1" component="h2">{ `$${ product.price }` }</Typography>
						
						<Box sx={{ my: 2 }}>
							<Typography variant="subtitle2" component="p">Quantity</Typography>
							<ItemsCounter
								itemsInStock={ product.inStock }
								quantity={ tempCartProduct.quantity }
								setQuantity={ onUpdateQuantity }
							/>
							<ProductSizeSelector
								sizes={ product.sizes }
								selectedSize={ tempCartProduct.size }
								onSelectedSize={ selectedSize }
							/>
						</Box>
						
						{
							product.inStock ? (
								<Button
									color="secondary"
									className="circular-btn"
									onClick={ onAddProductToCart }
								>
									{
										tempCartProduct.size ? "Add to cart" : "Select a size"
									}
								</Button>
							) : (
								<Chip label="There are no items in Stock" color="error" variant="outlined" />
							)
						}
						
						<Box sx={{ mt: 3 }}>
							<Typography variant="h6" component="p" sx={{ mb: 2, fontWeight: 800 }}>Description</Typography>
							<Typography variant="body2" component="p">{ product.description }</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

// getServersideProps is used to fetch data on the server side
/*export const getServerSideProps: GetServerSideProps = async (context) => {
	const { slug } = context.params as { slug: string };
	const product = await databaseProduct.getProductBySlug(slug);
	if (!product) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: {
			product
		},
	};
};*/

// getStaticPaths is used to generate all the possible paths for the page
export const getStaticPaths: GetStaticPaths = async (context) => {
	const slugs = await databaseProduct.getAllProductsSlugs();
	
	return {
		paths: slugs.map(({ slug }) => ({
			params: { slug },
		})),
		fallback: "blocking",
	};
};

// getStaticProps is used to fetch data on the server side
export const getStaticProps: GetStaticProps = async (context) => {
	const { slug = "" } = context.params as { slug: string };
	const product = await databaseProduct.getProductBySlug(slug);
	
	if (!product) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	
	return {
		props: {
			product
		},
		revalidate: 86400,
	};
};

export default ProductSlugPage;