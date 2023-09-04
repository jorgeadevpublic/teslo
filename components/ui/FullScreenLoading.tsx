import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export const FullScreenLoading = () => {
	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			height="calc(100vh - 200px)"
		>
			<CircularProgress thickness={ 2 } />
			<Typography sx={{ mt: 3 }} typography="h5">Loading ...</Typography>
		</Box>
	);
};