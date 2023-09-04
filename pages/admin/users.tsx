import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts";
import { PeopleOutline } from "@mui/icons-material";
import { Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useSWR from "swr";
import { InterfaceUser } from "@/interfaces";
import { tesloApi } from "@/api";

const UserPage = () => {
	const { data, error } = useSWR<InterfaceUser[]>("/api/admin/users");
	const [users, setUsers] = useState<InterfaceUser[]>([]);
	
	useEffect(() => {
		if (data) {
			setUsers(data);
		}
	}, [data]);
	
	
	if (!data && !error) return <></>;
	
	const onRoleUpdated = async (userId: string, newRole: string) => {
		const previousUser = users.map(user => ({ ...user }));
		const updatedUsers = users.map(user => ({
			...user,
			role: user._id === userId ? newRole : user.role,
		}));
		console.log({ updatedUsers });
		setUsers(updatedUsers);
		
		try {
			await tesloApi.put("/admin/users", { userId, role: newRole });
		} catch (e) {
			setUsers(previousUser);
			console.log(e);
			alert("Error updating user role");
		}
	};
	
	const columns: GridColDef[] = [
		{ field: "email", headerName: "Email", width: 250 },
		{ field: "name", headerName: "Full Name", width: 300 },
		{
			field: "role",
			headerName: "Role",
			width: 300 ,
			renderCell: ({ row }) => {
				return (
					<Select
						value={ row.role }
						label="Role"
						onChange={ ({ target }) => onRoleUpdated(row.id, target.value) }
						sx={{ width: "300px" }}
					>
						<MenuItem value="super-admin">Super Admin</MenuItem>
						<MenuItem value="admin">Admin</MenuItem>
						<MenuItem value="client">Client</MenuItem>
						<MenuItem value="seo">SEO</MenuItem>
					</Select>
				);
			}
		},
	];
	
	const rows = users.map(user => ({
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role,
	}));
	
	return (
		<AdminLayout
			title="Users"
			subTitle="Manage system users"
			icon={ <PeopleOutline fontSize="large" /> }
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

export default UserPage;
