import React, { useContext } from "react";
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { ItemsCounter } from "@/components/ui";
import { CartContext } from "@/context";
import { InterfaceCartProduct, InterfaceOrderItem } from "@/interfaces";

interface CardListProps {
	isEditable?: boolean;
	products?: InterfaceOrderItem[];
}

export const CardList = ({ isEditable = false, products }: CardListProps) => {
	const { cart, updateCartProductQuantity, removeProductFromCart } = useContext(CartContext);
	
	const onUpdateCartProductQuantity = (product: InterfaceCartProduct, newQuantityValue: number) => {
		product.quantity = newQuantityValue;
		updateCartProductQuantity(product);
	};
	
	const productsToShow = products || cart;
	
	return (
		<Box>
			{ productsToShow.map((product) => (
				<Grid container key={ product.slug + product.size } spacing={ 2 } sx={{ mb: 1 }}>
					<Grid item xs={ 3 }>
						<Link href={ `/product/${ product.slug }` } typography="h4" underline="none" color="secondary" component={ NextLink }>
							<CardActionArea>
								<CardMedia image={ product.image } component="img" sx={{ borderRadius: "5px" }} />
							</CardActionArea>
						</Link>
					</Grid>
					<Grid item xs={ 7 }>
						<Box display="flex" flexDirection="column">
							<Typography variant="body1">{ product.title }</Typography>
							<Typography variant="body1">Size: <strong>{ product.size }</strong></Typography>
							{
								isEditable
									? <ItemsCounter
										itemsInStock={ 10 }
										quantity={ product.quantity }
										setQuantity={ (value) => onUpdateCartProductQuantity(product as InterfaceCartProduct, value) }
									/>
									: <Typography variant="h5">{ product.quantity } item{ product.quantity > 1 ? "s" : "" }</Typography>
							}
						</Box>
					</Grid>
					<Grid item xs={ 2 }>
						<Grid item xs={ 2 } display="flex" alignItems="center" flexDirection="column">
							<Typography>{ `$${ product.price }` }</Typography>
							{
								isEditable && (
									<Button
										variant="outlined"
										color="secondary"
										onClick={ () => removeProductFromCart(product as InterfaceCartProduct) }
									>
										Remove
									</Button>
								)
							}
							
						</Grid>
					</Grid>
				</Grid>
			)) }
		</Box>
	);
};