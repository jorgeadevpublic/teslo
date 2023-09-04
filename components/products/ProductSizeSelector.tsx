import React from "react";
import { InterfaceSize } from "@/interfaces";
import { Box, Button } from "@mui/material";

interface ProductSizeSelectorProps {
	selectedSize?: InterfaceSize;
	sizes: InterfaceSize[];
	onSelectedSize: (size: InterfaceSize) => void;
}

export const ProductSizeSelector = ({ selectedSize, sizes, onSelectedSize }: ProductSizeSelectorProps) => {
	return (
		<Box>
			{ sizes.map((size) => (
				<Button
					onClick={ () => onSelectedSize(size) }
					key={ size }
					size="small"
					color={ selectedSize === size ? "primary" : "info" }
				>
					{ size }
				</Button>
			))}
		</Box>
	);
};