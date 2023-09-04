import React from "react";
import { Slide } from "react-slideshow-image";

interface ProductSlideShowProps {
	images: string[];
}

const containerStyles = {
	display: "flex",
	justifyContent: "center",
};

const imageStyles = {
	backgroundSize: "cover",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	width: "100%",
	height: "650px",
};

export const ProductSlideShow = ({ images }: ProductSlideShowProps) => {
	return (
		<Slide easing="ease" duration={ 7000 } indicators>
			{
				images.map((image, index) => {
					return (
						<div style={ containerStyles } key={ index }>
							<div style={ { ...imageStyles, backgroundImage: `url(${ image })` } }>
							</div>
						</div>
					);
				})
			}
		</Slide>
	);
};