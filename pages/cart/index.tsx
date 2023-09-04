import { useContext, useEffect } from "react";
import { ShopLayout } from "@/components/layouts";
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { CardList, OrderSummary } from "@/components/cart";
import { CartContext } from "@/context";
import { useRouter } from "next/router";

const CartPage = () => {
	const { isLoaded, cart } = useContext(CartContext);
	const router = useRouter();
	
	useEffect(() => {
		if (isLoaded && cart.length === 0) {
			router.replace("/cart/empty");
		}
	}, [cart, isLoaded, router]);

	if (!isLoaded || cart.length === 0) {
		return <></>;
	}
	
	
	return (
		<ShopLayout title="Cart - 3" pageDescription="Store Cart">
			<Typography variant="h1">Cart</Typography>
			
			<Grid container>
				<Grid item xs={ 12 } sm={ 7 }>
					<CardList isEditable />
				</Grid>
				<Grid item xs={ 12 } sm={ 5 }>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Summary</Typography>
							<Divider sx={{ my: 1 }} />
							<OrderSummary />
							<Box sx={{ mt: 3 }}>
								<Button 
									color="secondary" 
									className="circular-btn" 
									fullWidth
									href="/checkout/address"
								>
									Checkout
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default CartPage;
