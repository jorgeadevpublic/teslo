import { AdminLayout } from "@/components/layouts";
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import SummaryTile from "@/components/admin/SummaryTile";
import useSWR from "swr";
import { DashboardSummaryResponse } from "@/interfaces";
import { useEffect, useState } from "react";

export const DashboardPage = () => {
	const { data, error } = useSWR<DashboardSummaryResponse>("/api/admin/dashboard", {
		refreshInterval: 1000 * 30,
	});
	
	const [refreshInterval, setRefreshInterval] = useState(30);
	
	useEffect(() => {
		const interval = setInterval(() => {
			// console.log("Tick");
			setRefreshInterval((prev) => prev > 0 ? prev - 1 : 30);
		}, 1000);
		return () => clearInterval(interval);
	}, []);
	
	if (!error && !data) {
		return <></>;
	}
	
	if (error) {
		console.log(error);
		return <Typography>Error trying to load info!</Typography>;
	}
	
	const {
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory,
	} = data!;
	
	return (
		<AdminLayout
			title="Dashboard"
			subTitle="Dashboard"
			icon={ <DashboardOutlined /> }
		>
			<Grid container spacing={ 2 }>
				<SummaryTile
					title={ numberOfOrders }
					subTitle="Total Orders"
					icon={ <CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} /> }
				/>
				
				<SummaryTile
					title={ paidOrders }
					subTitle="Payed Orders"
					icon={ <AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} /> }
				/>
				
				<SummaryTile
					title={ notPaidOrders }
					subTitle="Not Payed Orders"
					icon={ <CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} /> }
				/>
				
				<SummaryTile
					title={ numberOfClients }
					subTitle="Clients"
					icon={ <GroupOutlined color="primary" sx={{ fontSize: 40 }} /> }
				/>
				
				<SummaryTile
					title={ numberOfProducts }
					subTitle="Products"
					icon={ <CategoryOutlined color="warning" sx={{ fontSize: 40 }} /> }
				/>
				
				<SummaryTile
					title={ productsWithNoInventory }
					subTitle="Non Stock"
					icon={ <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} /> }
				/>
				
				<SummaryTile
					title={ lowInventory }
					subTitle="Low Stock"
					icon={ <ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} /> }
				/>
				
				<SummaryTile
					title={ refreshInterval }
					subTitle="Next Update in"
					icon={ <AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} /> }
				/>
			</Grid>
		</AdminLayout>
	);
};

export default DashboardPage;