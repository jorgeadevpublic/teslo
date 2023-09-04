import React from "react";
import { AdminLayout } from "@/components/layouts";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useSWR from "swr";
import { InterfaceOrder, InterfaceUser } from "@/interfaces";

const columns: GridColDef[] = [
	{ field: "id", headerName: "Order ID", width: 250 },
	{ field: "email", headerName: "Email", width: 250 },
	{ field: "name", headerName: "Full Name", width: 200 },
	{ field: "total", headerName: "Total Amount", width: 100 },
	{
		field: "isPaid",
		headerName: "Paid",
		renderCell: ({ row }) => {
			return row.isPaid
				? ( <Chip label="Paid" color="success" variant="outlined" /> )
				: ( <Chip label="Pending" color="error" variant="outlined" /> );
		},
	},
	{ field: "noProducts", headerName: "In Stock", align: "center", width: 150 },
	{
		field: "check",
		headerName: "See Order",
		renderCell: ({ row }) => {
			return (
				<a href={ `/admin/orders/${ row.id }` } target="_blank" rel="noreferrer">
					See Order
				</a>
			);
		},
	},
	{ field: "createdAt", headerName: "Created In", width: 200 },
];

const OrdersPage = () => {
	const { data, error } = useSWR<InterfaceOrder[]>("/api/admin/orders");
	
	if (!error && !data) {
		return <></>;
	}
	
	if (error) {
		console.log(error);
		return <Typography>Error trying to load info!</Typography>;
	}
	
	const rows = data!.map(order => ({
		id: order._id,
		email: (order.user as InterfaceUser).email,
		name: (order.user as InterfaceUser).name,
		total: order.total,
		isPaid: order.isPaid,
		noProducts: order.numberOfItems,
		createdAt: order.createdAt,
	}));
	
	return (
		<AdminLayout
			title="Orders"
			subTitle="Order Mantenaince"
			icon={ <ConfirmationNumberOutlined /> }
		>
			<Grid container className="fadeIn">
				<Grid item xs={ 12 } sx={{ height: 650, width: "100%" }}>
					<DataGrid
						columns={ columns }
						rows={ rows }
					/>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export default OrdersPage;
