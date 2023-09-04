import React, { useState } from "react";
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { CardList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { databaseOrder } from "@/database";
import { InterfaceOrder } from "@/interfaces";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { LinkDescription } from "@paypal/paypal-js/types/apis/orders";
import { tesloApi } from "@/api";
import { useRouter } from "next/router";

export type OrderResponseBodyMinimal = {
	id: string;
	status:
		| "CREATED"
		| "SAVED"
		| "APPROVED"
		| "VOIDED"
		| "COMPLETED"
		| "PAYER_ACTION_REQUIRED";
	links: LinkDescription[];
};

interface OrderPageProps {
	order: InterfaceOrder;
}

const OrderPage = ({ order }: OrderPageProps) => {
	const router = useRouter();
	const [isPaying, setIsPaying] = useState(false);
	const onOrderCompleted = async (details: OrderResponseBodyMinimal) => {
		if (details.status !== "COMPLETED") {
			return alert("Order not completed");
		}
		
		setIsPaying(true);
		
		try {
			const { data } = await tesloApi.post("/orders/pay", {
				transactionId: details.id,
				orderId: order._id,
			});
			
			router.reload();
		} catch (error) {
			setIsPaying(false);
			console.log(error);
			alert("Error while paying order");
		}
	};
	
	return (
		<ShopLayout title="Order Resume" pageDescription="Order Resume Page">
			<Typography variant="h1" component="h1">Order: { order._id }</Typography>
			
			{ order.isPaid ? (
				<Chip
					sx={{ my: 2, height: 40, width: 200 }}
					label="Payed"
					variant="outlined"
					color="success"
					icon={ <CreditScoreOutlined /> }
				/>
			) : (
				<Chip
					sx={{ my: 2, height: 40, width: 200 }}
					label="Pay Pending"
					variant="outlined"
					color="error"
					icon={ <CreditCardOffOutlined /> }
				/>
			) }
			
			<Grid container sx={{ mt: 2 }} className="fadeIn">
				<Grid item xs={ 12 } sm={ 7 }>
					<CardList products={ order.orderItems } />
				</Grid>
				<Grid item xs={ 12 } sm={ 5 }>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Summary ({ `${ order.numberOfItems } item${ order.numberOfItems > 1 ? "s" : "" }` })</Typography>
							<Divider sx={{ my: 1 }} />
							
							<Box display="flex" justifyContent="space-between">
								<Typography variant="subtitle1">Delivery Address</Typography>
							</Box>
							<Typography>{ order.shippingAddress.firstName } { order.shippingAddress.lastName }</Typography>
							<Typography>{ order.shippingAddress.address } { order.shippingAddress.address2 }</Typography>
							<Typography>{ order.shippingAddress.city }, { order.shippingAddress.zip }</Typography>
							<Typography>{ order.shippingAddress.country }</Typography>
							<Typography>{ order.shippingAddress.phone }</Typography>
							<Divider sx={{ my: 1 }} />
							
							<OrderSummary
								values={{
									numberOfItems:  order.numberOfItems,
									subTotal: order.subTotal,
									tax: order.tax,
									total: order.total,
								}}
							/>
							
							<Box sx={{ mt: 3 }} display="flex" flexDirection="column">
								<Box
									display="flex"
									justifyContent="center"
									className="fadeIn"
									sx={{ display: isPaying ? "flex" : "none" }}
								>
									<CircularProgress />
								</Box>
								<Box
									sx={{ display: isPaying ? "none" : "flex", flex: 1 }}
									flexDirection="column"
								>
									{ order.isPaid ? (
										<Chip
											sx={{ my: 2, height: 40 }}
											label="Order Payed"
											variant="outlined"
											color="success"
											icon={ <CreditScoreOutlined /> }
										/>
									) : (
										<PayPalButtons
											createOrder={(data, actions) => {
												return actions.order.create({
													purchase_units: [
														{
															amount: {
																value: `${ order.total }`,
															},
														},
													],
												});
											}}
											onApprove={(data, actions) => {
												return actions.order!.capture().then((details) => {
													onOrderCompleted(details);
												});
											}}
										/>
									) }
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const { id = "" } = query;
	const session: any = await getSession({ req });
	
	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?page=/orders/${ id }`,
				permanent: false,
			},
		};
	}
	
	const order = await databaseOrder.getOrderById(id.toString());
	if (!order) {
		return {
			redirect: {
				destination: "/orders/history",
				permanent: false,
			},
		};
	}
	
	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: "/orders/history",
				permanent: false,
			},
		};
	}
	
	return {
		props: {
			order,
		}
	};
};

export default OrderPage;
