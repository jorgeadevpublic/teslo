import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "@/themes";
import { SWRConfig } from "swr";
import { AuthProvider, CartProvider, UiProvider } from "@/context";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={ pageProps.session }>
			{/* @ts-ignore */}
			<PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
				<SWRConfig
					value={ {
						// refreshInterval: 3000,
						fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
					} }
				>
					<AuthProvider>
						<CartProvider>
							<UiProvider>
								<ThemeProvider theme={ lightTheme }>
									<CssBaseline/>
									<Component { ...pageProps } />
								</ThemeProvider>
							</UiProvider>
						</CartProvider>
					</AuthProvider>
				</SWRConfig>
			</PayPalScriptProvider>
		</SessionProvider>
	);
}
