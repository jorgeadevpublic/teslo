import { useContext, useEffect, useState } from "react";
import { AuthLayout } from "@/components/layouts";
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { validations } from "@/utils";
import { ErrorOutline } from "@mui/icons-material";
import { AuthContext } from "@/context";
import { useRouter } from "next/router";
import { getProviders, getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";

type FormData = {
	email: string,
	password: string,
};

const LoginPage = () => {
	const router = useRouter();
	const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
	const [showError, setShowError] = useState(false);
	const [providers, setProviders] = useState<any>({});
	const { loginUser } = useContext(AuthContext);
	
	useEffect(() => {
		getProviders().then((provider) => {
			// console.log(providers);
			setProviders(provider);
		});
	}, [providers]);
	
	const onLoginUser = async ({ email, password }: FormData) => {
		setShowError(false);
		/*const isValidLogin = await loginUser(email, password);
		
		if (!isValidLogin) {
			setShowError(true);
			setTimeout(() => setShowError(false), 3000);
			return;
		}
		
		const destination = router.query.page?.toString() || "/";
		router.replace(destination);*/
		await signIn("credentials", { email, password });
	};
	
	return (
		<AuthLayout title="Login Page">
			<form onSubmit={ handleSubmit(onLoginUser) } noValidate>
				<Box sx={ { width: 350, padding: "10px 20px" } }>
					<Grid container spacing={ 3 }>
						<Grid item xs={ 12 }>
							<Typography variant="h1" component="h1" sx={ { display: "flex", justifyContent: "center" } }>Login</Typography>
							<Chip
								label="Not found user with your credentials"
								color="error"
								icon={ <ErrorOutline/> }
								className="fadeIn"
								sx={ { marginTop: 2, display: showError ? "flex" : "none", justifyContent: "center" } }
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
										required: "Email is required",
										validate: validations.isEmail,
									})
								}
								error={ !!errors.email }
								helperText={ errors.email?.message }
							/>
						</Grid>
						
						<Grid item xs={ 12 }>
							<TextField
								label="Password"
								variant="filled"
								fullWidth
								{
									...register("password", {
										required: "Password is required",
										minLength: { value: 6, message: "Password must be at least 6 characters" },
									})
								}
								error={ !!errors.password }
								helperText={ errors.password?.message }
							/>
						</Grid>
						
						<Grid item xs={ 12 }>
							<Button
								type="submit"
								color="secondary"
								className="circular-btn"
								size="large"
								fullWidth
								disabled={ showError }
							>
								Login
							</Button>
						</Grid>
						
						<Grid item xs={ 12 } display="flex" justifyContent="end">
							<Link
								href={ router.query.page ? `/auth/register?page=${ router.query.page }` : "/auth/register" }
								underline="none"
								color="secondary"
								component={ NextLink }
							>
								You do not have an account?
							</Link>
						</Grid>
						
						<Grid item xs={ 12 } display="flex" justifyContent="end" flexDirection="column">
							<Divider sx={ { width: "100%", mb: 2 } }/>
							{
								Object.values(providers).map((provider: any) => {
									if (provider.id === "credentials") return;
									
									console.log("providerrrrr ", { provider });
									
									return (
										<Button
											key={ provider.name }
											variant="outlined"
											fullWidth
											color="primary"
											sx={ { mb: 1 } }
											onClick={ () => signIn(provider.id) }
										>
											Login with { provider.name }
										</Button>
									);
								})
							}
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

export default LoginPage;
