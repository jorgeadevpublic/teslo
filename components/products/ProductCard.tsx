import React, { useMemo, useState } from "react";
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from "@mui/material";
import { InterfaceProduct } from "@/interfaces";
import NextLink from "next/link";

interface ProductCardProps {
	product: InterfaceProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	
	const productImage = useMemo(() => {
		return isHovered ? product.images[1] : product.images[0];
	}, [isHovered, product.images]);
	
	return (
		<Grid
			item
			xs={ 6 }
			sm={ 4 }
			onMouseEnter={ () => setIsHovered(true) }
			onMouseLeave={ () => setIsHovered(false) }
		>
			<Card>
				<Link href={ `/product/${ product.slug }` } component={ NextLink } passHref prefetch={ false }>
					<CardActionArea>
						{
							!product.inStock && (
								<Chip
									color="primary"
									label="There are no items in Stock"
									sx={{ position: "absolute", zIndex: 99, top: "10px", left: "10px" }}
								/>
							)
						}
						
						
						<CardMedia
							component="img"
							className="fadeIn"
							image={ productImage }
							alt={ product.title }
							onLoad={ () => setIsImageLoaded(true) }
						/>
					</CardActionArea>
				</Link>
			</Card>
			<Box sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }} className="fadeIn">
				<Typography fontWeight={ 700 }>{ product.title }</Typography>
				<Typography fontWeight={ 500 }>{ `$ ${ product.price }` }</Typography>
			</Box>
			
		</Grid>
	);
};