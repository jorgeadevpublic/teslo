import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { RemoveCircleOutline } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface ItemsCounterProps {
	itemsInStock: number;
	quantity: number;
	setQuantity: (quantity: number) => void;
}

export const ItemsCounter = ({ itemsInStock, quantity, setQuantity }: ItemsCounterProps) => {
	return (
		<Box display="flex" alignItems="center">
			<IconButton
				disabled={ quantity <= 1 }
				onClick={ () => setQuantity(quantity - 1) }
			>
				<RemoveCircleOutline />
			</IconButton>
			
			<Typography sx={{ width: 40, textAlign: "center" }}>{ quantity }</Typography>
			
			<IconButton
				disabled={ quantity >= itemsInStock }
				onClick={ () => setQuantity(quantity + 1) }
			>
				<AddCircleOutlineIcon />
			</IconButton>
		</Box>
	);
};