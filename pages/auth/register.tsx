import { useContext, useState } from "react";
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import { AuthLayout } from "@/components/layouts";
import { useForm } from "react-hook-form";
import { validations } from "@/utils";
import { ErrorOutline } from "@mui/icons-material";
import { useRouter } from "next/router";
import { AuthContext } from "@/context";
import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";

interface FormData {
	name: string,
	email: string,
	password: string,
	repeatPassword: string,
}

const RegisterPage = () => {
	const router = useRouter();
	const { registerUser } = useContext(AuthContext);
	const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const onRegisterForm = async ({ name, email, password, repeatPassword }: FormData) => {
		setShowError(false);
		const { hasError, message } = await registerUser(name,email, password, repeatPassword);
		
		if (hasError) {
			setShowError(true);
			setErrorMessage(message!);
			setTimeout(() => setShowError(false), 3000);
			return;
		}
		
		// const destination = router.query.page?.toString() || "/";
		// router.replace(destination);
		await signIn("credentials", { email, password });
	};
	
	return (
		<AuthLayout title="Register Page">
			<form onSubmit={ handleSubmit(onRegisterForm) } noValidate>
				<Box sx={ { width: 350, padding: "10px 20px" } }>
					<Grid container spacing={ 3 }>
						<Grid item xs={ 12 }>
							<Typography variant="h1" component="h1" sx={ { display: "flex", justifyContent: "center" } }>Register</Typography>
							<Chip
								label="Error to trying to create user"
								color="error"
								icon={ <ErrorOutline/> }
								className="fadeIn"
								sx={ { marginTop: 2, display: showError ? "flex" : "none", justifyContent: "center" } }
							/>
						</Grid>
						
						<Grid item xs={ 12 }>
							<TextField
								label="Name"
								variant="filled"
								fullWidth
								{
									...register("name", {
										required: "Name field is required",
										minLength: { value: 3, message: "Password name be at least 3 characters" },
									})
								}
								error={ !!errors.name }
								helperText={ errors.name?.message }
							/>
						</Grid>
						
						<Grid item xs={ 12 }>
							<TextField
								type="email"
								label="Email"
								variant="filled"
								fullWidth
								{
									...register("email", {
										required: "Email field is required",
										validate: validations.isEmail,
									})
								}
								error={ !!errors.email }
								helperText={ errors.email?.message }
							/>
						</Grid>
						
						<Grid item xs={ 12 }>
							<TextField
								type="password"
								label="Password"
								variant="filled"
								fullWidth
								{
									...register("password", {
										required: "Password field is required",
										minLength: { value: 6, message: "Password must be at least 6 characters" },
									})
								}
								error={ !!errors.password }
								helperText={ errors.password?.message }
							/>
						</Grid>
						
						<Grid item xs={ 12 }>
							<TextField
								type="password"
								label="Repeat Password"
								variant="filled"
								fullWidth
								{
									...register("repeatPassword", {
										required: "RepeatPassword field is required",
										minLength: { value: 6, message: "Password must be at least 6 characters" },
									})
								}
								error={ !!errors.repeatPassword }
								helperText={ errors.repeatPassword?.message }
							/>
						</Grid>
						
						<Grid item xs={ 12 }>
							<Button
								color="secondary"
								className="circular-btn"
								size="large"
								fullWidth
								type="submit"
								disabled={ showError }
							>
								Register
							</Button>
						</Grid>
						
						<Grid item xs={ 12 } display="flex" justifyContent="end">
							<Link
								href={  router.query.page ? `/auth/login?page=${ router.query.page }` : "/auth/login" }
								underline="none"
								color="secondary"
								component={ NextLink }
							>
								I already have an account?
							</Link>
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	);
};

// Implement getServerSideProps
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const session = await getSession({ req });
	const { page = "/" } = query;
	
	if (session) {
		return {
			redirect: {
				destination: page.toString(),
				permanent: false,
			},
		};
	}
	
	return {
		props: {},
	};
};

export default RegisterPage;
