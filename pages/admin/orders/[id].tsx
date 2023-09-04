import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import { CardList, OrderSummary } from "@/components/cart";
import { AdminLayout } from "@/components/layouts";
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { GetServerSideProps } from "next";
import { databaseOrder } from "@/database";
import { InterfaceOrder } from "@/interfaces";

interface OrderPageProps {
	order: InterfaceOrder;
}

const OrderPage = ({ order }: OrderPageProps) => {
	return (
		<AdminLayout
			title="Order Resume"
			subTitle={ `Order Id: ${ order._id }` }
			icon={ <AirplaneTicketOutlined />}
		>
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
					label="Pending Payment"
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
									sx={{ display: "flex", flex: 1 }}
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
										<Chip
											sx={{ my: 2, height: 40 }}
											label="Pending Payment"
											variant="outlined"
											color="error"
											icon={ <CreditCardOffOutlined /> }
										/>
									) }
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const { id = "" } = query;
	
	const order = await databaseOrder.getOrderById(id.toString());
	if (!order) {
		return {
			redirect: {
				destination: "/admin/orders",
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
