import React from "react";
import { ShopLayout } from "@/components/layouts";
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from "@mui/x-data-grid";
import NextLink from "next/link";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { databaseOrder } from "@/database";
import { InterfaceOrder } from "@/interfaces";

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", width: 80 },
	{ field: "fullname", headerName: "Full Name", width: 250 },
	{ field: "orderId", headerName: "Order Id", width: 250 },
	{
		field: "paid",
		headerName: "Paid",
		description: "This column show the order status",
		width: 150,
		renderCell: (params: GridRenderCellParams) => {
			return (
				params.row.paid
					? <Chip color="success" label="Paid" variant="outlined" />
					: <Chip color="error" label="Not Paid" variant="outlined" />
			);
		}
	},
	{
		field: "order",
		headerName: "Order",
		width: 200 ,
		sortable: false,
		renderCell: (params: GridRenderCellParams) => {
			return (
				<Link href={ `/orders/${ params.row.orderId }` } underline="always" color="secondary" component={ NextLink }>View Order</Link>
			);
		},
	},
];

interface HistoryPageProps {
	orders: InterfaceOrder[];
}

const HistoryPage = ({ orders }: HistoryPageProps) => {
	const rows: GridRowsProp = orders.map((order, index) => {
		return {
			id: index + 1,
			paid: order.isPaid,
			fullname: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName }`,
			orderId: order._id,
		};
	});
	
	return (
		<ShopLayout title="Orders Hidtory" pageDescription="Orders History Page">
			<Typography variant="h1" component="h1">Orders History</Typography>
			
			<Grid container className="fadeIn">
				<Grid item xs={ 12 } sx={{ height: 650, width: "100%" }}>
					<DataGrid
						columns={ columns }
						rows={ rows }
					/>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req });
	if (!session) {
		return { redirect: { destination: "/auth/login?page=/orders/history", permanent: false } };
	}
	
	// @ts-ignore
	const { _id: userId } = session.user;
	const orders = await databaseOrder.getOrderByUserId(userId);
	return {
		props: {
			orders,
		}
	};
};

export default HistoryPage;
