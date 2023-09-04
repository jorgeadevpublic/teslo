import { useContext, useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { CardList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import NextLink from "next/link";
import { CartContext } from "@/context";
import { countries } from "@/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const SummaryPage = () => {
	const router = useRouter();
	const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
	const [isPosting, setIsPosting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	
	useEffect(() => {
		if (!Cookies.get("firstName")) {
			router.push("/checkout/address");
		}
	}, [router]);
	
	const onCreateOrder = async () => {
		setIsPosting(true);
		const { hasError, message } = await createOrder();
		
		if (hasError) {
			setIsPosting(false);
			setErrorMessage(message);
			return;
		}
		
		router.replace(`/orders/${ message }`);
	};
	
	if (!shippingAddress) {
		return <></>;
	}
	const { firstName, lastName, address, address2 = "", city, country, phone, zip } = shippingAddress;
	
	return (
		<ShopLayout title="Order Summary" pageDescription="order Summary Page">
			<Typography variant="h1">Order Summary</Typography>
			
			<Grid container>
				<Grid item xs={ 12 } sm={ 7 }>
					<CardList />
				</Grid>
				<Grid item xs={ 12 } sm={ 5 }>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Summary ({ numberOfItems } { numberOfItems > 1 ? "items" : "item" })</Typography>
							<Divider sx={{ my: 1 }} />
							
							<Box display="flex" justifyContent="space-between">
								<Typography variant="subtitle1">Delivery Address</Typography>
								<Link href="/checkout/address" underline="always" color="secondary" component={ NextLink }>Edit Address</Link>
							</Box>
							<Typography>{ firstName }  { lastName }</Typography>
							<Typography>{ address }{ address2 ? `, ${ address2 }` : "" }</Typography>
							<Typography>{ city }, { zip }</Typography>
							<Typography>{ countries?.find(c => c.code === country )?.name }</Typography>
							<Typography>{ phone }</Typography>
							<Divider sx={{ my: 1 }} />
							
							<Box display="flex" justifyContent="end">
								<Link href="/cart" underline="always" color="secondary" component={ NextLink }>Edit Products</Link>
							</Box>
							<OrderSummary />
							<Box sx={{ mt: 3 }} display="flex" flexDirection="column">
								<Button
									color="secondary"
									className="circular-btn"
									fullWidth
									onClick={ onCreateOrder }
									disabled={ isPosting }
								>
									Confirm Order
								</Button>
								<Chip
									color="error"
									label={ errorMessage }
									sx={{ display: errorMessage ? "flex" : "none", mt: 2 }}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default SummaryPage;
