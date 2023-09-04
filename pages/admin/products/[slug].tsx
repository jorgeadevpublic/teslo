import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { useForm } from "react-hook-form";

import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from "@mui/icons-material";
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { AdminLayout } from "@/components/layouts";
import { InterfaceProduct, InterfaceSize, InterfaceValidGenders, InterfaceValidType } from "@/interfaces";
import { databaseProduct } from "@/database";
import { tesloApi } from "@/api";
import { ProductModel } from "@/models";


const validTypes: InterfaceValidType[] = ["shirts", "pants", "hoodies", "hats"];
const validGender: InterfaceValidGenders[] = ["men", "women", "kid", "unisex"];
const validSizes: InterfaceSize[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

interface FormData {
	_id?: string;
	description: string;
	images: string[];
	inStock: number;
	price: number;
	sizes: string[];
	slug: string;
	tags: string[];
	title: string;
	type: string;
	gender: string;
}

interface Props {
	product: InterfaceProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
	const [newTagValue, setNewTagValue] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
		watch
	} = useForm({
		defaultValues: product
	});
	
	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === "title") {
				const newSlug = value.title?.trim().replaceAll(" ", "_").replaceAll("'", "").toLowerCase() || "";
				setValue("slug", newSlug, { shouldValidate: true });
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, setValue]);
	
	const onNewTag = (tag: string) => {
		const newTag = tag.trim().toLowerCase();
		setNewTagValue("");
		const currentTags = getValues("tags");
		if (currentTags.includes(newTag)) {
			return;
		}
		// setValue("tags", [...currentTags, tag], { shouldValidate: true });
		currentTags.push(newTag);
	};
	
	const onDeleteTag = (tag: string) => {
		const currentTags = getValues("tags");
		setValue("tags", currentTags.filter(t => t !== tag), { shouldValidate: true });
	};
	
	const onFileSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
		if (!target.files || target.files.length === 0) {
			return;
		}
		try {
			for (let i = 0; i < target.files.length; i++) {
				const formData = new FormData();
				
				const file = target.files[i];
				formData.append("file", file);
				const { data } = await tesloApi.post<{ message: string }>("/admin/upload", formData);
				
				console.log({ data });
				setValue("images", [...getValues("images"), data.message], { shouldValidate: true });
			}
		} catch (error) {
			console.log({ error });
		}
	};
	
	const onSubmit = async (data: FormData) => {
		if (data.images.length < 2) {
			return alert("You need to upload at least 2 images");
		}
		setIsSaving(true);
		try {
			// if we have an id, we are updating, otherwise we are creating
			const resp = await tesloApi({
				url: "/admin/products",
				method: data._id ? "PUT" : "POST",
				data
			});
			if (!data._id) {
				await router.replace(`/admin/products/${ resp.data.slug }`);
			} else {
				setIsSaving(false);
			}
		} catch (error) {
			console.log({ error });
			setIsSaving(false);
		}
	};
	
	const onChangeSizes = (size: InterfaceSize) => {
		const currentSizes = getValues("sizes");
		if (currentSizes.includes(size)) {
			return setValue("sizes", currentSizes.filter(s => s !== size), { shouldValidate: true });
		}
		setValue("sizes", [...currentSizes, size], { shouldValidate: true });
	};
	
	const onDeleteImage = (img: string) => {
		const currentImages = getValues("images");
		setValue("images", currentImages.filter(i => i !== img), { shouldValidate: true });
	};
	
	return (
		<AdminLayout
			title={ "Product" }
			subTitle={ `Editing: ${ product.title }` }
			icon={ <DriveFileRenameOutline/> }
		>
			<form onSubmit={ handleSubmit(onSubmit) }>
				<Box display="flex" justifyContent="end" sx={ { mb: 1 } }>
					<Button
						color="secondary"
						startIcon={ <SaveOutlined/> }
						sx={ { width: "150px" } }
						type="submit"
						disabled={ isSaving }
					>
						Save
					</Button>
				</Box>
				
				<Grid container spacing={ 2 }>
					{/* Data */ }
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField
							label="Title"
							variant="filled"
							fullWidth
							sx={ { mb: 1 } }
							{ ...register("title", {
								required: "This field is required",
								minLength: { value: 2, message: "Minimum 2 characters" }
							}) }
							error={ !!errors.title }
							helperText={ errors.title?.message }
						/>
						
						<TextField
							label="Description"
							variant="filled"
							fullWidth
							multiline
							sx={ { mb: 1 } }
							{ ...register("description", {
								required: "This field is required",
								minLength: { value: 2, message: "Minimum 2 characters" }
							}) }
							error={ !!errors.description }
							helperText={ errors.description?.message }
						/>
						
						<TextField
							label="Stock"
							type="number"
							variant="filled"
							fullWidth
							sx={ { mb: 1 } }
							{ ...register("inStock", {
								required: "This field is required",
								min: { value: 0, message: "Minimum value: 0" }
							}) }
							error={ !!errors.inStock }
							helperText={ errors.inStock?.message }
						/>
						
						<TextField
							label="Price"
							type="number"
							variant="filled"
							fullWidth
							sx={ { mb: 1 } }
							{ ...register("price", {
								required: "This field is required",
								min: { value: 0, message: "Minimum value: 0" }
							}) }
							error={ !!errors.price }
							helperText={ errors.price?.message }
						/>
						
						<Divider sx={ { my: 1 } }/>
						
						<FormControl sx={ { mb: 1 } }>
							<FormLabel>Type</FormLabel>
							<RadioGroup
								row
								value={ getValues("type") }
								onChange={ ({ target }) => setValue("type", target.value as InterfaceValidType, { shouldValidate: true }) }
							>
								{
									validTypes.map(option => (
										<FormControlLabel
											key={ option }
											value={ option }
											control={ <Radio color="secondary"/> }
											label={ capitalize(option) }
										/>
									))
								}
							</RadioGroup>
						</FormControl>
						
						<FormControl sx={ { mb: 1 } }>
							<FormLabel>Gender</FormLabel>
							<RadioGroup
								row
								value={ getValues("gender") }
								onChange={ ({ target }) => setValue("gender", target.value as InterfaceValidGenders, { shouldValidate: true }) }
							>
								{
									validGender.map(option => (
										<FormControlLabel
											key={ option }
											value={ option }
											control={ <Radio color="secondary"/> }
											label={ capitalize(option) }
										/>
									))
								}
							</RadioGroup>
						</FormControl>
						
						<FormGroup>
							<FormLabel>Sizes</FormLabel>
							{
								validSizes.map(size => (
									<FormControlLabel
										key={ size }
										control={ <Checkbox checked={ getValues("sizes").includes(size) }/> }
										label={ size }
										onChange={ () => onChangeSizes(size) }
									/>
								))
							}
						</FormGroup>
					</Grid>
					
					{/* Tags and images */ }
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField
							label="Slug - URL"
							variant="filled"
							fullWidth
							sx={ { mb: 1 } }
							{ ...register("slug", {
								required: "This field is required",
								validate: (value: string) => value.trim().includes(" ") ? "No spaces allowed" : true
							}) }
							error={ !!errors.slug }
							helperText={ errors.slug?.message }
						/>
						
						<TextField
							label="Tags"
							variant="filled"
							fullWidth
							sx={ { mb: 1 } }
							helperText="Press [spacebar] to add a tag."
							value={ newTagValue }
							onChange={ ({ target }) => setNewTagValue(target.value) }
							onKeyUp={ ({ code }) => {
								code === "Space" ? onNewTag(newTagValue) : undefined;
							} }
						/>
						
						<Box sx={ {
							display: "flex",
							flexWrap: "wrap",
							listStyle: "none",
							p: 0,
							m: 0,
						} }
						     component="ul">
							{
								getValues("tags").map((tag) => {
									return (
										<Chip
											key={ tag }
											label={ tag }
											onDelete={ () => onDeleteTag(tag) }
											color="primary"
											size="small"
											sx={ { ml: 1, mt: 1 } }
										/>
									);
								}) }
						</Box>
						
						<Divider sx={ { my: 2 } }/>
						
						<Box display="flex" flexDirection="column">
							<FormLabel sx={ { mb: 1 } }>Images</FormLabel>
							<Button
								color="secondary"
								fullWidth
								startIcon={ <UploadOutlined/> }
								sx={ { mb: 3 } }
								onClick={ () => fileInputRef.current?.click() }
							>
								Upload images
							</Button>
							<input
								ref={ fileInputRef }
								type="file"
								multiple={ true }
								accept="image/*"
								style={ { display: "none" } }
								onChange={ onFileSelected }
							/>
							
							<Chip
								label="Almost 2 images are required!"
								color="error"
								variant="outlined"
								sx={ { mb: 3, display: getValues("images").length > 2 ? "none" : "flex" } }
							/>
							
							<Grid container spacing={ 2 }>
								{
									getValues("images").map(img => (
										<Grid item xs={ 4 } sm={ 3 } key={ img }>
											<Card>
												<CardMedia
													component="img"
													className="fadeIn"
													image={ img }
													alt={ img }
												/>
												<CardActions>
													<Button
														fullWidth
														color="error"
														onClick={ () => onDeleteImage(img) }
													>
														Delete
													</Button>
												</CardActions>
											</Card>
										</Grid>
									))
								}
							</Grid>
						
						</Box>
					
					</Grid>
				
				</Grid>
			</form>
		</AdminLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	
	const { slug = "" } = query;
	
	let product: InterfaceProduct | null;
	
	if (slug === "new") {
		const tempProduct: InterfaceProduct = JSON.parse(JSON.stringify(new ProductModel()));
		// TODO: Solve this
		// @ts-ignore
		delete tempProduct._id;
		tempProduct.images = ["img1.jpg", "img2.jpg"];
		product = tempProduct;
	} else {
		product = await databaseProduct.getProductBySlug(slug.toString());
	}
	
	if (!product) {
		return {
			redirect: {
				destination: "/admin/products",
				permanent: false,
			}
		};
	}
	
	
	return {
		props: {
			product
		}
	};
};

export default ProductAdminPage;