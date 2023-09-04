import { useState, useContext } from "react";
import { ShopLayout } from "@/components/layouts";
import { Box, Button, FormControl, FormHelperText, Grid, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { countries, jwt } from "@/utils";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { CartContext } from "@/context";

type FormData = {
	firstName: string,
	lastName: string,
	address: string,
	address2?: string,
	zip: string,
	city: string,
	country: string,
	phone: string
}

const getAddressFromCookie = () : FormData=> {
	return {
		firstName: Cookies.get("firstName") || "",
		lastName: Cookies.get("lastName") || "",
		address: Cookies.get("address") || "",
		address2: Cookies.get("address2") || "",
		zip: Cookies.get("zip") || "",
		city: Cookies.get("city") || "",
		country: Cookies.get("country") || "",
		phone: Cookies.get("phone") || "",
	};
};

const AddressPage = () => {
	const { register, handleSubmit, watch, formState: { errors } } = useForm({
		defaultValues: getAddressFromCookie(),
	});
	const { updateAddress } = useContext(CartContext);
	const [countrySelected, setCountrySelected] = useState<string>("");
	const router = useRouter();

	const onSubmitAddress = (data: FormData) => {
		updateAddress(data);
		router.push("/checkout/summary");
	};

	return (
		<ShopLayout title="Address" pageDescription="Confirm address">
			<form onSubmit={ handleSubmit(onSubmitAddress) } noValidate>
				<Typography variant="h1" component="h1">Address</Typography>
				<Grid container spacing={ 2 } sx={{ mt: 2 }}>
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="First Name" 
							variant="filled" 
							fullWidth
							{ ...register("firstName", { required: "First Name field is required" }) }
							error={ !!errors.firstName }
							helperText={ <>{ errors.firstName?.message }</> }
						/>
					</Grid>

					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Last Name" 
							variant="filled" 
							fullWidth 
							{ ...register("lastName", { required: "Last Name field is required" }) }
							error={ !!errors.lastName }
							helperText={ <>{ errors.lastName?.message }</> }
						/>
					</Grid>
					
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Address" 
							variant="filled" 
							fullWidth 
							{ ...register("address", { required: "Address field is required" }) }
							error={ !!errors.address }
							helperText={ <>{ errors.address?.message }</> }
						/>
					</Grid>

					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Address 2 (optional)" 
							variant="filled" 
							fullWidth 
							{ ...register("address2") }
						/>
					</Grid>
					
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Zip Code" 
							variant="filled" 
							fullWidth 
							{ ...register("zip", { required: "Zip Code field is required" }) }
							error={ !!errors.zip }
							helperText={ <>{ errors.zip?.message }</> }
						/>
					</Grid>

					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="City" 
							variant="filled" 
							fullWidth 
							{ ...register("city", { required: "City field is required" }) }
							error={ !!errors.city }
							helperText={ <>{ errors.city?.message }</> }
						/>
					</Grid>
					
					<Grid item xs={ 12 } sm={ 6 }>
						<FormControl 
							fullWidth 
							variant="filled"
							error={ !!errors.country }
						>
							<InputLabel>Select Country</InputLabel>
							<Select
								variant="filled"
								label="Country"
								value={ countrySelected || "" }
								{ ...register("country", { required: "Country field is required" }) }
							>
								{
									countries.map(country => (
										<MenuItem 
											key={ country.code }
											value={ country.code }
											onClick={ () => setCountrySelected(country.code) }
										>
											{ country.name }
										</MenuItem>
									))
								}
							</Select>
							<FormHelperText>{ errors.country?.message }</FormHelperText>
						</FormControl>
					</Grid>

					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Phone" 
							variant="filled" 
							fullWidth 
							{ ...register("phone", { required: "Phone field is required" }) }
							error={ !!errors.phone }
							helperText={ <>{ errors.phone?.message }</> }
						/>
					</Grid>
					
					<Box sx={{ mt: 5, width: "100%" }} display="flex" justifyContent="center">
						<Button 
							color="secondary" 
							className="circular-btn" 
							size="large"
							type="submit"
						>
							Review Order
						</Button>
					</Box>
				</Grid>
			</form>
		</ShopLayout>
	);
};

/* export const getServerSideProps: GetServerSideProps = async ({ req }) => {

	const { token = "" } = req.cookies;
	let isValidToken = false;

	try {
		await jwt.isValidToken(token);
		isValidToken = true;
	} catch (error) {
		isValidToken = false;
	}

	if (!isValidToken) {
		return {
			redirect: {
				destination: "/auth/login?page=/checkout/address",
				permanent: false
			}
		};
	}

	return {
		props: {}
	};
}; */

export default AddressPage;
