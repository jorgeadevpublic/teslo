import React from "react";
import { AdminLayout } from "@/components/layouts";
import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useSWR from "swr";
import { InterfaceProduct } from "@/interfaces";
import NextLink from "next/link";

const columns: GridColDef[] = [
	{
		field: "img",
		headerName: "Image",
		renderCell: ({ row }) => {
			return (
				<a href={ `/product/${ row.slug }` } target="_blank" rel="noreferrer">
					<CardMedia
						component="img"
						className="fadeIn"
						alt={ row.title }
						image={ row.img }
					/>
				</a>
			);
		},
	},
	{
		field: "title",
		headerName: "Title",
		width: 250,
		renderCell: ({ row }) => {
			return (
				<Link href={ `/admin/products/${ row.slug }` } component={ NextLink } underline="always">
					{ row.title }
				</Link>
			);
		}
	},
	{ field: "gender", headerName: "Gender" },
	{ field: "type", headerName: "Type" },
	{ field: "inStock", headerName: "Stock" },
	{ field: "price", headerName: "Price" },
	{ field: "sizes", headerName: "Sizes", width: 250 },
];

const ProductPage = () => {
	const { data, error } = useSWR<InterfaceProduct[]>("/api/admin/products");
	
	if (!error && !data) {
		return <></>;
	}
	
	if (error) {
		console.log(error);
		return <Typography>Error trying to load info!</Typography>;
	}
	
	const rows = data!.map(product => ({
		id: product._id,
		img: product.images[0],
		title: product.title,
		gender: product.gender,
		type: product.type,
		inStock: product.inStock,
		price: product.price,
		sizes: product.sizes.join(", "),
		slug: product.slug,
	}));
	
	return (
		<AdminLayout
			title={ `Products (${ data?.length })` }
			subTitle="Products Mantenaince"
			icon={ <CategoryOutlined /> }
		>
			<Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
				<Button
					startIcon={ <AddOutlined /> }
					color="secondary"
					href="/admin/products/new"
					sx={{ padding: "8px 15px" }}
				>
					Create New Product
				</Button>
			</Box>
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

export default ProductPage;
